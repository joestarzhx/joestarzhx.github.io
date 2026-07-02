"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { Project } from "@/types/content";
import { Badge } from "@/components/ui/Badge";
import { ProjectImage } from "@/components/project/ProjectImage";
import { motionTokens } from "@/lib/motion";

export function ProjectCard({
  project,
  priority = false,
  featured = false,
}: {
  project: Project;
  priority?: boolean;
  featured?: boolean;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16, scale: 0.985 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ ...motionTokens.gentleSpring, duration: 0.28 }}
      className={featured ? "xl:col-span-2" : undefined}
    >
      <Link
        className="focus-ring group block overflow-hidden rounded-[22px] border border-[var(--border)] bg-[var(--surface-solid)] transition-[border-color,box-shadow,transform] hover:-translate-y-[3px] hover:border-[var(--accent)] hover:shadow-[var(--shadow-soft)] active:scale-[0.985] motion-reduce:transition-none motion-reduce:hover:translate-y-0"
        href={`/projects/${project.slug}`}
      >
        <div>
          <ProjectImage
            src={project.cover}
            alt={`${project.title} 项目封面`}
            title={project.title}
            priority={priority}
            sizes="(max-width: 768px) 100vw, 33vw"
            className="relative aspect-[16/10] overflow-hidden bg-[var(--surface-muted)]"
            imageClassName="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
          />
          <div className="p-5">
            <div className="flex items-center justify-between gap-3 text-sm text-[var(--text-secondary)]">
              <span>{project.category}</span>
              <span>{project.year}</span>
            </div>
            <h2 className="mt-3 flex items-center justify-between gap-3 text-2xl font-semibold leading-tight">
              {project.title}
              <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-1" size={18} />
            </h2>
            <p className="mt-3 line-clamp-3 leading-7 text-[var(--text-body)]">{project.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
