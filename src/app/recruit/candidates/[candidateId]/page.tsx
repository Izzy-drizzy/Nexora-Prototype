"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import {
  MapPin,
  Link2,
  Calendar,
  Sparkles,
  CheckCircle2,
  XCircle,
  CalendarClock,
  ChevronRight,
  AlertTriangle,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CANDIDATES } from "@/lib/mock-data";
import {
  getScoreTier,
  scoreClasses,
  stageClasses,
  stageLabels,
  type PipelineStage,
} from "@/lib/design-tokens";
import { RejectDialog } from "@/components/shared/reject-dialog";
import { cn } from "@/lib/utils";

const TIMELINE = [
  { id: "t1", date: "11 Jun · 14:30", title: "Panel Interview Rd. 2 confirmed",  body: "Video · Thu 13 Jun, 10:00am · Sarah T., James O., Fatima A.", type: "interview" as const },
  { id: "t2", date: "8 Jun · 09:12",  title: "Technical screen — passed",        body: "Scorecard: 4.2/5 · Strong SQL, solid system design, communicates clearly.", type: "passed" as const },
  { id: "t3", date: "5 Jun · 11:00",  title: "Phone screen completed",           body: "30 min · Sarah T. · Advanced to technical screen.", type: "call" as const },
  { id: "t4", date: "3 Jun · 08:45",  title: "Application received",             body: "Source: LinkedIn · AI match score generated: 91/100.", type: "apply" as const },
];

const TIMELINE_ICON: Record<string, { icon: React.ElementType; color: string }> = {
  interview: { icon: Calendar,     color: "bg-primary/10 text-primary"   },
  passed:    { icon: CheckCircle2, color: "bg-green-50 text-green-600"   },
  call:      { icon: CalendarClock,color: "bg-teal-50 text-teal-600"     },
  apply:     { icon: Sparkles,     color: "bg-violet-50 text-violet-600" },
};

function ScoreRing({ score }: { score: number | null }) {
  const tier         = getScoreTier(score);
  const ringColor    = tier === "high" ? "#16a34a" : tier === "mid" ? "#d97706" : tier === "low" ? "#dc2626" : "#94a3b8";
  const pct          = score ?? 0;
  const circumference = 2 * Math.PI * 22;
  const offset       = circumference - (pct / 100) * circumference;

  return (
    <div className="relative w-16 h-16 flex-shrink-0">
      <svg className="w-16 h-16 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="22" fill="none" stroke="#e2e8f0" strokeWidth="3" />
        <circle cx="24" cy="24" r="22" fill="none" stroke={ringColor} strokeWidth="3"
          strokeDasharray={circumference} strokeDashoffset={score ? offset : circumference}
          strokeLinecap="round" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-sm font-bold text-foreground leading-none">{score ?? "—"}</span>
        <span className="text-[9px] text-muted-foreground font-medium">/ 100</span>
      </div>
    </div>
  );
}

