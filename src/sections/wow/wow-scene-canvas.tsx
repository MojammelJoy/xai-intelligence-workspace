"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useMediaQuery } from "@/hooks/use-media-query";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

const WowCanvasScene = dynamic(
  () => import("./wow-canvas-scene").then((mod) => mod.WowCanvasScene),
  { ssr: false },
);

const DESKTOP_PARTICLE_COUNT = 480;
const MOBILE_PARTICLE_COUNT = 200;

export function WowSceneCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { rootMargin: "200px" });
  const prefersReducedMotion = usePrefersReducedMotion();
  const scrollProgress = useScrollProgress(containerRef);
  const isMobileViewport = useMediaQuery("(max-width: 639px)");
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (isInView) setHasLoaded(true);
  }, [isInView]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="border-panel-border bg-panel relative h-[360px] overflow-hidden rounded-3xl border sm:h-[440px] lg:h-[520px]"
    >
      {hasLoaded ? (
        <WowCanvasScene
          animate={isInView && !prefersReducedMotion}
          isInView={isInView}
          scrollProgress={scrollProgress}
          particleCount={isMobileViewport ? MOBILE_PARTICLE_COUNT : DESKTOP_PARTICLE_COUNT}
        />
      ) : null}
    </div>
  );
}
