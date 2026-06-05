/**
 * Nexora Design Tokens
 *
 * Centralised reference for semantic values used in dynamic contexts
 * (e.g. recharts fill props, inline styles, conditional class logic).
 *
 * For static Tailwind usage prefer the CSS variable utility classes
 * defined in globals.css (score-high, stage-interview, etc.)
 */

// ─── AI Score thresholds ─────────────────────────────────────────────────────

export type ScoreTier = "high" | "mid" | "low" | "pending";

export function getScoreTier(score: number | null | undefined): ScoreTier {
  if (score == null) return "pending";
  if (score >= 80) return "high";
  if (score >= 60) return "mid";
  return "low";
}

export const scoreClasses: Record<ScoreTier, string> = {
  high:    "score-high",
  mid:     "score-mid",
  low:     "score-low",
  pending: "bg-muted text-muted-foreground",
};

export const scoreLabels: Record<ScoreTier, string> = {
  high:    "Strong match",
  mid:     "Partial match",
  low:     "Weak match",
  pending: "Pending",
};

// ─── Pipeline stages ─────────────────────────────────────────────────────────

export type PipelineStage =
  | "new"
  | "screening"
  | "interview"
  | "offer"
  | "hired"
  | "rejected";

export const PIPELINE_STAGES: PipelineStage[] = [
  "new",
  "screening",
  "interview",
  "offer",
  "hired",
  "rejected",
];

export const stageClasses: Record<PipelineStage, string> = {
  new:       "stage-new",
  screening: "stage-screening",
  interview: "stage-interview",
  offer:     "stage-offer",
  hired:     "stage-hired",
  rejected:  "stage-rejected",
};

export const stageLabels: Record<PipelineStage, string> = {
  new:       "New",
  screening: "Screening",
  interview: "Interview",
  offer:     "Offer",
  hired:     "Hired",
  rejected:  "Rejected",
};

// ─── Job status ───────────────────────────────────────────────────────────────

export type JobStatus = "active" | "paused" | "closed";

export const jobStatusClasses: Record<JobStatus, string> = {
  active: "bg-green-50 text-green-700",
  paused: "bg-amber-50 text-amber-700",
  closed: "bg-muted text-muted-foreground",
};

export const jobStatusLabels: Record<JobStatus, string> = {
  active: "Active",
  paused: "Paused",
  closed: "Closed",
};

// ─── Chart palette (for recharts fill props) ──────────────────────────────────
// Matches --chart-1 through --chart-5 in globals.css

export const CHART_COLORS = {
  primary:  "#4F46E5", // indigo-600  chart-1
  teal:     "#0D9488", // teal-600    chart-2
  violet:   "#8B5CF6", // violet-500  chart-3
  amber:    "#F59E0B", // amber-500   chart-4
  rose:     "#F43F5E", // rose-500    chart-5
} as const;

// ─── Spacing scale (8px grid) ─────────────────────────────────────────────────

export const spacing = {
  1: "0.25rem",  // 4px
  2: "0.5rem",   // 8px
  3: "0.75rem",  // 12px
  4: "1rem",     // 16px
  6: "1.5rem",   // 24px
  8: "2rem",     // 32px
  12: "3rem",    // 48px
  16: "4rem",    // 64px
} as const;

// ─── Typography scale ────────────────────────────────────────────────────────

export const typeScale = {
  xs:   { size: "0.75rem",  lineHeight: "1rem"    },  // 12/16
  sm:   { size: "0.875rem", lineHeight: "1.25rem" },  // 14/20
  base: { size: "1rem",     lineHeight: "1.5rem"  },  // 16/24
  lg:   { size: "1.125rem", lineHeight: "1.75rem" },  // 18/28
  xl:   { size: "1.25rem",  lineHeight: "1.75rem" },  // 20/28
  "2xl":{ size: "1.5rem",   lineHeight: "2rem"    },  // 24/32
  "3xl":{ size: "1.875rem", lineHeight: "2.25rem" },  // 30/36
} as const;
