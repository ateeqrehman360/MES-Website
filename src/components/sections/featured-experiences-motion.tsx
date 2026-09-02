"use client";

import { useEffect, useRef, type ReactNode } from "react";

const EXPERIENCE_WINDOWS = [
  { enter: [0.015, 0.14], exit: [0.28, 0.39], drift: -12, turn: -3.25 },
  { enter: [0.245, 0.37], exit: [0.49, 0.6], drift: 11, turn: 3 },
  { enter: [0.465, 0.59], exit: [0.7, 0.81], drift: -10, turn: -2.5 },
  { enter: [0.685, 0.81], exit: null, drift: 0, turn: 0 },
] as const;

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothSegment(value: number, start: number, end: number) {
  const progress = clamp((value - start) / (end - start));

  return progress * progress * (3 - 2 * progress);
}

export function FeaturedExperiencesMotion({
  children,
}: {
  children: ReactNode;
}) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const stage = root?.querySelector<HTMLElement>(
      ".featured-experiences__stage",
    );
    const articles = root
      ? Array.from(
          root.querySelectorAll<HTMLElement>("[data-featured-experience]"),
        )
      : [];

    if (!root || !stage || articles.length === 0) return;

    const desktopQuery = window.matchMedia("(min-width: 64rem)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let frame = 0;
    let active = false;
    let needsMeasurement = true;
    let mode: "desktop" | "mobile" | "static" = "static";
    let start = 0;
    let travel = 1;
    let previousProgress = -1;

    const clearArticleStyles = () => {
      articles.forEach((article) => {
        [
          "--experience-copy-opacity",
          "--experience-copy-y",
          "--experience-field-opacity",
          "--experience-poster-clip",
          "--experience-poster-opacity",
          "--experience-poster-rotate",
          "--experience-poster-scale",
          "--experience-poster-x",
          "--experience-poster-y",
        ].forEach((property) => article.style.removeProperty(property));
      });
    };

    const reset = () => {
      root.style.removeProperty("--featured-reveal-inset");
      root.style.removeProperty("--featured-rule-progress");
      delete root.dataset.featuredActive;
      clearArticleStyles();
    };

    const measure = () => {
      const nextMode = reducedMotionQuery.matches
        ? "static"
        : desktopQuery.matches && window.innerHeight >= 640
          ? "desktop"
          : "mobile";

      if (nextMode !== mode) {
        mode = nextMode;
        reset();
      }

      root.dataset.featuredMotion = mode;
      // The desktop attribute changes the track height and sticky geometry.
      // Read after applying it so the scroll range always matches the CSS.
      void root.offsetHeight;

      if (mode === "desktop") {
        const stickyInset = parseFloat(getComputedStyle(stage).top) || 0;
        start =
          window.scrollY + root.getBoundingClientRect().top - stickyInset;
        travel = Math.max(1, root.offsetHeight - stage.offsetHeight);
      }

      previousProgress = -1;
      needsMeasurement = false;
    };

    const updateDesktop = () => {
      const progress = clamp((window.scrollY - start) / travel);
      if (Math.abs(progress - previousProgress) < 0.0001) return;
      previousProgress = progress;

      const reveal = smoothSegment(progress, 0, 0.155);
      const rule = smoothSegment(progress, 0.07, 0.25);
      root.style.setProperty(
        "--featured-reveal-inset",
        `${(49.4 * (1 - reveal)).toFixed(3)}%`,
      );
      root.style.setProperty("--featured-rule-progress", rule.toFixed(4));

      let activeIndex = 0;

      articles.forEach((article, index) => {
        const window = EXPERIENCE_WINDOWS[index] ?? EXPERIENCE_WINDOWS[0];
        const enter = smoothSegment(
          progress,
          window.enter[0],
          window.enter[1],
        );
        const exit = window.exit
          ? smoothSegment(progress, window.exit[0], window.exit[1])
          : 0;
        const copyExit = window.exit
          ? smoothSegment(progress, window.exit[0] - 0.025, window.exit[1] - 0.02)
          : 0;
        const posterOpacity = enter * (1 - exit * 0.78);
        const copyOpacity = enter * (1 - copyExit);

        if (copyOpacity > 0.42) activeIndex = index;

        article.style.setProperty(
          "--experience-poster-clip",
          `${(49.5 * (1 - enter)).toFixed(3)}%`,
        );
        article.style.setProperty(
          "--experience-poster-opacity",
          posterOpacity.toFixed(4),
        );
        article.style.setProperty(
          "--experience-poster-scale",
          (0.84 + enter * 0.16 - exit * 0.055).toFixed(4),
        );
        article.style.setProperty(
          "--experience-poster-x",
          `${(window.drift * exit).toFixed(3)}vw`,
        );
        article.style.setProperty(
          "--experience-poster-y",
          `${(2.5 * (1 - enter) - exit * 1.5).toFixed(3)}rem`,
        );
        article.style.setProperty(
          "--experience-poster-rotate",
          `${(window.turn * exit).toFixed(3)}deg`,
        );
        article.style.setProperty(
          "--experience-copy-opacity",
          copyOpacity.toFixed(4),
        );
        article.style.setProperty(
          "--experience-copy-y",
          `${(2.25 * (1 - enter) - copyExit).toFixed(3)}rem`,
        );
        article.style.setProperty(
          "--experience-field-opacity",
          (enter * (1 - exit * 0.75)).toFixed(4),
        );
      });

      root.dataset.featuredActive = String(activeIndex + 1).padStart(2, "0");
    };

    const updateMobile = () => {
      const viewportHeight = window.innerHeight;

      articles.forEach((article, index) => {
        const rect = article.getBoundingClientRect();
        const raw = clamp(
          (viewportHeight * 0.92 - rect.top) /
            Math.max(viewportHeight * 0.64, rect.height * 0.72),
        );
        const reveal = raw * raw * (3 - 2 * raw);
        const startingInset = index === 0 ? 42 : 24;

        article.style.setProperty(
          "--experience-poster-clip",
          `${(startingInset * (1 - reveal)).toFixed(3)}%`,
        );
        article.style.setProperty(
          "--experience-poster-opacity",
          (0.58 + reveal * 0.42).toFixed(4),
        );
        article.style.setProperty(
          "--experience-poster-scale",
          (0.955 + reveal * 0.045).toFixed(4),
        );
        article.style.setProperty("--experience-poster-x", "0vw");
        article.style.setProperty(
          "--experience-poster-y",
          `${(1.5 * (1 - reveal)).toFixed(3)}rem`,
        );
        article.style.setProperty("--experience-poster-rotate", "0deg");
        article.style.setProperty(
          "--experience-copy-opacity",
          (0.7 + reveal * 0.3).toFixed(4),
        );
        article.style.setProperty(
          "--experience-copy-y",
          `${(0.85 * (1 - reveal)).toFixed(3)}rem`,
        );
      });
    };

    const update = () => {
      frame = 0;
      if (needsMeasurement) measure();
      if (mode === "desktop") updateDesktop();
      else if (mode === "mobile") updateMobile();
    };

    const schedule = () => {
      if (frame === 0) frame = window.requestAnimationFrame(update);
    };
    const remeasure = () => {
      needsMeasurement = true;
      schedule();
    };
    const onScroll = () => {
      if (active && mode !== "static") schedule();
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) remeasure();
      },
      { rootMargin: "80% 0px" },
    );
    const resizeObserver = new ResizeObserver(remeasure);

    visibilityObserver.observe(root);
    resizeObserver.observe(root);
    resizeObserver.observe(stage);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    desktopQuery.addEventListener("change", remeasure);
    reducedMotionQuery.addEventListener("change", remeasure);
    remeasure();

    return () => {
      window.cancelAnimationFrame(frame);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      desktopQuery.removeEventListener("change", remeasure);
      reducedMotionQuery.removeEventListener("change", remeasure);
      reset();
      delete root.dataset.featuredMotion;
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="featured-experiences"
      className="featured-experiences"
      aria-labelledby="featured-experiences-title"
    >
      {children}
    </section>
  );
}
