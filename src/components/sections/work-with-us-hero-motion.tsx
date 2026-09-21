"use client";

import { useEffect, useRef, type ReactNode } from "react";

type WorkWithUsHeroMotionProps = {
  children: ReactNode;
};

export function WorkWithUsHeroMotion({ children }: WorkWithUsHeroMotionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) {
          return;
        }

        section.dataset.revealed = "true";
        observer.disconnect();
      },
      { threshold: 0.18 },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="work-with-us-hero"
      aria-labelledby="work-with-us-hero-title"
    >
      {children}
    </section>
  );
}
