import Link from "next/link";
import {
  Building2,
  LayoutDashboard,
  Briefcase,
  Users,
  GitBranch,
  Calendar,
  BarChart2,
  Settings,
  UserCircle,
  FileCheck,
  CalendarClock,
  LogIn,
  ClipboardList,
  Clock,
  Gift,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

// ─── Screen definitions ───────────────────────────────────────────────────────

const RECRUITER_SCREENS = [
  {
    icon: LogIn,
    label: "Login",
    description: "Sign in to the recruiter portal",
    href: "/login",
    tag: "/login",
    primary: true,
  },
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    description: "Pipeline overview, KPIs, today's interviews, urgent actions",
    href: "/recruit/dashboard",
    tag: "/recruit/dashboard",
  },
  {
    icon: Briefcase,
    label: "Job Postings",
    description: "Browse, search, filter and post new roles",
    href: "/recruit/jobs",
    tag: "/recruit/jobs",
  },
  {
    icon: Users,
    label: "All Candidates",
    description: "Cross-role candidate list with AI score pills and bulk actions",
    href: "/recruit/candidates",
    tag: "/recruit/candidates",
  },
  {
    icon: GitBranch,
    label: "Pipeline Board",
    description: "Kanban board with stage-move dialog and live card state",
    href: "/recruit/pipeline",
    tag: "/recruit/pipeline",
  },
  {
    icon: Calendar,
    label: "Interviews",
    description: "Upcoming interviews grouped by day with panel details",
    href: "/recruit/interviews",
    tag: "/recruit/interviews",
  },
  {
    icon: BarChart2,
    label: "Analytics",
    description: "Hiring funnel, source breakdown, region distribution",
    href: "/recruit/analytics",
    tag: "/recruit/analytics",
  },
  {
    icon: UserCircle,
    label: "Candidate Profile",
    description: "Applicant timeline, AI summary, stage advance, reject flow",
    href: "/recruit/candidates/c1",
    tag: "/recruit/candidates/:id",
  },
  {
    icon: FileCheck,
    label: "Offer Letter",
    description: "Send, track, withdraw and mark-accepted offer flow",
    href: "/recruit/candidates/c1/offer",
    tag: "/recruit/candidates/:id/offer",
  },
  {
    icon: CalendarClock,
    label: "Schedule Interview",
    description: "Slot picker, panel members, send options with success state",
    href: "/recruit/schedule/new?candidate=c1",
    tag: "/recruit/schedule/new",
  },
  {
    icon: Settings,
    label: "Settings",
    description: "Profile, notifications, automations, team, integrations",
    href: "/recruit/settings",
    tag: "/recruit/settings",
  },
];

const CANDIDATE_SCREENS = [
  {
    icon: ClipboardList,
    label: "Apply for a Role",
    description: "3-step public application: personal details, CV upload, review & submit",
    href: "/apply/j1",
    tag: "/apply/:jobId",
    primary: true,
  },
  {
    icon: UserCircle,
    label: "Application Tracker",
    description: "Pipeline stepper, journey timeline, what's next card",
    href: "/portal",
    tag: "/portal",
  },
  {
    icon: Clock,
    label: "Choose Interview Slot",
    description: "Radio-style slot cards, confirm selection, calendar success state",
    href: "/portal/schedule",
    tag: "/portal/schedule",
  },
  {
    icon: Gift,
    label: "Offer & Contract",
    description: "Offer details, contract viewer, PDF download, accept / request changes / decline",
    href: "/portal/offer",
    tag: "/portal/offer",
  },
];

// ─── Screen card ──────────────────────────────────────────────────────────────

function ScreenCard({
  icon: Icon,
  label,
  description,
  href,
  tag,
  primary = false,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  href: string;
  tag: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3.5 p-4 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all"
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
        primary
          ? "bg-primary text-white"
          : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
      }`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {label}
          </span>
          {primary && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-primary/10 text-primary">
              Start here
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        <code className="text-[10px] text-muted-foreground/60 mt-1.5 block font-mono">{tag}</code>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary shrink-0 mt-2.5 transition-colors" />
    </Link>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────

function Section({
  title,
  subtitle,
  accent,
  screens,
}: {
  title: string;
  subtitle: string;
  accent: string;
  screens: typeof RECRUITER_SCREENS;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3">
        <div className={`w-1 rounded-full self-stretch min-h-8 ${accent}`} />
        <div>
          <h2 className="text-base font-bold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {screens.map((s) => (
          <ScreenCard key={s.href} {...s} />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HubPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-foreground">Nexora Recruit</span>
              <span className="ml-2 text-xs text-muted-foreground font-medium">Prototype</span>
            </div>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors"
          >
            Recruiter login
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-12">
        {/* Hero */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Prototype Navigator
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All screens are linked below. Start from the recruiter login for the full flow,
            or jump directly to any screen.
          </p>
        </div>

        {/* Recruiter section */}
        <Section
          title="Recruiter experience"
          subtitle={`${RECRUITER_SCREENS.length} screens — internal hiring team portal`}
          accent="bg-primary"
          screens={RECRUITER_SCREENS}
        />

        {/* Candidate section */}
        <Section
          title="Candidate experience"
          subtitle={`${CANDIDATE_SCREENS.length} screens — public-facing application and offer portal`}
          accent="bg-teal-500"
          screens={CANDIDATE_SCREENS}
        />

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          Nexora Recruit · Hi-fi prototype · All data is mock
        </p>
      </main>
    </div>
  );
}
