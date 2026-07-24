"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useRef, type RefObject } from "react";
import { MathUtils } from "three";
import { GlowOrb } from "@/components/three/glow-orb";
import { WOW_SCENE } from "@/constants/three";
import { WowParticleField } from "./wow-particle-field";

interface WowSceneProps {
  animate: boolean;
  scrollProgress: RefObject<number>;
  particleCount: number;
}

function CameraRig({ animate }: { animate: boolean }) {
  const { camera } = useThree();
  const parallax = useRef({ x: 0, y: 0 });

  // Deliberately calmer than Hero's parallax — this scene should read as
  // still and technical, with just a whisper of responsiveness.
  useFrame((state) => {
    const targetX = animate ? state.pointer.x * 0.12 : 0;
    const targetY = animate ? state.pointer.y * 0.08 : 0;
    parallax.current.x = MathUtils.lerp(parallax.current.x, targetX, 0.03);
    parallax.current.y = MathUtils.lerp(parallax.current.y, targetY, 0.03);
    camera.position.x = parallax.current.x;
    camera.position.y = parallax.current.y;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export function WowScene({ animate, scrollProgress, particleCount }: WowSceneProps) {
  return (
    <>
      <CameraRig animate={animate} />
      <ambientLight
        intensity={WOW_SCENE.ambientLight.intensity}
        color={WOW_SCENE.ambientLight.color}
      />
      <pointLight
        position={WOW_SCENE.pointLight.position}
        intensity={WOW_SCENE.pointLight.intensity}
        color={WOW_SCENE.pointLight.color}
        distance={WOW_SCENE.pointLight.distance}
        decay={WOW_SCENE.pointLight.decay}
      />
      <fogExp2 attach="fog" args={[WOW_SCENE.fog.color, WOW_SCENE.fog.density]} />

      <WowParticleField animate={animate} scrollProgress={scrollProgress} count={particleCount} />
      <GlowOrb
        color={WOW_SCENE.glowOrb.color}
        radius={WOW_SCENE.glowOrb.radius}
        intensity={WOW_SCENE.glowOrb.intensity}
        haloScale={WOW_SCENE.glowOrb.haloScale}
      />
    </>
  );
}
