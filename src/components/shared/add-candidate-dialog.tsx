"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, UserPlus } from "lucide-react";
import { JOBS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface AddCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCandidateDialog({ open, onOpenChange }: AddCandidateDialogProps) {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [role, setRole]           = useState("");
  const [cvDragging, setCvDragging] = useState(false);
  const [cvFile, setCvFile]       = useState<string | null>(null);

  const canSubmit = firstName && lastName && email && role;

  async function handleSubmit() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    onOpenChange(false);
    toast.success(`${firstName} ${lastName} added`, {
      description: `Assigned to ${JOBS.find((j) => j.id === role)?.title ?? role} · AI screening queued.`,
    });
    setFirstName(""); setLastName(""); setEmail(""); setRole(""); setCvFile(null);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <UserPlus className="w-4 h-4 text-primary" />
            </div>
            <DialogTitle className="text-base font-bold">Add candidate manually</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                First name <span className="text-destructive">*</span>
              </Label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Marcus" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Last name <span className="text-destructive">*</span>
              </Label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Adeyemi" className="h-9" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="candidate@email.com" className="h-9" />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Role <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {JOBS.filter((j) => j.status === "active").map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => setRole(job.id)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all",
                    role === job.id
                      ? "border-primary bg-secondary text-primary"
                      : "border-border text-muted-foreground hover:border-primary/40"
                  )}
                >
                  {job.title}
                </button>
              ))}
            </div>
          </div>

          {/* CV Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              CV / Resume <span className="font-normal normal-case text-muted-foreground">(optional)</span>
            </Label>
            <div
              onDragOver={(e) => { e.preventDefault(); setCvDragging(true); }}
              onDragLeave={() => setCvDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setCvDragging(false);
                const file = e.dataTransfer.files[0];
                if (file) setCvFile(file.name);
              }}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-5 rounded-lg border-2 border-dashed transition-colors cursor-pointer",
                cvDragging ? "border-primary bg-secondary" : "border-border hover:border-primary/40 hover:bg-muted/30"
              )}
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = ".pdf,.doc,.docx";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) setCvFile(file.name);
                };
                input.click();
              }}
            >
              <Upload className={cn("w-5 h-5", cvDragging ? "text-primary" : "text-muted-foreground")} />
              {cvFile ? (
                <p className="text-xs font-medium text-primary">{cvFile}</p>
              ) : (
                <p className="text-xs text-muted-foreground text-center">
                  Drag & drop PDF or DOCX · or click to browse
                  <br />
                  <span className="text-[10px]">AI match score generated on upload</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" className="flex-1 h-9" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button className="flex-1 h-9 gap-2" onClick={handleSubmit} disabled={!canSubmit || loading}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding…
              </span>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                Add candidate
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
