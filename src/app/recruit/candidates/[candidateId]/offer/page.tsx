"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight, Eye, Clock, Send, CheckCircle2, XCircle,
  RefreshCw, AlertCircle, Building2, MapPin, Calendar,
  FileText, Banknote, ScrollText, Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { WithdrawOfferDialog, AcceptOfferDialog } from "@/components/shared/offer-dialogs";
import { CANDIDATES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const OFFER_DETAILS = [
  { icon: Building2,  label: "Role",         value: "Cloud Architect"    },
  { icon: Building2,  label: "Department",   value: "Digital Innovation" },
  { icon: MapPin,     label: "Location",     value: "Berlin, Germany"    },
  { icon: Calendar,   label: "Start date",   value: "1 August 2025"      },
  { icon: Banknote,   label: "Salary",       value: "€[redacted] / year" },
  { icon: ScrollText, label: "Contract",     value: "Permanent"          },
  { icon: Timer,      label: "Offer expiry", value: "19 June 2025"       },
];

type TrackEvent = { id: string; date: string; title: string; body: string; type: "sent" | "opened" | "reminder" };
const TRACKING_EVENTS: TrackEvent[] = [
  { id: "te1", date: "Today · 11:00",  title: "Auto-reminder sent", body: "Expiry in 7 days — automated follow-up triggered.", type: "reminder" },
  { id: "te2", date: "9 Jun · 15:22", title: "Offer opened",       body: "Portal view · 3 min 40s read time",                 type: "opened"   },
  { id: "te3", date: "9 Jun · 10:00", title: "Offer sent",         body: "Sent by James O. via portal",                        type: "sent"     },
];
const TRACK_CONFIG: Record<TrackEvent["type"], { icon: React.ElementType; color: string }> = {
  reminder: { icon: RefreshCw, color: "bg-amber-50 text-amber-600" },
  opened:   { icon: Eye,       color: "bg-teal-50 text-teal-600"   },
  sent:     { icon: Send,      color: "bg-primary/10 text-primary"  },
};

type OfferStatus = "sent" | "accepted" | "withdrawn";
const STATUS_CONFIG: Record<OfferStatus, { label: string; className: string }> = {
  sent:     { label: "Sent — awaiting signature",  className: "bg-amber-50 text-amber-700 border-amber-200"  },
  accepted: { label: "Accepted",                   className: "bg-green-50 text-green-700 border-green-200"  },
  withdrawn:{ label: "Withdrawn",                  className: "bg-muted text-muted-foreground border-border" },
};

export default function OfferPage() {
  const params    = useParams();
  const id        = params.candidateId as string;
  const candidate = CANDIDATES.find((c) => c.id === id) ?? CANDIDATES[4];

  const [offerStatus, setOfferStatus] = useState<OfferStatus>("sent");
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [acceptOpen, setAcceptOpen]     = useState(false);

  const status = STATUS_CONFIG[offerStatus];

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link href="/recruit/candidates" className="hover:text-primary transition-colors">Candidates</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/recruit/candidates/${candidate.id}`} className="hover:text-primary transition-colors">
          {candidate.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium">Offer letter</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 flex-shrink-0">
            <AvatarFallback className="font-bold bg-secondary text-primary">{candidate.initials}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight leading-none mb-1">{candidate.name}</h1>
            <p className="text-sm text-muted-foreground">Offer letter · {candidate.role}</p>
          </div>
        </div>
        <Badge variant="outline" className={cn("text-sm font-semibold px-3 py-1.5 h-auto", status.className)}>
          {status.label}
        </Badge>
      </div>

      <Separator />

      {/* Accepted success state */}
      {offerStatus === "accepted" && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-green-800">Offer accepted — {candidate.name} is Hired!</p>
              <p className="text-xs text-green-700 mt-0.5">Onboarding sequence has been triggered. Hiring manager notified.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-[1fr_320px] gap-6 items-start">
        {/* Left — offer document */}
        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm font-bold">Nexora Solutions · Offer of Employment</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Official offer document</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <Separator className="mb-4" />
              <div className="flex items-center gap-3 py-3 border-b border-border">
                <Avatar className="w-9 h-9 flex-shrink-0">
                  <AvatarFallback className="text-xs font-bold bg-secondary text-primary">{candidate.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-0.5">Candidate</p>
                  <p className="text-sm font-semibold text-foreground">{candidate.name}</p>
                </div>
              </div>
              <div className="divide-y divide-border">
                {OFFER_DETAILS.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-sm">{label}</span>
                    </div>
                    <span className={cn("text-sm font-semibold", label === "Salary" ? "text-muted-foreground italic" : "text-foreground")}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <Separator className="my-4" />
              {offerStatus === "sent" && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-teal-50 border border-teal-100">
                  <Eye className="w-4 h-4 text-teal-600 flex-shrink-0" />
                  <p className="text-sm text-teal-700 font-medium">Candidate has opened the offer — 3 min 40s read time</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {offerStatus === "sent" && (
            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="outline" className="gap-2 h-9"><RefreshCw className="w-4 h-4" />Resend</Button>
              <Button
                variant="outline"
                className="gap-2 h-9 border-green-300 text-green-700 hover:bg-green-50"
                onClick={() => setAcceptOpen(true)}
              >
                <CheckCircle2 className="w-4 h-4" />Mark accepted
              </Button>
              <Button
                variant="outline"
                className="gap-2 h-9 border-red-300 text-destructive hover:bg-red-50"
                onClick={() => setWithdrawOpen(true)}
              >
                <XCircle className="w-4 h-4" />Withdraw
              </Button>
            </div>
          )}
        </div>

        {/* Right — status + tracking */}
        <div className="space-y-4">
          {offerStatus === "sent" && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <p className="text-sm font-semibold text-amber-800">Next actions</p>
                </div>
                <p className="text-xs text-amber-700 leading-relaxed">
                  Expires <span className="font-semibold">19 Jun</span>. Auto-escalation routes to hiring manager if no response.
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                Offer status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {TRACKING_EVENTS.map((event, i) => {
                const { icon: Icon, color } = TRACK_CONFIG[event.type];
                return (
                  <div key={event.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn("w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1", color)}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {i < TRACKING_EVENTS.length - 1 && <div className="w-px flex-1 bg-border my-1" />}
                    </div>
                    <div className="pb-4 flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground mb-0.5">{event.date}</p>
                      <p className="text-xs font-semibold text-foreground leading-none mb-0.5">{event.title}</p>
                      <p className="text-xs text-muted-foreground leading-snug">{event.body}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {offerStatus === "sent" && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-muted border border-border">
              <Timer className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">7 days</span> until offer expires
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <WithdrawOfferDialog
        open={withdrawOpen}
        onOpenChange={setWithdrawOpen}
        candidateName={candidate.name}
        onConfirm={() => setOfferStatus("withdrawn")}
      />
      <AcceptOfferDialog
        open={acceptOpen}
        onOpenChange={setAcceptOpen}
        candidateName={candidate.name}
        roleName={candidate.role}
        onConfirm={() => setOfferStatus("accepted")}
      />
    </div>
  );
}
