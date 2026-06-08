"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Download,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CANDIDATES } from "@/lib/mock-data";
import { AddCandidateDialog } from "@/components/shared/add-candidate-dialog";
import {
  getScoreTier,
  scoreClasses,
  stageClasses,
  stageLabels,
  type PipelineStage,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const STAGE_FILTERS: { label: string; value: "all" | PipelineStage }[] = [
  { label: "All (92)",       value: "all"       },
  { label: "New (7)",        value: "new"       },
  { label: "Screening (21)", value: "screening" },
  { label: "Interview (14)", value: "interview" },
  { label: "Offer (6)",      value: "offer"     },
  { label: "Hired (3)",      value: "hired"     },
  { label: "Rejected (11)",  value: "rejected"  },
];

function AiScorePill({ score }: { score: number | null }) {
  const tier = getScoreTier(score);
  if (score === null) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-muted text-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
        pending
      </span>
    );
  }
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold",
      scoreClasses[tier]
    )}>
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        tier === "high" ? "bg-green-500" : tier === "mid" ? "bg-amber-500" : "bg-red-500"
      )} />
      {score}/100
    </span>
  );
}

export default function CandidatesPage() {
  const [stageFilter, setStageFilter] = useState<"all" | PipelineStage>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [addOpen, setAddOpen] = useState(false);

  const filtered = CANDIDATES.filter((c) => {
    const matchesStage = stageFilter === "all" || c.stage === stageFilter;
    const matchesSearch =
      search.trim() === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase()) ||
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
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Candidates</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            92 total across all active roles · AI screening active
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Button size="sm" className="h-9 gap-2" onClick={() => setAddOpen(true)}>
            <UserPlus className="w-3.5 h-3.5" />
            Add manually
          </Button>
        </div>
      </div>

      <Separator />

      {/* Filters row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search name, role, location…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-8 w-full sm:w-60 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Score</span>
          </Button>
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filter</span>
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
          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive">
            Reject &amp; notify
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <div className="min-w-[860px]">
        {/* Header */}
        <div className="grid grid-cols-[32px_2fr_1.2fr_100px_100px_130px_160px_60px] gap-3 px-5 py-3 bg-muted/50 border-b border-border items-center">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="w-4 h-4 accent-primary"
          />
          {["Candidate", "Role", "AI match", "Stage", "Applied", "Last activity", ""].map((col) => (
            <span key={col} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {col}
            </span>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-muted-foreground">No candidates match your filters.</p>
            </div>
          ) : (
            filtered.map((candidate) => (
              <div
                key={candidate.id}
                className={cn(
                  "grid grid-cols-[32px_2fr_1.2fr_100px_100px_130px_160px_60px] gap-3 items-center px-5 py-3.5 transition-colors group",
                  selected.has(candidate.id) ? "bg-primary/5" : "hover:bg-muted/30"
                )}
              >
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

                {/* Role */}
                <Link
                  href={`/recruit/jobs/j1/candidates`}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors truncate"
                >
                  {candidate.role}
                </Link>

                {/* AI score */}
                <div><AiScorePill score={candidate.aiScore} /></div>

                {/* Stage */}
                <span className={cn(
                  "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold",
                  stageClasses[candidate.stage]
                )}>
                  {stageLabels[candidate.stage]}
                </span>

                {/* Applied */}
                <span className="text-sm text-muted-foreground">{candidate.appliedDate}</span>

                {/* Last activity */}
                <span className="text-xs text-muted-foreground leading-snug line-clamp-2">
                  {candidate.lastActivity}
                </span>

                {/* View */}
                <Link
                  href={`/recruit/candidates/${candidate.id}`}
                  className="text-xs font-medium text-primary hover:underline underline-offset-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  View →
                </Link>
              </div>
            ))
          )}
        </div>
        </div>
      </div>

      <AddCandidateDialog open={addOpen} onOpenChange={setAddOpen} />

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1–{filtered.length} of 92
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
