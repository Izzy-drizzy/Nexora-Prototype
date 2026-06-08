"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  SlidersHorizontal,
} from "lucide-react";
import { PostJobSheet, type NewJobData } from "@/components/shared/post-job-sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { JOBS, type Job } from "@/lib/mock-data";
import { jobStatusClasses, jobStatusLabels, type JobStatus } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

const STATUS_TABS: { label: string; value: "all" | JobStatus }[] = [
  { label: "All (34)",    value: "all"    },
  { label: "Active (18)", value: "active" },
  { label: "Paused (4)",  value: "paused" },
  { label: "Closed (12)", value: "closed" },
];

export default function JobsPage() {
  const [activeTab, setActiveTab] = useState<"all" | JobStatus>("all");
  const [search, setSearch] = useState("");
  const [postJobOpen, setPostJobOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(JOBS);

  function handlePublish(data: NewJobData) {
    const newJob: Job = {
      id:         `j${Date.now()}`,
      title:      data.title,
      department: data.department,
      location:   data.location,
      applied:    0,
      inPipeline: 0,
      posted:     "Just now",
      status:     "active",
    };
    setJobs((prev) => [newJob, ...prev]);
  }

  const filtered = jobs.filter((job) => {
    const matchesTab = activeTab === "all" || job.status === activeTab;
    const matchesSearch =
      search.trim() === "" ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.department.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Job Postings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {jobs.filter((j) => j.status === "active").length} active · {jobs.filter((j) => j.status === "paused").length} paused · {jobs.filter((j) => j.status === "closed").length} closed this quarter
          </p>
        </div>
        <Button className="gap-2 h-9 w-fit" onClick={() => setPostJobOpen(true)}>
          <Plus className="w-4 h-4" />
          Post a job
        </Button>
      </div>

      <Separator />

      {/* Tabs + search row */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Status tabs */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1 flex-wrap">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                activeTab === tab.value
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search + filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:flex-none">
            <Input
              placeholder="Search roles, departments…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full sm:w-56 text-sm"
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <div className="min-w-[800px]">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1.2fr_1fr_80px_80px_100px_90px_80px] gap-4 px-5 py-3 bg-muted/50 border-b border-border">
          {["Role", "Department", "Location", "Applied", "In pipeline", "Posted", "Status", ""].map(
            (col) => (
              <span key={col} className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {col}
              </span>
            )
          )}
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          {filtered.map((job) => (
            <div
              key={job.id}
              className="grid grid-cols-[2fr_1.2fr_1fr_80px_80px_100px_90px_80px] gap-4 items-center px-5 py-3.5 hover:bg-muted/30 transition-colors group"
            >
              {/* Role */}
              <div className="min-w-0">
                <Link
                  href={`/recruit/jobs/${job.id}/candidates`}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block"
                >
                  {job.title}
                </Link>
              </div>

              {/* Department */}
              <span className="text-sm text-muted-foreground truncate">{job.department}</span>

              {/* Location */}
              <div className="flex items-center gap-1 min-w-0">
                <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-muted-foreground truncate">{job.location}</span>
              </div>

              {/* Applied */}
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground tabular-nums">{job.applied}</span>
              </div>

              {/* In pipeline */}
              <span className={cn(
                "text-sm font-semibold tabular-nums",
                job.inPipeline > 0 ? "text-primary" : "text-muted-foreground"
              )}>
                {job.inPipeline > 0 ? job.inPipeline : "—"}
              </span>

              {/* Posted */}
              <span className="text-sm text-muted-foreground">{job.posted}</span>

              {/* Status */}
              <Badge
                variant="secondary"
                className={cn("text-xs font-medium w-fit", jobStatusClasses[job.status])}
              >
                {jobStatusLabels[job.status]}
              </Badge>

              {/* Action */}
              <Link
                href={`/recruit/jobs/${job.id}/candidates`}
                className="text-xs font-medium text-primary hover:underline underline-offset-4 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                View →
              </Link>
            </div>
          ))}
        </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing 1–{filtered.length} of {filtered.length}
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" disabled>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <PostJobSheet open={postJobOpen} onOpenChange={setPostJobOpen} onPublish={handlePublish} />
    </div>
  );
}
