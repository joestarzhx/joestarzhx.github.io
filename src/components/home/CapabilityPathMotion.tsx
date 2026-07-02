"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function CapabilityPathMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!scope.current || !pathRef.current || !dotRef.current) return;

    const mm = gsap.matchMedia();
    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions ?? {};
        if (!isDesktop || reduceMotion || !pathRef.current || !dotRef.current) return undefined;

        const path = pathRef.current;
        const dot = dotRef.current;
        const cards = gsap.utils.toArray<HTMLElement>("[data-capability-card]", scope.current);
        const length = path.getTotalLength();
        let previousActive = -1;

        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

        const setActiveCard = (active: number) => {
          if (active === previousActive) return;
          previousActive = active;
          cards.forEach((card, index) => {
            gsap.to(card, {
              scale: index === active ? 1.008 : 1,
              opacity: index === active ? 1 : 0.86,
              duration: 0.18,
              overwrite: "auto",
            });
          });
        };

        setActiveCard(0);

        const tween = gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: scope.current,
            start: "top 70%",
            end: "bottom 70%",
            scrub: 0.6,
            onUpdate: (self) => {
              const point = path.getPointAtLength(length * self.progress);
              gsap.set(dot, { attr: { cx: point.x, cy: point.y } });
              const active = Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1)));
              setActiveCard(active);
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

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      mm.revert();
    };
  }, []);

  return (
    <div ref={scope} className="relative isolate overflow-hidden">
      <svg
        className="pointer-events-none absolute inset-x-0 top-8 z-0 hidden h-[calc(100%-4rem)] w-full opacity-45 md:block"
        viewBox="0 0 760 420"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          ref={pathRef}
          d="M40 48 C180 120 170 220 305 210 S485 105 570 190 S650 340 720 360"
          fill="none"
          stroke="var(--accent)"
          strokeLinecap="round"
          strokeWidth="2"
          opacity="0.38"
        />
        <circle ref={dotRef} cx="40" cy="48" r="5" fill="var(--accent)" />
      </svg>
      {children}
    </div>
  );
}
