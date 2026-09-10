"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Point = Readonly<{
  x: number;
  y: number;
}>;

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function createJourneyPath(points: readonly Point[]) {
  if (points.length < 2) return "";

  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const midpoint = previous.y + (point.y - previous.y) * 0.5;

    return `${path} C ${previous.x.toFixed(2)} ${midpoint.toFixed(2)}, ${point.x.toFixed(2)} ${midpoint.toFixed(2)}, ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
  }, `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`);
}

function findLengthAtY(
  path: SVGPathElement,
  pathLength: number,
  targetY: number,
) {
  let lower = 0;
  let upper = pathLength;

  for (let index = 0; index < 14; index += 1) {
    const midpoint = (lower + upper) * 0.5;
    const point = path.getPointAtLength(midpoint);

    if (point.y < targetY) {
      lower = midpoint;
    } else {
      upper = midpoint;
    }
  }

  return (lower + upper) * 0.5;
}

export function JourneyMotion({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const svg = stage?.querySelector<SVGSVGElement>("[data-journey-svg]");
    const basePath = stage?.querySelector<SVGPathElement>(
      "[data-journey-path-base]",
    );
    const progressPath = stage?.querySelector<SVGPathElement>(
      "[data-journey-path-progress]",
    );
    const nodes = stage
      ? Array.from(stage.querySelectorAll<HTMLElement>("[data-journey-node]"))
      : [];
    const ending = stage?.querySelector<HTMLElement>("[data-journey-ending]");

    if (!stage || !svg || !basePath || !progressPath || !ending) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let animationFrame = 0;
    let geometryNeedsUpdate = true;
    let pathLength = 0;
    let disposed = false;

    const measurePath = () => {
      const stageRect = stage.getBoundingClientRect();
      const stageWidth = stage.clientWidth;
      const stageHeight = stage.offsetHeight;

      if (stageWidth <= 0 || stageHeight <= 0 || nodes.length === 0) return;

      const nodePoints = nodes.map((node) => {
        const bounds = node.getBoundingClientRect();

        return {
          x: bounds.left + bounds.width * 0.5 - stageRect.left,
          y: bounds.top + bounds.height * 0.5 - stageRect.top,
        };
      });
      const endingBounds = ending.getBoundingClientRect();
      const endingPoint = {
        x: endingBounds.left + endingBounds.width * 0.5 - stageRect.left,
        y: endingBounds.top + endingBounds.height * 0.5 - stageRect.top,
      };
      const firstPoint = nodePoints[0];
      const points = [
        { x: firstPoint.x, y: 0 },
        ...nodePoints,
        endingPoint,
        { x: endingPoint.x, y: stageHeight },
      ];
      const pathData = createJourneyPath(points);

      svg.setAttribute("width", `${stageWidth}`);
      svg.setAttribute("height", `${stageHeight}`);
      svg.setAttribute("viewBox", `0 0 ${stageWidth} ${stageHeight}`);
      svg.style.height = `${stageHeight}px`;
      basePath.setAttribute("d", pathData);
      progressPath.setAttribute("d", pathData);
      pathLength = progressPath.getTotalLength();
      progressPath.style.strokeDasharray = `${pathLength}`;
      progressPath.style.strokeDashoffset = reducedMotionQuery.matches
        ? "0"
        : `${pathLength}`;
      geometryNeedsUpdate = false;
    };

    const update = () => {
      animationFrame = 0;

      if (geometryNeedsUpdate) measurePath();
      if (pathLength <= 0) return;

      if (reducedMotionQuery.matches) {
        stage.dataset.journeyMotion = "static";
        progressPath.style.strokeDashoffset = "0";
        nodes.forEach((node) => {
          const milestone = node.closest<HTMLElement>(
            "[data-journey-milestone]",
          );
          if (milestone) milestone.dataset.journeyState = "visible";
        });
        return;
      }

      stage.dataset.journeyMotion = "enabled";
      const stageBounds = stage.getBoundingClientRect();
      const readingLine = window.innerHeight * 0.66;
      const revealedY = clamp(readingLine - stageBounds.top, 0, stageBounds.height);
      const revealedLength = findLengthAtY(
        progressPath,
        pathLength,
        revealedY,
      );
      const progress = clamp(revealedLength / pathLength);

      stage.style.setProperty("--journey-progress", progress.toFixed(4));
      progressPath.style.strokeDashoffset = `${pathLength - revealedLength}`;

      let activeIndex = -1;
      nodes.forEach((node, index) => {
        const bounds = node.getBoundingClientRect();
        if (bounds.top + bounds.height * 0.5 <= readingLine) {
          activeIndex = index;
        }
      });

      nodes.forEach((node, index) => {
        const milestone = node.closest<HTMLElement>(
          "[data-journey-milestone]",
        );
        if (!milestone) return;

        milestone.dataset.journeyState =
          index < activeIndex
            ? "complete"
            : index === activeIndex
              ? "active"
              : "upcoming";
      });
    };

    const scheduleUpdate = (measure = false) => {
      if (disposed) return;
      geometryNeedsUpdate = geometryNeedsUpdate || measure;
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(update);
    };

    const resizeObserver =
      "ResizeObserver" in window
        ? new ResizeObserver(() => scheduleUpdate(true))
        : null;
    const handleScroll = () => scheduleUpdate();
    const handleResize = () => scheduleUpdate(true);
    const handleMotionPreference = () => scheduleUpdate(true);
    const supportsModernMotionListener =
      typeof reducedMotionQuery.addEventListener === "function";

    measurePath();
    update();

    resizeObserver?.observe(stage);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    if (supportsModernMotionListener) {
      reducedMotionQuery.addEventListener("change", handleMotionPreference);
    } else {
      reducedMotionQuery.addListener(handleMotionPreference);
    }
    document.fonts?.ready.then(() => scheduleUpdate(true));

    return () => {
      disposed = true;
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (supportsModernMotionListener) {
        reducedMotionQuery.removeEventListener("change", handleMotionPreference);
      } else {
        reducedMotionQuery.removeListener(handleMotionPreference);
      }
    };
  }, []);

  return (
    <div ref={stageRef} className="journey__stage">
      <svg
        className="journey__path"
        data-journey-svg
        aria-hidden="true"
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
        <path
          className="journey__path-progress"
          data-journey-path-progress
          fill="none"
          stroke="#01500B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {children}
    </div>
  );
}
