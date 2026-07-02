import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BrandIntro } from "@/components/animation/BrandIntro";
import { BlogCursor } from "@/components/effects/BlogCursor";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
    default: "张颢轩（Haoxuan Zhang）｜个人博客与作品集",
    template: "%s | Haoxuan Zhang",
  },
  description:
    "张颢轩的个人博客与数字作品集，记录前端开发、交互动效、视觉设计、Manim 科普动画、AI 视觉创作与 Live2D 项目。",
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
    title: "张颢轩（Haoxuan Zhang）｜个人博客与作品集",
    description: "张颢轩的个人博客与数字作品集。",
    type: "website",
    images: ["/images/branding/site-og-cover.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "张颢轩（Haoxuan Zhang）｜个人博客与作品集",
    description: "张颢轩的个人博客与数字作品集。",
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
          <BrandIntro />
          <BlogCursor />
          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
