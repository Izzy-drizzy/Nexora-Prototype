"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Wifi,
  Banknote,
  ScrollText,
  Sparkles,
  CheckCircle2,
  Upload,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3;

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedin: string;
  cvFile: File | null;
  yearsOfExperience: string;
  whyThisRole: string;
  confirmed: boolean;
}

// ─── Step indicator ──────────────────────────────────────────────────────────

const STEPS = [
  { num: 1, label: "Your details" },
  { num: 2, label: "Experience" },
  { num: 3, label: "Review & submit" },
];

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((s, i) => (
        <div key={s.num} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "size-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all",
                current === s.num
                  ? "bg-primary border-primary text-white"
                  : current > s.num
                  ? "bg-primary/10 border-primary text-primary"
                  : "bg-muted border-border text-muted-foreground"
              )}
            >
              {current > s.num ? <CheckCircle2 className="size-3.5" /> : s.num}
            </div>
            <span
              className={cn(
                "text-xs font-medium hidden sm:block",
                current === s.num ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={cn(
                "h-px w-8 mx-3 transition-all",
                current > s.num ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Step 1: Your details ────────────────────────────────────────────────────

function Step1({
  data,
  onChange,
  onNext,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  onNext: () => void;
}) {
  const valid =
    data.firstName.trim() &&
    data.lastName.trim() &&
    data.email.trim() &&
    data.phone.trim();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Your details</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Tell us a little about yourself.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="firstName">First name *</Label>
          <Input
            id="firstName"
            placeholder="Amara"
            value={data.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lastName">Last name *</Label>
          <Input
            id="lastName"
            placeholder="Osei"
            value={data.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email address *</Label>
        <Input
          id="email"
          type="email"
          placeholder="amara@example.com"
          value={data.email}
          onChange={(e) => onChange({ email: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone number *</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="+49 151 000 0000"
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="linkedin">LinkedIn URL (optional)</Label>
        <Input
          id="linkedin"
          type="url"
          placeholder="https://linkedin.com/in/your-name"
          value={data.linkedin}
          onChange={(e) => onChange({ linkedin: e.target.value })}
        />
      </div>
      <div className="flex justify-end pt-2">
        <Button onClick={onNext} disabled={!valid} size="lg">
          Continue
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 2: Experience ──────────────────────────────────────────────────────

const EXPERIENCE_OPTIONS = ["<1", "1–3", "3–5", "5–10", "10+"];

function Step2({
  data,
  onChange,
  onNext,
  onBack,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const valid = data.yearsOfExperience && data.whyThisRole.trim();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Experience</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Share your background and motivation.
        </p>
      </div>

      {/* CV upload */}
      <div className="space-y-1.5">
        <Label>CV / Resume *</Label>
        <label
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-8 cursor-pointer transition-colors",
            data.cvFile
              ? "border-primary/40 bg-primary/5"
              : "border-border hover:border-primary/40 hover:bg-muted/50"
          )}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="sr-only"
            onChange={(e) =>
              onChange({ cvFile: e.target.files?.[0] ?? null })
            }
          />
          <Upload
            className={cn(
              "size-6",
              data.cvFile ? "text-primary" : "text-muted-foreground"
            )}
          />
          {data.cvFile ? (
            <span className="text-sm font-medium text-primary">
              {data.cvFile.name}
            </span>
          ) : (
            <>
              <span className="text-sm font-medium">
                Drop your CV here or click to browse
              </span>
              <span className="text-xs text-muted-foreground">
                PDF, DOC or DOCX — max 5 MB
              </span>
            </>
          )}
        </label>
      </div>

      {/* Years of experience */}
      <div className="space-y-1.5">
        <Label>Years of experience *</Label>
        <div className="flex flex-wrap gap-2">
          {EXPERIENCE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange({ yearsOfExperience: opt })}
              className={cn(
                "h-9 px-4 rounded-lg border text-sm font-medium transition-all",
                data.yearsOfExperience === opt
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-background hover:border-primary/60 hover:bg-muted"
              )}
            >
              {opt} years
            </button>
          ))}
        </div>
      </div>

      {/* Why this role */}
      <div className="space-y-1.5">
        <Label htmlFor="whyThisRole">Why do you want this role? *</Label>
        <Textarea
          id="whyThisRole"
          placeholder="Tell us what excites you about this opportunity..."
          rows={5}
          value={data.whyThisRole}
          onChange={(e) => onChange({ whyThisRole: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          {data.whyThisRole.length}/500 characters
        </p>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack} size="lg">
          Back
        </Button>
        <Button onClick={onNext} disabled={!valid} size="lg">
          Continue
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

// ─── Step 3: Review & submit ─────────────────────────────────────────────────

function Step3({
  data,
  onChange,
  onSubmit,
  onBack,
  submitting,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  submitting: boolean;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Review & submit</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Check your details before submitting.
        </p>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Application summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">
              {data.firstName} {data.lastName}
            </span>
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">{data.email}</span>
            <span className="text-muted-foreground">Phone</span>
            <span className="font-medium">{data.phone}</span>
            {data.linkedin && (
              <>
                <span className="text-muted-foreground">LinkedIn</span>
                <span className="font-medium truncate">{data.linkedin}</span>
              </>
            )}
            <span className="text-muted-foreground">CV</span>
            <span className="font-medium">
              {data.cvFile ? data.cvFile.name : "Not uploaded"}
            </span>
            <span className="text-muted-foreground">Experience</span>
            <span className="font-medium">
              {data.yearsOfExperience} years
            </span>
          </div>
          {data.whyThisRole && (
            <div className="pt-2 border-t">
              <p className="text-muted-foreground mb-1">Motivation</p>
              <p className="leading-relaxed">{data.whyThisRole}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirmation checkbox */}
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="mt-0.5 size-4 rounded accent-primary"
          checked={data.confirmed}
          onChange={(e) => onChange({ confirmed: e.target.checked })}
        />
        <span className="text-sm text-muted-foreground">
          I confirm that the information provided is accurate and complete.
        </span>
      </label>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onBack} size="lg" disabled={submitting}>
          Back
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!data.confirmed || submitting}
          size="lg"
          className="min-w-32"
        >
          {submitting ? "Submitting…" : "Submit application"}
          {!submitting && <ArrowRight className="size-4" />}
        </Button>
      </div>
    </div>
  );
}

// ─── Success state ────────────────────────────────────────────────────────────

function SuccessView() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
      <div className="max-w-md mx-auto space-y-6">
        <div className="flex justify-center">
          <div className="size-20 rounded-full bg-green-50 flex items-center justify-center">
            <CheckCircle2 className="size-10 text-green-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Application submitted!</h1>
          <p className="text-muted-foreground leading-relaxed">
            We&apos;ll review your application and be in touch within 5 working
            days.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/portal"
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/80 transition-colors gap-1.5"
          >
            Track your application
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-9 px-4 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors"
          >
            Back to job board
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ApplyPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedin: "",
    cvFile: null,
    yearsOfExperience: "",
    whyThisRole: "",
    confirmed: false,
  });

  function patch(data: Partial<FormData>) {
    setForm((prev) => ({ ...prev, ...data }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    // Simulate async submission
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
  }

  if (submitted) return <SuccessView />;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="bg-white border-b px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2">
          <Building2 className="size-5 text-primary" />
          <span className="font-semibold text-sm text-foreground">
            Nexora Solutions
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column: Job details */}
          <div className="lg:w-2/5">
            <div className="lg:sticky lg:top-8">
              <Card className="bg-white">
                <CardHeader>
                  <Badge variant="secondary" className="w-fit mb-1">
                    Now hiring
                  </Badge>
                  <CardTitle className="text-xl font-bold leading-tight">
                    Senior Data Engineer
                  </CardTitle>
                  <p className="text-sm text-muted-foreground font-medium">
                    Nexora Solutions
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" />
                      <span>Berlin, Germany</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Wifi className="size-3.5 shrink-0" />
                      <span>Hybrid</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Banknote className="size-3.5 shrink-0" />
                      <span>€75,000–€95,000</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <ScrollText className="size-3.5 shrink-0" />
                      <span>Permanent</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <span className="text-xs">Posted:</span>
                      <span>5 Jun 2025</span>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      We&apos;re looking for a skilled Senior Data Engineer to
                      join our Digital Innovation team. You&apos;ll design and
                      build scalable data pipelines, collaborate with
                      cross-functional teams, and help drive our data strategy
                      forward.
                    </p>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex items-center gap-2 rounded-lg bg-violet-50 px-3 py-2">
                      <Sparkles className="size-3.5 text-violet-500 shrink-0" />
                      <span className="text-xs text-violet-700 font-medium">
                        AI screening active
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right column: Form */}
          <div className="lg:w-3/5">
            <Card className="bg-white">
              <CardContent className="pt-6">
                <StepIndicator current={step} />
                {step === 1 && (
                  <Step1
                    data={form}
                    onChange={patch}
                    onNext={() => setStep(2)}
                  />
                )}
                {step === 2 && (
                  <Step2
                    data={form}
                    onChange={patch}
                    onNext={() => setStep(3)}
                    onBack={() => setStep(1)}
                  />
                )}
                {step === 3 && (
                  <Step3
                    data={form}
                    onChange={patch}
                    onSubmit={handleSubmit}
                    onBack={() => setStep(2)}
                    submitting={submitting}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
