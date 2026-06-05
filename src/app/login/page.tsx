"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Globe, ArrowRight, Building2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "recruiter" | "hiring-manager" | "hr-admin";

const ROLES: { value: Role; label: string; description: string }[] = [
  { value: "recruiter",       label: "Recruiter",       description: "Source, screen & manage candidates"   },
  { value: "hiring-manager",  label: "Hiring Manager",  description: "Review shortlists & run interviews"   },
  { value: "hr-admin",        label: "HR Admin",        description: "Manage platform settings & reports"   },
];

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<Role>("recruiter");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  function validate() {
    if (!email.trim())    return "Please enter your work email.";
    if (!email.includes("@")) return "Enter a valid email address.";
    if (!password.trim()) return "Please enter your password.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    // Simulate wrong credentials for any email not ending in nexora.com
    if (!email.endsWith("@nexora.com")) return "These credentials don't match our records. Use your Nexora email.";
    return "";
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const validationError = validate();
    if (validationError) { setError(validationError); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    window.location.href = "/recruit/dashboard";
  }

  function handleSSO() {
    window.location.href = "/recruit/dashboard";
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between bg-primary p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-white/5" />
          <div className="absolute top-1/3 -left-24 w-[300px] h-[300px] rounded-full bg-white/5" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-white/[0.03]" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Nexora</span>
          </div>
        </div>

        <div className="relative space-y-6">
          <div className="space-y-3">
            <p className="text-indigo-200 text-sm font-medium uppercase tracking-widest">Internal Platform</p>
            <h1 className="text-white text-4xl font-bold leading-tight tracking-tight">
              Talent acquisition,<br />reimagined.
            </h1>
          </div>
          <p className="text-indigo-200 text-base leading-relaxed max-w-sm">
            One unified dashboard to source, screen, and close world-class talent across 22 countries — without the spreadsheets.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { value: "50%",  label: "Faster CV screening"          },
              { value: "30%",  label: "Fewer scheduling delays"      },
              { value: "20%",  label: "Higher candidate satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-1">
                <p className="text-white text-2xl font-bold">{stat.value}</p>
                <p className="text-indigo-300 text-xs leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center gap-2 text-indigo-300 text-sm">
          <Globe className="w-4 h-4" />
          <span>nexora.internal · Toronto, Global Operations</span>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 bg-background">
        <div className="w-full max-w-[400px] space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-foreground font-bold text-lg tracking-tight">Nexora</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-foreground text-2xl font-bold tracking-tight">Sign in</h2>
            <p className="text-muted-foreground text-sm">Nexora employee credentials</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5" noValidate>
            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive leading-snug">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="email">
                Work email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@nexora.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                className={cn("h-10", error && !email ? "border-destructive ring-1 ring-destructive/30" : "")}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground" htmlFor="password">
                  Password
                </label>
                <Link href="#" className="text-xs text-primary hover:underline underline-offset-4">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className={cn("h-10", error && !password ? "border-destructive ring-1 ring-destructive/30" : "")}
                autoComplete="current-password"
              />
            </div>

            {/* Role selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">I am a</label>
              <div className="space-y-2">
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setSelectedRole(role.value)}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all",
                      selectedRole === role.value
                        ? "border-primary bg-secondary shadow-sm"
                        : "border-border bg-card hover:border-primary/40 hover:bg-muted/50"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors",
                      selectedRole === role.value ? "border-primary" : "border-muted-foreground/40"
                    )}>
                      {selectedRole === role.value && (
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <div>
                      <p className={cn(
                        "text-sm font-semibold leading-none mb-0.5",
                        selectedRole === role.value ? "text-primary" : "text-foreground"
                      )}>
                        {role.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full h-10 gap-2 font-semibold" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground font-medium">or</span>
              <Separator className="flex-1" />
            </div>
            <Button variant="outline" className="w-full h-10 gap-2 font-medium" type="button" onClick={handleSSO}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <rect width="11" height="11" x="1" y="1" rx="1" fill="#4F46E5" />
                <rect width="11" height="11" x="13" y="1" rx="1" fill="#818CF8" />
                <rect width="11" height="11" x="1" y="13" rx="1" fill="#818CF8" />
                <rect width="11" height="11" x="13" y="13" rx="1" fill="#4F46E5" />
              </svg>
              Continue with Nexora SSO
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              SSO bypasses credential checks — use for demo access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
