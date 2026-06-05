"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Video, CheckCircle2, Calendar } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Mock data ────────────────────────────────────────────────────────────────

const SLOTS = [
  { id: "a", day: "Mon", date: "16 Jun", time: "09:00am" },
  { id: "b", day: "Tue", date: "17 Jun", time: "11:00am" },
  { id: "c", day: "Thu", date: "19 Jun", time: "10:00am" },
  { id: "d", day: "Fri", date: "20 Jun", time: "2:00pm" },
] as const;

type SlotId = (typeof SLOTS)[number]["id"];

// ─── Slot card ────────────────────────────────────────────────────────────────

function SlotCard({
  slot,
  selected,
  onSelect,
}: {
  slot: (typeof SLOTS)[number];
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all",
        selected
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "border-border bg-white hover:border-primary/40 hover:bg-muted/40"
      )}
    >
      {/* Radio indicator */}
      <div
        className={cn(
          "size-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
          selected ? "border-primary" : "border-border"
        )}
      >
        {selected && (
          <div className="size-2.5 rounded-full bg-primary" />
        )}
      </div>

      {/* Day badge */}
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg px-3 py-2 min-w-14 text-center",
          selected ? "bg-primary/10" : "bg-muted"
        )}
      >
        <span
          className={cn(
            "text-xs font-medium uppercase tracking-wide",
            selected ? "text-primary" : "text-muted-foreground"
          )}
        >
          {slot.day}
        </span>
        <span
          className={cn(
            "text-sm font-bold leading-tight",
            selected ? "text-primary" : "text-foreground"
          )}
        >
          {slot.date}
        </span>
      </div>

      {/* Time */}
      <div>
        <p className={cn("text-lg font-bold", selected ? "text-primary" : "text-foreground")}>
          {slot.time}
        </p>
        <p className="text-xs text-muted-foreground">60-minute panel interview</p>
      </div>
    </button>
  );
}

// ─── Success view ─────────────────────────────────────────────────────────────

function SuccessView({ slot }: { slot: (typeof SLOTS)[number] }) {
  return (
    <div className="max-w-md mx-auto text-center space-y-6 py-8">
      <div className="flex justify-center">
        <div className="size-16 rounded-full bg-green-50 flex items-center justify-center">
          <CheckCircle2 className="size-8 text-green-600" />
        </div>
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold">Interview confirmed!</h2>
        <p className="text-muted-foreground text-sm">
          Your slot has been reserved. A calendar invite is on its way.
        </p>
      </div>

      {/* Confirmed slot summary */}
      <Card>
        <CardContent className="pt-4 space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <Calendar className="size-4 text-primary shrink-0" />
            <span className="font-semibold">
              {slot.day} {slot.date} · {slot.time}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Video className="size-4 text-primary shrink-0" />
            <span className="text-muted-foreground">
              Video call · 60 minutes · Panel Round 2
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="inline-flex items-center justify-center h-9 px-4 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors gap-2"
          onClick={() => alert("Calendar invite sent! (demo)")}
        >
          <Calendar className="size-4" />
          Add to calendar
        </button>
        <Link
          href="/portal"
          className="inline-flex items-center justify-center gap-1.5 text-sm text-primary hover:underline underline-offset-4 font-medium"
        >
          <ArrowLeft className="size-3.5" />
          Back to my application
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SchedulePage() {
  const [selectedSlot, setSelectedSlot] = useState<SlotId | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const slot = SLOTS.find((s) => s.id === selectedSlot) ?? null;

  if (confirmed && slot) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-6">
        <SuccessView slot={slot} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-6 space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/portal"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to my application
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Choose your interview time</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Select one slot that works best for you. Once confirmed, you&apos;ll
          receive a calendar invite.
        </p>
      </div>

      {/* Candidate info */}
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">Amara Osei</span> ·
        Senior Data Engineer at Nexora Solutions
      </p>

      {/* Format info card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Interview format</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 text-sm">
            <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Video className="size-4 text-primary" />
            </div>
            <span className="font-medium">
              Video call · 60 minutes · Panel Round 2
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Slot selection */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Available slots
        </h2>
        {SLOTS.map((slot) => (
          <SlotCard
            key={slot.id}
            slot={slot}
            selected={selectedSlot === slot.id}
            onSelect={() => setSelectedSlot(slot.id)}
          />
        ))}
      </div>

      {/* Confirm button */}
      <div className="pt-2">
        <Button
          size="lg"
          className="w-full"
          disabled={!selectedSlot}
          onClick={() => setConfirmed(true)}
        >
          Confirm slot
        </Button>
        {!selectedSlot && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            Select a time slot to continue
          </p>
        )}
      </div>
    </div>
  );
}
