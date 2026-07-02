"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ProjectImage } from "@/components/project/ProjectImage";
import type { labItems } from "@/data/lab";

type LabItem = (typeof labItems)[number];

export function LabHorizontalShowcase({ items }: { items: LabItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const [compact, setCompact] = useState(false);
  const reduceMotion = useReducedMotion();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const visibleItems = !compact || expanded ? items : items.slice(0, 4);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const sync = () => setCompact(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  const toggleExpanded = () => {
    setExpanded((value) => {
      const next = !value;
      if (value) {
        window.setTimeout(() => {
          const button = buttonRef.current;
          if (!button) return;
          const rect = button.getBoundingClientRect();
          if (rect.top < 80 || rect.top > window.innerHeight - 120) {
            button.scrollIntoView({
              block: "center",
              behavior: reduceMotion ? "instant" : "smooth",
            });
          }
        }, reduceMotion ? 0 : 180);
      }
      return next;
    });
  };

  return (
    <section className="w-full min-w-0 max-w-full">
      <div className="mb-5 flex min-w-0 items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[var(--accent)]">Experiments</p>
          <h2 className="mt-2 text-3xl font-semibold">实验轨道</h2>
        </div>
        <p className="hidden shrink-0 text-sm text-[var(--text-secondary)] lg:block">
          01 / {String(items.length).padStart(2, "0")}
        </p>
      </div>

      <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence initial={false}>
          {visibleItems.map((item, index) => (
            <motion.article
              layout
              initial={{ opacity: 0, height: reduceMotion ? "auto" : 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: reduceMotion ? "auto" : 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.22 }}
              className="min-w-0 overflow-hidden rounded-[20px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-[3px] hover:border-[var(--accent)] hover:shadow-[var(--shadow-soft)] active:scale-[0.985] motion-reduce:hover:translate-y-0"
              data-lab-card
              data-active={index === 0}
              key={item.title}
            >
              <ProjectImage
                src={item.preview}
                alt={`${item.title} 实验预览`}
                title={item.title}
                sizes="(max-width: 640px) calc(100vw - 36px), (max-width: 1024px) 50vw, 25vw"
                className="relative aspect-[4/3] min-w-0 overflow-hidden rounded-[14px] bg-[var(--surface-muted)]"
                imageClassName="object-cover transition-transform duration-500 hover:scale-[1.025]"
                unoptimized
              />
              <p className="mt-4 text-sm text-[var(--text-secondary)]">
                {item.type} · {item.year}
              </p>
              <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-[var(--text-body)]">
                {item.description}
              </p>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>

      {compact && items.length > 4 ? (
        <div className="mt-6 flex justify-center md:hidden">
          <button
            ref={buttonRef}
            type="button"
            className="focus-ring min-h-11 rounded-full border border-[var(--border)] bg-[var(--surface-solid)] px-5 text-sm font-medium"
            onClick={toggleExpanded}
          >
            {expanded ? "收起实验" : "查看全部实验"}
          </button>
        </div>
      ) : null}
    </section>
  );
}
