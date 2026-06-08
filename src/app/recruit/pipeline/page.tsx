"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, ChevronDown, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StageMoveDialog } from "@/components/shared/stage-move-dialog";
import { CANDIDATES } from "@/lib/mock-data";
import {
  getScoreTier,
  scoreClasses,
  stageClasses,
  stageLabels,
  type PipelineStage,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

const COLUMNS: {
  stage: PipelineStage;
  count: number;
  accentColor: string;
  dotColor: string;
}[] = [
  { stage: "new",       count: 48, accentColor: "border-t-slate-300",  dotColor: "bg-slate-300"  },
  { stage: "screening", count: 21, accentColor: "border-t-amber-400",  dotColor: "bg-amber-400"  },
  { stage: "interview", count: 14, accentColor: "border-t-primary",    dotColor: "bg-primary"    },
  { stage: "offer",     count: 6,  accentColor: "border-t-teal-500",   dotColor: "bg-teal-500"   },
  { stage: "hired",     count: 3,  accentColor: "border-t-green-500",  dotColor: "bg-green-500"  },
];

const ROLE_FILTERS = [
  "All roles",
  "Sr. Data Eng.",
  "Cloud Arch.",
  "UX Researcher",
];

// Extra mock cards to fill out the kanban
const EXTRA_CARDS = [
  { id: "e1", name: "Alex Müller",    initials: "AM", role: "Sr. Data Eng.",  stage: "new"       as PipelineStage, aiScore: 73,  detail: ""                        },
  { id: "e2", name: "Nadia Ibrahim",  initials: "NI", role: "UX Researcher",  stage: "screening" as PipelineStage, aiScore: 88,  detail: ""                        },
  { id: "e3", name: "Yemi Ola",       initials: "YO", role: "Cloud Arch.",    stage: "interview" as PipelineStage, aiScore: 82,  detail: "Technical · Fri 20 Jun"  },
  { id: "e4", name: "Dele Okonkwo",   initials: "DO", role: "Sr. Data Eng.",  stage: "offer"     as PipelineStage, aiScore: 88,  detail: "Draft in progress"       },
  { id: "e5", name: "Sam Park",       initials: "SP", role: "Full-Stack Eng.",stage: "hired"     as PipelineStage, aiScore: 91,  detail: "Start: 1 Jul"            },
  { id: "e6", name: "Aisha Diallo",   initials: "AD", role: "Data Scientist", stage: "hired"     as PipelineStage, aiScore: 87,  detail: "Start: 15 Jul"           },
];

type CardData = {
  id: string;
  name: string;
  initials: string;
  role: string;
  stage: PipelineStage;
  aiScore: number | null;
  detail?: string;
};

// ─── Kanban card ─────────────────────────────────────────────────────────────

function KanbanCard({
  card,
  onMoveClick,
}: {
  card: CardData;
  onMoveClick: () => void;
}) {
  const tier = getScoreTier(card.aiScore);
  const canMove = card.stage !== "hired";

  return (
    <div className="bg-card rounded-lg border border-border p-3 hover:border-primary/40 hover:shadow-sm transition-all group space-y-2.5">
      <div className="flex items-start gap-2">
        <Avatar className="w-7 h-7 flex-shrink-0 mt-0.5">
          <AvatarFallback className="text-[10px] font-bold bg-secondary text-primary">
            {card.initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <Link
            href={`/recruit/candidates/${card.id}`}
            className="text-sm font-semibold text-foreground leading-none mb-0.5 hover:text-primary transition-colors truncate block"
          >
            {card.name}
          </Link>
          <p className="text-xs text-muted-foreground truncate">{card.role}</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        {card.aiScore !== null ? (
          <span className={cn(
            "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold",
            scoreClasses[tier]
          )}>
            <span className={cn(
              "w-1.5 h-1.5 rounded-full",
              tier === "high" ? "bg-green-500" : tier === "mid" ? "bg-amber-500" : "bg-red-500"
            )} />
            {card.aiScore}/100
          </span>
        ) : (
          <span className="text-[10px] text-muted-foreground italic">AI pending</span>
        )}

        {card.detail && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span className="text-[10px] text-muted-foreground truncate max-w-[100px]">
              {card.detail}
            </span>
          </div>
        )}
      </div>

      {canMove && (
        <button
          onClick={onMoveClick}
          className="w-full flex items-center justify-center gap-1 py-1 rounded-md text-[10px] font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-primary/20"
        >
          Move stage <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ─── Kanban column ────────────────────────────────────────────────────────────

function KanbanColumn({
  stage,
  count,
  accentColor,
  dotColor,
  cards,
  onMoveClick,
}: {
  stage: PipelineStage;
  count: number;
  accentColor: string;
  dotColor: string;
  cards: CardData[];
  onMoveClick: (card: CardData) => void;
}) {
  return (
    <div className="flex-shrink-0 w-[220px] flex flex-col">
      {/* Column header */}
      <div className={cn(
        "rounded-t-xl border border-b-0 border-border bg-card px-3 pt-3 pb-2.5 border-t-[3px]",
        accentColor
      )}>
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1.5">
            <div className={cn("w-2 h-2 rounded-full", dotColor)} />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">
              {stageLabels[stage]}
            </span>
          </div>
          <span className="text-sm font-bold text-foreground tabular-nums">{count}</span>
        </div>
      </div>

      {/* Cards area */}
      <div className="flex-1 rounded-b-xl border border-t-0 border-border bg-muted/30 p-2 space-y-2 min-h-[400px]">
        {cards.map((card) => (
          <KanbanCard key={card.id} card={card} onMoveClick={() => onMoveClick(card)} />
        ))}

        {/* Overflow indicator */}
        {count > cards.length && (
          <button className="w-full py-2 text-xs text-muted-foreground hover:text-primary transition-colors font-medium">
            + {count - cards.length} more
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const NEXT_STAGE: Partial<Record<PipelineStage, PipelineStage>> = {
  new:       "screening",
  screening: "interview",
  interview: "offer",
  offer:     "hired",
};

export default function PipelinePage() {
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [moveTarget, setMoveTarget]   = useState<CardData | null>(null);
  const [cardStages, setCardStages]   = useState<Record<string, PipelineStage>>({});

  function getStage(card: CardData): PipelineStage {
    return cardStages[card.id] ?? card.stage;
  }

  function handleMoveClick(card: CardData) {
    setMoveTarget(card);
  }

  function handleMoveConfirm() {
    if (!moveTarget) return;
    const currentStage = getStage(moveTarget);
    const next = NEXT_STAGE[currentStage];
    if (next) {
      setCardStages((prev) => ({ ...prev, [moveTarget.id]: next }));
    }
    setMoveTarget(null);
  }

  // Merge CANDIDATES + EXTRA_CARDS into a unified list
  const allCards: CardData[] = [
    ...CANDIDATES.filter((c) => c.stage !== "rejected").map((c) => ({
      id:       c.id,
      name:     c.name,
      initials: c.initials,
      role:     c.role,
      stage:    c.stage,
      aiScore:  c.aiScore,
      detail:   c.stage === "interview" ? "Panel Rd.2 · Thu 19 Jun"
              : c.stage === "offer"     ? "Sent · awaiting signature"
              : undefined,
    })),
    ...EXTRA_CARDS,
  ];

  const allCardsWithStage = allCards.map((c) => ({ ...c, stage: getStage(c) }));

  const filtered = roleFilter === "All roles"
    ? allCardsWithStage
    : allCardsWithStage.filter((c) => c.role.includes(roleFilter.replace("Sr. ", "").split(" ")[0]));

  const getCards = (stage: PipelineStage) =>
    filtered.filter((c) => c.stage === stage).slice(0, 4);

  const total = allCards.length;

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 space-y-6 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Pipeline Board</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            All active roles · {total} candidates in flight
          </p>
        </div>
      </div>

      <Separator />

      {/* Role filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {ROLE_FILTERS.map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
              roleFilter === role
                ? "border-primary bg-secondary text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {role}
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>
        ))}

        <div className="hidden sm:flex ml-auto items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-300" /> Applied (48)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" /> Screening (21)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary" /> Interview (14)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500" /> Offer (6)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" /> Hired (3)
          </span>
        </div>
      </div>

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-6">
        {COLUMNS.map((col) => (
          <KanbanColumn
            key={col.stage}
            stage={col.stage}
            count={col.count}
            accentColor={col.accentColor}
            dotColor={col.dotColor}
            cards={getCards(col.stage)}
            onMoveClick={handleMoveClick}
          />
        ))}
      </div>

      {/* Bottom note */}
      <p className="text-xs text-muted-foreground">
        Moving a card between stages sends an automated status notification to the candidate.
      </p>

      {/* Stage move dialog */}
      {moveTarget && NEXT_STAGE[getStage(moveTarget)] && (
        <StageMoveDialog
          open={!!moveTarget}
          onOpenChange={(open) => { if (!open) setMoveTarget(null); }}
          candidateName={moveTarget.name}
          fromStage={getStage(moveTarget)}
          toStage={NEXT_STAGE[getStage(moveTarget)]!}
          onConfirm={handleMoveConfirm}
        />
      )}
    </div>
  );
}
