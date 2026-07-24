"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import {
  AdditiveBlending,
  MathUtils,
  Plane,
  Vector3,
  QuadraticBezierCurve3,
  type BufferAttribute,
  type LineBasicMaterial,
  type MeshStandardMaterial,
  type Points,
} from "three";
import { GlowOrb } from "@/components/three/glow-orb";
import { ParticleField } from "@/components/three/particle-field";
import { CAMERA, HERO_SCENE, NODE_EDGES, NODE_POSITIONS } from "@/constants/three";

interface HeroSceneProps {
  animate: boolean;
  scrollProgress: RefObject<number>;
}

const CAMERA_VERTICAL_FOV_RAD = (CAMERA.fov * Math.PI) / 180;

const NODE_BASE_INTENSITY = 1.6;
const NODE_HOVER_BOOST = 1.0;
const NODE_HOVER_RADIUS = 1.1;

function CameraRig({ animate }: { animate: boolean }) {
  const { camera } = useThree();
  const parallax = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    // Keep the full width of the scene in frame regardless of the canvas's
    // aspect ratio (the panel goes from a near-square 4:3 on mobile to a wide
    // 21:9 on desktop), by pushing the camera back on narrower aspects.
    const aspect = state.size.width / state.size.height;
    const requiredDistance =
      CAMERA.sceneHalfWidth / (Math.tan(CAMERA_VERTICAL_FOV_RAD / 2) * aspect);
    camera.position.z = Math.max(requiredDistance, CAMERA.minDistance);

    if (animate) {
      const t = state.clock.elapsedTime;
      const driftX = Math.sin(t * 0.15) * 0.35;
      const driftY = 0.4 + Math.cos(t * 0.12) * 0.18;

      // Subtle mouse parallax, heavily damped so it reads as "premium drift"
      // rather than a snappy 1:1 follow.
      const targetParallaxX = state.pointer.x * 0.35;
      const targetParallaxY = state.pointer.y * 0.2;
      parallax.current.x = MathUtils.lerp(parallax.current.x, targetParallaxX, 0.04);
      parallax.current.y = MathUtils.lerp(parallax.current.y, targetParallaxY, 0.04);

      camera.position.x = driftX + parallax.current.x;
      camera.position.y = driftY + parallax.current.y;
    } else {
      camera.position.x = 0;
      camera.position.y = 0.4;
    }
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function NodeNetwork({
  animate,
  scrollProgress,
}: {
  animate: boolean;
  scrollProgress: RefObject<number>;
}) {
  const lineMaterialRef = useRef<LineBasicMaterial>(null);
  const nodeMaterialRefs = useRef<Array<MeshStandardMaterial | null>>([]);
  const plane = useMemo(() => new Plane(new Vector3(0, 0, 1), 0), []);
  const intersection = useMemo(() => new Vector3(), []);
  const worldPositions = useMemo(
    () =>
      NODE_POSITIONS.map(
        ([x, y, z]) =>
          new Vector3(
            x + HERO_SCENE.nodes.center[0],
            y + HERO_SCENE.nodes.center[1],
            z + HERO_SCENE.nodes.center[2],
          ),
      ),
    [],
  );

  const linePositions = useMemo(() => {
    const array = new Float32Array(NODE_EDGES.length * 2 * 3);
    NODE_EDGES.forEach(([a, b], i) => {
      array.set(NODE_POSITIONS[a], i * 6);
      array.set(NODE_POSITIONS[b], i * 6 + 3);
    });
    return array;
  }, []);

  useFrame((state) => {
    const progress = scrollProgress.current;
    const t = state.clock.elapsedTime;

    if (lineMaterialRef.current) {
      const pulse = animate ? Math.sin(t * 1.1) * 0.12 : 0;
      const target = 0.3 + progress * 0.45 + pulse;
      lineMaterialRef.current.opacity = MathUtils.clamp(target, 0.15, 0.9);
    }

    if (animate) {
      state.raycaster.setFromCamera(state.pointer, state.camera);
      state.raycaster.ray.intersectPlane(plane, intersection);
    }

    worldPositions.forEach((worldPos, i) => {
      const material = nodeMaterialRefs.current[i];
      if (!material) return;
      const proximity = animate
        ? Math.max(0, 1 - worldPos.distanceTo(intersection) / NODE_HOVER_RADIUS)
        : 0;
      const target = NODE_BASE_INTENSITY + progress * 0.6 + proximity * NODE_HOVER_BOOST;
      material.emissiveIntensity = MathUtils.lerp(material.emissiveIntensity, target, 0.12);
    });
  });

  return (
    <group position={HERO_SCENE.nodes.center}>
      {NODE_POSITIONS.map((pos, i) => (
        <GlowOrb
          key={i}
          position={pos}
          color={HERO_SCENE.nodes.color}
          radius={0.08}
          intensity={NODE_BASE_INTENSITY}
          haloScale={2.2}
          materialRef={(node) => {
            nodeMaterialRefs.current[i] = node;
          }}
        />
      ))}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={lineMaterialRef}
          color={HERO_SCENE.nodes.color}
          transparent
          opacity={0.4}
        />
      </lineSegments>
    </group>
  );
}

function DataFlow({ animate }: { animate: boolean }) {
  const pointsRef = useRef<Points>(null);
  const count = HERO_SCENE.flow.count;

  const curve = useMemo(
    () =>
      new QuadraticBezierCurve3(
        new Vector3(...HERO_SCENE.rawData.center),
        new Vector3(...HERO_SCENE.nodes.center),
        new Vector3(...HERO_SCENE.insight.position),
      ),
    [],
  );
  const phases = useMemo(() => Array.from({ length: count }, (_, i) => i / count), [count]);
  const positions = useMemo(() => new Float32Array(count * 3), [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const tt = animate ? (phases[i] + t * HERO_SCENE.flow.speed) % 1 : phases[i];
      const point = curve.getPoint(tt);
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
    }
    const attribute = pointsRef.current.geometry.attributes.position as BufferAttribute;
    attribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={HERO_SCENE.flow.color}
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

export function HeroScene({ animate, scrollProgress }: HeroSceneProps) {
  const insightMaterialRef = useRef<MeshStandardMaterial>(null);

  useFrame(() => {
    if (!insightMaterialRef.current) return;
    const target = 2.4 + scrollProgress.current * 0.8;
    insightMaterialRef.current.emissiveIntensity = MathUtils.lerp(
      insightMaterialRef.current.emissiveIntensity,
      target,
      0.08,
    );
  });

  return (
    <>
      <CameraRig animate={animate} />
      <ambientLight
        intensity={HERO_SCENE.ambientLight.intensity}
        color={HERO_SCENE.ambientLight.color}
      />
      <pointLight
        position={[4.6, 1.6, 3]}
        intensity={35}
        color={HERO_SCENE.insight.color}
        distance={12}
        decay={2}
      />
      <pointLight
        position={[-4.5, 2, 2]}
        intensity={10}
        color={HERO_SCENE.rawData.color}
        distance={10}
        decay={2}
      />
      <fogExp2 attach="fog" args={[HERO_SCENE.fog.color, HERO_SCENE.fog.density]} />

      <ParticleField
        count={HERO_SCENE.rawData.count}
        spread={HERO_SCENE.rawData.spread}
        center={HERO_SCENE.rawData.center}
        color={HERO_SCENE.rawData.color}
        animate={animate}
        organizeProgress={scrollProgress}
      />
      <NodeNetwork animate={animate} scrollProgress={scrollProgress} />
      <DataFlow animate={animate} />
      <GlowOrb
        position={HERO_SCENE.insight.position}
        color={HERO_SCENE.insight.color}
        radius={0.22}
        intensity={2.4}
        haloScale={2.6}
        materialRef={insightMaterialRef}
      />
    </>
  );
}
