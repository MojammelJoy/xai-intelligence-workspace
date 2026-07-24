"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Tracks how far an element has scrolled through the viewport as a 0-1 ref
 * (not React state) so consumers can read it inside a render loop (e.g.
 * requestAnimationFrame / useFrame) without triggering a re-render on every
 * scroll tick.
 */
export function useScrollProgress(ref: RefObject<Element | null>): RefObject<number> {
  const progress = useRef(0);

  useEffect(() => {
    let frame: number | null = null;

    const update = () => {
      frame = null;
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const raw = 1 - rect.top / window.innerHeight;
      progress.current = Math.min(1, Math.max(0, raw));
    };

    const requestUpdate = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [ref]);

  return progress;
}
