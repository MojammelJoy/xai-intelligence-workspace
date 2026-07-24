"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

interface UseDashboardMotionOptions {
  amount?: number;
}

// whileInView's built-in viewport check can't be resolved during SSR, and the
// client's first hydration pass runs before its own IntersectionObserver has
// fired either — so both sides need to agree on "not yet visible" at that
// exact moment. Driving visibility from useInView's ref-based state (false on
// both server and first client render) keeps them in sync, instead of
// relying on whileInView's own SSR handling, which doesn't. The isMounted
// gate applies the same fix to prefers-reduced-motion, which is also unknown
// during SSR and on the client's first render.
export function useDashboardMotion({ amount = 0.1 }: UseDashboardMotionOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount });
  const prefersReducedMotion = useReducedMotion();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shouldReduceMotion = isMounted && !!prefersReducedMotion;
  const isVisible = shouldReduceMotion || isInView;

  return { ref, isVisible, shouldReduceMotion };
}
