"use client";

import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef, ComponentType } from "react";
import { useRevealVariants } from "./motion-root";
import { cn } from "@/utils/cn";

const MOTION_TAGS = {
  div: motion.div,
  header: motion.header,
  h1: motion.h1,
  p: motion.p,
} as const;

type RevealTag = keyof typeof MOTION_TAGS;

type RevealProps<T extends RevealTag> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

export function Reveal<T extends RevealTag = "div">({ as, className, ...props }: RevealProps<T>) {
  const variants = useRevealVariants();
  const MotionTag = MOTION_TAGS[as ?? ("div" as T)] as ComponentType<Record<string, unknown>>;

  return (
    <MotionTag
      variants={variants}
      className={cn("motion-reveal", className)}
      {...(props as Record<string, unknown>)}
    />
  );
}
