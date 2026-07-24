"use client";

import type { RefObject } from "react";
import { SceneCanvas } from "@/components/three/scene-canvas";
import { CAMERA } from "@/constants/three";
import { HeroScene } from "./hero-scene";

interface HeroCanvasSceneProps {
  animate: boolean;
  isInView: boolean;
  scrollProgress: RefObject<number>;
}

export function HeroCanvasScene({ animate, isInView, scrollProgress }: HeroCanvasSceneProps) {
  return (
    <SceneCanvas
      frameloop={isInView ? "always" : "demand"}
      cameraPosition={[0, 0.4, CAMERA.minDistance]}
      fov={CAMERA.fov}
    >
      <HeroScene animate={animate} scrollProgress={scrollProgress} />
    </SceneCanvas>
  );
}
