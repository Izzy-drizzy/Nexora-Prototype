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
import { CheckCircle2, XCircle, PartyPopper } from "lucide-react";

// ─── Withdraw confirmation ────────────────────────────────────────────────────

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  onConfirm: () => void;
}

export function WithdrawOfferDialog({
  open,
  onOpenChange,
  candidateName,
  onConfirm,
}: WithdrawDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    onOpenChange(false);
    onConfirm();
    toast.warning(`Offer withdrawn for ${candidateName}`, {
      description: "A notification has been sent to the candidate.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold">Withdraw offer?</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">{candidateName}</p>
            </div>
          </div>
        </DialogHeader>

        <p className="text-sm text-muted-foreground leading-relaxed">
          This will cancel the offer and notify {candidateName.split(" ")[0]} automatically.
          This action cannot be undone.
        </p>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            className="flex-1 h-9"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Keep offer
          </Button>
          <Button
            variant="destructive"
            className="flex-1 h-9"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Withdrawing…
              </span>
            ) : "Withdraw offer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Mark accepted success ────────────────────────────────────────────────────

interface AcceptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  roleName: string;
  onConfirm: () => void;
}

export function AcceptOfferDialog({
  open,
  onOpenChange,
  candidateName,
  roleName,
  onConfirm,
}: AcceptDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    onOpenChange(false);
    onConfirm();
    toast.success(`${candidateName} is now Hired!`, {
      description: `${roleName} · Onboarding sequence triggered.`,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
              <PartyPopper className="w-7 h-7 text-green-600" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">Mark as accepted?</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {candidateName} · {roleName}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-lg bg-green-50 border border-green-100 p-3 space-y-1.5">
          {[
            "Candidate stage moved to Hired",
            "Onboarding sequence triggered automatically",
            "Hiring manager notified",
            "Job posting closed if no open headcount",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
              <span className="text-xs text-green-800">{item}</span>
            </div>
          ))}
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
            className="flex-1 h-9 gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Confirming…
              </span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Confirm accepted
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
