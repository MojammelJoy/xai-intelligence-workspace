"use client";

import { Bar, BarChart, Rectangle, ResponsiveContainer, type BarShapeProps } from "recharts";
import { ACCENT_HEX } from "@/constants/colors";
import type { ChartDatum } from "@/types/dashboard";

// Recharts renders fill as a raw SVG attribute, so it can't reliably resolve
// CSS custom properties (var(--color-accent)) the way a stylesheet can.
// ACCENT_MUTED is --accent at 25% strength, derived from the same hex.
const ACCENT_STRONG = ACCENT_HEX;
const ACCENT_MUTED = "rgba(59, 130, 246, 0.25)";

interface InsightBarChartProps {
  data: ChartDatum[];
  animate: boolean;
}

// Recharts' payload is untyped (`any`) at the library boundary; this is the
// same ChartDatum shape passed in via `data` below.
function BarShape(props: BarShapeProps) {
  const datum = props.payload as ChartDatum;
  return <Rectangle {...props} fill={datum.highlighted ? ACCENT_STRONG : ACCENT_MUTED} />;
}

export default function InsightBarChart({ data, animate }: InsightBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        accessibilityLayer={false}
      >
        <Bar
          dataKey="value"
          radius={[6, 6, 0, 0]}
          isAnimationActive={animate}
          animationDuration={600}
          animationEasing="ease-out"
          shape={BarShape}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
