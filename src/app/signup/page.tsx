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

  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setInfo(null);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
      if (signUpError) {
        setError(signUpError.message || "Failed to create account.");
        toast({ title: t("signup_primary"), description: signUpError.message || "Failed to create account.", variant: "destructive" });
        return;
      }
      if (data.session) {
        toast({ title: t("signup_primary"), description: "Account created and signed in" });
        router.replace("/dashboard");
      } else {
        setInfo("Verification email sent. Please check your inbox.");
        toast({ title: t("signup_primary"), description: "Verification email sent" });
        router.prefetch("/login");
      }
    } catch (e) {
      setError("Unexpected error occurred.");
      toast({ title: t("signup_primary"), description: "Unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  }, [email, password, router]);

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
