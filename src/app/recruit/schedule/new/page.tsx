"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Video,
  Phone,
  MapPin,
  Clock,
  Send,
  Eye,
  UserCheck,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CANDIDATES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

// ─── Types & constants ────────────────────────────────────────────────────────

type SlotStatus = "available" | "blocked" | "offered" | "all-blocked";
type Format = "video" | "in-person" | "phone";
type Duration = 30 | 60 | 90;

interface Slot {
  time: string;
  mon: SlotStatus;
  tue: SlotStatus;
  wed: SlotStatus;
  thu: SlotStatus;
  fri: SlotStatus;
}

const WEEK = [
  { key: "mon", label: "Mon 16" },
  { key: "tue", label: "Tue 17" },
  { key: "wed", label: "Wed 18" },
  { key: "thu", label: "Thu 19" },
  { key: "fri", label: "Fri 20" },
] as const;

type DayKey = (typeof WEEK)[number]["key"];

const SLOTS: Slot[] = [
  { time: "09:00", mon: "blocked",   tue: "available", wed: "blocked",   thu: "offered",   fri: "available"   },
  { time: "11:00", mon: "available", tue: "blocked",   wed: "available", thu: "available", fri: "blocked"     },
  { time: "14:00", mon: "available", tue: "available", wed: "all-blocked",thu: "offered",  fri: "available"   },
];

const PANEL = [
  { initials: "ST", name: "Sarah T.",  role: "Lead",      color: "bg-primary/10 text-primary"   },
  { initials: "JO", name: "James O.",  role: "Recruiter",  color: "bg-teal-50 text-teal-700"     },
  { initials: "FA", name: "Fatima A.", role: "Interviewer", color: "bg-violet-50 text-violet-700" },
];

const FORMAT_OPTIONS: { value: Format; label: string; icon: React.ElementType }[] = [
  { value: "video",     label: "Video call",      icon: Video  },
  { value: "in-person", label: "In-person · HQ",  icon: MapPin },
  { value: "phone",     label: "Phone screen",    icon: Phone  },
];

const DURATION_OPTIONS: Duration[] = [30, 60, 90];

// ─── Slot cell ────────────────────────────────────────────────────────────────

function SlotCell({
  status,
  isSelected,
  onClick,
}: {
  status: SlotStatus;
  isSelected: boolean;
  onClick: () => void;
}) {
  if (status === "all-blocked") {
    return (
      <div className="h-10 rounded-lg bg-muted/80 border border-border flex items-center justify-center">
        <span className="text-[10px] text-muted-foreground font-medium">All blocked</span>
      </div>
    );
  }

  if (status === "blocked") {
    return (
      <div className="h-10 rounded-lg bg-muted border border-border flex items-center justify-center">
        <span className="text-[10px] text-muted-foreground">Blocked</span>
      </div>
    );
  }

  if (status === "offered") {
    return (
      <div className={cn(
        "h-10 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all",
        isSelected
          ? "border-primary bg-primary text-white"
          : "border-primary/60 bg-primary/5 text-primary hover:bg-primary/10"
      )} onClick={onClick}>
        <span className="text-[10px] font-semibold">
          {isSelected ? "✓ Selected" : "Offered"}
        </span>
      </div>
    );
  }

  // available
  return (
    <div
      onClick={onClick}
      className={cn(
        "h-10 rounded-lg border flex items-center justify-center cursor-pointer transition-all",
        isSelected
          ? "border-primary bg-primary text-white"
          : "border-border bg-card hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary"
      )}
    >
      <span className="text-[10px] font-medium">
        {isSelected ? "✓ Selected" : "Available"}
      </span>
    </div>
  );
}

// ─── Inner component (uses useSearchParams) ───────────────────────────────────

