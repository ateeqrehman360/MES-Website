"use client";

import { useEffect, useRef, type ReactNode } from "react";

const INITIAL_EXPERIENCE_WINDOW = [0.015, 0.145] as const;
const HANDOFF_WINDOWS = [
  [0.205, 0.385],
  [0.43, 0.61],
  [0.655, 0.835],
] as const;
const EXPERIENCE_OFFSETS = [
  { drift: -7.5, turn: -1.75 },
  { drift: 7, turn: 1.6 },
  { drift: -8.5, turn: -1.6 },
  { drift: 0, turn: 0 },
] as const;
const HISTORY_OPACITY = 0.08;

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothSegment(value: number, start: number, end: number) {
  const progress = clamp((value - start) / (end - start));

  return progress * progress * (3 - 2 * progress);
}

function linearSegment(value: number, start: number, end: number) {
  return clamp((value - start) / (end - start));
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
      let activeScore = -1;

      articles.forEach((article, index) => {
        const offset = EXPERIENCE_OFFSETS[index] ?? EXPERIENCE_OFFSETS[0];
        const entryWindow = index > 0 ? HANDOFF_WINDOWS[index - 1] : null;
        const exitWindow = HANDOFF_WINDOWS[index];
        const retirementWindow = HANDOFF_WINDOWS[index + 1];
        const entryPhase = entryWindow
          ? linearSegment(progress, entryWindow[0], entryWindow[1])
          : linearSegment(
              progress,
              INITIAL_EXPERIENCE_WINDOW[0],
              INITIAL_EXPERIENCE_WINDOW[1],
            );
        const posterReveal = entryWindow
          ? smoothSegment(entryPhase, 0, 0.88)
          : smoothSegment(entryPhase, 0, 1);
        const posterArrival = entryWindow
          ? smoothSegment(entryPhase, 0, 0.78)
          : posterReveal;
        const copyArrival = entryWindow
          ? smoothSegment(entryPhase, 0.12, 0.82)
          : posterReveal;
        const exitPhase = exitWindow
          ? linearSegment(progress, exitWindow[0], exitWindow[1])
          : 0;
        const posterExit = exitWindow
          ? smoothSegment(exitPhase, 0.03, 0.75)
          : 0;
        const copyExit = exitWindow
          ? smoothSegment(exitPhase, 0.01, 0.52)
          : 0;
        const retirementPhase = retirementWindow
          ? linearSegment(
              progress,
              retirementWindow[0],
              retirementWindow[1],
            )
          : 0;
        const retirement = retirementWindow
          ? smoothSegment(retirementPhase, 0, 0.55)
          : 0;
        const historyOpacity = HISTORY_OPACITY * (1 - retirement);
        const posterOpacity =
          posterArrival * (1 - posterExit * (1 - historyOpacity));
        const copyOpacity = copyArrival * (1 - copyExit);
        const score = copyOpacity + posterOpacity * 0.25;

        if (score > activeScore) {
          activeIndex = index;
          activeScore = score;
        }

        article.style.setProperty(
          "--experience-poster-clip",
          `${(49.5 * (1 - posterReveal)).toFixed(3)}%`,
        );
        article.style.setProperty(
          "--experience-poster-opacity",
          posterOpacity.toFixed(4),
        );
        article.style.setProperty(
          "--experience-poster-scale",
          (
            0.88 +
            posterReveal * 0.12 -
            posterExit * 0.055 -
            retirement * 0.015
          ).toFixed(4),
        );
        article.style.setProperty(
          "--experience-poster-x",
          `${(offset.drift * (posterExit + retirement * 0.12)).toFixed(3)}vw`,
        );
        article.style.setProperty(
          "--experience-poster-y",
          `${(
            1.75 * (1 - posterReveal) -
            posterExit * 0.75 -
            retirement * 0.2
          ).toFixed(3)}rem`,
        );
        article.style.setProperty(
          "--experience-poster-rotate",
          `${(offset.turn * (posterExit + retirement * 0.08)).toFixed(3)}deg`,
        );
        article.style.setProperty(
          "--experience-copy-opacity",
          copyOpacity.toFixed(4),
        );
        article.style.setProperty(
          "--experience-copy-y",
          `${(1.75 * (1 - copyArrival) - copyExit * 0.9).toFixed(3)}rem`,
        );
        article.style.setProperty(
          "--experience-field-opacity",
          (
            posterReveal *
            (1 - posterExit * 0.9) *
            (1 - retirement)
          ).toFixed(4),
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
