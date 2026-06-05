"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CHART_COLORS } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

// ─── Mock data ────────────────────────────────────────────────────────────────

const WEEKLY_APPS = [
  { week: "W1", count: 24 },
  { week: "W2", count: 31 },
  { week: "W3", count: 19 },
  { week: "W4", count: 42 },
  { week: "W5", count: 38 },
  { week: "W6", count: 55 },
  { week: "W7", count: 47 },
  { week: "W8", count: 62 },
];

const CONVERSION = [
  { label: "Applied → Screening",   rate: 44, color: CHART_COLORS.primary },
  { label: "Screening → Interview", rate: 67, color: CHART_COLORS.teal    },
  { label: "Interview → Offer",     rate: 43, color: CHART_COLORS.violet  },
  { label: "Offer → Hired",         rate: 81, color: CHART_COLORS.amber   },
];

const SOURCES = [
  { label: "LinkedIn",              pct: 38, color: CHART_COLORS.primary },
  { label: "Careers portal",        pct: 29, color: CHART_COLORS.teal    },
  { label: "Employee referral",     pct: 18, color: CHART_COLORS.violet  },
  { label: "Other job boards",      pct: 15, color: CHART_COLORS.amber   },
];

const REGIONS = [
  { label: "North America",   pct: 41 },
  { label: "Europe",          pct: 33 },
  { label: "Asia-Pacific",    pct: 19 },
  { label: "Middle East & Africa", pct: 7 },
];

const KPI_CARDS = [
  {
    id:      "time-to-hire",
    label:   "Avg. time to hire",
    value:   "18d",
    trend:   "↓ 4d vs Q1",
    good:    true,
    up:      false,
  },
  {
    id:      "cv-screen",
    label:   "CV screen rate",
    value:   "74%",
    trend:   "50% automated",
    good:    true,
    up:      true,
  },
  {
    id:      "satisfaction",
    label:   "Cand. satisfaction",
    value:   "3.8",
    trend:   "↓ 0.6 vs target",
    good:    false,
    up:      false,
  },
  {
    id:      "offer-accept",
    label:   "Offer accept rate",
    value:   "81%",
    trend:   "↑ 12% vs Q1",
    good:    true,
    up:      true,
  },
];

type Range = "this-month" | "q2-2025" | "custom";

const RANGES: { value: Range; label: string }[] = [
  { value: "this-month", label: "This month" },
  { value: "q2-2025",    label: "Q2 2025"    },
  { value: "custom",     label: "Custom"     },
];

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-lg shadow-md px-3 py-2">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <p className="text-sm font-bold text-primary">{payload[0].value} applications</p>
    </div>
  );
}

// ─── Horizontal bar ───────────────────────────────────────────────────────────

function HBar({ pct, color }: { pct: number; color?: string }) {
  return (
    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${pct}%`, backgroundColor: color ?? CHART_COLORS.primary }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [range, setRange] = useState<Range>("q2-2025");
  const [activeBar, setActiveBar] = useState<number | null>(null);

  return (
    <div className="px-8 py-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Q2 2025 · All regions · All roles
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Range selector */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                  range === r.value
                    ? "bg-white text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>
      </div>

      <Separator />

      {/* KPI cards */}
      <div className="grid grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi) => (
          <Card key={kpi.id}>
            <CardContent className="pt-5 pb-4 px-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                {kpi.label}
              </p>
              <p className="text-3xl font-bold text-foreground leading-none mb-1.5">
                {kpi.value}
              </p>
              <div className="flex items-center gap-1">
                {kpi.up ? (
                  <TrendingUp className={cn("w-3 h-3", kpi.good ? "text-green-600" : "text-destructive")} />
                ) : (
                  <TrendingDown className={cn("w-3 h-3", kpi.good ? "text-green-600" : "text-amber-500")} />
                )}
                <span className="text-xs text-muted-foreground">{kpi.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-5 gap-4">
        {/* Weekly applications bar chart — spans 3 cols */}
        <Card className="col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Applications by week — Q2 2025
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={WEEKLY_APPS}
                barCategoryGap="35%"
                onMouseLeave={() => setActiveBar(null)}
              >
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  width={28}
                />
                <Tooltip content={<ChartTooltip />} cursor={false} />
                <Bar
                  dataKey="count"
                  radius={[4, 4, 0, 0]}
                  onMouseEnter={(_, index) => setActiveBar(index)}
                >
                  {WEEKLY_APPS.map((_, index) => (
                    <Cell
                      key={index}
                      fill={activeBar === index ? CHART_COLORS.primary : `${CHART_COLORS.primary}99`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stage conversion — spans 2 cols */}
        <Card className="col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Stage conversion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {CONVERSION.map(({ label, rate, color }) => (
              <div key={label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground truncate pr-2">{label}</span>
                  <span className="text-sm font-bold text-foreground tabular-nums flex-shrink-0">
                    {rate}%
                  </span>
                </div>
                <HBar pct={rate} color={color} />
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-1 leading-relaxed">
              44% applied→screening rate means over half the pipeline is never evaluated — the core bottleneck the platform targets.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sources + regions row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Application sources */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Application sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {SOURCES.map(({ label, pct, color }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-40 flex-shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-sm text-foreground truncate">{label}</span>
                </div>
                <HBar pct={pct} color={color} />
                <span className="text-sm font-bold text-foreground tabular-nums w-8 text-right flex-shrink-0">
                  {pct}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Applications by region */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Applications by region
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-0">
            {REGIONS.map(({ label, pct }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-sm text-foreground w-40 flex-shrink-0 truncate">{label}</span>
                <HBar pct={pct} />
                <span className="text-sm font-bold text-foreground tabular-nums w-8 text-right flex-shrink-0">
                  {pct}%
                </span>
              </div>
            ))}
            <p className="text-xs text-muted-foreground pt-1">
              Supports Nexora&apos;s 22-country reporting requirement.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
