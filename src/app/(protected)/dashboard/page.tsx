"use client";

import { useMemo, useState } from "react";
import { Flame, CalendarDays, BarChart3, Home, User as UserIcon } from "lucide-react";
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

  const userLabel = useMemo(() => {
    if (user?.email) return user.email;
    return "Guest";
  }, [user?.email]);

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10">
      {/* App Header (Placeholder) */}
      <div className="mb-6 flex items-center justify-between lg:mb-8">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold tracking-tight text-foreground">BeMore</span>
        </div>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage alt="avatar" src="https://picsum.photos/seed/user/64/64" />
            <AvatarFallback>
              {userLabel.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Page Header with Date Range */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between lg:mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Your Progress, {userLabel}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Track your emotions and build mindful habits.</p>
        </div>
        <div className="w-full sm:w-56">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger aria-label="Select date range">
              <SelectValue placeholder="Last 30 Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 90 Days</SelectItem>
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
              <CardTitle>Emotion Trends</CardTitle>
              <CardDescription>Valence, Arousal, Dominance over time</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full rounded-md bg-muted" aria-label="Chart placeholder" />
            <div className="mt-4 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 rounded-full bg-primary" /> <span>Valence</span></div>
              <div className="flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 rounded-full bg-accent" /> <span>Arousal</span></div>
              <div className="flex items-center gap-2 text-sm"><span className="h-2.5 w-2.5 rounded-full bg-secondary" /> <span>Dominance</span></div>
            </div>
          </CardContent>
        </Card>

        {/* Right column: Habit Streak + Recent Snapshots */}
        <div className="space-y-6">
          {/* Habit Streak */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Habit Streak</CardTitle>
                <CardDescription>Your weekly reflections streak</CardDescription>
              </div>
              <Flame className="h-6 w-6 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold text-foreground">4</span>
                <span className="text-sm text-muted-foreground">Weeks Strong</span>
              </div>
            </CardContent>
          </Card>

          {/* Recent Snapshots */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-medium text-foreground">Recent Snapshots</h2>
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
          <Button variant="ghost" size="icon" aria-label="Home"><Home className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" aria-label="Dashboard"><BarChart3 className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" aria-label="Profile"><UserIcon className="h-5 w-5" /></Button>
        </nav>
      </div>
    </div>
  );
}
