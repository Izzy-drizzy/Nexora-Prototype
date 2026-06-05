"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  CalendarDays,
  Banknote,
  ScrollText,
  Clock,
  CheckCircle2,
  Send,
  FileText,
  Download,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type OfferState = "pending" | "accepted" | "requesting-changes" | "change-sent" | "declining" | "declined";

// ─── Offer details ────────────────────────────────────────────────────────────

const OFFER = {
  role: "Cloud Architect",
  department: "Digital Innovation",
  location: "Berlin, Germany",
  startDate: "1 August 2025",
  salary: "€85,000 / year",
  contract: "Permanent",
  expiresDate: "19 June 2025",
  daysRemaining: 7,
};

// ─── Offer detail row ─────────────────────────────────────────────────────────

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex-1 flex items-center justify-between min-w-0">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-right">{value}</span>
      </div>
    </div>
  );
}

// ─── Accepted banner ──────────────────────────────────────────────────────────

function AcceptedBanner() {
  return (
    <div className="rounded-xl border-2 border-green-200 bg-green-50 p-6 text-center space-y-3">
      <div className="flex justify-center">
        <div className="size-14 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 className="size-7 text-green-600" />
        </div>
      </div>
      <div>
        <p className="text-lg font-bold text-green-800">Offer accepted!</p>
        <p className="text-sm text-green-700 mt-1 leading-relaxed">
          Welcome to Nexora Solutions. Your onboarding details will arrive
          shortly.
        </p>
      </div>
      <div className="text-2xl select-none">🎉 ✨ 🥳</div>
      <Link
        href="/portal"
        className="inline-flex items-center gap-1.5 text-sm text-green-700 hover:underline underline-offset-4 font-medium"
      >
        <ArrowLeft className="size-3.5" />
        Back to my application
      </Link>
    </div>
  );
}

// ─── Request changes form ─────────────────────────────────────────────────────

function RequestChangesPanel({
  onSend,
  onCancel,
}: {
  onSend: (msg: string) => void;
  onCancel: () => void;
}) {
  const [message, setMessage] = useState("");
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold mb-1.5">
          What would you like to discuss?
        </p>
        <Textarea
          rows={4}
          placeholder="e.g. I'd like to discuss the start date or salary..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div className="flex gap-3">
        <Button
          size="lg"
          disabled={!message.trim()}
          onClick={() => onSend(message)}
          className="flex-1"
        >
          <Send className="size-4" />
          Send request
        </Button>
        <Button variant="outline" size="lg" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

// ─── Change sent confirmation ─────────────────────────────────────────────────

function ChangeSentBanner() {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-5 text-center space-y-2">
      <Send className="size-5 text-primary mx-auto" />
      <p className="text-sm font-semibold">Request sent!</p>
      <p className="text-xs text-muted-foreground">
        Our team will be in touch within 1–2 business days.
      </p>
      <Link
        href="/portal"
        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline underline-offset-4 font-medium"
      >
        <ArrowLeft className="size-3" />
        Back to my application
      </Link>
    </div>
  );
}

// ─── Decline confirmation ─────────────────────────────────────────────────────

function DeclineConfirmPanel({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-5 space-y-4">
      <div>
        <p className="text-sm font-semibold text-destructive">
          Are you sure you want to decline?
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          This action cannot be undone and will permanently close this offer.
        </p>
      </div>
      <div className="flex gap-3">
        <Button
          size="sm"
          variant="destructive"
          className="bg-destructive/80 text-white hover:bg-destructive"
          onClick={onConfirm}
        >
          Yes, decline offer
        </Button>
        <Button variant="outline" size="sm" onClick={onCancel}>
          No, go back
        </Button>
      </div>
    </div>
  );
}

// ─── Declined banner ──────────────────────────────────────────────────────────

function DeclinedBanner() {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-5 text-center space-y-2">
      <p className="text-sm font-semibold text-muted-foreground">
        Offer declined
      </p>
      <p className="text-xs text-muted-foreground">
        Thank you for your time. We wish you all the best.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline underline-offset-4 font-medium"
      >
        Back to job board
      </Link>
    </div>
  );
}

// ─── Contract dialog ──────────────────────────────────────────────────────────

