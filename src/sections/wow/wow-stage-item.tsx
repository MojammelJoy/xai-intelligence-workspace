"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { ACCENT_HEX, MUTED_FOREGROUND_HEX } from "@/constants/colors";
import type { WowStage } from "@/constants/wow-stages";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface WowStageItemProps {
  stage: WowStage;
  isActive: boolean;
  isRevealed: boolean;
  revealDelay: number;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const WowStageItem = forwardRef<HTMLLIElement, WowStageItemProps>(function WowStageItem(
  { stage, isActive, isRevealed, revealDelay },
  ref,
) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const highlightTransition = { duration: prefersReducedMotion ? 0 : 0.4 };

  return (
    <motion.li
      ref={ref}
      className="border-panel-border relative border-t pt-6 pl-5 first:border-t-0 first:pt-0"
      initial={{ opacity: 0, y: 20 }}
      animate={isRevealed ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: prefersReducedMotion ? 0 : 0.6,
        delay: prefersReducedMotion ? 0 : revealDelay,
        ease: EASE,
      }}
    >
      <motion.span
        aria-hidden="true"
        className="bg-accent absolute top-0 bottom-0 left-0 w-px"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={highlightTransition}
      />
      <motion.p
        className="text-xs font-semibold"
        initial={false}
        animate={{ color: isActive ? ACCENT_HEX : MUTED_FOREGROUND_HEX }}
        transition={highlightTransition}
      >
        {stage.number}
      </motion.p>
      <h3 className="text-foreground mt-2 text-xl font-semibold">{stage.label}</h3>
      <motion.p
        className="text-muted-foreground mt-3 text-base"
        initial={false}
        animate={{ opacity: isActive ? 1 : 0.88 }}
        transition={highlightTransition}
      >
        {stage.description}
      </motion.p>
    </motion.li>
  );
});
