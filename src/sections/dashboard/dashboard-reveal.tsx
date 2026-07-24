"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { EASE_OUT } from "@/constants/motion";
import { useDashboardMotion } from "./use-dashboard-motion";

const EASE = EASE_OUT;

interface DashboardRevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
}

export function DashboardReveal({ delay = 0, ...props }: DashboardRevealProps) {
  const { ref, isVisible, shouldReduceMotion } = useDashboardMotion();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.6,
        delay: shouldReduceMotion ? 0 : delay,
        ease: EASE,
      }}
      {...props}
    />
  );
}
