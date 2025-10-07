"use client";

import { useMemo, useState } from "react";
import { Flame, CalendarDays, BarChart3, Home, User as UserIcon, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useI18n } from "@/features/i18n/language-context";
import { VADLineChart, generateMockSeries } from "@/features/dashboard/components/vad-line-chart";

type DashboardPageProps = {
  params: Promise<Record<string, never>>;
};

const MOCK_SNAPSHOTS = [
  { id: "s1", date: "2025-09-07", emotion: "Calm" },
  { id: "s2", date: "2025-09-14", emotion: "Focused" },
  { id: "s3", date: "2025-09-21", emotion: "Reflective" },
];

export default function DashboardPage({ params }: DashboardPageProps) {
  void params;
  const { user } = useCurrentUser();
  const [range, setRange] = useState<string>("30");
  const { t } = useI18n();
  const data = useMemo(() => generateMockSeries(Number(range)), [range]);

  const userLabel = useMemo(() => {
    const nickname = (user?.userMetadata as any)?.nickname as string | undefined;
    if (nickname && nickname.trim().length > 0) return nickname;
    if (user?.email) return user.email;
    return "Guest";
  }, [user?.email, user?.userMetadata]);

  return (
    <div className="min-h-screen bg-gradient-hero-alt relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 radial-teal opacity-50" />

      <div className="relative mx-auto w-full max-w-screen-2xl px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
        {/* App Header with glass effect */}
        <div className="mb-6 flex items-center justify-between lg:mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-teal flex items-center justify-center shadow-glow-teal">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text-brand">BeMore</span>
          </div>
          <Avatar className="ring-2 ring-brand-teal/20 ring-offset-2 hover-scale-sm transition-transform cursor-pointer">
            <AvatarImage src={user?.userMetadata?.avatarUrl as string} />
            <AvatarFallback className="bg-gradient-teal text-white font-semibold">
              {userLabel.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Page Header with Date Range */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                {t("dashboard_greeting")}, <span className="gradient-text-teal">{userLabel}</span>
              </h1>
            </div>
            <p className="text-base text-muted-foreground max-w-2xl">{t("hero_sub")}</p>
          </div>
          <div className="w-full sm:w-64">
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger aria-label="Select date range" className="glass-hover">
                <SelectValue placeholder={t("range_30")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">{t("range_7")}</SelectItem>
                <SelectItem value="30">{t("range_30")}</SelectItem>
                <SelectItem value="90">{t("range_90")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Layout */}
        <div className="grid gap-6 lg:grid-cols-3 pb-24 lg:pb-10">
          {/* Emotion Trends (Left, spans 2 cols on desktop) */}
          <Card className="lg:col-span-2 glass border-white/20 shadow-float hover-lift-sm transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
              <div>
                <CardTitle className="text-2xl font-bold">{t("emotion_trends")}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {`${t("valence")}, ${t("arousal")}, ${t("dominance")} over time`}
                </CardDescription>
              </div>
              <div className="h-12 w-12 rounded-xl bg-gradient-teal/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-brand-teal" />
              </div>
            </CardHeader>
            <CardContent>
              <VADLineChart data={data} />
              <div className="mt-6 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="h-3 w-3 rounded-full bg-primary shadow-sm" />
                  <span>{t("valence")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="h-3 w-3 rounded-full bg-accent shadow-sm" />
                  <span>{t("arousal")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="h-3 w-3 rounded-full bg-secondary shadow-sm" />
                  <span>{t("dominance")}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right column: Habit Streak + Recent Snapshots */}
          <div className="space-y-6">
            {/* Habit Streak - Enhanced with gradient background */}
            <Card className="relative overflow-hidden border-0 shadow-float hover-lift-sm transition-all">
              <div className="absolute inset-0 bg-gradient-teal" />
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.5),transparent_70%)]" />

              <CardContent className="relative pt-6 pb-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <Flame className="h-10 w-10 drop-shadow-lg" />
                  <div className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-semibold">
                    🔥 Best Streak
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-5xl font-bold tracking-tight drop-shadow-sm">4</div>
                  <div className="text-white/90 font-medium">{t("weekly_reflections")}</div>
                  <p className="text-xs text-white/70 leading-relaxed">
                    Keep going! You're building a powerful habit
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Snapshots */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-brand-teal" />
                  {t("recent_snapshots")}
                </h2>
              </div>
              {/* Mobile: horizontal scroll; Desktop: simple grid in column */}
              <div className="-mx-1 flex gap-4 overflow-x-auto px-1 lg:block lg:overflow-visible">
                <div className="flex gap-4 lg:grid lg:grid-cols-1 lg:gap-4">
                  {MOCK_SNAPSHOTS.map((s, index) => (
                    <Card
                      key={s.id}
                      className="group min-w-[280px] lg:min-w-0 glass-hover hover-lift-sm cursor-pointer transition-all border-white/20"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <CardTitle className="text-lg font-semibold group-hover:text-brand-teal transition-colors">
                              {s.emotion}
                            </CardTitle>
                            <CardDescription className="text-sm mt-1">{s.date}</CardDescription>
                          </div>
                          <div className="h-10 w-10 rounded-full bg-brand-teal/10 flex items-center justify-center group-hover:bg-brand-teal/20 transition-colors">
                            <span className="text-lg">📊</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          className="w-full justify-between hover:bg-brand-teal/10 group-hover:text-brand-teal transition-colors"
                        >
                          View Report
                          <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* App Navigation - Enhanced glass morphism */}
        <div className="fixed inset-x-0 bottom-0 z-10 glass border-t border-white/20 lg:hidden">
          <nav className="mx-auto flex max-w-screen-sm items-center justify-around p-3">
            <Button asChild variant="ghost" size="icon" aria-label="Home" className="hover:bg-brand-teal/10 transition-colors">
              <Link href="/home"><Home className="h-5 w-5" /></Link>
            </Button>
            <Button
              asChild
              size="icon"
              aria-label="Dashboard"
              className="h-12 w-12 rounded-full bg-gradient-teal text-white shadow-glow-teal hover:scale-105 transition-transform"
            >
              <Link href="/dashboard"><BarChart3 className="h-6 w-6" /></Link>
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label="Profile" className="hover:bg-brand-teal/10 transition-colors">
              <Link href="/profile"><UserIcon className="h-5 w-5" /></Link>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
