"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

type SignupPageProps = {
  params: Promise<Record<string, never>>;
};

export default function SignupPage({ params }: SignupPageProps) {
  void params;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    // Stubbed action: UI-only
    // eslint-disable-next-line no-console
    console.log({ email, password, action: "signup" });
    setTimeout(() => setIsSubmitting(false), 400);
  }, [email, password]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-6 py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription>Start your journey of self-awareness.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password" />
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create Account"}</Button>
              <Button type="button" variant="outline" onClick={() => { /* eslint-disable-next-line no-console */ console.log("google_signup_click"); }}>
                <Chrome className="mr-2 h-4 w-4" />
                Sign Up with Google
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
          <p className="text-sm text-muted-foreground">
            Already have an account? <Link className="text-primary underline underline-offset-4" href="/login">Sign In</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
