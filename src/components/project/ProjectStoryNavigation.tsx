"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export type ProjectStorySection = {
  id: string;
  label: string;
};

export function ProjectStoryNavigation({ sections }: { sections: ProjectStorySection[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    if (!scope.current || !sections.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const triggers: ScrollTrigger[] = [];

    sections.forEach((section) => {
      const target = document.getElementById(section.id);
      if (!target) return;

      triggers.push(
        ScrollTrigger.create({
          trigger: target,
          start: "top 42%",
          end: "bottom 42%",
          onEnter: () => setActiveId(section.id),
          onEnterBack: () => setActiveId(section.id),
        }),
      );
    });

    const story = document.querySelector<HTMLElement>("[data-project-story]");
    if (story && progressRef.current && !reduce) {
      triggers.push(
        ScrollTrigger.create({
          trigger: story,
          start: "top 38%",
          end: "bottom 62%",
          scrub: true,
          onUpdate: (self) => {
            gsap.set(progressRef.current, { scaleY: self.progress, transformOrigin: "top center" });
          },
        }),
      );
    } else if (progressRef.current) {
      gsap.set(progressRef.current, { scaleY: 1, transformOrigin: "top center" });
    }

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [sections]);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const offset = 96;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <aside ref={scope} className="hidden lg:block">
      <div className="sticky top-[calc(var(--nav-height)+32px)]">
        <p className="text-sm font-medium text-[var(--accent)]">Story</p>
        <div className="relative mt-5 pl-5">
          <span className="absolute bottom-1 left-0 top-1 w-px bg-[var(--border)]" aria-hidden="true" />
          <span
            ref={progressRef}
            className="absolute bottom-1 left-0 top-1 w-px origin-top scale-y-0 bg-[var(--accent)]"
            aria-hidden="true"
          />
          <nav className="grid gap-3" aria-label="项目详情章节">
            {sections.map((section) => (
              <button
                className={cn(
                  "focus-ring rounded-lg py-1 text-left text-sm transition-colors",
                  activeId === section.id ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]",
                )}
                key={section.id}
                type="button"
                aria-current={activeId === section.id ? "true" : undefined}
                onClick={() => scrollToSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
