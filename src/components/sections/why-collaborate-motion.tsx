"use client";

import { useEffect, useRef, type ReactNode } from "react";

type WhyCollaborateMotionProps = {
  children: ReactNode;
  className: string;
};

export function WhyCollaborateMotion({
  children,
  className,
}: WhyCollaborateMotionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || !("IntersectionObserver" in window)) {
      return;
    }

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (preference.matches) {
      return;
    }

    const blocks = section.querySelectorAll<HTMLElement>("[data-proof-reveal]");
    const statement = section.querySelector<HTMLElement>(
      '[data-proof-reveal="statement"]',
    );
    let statementEstablished = false;

    // Animate only on entry. The server-rendered resting state is always visible.
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          !statementEstablished &&
          entries.some((entry) => entry.target === statement && entry.isIntersecting)
        ) {
          statementEstablished = true;
          if (statement) {
            statement.dataset.revealed = "true";
            observer.unobserve(statement);
          }
        }

        if (!statementEstablished) {
          return;
        }

        blocks.forEach((block) => {
          if (block === statement || block.dataset.revealed) {
            return;
          }

          const rect = block.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) {
            block.dataset.revealed = "true";
            observer.unobserve(block);
          }
        });
      },
      { rootMargin: "0px 0px -6%", threshold: 0 },
    );

    blocks.forEach((block) => observer.observe(block));

    // A live preference change also ends any in-progress decorative reveal.
    const stopMotion = () => {
      if (preference.matches) {
        observer.disconnect();
        blocks.forEach((block) => {
          delete block.dataset.revealed;
        });
      }
    };
    preference.addEventListener("change", stopMotion);

    return () => {
      observer.disconnect();
      preference.removeEventListener("change", stopMotion);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={className}
      aria-labelledby="why-collaborate-title"
    >
      {children}
    </section>
  );
}
