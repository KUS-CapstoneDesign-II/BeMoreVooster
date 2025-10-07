"use client";

import Link from "next/link";
import { BarChart3, PlayCircle, Sparkles, TrendingUp, Heart } from "lucide-react";
import { useI18n } from "@/features/i18n/language-context";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

export default function Home() {
  const { t } = useI18n();
  return (
    <main className="min-h-screen bg-gradient-hero-alt text-foreground relative overflow-hidden">
      {/* Language Switcher - Fixed Top Right */}
      <div className="fixed right-6 top-6 z-50">
        <LanguageSwitcher />
      </div>

      {/* Background decorative elements */}
      <div className="absolute inset-0 radial-teal" />
      <div className="absolute inset-0 radial-navy" />

      {/* Hero Section */}
      <section className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-8 px-6 py-24 text-center md:gap-10 md:py-32">
        {/* Tagline Badge */}
        <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-muted-foreground shadow-sm hover-scale-sm animate-fade-in">
          <div className="h-8 w-8 rounded-full bg-gradient-teal flex items-center justify-center shadow-glow-teal">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium">{t("brand_tagline")}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl animate-fade-in-up">
          {t("hero_title").split(' ').slice(0, -3).join(' ')}{' '}
          <span className="gradient-text-teal">
            {t("hero_title").split(' ').slice(-3).join(' ')}
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed animate-fade-in">
          {t("hero_sub")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-4 sm:flex-row animate-fade-in">
          <Link
            href="/signup"
            className="group inline-flex items-center justify-center rounded-lg bg-gradient-teal px-8 py-4 text-base font-semibold text-white shadow-lg hover-lift scale-press transition-all"
          >
            <Sparkles className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
            {t("cta_start")}
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg glass-hover px-8 py-4 text-base font-semibold transition-all hover-lift-sm"
          >
            {t("cta_signin")}
          </Link>
        </div>

        {/* Social Proof / Trust Indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-brand-teal" />
            <span>Evidence-based approach</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-brand-teal" />
            <span>Track your progress</span>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative mx-auto w-full max-w-6xl px-6 pb-24 md:pb-32">
        <div className="rounded-2xl glass border-white/20 p-8 md:p-10 shadow-float">
          {/* Section Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">
              {t("how_it_works")}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to understand your emotional patterns
            </p>
          </div>

          {/* Steps Grid */}
          <ol className="grid gap-6 md:grid-cols-3">
            <li className="group relative rounded-xl glass-hover p-6 hover-lift transition-all">
              <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-gradient-teal flex items-center justify-center text-white font-bold shadow-glow-teal">
                1
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  Weekly Reflection
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("step_1")}
                </p>
              </div>
            </li>

            <li className="group relative rounded-xl glass-hover p-6 hover-lift transition-all">
              <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-gradient-teal flex items-center justify-center text-white font-bold shadow-glow-teal">
                2
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  VAD Analysis
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("step_2")}
                </p>
              </div>
            </li>

            <li className="group relative rounded-xl glass-hover p-6 hover-lift transition-all">
              <div className="absolute -top-4 -left-4 h-12 w-12 rounded-full bg-gradient-teal flex items-center justify-center text-white font-bold shadow-glow-teal">
                3
              </div>
              <div className="mt-4">
                <h3 className="font-semibold text-lg mb-2 text-foreground">
                  CBT Guidance
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t("step_3")}
                </p>
              </div>
            </li>
          </ol>

          {/* Demo Notice */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground glass px-4 py-2 rounded-full">
              <PlayCircle className="h-4 w-4 text-brand-teal" />
              {t("demo_soon")}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
