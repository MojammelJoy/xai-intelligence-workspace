"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import { MathUtils, type BufferAttribute, type Points } from "three";
import { WOW_SCENE } from "@/constants/three";
import {
  createAutomationFormation,
  createProcessingFormation,
  createRawDataFormation,
  createStructuredFormation,
} from "./wow-particle-formations";

const RADIUS = WOW_SCENE.particle.radius;

interface WowParticleFieldProps {
  animate: boolean;
  scrollProgress: RefObject<number>;
  count: number;
}

export function WowParticleField({ animate, scrollProgress, count }: WowParticleFieldProps) {
  const pointsRef = useRef<Points>(null);

  const formations = useMemo(
    () => [
      createRawDataFormation(count, RADIUS),
      createProcessingFormation(count, RADIUS),
      createStructuredFormation(count, RADIUS),
      createAutomationFormation(count, RADIUS),
    ],
    [count],
  );
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const seeds = useMemo(() => {
    const array = new Float32Array(count);
    for (let i = 0; i < count; i++) array[i] = Math.random() * Math.PI * 2;
    return array;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;

    // Map the 0-1 scroll progress across the (formations.length - 1)
    // transitions between adjacent formations, so the field settles into
    // "AI Automation" only once fully scrolled into view.
    const segments = formations.length - 1;
    const scaled = MathUtils.clamp(scrollProgress.current, 0, 1) * segments;
    const segmentIndex = Math.min(Math.floor(scaled), segments - 1);
    const segmentT = scaled - segmentIndex;
    const from = formations[segmentIndex];
    const to = formations[segmentIndex + 1];

    const attribute = pointsRef.current.geometry.attributes.position as BufferAttribute;
    const driftScale = animate ? 1 : 0;

    for (let i = 0; i < count; i++) {
      const seed = seeds[i];
      const driftX = Math.cos(t * 0.3 + seed) * 0.03 * driftScale;
      const driftY = Math.sin(t * 0.4 + seed) * 0.03 * driftScale;

      positions[i * 3] = MathUtils.lerp(from[i * 3], to[i * 3], segmentT) + driftX;
      positions[i * 3 + 1] = MathUtils.lerp(from[i * 3 + 1], to[i * 3 + 1], segmentT) + driftY;
      positions[i * 3 + 2] = MathUtils.lerp(from[i * 3 + 2], to[i * 3 + 2], segmentT);
    }

    attribute.needsUpdate = true;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = animate ? t * 0.04 : 0;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry key={count}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={WOW_SCENE.particle.color}
        size={0.045}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}
