"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { projectCategories, projects } from "@/data/projects";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

export function ProjectExplorer() {
  const [active, setActive] = useState<(typeof projectCategories)[number]>("全部");
  const filtered = useMemo(
    () => (active === "全部" ? projects : projects.filter((project) => project.category === active)),
    [active],
  );

  return (
    <div>
      <div className="relative mb-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[var(--background)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[var(--background)] to-transparent" />
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {projectCategories.map((category) => (
          <button
            className={cn(
              "focus-ring relative min-h-10 shrink-0 rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--text-secondary)] whitespace-nowrap",
              active === category && "text-[var(--text-primary)]",
            )}
            key={category}
            type="button"
            aria-pressed={active === category}
            onClick={() => setActive(category)}
          >
            {active === category ? (
              <motion.span
                className="absolute inset-0 rounded-full bg-[var(--surface-muted)]"
                layoutId="project-filter"
              />
            ) : null}
            <span className="relative">{category}</span>
          </button>
        ))}
        </div>
      </div>
      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <motion.div layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project, index) => (
              <ProjectCard
                project={project}
                key={project.slug}
                priority={index === 0}
                featured={active === projectCategories[0] && index === 0}
              />
            ))}
          </motion.div>
        ) : (
          <EmptyState title="没有匹配项目" text="可以切换分类查看其他作品。" />
        )}
      </AnimatePresence>
    </div>
  );
}
