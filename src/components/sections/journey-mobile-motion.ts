// Mobile has a single-column layout with reserved image aspect ratios. Use its
// untransformed layout offsets once, rather than Safari viewport rectangles.
type Point = { x: number; y: number };

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
  let lookup: { y: number; length: number }[] = [];
  let pathLength = 1;

  const update = () => {
    frame = 0;
    if (!lookup.length || disposed) return;
    // Geometry stays in stage-local coordinates. Only this one live rectangle
    // follows Safari's scroll coordinate system and upstream layout movement.
    const stageTop = stage.getBoundingClientRect().top;
    const revealedY = Math.max(
      0, Math.min(height, readingHeight * 0.66 - stageTop),
    );
    let lower = 0;
    let upper = lookup.length - 1;
    while (upper - lower > 1) {
      const middle = Math.floor((lower + upper) / 2);
      if (lookup[middle].y < revealedY) lower = middle;
      else upper = middle;
    }
    const before = lookup[lower];
    const after = lookup[upper];
    const fraction = Math.max(0, Math.min(1,
      (revealedY - before.y) / Math.max(1, after.y - before.y),
    ));
    const length = before.length + (after.length - before.length) * fraction;
    drawn.style.strokeDashoffset = reducedMotion.matches
      ? "0" : (1 - length / pathLength).toFixed(5);
    stage.dataset.journeyMotion = reducedMotion.matches ? "static" : "enabled";
    let active = -1;
    points.forEach((point, index) => {
      if (point.y <= revealedY) active = index;
    });
    milestones.forEach((milestone, index) => {
      if (!milestone) return;
      milestone.dataset.journeyState = reducedMotion.matches
        ? "visible"
        : index < active ? "complete" : index === active ? "active" : "upcoming";
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
    viewport.style.cssText = "position:fixed;height:100svh;width:0;visibility:hidden;pointer-events:none";
    document.body.append(viewport);
    readingHeight = viewport.offsetHeight || document.documentElement.clientHeight;
    viewport.remove();
    points = nodes.map((node) => offsetWithin(node, stage));
    const end = offsetWithin(ending, stage);
    const route = [
      { x: points[0].x, y: 0 }, ...points, end, { x: end.x, y: height },
    ];
    const path = route.slice(1).reduce((data, point, index) => {
      const previous = route[index];
      const middle = (previous.y + point.y) / 2;
      return `${data} C ${previous.x} ${middle}, ${point.x} ${middle}, ${point.x} ${point.y}`;
    }, `M ${route[0].x} 0`);
    svg.setAttribute("viewBox", `0 0 ${measuredWidth} ${height}`);
    svg.style.height = `${height}px`;
    base.setAttribute("d", path);
    drawn.setAttribute("d", path);
    pathLength = drawn.getTotalLength();
    const count = Math.ceil(pathLength / 8);
    lookup = Array.from({ length: count + 1 }, (_, index) => {
      const length = pathLength * index / count;
      return { y: drawn.getPointAtLength(length).y, length };
    });
    schedule();
  };

  // Font loading is the only unreserved initial layout input. Paint the path
  // after it settles, so a partially initialised route is never shown.
  void document.fonts.ready.then(() => {
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
    base.removeAttribute("d");
    drawn.removeAttribute("d");
  };
}
