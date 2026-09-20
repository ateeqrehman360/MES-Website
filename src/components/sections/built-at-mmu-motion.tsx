"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function BuiltAtMmuMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let observer: IntersectionObserver | null = null;

    const reveal = () => {
      root.dataset.builtAtMmuEntered = "true";
      observer?.disconnect();
      observer = null;
    };

    const configure = () => {
      observer?.disconnect();
      observer = null;

      if (reducedMotionQuery.matches) {
        root.dataset.builtAtMmuMotion = "static";
        reveal();
        return;
      }

      root.dataset.builtAtMmuMotion = "ready";

      if (root.dataset.builtAtMmuEntered === "true") return;

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) reveal();
        },
        { rootMargin: "0px 0px -8%", threshold: 0.16 },
      );
      observer.observe(root);
    };

    configure();
    reducedMotionQuery.addEventListener("change", configure);

    return () => {
      observer?.disconnect();
      reducedMotionQuery.removeEventListener("change", configure);
      delete root.dataset.builtAtMmuEntered;
      delete root.dataset.builtAtMmuMotion;
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="built-at-mmu"
      className="built-at-mmu"
      aria-labelledby="built-at-mmu-title"
    >
      {children}
    </section>
  );
}
