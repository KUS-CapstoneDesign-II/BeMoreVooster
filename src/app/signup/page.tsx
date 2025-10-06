"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";
import { useI18n } from "@/features/i18n/language-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import { useToast } from "@/hooks/use-toast";

type SignupPageProps = {
  params: Promise<Record<string, never>>;
};

export default function SignupPage({ params }: SignupPageProps) {
  void params;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useI18n();
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const getSignupErrorMessage = (error: any) => {
    if (!error) return "회원가입에 실패했습니다.";

    // Supabase 오류 코드에 따른 사용자 친화적 메시지
    switch (error.message) {
      case "User already registered":
        return "이미 가입된 이메일입니다. 로그인을 시도해보세요.";
      case "Password should be at least 6 characters":
        return "비밀번호는 최소 6자 이상이어야 합니다.";
      case "Signup is disabled":
        return "현재 회원가입이 비활성화되어 있습니다.";
      case "Invalid email":
        return "유효하지 않은 이메일 형식입니다.";
      default:
        return error.message || "회원가입 중 오류가 발생했습니다.";
    }
  };

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setInfo(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        const errorMessage = getSignupErrorMessage(signUpError);
        setError(errorMessage);
        toast({ title: "회원가입 실패", description: errorMessage, variant: "destructive" });
        return;
      }
      if (data.session) {
        toast({ title: "회원가입 성공", description: "계정이 생성되고 로그인되었습니다." });
        router.replace("/dashboard");
      } else {
        const infoMessage = "인증 이메일이 발송되었습니다. 이메일을 확인해주세요.";
        setInfo(infoMessage);
        toast({ title: "인증 이메일 발송", description: infoMessage });
        router.prefetch("/login");
      }
    } catch (e) {
      const errorMessage = "예상치 못한 오류가 발생했습니다.";
      setError(errorMessage);
      toast({ title: "오류", description: errorMessage, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, router, toast]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-6 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t("signup_title")}</CardTitle>
          <CardDescription>{t("signup_sub")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : t("signup_primary")}</Button>
              <Button type="button" variant="outline" onClick={() => { /* placeholder */ }}>
                <Chrome className="mr-2 h-4 w-4" />
                {t("signup_google")}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {info ? <p className="text-sm text-emerald-600">{info}</p> : null}
          <p className="text-sm text-muted-foreground">
            {t("have_account")} <Link className="text-primary underline underline-offset-4" href="/login">{t("signin_link")}</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
