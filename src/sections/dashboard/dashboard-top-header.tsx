import { DashboardReveal } from "./dashboard-reveal";

interface DashboardTopHeaderProps {
  title: string;
}

export function DashboardTopHeader({ title }: DashboardTopHeaderProps) {
  return (
    <DashboardReveal>
      <h2 id="dashboard-heading" className="text-foreground text-2xl font-semibold tracking-tight">
        {title}
      </h2>
    </DashboardReveal>
  );
}
