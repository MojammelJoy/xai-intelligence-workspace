"use client";

import { useGSAP } from "@gsap/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { WOW_STAGES } from "@/constants/wow-stages";
import { useInView } from "@/hooks/use-in-view";
import { useLazyGsap } from "@/hooks/use-lazy-gsap";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { WowStageIndicator } from "./wow-stage-indicator";
import { WowStageItem } from "./wow-stage-item";

// How long organic scroll-tracking is paused after a click-to-jump, so the
// clicked stage isn't immediately overridden while its scrollIntoView
// animation is still settling.
const PROGRAMMATIC_SCROLL_GUARD_MS = 900;

export function WowStages() {
  const listRef = useRef<HTMLOListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  const suppressTrackingUntil = useRef(0);
  const gsapModules = useLazyGsap();

  const isListInView = useInView(listRef, { rootMargin: "-10% 0px" });
  const [hasRevealed, setHasRevealed] = useState(false);
  useEffect(() => {
    if (isListInView) setHasRevealed(true);
  }, [isListInView]);

  useGSAP(
    () => {
      if (!gsapModules) return;
      const { ScrollTrigger } = gsapModules;

      // Tracks whichever stage's midpoint sits closest to the vertical
      // center of the viewport, recomputed continuously while the list is
      // anywhere on screen. A per-item start/end range was tried first, but
      // with items this close together their active ranges legitimately
      // overlapped, so more than one could read "active" at once — "closest
      // to center" always yields exactly one winner.
      const trigger = ScrollTrigger.create({
        trigger: listRef.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate: () => {
          if (performance.now() < suppressTrackingUntil.current) return;

          const referenceY = window.innerHeight * 0.5;
          let closestIndex = 0;
          let closestDistance = Infinity;
          itemRefs.current.forEach((item, index) => {
            if (!item) return;
            const rect = item.getBoundingClientRect();
            const distance = Math.abs(rect.top + rect.height / 2 - referenceY);
            if (distance < closestDistance) {
              closestDistance = distance;
              closestIndex = index;
            }
          });
          setActiveIndex(closestIndex);
        },
      });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      return () => trigger.kill();
    },
    { scope: listRef, dependencies: [gsapModules] },
  );

  const handleSelect = useCallback(
    (index: number) => {
      // The last stage can't always be scrolled to true center — there's not
      // enough page content below it — so "closest to center" tracking alone
      // could re-elect a different stage right after the jump. The click is
      // the more authoritative signal here, so it wins outright for a bit.
      setActiveIndex(index);
      suppressTrackingUntil.current = performance.now() + PROGRAMMATIC_SCROLL_GUARD_MS;
      itemRefs.current[index]?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
      });
    },
    [prefersReducedMotion],
  );

  return (
    <>
      <WowStageIndicator activeIndex={activeIndex} onSelect={handleSelect} />

      <ol ref={listRef} className="mx-auto mt-16 flex max-w-2xl list-none flex-col gap-6">
        {WOW_STAGES.map((stage, index) => (
          <WowStageItem
            key={stage.number}
            ref={(node) => {
              itemRefs.current[index] = node;
            }}
            stage={stage}
            isActive={index === activeIndex}
            isRevealed={prefersReducedMotion || hasRevealed}
            revealDelay={index * 0.08}
          />
        ))}
      </ol>
    </>
  );
}
