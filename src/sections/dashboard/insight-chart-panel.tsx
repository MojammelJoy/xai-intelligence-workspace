"use client";

import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import type { ChartDatum } from "@/types/dashboard";
import { DashboardReveal } from "./dashboard-reveal";
import { useDashboardMotion } from "./use-dashboard-motion";

const InsightBarChart = dynamic(() => import("./insight-bar-chart"), { ssr: false });

interface InsightChartPanelProps {
  title: string;
  data: ChartDatum[];
}

export function InsightChartPanel({ title, data }: InsightChartPanelProps) {
  const { ref, isVisible: barsVisible, shouldReduceMotion } = useDashboardMotion({ amount: 0.4 });
  const highlightedDay = data.find((datum) => datum.highlighted);

  return (
    <DashboardReveal delay={0.16}>
      <Card className="hover:border-accent/40 min-w-0 p-6 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(59,130,246,0.45)]">
        <p className="text-muted-foreground text-sm">{title}</p>
        <div
          ref={ref}
          role="img"
          aria-label={`${title}. ${highlightedDay?.label ?? ""} is flagged as significant by Xai.`}
          className="mt-8 h-40"
        >
          <div aria-hidden="true" className="h-full w-full">
            {barsVisible && <InsightBarChart data={data} animate={!shouldReduceMotion} />}
          </div>
        </div>
      </Card>
    </DashboardReveal>
  );
}
