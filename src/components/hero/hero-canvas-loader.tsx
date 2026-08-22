"use client";

import dynamic from "next/dynamic";

import type { HeroProgressSignal } from "./hero-progress";

const HeroCanvas = dynamic(
  () => import("./hero-canvas").then((module) => module.HeroCanvas),
  {
    ssr: false,
    loading: () => <div className="hero-static__canvas-placeholder" />,
  },
);

export function HeroCanvasLoader({
  progress,
}: {
  progress: HeroProgressSignal;
}) {
  return (
    <div className="hero-static__canvas" aria-hidden="true">
      <HeroCanvas progress={progress} />
    </div>
  );
}
