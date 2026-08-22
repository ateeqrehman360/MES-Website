"use client";

import dynamic from "next/dynamic";

const HeroCanvas = dynamic(
  () => import("./hero-canvas").then((module) => module.HeroCanvas),
  {
    ssr: false,
    loading: () => <div className="hero-static__canvas-placeholder" />,
  },
);

export function HeroCanvasLoader() {
  return (
    <div className="hero-static__canvas" aria-hidden="true">
      <HeroCanvas />
    </div>
  );
}
