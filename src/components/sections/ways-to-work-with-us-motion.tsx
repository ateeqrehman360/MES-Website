"use client";

import { useEffect, useRef, type ReactNode } from "react";

type WaysToWorkWithUsMotionProps = {
  children: ReactNode;
  className: string;
};

export function WaysToWorkWithUsMotion({
  children,
  className,
}: WaysToWorkWithUsMotionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (
      !section ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const blocks = Array.from(
      section.querySelectorAll<HTMLElement>("[data-reveal-block]"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          (entry.target as HTMLElement).dataset.revealed = "true";
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.16 },
    );

    blocks.forEach((block) => observer.observe(block));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={className}
      aria-labelledby="ways-to-work-with-us-title"
    >
      {children}
    </section>
  );
}
