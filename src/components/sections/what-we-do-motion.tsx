"use client";

import { useEffect, useRef, type ReactNode } from "react";

const LEARN_OPEN_OFFSETS = [-7, -3.5, 0, 3.5, 7] as const;
const CONNECT_GATHER_OFFSETS = [37.5, 25, 12.5, 0, -12.5, -25, -37.5] as const;
const BUILD_ASSEMBLY_OFFSETS = [-11, -5.5, 0, 5.5, 11] as const;
const BUILD_ASSEMBLY_Y = [4, -2.5, 1.5, -2.5, 4] as const;

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothSegment(value: number, start: number, end: number) {
  const progress = clamp((value - start) / (end - start));

  return progress * progress * (3 - 2 * progress);
}

export function WhatWeDoMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = root?.querySelector<HTMLElement>("[data-what-we-do-track]");
    const stage = root?.querySelector<HTMLElement>("[data-what-we-do-stage]");
    const learnLetters = root
      ? Array.from(
          root.querySelectorAll<HTMLElement>(
            '[data-what-we-do-word="learn"] [data-what-we-do-letter]',
          ),
        )
      : [];
    const connectLetters = root
      ? Array.from(
          root.querySelectorAll<HTMLElement>(
            '[data-what-we-do-word="connect"] [data-what-we-do-letter]',
          ),
        )
      : [];
    const buildLetters = root
      ? Array.from(
          root.querySelectorAll<HTMLElement>(
            '[data-what-we-do-word="build"] [data-what-we-do-letter]',
          ),
        )
      : [];

    if (!root || !track || !stage) return;

    const tabletQuery = window.matchMedia("(min-width: 48rem)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const inlineProperties = [
      "--what-learn-opacity",
      "--what-learn-y",
      "--what-connect-opacity",
      "--what-connect-tint",
      "--what-connect-statement-x",
      "--what-connect-description-x",
      "--what-connect-rule",
      "--what-build-opacity",
      "--what-build-inset",
      "--what-build-rule",
      "--what-scroll-progress",
    ] as const;
    let frame = 0;
    let start = 0;
    let travel = 1;
    let active = false;
    let enabled = false;
    let disposed = false;
    let needsMeasurement = true;
    let previousProgress = -1;

    const reset = () => {
      inlineProperties.forEach((property) =>
        root.style.removeProperty(property),
      );
      [...learnLetters, ...connectLetters, ...buildLetters].forEach((letter) =>
        letter.style.removeProperty("transform"),
      );
      delete root.dataset.whatWeDoChapter;
    };

    const measure = () => {
      enabled =
        tabletQuery.matches &&
        !reducedMotionQuery.matches &&
        window.innerHeight >= 640;
      root.dataset.whatWeDoMotion = enabled ? "desktop" : "static";
      reset();

      if (enabled) {
        void track.offsetHeight;
        const stickyInset = parseFloat(getComputedStyle(stage).top) || 0;
        start = window.scrollY + track.getBoundingClientRect().top - stickyInset;
        travel = Math.max(1, track.offsetHeight - stage.offsetHeight);
      }

      previousProgress = -1;
      needsMeasurement = false;
    };

    const update = () => {
      frame = 0;
      if (needsMeasurement) measure();
      if (!enabled) return;

      const progress = clamp((window.scrollY - start) / travel);
      if (Math.abs(progress - previousProgress) < 0.0001) return;
      previousProgress = progress;

      const learnOpen = smoothSegment(progress, 0.04, 0.34);
      const learnExit = smoothSegment(progress, 0.25, 0.43);
      const connectSpread = smoothSegment(progress, 0.2, 0.49);
      const connectEnter = smoothSegment(progress, 0.27, 0.43);
      const connectGather = smoothSegment(progress, 0.57, 0.74);
      const connectExit = smoothSegment(progress, 0.63, 0.77);
      const buildReveal = smoothSegment(progress, 0.53, 0.71);
      const buildLock = smoothSegment(progress, 0.56, 0.81);
      const buildEnter = smoothSegment(progress, 0.6, 0.74);
      const connectPresence = connectEnter * (1 - connectExit);

      root.style.setProperty(
        "--what-learn-opacity",
        (1 - learnExit).toFixed(4),
      );
      root.style.setProperty(
        "--what-learn-y",
        `${(-1.6 * learnExit).toFixed(3)}rem`,
      );
      root.style.setProperty(
        "--what-connect-opacity",
        connectPresence.toFixed(4),
      );
      root.style.setProperty(
        "--what-connect-tint",
        smoothSegment(progress, 0.25, 0.49).toFixed(4),
      );
      root.style.setProperty(
        "--what-connect-statement-x",
        `${(4.5 * (1 - connectEnter) - 2.5 * connectGather).toFixed(3)}vw`,
      );
      root.style.setProperty(
        "--what-connect-description-x",
        `${(-4.5 * (1 - connectEnter) + 2.5 * connectGather).toFixed(3)}vw`,
      );
      root.style.setProperty(
        "--what-connect-rule",
        (connectSpread * (1 - connectExit * 0.35)).toFixed(4),
      );
      root.style.setProperty(
        "--what-build-opacity",
        buildEnter.toFixed(4),
      );
      root.style.setProperty(
        "--what-build-inset",
        `${(50 * (1 - buildReveal)).toFixed(3)}%`,
      );
      root.style.setProperty(
        "--what-build-rule",
        buildLock.toFixed(4),
      );
      root.style.setProperty("--what-scroll-progress", progress.toFixed(4));

      learnLetters.forEach((letter, index) => {
        const x = (LEARN_OPEN_OFFSETS[index] ?? 0) * learnOpen;
        letter.style.transform = `translate3d(${x.toFixed(3)}vw, 0, 0)`;
      });

      connectLetters.forEach((letter, index) => {
        const gather = CONNECT_GATHER_OFFSETS[index] ?? 0;
        const x = gather * (1 - connectSpread + connectGather);
        const y = 0.7 * (1 - connectEnter) - 0.35 * connectGather;
        letter.style.transform = `translate3d(${x.toFixed(3)}vw, ${y.toFixed(3)}rem, 0)`;
      });

      buildLetters.forEach((letter, index) => {
        const x = (BUILD_ASSEMBLY_OFFSETS[index] ?? 0) * (1 - buildLock);
        const y = (BUILD_ASSEMBLY_Y[index] ?? 0) * (1 - buildLock);
        letter.style.transform = `translate3d(${x.toFixed(3)}vw, ${y.toFixed(3)}rem, 0)`;
      });

      root.dataset.whatWeDoChapter =
        progress < 0.36 ? "01" : progress < 0.7 ? "02" : "03";
    };

    const schedule = () => {
      if (!frame && !disposed) frame = window.requestAnimationFrame(update);
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
        if (active) remeasure();
      },
      { rootMargin: "65% 0px" },
    );
    const resizeObserver = new ResizeObserver(remeasure);

    visibilityObserver.observe(track);
    resizeObserver.observe(track);
    resizeObserver.observe(stage);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("orientationchange", remeasure);
    tabletQuery.addEventListener("change", remeasure);
    reducedMotionQuery.addEventListener("change", remeasure);
    document.fonts?.ready.then(() => {
      if (!disposed) remeasure();
    });
    remeasure();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("orientationchange", remeasure);
      tabletQuery.removeEventListener("change", remeasure);
      reducedMotionQuery.removeEventListener("change", remeasure);
      reset();
      delete root.dataset.whatWeDoMotion;
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className="what-we-do"
      aria-labelledby="what-we-do-title"
    >
      {children}
    </section>
  );
}
