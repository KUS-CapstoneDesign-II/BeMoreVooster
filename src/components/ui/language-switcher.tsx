"use client";

import { useI18n } from "@/features/i18n/language-context";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const next = locale === "ko" ? "en" : "ko";
  const label = next === "ko" ? t("ko_label") : t("en_label");

  return (
    <Button variant="ghost" size="sm" onClick={() => setLocale(next)} aria-label={label}>
      {label}
    </Button>
  );
}


