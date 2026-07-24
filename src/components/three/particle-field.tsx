"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import { MathUtils, type BufferAttribute, type Points } from "three";

interface ParticleFieldProps {
  count: number;
  spread: [number, number, number];
  center?: [number, number, number];
  color: string;
  size?: number;
  animate?: boolean;
  /** 0-1 ref; when provided, blends particles from chaos toward a settled grid. */
  organizeProgress?: RefObject<number>;
}

function computeOrganizedPositions(
  count: number,
  spread: [number, number, number],
  center: [number, number, number],
  seeds: Float32Array,
): Float32Array {
  const dim = Math.max(2, Math.ceil(Math.cbrt(count)));
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const xi = i % dim;
    const yi = Math.floor(i / dim) % dim;
    const zi = Math.floor(i / (dim * dim)) % dim;
    const jitter = (seeds[i] % 1) * 0.06 - 0.03;
    positions[i * 3] = center[0] + (xi / (dim - 1) - 0.5) * spread[0] * 1.5 + jitter;
    positions[i * 3 + 1] = center[1] + (yi / (dim - 1) - 0.5) * spread[1] * 1.5 + jitter;
    positions[i * 3 + 2] = center[2] + (zi / (dim - 1) - 0.5) * spread[2] * 1.5;
  }
  return positions;
}

export function ParticleField({
  count,
  spread,
  center = [0, 0, 0],
  color,
  size = 0.05,
  animate = true,
  organizeProgress,
}: ParticleFieldProps) {
  const pointsRef = useRef<Points>(null);

  const { positions, basePositions, organizedPositions, seeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = center[0] + (Math.random() - 0.5) * spread[0] * 2;
      positions[i * 3 + 1] = center[1] + (Math.random() - 0.5) * spread[1] * 2;
      positions[i * 3 + 2] = center[2] + (Math.random() - 0.5) * spread[2] * 2;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    const organizedPositions = computeOrganizedPositions(count, spread, center, seeds);
    return { positions, basePositions: positions.slice(), organizedPositions, seeds };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, center[0], center[1], center[2], spread[0], spread[1], spread[2]]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const t = state.clock.elapsedTime;
    const progress = organizeProgress?.current ?? 0;
    const attribute = pointsRef.current.geometry.attributes.position as BufferAttribute;
    for (let i = 0; i < count; i++) {
      const seed = seeds[i];
      const floatScale = animate ? 1 - progress * 0.6 : 0;
      const floatX = Math.cos(t * 0.4 + seed) * 0.08 * floatScale;
      const floatY = Math.sin(t * 0.6 + seed) * 0.15 * floatScale;
      const bx = MathUtils.lerp(basePositions[i * 3], organizedPositions[i * 3], progress);
      const by = MathUtils.lerp(basePositions[i * 3 + 1], organizedPositions[i * 3 + 1], progress);
      const bz = MathUtils.lerp(basePositions[i * 3 + 2], organizedPositions[i * 3 + 2], progress);
      attribute.array[i * 3] = bx + floatX;
      attribute.array[i * 3 + 1] = by + floatY;
      attribute.array[i * 3 + 2] = bz;
    }
    attribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation
        transparent
        opacity={0.85}
        depthWrite={false}
      />
    </points>
  );
}
