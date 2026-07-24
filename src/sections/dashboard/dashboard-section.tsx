import { DashboardReveal } from "./dashboard-reveal";
import { DashboardTabs } from "./dashboard-tabs";

export function DashboardSection() {
  return (
    <section
      id="dashboard"
      tabIndex={-1}
      aria-labelledby="dashboard-heading"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24 outline-none sm:py-32"
    >
      <DashboardReveal className="border-panel-border overflow-hidden rounded-3xl border">
        <DashboardTabs />
      </DashboardReveal>
    </section>
  );
}
