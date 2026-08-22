"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";

import { HeroCanvasLoader } from "./hero-canvas-loader";
import { createHeroProgressSignal } from "./hero-progress";

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothSegment(value: number, start: number, end: number) {
  const progress = clamp((value - start) / (end - start));

  return progress * progress * (3 - 2 * progress);
}

export function StaticHero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);
  const progress = useMemo(() => createHeroProgressSignal(), []);

  useEffect(() => {
    const root = rootRef.current;
    const stage = stageRef.current;

    if (!root || !stage) {
      return;
    }

    const desktopQuery = window.matchMedia("(min-width: 48rem)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let frame = 0;

    const update = () => {
      frame = 0;

      const availableTravel = Math.max(root.offsetHeight - window.innerHeight, 1);
      const rawProgress = desktopQuery.matches && !reducedMotionQuery.matches
        ? clamp(-root.getBoundingClientRect().top / availableTravel)
        : 0;
      const titleExit = smoothSegment(rawProgress, 0.08, 0.28);
      const takeover = smoothSegment(rawProgress, 0.94, 0.99);
      const canvasExit = smoothSegment(rawProgress, 0.99, 1);
      const navigationExit = smoothSegment(rawProgress, 0.76, 0.88);

      progress.set(rawProgress);
      stage.dataset.heroProgress = rawProgress.toFixed(3);
      stage.toggleAttribute(
        "data-hero-navigation-hidden",
        navigationExit > 0.999,
      );
      stage.style.setProperty("--hero-title-progress", titleExit.toFixed(4));
      stage.style.setProperty("--hero-title-opacity", (1 - titleExit).toFixed(4));
      stage.style.setProperty("--hero-takeover-opacity", takeover.toFixed(4));
      stage.style.setProperty("--hero-canvas-opacity", (1 - canvasExit).toFixed(4));
      document.documentElement.style.setProperty(
        "--hero-navigation-opacity",
        (1 - navigationExit).toFixed(4),
      );
    };

    const scheduleUpdate = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(update);
      }
    };

    const observer = new ResizeObserver(scheduleUpdate);

    observer.observe(root);
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    desktopQuery.addEventListener("change", scheduleUpdate);
    reducedMotionQuery.addEventListener("change", scheduleUpdate);
    scheduleUpdate();

    return () => {
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
      }

      observer.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      desktopQuery.removeEventListener("change", scheduleUpdate);
      reducedMotionQuery.removeEventListener("change", scheduleUpdate);
      document.documentElement.style.removeProperty("--hero-navigation-opacity");
    };
  }, [progress]);

  return (
    <>
      <div ref={rootRef} className="hero-motion">
        <section
          ref={stageRef}
          className="hero-static hero-motion__stage"
          aria-labelledby="hero-title"
          data-hero-progress="0.000"
        >
          <h1
            id="hero-title"
            aria-label="Muslim Entrepreneurs"
            className="hero-static__title font-display"
          >
            <span
              className="hero-static__line hero-static__line--muslim"
              aria-hidden="true"
            >
              Muslim
            </span>
            <span
              className="hero-static__line hero-static__line--entrepreneurs-desktop"
              aria-hidden="true"
            >
              Entrepreneurs
            </span>
            <span
              className="hero-static__line hero-static__line--entrepreneurs-mobile"
              aria-hidden="true"
            >
              <span>Entre</span>
              <span>Preneurs</span>
            </span>
          </h1>

          <HeroCanvasLoader progress={progress} />

          <div className="hero-motion__takeover" aria-hidden="true">
            <div className="hero-screen-artboard">
              <span className="hero-screen-artboard__accent" />
              <div className="hero-screen-artboard__wordmark font-display">
                <span>Muslim</span>
                <span>Entrepreneurs</span>
              </div>
              <span className="hero-screen-artboard__rule" />
              <Image
                src="/brand/mes-logo.svg"
                alt=""
                width={560}
                height={610}
                className="hero-screen-artboard__logo"
              />
            </div>
          </div>
        </section>
      </div>

      <section
        className="hero-handoff"
        aria-label="Placeholder for the normal website section"
      >
        <div className="hero-screen-artboard hero-screen-artboard--continuation" />
      </section>
    </>
  );
}
