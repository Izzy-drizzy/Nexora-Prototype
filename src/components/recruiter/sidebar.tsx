"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  CalendarCheck,
  KanbanSquare,
  BarChart3,
  Settings,
  Building2,
  LogOut,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
  {
    section: "Main",
    items: [
      { label: "Dashboard",   href: "/recruit/dashboard",   icon: LayoutDashboard },
      { label: "Jobs",        href: "/recruit/jobs",        icon: Briefcase       },
      { label: "Candidates",  href: "/recruit/candidates",  icon: Users           },
      { label: "Interviews",  href: "/recruit/interviews",  icon: CalendarCheck   },
      { label: "Pipeline",    href: "/recruit/pipeline",    icon: KanbanSquare    },
    ],
  },
  {
    section: "Reporting",
    items: [
      { label: "Analytics",   href: "/recruit/analytics",   icon: BarChart3       },
    ],
  },
  {
    section: "Admin",
    items: [
      { label: "Settings",    href: "/recruit/settings",    icon: Settings        },
    ],
  },
];

function NavContent({ pathname, onNavClick }: { pathname: string; onNavClick?: () => void }) {
  return (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-sidebar-border flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground leading-none">Nexora</p>
          <p className="text-[10px] text-muted-foreground leading-none mt-0.5 font-medium tracking-wide uppercase">Recruit</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV.map((group) => (
          <div key={group.section}>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70 px-2 mb-1.5">
              {group.section}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ label, href, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={onNavClick}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium transition-colors",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 flex-shrink-0", active ? "text-primary" : "text-muted-foreground")} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User profile */}
      <div className="px-3 pb-4">
        <Separator className="mb-3" />
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-md hover:bg-muted/60 cursor-pointer group">
          <Avatar className="w-7 h-7 flex-shrink-0">
            <AvatarFallback className="bg-primary text-white text-xs font-semibold">ST</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground leading-none truncate">Sarah Thompson</p>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5 truncate">Talent Acquisition</p>
          </div>
          <LogOut className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
        </div>
      </div>
    </>
  );
}

export function RecruiterSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0 bg-sidebar border-r border-sidebar-border">
      <NavContent pathname={pathname} />
    </aside>
  );
}

export function MobileHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="flex md:hidden items-center gap-3 px-4 h-14 border-b border-border bg-sidebar sticky top-0 z-40 flex-shrink-0">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          className="p-1.5 rounded-md hover:bg-muted/60 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </SheetTrigger>
        <SheetContent side="left" className="w-60 p-0 bg-sidebar border-sidebar-border flex flex-col">
          <NavContent pathname={pathname} onNavClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <Link href="/recruit/dashboard" className="flex items-center gap-2 ml-auto">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
          <Building2 className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-foreground leading-none">Nexora</p>
          <p className="text-[10px] text-muted-foreground font-medium tracking-wide uppercase leading-none mt-0.5">Recruit</p>
        </div>
      </Link>
    </header>
  );
}
