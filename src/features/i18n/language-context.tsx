"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type Locale = "en" | "ko";

type Dictionary = Record<string, string>;

const en: Dictionary = {
  brand_tagline: "BeMore — Calm, Insightful, Encouraging",
  hero_title: "Understand your emotions, build mindful habits",
  hero_sub: "Weekly reflections turn into clear insights with VAD trends and CBT guidance. Your data stays private; your progress stays visible.",
  cta_start: "Start Free",
  cta_signin: "Sign In",
  how_it_works: "How it works",
  step_1: "1) Record (2–3 min) — face, voice, and text",
  step_2: "2) Instant analysis — VAD vector and emotion labels",
  step_3: "3) Actionable CBT tips and weekly trend dashboard",
  demo_soon: "Demo coming soon",
  dashboard_greeting: "Your Progress",
  range_7: "Last 7 Days",
  range_30: "Last 30 Days",
  range_90: "Last 90 Days",
  habit_streak: "Habit Streak",
  weekly_reflections: "Weeks Strong",
  recent_snapshots: "Recent Snapshots",
  emotion_trends: "Emotion Trends",
  valence: "Valence",
  arousal: "Arousal",
  dominance: "Dominance",
  signup_title: "Create an Account",
  signup_sub: "Start your journey of self-awareness.",
  email: "Email",
  password: "Password",
  signup_primary: "Create Account",
  signup_google: "Sign Up with Google",
  have_account: "Already have an account?",
  signin_link: "Sign In",
  signin_title: "Welcome Back",
  signin_sub: "Sign in to continue your reflection.",
  signin_primary: "Sign In",
  signin_google: "Sign In with Google",
  forgot_password: "Forgot your password?",
  no_account: "Don't have an account?",
  ko_label: "한국어",
  en_label: "English",
};

const ko: Dictionary = {
  brand_tagline: "BeMore — 차분함, 통찰, 격려",
  hero_title: "감정을 이해하고, 마음챙김 습관을 쌓아보세요",
  hero_sub: "주간 성찰이 VAD 트렌드와 CBT 가이던스로 이어집니다. 데이터는 안전하게, 변화는 선명하게.",
  cta_start: "무료로 시작하기",
  cta_signin: "로그인",
  how_it_works: "사용 방법",
  step_1: "1) 2–3분 기록 — 얼굴, 음성, 텍스트",
  step_2: "2) 즉시 분석 — VAD 벡터와 감정 라벨",
  step_3: "3) 실행 가능한 CBT 팁과 주간 트렌드 대시보드",
  demo_soon: "데모 준비 중",
  dashboard_greeting: "나의 진척도",
  range_7: "최근 7일",
  range_30: "최근 30일",
  range_90: "최근 90일",
  habit_streak: "연속 기록",
  weekly_reflections: "주 연속",
  recent_snapshots: "최근 스냅샷",
  emotion_trends: "감정 트렌드",
  valence: "유쾌-불쾌",
  arousal: "각성",
  dominance: "지배",
  signup_title: "계정 만들기",
  signup_sub: "자기이해를 향한 여정을 시작해보세요.",
  email: "이메일",
  password: "비밀번호",
  signup_primary: "계정 생성",
  signup_google: "Google로 가입",
  have_account: "이미 계정이 있으신가요?",
  signin_link: "로그인",
  signin_title: "다시 만나 반가워요",
  signin_sub: "계속하려면 로그인하세요.",
  signin_primary: "로그인",
  signin_google: "Google로 로그인",
  forgot_password: "비밀번호를 잊으셨나요?",
  no_account: "계정이 없으신가요?",
  ko_label: "한국어",
  en_label: "English",
};

const dictionaries: Record<Locale, Dictionary> = { en, ko };

type LanguageContextValue = {
  locale: Locale;
  t: (key: keyof typeof en) => string;
  setLocale: (next: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const initial = (typeof window !== "undefined" && (localStorage.getItem("bemore_locale") as Locale)) || "ko";
  const [locale, setLocaleState] = useState<Locale>(initial);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem("bemore_locale", next);
    } catch {}
  }, []);

  const value = useMemo<LanguageContextValue>(() => {
    const dict = dictionaries[locale];
    const t = (key: keyof typeof en) => dict[key] ?? String(key);
    return { locale, setLocale, t };
  }, [locale, setLocale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}


