type Point = Readonly<{ x: number; y: number }>;

const strokePadding = 2;

function offsetWithin(element: HTMLElement, ancestor: HTMLElement): Point {
  let x = 0;
  let y = 0;
  let current: HTMLElement | null = element;
  while (current && current !== ancestor) {
    x += current.offsetLeft;
    y += current.offsetTop;
    current = current.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

function createJourneyPath(points: readonly Point[], mobile: boolean) {
  // Preserve each layout's existing route coordinates and cubic curves.
  const coordinate = (value: number) =>
    mobile ? `${value}` : value.toFixed(2);
  return points.slice(1).reduce((path, point, index) => {
    const previous = points[index];
    const middle = (previous.y + point.y) / 2;
    return `${path} C ${coordinate(previous.x)} ${coordinate(middle)}, ${coordinate(point.x)} ${coordinate(middle)}, ${coordinate(point.x)} ${coordinate(point.y)}`;
  }, `M ${coordinate(points[0].x)} ${coordinate(points[0].y)}`);
}

export function setupJourneyProgress(stage: HTMLDivElement) {
  const route = stage.querySelector<HTMLElement>("[data-journey-route]");
  const reveal = stage.querySelector<HTMLElement>("[data-journey-progress-window]");
  const stationaryRoute = stage.querySelector<HTMLElement>(
    "[data-journey-progress-route]",
  );
  const svgs = Array.from(
    stage.querySelectorAll<SVGSVGElement>("[data-journey-svg]"),
  );
  const paths = Array.from(
    stage.querySelectorAll<SVGPathElement>(
      "[data-journey-path-base], [data-journey-path-progress]",
    ),
  );
  const nodes = Array.from(
    stage.querySelectorAll<HTMLElement>("[data-journey-node]"),
  );
  const ending = stage.querySelector<HTMLElement>("[data-journey-ending]");
  if (!route || !reveal || !stationaryRoute || !ending || !nodes.length) return;

  const milestones = nodes.map((node) =>
    node.closest<HTMLElement>("[data-journey-milestone]"),
  );
  const mobileQuery = matchMedia("(max-width: 47.999rem)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const nativeTimeline =
    CSS.supports("animation-timeline", "view()") &&
    CSS.supports("view-timeline", "--journey-progress block") &&
    CSS.supports("view-timeline-inset", "1px calc(100% - 1px)") &&
    CSS.supports("animation-range", "cover 0% cover 100%");
  stage.dataset.journeyProgress = nativeTimeline ? "native" : "fallback";

  let disposed = false;
  let ready = false;
  let frame = 0;
  let width = 0;
  let height = 0;
  let readingLine = 0;
  let points: readonly Point[] = [];
  let geometrySignature = "";
  let previousOffset = Number.NaN;
  let previousTop = Number.NaN;
  let idleFrames = 0;
  let viewportHeight = window.innerHeight;
  let previousActive = -2;
  let previousMotion = "";
  const milestoneStates: string[] = [];

  const update = () => {
    frame = 0;
    if (disposed || !ready || document.hidden) return;

    // Milestone states and the legacy fallback share one stage read. Native
    // progress never receives per-frame JavaScript style/attribute updates.
    const top = stage.getBoundingClientRect().top;
    const staticMotion = reducedMotion.matches;
    const revealedY = readingLine - top;
    if (!nativeTimeline) {
      const fullHeight = height + strokePadding * 2;
      const visible = staticMotion
        ? fullHeight
        : Math.max(0, Math.min(fullHeight, revealedY + strokePadding));
      const offset = visible - fullHeight;
      if (offset !== previousOffset) {
        reveal.style.transform = `translate3d(0, ${offset}px, 0)`;
        stationaryRoute.style.transform = `translate3d(0, ${-offset}px, 0)`;
        previousOffset = offset;
      }
    }

    const motion = staticMotion ? "static" : "enabled";
    if (previousMotion !== motion) {
      stage.dataset.journeyMotion = motion;
    }
    let active = -1;
    points.forEach((point, index) => {
      if (point.y <= revealedY) active = index;
    });
    // This effect owns the state attributes. Avoid reading them back from the
    // DOM on every frame; write only when crossing a node or changing motion.
    if (previousActive !== active || previousMotion !== motion) {
      milestones.forEach((milestone, index) => {
        if (!milestone) return;
        const state = staticMotion
          ? "visible"
          : index < active
            ? "complete"
            : index === active
              ? "active"
              : "upcoming";
        if (milestoneStates[index] !== state) {
          milestone.dataset.journeyState = state;
          milestoneStates[index] = state;
        }
      });
      previousActive = active;
      previousMotion = motion;
    }

    // Older Safari cannot run a native scroll timeline. Sample its latest
    // position during scrolling rather than relying only on event cadence.
    // Stop after three stationary frames; no easing, prediction or idle loop.
    idleFrames = top === previousTop ? idleFrames + 1 : 0;
    previousTop = top;
    if (
      !nativeTimeline &&
      !staticMotion &&
      idleFrames < 3 &&
      top < viewportHeight &&
      top + height > 0
    ) {
      frame = requestAnimationFrame(update);
    }
  };

  const schedule = () => {
    idleFrames = 0;
    if (!frame && !disposed) frame = requestAnimationFrame(update);
  };

  const setReadingLine = () => {
    route.style.setProperty("--journey-reading-line", `${readingLine}px`);
  };

  const measure = () => {
    if (disposed) return;
    width = stage.clientWidth;
    height = stage.offsetHeight;
    if (!width || !height) return;

    const mobile = mobileQuery.matches;
    if (mobile) {
      // Cache the small viewport at settlement/real layout changes. Safari's
      // browser chrome changing height does not remeasure the route or anchor.
      const viewport = document.createElement("div");
      viewport.style.cssText =
        "position:fixed;height:100svh;width:0;visibility:hidden;pointer-events:none";
      document.body.append(viewport);
      readingLine =
        (viewport.offsetHeight || document.documentElement.clientHeight) * 0.66;
      viewport.remove();
    } else {
      readingLine = window.innerHeight * 0.66;
    }
    setReadingLine();

    const bounds = stage.getBoundingClientRect();
    const localPoint = (node: HTMLElement): Point => {
      if (mobile) return offsetWithin(node, stage);
      const rect = node.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - bounds.left,
        y: rect.top + rect.height / 2 - bounds.top,
      };
    };
    points = nodes.map(localPoint);
    const end = localPoint(ending);
    const data = createJourneyPath([
      { x: points[0].x, y: 0 },
      ...points,
      end,
      { x: end.x, y: height },
    ], mobile);
    const signature = `${width}:${height}:${data}`;
    if (signature !== geometrySignature) {
      route.style.width = `${width}px`;
      route.style.height = `${height + strokePadding * 2}px`;
      svgs.forEach((svg) => {
        svg.setAttribute("width", `${width}`);
        svg.setAttribute("height", `${height}`);
        svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
        svg.style.width = `${width}px`;
        svg.style.height = `${height}px`;
      });
      paths.forEach((path) => path.setAttribute("d", data));
      geometrySignature = signature;
      previousOffset = Number.NaN;
    }
    ready = true;
    schedule();
  };

  const onResize = () => {
    viewportHeight = window.innerHeight;
    if (!ready) return;
    if (stage.clientWidth !== width || stage.offsetHeight !== height) {
      measure();
    } else if (!mobileQuery.matches) {
      readingLine = window.innerHeight * 0.66;
      setReadingLine();
    }
    schedule();
  };
  const onViewportResize = () => {
    viewportHeight = window.innerHeight;
    schedule();
  };
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(stage);
  const images = Array.from(
    stage.querySelectorAll<HTMLImageElement>(".journey__media img"),
  );
  images.forEach((image) =>
    image.addEventListener("load", onResize, { once: true }),
  );
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", onResize);
  window.visualViewport?.addEventListener("resize", onViewportResize);
  window.visualViewport?.addEventListener("scroll", schedule);
  document.addEventListener("visibilitychange", schedule);
  mobileQuery.addEventListener("change", measure);
  reducedMotion.addEventListener("change", schedule);
  void document.fonts.ready.then(measure);

  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    images.forEach((image) => image.removeEventListener("load", onResize));
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", onResize);
    window.visualViewport?.removeEventListener("resize", onViewportResize);
    window.visualViewport?.removeEventListener("scroll", schedule);
    document.removeEventListener("visibilitychange", schedule);
    mobileQuery.removeEventListener("change", measure);
    reducedMotion.removeEventListener("change", schedule);
  };
}
