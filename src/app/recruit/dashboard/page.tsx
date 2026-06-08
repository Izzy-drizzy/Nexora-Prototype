import Link from "next/link";
import {
  TrendingDown,
  TrendingUp,
  AlertCircle,
  FileText,
  PenLine,
  CalendarX,
  ChevronRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  PIPELINE_COUNTS,
  KPI_CARDS,
  TODAYS_INTERVIEWS,
  URGENT_ACTIONS,
} from "@/lib/mock-data";
import type { UrgentAction } from "@/lib/mock-data";

// ─── Pipeline bar ─────────────────────────────────────────────────────────────

const STAGE_CONFIG = [
  { key: "applied",   label: "Applied",   color: "bg-slate-300",   href: "/recruit/candidates?stage=new" },
  { key: "screening", label: "Screening", color: "bg-amber-400",   href: "/recruit/candidates?stage=screening" },
  { key: "interview", label: "Interview", color: "bg-primary",     href: "/recruit/candidates?stage=interview" },
  { key: "offer",     label: "Offer",     color: "bg-teal-500",    href: "/recruit/candidates?stage=offer" },
  { key: "hired",     label: "Hired",     color: "bg-green-500",   href: "/recruit/candidates?stage=hired" },
] as const;

function PipelineBar() {
  const total = Object.values(PIPELINE_COUNTS).reduce((a, b) => a + b, 0);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Hiring pipeline
          </CardTitle>
          <div className="flex items-center gap-3">
            <Link
              href="/recruit/candidates"
              className="text-xs text-primary hover:underline underline-offset-4 font-medium"
            >
              View all
            </Link>
            <Button size="sm" className="h-7 px-3 text-xs gap-1.5">
              + New job
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stage count badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {STAGE_CONFIG.map(({ key, label, color, href }) => {
            const count = PIPELINE_COUNTS[key];
            return (
              <Link
                key={key}
                href={href}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-border bg-card hover:bg-muted/60 transition-colors group"
              >
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-sm font-bold text-foreground">{count}</span>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Segmented progress bar */}
        <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
          {STAGE_CONFIG.map(({ key, color }) => {
            const count = PIPELINE_COUNTS[key];
            const pct = (count / total) * 100;
            return (
              <div
                key={key}
                className={`${color} rounded-full transition-all`}
                style={{ width: `${pct}%` }}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── KPI cards ────────────────────────────────────────────────────────────────

function KpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                <TrendingUp className={`w-3 h-3 ${kpi.good ? "text-green-600" : "text-red-500"}`} />
              ) : (
                <TrendingDown className={`w-3 h-3 ${kpi.good ? "text-green-600" : "text-amber-500"}`} />
              )}
              <span className="text-xs text-muted-foreground">{kpi.trend}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ─── Today's interviews ───────────────────────────────────────────────────────

const FORMAT_BADGE: Record<string, string> = {
  Panel:     "bg-primary/10 text-primary",
  Phone:     "bg-teal-50 text-teal-700",
  Technical: "bg-violet-50 text-violet-700",
  Video:     "bg-blue-50 text-blue-700",
};

function TodaysInterviews() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Today&apos;s interviews
          </CardTitle>
          <Link
            href="/recruit/interviews"
            className="text-xs text-primary hover:underline underline-offset-4 font-medium"
          >
            View all
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="divide-y divide-border">
          {TODAYS_INTERVIEWS.map((interview) => (
            <div
              key={interview.id}
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 hover:bg-muted/40 transition-colors"
            >
              <Avatar className="w-8 h-8 flex-shrink-0">
                <AvatarFallback className="text-xs font-semibold bg-secondary text-primary">
                  {interview.candidateInitials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground leading-none mb-0.5 truncate">
                  {interview.candidateName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{interview.role}</p>
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {interview.time}
                </span>
              </div>

              <Badge
                variant="secondary"
                className={`hidden sm:inline-flex text-xs font-medium flex-shrink-0 ${FORMAT_BADGE[interview.format] ?? ""}`}
              >
                {interview.format}{interview.round ? ` ${interview.round}` : ""}
              </Badge>

              <Link
                href="/recruit/candidates"
                className="hidden sm:inline-flex items-center h-7 px-2 text-xs font-medium text-primary hover:bg-accent/10 rounded-md transition-colors flex-shrink-0"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Urgent actions ───────────────────────────────────────────────────────────

const ACTION_ICON: Record<UrgentAction["type"], React.ElementType> = {
  "cv-review":              FileText,
  "offer-unsigned":         PenLine,
  "interview-unconfirmed":  CalendarX,
};

const ACTION_COLOR: Record<UrgentAction["type"], string> = {
  "cv-review":              "bg-amber-50 text-amber-600",
  "offer-unsigned":         "bg-orange-50 text-orange-600",
  "interview-unconfirmed":  "bg-red-50 text-red-600",
};

function UrgentActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-destructive" />
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Urgent actions
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <div className="divide-y divide-border">
          {URGENT_ACTIONS.map((action) => {
            const Icon = ACTION_ICON[action.type];
            return (
              <Link
                key={action.id}
                href={action.href}
                className="flex items-center gap-3 px-5 py-3 hover:bg-muted/40 transition-colors group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${ACTION_COLOR[action.type]}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-none mb-0.5 truncate">
                    {action.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">{action.subtitle}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </Link>
            );
          })}
        </div>
        <div className="px-5 py-3">
          <p className="text-xs text-muted-foreground">
            14 total actions need attention today
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Good morning, Sarah
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Wednesday 11 Jun · 14 actions need attention
          </p>
        </div>
      </div>

      <Separator />

      {/* Pipeline */}
      <PipelineBar />

      {/* KPIs */}
      <KpiCards />

      {/* Bottom grid: interviews + urgent */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <TodaysInterviews />
        </div>
        <div className="lg:col-span-2">
          <UrgentActions />
        </div>
      </div>
    </div>
  );
}
