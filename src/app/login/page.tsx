"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import { useI18n } from "@/features/i18n/language-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useToast } from "@/hooks/use-toast";

type LoginPageProps = {
  params: Promise<Record<string, never>>;
};

export default function LoginPage({ params }: LoginPageProps) {
  void params;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const getErrorMessage = (error: any) => {
    if (!error) return "로그인에 실패했습니다.";

    // Supabase 오류 코드에 따른 사용자 친화적 메시지
    switch (error.message) {
      case "Invalid login credentials":
        return "이메일 또는 비밀번호가 올바르지 않습니다. 다시 확인해주세요.";
      case "Email not confirmed":
        return "이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.";
      case "Too many requests":
        return "너무 많은 로그인 시도가 있었습니다. 잠시 후 다시 시도해주세요.";
      case "User not found":
        return "등록되지 않은 이메일입니다. 회원가입을 먼저 진행해주세요.";
      default:
        return error.message || "로그인 중 오류가 발생했습니다.";
    }
  };

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        const errorMessage = getErrorMessage(signInError);
        setError(errorMessage);
        toast({ title: "로그인 실패", description: errorMessage, variant: "destructive" });
        return;
      }
      toast({ title: "로그인 성공", description: "성공적으로 로그인되었습니다." });
      const redirectedFrom = searchParams.get("redirectedFrom") || "/dashboard";
      router.replace(redirectedFrom);
    } catch (e) {
      const errorMessage = "예상치 못한 오류가 발생했습니다.";
      setError(errorMessage);
      toast({ title: "오류", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, router, searchParams, toast]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-6 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("signin_title")}</CardTitle>
          <CardDescription>{t("signin_sub")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing In..." : t("signin_primary")}</Button>
              <Button type="button" variant="outline" onClick={() => { /* placeholder */ }}>
                <Chrome className="mr-2 h-4 w-4" />
                {t("signin_google")}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Link href="#" className="text-sm text-primary underline underline-offset-4">{t("forgot_password")}</Link>
          <p className="text-sm text-muted-foreground">
            {t("no_account")} <Link className="text-primary underline underline-offset-4" href="/signup">{t("signup_primary")}</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
