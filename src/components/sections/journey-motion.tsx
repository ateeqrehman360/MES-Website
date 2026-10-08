"use client";

import { useEffect, useRef, type ReactNode } from "react";

import { setupJourneyProgress } from "./journey-progress-motion";

export function JourneyMotion({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (stage) return setupJourneyProgress(stage);
  }, []);

  return (
    <div ref={stageRef} className="journey__stage">
      <div className="journey__route" data-journey-route aria-hidden="true">
        <svg
          className="journey__path"
          data-journey-svg
          focusable="false"
          preserveAspectRatio="none"
        >
          <path
            className="journey__path-base"
            data-journey-path-base
            fill="none"
            stroke="#618C5D"
            strokeOpacity="0.42"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div className="journey__progress-window" data-journey-progress-window>
          <div className="journey__progress-route" data-journey-progress-route>
            <svg
              className="journey__path"
              data-journey-svg
              focusable="false"
              preserveAspectRatio="none"
            >
              <path
                className="journey__path-progress"
                data-journey-path-progress
                fill="none"
                stroke="#01500B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
