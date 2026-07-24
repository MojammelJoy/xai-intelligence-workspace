"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { INSIGHT_FLOW_STEPS } from "@/constants/insight-flow";
import { useLazyGsap } from "@/hooks/use-lazy-gsap";
import { InsightFlowHeading } from "./insight-flow-heading";
import { InsightFlowStep } from "./insight-flow-step";

export function InsightFlowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const gsapModules = useLazyGsap();

  useGSAP(
    () => {
      if (!gsapModules) return;
      const { gsap, ScrollTrigger } = gsapModules;

      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReducedMotion) return;

      const heading = sectionRef.current?.querySelector("[data-flow-heading]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-flow-list] > li", sectionRef.current);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
        defaults: { ease: "power3.out", duration: 0.8 },
      });

      if (heading) {
        timeline.from(heading, { y: 24, opacity: 0 });
      }
      timeline.from(
        cards,
        { y: 32, opacity: 0, scale: 0.97, stagger: 0.15 },
        heading ? "-=0.5" : 0,
      );

      // Geist loads with display: swap, so the fallback font's metrics are
      // what ScrollTrigger measures first; once the real font swaps in, text
      // height/width can shift slightly and make the trigger positions
      // stale. Recalculate once fonts are confirmed loaded.
      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    },
    { scope: sectionRef, dependencies: [gsapModules] },
  );

  return (
    <section
      ref={sectionRef}
      id="insight-flow"
      tabIndex={-1}
      aria-labelledby="insight-flow-heading"
      className="mx-auto max-w-5xl scroll-mt-24 px-6 py-24 outline-none sm:py-32"
    >
      <InsightFlowHeading />
      <ol data-flow-list className="mt-12 grid list-none grid-cols-1 gap-6 lg:grid-cols-3">
        {INSIGHT_FLOW_STEPS.map((step) => (
          <InsightFlowStep key={step.number} step={step} />
        ))}
      </ol>
    </section>
  );
}
