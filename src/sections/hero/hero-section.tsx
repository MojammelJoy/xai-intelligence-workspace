import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/motion/reveal";
import { HeroHeading } from "./hero-heading";
import { HeroCtaGroup } from "./hero-cta-group";
import { HeroVisual } from "./hero-visual";

export function HeroSection() {
  return (
    <section
      id="hero"
      tabIndex={-1}
      aria-labelledby="hero-heading"
      className="mx-auto flex max-w-3xl scroll-mt-24 flex-col items-center px-6 pt-20 pb-24 text-center outline-none sm:pt-28 sm:pb-32"
    >
      <Reveal>
        <Badge>Intelligence Workspace</Badge>
      </Reveal>
      <HeroHeading className="mt-6" />
      <HeroCtaGroup className="mt-10" />
      <HeroVisual className="mt-16" />
    </section>
  );
}
