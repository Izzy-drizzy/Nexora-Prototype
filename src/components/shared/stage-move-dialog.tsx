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
import { ArrowRight, Bell } from "lucide-react";
import { stageLabels, stageClasses, type PipelineStage } from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

interface StageMoveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidateName: string;
  fromStage: PipelineStage;
  toStage: PipelineStage;
  onConfirm: () => void;
}

export function StageMoveDialog({
  open,
  onOpenChange,
  candidateName,
  fromStage,
  toStage,
  onConfirm,
}: StageMoveDialogProps) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    onOpenChange(false);
    onConfirm();
    toast.success(`${candidateName} moved to ${stageLabels[toStage]}`, {
      description: "Automated status notification sent to candidate.",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-bold">Move candidate?</DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">{candidateName}</p>
        </DialogHeader>

        {/* Stage transition visual */}
        <div className="flex items-center justify-center gap-3 py-2">
          <span className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold",
            stageClasses[fromStage]
          )}>
            {stageLabels[fromStage]}
          </span>
          <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          <span className={cn(
            "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold",
            stageClasses[toStage]
          )}>
            {stageLabels[toStage]}
          </span>
        </div>

        {/* Notification notice */}
        <div className="flex items-start gap-2.5 rounded-lg bg-primary/5 border border-primary/20 p-3">
          <Bell className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground leading-relaxed">
            An automated status notification will be sent to{" "}
            <span className="font-semibold">{candidateName.split(" ")[0]}</span> when you confirm.
            No manual email needed.
          </p>
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
            className="flex-1 h-9"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Moving…
              </span>
            ) : "Confirm move"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
