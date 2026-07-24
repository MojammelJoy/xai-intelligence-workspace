"use client";

import { useEffect, useState } from "react";
import type gsapType from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

interface LazyGsap {
  gsap: typeof gsapType;
  ScrollTrigger: typeof ScrollTriggerType;
}

let cachedModules: LazyGsap | null = null;
let pendingLoad: Promise<LazyGsap> | null = null;

function loadGsap(): Promise<LazyGsap> {
  if (cachedModules) return Promise.resolve(cachedModules);
  pendingLoad ??= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
    ([gsapModule, scrollTriggerModule]) => {
      const gsap = gsapModule.default;
      const { ScrollTrigger } = scrollTriggerModule;
      gsap.registerPlugin(ScrollTrigger);
      cachedModules = { gsap, ScrollTrigger };
      return cachedModules;
    },
  );
  return pendingLoad;
}

/**
 * GSAP + ScrollTrigger are only used for below-the-fold scroll effects
 * (Insight Flow, WOW), so they're fetched on mount instead of bundled into
 * the initial page load — roughly 97KB gzipped that isn't needed for first
 * paint. The module promise is cached module-wide so multiple consumers on
 * the same page share one fetch instead of racing separate ones.
 */
export function useLazyGsap(): LazyGsap | null {
  const [modules, setModules] = useState<LazyGsap | null>(cachedModules);

  useEffect(() => {
    if (modules) return;
    let cancelled = false;
    loadGsap().then((loaded) => {
      if (!cancelled) setModules(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [modules]);

  return modules;
}
