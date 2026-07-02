"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BrandIntro } from "@/components/animation/BrandIntro";
import { BlogCursor } from "@/components/effects/BlogCursor";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <BrandIntro />
      <BlogCursor />
      <Header />
      {children}
      <Footer />
    </>
  );
}
