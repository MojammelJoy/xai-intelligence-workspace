"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/utils/cn";
import { DASHBOARD_NAV_LINKS, DASHBOARD_SETTINGS_LINK } from "@/constants/dashboard-nav";
import type { DashboardTabId } from "@/types/dashboard";

const FOCUS_RING =
  "focus-visible:ring-accent focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none";

interface DashboardSidebarProps {
  activeTab: DashboardTabId;
  onSelectTab: (tab: DashboardTabId) => void;
}

export function DashboardSidebar({ activeTab, onSelectTab }: DashboardSidebarProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="bg-panel border-panel-border shrink-0 border-b px-6 py-6 lg:flex lg:w-56 lg:flex-col lg:border-b-0 lg:py-8">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className="bg-foreground h-1.5 w-1.5 rounded-full" />
        <span className="text-foreground text-base font-semibold tracking-tight">Xai</span>
      </div>

      <nav aria-label="Dashboard" className="mt-8 flex flex-col lg:mt-10 lg:flex-1">
        <ul className="flex flex-row flex-wrap gap-x-5 gap-y-2 lg:flex-col lg:gap-y-1">
          {DASHBOARD_NAV_LINKS.map((link) => {
            const isActive = link.id === activeTab;
            return (
              <li key={link.id}>
                <button
                  type="button"
                  onClick={() => onSelectTab(link.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative flex w-full items-center rounded-lg px-3 py-3 text-left text-sm transition-colors duration-200 lg:py-2",
                    FOCUS_RING,
                    isActive
                      ? "text-accent font-medium"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="dashboard-sidebar-active"
                      className="bg-accent/15 absolute inset-0 rounded-lg"
                      transition={
                        shouldReduceMotion
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 500, damping: 40 }
                      }
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </button>
              </li>
            );
          })}
          <li className="lg:hidden">
            <a
              href={DASHBOARD_SETTINGS_LINK.href}
              className={cn(
                "text-muted-foreground hover:text-foreground flex items-center rounded-lg px-3 py-3 text-sm transition-colors duration-200",
                FOCUS_RING,
              )}
            >
              {DASHBOARD_SETTINGS_LINK.label}
            </a>
          </li>
        </ul>

        <a
          href={DASHBOARD_SETTINGS_LINK.href}
          className={cn(
            "text-muted-foreground hover:text-foreground mt-auto hidden rounded-lg px-3 py-2 text-sm transition-colors duration-200 lg:block",
            FOCUS_RING,
          )}
        >
          {DASHBOARD_SETTINGS_LINK.label}
        </a>
      </nav>
    </div>
  );
}
