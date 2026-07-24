"use client";

import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";

interface SceneCanvasProps {
  children: ReactNode;
  frameloop?: "always" | "demand" | "never";
  cameraPosition?: [number, number, number];
  fov?: number;
}

export function SceneCanvas({
  children,
  frameloop = "always",
  cameraPosition = [0, 0, 8],
  fov = 45,
}: SceneCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ position: cameraPosition, fov }}
      frameloop={frameloop}
    >
      {children}
    </Canvas>
  );
}
