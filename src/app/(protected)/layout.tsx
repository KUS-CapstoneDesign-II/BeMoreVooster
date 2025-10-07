"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, BarChart3, User as UserIcon } from "lucide-react";
import { LanguageSwitcher } from "@/components/ui/language-switcher";

type ProtectedLayoutProps = {
  children: ReactNode;
};

// Rely on middleware for auth protection to avoid double redirects.
export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const pathname = usePathname();
  return (
    <div className="relative min-h-dvh pb-16">
      {/* Desktop header */}
      <div className="sticky top-0 z-30 hidden border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:block">
        <nav className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-3">
          <div className="text-lg font-semibold tracking-tight">BeMore</div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link href="/home" aria-current={pathname === "/home" ? "page" : undefined} className={pathname === "/home" ? "text-primary" : "text-foreground"}>Home</Link>
              <Link href="/dashboard" aria-current={pathname === "/dashboard" ? "page" : undefined} className={pathname === "/dashboard" ? "text-primary" : "text-foreground"}>Dashboard</Link>
              <Link href="/profile" aria-current={pathname === "/profile" ? "page" : undefined} className={pathname === "/profile" ? "text-primary" : "text-foreground"}>Profile</Link>
            </div>
            <LanguageSwitcher />
          </div>
        </nav>
      </div>
      {children}
      {/* Mobile bottom navigation across all protected pages */}
      <div className="fixed inset-x-0 bottom-0 z-10 border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden">
        <nav className="mx-auto flex max-w-screen-sm items-center justify-around p-2">
          <Button asChild variant="ghost" size="icon" aria-label="Home">
            <Link href="/home" aria-current={pathname === "/home" ? "page" : undefined}>
              <Home className={pathname === "/home" ? "h-5 w-5 text-primary" : "h-5 w-5"} />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Dashboard">
            <Link href="/dashboard" aria-current={pathname === "/dashboard" ? "page" : undefined}>
              <BarChart3 className={pathname === "/dashboard" ? "h-5 w-5 text-primary" : "h-5 w-5"} />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="Profile">
            <Link href="/profile" aria-current={pathname === "/profile" ? "page" : undefined}>
              <UserIcon className={pathname === "/profile" ? "h-5 w-5 text-primary" : "h-5 w-5"} />
            </Link>
          </Button>
        </nav>
      </div>
    </div>
  );
}
