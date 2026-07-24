import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { HeroSceneIndicator } from "./hero-scene-indicator";
import { HeroVisualization } from "./hero-visualization";
import { cn } from "@/utils/cn";

interface HeroVisualProps {
  className?: string;
}

export function HeroVisual({ className }: HeroVisualProps) {
  return (
    <Reveal className={cn("w-full", className)} aria-hidden="true">
      <Card className="relative aspect-4/3 w-full overflow-hidden p-6 sm:aspect-21/9">
        <HeroVisualization />
        <HeroSceneIndicator />
      </Card>
    </Reveal>
  );
}
