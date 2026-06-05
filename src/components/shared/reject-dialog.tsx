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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Mail, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const REJECTION_REASONS = [
  { value: "skills-gap",      label: "Skills gap",              description: "Missing required technical skills" },
  { value: "experience",      label: "Insufficient experience", description: "Below the required experience level" },
  { value: "location",        label: "Location / visa",         description: "Unable to work from required location" },
  { value: "overqualified",   label: "Overqualified",           description: "Significantly above the role level" },
  { value: "culture-fit",     label: "Culture fit",             description: "Not aligned with team values" },
  { value: "withdrew",        label: "Candidate withdrew",      description: "Candidate removed themselves" },
  { value: "role-closed",     label: "Role filled",             description: "Position has been filled" },
];

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  roleName: string;
  onConfirm: () => void;
}

export function RejectDialog({
  open,
  onOpenChange,
  candidateName,
  roleName,
  onConfirm,
}: RejectDialogProps) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedReason = REJECTION_REASONS.find((r) => r.value === reason);

  async function handleConfirm() {
    if (!reason) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    onOpenChange(false);
    onConfirm();
    toast.success(`${candidateName} has been rejected`, {
      description: "A notification email has been sent automatically.",
    });
    setReason("");
    setNote("");
    setShowPreview(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Reject &amp; notify</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{candidateName} · {roleName}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Reason selector */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Rejection reason
            </Label>
            <div className="space-y-1.5">
              {REJECTION_REASONS.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setReason(r.value)}
                  className={cn(
                    "w-full flex items-start gap-3 px-3 py-2.5 rounded-lg border text-left transition-all",
                    reason === r.value
                      ? "border-destructive/40 bg-red-50"
                      : "border-border hover:border-muted-foreground/30 hover:bg-muted/40"
                  )}
                >
                  <div className={cn(
                    "mt-0.5 w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 flex items-center justify-center",
                    reason === r.value ? "border-destructive" : "border-muted-foreground/30"
                  )}>
                    {reason === r.value && (
                      <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    )}
                  </div>
                  <div>
                    <p className={cn(
                      "text-xs font-semibold leading-none mb-0.5",
                      reason === r.value ? "text-destructive" : "text-foreground"
                    )}>
                      {r.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{r.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Optional note */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Internal note <span className="font-normal normal-case">(optional, not sent to candidate)</span>
            </Label>
            <Textarea
              placeholder="Add context for the team…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="h-20 text-sm resize-none"
            />
          </div>

          {/* Email preview toggle */}
          {reason && (
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-primary hover:underline underline-offset-4 font-medium"
            >
              <Mail className="w-3.5 h-3.5" />
              {showPreview ? "Hide" : "Preview"} notification email
            </button>
          )}

          {showPreview && selectedReason && (
            <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Email preview — sent automatically on confirm
              </p>
              <Separator />
              <div className="text-xs space-y-1 text-muted-foreground">
                <p><span className="font-medium text-foreground">To:</span> {candidateName.toLowerCase().replace(" ", ".")}@email.com</p>
                <p><span className="font-medium text-foreground">Subject:</span> Your application for {roleName} at Nexora Solutions</p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Hi {candidateName.split(" ")[0]}, thank you for taking the time to apply for the{" "}
                <span className="font-medium text-foreground">{roleName}</span> role at Nexora
                Solutions. After careful consideration, we&apos;ve decided not to move forward with
                your application at this time.{" "}
                {selectedReason.value !== "role-closed" &&
                  "We encourage you to apply for future openings that match your profile."}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            className="flex-1 h-9"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            className="flex-1 h-9 gap-2"
            onClick={handleConfirm}
            disabled={!reason || loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending…
              </span>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Reject &amp; send notification
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
