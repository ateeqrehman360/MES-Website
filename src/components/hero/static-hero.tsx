"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, type CSSProperties } from "react";

import { heroPhotography, heroStatement } from "@/data/hero";

import { HeroCanvasLoader } from "./hero-canvas-loader";
import { createHeroProgressSignal } from "./hero-progress";
import {
  HERO_PURPOSE_ARTBOARD_STYLE,
  HERO_PURPOSE_HANDOFF_WINDOWS,
} from "./hero-purpose-layout";

const DISPLAY_ASPECT = 1246 / 720;
const SCREEN_OVERSCAN = 1.074;

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothSegment(value: number, start: number, end: number) {
  const progress = clamp((value - start) / (end - start));

  return progress * progress * (3 - 2 * progress);
}

function HeroStatementArtboard({ continuation = false }) {
  return (
    <div
      className={`hero-screen-artboard${
        continuation ? " hero-screen-artboard--continuation" : ""
      }`}
      style={HERO_PURPOSE_ARTBOARD_STYLE as CSSProperties}
    >
      {continuation ? (
        <p className="sr-only">{heroStatement.accessibleText}</p>
      ) : null}
      <span className="hero-screen-artboard__divider" aria-hidden="true" />
      <div className="hero-screen-artboard__content" aria-hidden="true">
        <div className="hero-screen-artboard__utility">
          <span className="hero-screen-artboard__utility-rule" />
          <span>{heroStatement.label}</span>
        </div>
        <div className="hero-screen-artboard__statement-lead font-display">
          {heroStatement.leadLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        <span className="hero-screen-artboard__stack-rule" />
        <div className="hero-screen-artboard__statement-close font-display">
          {heroStatement.closeLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
        <Image
          src="/brand/mes-logo.svg"
          alt=""
          width={560}
          height={610}
          className="hero-screen-artboard__logo"
        />
      </div>
    </div>
  );
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
      const purposeHandoff = isDesktop
        ? HERO_PURPOSE_HANDOFF_WINDOWS.desktop
        : HERO_PURPOSE_HANDOFF_WINDOWS.mobile;
      const takeoverContent = smoothSegment(
        rawProgress,
        purposeHandoff.domContentIn.start,
        purposeHandoff.domContentIn.end,
      );
      const takeoverDivider = smoothSegment(
        rawProgress,
        purposeHandoff.domDividerIn.start,
        purposeHandoff.domDividerIn.end,
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
      stage.style.setProperty(
        "--hero-takeover-content-opacity",
        takeoverContent.toFixed(4),
      );
      stage.style.setProperty(
        "--hero-takeover-divider-opacity",
        takeoverDivider.toFixed(4),
      );
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
            <span className="hero-static__title-stack" aria-hidden="true">
              <span className="hero-static__line hero-static__line--muslim">
                Muslim
              </span>
              <span className="hero-static__line hero-static__line--entrepreneurs-desktop">
                Entrepreneurs
              </span>
              <span className="hero-static__line hero-static__line--entrepreneurs-mobile">
                Entrepreneurs
              </span>
            </span>
          </h1>

          <div className="hero-static__editorial">
            <div className="hero-static__since" aria-hidden="true">
              <span className="hero-static__since-rule" />
              <span className="hero-static__since-label">Since 2024</span>
              <span className="hero-static__since-rule" />
            </div>

            <div className="hero-static__editorial-body">
              <p className="hero-static__editorial-statement">
                <span>Building ethical businesses.</span>
                <span>Creating impact. Inspiring change.</span>
              </p>

              <div className="hero-static__facts">
                <p className="hero-static__affiliation">
                  <svg
                    aria-hidden="true"
                    className="hero-static__location-icon"
                    fill="none"
                    viewBox="0 0 24 28"
                  >
                    <path d="M12 26C12 26 21.5 17.45 21.5 10.5C21.5 5.25 17.25 1 12 1C6.75 1 2.5 5.25 2.5 10.5C2.5 17.45 12 26 12 26Z" />
                    <circle cx="12" cy="10.5" r="3.4" />
                  </svg>
                  <span className="hero-static__location-copy">
                    <span>Manchester</span>
                    <span>Metropolitan</span>
                    <span>University</span>
                  </span>
                </p>
                <p className="hero-static__established">
                  <span>Est.</span>
                  <strong>2024</strong>
                </p>
              </div>

              <p className="hero-static__scroll-cue">
                <svg
                  aria-hidden="true"
                  className="hero-static__scroll-arrow"
                  fill="none"
                  viewBox="0 0 24 28"
                >
                  <path d="M12 1.5V25.5M5.5 19L12 25.5L18.5 19" />
                </svg>
                <span>Scroll to discover</span>
              </p>
            </div>
          </div>

          <span className="hero-static__ground-shadow" aria-hidden="true" />

          <HeroCanvasLoader progress={progress} />

          <ul className="sr-only" aria-label="MES event photography">
            {heroPhotography.map((photograph) => (
              <li key={photograph.id}>{photograph.alt}</li>
            ))}
          </ul>

          <div className="hero-motion__takeover" aria-hidden="true">
            <HeroStatementArtboard />
          </div>
        </section>
      </div>

      <div className="hero-handoff">
        <HeroStatementArtboard continuation />
      </div>
    </>
  );
}
