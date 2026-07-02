"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { profile } from "@/data/profile";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/", label: "首页" },
  { href: "/projects", label: "项目" },
  { href: "/resume", label: "简历" },
  { href: "/blog", label: "文章" },
  { href: "/lab", label: "实验室" },
  { href: "/about", label: "关于" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => setOpen(false), 0);
    return () => window.clearTimeout(timeout);
  }, [pathname]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (event.key === "Tab" && open && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (!first || !last) return;

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }, 80);
    return () => window.clearTimeout(timeout);
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[var(--z-nav)] isolate transition-all duration-300",
        scrolled ? "py-3" : "py-5",
      )}
    >
      <div
        className={cn(
          "container-shell flex items-center justify-between rounded-full px-4 transition-all duration-300",
          scrolled ? "glass h-12 shadow-sm" : "h-12",
        )}
      >
        <Link
          className="focus-ring rounded-full text-sm font-semibold"
          href="/"
        >
          {profile.name}
        </Link>
        <nav className="hidden items-center gap-1 md:flex" aria-label="主导航">
          {nav.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                className={cn(
                  "focus-ring rounded-full px-3 py-2 text-sm text-[var(--text-secondary)] transition-colors",
                  active &&
                    "bg-[var(--surface-muted)] text-[var(--text-primary)]",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            ref={triggerRef}
            aria-label={open ? "关闭菜单" : "打开菜单"}
            className="focus-ring grid size-10 place-items-center rounded-full border border-[var(--border)] bg-[var(--surface)] md:hidden"
            type="button"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-0 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              aria-label="关闭菜单遮罩"
              className="absolute inset-0 z-0 bg-black/20"
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
            />
            <motion.nav
              ref={panelRef}
              className="glass absolute inset-x-4 top-20 z-10 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-[24px] p-4 shadow-[var(--shadow-soft)]"
              initial={{ y: -18, scale: 0.98, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: -18, scale: 0.98, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              aria-label="移动端导航"
            >
              <div className="grid gap-2">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="focus-ring rounded-2xl px-4 py-4 text-lg font-medium"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
