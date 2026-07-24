"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { useSmoothScrollTo } from "@/hooks/use-smooth-scroll-to";
import { cn } from "@/utils/cn";

interface HeroCtaGroupProps {
  className?: string;
}

export function HeroCtaGroup({ className }: HeroCtaGroupProps) {
  const scrollTo = useSmoothScrollTo();

  return (
    <Reveal className={cn("flex flex-col items-center gap-4 sm:flex-row", className)}>
      <Button href="#dashboard" onClick={scrollTo("dashboard")} variant="primary">
        Start for free
      </Button>
      <Button
        href="#insight-flow"
        onClick={scrollTo("insight-flow")}
        variant="secondary"
        className="group"
      >
        See how it works
        <ArrowRight
          aria-hidden="true"
          className="ml-2 h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
        />
      </Button>
    </Reveal>
  );
}
