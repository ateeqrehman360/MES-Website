// Mobile has a single-column layout with reserved image aspect ratios. Use its
// untransformed layout offsets once, rather than Safari viewport rectangles.
type Point = { x: number; y: number };

let nextRevealId = 0;

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

export function setupMobileJourney(stage: HTMLDivElement) {
  const svg = stage.querySelector<SVGSVGElement>("[data-journey-svg]");
  const base = stage.querySelector<SVGPathElement>("[data-journey-path-base]");
  const drawn = stage.querySelector<SVGPathElement>("[data-journey-path-progress]");
  const nodes = Array.from(
    stage.querySelectorAll<HTMLElement>("[data-journey-node]"),
  );
  const ending = stage.querySelector<HTMLElement>("[data-journey-ending]");
  if (!svg || !base || !drawn || !ending || !nodes.length) return;

  // Only mobile replaces the shared markup's normalized dash stroke. Restore
  // every override on cleanup so crossing the desktop breakpoint is unchanged.
  const originalSvgAttributes = ["width", "height", "viewBox", "style"].map(
    (name) => [name, svg.getAttribute(name)] as const,
  );
  const originalProgressAttributes = [
    "pathLength",
    "stroke-dasharray",
    "stroke-dashoffset",
    "clip-path",
    "style",
  ].map((name) => [name, drawn.getAttribute(name)] as const);
  const namespace = "http://www.w3.org/2000/svg";
  const defs = document.createElementNS(namespace, "defs");
  const clip = document.createElementNS(namespace, "clipPath");
  const reveal = document.createElementNS(namespace, "rect");
  const strokePadding = 2;
  clip.id = `journey-mobile-reveal-${++nextRevealId}`;
  clip.setAttribute("clipPathUnits", "userSpaceOnUse");
  reveal.setAttribute("x", `${-strokePadding}`);
  reveal.setAttribute("y", `${-strokePadding}`);
  reveal.setAttribute("height", "0");
  clip.append(reveal);
  defs.append(clip);
  svg.prepend(defs);
  drawn.removeAttribute("pathLength");
  drawn.removeAttribute("stroke-dasharray");
  drawn.removeAttribute("stroke-dashoffset");
  drawn.style.strokeDasharray = "none";
  drawn.style.removeProperty("stroke-dashoffset");
  drawn.style.willChange = "auto";
  drawn.setAttribute("clip-path", `url(#${clip.id})`);

  const milestones = nodes.map((node) =>
    node.closest<HTMLElement>("[data-journey-milestone]"),
  );
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  let disposed = false;
  let measuredWidth = 0;
  let layoutReady = false;
  let height = 1;
  let readingHeight = 0;
  let points: Point[] = [];

  const update = () => {
    frame = 0;
    if (!points.length || disposed) return;
    // Keep the reading anchor independent of browser-bar height changes. One
    // live stage rectangle accounts for scrolling and upstream layout shifts.
    const stageTop = stage.getBoundingClientRect().top;
    const revealedY = Math.max(
      0,
      Math.min(height, readingHeight * 0.66 - stageTop),
    );
    const visibleY = reducedMotion.matches ? height : revealedY;
    // The route is monotonic in Y. Both strokes stay solid and static; only the
    // user-space clip's lower edge follows scrolling. Padding keeps round caps
    // intact at the start/end without scaling or repositioning the SVG.
    reveal.setAttribute(
      "height",
      visibleY === 0
        ? "0"
        : `${visibleY + strokePadding + (visibleY === height ? strokePadding : 0)}`,
    );
    const motion = reducedMotion.matches ? "static" : "enabled";
    if (stage.dataset.journeyMotion !== motion) {
      stage.dataset.journeyMotion = motion;
    }
    let active = -1;
    points.forEach((point, index) => {
      if (point.y <= revealedY) active = index;
    });
    milestones.forEach((milestone, index) => {
      if (!milestone) return;
      const state = reducedMotion.matches
        ? "visible"
        : index < active
          ? "complete"
          : index === active
            ? "active"
            : "upcoming";
      if (milestone.dataset.journeyState !== state) {
        milestone.dataset.journeyState = state;
      }
    });
  };
  const schedule = () => {
    if (!frame && !disposed) frame = requestAnimationFrame(update);
  };

  const measure = () => {
    if (disposed) return;
    measuredWidth = stage.clientWidth;
    height = stage.offsetHeight;
    // A small-viewport reading anchor doesn't move as browser bars collapse.
    // It is renewed only for real width/orientation changes, like the geometry.
    const viewport = document.createElement("div");
    viewport.style.cssText =
      "position:fixed;height:100svh;width:0;visibility:hidden;pointer-events:none";
    document.body.append(viewport);
    readingHeight =
      viewport.offsetHeight || document.documentElement.clientHeight;
    viewport.remove();
    points = nodes.map((node) => offsetWithin(node, stage));
    const end = offsetWithin(ending, stage);
    const route = [
      { x: points[0].x, y: 0 },
      ...points,
      end,
      { x: end.x, y: height },
    ];
    const path = route.slice(1).reduce((data, point, index) => {
      const previous = route[index];
      const middle = (previous.y + point.y) / 2;
      return `${data} C ${previous.x} ${middle}, ${point.x} ${middle}, ${point.x} ${point.y}`;
    }, `M ${route[0].x} 0`);
    // Lock CSS and SVG viewport dimensions to the same cached local units.
    svg.setAttribute("width", `${measuredWidth}`);
    svg.setAttribute("height", `${height}`);
    svg.setAttribute("viewBox", `0 0 ${measuredWidth} ${height}`);
    svg.style.width = `${measuredWidth}px`;
    svg.style.height = `${height}px`;
    reveal.setAttribute("width", `${measuredWidth + strokePadding * 2}`);
    base.setAttribute("d", path);
    drawn.setAttribute("d", path);
    schedule();
  };

  // Font loading is the only unreserved initial layout input. Paint the path
  // after it settles, so a partially initialised route is never shown.
  void document.fonts.ready.then(() => {
    if (disposed) return;
    layoutReady = true;
    measure();
  });
  const onResize = () => {
    if (layoutReady && stage.clientWidth !== measuredWidth) measure();
    schedule();
  };
  const observer = new ResizeObserver(onResize);
  observer.observe(stage);
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", onResize);
  window.visualViewport?.addEventListener("resize", schedule);
  window.visualViewport?.addEventListener("scroll", schedule);
  reducedMotion.addEventListener("change", schedule);
  return () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", onResize);
    window.visualViewport?.removeEventListener("resize", schedule);
    window.visualViewport?.removeEventListener("scroll", schedule);
    reducedMotion.removeEventListener("change", schedule);
    defs.remove();
    originalSvgAttributes.forEach(([name, value]) => {
      if (value === null) svg.removeAttribute(name);
      else svg.setAttribute(name, value);
    });
    originalProgressAttributes.forEach(([name, value]) => {
      if (value === null) drawn.removeAttribute(name);
      else drawn.setAttribute(name, value);
    });
    base.removeAttribute("d");
    drawn.removeAttribute("d");
  };
}
