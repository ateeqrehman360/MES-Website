"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function AboutWorkWithUsMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let observer: IntersectionObserver | null = null;

    const reveal = () => {
      root.dataset.workWithUsEntered = "true";
      observer?.disconnect();
      observer = null;
    };

    const configure = () => {
      observer?.disconnect();
      observer = null;

      if (reducedMotionQuery.matches) {
        root.dataset.workWithUsMotion = "static";
        reveal();
        return;
      }

      const bounds = root.getBoundingClientRect();
      const alreadyVisible = bounds.top < window.innerHeight && bounds.bottom > 0;

      if (alreadyVisible) {
        reveal();
        root.dataset.workWithUsMotion = "ready";
        return;
      }

      root.dataset.workWithUsMotion = "ready";

      if (root.dataset.workWithUsEntered === "true") return;

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
      delete root.dataset.workWithUsEntered;
      delete root.dataset.workWithUsMotion;
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="about-work-with-us"
      aria-labelledby="about-work-with-us-title"
      data-focus-surface="dark"
    >
      {children}
    </section>
  );
}
