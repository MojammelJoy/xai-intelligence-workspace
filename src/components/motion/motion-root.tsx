"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { createRevealItemVariants, createStaggerContainerVariants } from "./variants";

const RevealVariantsContext = createContext<Variants | null>(null);

export function useRevealVariants(): Variants {
  const variants = useContext(RevealVariantsContext);
  if (!variants) {
    throw new Error("useRevealVariants must be used within a MotionRoot");
  }
  return variants;
}

interface MotionRootProps {
  children: ReactNode;
}

export function MotionRoot({ children }: MotionRootProps) {
  const prefersReducedMotion = useReducedMotion();

  // The server always renders assuming normal motion (SSR has no access to the
  // media query). Ignoring the real preference until after mount keeps the
  // client's first render identical to the server's, avoiding a hydration
  // mismatch for users with reduced motion enabled.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shouldReduceMotion = isMounted && !!prefersReducedMotion;

  const itemVariants = useMemo(
    () => createRevealItemVariants(shouldReduceMotion),
    [shouldReduceMotion],
  );
  const containerVariants = useMemo(
    () => createStaggerContainerVariants(shouldReduceMotion),
    [shouldReduceMotion],
  );

  return (
    <RevealVariantsContext.Provider value={itemVariants}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="contents"
      >
        {children}
      </motion.div>
    </RevealVariantsContext.Provider>
  );
}
