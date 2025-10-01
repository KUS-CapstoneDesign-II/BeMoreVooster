"use client";

import { useMemo, useState } from "react";
import { Flame, CalendarDays, BarChart3, Home, User as UserIcon } from "lucide-react";
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

  const userLabel = useMemo(() => {
    const nickname = (user?.userMetadata as any)?.nickname as string | undefined;
    if (nickname && nickname.trim().length > 0) return nickname;
    if (user?.email) return user.email;
    return "Guest";
  }, [user?.email, user?.userMetadata]);

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
      {/* App Header (Placeholder) */}
      <div className="mb-6 flex items-center justify-between lg:mb-8">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold tracking-tight text-foreground">BeMore</span>
        </div>
        <div />
      </div>

      {/* Page Header with Date Range */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between lg:mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {t("dashboard_greeting")}, {userLabel}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("hero_sub")}</p>
        </div>
        <div className="w-full sm:w-56">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger aria-label="Select date range">
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
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Emotion Trends (Left, spans 2 cols on desktop) */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>{t("emotion_trends")}</CardTitle>
              <CardDescription>{`${t("valence")}, ${t("arousal")}, ${t("dominance")} over time`}</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full rounded-md bg-muted" aria-label="Chart placeholder" />
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> <span>{t("valence")}</span></div>
              <div className="flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 rounded-full bg-accent" /> <span>{t("arousal")}</span></div>
              <div className="flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 rounded-full bg-secondary" /> <span>{t("dominance")}</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Right column: Habit Streak + Recent Snapshots */}
        <div className="space-y-6">
          {/* Habit Streak */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>{t("habit_streak")}</CardTitle>
                <CardDescription>{t("hero_sub")}</CardDescription>
              </div>
              <Flame className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-foreground">4</span>
                <span className="text-sm text-muted-foreground">{t("weekly_reflections")}</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Snapshots */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground">{t("recent_snapshots")}</h2>
              <CalendarDays className="h-5 w-5 text-muted-foreground" />
            </div>
            {/* Mobile: horizontal scroll; Desktop: simple grid in column */}
            <div className="-mx-1 flex gap-3 overflow-x-auto px-1 lg:block lg:overflow-visible">
              <div className="flex gap-3 lg:grid lg:grid-cols-1">
                {MOCK_SNAPSHOTS.map((s) => (
                  <Card key={s.id} className="min-w-[260px] lg:min-w-0">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{s.emotion}</CardTitle>
                      <CardDescription>{s.date}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button className="w-full">View Report</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* App Navigation (Placeholder) */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <nav className="mx-auto flex max-w-screen-sm items-center justify-around p-2">
          <Button asChild variant="ghost" size="icon" aria-label="Home">
            <Link href="/home"><Home className="h-5 w-5" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Dashboard">
            <Link href="/dashboard"><BarChart3 className="h-5 w-5" /></Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Profile">
            <Link href="/profile"><UserIcon className="h-5 w-5" /></Link>
          </Button>
        </nav>
      </div>
    </div>
  );
}
