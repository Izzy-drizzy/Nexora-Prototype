import Link from "next/link";
import { Building2 } from "lucide-react";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top bar */}
      <header className="border-b px-6 py-4">
        <Link
          href="/portal"
          className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
        >
          <Building2 className="size-5 text-primary" />
          <span className="font-semibold text-sm tracking-tight">
            Nexora Recruit
          </span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <p className="text-xs text-muted-foreground">Powered by Nexora</p>
      </footer>
    </div>
  );
}
