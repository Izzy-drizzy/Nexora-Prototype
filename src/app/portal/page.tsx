import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Phone,
  Sparkles,
  Video,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Mock data ────────────────────────────────────────────────────────────────

const CANDIDATE = {
  name: "Amara Osei",
  initials: "AO",
  role: "Senior Data Engineer",
  company: "Nexora Solutions",
};

const PIPELINE_STAGES = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Hired",
] as const;

type Stage = (typeof PIPELINE_STAGES)[number];

const CURRENT_STAGE: Stage = "Interview";

const TIMELINE = [
  {
    id: 1,
    icon: Calendar,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    title: "Panel interview scheduled",
    detail: "Video call · Thu 19 Jun, 10:00am · 60 minutes",
    date: "12 Jun 2025",
  },
  {
    id: 2,
    icon: CheckCircle2,
    iconColor: "text-green-600",
    iconBg: "bg-green-50",
    title: "Technical screen — passed",
    detail: "Great news! You passed the technical screen.",
    date: "9 Jun 2025",
  },
  {
    id: 3,
    icon: Phone,
    iconColor: "text-teal-600",
    iconBg: "bg-teal-50",
    title: "Phone screen completed",
    detail: "30-minute intro call completed.",
    date: "6 Jun 2025",
  },
  {
    id: 4,
    icon: Sparkles,
    iconColor: "text-violet-600",
    iconBg: "bg-violet-50",
    title: "Application received",
    detail: "We received your application. AI screening in progress.",
    date: "5 Jun 2025",
  },
];

const PANEL_MEMBERS = ["DK", "SI", "MN"];

// ─── Pipeline stepper ─────────────────────────────────────────────────────────

function PipelineStepper({ current }: { current: Stage }) {
  const currentIdx = PIPELINE_STAGES.indexOf(current);
  return (
    <div className="flex items-center gap-0 mt-4">
      {PIPELINE_STAGES.map((stage, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        return (
          <div key={stage} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div
                className={cn(
                  "size-3 rounded-full border-2 transition-all",
                  isDone
                    ? "bg-primary border-primary"
                    : isActive
                    ? "bg-primary border-primary ring-4 ring-primary/20"
                    : "bg-muted border-border"
                )}
              />
              <span
                className={cn(
                  "text-xs mt-1.5 font-medium text-center",
                  isActive
                    ? "text-primary"
                    : isDone
                    ? "text-muted-foreground"
                    : "text-muted-foreground/60"
                )}
              >
                {stage}
              </span>
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <div
                className={cn(
                  "h-0.5 flex-1 mb-5 transition-all",
                  isDone ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortalPage() {
  return (
    <div className="max-w-2xl mx-auto py-6 px-4 sm:py-8 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar size="lg" className="size-12">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
            {CANDIDATE.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold">{CANDIDATE.name}</h1>
            <Badge variant="secondary" className="text-green-700 bg-green-50">
              Application active
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {CANDIDATE.role} · {CANDIDATE.company}
          </p>
        </div>
      </div>

      {/* Current stage banner */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Current stage
            </CardTitle>
            <Badge variant="default">{CURRENT_STAGE}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <PipelineStepper current={CURRENT_STAGE} />
        </CardContent>
      </Card>

      {/* Timeline */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
          Your journey so far
        </h2>
        <div className="space-y-4">
          {TIMELINE.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="flex gap-4">
                <div
                  className={cn(
                    "size-9 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    item.iconBg
                  )}
                >
                  <Icon className={cn("size-4", item.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold leading-snug">
                      {item.title}
                    </p>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* What's next card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            What&apos;s next
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Video className="size-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">
                Panel interview — Thu 19 Jun, 10:00am
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Video call · 60 minutes · Panel Round
              </p>
            </div>
          </div>

          {/* Panel members */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">Panel:</span>
            <div className="flex -space-x-1.5">
              {PANEL_MEMBERS.map((initials) => (
                <div
                  key={initials}
                  className="size-7 rounded-full bg-muted border-2 border-white flex items-center justify-center text-xs font-semibold text-muted-foreground"
                >
                  {initials}
                </div>
              ))}
            </div>
          </div>

          {/* Join button — muted (not active yet) */}
          <Button
            variant="outline"
            size="lg"
            disabled
            className="w-full"
          >
            <Video className="size-4" />
            Join video call
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              Available 5 min before
            </span>
          </Button>

          <Link
            href="/portal/schedule"
            className="inline-flex items-center text-xs text-primary hover:underline underline-offset-4 font-medium"
          >
            Need to reschedule? Pick a different slot →
          </Link>
        </CardContent>
      </Card>

      {/* Contact note */}
      <p className="text-xs text-muted-foreground text-center pb-2">
        Questions? Reply to your invite email or contact{" "}
        <a
          href="mailto:recruit@nexora.com"
          className="text-primary hover:underline underline-offset-4"
        >
          recruit@nexora.com
        </a>
      </p>
    </div>
  );
}
