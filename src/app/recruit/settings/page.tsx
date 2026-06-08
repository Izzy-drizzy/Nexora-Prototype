"use client";

import { useState } from "react";
import { Bell, Shield, Users, Sliders, Globe, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "profile",       label: "Profile",        icon: Users   },
  { id: "notifications", label: "Notifications",   icon: Bell    },
  { id: "automations",   label: "Automations",     icon: Sliders },
  { id: "team",          label: "Team & Access",   icon: Shield  },
  { id: "integrations",  label: "Integrations",    icon: Globe   },
  { id: "templates",     label: "Email templates", icon: Mail    },
];

type ToggleProps = { label: string; description: string; defaultOn?: boolean };
function Toggle({ label, description, defaultOn = true }: ToggleProps) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-start justify-between gap-6">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className={cn(
          "w-10 h-5.5 rounded-full flex-shrink-0 relative transition-colors mt-0.5",
          on ? "bg-primary" : "bg-muted-foreground/30"
        )}
        style={{ height: "22px", minWidth: "40px" }}
      >
        <span className={cn(
          "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
          on ? "translate-x-[18px]" : "translate-x-0"
        )} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [displayName, setDisplayName] = useState("Sarah Thompson");
  const [email] = useState("sarah.thompson@nexora.com");
  const [title, setTitle] = useState("Talent Acquisition Specialist");

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your account, notifications, and platform preferences</p>
      </div>

      <Separator />

      <div className="flex gap-6 items-start">
        {/* Sidebar nav */}
        <nav className="w-48 flex-shrink-0 space-y-0.5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left",
                activeTab === id
                  ? "bg-secondary text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <Icon className={cn("w-4 h-4 flex-shrink-0", activeTab === id ? "text-primary" : "text-muted-foreground")} />
              {label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-4">

          {/* Profile */}
          {activeTab === "profile" && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Profile information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="text-xl font-bold bg-primary text-white">ST</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm" className="h-8 text-xs">Change photo</Button>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 2MB</p>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Display name</Label>
                    <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} className="h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Job title</Label>
                    <Input value={title} onChange={(e) => setTitle(e.target.value)} className="h-9" />
                  </div>
                  <div className="space-y-1.5 col-span-2">
                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Work email</Label>
                    <Input value={email} disabled className="h-9 bg-muted/50" />
                    <p className="text-xs text-muted-foreground">Managed by Nexora SSO — contact IT to change.</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button size="sm" className="h-8 text-xs px-4">Save changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notifications */}
          {activeTab === "notifications" && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Notification preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pipeline alerts</p>
                  <Toggle label="New application received"       description="Notify when a candidate applies to one of your active roles." />
                  <Toggle label="AI screening complete"          description="Notify when AI match score is ready for a new applicant." />
                  <Toggle label="Interview confirmed"            description="Notify when a candidate books a slot via the self-service portal." />
                  <Toggle label="Offer opened"                   description="Notify when a candidate views their offer letter." defaultOn={false} />
                </div>
                <Separator />
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reminders</p>
                  <Toggle label="Unsigned offer expiry warning"  description="Alert 7 days before an offer expires without a response." />
                  <Toggle label="Unreviewed CVs digest"          description="Daily summary of CVs awaiting manual review." />
                  <Toggle label="Unconfirmed interview reminder" description="Alert 24 hours before an interview with no candidate confirmation." />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Automations */}
          {activeTab === "automations" && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Automation rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Candidate communications</p>
                  <Toggle label="Application received confirmation"  description="Auto-send confirmation email when a candidate submits an application." />
                  <Toggle label="Stage progression notifications"    description="Auto-notify candidate when moved to a new pipeline stage." />
                  <Toggle label="Interview invite automation"        description="Auto-send calendar invite when candidate confirms a slot." />
                  <Toggle label="Rejection notifications"            description="Auto-send rejection email when candidate stage is set to Rejected." />
                  <Toggle label="Offer reminder follow-ups"          description="Auto-send reminders to candidates with unsigned offers." />
                </div>
                <Separator />
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">AI screening</p>
                  <Toggle label="AI CV screening"       description="Automatically score all new applications against role requirements." />
                  <Toggle label="Auto-advance top matches" description="Automatically move candidates with score ≥ 90 to Screening stage." defaultOn={false} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Team */}
          {activeTab === "team" && (
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Team members</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0 p-0">
                {[
                  { name: "Sarah Thompson", email: "s.thompson@nexora.com", role: "Recruiter",       initials: "ST", badge: "You"  },
                  { name: "James Okafor",   email: "j.okafor@nexora.com",   role: "Recruiter",       initials: "JO", badge: null   },
                  { name: "Fatima Adeola",  email: "f.adeola@nexora.com",   role: "HR Manager",      initials: "FA", badge: null   },
                  { name: "David Park",     email: "d.park@nexora.com",     role: "Hiring Manager",  initials: "DP", badge: null   },
                ].map((member, i, arr) => (
                  <div key={member.email} className={cn(
                    "flex items-center gap-3 px-5 py-3.5",
                    i < arr.length - 1 && "border-b border-border"
                  )}>
                    <Avatar className="w-9 h-9 flex-shrink-0">
                      <AvatarFallback className="text-xs font-bold bg-secondary text-primary">{member.initials}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-foreground leading-none">{member.name}</p>
                        {member.badge && <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{member.badge}</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{member.email}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{member.role}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Placeholder for other tabs */}
          {(activeTab === "integrations" || activeTab === "templates") && (
            <Card>
              <CardContent className="p-10 flex flex-col items-center gap-3 text-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {activeTab === "integrations"
                    ? <Globe className="w-5 h-5 text-muted-foreground" />
                    : <Mail className="w-5 h-5 text-muted-foreground" />}
                </div>
                <p className="text-sm font-semibold text-foreground">
                  {activeTab === "integrations" ? "Integrations" : "Email templates"}
                </p>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  {activeTab === "integrations"
                    ? "Connect your calendar, ATS, and HRIS systems. Configuration is handled by your IT administrator."
                    : "Customise automated notification emails sent to candidates at each pipeline stage."}
                </p>
                <Button variant="outline" size="sm" className="h-8 text-xs">Contact IT admin</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
