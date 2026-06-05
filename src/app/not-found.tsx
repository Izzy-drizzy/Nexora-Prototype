import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="flex flex-col items-center text-center space-y-6 max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">Nexora Recruit</span>
        </div>

        {/* 404 number */}
        <div className="space-y-1">
          <p className="text-[96px] font-extrabold text-primary/10 leading-none tracking-tighter select-none">
            404
          </p>
          <h1 className="text-xl font-bold text-foreground -mt-4">Page not found</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved. Head back to a safe place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/recruit/dashboard"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-md border border-border bg-card text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
          <Link
            href="/recruit/candidates"
            className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            View candidates
          </Link>
        </div>
      </div>
    </div>
  );
}
