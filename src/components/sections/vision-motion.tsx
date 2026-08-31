"use client";

import { useEffect, useRef, type ReactNode } from "react";

function segment(progress: number, start: number, end: number) {
  const value = Math.min(1, Math.max(0, (progress - start) / (end - start)));
  return value * value * (3 - 2 * value);
}

export function VisionMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    const inner = track?.querySelector<HTMLElement>(".vision__inner");

    if (!root || !track || !inner) return;

    const mission = Array.from(
      root.querySelectorAll<HTMLElement>(".vision__mission .vision__word-inner"),
    );
    const principles = Array.from(
      root.querySelectorAll<HTMLElement>(".vision__principles .vision__word-inner"),
    );
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let active = false;
    let enabled = false;
    let needsMeasurement = true;
    let start = 0;
    let travel = 1;
    let previousProgress = -1;

    const resetWords = () => {
      [...mission, ...principles].forEach((word) => {
        word.style.removeProperty("transform");
        word.style.removeProperty("opacity");
      });
    };

    const measure = () => {
      root.dataset.visionMotion = reducedMotion.matches ? "static" : "enabled";
      const inset = parseFloat(getComputedStyle(inner).top) || 0;
      // Enlarged text and short landscape windows get the complete static
      // composition instead of a sticky panel taller than the viewport.
      enabled =
        !reducedMotion.matches &&
        inner.offsetHeight + inset + 16 <= window.innerHeight;

      if (!enabled) {
        root.dataset.visionMotion = "static";
        resetWords();
      }

      travel = Math.max(1, track.offsetHeight - inner.offsetHeight);
      start = window.scrollY + track.getBoundingClientRect().top - inset;
      previousProgress = -1;
      needsMeasurement = false;
    };

    const update = () => {
      frame = 0;
      if (needsMeasurement) measure();
      if (!enabled) return;

      const progress = Math.min(1, Math.max(0, (window.scrollY - start) / travel));
      if (Math.abs(progress - previousProgress) < 0.0001) return;
      previousProgress = progress;

      mission.forEach((word, index) => {
        const exit = segment(progress, 0.12 + index * 0.025, 0.38 + index * 0.025);
        word.style.transform = `translate3d(0, ${(-120 * exit).toFixed(3)}%, 0)`;
        word.style.opacity = (1 - exit).toFixed(3);
      });
      principles.forEach((word, index) => {
        const enter = segment(progress, 0.28 + index * 0.07, 0.6 + index * 0.07);
        word.style.transform = `translate3d(0, ${(120 * (1 - enter)).toFixed(3)}%, 0)`;
        word.style.opacity = enter.toFixed(3);
      });
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const remeasure = () => {
      needsMeasurement = true;
      schedule();
    };
    const onScroll = () => {
      if (active && enabled) schedule();
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        remeasure();
      },
      { rootMargin: "50% 0px" },
    );
    const resizeObserver = new ResizeObserver(remeasure);
    visibilityObserver.observe(root);
    resizeObserver.observe(inner);
    // Also notice a late hero fallback or font load shifting the section.
    resizeObserver.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    reducedMotion.addEventListener("change", remeasure);
    remeasure();

    return () => {
      window.cancelAnimationFrame(frame);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      reducedMotion.removeEventListener("change", remeasure);
      resetWords();
      delete root.dataset.visionMotion;
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="vision"
      className="vision"
      aria-labelledby="vision-title"
    >
      <div ref={trackRef} className="vision__track">
        {children}
      </div>
    </section>
  );
}
