"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Download,
  UserPlus,
  ArrowUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CANDIDATES, JOBS } from "@/lib/mock-data";
import {
  getScoreTier,
  scoreClasses,
  stageClasses,
  stageLabels,
  type PipelineStage,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const STAGE_FILTERS: { label: string; value: "all" | PipelineStage }[] = [
  { label: "All (48)",       value: "all"       },
  { label: "New (7)",        value: "new"       },
  { label: "Screening (14)", value: "screening" },
  { label: "Interview (12)", value: "interview" },
  { label: "Offer (4)",      value: "offer"     },
  { label: "Rejected (11)", value: "rejected"  },
];

function AiScorePill({ score }: { score: number | null }) {
  const tier = getScoreTier(score);
  if (score === null) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-muted text-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
        pending
      </span>
    );
  }
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold", scoreClasses[tier])}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        tier === "high" ? "bg-green-500" : tier === "mid" ? "bg-amber-500" : "bg-red-500"
      )} />
      {score}/100
    </span>
  );
}

function StagePill({ stage }: { stage: PipelineStage }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold",
      stageClasses[stage]
    )}>
      {stageLabels[stage]}
    </span>
  );
}

export default function CandidateListPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  const job = JOBS.find((j) => j.id === jobId) ?? JOBS[0];

  const [stageFilter, setStageFilter] = useState<"all" | PipelineStage>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = CANDIDATES.filter((c) => {
    const matchesStage = stageFilter === "all" || c.stage === stageFilter;
    const matchesSearch =
      search.trim() === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase());
    return matchesStage && matchesSearch;
  });

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((c) => c.id)));
    }
  }

  const allSelected = filtered.length > 0 && selected.size === filtered.length;

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb + header */}
      <div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
          <Link href="/recruit/jobs" className="hover:text-primary transition-colors">
            Jobs
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{job.title}</span>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Candidates</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              48 total · 7 awaiting review · AI screening active
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-9 gap-2">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
            <Button size="sm" className="h-9 gap-2">
              <UserPlus className="w-3.5 h-3.5" />
              Add manually
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Filters row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Stage filters */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1 flex-wrap">
          {STAGE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStageFilter(f.value)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap",
                stageFilter === f.value
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search + sort */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search by name, location, skill…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8 w-60 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <ArrowUpDown className="w-3.5 h-3.5" />
            AI Score
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Location
          </Button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-primary/5 border border-primary/20">
          <span className="text-sm font-semibold text-primary">{selected.size} selected</span>
          <Separator orientation="vertical" className="h-4" />
          <Button variant="ghost" size="sm" className="h-7 text-xs">Move to screening</Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs">Assign recruiter</Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive">Reject & notify</Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[32px_2fr_100px_100px_130px_160px_100px_60px] gap-3 px-5 py-3 bg-muted/50 border-b border-border items-center">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="w-4 h-4 accent-primary"
          />
          {["Candidate", "AI match", "Stage", "Applied", "Last activity", "Assigned to", ""].map(
            (col) => (
              <span key={col} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {col}
              </span>
            )
          )}
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {filtered.map((candidate) => (
            <div
              key={candidate.id}
              className={cn(
                "grid grid-cols-[32px_2fr_100px_100px_130px_160px_100px_60px] gap-3 items-center px-5 py-3.5 transition-colors group",
                selected.has(candidate.id) ? "bg-primary/5" : "hover:bg-muted/30"
              )}
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={selected.has(candidate.id)}
                onChange={() => toggleSelect(candidate.id)}
                className="w-4 h-4 accent-primary"
              />

              {/* Candidate */}
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="text-xs font-semibold bg-secondary text-primary">
                    {candidate.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <Link
                    href={`/recruit/candidates/${candidate.id}`}
                    className="text-sm font-semibold text-foreground hover:text-primary transition-colors block leading-none mb-0.5 truncate"
                  >
                    {candidate.name}
                  </Link>
                  <p className="text-xs text-muted-foreground truncate">{candidate.location}</p>
                </div>
              </div>

              {/* AI score */}
              <div>
                <AiScorePill score={candidate.aiScore} />
              </div>

              {/* Stage */}
              <div>
                <StagePill stage={candidate.stage} />
              </div>

              {/* Applied */}
              <span className="text-sm text-muted-foreground">{candidate.appliedDate}</span>

              {/* Last activity */}
              <span className="text-xs text-muted-foreground leading-snug line-clamp-2">
                {candidate.lastActivity}
              </span>

              {/* Assigned to */}
              <span className={cn(
                "text-xs font-medium",
                candidate.recruiter === "Unassigned" ? "text-muted-foreground italic" : "text-foreground"
              )}>
                {candidate.recruiter}
              </span>

              {/* View */}
              <Link
                href={`/recruit/candidates/${candidate.id}`}
                className="text-xs font-medium text-primary hover:underline underline-offset-4 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1–{filtered.length} of 48
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
