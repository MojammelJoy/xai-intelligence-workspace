export interface SidebarNavLink {
  label: string;
  href: string;
}

export type DashboardTabId = "overview" | "insights" | "sources" | "automations";

export interface DashboardNavLink extends SidebarNavLink {
  id: DashboardTabId;
}

export interface KpiMetric {
  id: string;
  label: string;
  value: string;
  deltaLabel: string;
  direction: "up" | "down";
}

export interface ChartDatum {
  label: string;
  value: number;
  highlighted?: boolean;
}

export type InsightSeverity = "high" | "medium" | "low";

export interface InsightRecord {
  id: string;
  label: string;
  severity: InsightSeverity;
}

export interface DashboardTabContent {
  title: string;
  kpis: KpiMetric[];
  chartTitle: string;
  chartData: ChartDatum[];
  tableTitle: string;
  insights: InsightRecord[];
}
