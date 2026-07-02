"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { ProjectImage } from "@/components/project/ProjectImage";
import type { labItems } from "@/data/lab";

gsap.registerPlugin(ScrollTrigger);

type LabItem = (typeof labItems)[number];

export function LabHorizontalShowcase({ items }: { items: LabItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || items.length < 5) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        isDesktop: "(min-width: 1024px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions ?? {};
        if (!isDesktop || reduceMotion) return undefined;

        const cards = gsap.utils.toArray<HTMLElement>("[data-lab-card]", section);
        const getDistance = () => Math.max(0, track.scrollWidth - section.clientWidth);
        let previousIndex = -1;

        const setActiveCard = (index: number) => {
          if (index === previousIndex) return;
          previousIndex = index;
          setActive(index);
          cards.forEach((card, cardIndex) => {
            gsap.to(card, {
              scale: cardIndex === index ? 1.025 : 1,
              opacity: cardIndex === index ? 1 : 0.72,
              duration: 0.18,
              overwrite: "auto",
            });
          });
        };

        setActiveCard(0);

        const tween = gsap.to(track, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top+=96",
            end: () => `+=${Math.min(getDistance() * 0.85, 1200)}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const index = Math.min(items.length - 1, Math.round(self.progress * (items.length - 1)));
              setActiveCard(index);
            },
          },
        });

        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
          gsap.set(cards, { clearProps: "transform,opacity" });
        };
      },
    );

    return () => mm.revert();
  }, [items.length]);

  return (
    <section ref={sectionRef} className="overflow-hidden">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-[var(--accent)]">Experiments</p>
          <h2 className="mt-2 text-3xl font-semibold">实验轨道</h2>
        </div>
        <p className="hidden text-sm text-[var(--text-secondary)] lg:block" data-progress-label="01 / 08">
          {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </p>
      </div>
      <div ref={trackRef} className="grid gap-5 sm:grid-cols-2 lg:flex lg:w-max lg:gap-5">
        {items.map((item) => (
          <article
            className="rounded-[20px] border border-[var(--border)] bg-[var(--surface-solid)] p-4 lg:w-[360px]"
            data-lab-card
            key={item.title}
          >
            <ProjectImage
              src={item.preview}
              alt={`${item.title} 实验预览`}
              title={item.title}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
              className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-[var(--surface-muted)]"
              imageClassName="object-cover"
              unoptimized
            />
            <p className="mt-4 text-sm text-[var(--text-secondary)]">
              {item.type} · {item.year}
            </p>
            <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
