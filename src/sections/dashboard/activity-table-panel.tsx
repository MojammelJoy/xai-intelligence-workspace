import { Card } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import type { InsightRecord, InsightSeverity } from "@/types/dashboard";
import { DashboardReveal } from "./dashboard-reveal";

const SEVERITY_LABEL: Record<InsightSeverity, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

const SEVERITY_COLOR: Record<InsightSeverity, string> = {
  high: "text-amber-400",
  medium: "text-accent",
  low: "text-emerald-400",
};

interface ActivityTablePanelProps {
  title: string;
  insights: InsightRecord[];
}

export function ActivityTablePanel({ title, insights }: ActivityTablePanelProps) {
  return (
    <DashboardReveal delay={0.2}>
      <Card className="hover:border-accent/40 min-w-0 p-6 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(59,130,246,0.45)]">
        <h3 className="text-foreground text-sm font-semibold">{title}</h3>
        <table className="mt-4 w-full border-collapse">
          <caption className="sr-only">Recent insights and their severity</caption>
          <thead className="sr-only">
            <tr>
              <th scope="col">Insight</th>
              <th scope="col">Severity</th>
            </tr>
          </thead>
          <tbody>
            {insights.map((insight) => (
              <tr key={insight.id} className="transition-colors duration-200 hover:bg-white/3">
                <td className="text-muted-foreground py-2.5 pr-4 text-sm">{insight.label}</td>
                <td
                  className={cn(
                    "py-2.5 text-right text-xs font-medium whitespace-nowrap",
                    SEVERITY_COLOR[insight.severity],
                  )}
                >
                  {SEVERITY_LABEL[insight.severity]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </DashboardReveal>
  );
}
