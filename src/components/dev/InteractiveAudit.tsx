"use client";

import { useEffect } from "react";

function hasAccessibleName(element: Element) {
  const text = element.textContent?.replace(/\s+/g, " ").trim();
  return Boolean(
    text ||
      element.getAttribute("aria-label")?.trim() ||
      element.getAttribute("title")?.trim() ||
      element.querySelector("svg,img,[aria-label],[title]"),
  );
}

export function InteractiveAudit() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;

    const inspect = () => {
      document.querySelectorAll("button,a,[role='button']").forEach((element) => {
        const tag = element.tagName.toLowerCase();
        const href = element.getAttribute("href");
        const invalidHref = tag === "a" && (href === null || href.trim() === "" || href.trim() === "#");

        if (!hasAccessibleName(element) || invalidHref) {
          console.warn("Potential empty or inert interactive element:", element);
        }
      });
    };

    const timeout = window.setTimeout(inspect, 300);
    return () => window.clearTimeout(timeout);
  }, []);

  return null;
}