export default function ApplicantProfilePage() {
  const params     = useParams();
  const id         = params.candidateId as string;
  const candidate  = CANDIDATES.find((c) => c.id === id) ?? CANDIDATES[0];

  const [activeTab, setActiveTab]     = useState("timeline");
  const [rejectOpen, setRejectOpen]   = useState(false);
  const [currentStage, setCurrentStage] = useState<PipelineStage>(candidate.stage);
  const [advancing, setAdvancing]     = useState(false);

  const tier = getScoreTier(candidate.aiScore);

  const NEXT_STAGE: Partial<Record<PipelineStage, PipelineStage>> = {
    new:       "screening",
    screening: "interview",
    interview: "offer",
    offer:     "hired",
  };

  const nextStage = NEXT_STAGE[currentStage];

  async function handleAdvance() {
    if (!nextStage) return;
    setAdvancing(true);
    await new Promise((r) => setTimeout(r, 700));
    setAdvancing(false);
    setCurrentStage(nextStage);
    toast.success(`${candidate.name} advanced to ${stageLabels[nextStage]}`, {
      description: "Automated notification sent to candidate.",
    });
  }

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/recruit/jobs" className="hover:text-primary transition-colors">Jobs</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/recruit/jobs/j1/candidates" className="hover:text-primary transition-colors">
          {candidate.role}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium">{candidate.name}</span>
      </div>

      {/* Header card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
            <Avatar className="w-16 h-16 flex-shrink-0">
              <AvatarFallback className="text-xl font-bold bg-secondary text-primary">
                {candidate.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-xl font-bold text-foreground tracking-tight leading-none mb-1">
                    {candidate.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">{candidate.role}</p>
                </div>
                {/* Stage pill — updates inline */}
                <span className={cn(
                  "inline-flex items-center px-2.5 py-1 rounded-md text-sm font-semibold flex-shrink-0 transition-all",
                  stageClasses[currentStage]
                )}>
                  {stageLabels[currentStage]}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /><span>Applied {candidate.appliedDate}</span></div>
                <div className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /><span>{candidate.location} → Remote</span></div>
                <div className="flex items-center gap-1"><Link2 className="w-3.5 h-3.5" /><span>{candidate.source}</span></div>
                <span className="font-medium text-foreground">{candidate.recruiter}</span>
              </div>
            </div>
            <ScoreRing score={candidate.aiScore} />
          </div>

          <Separator className="my-5" />

          {/* Action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={`/recruit/schedule/new?candidate=${candidate.id}`}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <CalendarClock className="w-4 h-4" />
              Schedule interview
            </Link>

            {nextStage && currentStage !== "hired" && currentStage !== "rejected" && (
              <Button
                variant="outline"
                className="gap-2 h-9 border-green-300 text-green-700 hover:bg-green-50 hover:border-green-400"
                onClick={handleAdvance}
                disabled={advancing}
              >
                {advancing ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-green-400/40 border-t-green-600 rounded-full animate-spin" />
                    Advancing…
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Advance to {stageLabels[nextStage]}
                  </>
                )}
              </Button>
            )}

            {currentStage === "hired" && (
              <Badge className="gap-1.5 bg-green-50 text-green-700 border-green-200 px-3 py-1.5 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                Hired
              </Badge>
            )}

            {currentStage !== "rejected" && currentStage !== "hired" && (
              <Button
                variant="outline"
                className="gap-2 h-9 border-red-300 text-destructive hover:bg-red-50 hover:border-red-400"
                onClick={() => setRejectOpen(true)}
              >
                <XCircle className="w-4 h-4" />
                Reject &amp; notify
              </Button>
            )}

            {currentStage === "rejected" && (
              <Badge className="gap-1.5 bg-red-50 text-destructive border-red-200 px-3 py-1.5 text-sm font-semibold">
                <XCircle className="w-4 h-4" />
                Rejected
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI summary */}
      {candidate.aiScore && currentStage !== "rejected" && (
        <Card className="border-primary/20 bg-primary/[0.02]">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm font-semibold text-foreground">AI screening summary</p>
                  <span className={cn("text-xs font-bold px-2 py-0.5 rounded-md", scoreClasses[tier])}>
                    {candidate.aiScore}/100
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Strong technical match on core stack (Spark, Airflow, dbt). 6 yrs experience exceeds
                  the 5yr requirement. Minor gap: no direct financial services domain experience.{" "}
                  <span className="font-medium text-foreground">Recommended for technical screen</span> —
                  override if domain experience is a hard requirement for this role.
                </p>
                <div className="flex items-center gap-1.5 mt-3">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  <p className="text-xs text-muted-foreground">AI summary is a starting point — the final decision is yours.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-9 bg-muted p-1 w-full overflow-x-auto flex">
          {["timeline", "cv-skills", "scorecards", "messages", "notes"].map((tab) => (
            <TabsTrigger key={tab} value={tab} className="text-xs capitalize px-3">
              {tab.replace("-", " & ")}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="timeline" className="mt-4">
          <div className="relative space-y-0">
            {TIMELINE.map((event, i) => {
              const { icon: Icon, color } = TIMELINE_ICON[event.type];
              return (
                <div key={event.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1", color)}>
                      <Icon className="w-4 h-4" />
                    </div>
                    {i < TIMELINE.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                  </div>
                  <div className="pb-6 flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-1">{event.date}</p>
                    <p className="text-sm font-semibold text-foreground leading-none mb-1">{event.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{event.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {["cv-skills", "scorecards", "messages", "notes"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <Card>
              <CardContent className="p-8 flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Star className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground capitalize">{tab.replace("-", " & ")}</p>
                <p className="text-xs text-muted-foreground max-w-xs">
                  {tab === "cv-skills"   && "Full CV viewer and AI-extracted skills breakdown will appear here."}
                  {tab === "scorecards"  && "Structured feedback from each interviewer appears here after interviews."}
                  {tab === "messages"    && "All system and manual messages sent to this candidate."}
                  {tab === "notes"       && "Internal recruiter and hiring manager notes visible only to the team."}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Reject dialog */}
      <RejectDialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        candidateName={candidate.name}
        roleName={candidate.role}
        onConfirm={() => setCurrentStage("rejected")}
      />
    </div>
  );
}
