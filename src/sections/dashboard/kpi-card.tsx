import { ArrowDown, ArrowUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { KpiMetric } from "@/types/dashboard";
import { DashboardReveal } from "./dashboard-reveal";

interface KpiCardProps {
  metric: KpiMetric;
  delay?: number;
}

export function KpiCard({ metric, delay = 0 }: KpiCardProps) {
  const DirectionIcon = metric.direction === "up" ? ArrowUp : ArrowDown;

  return (
    <DashboardReveal delay={delay}>
      <Card className="hover:border-accent/40 p-5 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(59,130,246,0.45)]">
        <dt className="text-muted-foreground text-sm">{metric.label}</dt>
        <dd className="text-foreground mt-3 text-2xl font-semibold">{metric.value}</dd>
        <dd className="mt-2 flex items-center gap-1 text-sm text-emerald-400">
          <DirectionIcon aria-hidden="true" className="h-3.5 w-3.5" />
          <span>{metric.deltaLabel}</span>
          <span className="sr-only">{metric.direction === "up" ? "increase" : "decrease"}</span>
        </dd>
      </Card>
    </DashboardReveal>
  );
}
