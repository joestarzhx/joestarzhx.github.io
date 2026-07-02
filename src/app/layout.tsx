import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { Providers } from "@/components/providers";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "张颢轩｜个人作品集与在线简历",
    template: "%s | Haoxuan Zhang",
  },
  description:
    "张颢轩的个人作品集与在线简历，展示前端开发、交互动效、视觉设计、Manim 科普动画、AI 视觉创作与 Live2D 项目，并记录项目复盘与技术实践。",
  keywords: [
    "个人博客",
    "作品集",
    "前端开发",
    "交互设计",
    "动效设计",
    "Manim",
    "Live2D",
    "Next.js",
  ],
  authors: [{ name: "Haoxuan Zhang" }],
  creator: "Haoxuan Zhang",
  manifest: "/manifest.json",
  openGraph: {
    title: "张颢轩｜个人作品集与在线简历",
    description: "张颢轩的个人作品集与在线简历，展示项目、简历与创作记录。",
    type: "website",
    images: ["/images/branding/site-og-cover.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "张颢轩｜个人作品集与在线简历",
    description: "张颢轩的个人作品集与在线简历，展示项目、简历与创作记录。",
    images: ["/images/branding/site-og-cover.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#050506" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="noise" />
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