function ScheduleContent() {
  const searchParams  = useSearchParams();
  const candidateId   = searchParams.get("candidate") ?? "c1";
  const candidate     = CANDIDATES.find((c) => c.id === candidateId) ?? CANDIDATES[0];

  const [offeredSlots, setOfferedSlots]  = useState<Set<string>>(new Set());
  const [format, setFormat]              = useState<Format>("video");
  const [duration, setDuration]          = useState<Duration>(60);
  const [showPreview, setShowPreview]    = useState(false);
  const [sent, setSent]                  = useState(false);
  const [sending, setSending]            = useState(false);

  function toggleSlot(time: string, day: DayKey) {
    const key = `${day}-${time}`;
    setOfferedSlots((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  const offeredCount = offeredSlots.size;

  async function handleSend() {
    if (offeredCount === 0) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 800));
    setSending(false);
    setSent(true);
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (sent) {
    return (
      <div className="px-8 py-16 max-w-lg mx-auto flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">Slot options sent!</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {candidate.name} has been sent <span className="font-semibold text-foreground">{offeredCount} time slot{offeredCount > 1 ? "s" : ""}</span> to choose from.
            Once they confirm, all panel members will receive a calendar invite automatically.
          </p>
        </div>
        <div className="w-full rounded-xl border border-border bg-card p-4 text-left space-y-2">
          {[
            { icon: Calendar, label: "Interview type",  value: `Panel Round 2 · ${candidate.role}` },
            { icon: Clock,    label: "Duration",        value: `${duration} minutes`               },
            { icon: Video,    label: "Format",          value: format.replace("-", " ")             },
            { icon: Send,     label: "Slots offered",   value: `${offeredCount} options sent`       },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </div>
              <span className="font-medium text-foreground capitalize">{value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 w-full">
          <Link
            href={`/recruit/candidates/${candidate.id}`}
            className="flex-1 inline-flex items-center justify-center h-9 px-4 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Back to profile
          </Link>
          <Link
            href="/recruit/interviews"
            className="flex-1 inline-flex items-center justify-center h-9 px-4 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            View interviews
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href={`/recruit/candidates/${candidate.id}`} className="hover:text-primary transition-colors flex items-center gap-1">
          <ChevronLeft className="w-3.5 h-3.5" />
          {candidate.name}
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Schedule interview</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Panel Round 2 · {candidate.role}
        </p>
      </div>

      <Separator />

      <div className="grid grid-cols-[1fr_300px] gap-6 items-start">
        {/* Left — calendar + options */}
        <div className="space-y-5">

          {/* Format + duration row */}
          <div className="flex items-center gap-6 flex-wrap">
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Interview format
              </p>
              <div className="flex items-center gap-1.5">
                {FORMAT_OPTIONS.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setFormat(value)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                      format === value
                        ? "border-primary bg-secondary text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Duration
              </p>
              <div className="flex items-center gap-1.5">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={cn(
                      "flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                      duration === d
                        ? "border-primary bg-secondary text-primary"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    <Clock className="w-3 h-3" />
                    {d} min
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Week header */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">
                  Available slots — week of 16–20 Jun
                </CardTitle>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0">
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Legend */}
              <div className="flex items-center gap-4 pb-1">
                {[
                  { color: "bg-primary",    label: "Selected"  },
                  { color: "border-2 border-primary/60 bg-primary/5", label: "Offered" },
                  { color: "bg-card border border-border", label: "Available" },
                  { color: "bg-muted border border-border", label: "Blocked"   },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={cn("w-3 h-3 rounded-sm", color)} />
                    <span className="text-[10px] text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-[48px_repeat(5,1fr)] gap-2">
                <div />
                {WEEK.map(({ label }) => (
                  <div key={label} className="text-center">
                    <span className="text-xs font-semibold text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>

              {/* Slot rows */}
              {SLOTS.map((slot) => (
                <div key={slot.time} className="grid grid-cols-[48px_repeat(5,1fr)] gap-2 items-center">
                  <span className="text-xs font-semibold text-muted-foreground text-right pr-2">
                    {slot.time}
                  </span>
                  {WEEK.map(({ key }) => {
                    const slotKey = `${key}-${slot.time}`;
                    return (
                      <SlotCell
                        key={key}
                        status={slot[key]}
                        isSelected={offeredSlots.has(slotKey)}
                        onClick={() => {
                          if (slot[key] !== "blocked" && slot[key] !== "all-blocked") {
                            toggleSlot(slot.time, key);
                          }
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Invite preview toggle */}
          <button
            onClick={() => setShowPreview((v) => !v)}
            className="flex items-center gap-2 text-sm text-primary hover:underline underline-offset-4 font-medium"
          >
            <Eye className="w-4 h-4" />
            {showPreview ? "Hide" : "Preview"} automated invite
          </button>

          {/* Invite preview */}
          {showPreview && (
            <Card className="border-border bg-muted/30">
              <CardContent className="p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Automated invite preview — sent when you confirm
                </p>
                <Separator />
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Subject:</span>{" "}
                    Choose your interview time — {candidate.role}, Nexora Solutions
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">To:</span>{" "}
                    {candidate.name.toLowerCase().replace(" ", ".")}@email.com
                  </p>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                  Hi {candidate.name.split(" ")[0]}, we&apos;d love to invite you to a{" "}
                  <span className="font-medium text-foreground">{duration}-minute</span> panel
                  interview. Please select a time that works for you using the link below. Once
                  confirmed, joining details will be sent automatically.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right — panel + actions */}
        <div className="space-y-4">
          {/* Panel members */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-muted-foreground" />
                Panel members
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 pt-0">
              {PANEL.map((member) => (
                <div key={member.name} className="flex items-center gap-2.5">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={cn("text-xs font-semibold", member.color)}>
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground leading-none">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  {member.role === "Lead" && (
                    <Badge variant="secondary" className="text-[10px] px-1.5">Lead</Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className={cn(offeredCount > 0 ? "border-primary/30 bg-primary/[0.02]" : "")}>
            <CardContent className="p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Summary
              </p>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Slots offered</span>
                  <span className={cn("font-bold", offeredCount > 0 ? "text-primary" : "text-muted-foreground")}>
                    {offeredCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Format</span>
                  <span className="font-medium text-foreground capitalize">{format.replace("-", " ")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium text-foreground">{duration} min</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Panel</span>
                  <span className="font-medium text-foreground">3 members</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-2">
            <Button
              className="w-full gap-2 h-9"
              disabled={offeredCount === 0 || sending}
              onClick={handleSend}
            >
              {sending ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send slot options to candidate
                </>
              )}
            </Button>
            <Link
              href={`/recruit/candidates/${candidate.id}`}
              className="inline-flex items-center justify-center w-full h-9 px-4 rounded-md border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </Link>
          </div>

          {offeredCount === 0 && (
            <p className="text-xs text-muted-foreground text-center">
              Select at least one slot to send options
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page wrapper (Suspense for useSearchParams) ──────────────────────────────

export default function SchedulePage() {
  return (
    <Suspense>
      <ScheduleContent />
    </Suspense>
  );
}
