"use client";

import type { RefObject } from "react";
import { SceneCanvas } from "@/components/three/scene-canvas";
import { WOW_SCENE } from "@/constants/three";
import { WowScene } from "./wow-scene";

interface WowCanvasSceneProps {
  animate: boolean;
  isInView: boolean;
  scrollProgress: RefObject<number>;
  particleCount: number;
}

export function WowCanvasScene({
  animate,
  isInView,
  scrollProgress,
  particleCount,
}: WowCanvasSceneProps) {
  return (
    <SceneCanvas
      frameloop={isInView ? "always" : "demand"}
      cameraPosition={WOW_SCENE.camera.position}
      fov={WOW_SCENE.camera.fov}
    >
      <WowScene animate={animate} scrollProgress={scrollProgress} particleCount={particleCount} />
    </SceneCanvas>
  );
}
