"use client";

import { useEffect, useRef, type ReactNode } from "react";

const formatter = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const DURATION = 900;

export function ImpactCountUp({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDListElement>(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const counters = Array.from(
      root.querySelectorAll<HTMLElement>("[data-count-target]"),
    ).map((element) => ({
      element,
      target: Number(element.dataset.countTarget),
      prefix: element.dataset.countPrefix ?? "",
      suffix: element.dataset.countSuffix ?? "",
      final: element.dataset.countFinal ?? "",
    }));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let observer: IntersectionObserver | undefined;

    const finish = () => {
      window.cancelAnimationFrame(frame);
      frame = 0;
      counters.forEach(({ element, final }) => {
        element.textContent = final;
      });
    };

    const configure = () => {
      observer?.disconnect();
      finish();
      if (reducedMotion.matches || hasStarted.current) return;

      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || hasStarted.current) return;
          hasStarted.current = true;
          observer?.disconnect();
          const startedAt = performance.now();

          const tick = (now: number) => {
            const progress = Math.min(1, (now - startedAt) / DURATION);
            const eased = 1 - Math.pow(1 - progress, 3);
            counters.forEach(({ element, target, prefix, suffix }) => {
              const value = `${prefix}${formatter.format(Math.round(target * eased))}${suffix}`;
              if (element.textContent !== value) element.textContent = value;
            });

            if (progress < 1) frame = window.requestAnimationFrame(tick);
            else finish();
          };

          frame = window.requestAnimationFrame(tick);
        },
        { threshold: 0.15, rootMargin: "0px 0px -18% 0px" },
      );

      observer.observe(root);
    };

    const onVisibilityChange = () => {
      if (document.hidden && hasStarted.current) finish();
    };
    configure();
    reducedMotion.addEventListener("change", configure);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      observer?.disconnect();
      finish();
      reducedMotion.removeEventListener("change", configure);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <dl ref={rootRef} className="impact__statistics">
      {children}
    </dl>
  );
}
