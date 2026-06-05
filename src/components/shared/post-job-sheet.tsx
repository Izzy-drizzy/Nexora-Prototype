"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3;

const DEPARTMENTS = [
  "Data & Analytics",
  "Digital Innovation",
  "Product Design",
  "Ops Strategy",
  "Engineering",
];

const WORK_TYPES = [
  { value: "remote",     label: "Remote" },
  { value: "hybrid",     label: "Hybrid" },
  { value: "on-site",    label: "On-site" },
];

const CONTRACT_TYPES = [
  { value: "permanent",  label: "Permanent" },
  { value: "contract",   label: "Contract"  },
  { value: "fixed-term", label: "Fixed-term"},
];

export interface NewJobData {
  title: string;
  department: string;
  location: string;
  workType: string;
  contract: string;
}

interface PostJobSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPublish?: (job: NewJobData) => void;
}

export function PostJobSheet({ open, onOpenChange, onPublish }: PostJobSheetProps) {
  const [step, setStep]           = useState<Step>(1);
  const [loading, setLoading]     = useState(false);
  const [title, setTitle]         = useState("");
  const [department, setDepartment] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");
  const [location, setLocation]   = useState("");
  const [workType, setWorkType]   = useState("remote");
  const [contract, setContract]   = useState("permanent");

  const STEPS = [
    { num: 1, label: "Role details"    },
    { num: 2, label: "Requirements"    },
    { num: 3, label: "Location & type" },
  ];

  async function handlePublish() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    onOpenChange(false);
    onPublish?.({ title, department, location, workType, contract });
    toast.success(`"${title}" has been posted`, {
      description: `${department} · ${location} · ${workType}`,
    });
    // reset
    setStep(1); setTitle(""); setDepartment(""); setDescription("");
    setRequirements(""); setLocation(""); setWorkType("remote"); setContract("permanent");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] flex flex-col max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-lg font-bold">Post a job</DialogTitle>

          {/* Step indicator */}
          <div className="flex items-center gap-0 mt-3">
            {STEPS.map(({ num, label }, i) => {
              const done    = step > num;
              const active  = step === num;
              return (
                <div key={num} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold transition-colors",
                      done   ? "bg-green-500 text-white"
                             : active ? "bg-primary text-white"
                             : "bg-muted text-muted-foreground"
                    )}>
                      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : num}
                    </div>
                    <span className={cn(
                      "text-xs font-medium",
                      active ? "text-foreground" : "text-muted-foreground"
                    )}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 mx-3">
                      <div className="h-px bg-border" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </DialogHeader>

        <Separator />

        <div className="flex-1 py-5 space-y-5">
          {/* Step 1 — Role details */}
          {step === 1 && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Job title <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="e.g. Senior Data Engineer"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Department <span className="text-destructive">*</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {DEPARTMENTS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDepartment(d)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                        department === d
                          ? "border-primary bg-secondary text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Job description
                </Label>
                <Textarea
                  placeholder="Describe the role, team, and what success looks like…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-32 text-sm resize-none"
                />
              </div>
            </>
          )}

          {/* Step 2 — Requirements */}
          {step === 2 && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Key requirements
                </Label>
                <Textarea
                  placeholder={"• 5+ years of relevant experience\n• Proficiency in...\n• Experience with..."}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="h-40 text-sm resize-none font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  These are used by the AI matching engine to score candidates.
                </p>
              </div>
            </>
          )}

          {/* Step 3 — Location & type */}
          {step === 3 && (
            <>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="e.g. Toronto, Canada or Remote (Global)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-9"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Work type
                </Label>
                <div className="flex gap-2">
                  {WORK_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setWorkType(value)}
                      className={cn(
                        "flex-1 py-2 rounded-lg border text-xs font-medium transition-all",
                        workType === value
                          ? "border-primary bg-secondary text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Contract type
                </Label>
                <div className="flex gap-2">
                  {CONTRACT_TYPES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setContract(value)}
                      className={cn(
                        "flex-1 py-2 rounded-lg border text-xs font-medium transition-all",
                        contract === value
                          ? "border-primary bg-secondary text-primary"
                          : "border-border text-muted-foreground hover:border-primary/40"
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review summary */}
              <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-1.5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Review</p>
                <Separator />
                {[
                  ["Title",      title      || "—"],
                  ["Department", department || "—"],
                  ["Location",   location   || "—"],
                  ["Work type",  workType         ],
                  ["Contract",   contract         ],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-foreground capitalize">{value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-4 flex gap-2">
          {step > 1 && (
            <Button
              variant="outline"
              className="flex-1 h-9"
              onClick={() => setStep((s) => (s - 1) as Step)}
              disabled={loading}
            >
              Back
            </Button>
          )}

          {step < 3 ? (
            <Button
              className="flex-1 h-9 gap-2"
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={step === 1 && (!title || !department)}
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              className="flex-1 h-9 gap-2"
              onClick={handlePublish}
              disabled={!title || !department || !location || loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing…
                </span>
              ) : "Publish job"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
