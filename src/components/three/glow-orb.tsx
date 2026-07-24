"use client";

import type { Ref } from "react";
import { AdditiveBlending, type MeshStandardMaterial } from "three";

interface GlowOrbProps {
  position?: [number, number, number];
  color: string;
  radius?: number;
  intensity?: number;
  haloScale?: number;
  materialRef?: Ref<MeshStandardMaterial>;
}

export function GlowOrb({
  position,
  color,
  radius = 0.16,
  intensity = 2.2,
  haloScale = 2.4,
  materialRef,
}: GlowOrbProps) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          ref={materialRef}
          color={color}
          emissive={color}
          emissiveIntensity={intensity}
          roughness={0.6}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={haloScale}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
