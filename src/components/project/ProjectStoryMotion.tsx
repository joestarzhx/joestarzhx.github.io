"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function ProjectStoryMotion({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !scope.current) return;
    const ctx = gsap.context(() => {
      const images = gsap.utils.toArray<HTMLElement>("[data-story-image]");
      gsap.fromTo(images, {
        clipPath: (index) => (index % 2 === 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)"),
        opacity: 0,
        y: 14,
      }, {
        clipPath: "inset(0 0% 0 0)",
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: "[data-story-gallery]",
          start: "top 78%",
          once: true,
        },
      });
      gsap.fromTo(
        "[data-story-hero-media]",
        { scale: 1.08, yPercent: -4 },
        {
          scale: 1.02,
          yPercent: 4,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-story-hero]",
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, scope);

    return () => ctx.revert();
  }, []);

  return <div ref={scope}>{children}</div>;
}
