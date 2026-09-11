"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Point = Readonly<{
  x: number;
  y: number;
}>;

type PathSample = Point &
  Readonly<{
    length: number;
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

function createPathLookup(path: SVGPathElement, pathLength: number) {
  const sampleCount = Math.max(2, Math.ceil(pathLength / 4));

  return Array.from({ length: sampleCount + 1 }, (_, index) => {
    const length = (pathLength * index) / sampleCount;
    const point = path.getPointAtLength(length);

    return { x: point.x, y: point.y, length };
  });
}

function findLengthAtY(samples: readonly PathSample[], targetY: number) {
  if (samples.length < 2) return 0;
  if (targetY <= samples[0].y) return samples[0].length;

  const finalSample = samples[samples.length - 1];
  if (targetY >= finalSample.y) return finalSample.length;

  let lower = 0;
  let upper = samples.length - 1;

  while (upper - lower > 1) {
    const midpoint = Math.floor((lower + upper) * 0.5);

    if (samples[midpoint].y < targetY) {
      lower = midpoint;
    } else {
      upper = midpoint;
    }
  }

  const lowerSample = samples[lower];
  const upperSample = samples[upper];
  const yDistance = upperSample.y - lowerSample.y;
  const localProgress =
    yDistance > 0 ? clamp((targetY - lowerSample.y) / yDistance) : 0;

  return (
    lowerSample.length +
    (upperSample.length - lowerSample.length) * localProgress
  );
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
    let geometrySignature = "";
    let pathLength = 0;
    let pathLookup: readonly PathSample[] = [];
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
      const nextGeometrySignature = `${stageWidth}:${stageHeight}:${pathData}`;

      if (
        nextGeometrySignature === geometrySignature &&
        pathLength > 0 &&
        pathLookup.length > 1
      ) {
        geometryNeedsUpdate = false;
        return;
      }

      svg.setAttribute("width", `${stageWidth}`);
      svg.setAttribute("height", `${stageHeight}`);
      svg.setAttribute("viewBox", `0 0 ${stageWidth} ${stageHeight}`);
      svg.style.height = `${stageHeight}px`;
      basePath.setAttribute("d", pathData);
      progressPath.setAttribute("d", pathData);
      pathLength = progressPath.getTotalLength();
      pathLookup = createPathLookup(progressPath, pathLength);
      geometrySignature = nextGeometrySignature;
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
      const revealedLength = findLengthAtY(pathLookup, revealedY);
      const progress = clamp(revealedLength / pathLength);

      progressPath.style.strokeDashoffset = (1 - progress).toFixed(5);

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
    const milestoneElements = nodes
      .map((node) =>
        node.closest<HTMLElement>("[data-journey-milestone]"),
      )
      .filter((milestone): milestone is HTMLElement => milestone !== null);
    const journeyImages = Array.from(
      stage.querySelectorAll<HTMLImageElement>(".journey__media img"),
    );
    const handleScroll = () => scheduleUpdate();
    const handleResize = () => scheduleUpdate(true);
    const handleAssetLoad = () => scheduleUpdate(true);
    const handleMotionPreference = () => scheduleUpdate(true);
    const supportsModernMotionListener =
      typeof reducedMotionQuery.addEventListener === "function";

    measurePath();
    update();

    resizeObserver?.observe(stage);
    milestoneElements.forEach((milestone) => resizeObserver?.observe(milestone));
    journeyImages.forEach((image) => {
      image.addEventListener("load", handleAssetLoad, { once: true });
    });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
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
      window.removeEventListener("orientationchange", handleResize);
      journeyImages.forEach((image) => {
        image.removeEventListener("load", handleAssetLoad);
      });
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
          pathLength="1"
          stroke="#01500B"
          strokeDasharray="1"
          strokeDashoffset="1"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {children}
    </div>
  );
}
