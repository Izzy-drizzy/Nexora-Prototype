import type { PipelineStage, JobStatus } from "./design-tokens";

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface Candidate {
  id: string;
  name: string;
  initials: string;
  role: string;
  location: string;
  stage: PipelineStage;
  aiScore: number | null;
  appliedDate: string;
  lastActivity: string;
  recruiter: string;
  source: string;
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  applied: number;
  inPipeline: number;
  posted: string;
  status: JobStatus;
}

export interface Interview {
  id: string;
  candidateName: string;
  candidateInitials: string;
  role: string;
  time: string;
  format: "Panel" | "Phone" | "Technical" | "Video";
  round?: string;
}

export interface UrgentAction {
  id: string;
  type: "cv-review" | "offer-unsigned" | "interview-unconfirmed";
  title: string;
  subtitle: string;
  age: string;
  href: string;
}

// ─── Dashboard data ───────────────────────────────────────────────────────────

export const PIPELINE_COUNTS = {
  applied:   48,
  screening: 21,
  interview: 14,
  offer:     6,
  hired:     3,
};

export const KPI_CARDS = [
  {
    id:      "time-to-hire",
    label:   "Avg. time to hire",
    value:   "18d",
    trend:   "-4 days vs last month",
    up:      true,
    good:    true,
  },
  {
    id:      "cv-screen-rate",
    label:   "CV screening rate",
    value:   "74%",
    trend:   "12% fully automated",
    up:      true,
    good:    true,
  },
  {
    id:      "satisfaction",
    label:   "Candidate satisfaction",
    value:   "3.8",
    trend:   "/ 5.0 · target 4.5",
    up:      false,
    good:    false,
  },
];

export const TODAYS_INTERVIEWS: Interview[] = [
  {
    id:               "i1",
    candidateName:    "Marcus Adeyemi",
    candidateInitials:"MA",
    role:             "Sr. Data Engineer",
    time:             "10:00",
    format:           "Panel",
    round:            "Rd. 2",
  },
  {
    id:               "i2",
    candidateName:    "Lena Hartmann",
    candidateInitials:"LH",
    role:             "UX Researcher",
    time:             "14:30",
    format:           "Phone",
  },
  {
    id:               "i3",
    candidateName:    "Kwame Asante",
    candidateInitials:"KA",
    role:             "Solutions Arch.",
    time:             "16:00",
    format:           "Technical",
  },
];

export const URGENT_ACTIONS: UrgentAction[] = [
  {
    id:       "ua1",
    type:     "cv-review",
    title:    "7 CVs awaiting review",
    subtitle: "Sr. Data Engineer · 2 days old",
    age:      "2d",
    href:     "/recruit/candidates",
  },
  {
    id:       "ua2",
    type:     "offer-unsigned",
    title:    "Offer unsigned — Priya K.",
    subtitle: "Cloud Architect · Sent 3 days ago",
    age:      "3d",
    href:     "/recruit/candidates",
  },
  {
    id:       "ua3",
    type:     "interview-unconfirmed",
    title:    "Interview unconfirmed",
    subtitle: "Marcus F. · Panel tomorrow",
    age:      "1d",
    href:     "/recruit/interviews",
  },
];

// ─── Jobs data ────────────────────────────────────────────────────────────────

export const JOBS: Job[] = [
  {
    id:         "j1",
    title:      "Senior Data Engineer",
    department: "Data & Analytics",
    location:   "Toronto / Remote",
    applied:    48,
    inPipeline: 21,
    posted:     "28 May",
    status:     "active",
  },
  {
    id:         "j2",
    title:      "Cloud Architect",
    department: "Digital Innovation",
    location:   "Berlin",
    applied:    31,
    inPipeline: 8,
    posted:     "2 Jun",
    status:     "active",
  },
  {
    id:         "j3",
    title:      "UX Researcher",
    department: "Product Design",
    location:   "Remote (EU)",
    applied:    19,
    inPipeline: 6,
    posted:     "5 Jun",
    status:     "active",
  },
  {
    id:         "j4",
    title:      "Solutions Architect",
    department: "Ops Strategy",
    location:   "Singapore",
    applied:    27,
    inPipeline: 11,
    posted:     "1 Jun",
    status:     "active",
  },
  {
    id:         "j5",
    title:      "Business Analyst",
    department: "Ops Strategy",
    location:   "Toronto",
    applied:    14,
    inPipeline: 3,
    posted:     "10 May",
    status:     "paused",
  },
  {
    id:         "j6",
    title:      "Full-Stack Engineer",
    department: "Digital Innovation",
    location:   "Remote APAC",
    applied:    62,
    inPipeline: 0,
    posted:     "12 Apr",
    status:     "closed",
  },
];

// ─── Candidates data ──────────────────────────────────────────────────────────

export const CANDIDATES: Candidate[] = [
  {
    id:           "c1",
    name:         "Marcus Adeyemi",
    initials:     "MA",
    role:         "Senior Data Engineer",
    location:     "Lagos",
    stage:        "interview",
    aiScore:      91,
    appliedDate:  "3 Jun",
    lastActivity: "Panel Rd.2 confirmed",
    recruiter:    "Sarah T.",
    source:       "LinkedIn",
  },
  {
    id:           "c2",
    name:         "Lena Hartmann",
    initials:     "LH",
    role:         "Senior Data Engineer",
    location:     "Berlin",
    stage:        "screening",
    aiScore:      87,
    appliedDate:  "5 Jun",
    lastActivity: "AI screened · awaiting review",
    recruiter:    "Fatima A.",
    source:       "Direct",
  },
  {
    id:           "c3",
    name:         "Kwame Asante",
    initials:     "KA",
    role:         "Senior Data Engineer",
    location:     "Accra",
    stage:        "screening",
    aiScore:      79,
    appliedDate:  "7 Jun",
    lastActivity: "AI screened · awaiting review",
    recruiter:    "Sarah T.",
    source:       "LinkedIn",
  },
  {
    id:           "c4",
    name:         "Chioma Obi",
    initials:     "CO",
    role:         "Senior Data Engineer",
    location:     "London",
    stage:        "new",
    aiScore:      null,
    appliedDate:  "11 Jun",
    lastActivity: "Received · not yet screened",
    recruiter:    "Unassigned",
    source:       "Careers portal",
  },
  {
    id:           "c5",
    name:         "Priya Krishnan",
    initials:     "PK",
    role:         "Cloud Architect",
    location:     "Singapore",
    stage:        "offer",
    aiScore:      94,
    appliedDate:  "28 May",
    lastActivity: "Offer sent · awaiting signature",
    recruiter:    "James O.",
    source:       "LinkedIn",
  },
  {
    id:           "c6",
    name:         "Yuki Tanaka",
    initials:     "YT",
    role:         "Senior Data Engineer",
    location:     "Tokyo",
    stage:        "rejected",
    aiScore:      52,
    appliedDate:  "1 Jun",
    lastActivity: "Notified · skills gap",
    recruiter:    "James O.",
    source:       "Job board",
  },
];
