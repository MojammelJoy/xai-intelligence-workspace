"use client";

import { useCallback } from "react";
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion";

// Scroll offset for the fixed header comes from each target section's own
// `scroll-mt-*` CSS (scroll-margin-top), which scrollIntoView already
// respects — no manual pixel math needed here.
export function useSmoothScrollTo() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return useCallback(
    (id: string) => (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      target.focus({ preventScroll: true });
      window.history.pushState(null, "", `#${id}`);
    },
    [prefersReducedMotion],
  );
}