const CONTRACT_CLAUSES = [
  {
    title: "1. Position",
    body: `The Company hereby employs the Employee as ${OFFER.role} within the ${OFFER.department} division. The Employee shall perform such duties as are reasonably assigned by the Company, consistent with the role, and shall devote their full working time and attention to the business of the Company.`,
  },
  {
    title: "2. Commencement & location",
    body: `Employment commences on ${OFFER.startDate}. The primary place of work is ${OFFER.location}, with flexibility for hybrid working in accordance with the Company's remote work policy.`,
  },
  {
    title: "3. Remuneration",
    body: `The Employee will receive a gross annual salary of ${OFFER.salary}, payable monthly in arrears on the last working day of each calendar month. Salary reviews are conducted annually at the discretion of the Company.`,
  },
  {
    title: "4. Working hours",
    body: `Normal working hours are 40 hours per week, Monday to Friday. The Company operates a flexible working policy; core hours are 10:00–16:00 CET. The Employee may be required to work additional hours when reasonably necessary to fulfil the requirements of the role.`,
  },
  {
    title: "5. Probation period",
    body: `The first 3 months of employment constitute a probationary period, during which either party may terminate this contract with 2 weeks' written notice. Upon successful completion, the standard notice provisions in clause 6 apply.`,
  },
  {
    title: "6. Notice period",
    body: `Following the probationary period, either party may terminate this contract by giving 3 months' written notice. The Company reserves the right to make a payment in lieu of notice.`,
  },
  {
    title: "7. Confidentiality",
    body: `The Employee shall not, during or after employment, disclose any confidential information belonging to the Company or its clients. This includes, but is not limited to, technical data, business strategies, client lists, and proprietary systems.`,
  },
  {
    title: "8. Intellectual property",
    body: `All inventions, developments, and work product created by the Employee in the course of employment shall be the exclusive property of the Company. The Employee assigns all such rights to the Company with full title guarantee.`,
  },
  {
    title: "9. Governing law",
    body: `This agreement is governed by and construed in accordance with the laws of the Federal Republic of Germany. Any disputes shall be subject to the exclusive jurisdiction of the courts of Berlin.`,
  },
];

