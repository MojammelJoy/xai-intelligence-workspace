import type { Variants } from "framer-motion";

const REVEAL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function createStaggerContainerVariants(reduceMotion: boolean): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.12,
        delayChildren: reduceMotion ? 0 : 0.1,
      },
    },
  };
}

export function createRevealItemVariants(reduceMotion: boolean): Variants {
  return {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0.15 : 0.6,
        ease: reduceMotion ? "linear" : REVEAL_EASE,
      },
    },
  };
}
