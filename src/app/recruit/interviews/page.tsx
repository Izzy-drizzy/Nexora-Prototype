import Link from "next/link";
import { Video, Phone, Users, CalendarDays, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SCHEDULE = [
  {
    date: "Today — Wednesday, 11 Jun",
    interviews: [
      { id: "a1", time: "10:00", duration: "60 min", candidate: "Marcus Adeyemi", initials: "MA", role: "Sr. Data Engineer", format: "Panel", round: "Rd. 2", interviewers: ["Sarah T.", "James O.", "Fatima A."], link: "/recruit/candidates/c1" },
      { id: "a2", time: "14:30", duration: "30 min", candidate: "Lena Hartmann",   initials: "LH", role: "UX Researcher",    format: "Phone", round: "",       interviewers: ["Sarah T."],                            link: "/recruit/candidates/c2" },
      { id: "a3", time: "16:00", duration: "60 min", candidate: "Kwame Asante",    initials: "KA", role: "Solutions Arch.",  format: "Technical", round: "",   interviewers: ["James O.", "Fatima A."],               link: "/recruit/candidates/c3" },
    ],
  },
  {
    date: "Tomorrow — Thursday, 12 Jun",
    interviews: [
      { id: "b1", time: "09:00", duration: "60 min", candidate: "Nadia Ibrahim",   initials: "NI", role: "UX Researcher",    format: "Panel",  round: "Rd. 1", interviewers: ["Sarah T.", "James O."],               link: "/recruit/candidates/c2" },
      { id: "b2", time: "11:30", duration: "30 min", candidate: "Alex Müller",     initials: "AM", role: "Sr. Data Engineer",format: "Phone",  round: "",      interviewers: ["Fatima A."],                           link: "/recruit/candidates/c3" },
    ],
  },
  {
    date: "Friday, 13 Jun",
    interviews: [
      { id: "c1", time: "10:00", duration: "90 min", candidate: "Marcus Adeyemi", initials: "MA", role: "Sr. Data Engineer", format: "Panel", round: "Rd. 2 Final", interviewers: ["Sarah T.", "James O.", "Fatima A.", "CEO"], link: "/recruit/candidates/c1" },
    ],
  },
];

const FORMAT_ICON: Record<string, React.ElementType> = {
  Panel:     Users,
  Phone:     Phone,
  Technical: Users,
  Video:     Video,
};

const FORMAT_COLOR: Record<string, string> = {
  Panel:     "bg-primary/10 text-primary",
  Phone:     "bg-teal-50 text-teal-700",
  Technical: "bg-violet-50 text-violet-700",
  Video:     "bg-blue-50 text-blue-700",
};

export default function InterviewsPage() {
  const totalToday = SCHEDULE[0].interviews.length;

  return (
    <div className="px-8 py-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Interviews</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {totalToday} scheduled today · Week of 11–15 Jun
          </p>
        </div>
        <Button size="sm" className="h-9 gap-2">
          <CalendarDays className="w-4 h-4" />
          Schedule new
        </Button>
      </div>

      <Separator />

      {/* Interview groups by day */}
      <div className="space-y-8">
        {SCHEDULE.map((day) => (
          <div key={day.date}>
            <div className="flex items-center gap-3 mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {day.date}
              </p>
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">{day.interviews.length} interview{day.interviews.length > 1 ? "s" : ""}</span>
            </div>

            <div className="space-y-3">
              {day.interviews.map((interview) => {
                const Icon = FORMAT_ICON[interview.format] ?? Video;
                return (
                  <Card key={interview.id} className="hover:border-primary/30 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        {/* Time */}
                        <div className="w-16 flex-shrink-0 text-center">
                          <p className="text-lg font-bold text-foreground tabular-nums leading-none">{interview.time}</p>
                          <div className="flex items-center justify-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-[10px] text-muted-foreground">{interview.duration}</span>
                          </div>
                        </div>

                        <Separator orientation="vertical" className="h-12" />

                        {/* Candidate */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <Avatar className="w-9 h-9 flex-shrink-0">
                            <AvatarFallback className="text-xs font-bold bg-secondary text-primary">
                              {interview.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground leading-none mb-0.5 truncate">
                              {interview.candidate}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{interview.role}</p>
                          </div>
                        </div>

                        {/* Format */}
                        <Badge
                          variant="secondary"
                          className={`gap-1.5 flex-shrink-0 ${FORMAT_COLOR[interview.format] ?? ""}`}
                        >
                          <Icon className="w-3 h-3" />
                          {interview.format}{interview.round ? ` ${interview.round}` : ""}
                        </Badge>

                        {/* Interviewers */}
                        <div className="hidden md:flex items-center gap-1 flex-shrink-0">
                          {interview.interviewers.slice(0, 3).map((name) => (
                            <div
                              key={name}
                              className="w-7 h-7 rounded-full bg-muted border-2 border-background flex items-center justify-center -ml-1.5 first:ml-0"
                              title={name}
                            >
                              <span className="text-[9px] font-bold text-muted-foreground">
                                {name.split(" ").map((n) => n[0]).join("")}
                              </span>
                            </div>
                          ))}
                          {interview.interviewers.length > 3 && (
                            <span className="text-[10px] text-muted-foreground ml-1">
                              +{interview.interviewers.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Action */}
                        <Link
                          href={interview.link}
                          className="text-xs font-medium text-primary hover:underline underline-offset-4 flex-shrink-0"
                        >
                          View →
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