function downloadContractPDF() {
  const clausesHTML = CONTRACT_CLAUSES.map(
    (c) => `
    <div class="clause">
      <h3>${c.title}</h3>
      <p>${c.body}</p>
    </div>`
  ).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Employment Contract — Nexora Solutions</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Georgia, serif; font-size: 11pt; color: #1a1a1a; padding: 48px 56px; line-height: 1.6; }
    .header { text-align: center; border-bottom: 2px solid #1a1a1a; padding-bottom: 20px; margin-bottom: 28px; }
    .header h1 { font-size: 18pt; letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 4px; }
    .header p { font-size: 10pt; color: #555; }
    .parties { border: 1px solid #ddd; border-radius: 4px; padding: 16px 20px; margin-bottom: 28px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .party-row { display: flex; justify-content: space-between; font-size: 10pt; padding: 4px 0; border-bottom: 1px solid #eee; }
    .party-row:last-child { border-bottom: none; }
    .party-label { color: #666; }
    .party-value { font-weight: bold; }
    .clause { margin-bottom: 20px; }
    .clause h3 { font-size: 10.5pt; font-weight: bold; margin-bottom: 6px; }
    .clause p { font-size: 10pt; color: #333; text-align: justify; }
    .signatures { margin-top: 48px; padding-top: 20px; border-top: 1px solid #ccc; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .sig-block { font-size: 9pt; color: #555; }
    .sig-line { border-bottom: 1px solid #999; height: 40px; margin-bottom: 6px; }
    .sig-line-pending { border-bottom: 1px dashed #bbb; height: 40px; margin-bottom: 6px; }
    .sig-name { font-weight: bold; color: #1a1a1a; font-size: 10pt; }
    .sig-pending { font-style: italic; color: #999; }
    @media print {
      body { padding: 0; }
      @page { margin: 2cm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Employment Contract</h1>
    <p>Nexora Solutions GmbH · ${OFFER.role} · ${OFFER.contract}</p>
  </div>
  <div class="parties">
    <div class="party-row"><span class="party-label">Employer</span><span class="party-value">Nexora Solutions GmbH</span></div>
    <div class="party-row"><span class="party-label">Employee</span><span class="party-value">Amara Osei</span></div>
    <div class="party-row"><span class="party-label">Contract type</span><span class="party-value">${OFFER.contract} employment</span></div>
    <div class="party-row"><span class="party-label">Effective date</span><span class="party-value">${OFFER.startDate}</span></div>
  </div>
  ${clausesHTML}
  <div class="signatures">
    <div class="sig-block">
      <div class="sig-line"></div>
      <p>For and on behalf of Nexora Solutions</p>
      <p class="sig-name">James O.</p>
      <p>Talent Lead · 9 Jun 2025</p>
    </div>
    <div class="sig-block">
      <div class="sig-line-pending"></div>
      <p>Employee signature</p>
      <p class="sig-pending">Pending acceptance</p>
    </div>
  </div>
</body>
</html>`;

  const win = window.open("", "_blank", "width=800,height=900");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
  // Close the helper window after the print dialog is dismissed
  win.onafterprint = () => win.close();
}

function ContractDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-base font-bold leading-none mb-0.5">
                  Employment Contract
                </DialogTitle>
                <p className="text-xs text-muted-foreground">
                  Nexora Solutions · {OFFER.role} · {OFFER.contract}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={downloadContractPDF}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground hover:bg-muted hover:border-primary/30 transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </button>
          </div>
        </DialogHeader>

        {/* Scrollable contract body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-1">
          {/* Parties header */}
          <div className="rounded-lg bg-muted/50 border border-border p-4 mb-5 text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Employer</span>
              <span className="font-semibold">Nexora Solutions GmbH</span>
            </div>
            <Separator />
            <div className="flex justify-between pt-1">
              <span className="text-muted-foreground">Employee</span>
              <span className="font-semibold">Amara Osei</span>
            </div>
            <Separator />
            <div className="flex justify-between pt-1">
              <span className="text-muted-foreground">Contract type</span>
              <span className="font-semibold">{OFFER.contract} employment</span>
            </div>
            <Separator />
            <div className="flex justify-between pt-1">
              <span className="text-muted-foreground">Effective date</span>
              <span className="font-semibold">{OFFER.startDate}</span>
            </div>
          </div>

          {/* Clauses */}
          <div className="space-y-5">
            {CONTRACT_CLAUSES.map((clause) => (
              <div key={clause.title} className="space-y-1.5">
                <h3 className="text-sm font-semibold text-foreground">
                  {clause.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {clause.body}
                </p>
              </div>
            ))}
          </div>

          {/* Signature placeholder */}
          <div className="mt-8 pt-5 border-t border-border space-y-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-semibold">
              Signatures
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="h-8 border-b border-border" />
                <p className="text-xs text-muted-foreground">
                  For and on behalf of Nexora Solutions
                </p>
                <p className="text-xs font-medium text-foreground">James O.</p>
                <p className="text-xs text-muted-foreground">Talent Lead · 9 Jun 2025</p>
              </div>
              <div className="space-y-1">
                <div className="h-8 border-b border-dashed border-border" />
                <p className="text-xs text-muted-foreground">Employee signature</p>
                <p className="text-xs text-muted-foreground italic">Pending acceptance</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OfferPage() {
  const [offerState, setOfferState] = useState<OfferState>("pending");
  const [contractOpen, setContractOpen] = useState(false);

  return (
    <div className="max-w-2xl mx-auto py-8 px-6 space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/portal"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to my application
      </Link>

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold">You have an offer!</h1>
          <span className="text-2xl select-none" aria-hidden>🎊</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Nexora Solutions has extended the following offer to you. Please
          review and respond before the expiry date.
        </p>
      </div>

      {/* Offer details card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base font-bold">
              {OFFER.role}
            </CardTitle>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 shrink-0">
              Offer pending
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <DetailRow icon={Briefcase} label="Department" value={OFFER.department} />
          <DetailRow icon={MapPin} label="Location" value={OFFER.location} />
          <DetailRow icon={CalendarDays} label="Start date" value={OFFER.startDate} />
          <DetailRow icon={Banknote} label="Salary" value={OFFER.salary} />
          <DetailRow icon={ScrollText} label="Contract" value={OFFER.contract} />

          {/* View contract */}
          <button
            type="button"
            onClick={() => setContractOpen(true)}
            className="w-full flex items-center gap-3 text-sm rounded-lg border border-border bg-muted/30 px-3 py-2.5 hover:bg-muted/60 hover:border-primary/30 transition-colors group"
          >
            <div className="size-8 rounded-lg bg-background border border-border flex items-center justify-center shrink-0 group-hover:border-primary/30 transition-colors">
              <FileText className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground text-xs leading-none mb-0.5">Employment contract</p>
              <p className="text-xs text-muted-foreground">Permanent · 9 clauses · Read before accepting</p>
            </div>
            <span className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
              View →
            </span>
          </button>

          {/* Expiry with countdown */}
          <div
            className={cn(
              "flex items-center gap-3 text-sm rounded-lg px-3 py-2.5",
              "border border-amber-200 bg-amber-50"
            )}
          >
            <Clock className="size-4 text-amber-600 shrink-0" />
            <div className="flex items-center justify-between flex-1">
              <span className="text-amber-800 font-medium">
                Offer expires {OFFER.expiresDate}
              </span>
              <span className="text-amber-700 font-semibold text-xs">
                {OFFER.daysRemaining} days remaining
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action section */}
      {offerState === "accepted" && <AcceptedBanner />}
      {offerState === "change-sent" && <ChangeSentBanner />}
      {offerState === "declined" && <DeclinedBanner />}

      {offerState === "pending" && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Your decision
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => setOfferState("accepted")}
              className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors flex-1 gap-2"
            >
              <CheckCircle2 className="size-4" />
              Accept offer
            </button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={() => setOfferState("requesting-changes")}
            >
              Request changes
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setOfferState("declining")}
            >
              Decline
            </Button>
          </div>
        </div>
      )}

      {offerState === "requesting-changes" && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Request changes</h2>
          <RequestChangesPanel
            onSend={() => setOfferState("change-sent")}
            onCancel={() => setOfferState("pending")}
          />
        </div>
      )}

      {offerState === "declining" && (
        <DeclineConfirmPanel
          onConfirm={() => setOfferState("declined")}
          onCancel={() => setOfferState("pending")}
        />
      )}

      <ContractDialog open={contractOpen} onOpenChange={setContractOpen} />
    </div>
  );
}
