"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";

import type { HeroProgressSignal } from "./hero-progress";

const HeroCanvas = dynamic(
  () => import("./hero-canvas").then((module) => module.HeroCanvas),
  {
    ssr: false,
    loading: () => <div className="hero-static__canvas-placeholder" />,
  },
);

class HeroCanvasErrorBoundary extends Component<
  { children: ReactNode; onUnavailable: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onUnavailable();
  }

  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

export function HeroCanvasLoader({
  progress,
}: {
  progress: HeroProgressSignal;
}) {
  const [canvasState, setCanvasState] = useState<
    "checking" | "loading" | "ready" | "unavailable"
  >("checking");

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const forceFallback =
        process.env.NODE_ENV === "development" &&
        new URLSearchParams(window.location.search).get("webgl") === "off";

      if (forceFallback) {
        setCanvasState("unavailable");
        return;
      }

      try {
        const probe = document.createElement("canvas");
        const attributes: WebGLContextAttributes = {
          failIfMajorPerformanceCaveat: true,
        };
        const context =
          probe.getContext("webgl2", attributes) ??
          probe.getContext("webgl", attributes);

        if (!context) {
          setCanvasState("unavailable");
          return;
        }

        context.getExtension("WEBGL_lose_context")?.loseContext();
        setCanvasState("loading");
      } catch {
        setCanvasState("unavailable");
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const markReady = useCallback(() => setCanvasState("ready"), []);
  const markUnavailable = useCallback(
    () => setCanvasState("unavailable"),
    [],
  );

  return (
    <div
      className="hero-static__canvas"
      data-webgl-state={canvasState}
      aria-hidden="true"
    >
      <div className="hero-static__webgl-fallback">
        <span className="hero-static__fallback-rule" />
        <Image
          src="/brand/mes-logo.svg"
          alt=""
          width={560}
          height={610}
          loading="eager"
          className="hero-static__fallback-logo"
        />
      </div>

      {(canvasState === "loading" || canvasState === "ready") && (
        <HeroCanvasErrorBoundary onUnavailable={markUnavailable}>
          <HeroCanvas
            progress={progress}
            onReady={markReady}
            onUnavailable={markUnavailable}
          />
        </HeroCanvasErrorBoundary>
      )}
    </div>
  );
}
