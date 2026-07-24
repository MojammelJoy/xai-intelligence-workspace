import { Card } from "@/components/ui/card";
import type { InsightFlowStep as InsightFlowStepData } from "@/constants/insight-flow";

interface InsightFlowStepProps {
  step: InsightFlowStepData;
}

export function InsightFlowStep({ step }: InsightFlowStepProps) {
  return (
    <li>
      <Card
        tabIndex={0}
        aria-label={`Step ${step.number}: ${step.title}`}
        className="group hover:border-accent/40 focus-visible:border-accent/40 focus-visible:ring-accent focus-visible:ring-offset-background h-full p-6 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(59,130,246,0.45)] focus-visible:-translate-y-1 focus-visible:shadow-[0_20px_40px_-24px_rgba(59,130,246,0.45)] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        <div
          aria-hidden="true"
          className="bg-badge group-hover:bg-accent/20 group-focus-visible:bg-accent/20 h-8 w-8 rounded-lg transition duration-300 ease-out group-hover:scale-110 group-focus-visible:scale-110"
        />
        <p className="text-accent mt-8 text-xs font-semibold">{step.number}</p>
        <h3 className="text-foreground mt-2 text-xl font-semibold">{step.title}</h3>
        <p className="text-muted-foreground mt-3 text-base">{step.description}</p>
      </Card>
    </li>
  );
}
