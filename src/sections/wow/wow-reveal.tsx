"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { useInView } from "@/hooks/use-in-view";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface WowRevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export function WowReveal({ delay = 0, ...props }: WowRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { rootMargin: "-10% 0px" });
  const prefersReducedMotion = usePrefersReducedMotion();

  // useInView toggles live (true only while actually intersecting), which is
  // exactly what the R3F mount-gate needs elsewhere — but an entrance reveal
  // should play once and stay visible, not re-hide if the user scrolls back
  // up past it. Latching the first "true" gives that one-shot behavior.
  const [hasRevealed, setHasRevealed] = useState(false);
  useEffect(() => {
    if (isInView) setHasRevealed(true);
  }, [isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={prefersReducedMotion || hasRevealed ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.6,
        delay: prefersReducedMotion ? 0 : delay,
        ease: EASE,
      }}
      {...props}
    />
  );
}
