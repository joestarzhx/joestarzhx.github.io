"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import { experiences } from "@/data/experience";

gsap.registerPlugin(ScrollTrigger);

export function ExperienceTimeline() {
  const scope = useRef<HTMLDivElement>(null);
  const grouped = useMemo(
    () =>
      experiences.reduce<Record<string, typeof experiences>>((groups, item) => {
        groups[item.time] = groups[item.time] ?? [];
        groups[item.time].push(item);
        return groups;
      }, {}),
    [],
  );

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !scope.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".timeline-line", {
        scaleY: 0,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: {
          trigger: scope.current,
          start: "top 70%",
          end: "bottom 60%",
          scrub: true,
        },
      });
      gsap.from(".timeline-item", {
        opacity: 0,
        y: 24,
        stagger: 0.1,
        duration: 0.55,
        ease: "power3.out",
        scrollTrigger: {
          trigger: scope.current,
          start: "top 68%",
        },
      });
    }, scope);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={scope} className="relative">
      <div className="timeline-line absolute left-3 top-11 hidden h-[calc(100%-44px)] w-px bg-[var(--accent)] md:block" />
      <div className="grid gap-8">
        {Object.entries(grouped).map(([year, items]) => (
          <section
            className="grid gap-4 md:grid-cols-[120px_1fr]"
            key={year}
          >
            <div className="relative">
              <span className="hidden size-6 rounded-full border-4 border-[var(--background)] bg-[var(--accent)] md:block" />
              <p className="mt-2 text-sm font-semibold text-[var(--accent)] md:ml-10">
                {year}
              </p>
            </div>
            <div className="grid gap-4">
              {items.map((item) => (
                <article
                  className="timeline-item rounded-[22px] border border-[var(--border)] bg-[var(--surface-solid)] p-5"
                  key={item.title}
                >
                  <p className="text-sm text-[var(--text-secondary)]">
                    {item.place}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">{item.title}</h3>
                  <p className="mt-3 leading-7 text-[var(--text-body)]">
                    {item.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2 text-sm text-[var(--text-secondary)]">
                    {item.points.map((point) => (
                      <li
                        className="rounded-full border border-[var(--border)] px-3 py-1"
                        key={point}
                      >
                        {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
