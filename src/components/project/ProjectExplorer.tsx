"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterScroller } from "@/components/ui/FilterScroller";
import { projectCategories, projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";

export function ProjectExplorer() {
  const [active, setActive] =
    useState<(typeof projectCategories)[number]>("全部");
  const filtered = useMemo(
    () =>
      active === "全部"
        ? projects
        : projects.filter((project) => project.category === active),
    [active],
  );

  return (
    <div>
      <FilterScroller
        className="mb-8"
        items={projectCategories}
        active={active}
        onChange={setActive}
        ariaLabel="项目分类筛选"
      />

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
