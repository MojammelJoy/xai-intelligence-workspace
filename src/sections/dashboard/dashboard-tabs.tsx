"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DASHBOARD_NAV_LINKS } from "@/constants/dashboard-nav";
import { DASHBOARD_TAB_CONTENT } from "@/data/dashboard-mock";
import type { DashboardTabId } from "@/types/dashboard";
import { ActivityTablePanel } from "./activity-table-panel";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopHeader } from "./dashboard-top-header";
import { InsightChartPanel } from "./insight-chart-panel";
import { KpiCard } from "./kpi-card";

export function DashboardTabs() {
  const [activeTab, setActiveTab] = useState<DashboardTabId>(DASHBOARD_NAV_LINKS[0].id);
  const shouldReduceMotion = useReducedMotion();
  const content = DASHBOARD_TAB_CONTENT[activeTab];

  return (
    <div className="flex flex-col lg:flex-row">
      <DashboardSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      <div className="min-w-0 flex-1 overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}
          >
            <DashboardTopHeader title={content.title} />

            <dl className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {content.kpis.map((metric, index) => (
                <KpiCard key={metric.id} metric={metric} delay={index * 0.05} />
              ))}
            </dl>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
              <InsightChartPanel title={content.chartTitle} data={content.chartData} />
              <ActivityTablePanel title={content.tableTitle} insights={content.insights} />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
