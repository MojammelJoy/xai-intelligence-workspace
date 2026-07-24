import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/utils/cn";

interface HeroHeadingProps {
  className?: string;
}

export function HeroHeading({ className }: HeroHeadingProps) {
  return (
    <div className={cn("w-full min-w-0 text-center", className)}>
      <Reveal
        as="h1"
        id="hero-heading"
        className="text-foreground text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
      >
        <span className="block">Raw data becomes</span>
        <span className="text-accent block font-mono text-3xl sm:text-4xl md:text-5xl">
          structured intelligence
        </span>
      </Reveal>
      <Reveal as="p" className="text-muted-foreground mx-auto mt-6 max-w-xl text-base sm:text-lg">
        Xai transforms unstructured data into actionable insights — automatically.
      </Reveal>
    </div>
  );
}
