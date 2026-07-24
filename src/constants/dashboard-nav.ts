import type { DashboardNavLink, SidebarNavLink } from "@/types/dashboard";

export const DASHBOARD_NAV_LINKS: DashboardNavLink[] = [
  { id: "overview", label: "Overview", href: "#" },
  { id: "insights", label: "Insights", href: "#" },
  { id: "sources", label: "Sources", href: "#" },
  { id: "automations", label: "Automations", href: "#" },
];

export const DASHBOARD_SETTINGS_LINK: SidebarNavLink = {
  label: "Settings",
  href: "#",
};
