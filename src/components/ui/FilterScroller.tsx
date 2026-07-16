"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type FilterScrollerProps<T extends string> = {
  items: readonly T[];
  active: T;
  onChange: (value: T) => void;
  getLabel?: (value: T) => ReactNode;
  subtle?: boolean;
  ariaLabel: string;
  className?: string;
};

export function FilterScroller<T extends string>({
  items,
  active,
  onChange,
  getLabel,
  subtle = false,
  ariaLabel,
  className,
}: FilterScrollerProps<T>) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const sync = () => {
      setAtEnd(
        scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 8,
      );
    };

    sync();
    scroller.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      scroller.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [items]);

  return (
    <div className={cn("relative w-full min-w-0", className)}>
      <div
        ref={scrollerRef}
        className="w-full min-w-0 overflow-x-auto pb-2 [scrollbar-width:none] md:overflow-visible [&::-webkit-scrollbar]:hidden"
        aria-label={ariaLabel}
      >
        <div className="flex w-max min-w-full gap-2 pr-5 md:w-full md:flex-wrap md:pr-0">
          {items.map((item) => {
            const selected = active === item;
            return (
              <button
                key={item}
                type="button"
                aria-pressed={selected}
                className={cn(
                  "focus-ring min-h-10 shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm transition-colors",
                  !subtle && "border border-[var(--border)]",
                  selected && !subtle
                    ? "bg-[var(--text-primary)] text-[var(--background)]"
                    : selected
                      ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]",
                )}
                onClick={() => onChange(item)}
              >
                {getLabel ? getLabel(item) : item}
              </button>
            );
          })}
        </div>
      </div>
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[var(--background)] to-transparent transition-opacity md:hidden",
          atEnd ? "opacity-0" : "opacity-100",
        )}
        aria-hidden="true"
      />
    </div>
  );
}
