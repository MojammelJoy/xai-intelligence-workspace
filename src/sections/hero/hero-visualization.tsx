"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

const HeroCanvasScene = dynamic(
  () => import("./hero-canvas-scene").then((mod) => mod.HeroCanvasScene),
  { ssr: false },
);

export function HeroVisualization() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { rootMargin: "200px" });
  const prefersReducedMotion = usePrefersReducedMotion();
  const scrollProgress = useScrollProgress(containerRef);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    if (isInView) setHasLoaded(true);
  }, [isInView]);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {hasLoaded ? (
        <HeroCanvasScene
          animate={isInView && !prefersReducedMotion}
          isInView={isInView}
          scrollProgress={scrollProgress}
        />
      ) : null}
      <div className="text-muted-foreground/85 absolute inset-x-6 bottom-4 flex justify-between font-mono text-[10px] tracking-wide uppercase sm:text-xs">
        <span>Raw Data</span>
        <span>Structured Intelligence</span>
        <span>Actionable Insight</span>
      </div>
    </div>
  );
}
