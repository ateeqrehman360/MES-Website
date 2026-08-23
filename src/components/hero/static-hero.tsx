"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef } from "react";

import { HeroCanvasLoader } from "./hero-canvas-loader";
import { createHeroProgressSignal } from "./hero-progress";

const DISPLAY_ASPECT = 1246 / 720;
const SCREEN_OVERSCAN = 1.074;

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
    let hasMeasured = false;
    let previousDesktop = desktopQuery.matches;
    let previousHeight = window.innerHeight;
    let previousProgress = 0;
    let previousWidth = window.innerWidth;

    const update = () => {
      frame = 0;

      const rootHeight = root.offsetHeight;
      const stageHeight = stage.offsetHeight;
      let rootTop = root.getBoundingClientRect().top;
      const isDesktop = desktopQuery.matches;
      const webglUnavailable = root.querySelector(
        '[data-webgl-state="unavailable"]',
      );
      const availableTravel = Math.max(rootHeight - stageHeight, 1);
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const viewportChanged =
        viewportHeight !== previousHeight || viewportWidth !== previousWidth;
      const orientationChanged =
        (viewportWidth >= viewportHeight) !==
        (previousWidth >= previousHeight);
      const shouldPreserveProgress =
        hasMeasured &&
        viewportChanged &&
        previousProgress > 0 &&
        previousProgress < 1 &&
        !reducedMotionQuery.matches &&
        !webglUnavailable &&
        (orientationChanged || (previousDesktop && isDesktop));

      if (shouldPreserveProgress) {
        const rootDocumentTop = window.scrollY + rootTop;
        const targetScrollY =
          rootDocumentTop + previousProgress * availableTravel;

        window.scrollTo({ top: targetScrollY, behavior: "instant" });
        rootTop = root.getBoundingClientRect().top;
      }

      const rawProgress = !reducedMotionQuery.matches && !webglUnavailable
        ? clamp(-rootTop / availableTravel)
        : 0;
      const titleExit = smoothSegment(
        rawProgress,
        isDesktop ? 0.08 : 0.06,
        isDesktop ? 0.28 : 0.44,
      );
      const takeover = smoothSegment(
        rawProgress,
        isDesktop ? 0.94 : 0.9,
        isDesktop ? 0.99 : 0.97,
      );
      const canvasExit = smoothSegment(
        rawProgress,
        isDesktop ? 0.99 : 0.97,
        1,
      );
      const navigationExit = smoothSegment(
        rawProgress,
        isDesktop ? 0.76 : 0.66,
        isDesktop ? 0.88 : 0.8,
      );
      const viewportAspect = window.innerWidth / Math.max(window.innerHeight, 1);
      const visibleScreenHalf =
        viewportAspect / (2 * DISPLAY_ASPECT * SCREEN_OVERSCAN);
      const mobileAnchor = clamp(0.635 + visibleScreenHalf, 0.74, 0.8);

      progress.set(rawProgress);
      root.dataset.heroReducedMotion = reducedMotionQuery.matches
        ? "true"
        : "false";
      stage.dataset.heroProgress = rawProgress.toFixed(3);
      stage.dataset.heroMotionMode = webglUnavailable
        ? "fallback"
        : isDesktop
          ? "desktop"
          : "mobile";
      stage.toggleAttribute(
        "data-hero-navigation-hidden",
        navigationExit > 0.999,
      );
      stage.style.setProperty("--hero-title-progress", titleExit.toFixed(4));
      stage.style.setProperty("--hero-title-opacity", (1 - titleExit).toFixed(4));
      stage.style.setProperty("--hero-takeover-opacity", takeover.toFixed(4));
      stage.style.setProperty("--hero-canvas-opacity", (1 - canvasExit).toFixed(4));
      document.documentElement.style.setProperty(
        "--hero-artboard-translate-x",
        isDesktop ? "-50%" : `${(-mobileAnchor * 100).toFixed(3)}%`,
      );
      document.documentElement.style.setProperty(
        "--hero-navigation-opacity",
        (1 - navigationExit).toFixed(4),
      );

      hasMeasured = true;
      previousDesktop = isDesktop;
      previousHeight = viewportHeight;
      previousProgress = rawProgress;
      previousWidth = viewportWidth;
    };

    const scheduleUpdate = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(update);
      }
    };

    const observer = new ResizeObserver(scheduleUpdate);
    const canvasStateObserver = new MutationObserver(scheduleUpdate);

    observer.observe(root);
    canvasStateObserver.observe(root, {
      attributes: true,
      attributeFilter: ["data-webgl-state"],
      subtree: true,
    });
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
      canvasStateObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      desktopQuery.removeEventListener("change", scheduleUpdate);
      reducedMotionQuery.removeEventListener("change", scheduleUpdate);
      delete root.dataset.heroReducedMotion;
      document.documentElement.style.removeProperty("--hero-navigation-opacity");
      document.documentElement.style.removeProperty(
        "--hero-artboard-translate-x",
      );
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

      <section className="hero-handoff" aria-hidden="true">
        <div className="hero-screen-artboard hero-screen-artboard--continuation" />
      </section>
    </>
  );
}
