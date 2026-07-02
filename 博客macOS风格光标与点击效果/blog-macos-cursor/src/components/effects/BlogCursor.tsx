"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "[role='button']",
  "summary",
  "label",
  "select",
  "input[type='button']",
  "input[type='submit']",
  "input[type='reset']",
  "input[type='checkbox']",
  "input[type='radio']",
  "[data-cursor='interactive']",
].join(",");

const TEXT_SELECTOR = [
  "textarea",
  "[contenteditable='true']",
  "input:not([type])",
  "input[type='text']",
  "input[type='email']",
  "input[type='search']",
  "input[type='url']",
  "input[type='tel']",
  "input[type='password']",
  "input[type='number']",
  "[data-cursor='text']",
].join(",");

function isDisabled(target: Element | null) {
  if (!target) return false;
  const control = target.closest(
    "button, input, select, textarea, [aria-disabled='true'], [data-disabled='true']",
  ) as HTMLButtonElement | HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null;

  return Boolean(control?.disabled || control?.getAttribute("aria-disabled") === "true");
}

function createClickRipple(x: number, y: number) {
  const ripple = document.createElement("span");
  ripple.className = "blog-click-ripple";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.setAttribute("aria-hidden", "true");
  document.body.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
}

export function BlogCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const html = document.documentElement;
    html.dataset.customCursor = "ready";

    let nextX = -100;
    let nextY = -100;
    let frame = 0;

    const render = () => {
      frame = 0;
      cursor.style.transform = `translate3d(${nextX}px, ${nextY}px, 0)`;
    };

    const queueRender = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(render);
    };

    const setModeFromTarget = (target: Element | null) => {
      const textTarget = target?.closest(TEXT_SELECTOR);
      const interactiveTarget = target?.closest(INTERACTIVE_SELECTOR);

      if (textTarget) {
        cursor.dataset.mode = "hidden";
        return;
      }

      if (isDisabled(target)) {
        cursor.dataset.mode = "disabled";
        return;
      }

      cursor.dataset.mode = interactiveTarget ? "interactive" : "default";
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      nextX = event.clientX;
      nextY = event.clientY;
      cursor.dataset.visible = "true";
      setModeFromTarget(event.target as Element | null);
      queueRender();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      const target = event.target as Element | null;
      if (target?.closest(TEXT_SELECTOR) || isDisabled(target)) return;
      cursor.dataset.pressed = "true";
      createClickRipple(event.clientX, event.clientY);
    };

    const onPointerUp = () => {
      cursor.dataset.pressed = "false";
    };

    const onPointerLeave = () => {
      cursor.dataset.visible = "false";
      cursor.dataset.pressed = "false";
    };

    const onVisibilityChange = () => {
      if (document.hidden) onPointerLeave();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    window.addEventListener("blur", onPointerLeave);
    document.documentElement.addEventListener("mouseleave", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("blur", onPointerLeave);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      delete html.dataset.customCursor;
      document.querySelectorAll(".blog-click-ripple").forEach((node) => node.remove());
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="blog-cursor"
      data-mode="default"
      data-visible="false"
      data-pressed="false"
      aria-hidden="true"
    >
      <span className="blog-cursor__halo" />
      <svg
        className="blog-cursor__arrow"
        width="28"
        height="38"
        viewBox="0 0 28 38"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.7 2.65C2.76 1.72 1.15 2.39 1.15 3.71V33.38C1.15 34.86 3.03 35.48 3.9 34.28L9.22 26.92L13.38 35.12C14.02 36.38 15.56 36.87 16.8 36.21L19.18 34.94C20.4 34.29 20.86 32.78 20.22 31.56L16.13 23.78L24.97 23.23C26.43 23.14 27.01 21.3 25.97 20.28L3.7 2.65Z"
          className="blog-cursor__outline"
        />
        <path
          d="M3.7 2.65C2.76 1.72 1.15 2.39 1.15 3.71V33.38C1.15 34.86 3.03 35.48 3.9 34.28L9.22 26.92L13.38 35.12C14.02 36.38 15.56 36.87 16.8 36.21L19.18 34.94C20.4 34.29 20.86 32.78 20.22 31.56L16.13 23.78L24.97 23.23C26.43 23.14 27.01 21.3 25.97 20.28L3.7 2.65Z"
          className="blog-cursor__fill"
        />
      </svg>
    </div>
  );
}
