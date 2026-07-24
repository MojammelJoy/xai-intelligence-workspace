"use client";

import { motion } from "framer-motion";
import { WOW_STAGES } from "@/constants/wow-stages";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/utils/cn";

const FOCUS_RING =
  "focus-visible:ring-accent focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

interface WowStageIndicatorProps {
  activeIndex: number;
  onSelect: (index: number) => void;
}

export function WowStageIndicator({ activeIndex, onSelect }: WowStageIndicatorProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className="mt-6 flex items-center justify-center gap-1">
      {WOW_STAGES.map((stage, index) => {
        const isActive = index === activeIndex;
        return (
          <button
            key={stage.number}
            type="button"
            onClick={() => onSelect(index)}
            aria-label={`Jump to stage ${stage.number}: ${stage.label}`}
            aria-current={isActive ? "step" : undefined}
            className={cn(
              "group relative flex h-11 w-11 items-center justify-center rounded-full",
              FOCUS_RING,
            )}
          >
            {isActive ? (
              <motion.span
                layoutId="wow-stage-indicator-active"
                className="bg-accent h-1.5 w-6 rounded-full"
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 500, damping: 40 }
                }
              />
            ) : (
              <span className="bg-panel-border group-hover:bg-muted-foreground/60 h-1.5 w-1.5 rounded-full transition-colors" />
            )}
          </button>
        );
      })}
    </div>
  );
}
