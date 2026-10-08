"use client";

import { useEffect, useRef, type ReactNode } from "react";

const INITIAL_EXPERIENCE_WINDOW = [0.015, 0.145] as const;
const HANDOFF_WINDOWS = [
  [0.205, 0.385],
  [0.43, 0.61],
  [0.655, 0.835],
] as const;
const EXPERIENCE_OFFSETS = [
  { drift: -7.5 },
  { drift: 7 },
  { drift: -8.5 },
  { drift: 0 },
] as const;
const HANDOFF_LEAD = 0.6;
const HISTORY_OPACITY = 0.08;
const MOBILE_HANDOFF_WINDOWS = [
  [0.12, 0.36],
  [0.40, 0.64],
  [0.68, 0.92],
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
    const mobileQuery = window.matchMedia("(max-width: 63.999rem)");
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
          "--experience-copy-mask-top",
          "--experience-copy-mask-bottom",
          "--experience-poster-clip",
          "--experience-poster-opacity",
          "--experience-poster-rotate",
          "--experience-poster-scale",
          "--experience-poster-x",
          "--experience-poster-y",
          "--experience-poster-mask",
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
      // The motion attribute changes the track height and sticky geometry.
      // Read after applying it so the scroll range always matches the CSS.
      void root.offsetHeight;

      if (mode === "desktop" || (mode === "mobile" && mobileQuery.matches)) {
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
      let activeScore = -1;
      const handoffProgress = HANDOFF_WINDOWS.map(([start, end]) => {
        const eased = smoothSegment(progress, start, end);

        return eased + eased * (1 - eased) * HANDOFF_LEAD;
      });

      articles.forEach((article, index) => {
        const offset = EXPERIENCE_OFFSETS[index] ?? EXPERIENCE_OFFSETS[0];
        const entry = index > 0
          ? (handoffProgress[index - 1] ?? 0)
          : smoothSegment(
              progress,
              INITIAL_EXPERIENCE_WINDOW[0],
              INITIAL_EXPERIENCE_WINDOW[1],
            );
        const exit = handoffProgress[index] ?? 0;
        const retirement = handoffProgress[index + 1] ?? 0;
        const historyOpacity = HISTORY_OPACITY * (1 - retirement);
        const posterOpacity = entry * (1 - exit * (1 - historyOpacity));
        const copyOpacity = entry * (1 - exit) ** 3;
        const score = copyOpacity + posterOpacity * 0.25;

        if (score > activeScore) {
          activeIndex = index;
          activeScore = score;
        }

        article.style.setProperty(
          "--experience-poster-clip",
          `${(49.5 * (1 - entry)).toFixed(3)}%`,
        );
        article.style.setProperty(
          "--experience-poster-opacity",
          posterOpacity.toFixed(4),
        );
        article.style.setProperty(
          "--experience-poster-scale",
          (index === 0 ? 0.88 + entry * 0.12 : 1).toFixed(4),
        );
        article.style.setProperty(
          "--experience-poster-x",
          `${(offset.drift * exit).toFixed(3)}vw`,
        );
        article.style.setProperty(
          "--experience-poster-y",
          `${(index === 0 ? 1.75 * (1 - entry) : 0).toFixed(3)}rem`,
        );
        article.style.setProperty(
          "--experience-copy-opacity",
          copyOpacity.toFixed(4),
        );
        article.style.setProperty(
          "--experience-copy-y",
          `${(index === 0 ? 1.75 * (1 - entry) : 0).toFixed(3)}rem`,
        );
      });

      root.dataset.featuredActive = String(activeIndex + 1).padStart(2, "0");
    };

    const updateStackedFallback = () => {
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

    const updateMobile = () => {
      // Retain the existing stacked fallback on short desktop windows.
      if (!mobileQuery.matches) {
        updateStackedFallback();
        return;
      }
      const progress = clamp((window.scrollY - start) / travel);
      if (Math.abs(progress - previousProgress) < 0.0001) return;
      previousProgress = progress;

      // Longer overlapping replacements; every value is a pure
      // function of scroll, so reversing or stopping needs no animation state.
      const phases = MOBILE_HANDOFF_WINDOWS.map(([start, end]) =>
        clamp((progress - start) / (end - start)),
      );
      const entries = phases.map((value) => smoothSegment(value, 0, 1));
      const ink = phases.map((value) => smoothSegment(value, 0, 0.62));
      const retreats = phases.map((value) => smoothSegment(value, 0, 1));
      const exits = phases.map((value) => smoothSegment(value, 0.18, 1));
      let activeIndex = 0;
      phases.forEach((value, index) => {
        if (value >= 0.5) activeIndex = index + 1;
      });

      articles.forEach((article, index) => {
        const entry = index === 0 ? 1 : entries[index - 1];
        const incomingOpacity = index === 0 ? 1 : ink[index - 1];
        const exit = exits[index] ?? 0;
        const retreat = retreats[index] ?? 0;
        const retirement = retreats[index + 1] ?? 0;
        const opacity = incomingOpacity * (1 - exit) +
          0.12 * incomingOpacity * exit * (1 - retirement);
        const copyEntry = index === 0 ? 1 : smoothSegment(phases[index - 1], 0, 0.94);
        const copyExit = smoothSegment(phases[index] ?? 0, 0.06, 1);
        const entryPhase = index === 0 ? 1 : phases[index - 1];
        const exitPhase = phases[index] ?? 0;
        // Allow for the copy's vertical drift when matching the mask edges.
        const entryMaskInset = 26 * entryPhase * (1 - entryPhase);
        const exitMaskInset = 26 * exitPhase * (1 - exitPhase);
        article.style.setProperty(
          "--experience-poster-mask", `${(28 * (1 - entry)).toFixed(3)}%`,
        );
        article.style.setProperty("--experience-poster-opacity", opacity.toFixed(4));
        article.style.setProperty(
          "--experience-poster-scale", (0.992 + 0.008 * entry - 0.045 * retreat).toFixed(4),
        );
        article.style.setProperty(
          "--experience-poster-y",
          `${(1.75 * (1 - entry) - 0.85 * retreat).toFixed(3)}rem`,
        );
        article.style.setProperty(
          "--experience-copy-opacity", (copyEntry * (1 - copyExit)).toFixed(4),
        );
        // Complementary masks replace the copy from top to bottom. The small
        // overlap avoids a hard seam without superimposing whole titles.
        article.style.setProperty(
          "--experience-copy-mask-top",
          `${Math.min(100, copyExit * 100 + exitMaskInset).toFixed(3)}%`,
        );
        article.style.setProperty(
          "--experience-copy-mask-bottom",
          `${Math.min(100, (1 - copyEntry) * 100 + entryMaskInset).toFixed(3)}%`,
        );
        article.style.setProperty(
          "--experience-copy-y",
          `${(0.65 * (1 - copyEntry) - 0.45 * retreat).toFixed(3)}rem`,
        );
      });
      root.dataset.featuredActive = String(activeIndex + 1).padStart(2, "0");
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
    // Safari chrome changes innerHeight, but svh track/stage geometry is stable.
    let measuredWidth = window.innerWidth;
    const handleResize = () => {
      if (!mobileQuery.matches || window.innerWidth !== measuredWidth) remeasure();
      measuredWidth = window.innerWidth;
    };
    window.addEventListener("resize", handleResize);
    desktopQuery.addEventListener("change", remeasure);
    reducedMotionQuery.addEventListener("change", remeasure);
    remeasure();

    return () => {
      window.cancelAnimationFrame(frame);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
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
