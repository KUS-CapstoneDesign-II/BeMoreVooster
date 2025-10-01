"use client";

import type { ReactNode } from "react";

type ProtectedLayoutProps = {
  children: ReactNode;
};

// Rely on middleware for auth protection to avoid double redirects.
export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return <>{children}</>;
}
