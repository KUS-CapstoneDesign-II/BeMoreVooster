"use client";

import Link from "next/link";
import { BarChart3, PlayCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-6 px-6 py-20 text-center md:gap-8 md:py-28">
        <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
          <BarChart3 className="h-3.5 w-3.5 text-primary" />
          BeMore — Calm, Insightful, Encouraging
        </div>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-5xl">
          Understand your emotions, build mindful habits
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          Weekly reflections turn into clear insights with VAD trends and CBT guidance. Your data stays private; your progress stays visible.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/signup" className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-xs transition hover:bg-primary/90">
            Start Free
          </Link>
          <Link href="/login" className="inline-flex items-center justify-center rounded-md border px-5 py-3 text-sm font-medium">
            Sign In
          </Link>
        </div>
      </section>
      <section className="mx-auto w-full max-w-5xl px-6 pb-20">
        <div className="rounded-xl border bg-card p-6 text-card-foreground">
          <h2 className="text-xl font-semibold">How it works</h2>
          <ol className="mt-4 grid gap-4 text-sm text-muted-foreground md:grid-cols-3">
            <li className="rounded-lg border p-4">
              1) Record (2–3 min) — face, voice, and text
            </li>
            <li className="rounded-lg border p-4">
              2) Instant analysis — VAD vector and emotion labels
            </li>
            <li className="rounded-lg border p-4">
              3) Actionable CBT tips and weekly trend dashboard
            </li>
          </ol>
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground">
            <PlayCircle className="h-4 w-4" /> Demo coming soon
          </div>
        </div>
      </section>
    </main>
  );
}
