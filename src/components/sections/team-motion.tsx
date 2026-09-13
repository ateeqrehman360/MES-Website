"use client";

import { useEffect, useRef, type ReactNode } from "react";

type AssemblyOrigin = Readonly<{
  x: number;
  y: number;
  scale: number;
  cropTop: number;
  cropRight: number;
  cropBottom: number;
  cropLeft: number;
  imageX: number;
}>;

const ASSEMBLY_ORIGINS: readonly AssemblyOrigin[] = [
  {
    x: -4.2,
    y: 2.1,
    scale: 0.97,
    cropTop: 7,
    cropRight: 48,
    cropBottom: 9,
    cropLeft: 8,
    imageX: -3.5,
  },
  {
    x: 0.4,
    y: -2.7,
    scale: 0.985,
    cropTop: 12,
    cropRight: 14,
    cropBottom: 3,
    cropLeft: 46,
    imageX: 2.5,
  },
  {
    x: 4.4,
    y: 1.5,
    scale: 0.975,
    cropTop: 5,
    cropRight: 9,
    cropBottom: 13,
    cropLeft: 50,
    imageX: 3.25,
  },
  {
    x: -2.8,
    y: 3.4,
    scale: 0.965,
    cropTop: 8,
    cropRight: 44,
    cropBottom: 5,
    cropLeft: 13,
    imageX: -2.6,
  },
  {
    x: 3.1,
    y: 3.8,
    scale: 0.97,
    cropTop: 10,
    cropRight: 11,
    cropBottom: 7,
    cropLeft: 47,
    imageX: 2.8,
  },
] as const;

const MEMBER_PROPERTIES = [
  "--team-member-x",
  "--team-member-y",
  "--team-member-scale",
  "--team-crop-top",
  "--team-crop-right",
  "--team-crop-bottom",
  "--team-crop-left",
  "--team-image-x",
  "--team-name-x",
  "--team-name-clip",
  "--team-name-opacity",
  "--team-role-y",
  "--team-role-opacity",
  "--team-rule-scale",
] as const;

function clamp(value: number, minimum = 0, maximum = 1) {
  return Math.min(maximum, Math.max(minimum, value));
}

function smoothSegment(value: number, start: number, end: number) {
  const progress = clamp((value - start) / (end - start));

  return progress * progress * (3 - 2 * progress);
}

export function TeamMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = root?.querySelector<HTMLElement>("[data-team-track]");
    const stage = root?.querySelector<HTMLElement>("[data-team-stage]");
    const members = root
      ? Array.from(root.querySelectorAll<HTMLElement>("[data-team-member]"))
      : [];

    if (!root || !track || !stage || members.length === 0) return;

    const tabletQuery = window.matchMedia("(min-width: 48rem)");
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let frame = 0;
    let start = 0;
    let travel = 1;
    let active = false;
    let desktopMotionEnabled = false;
    let mobileMotionEnabled = false;
    let disposed = false;
    let needsMeasurement = true;
    let previousProgress = -1;

    const mobileEntryObserver = new IntersectionObserver(
      (entries) => {
        if (!mobileMotionEnabled) return;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const member = entry.target as HTMLElement;
          member.dataset.teamEntered = "true";
          mobileEntryObserver.unobserve(member);
        });
      },
      { rootMargin: "0px 0px -6%", threshold: 0.08 },
    );

    const resetMemberStyles = () => {
      members.forEach((member) => {
        MEMBER_PROPERTIES.forEach((property) =>
          member.style.removeProperty(property),
        );
      });
    };

    const configureMobileMotion = () => {
      mobileMotionEnabled =
        !tabletQuery.matches && !reducedMotionQuery.matches;

      mobileEntryObserver.disconnect();
      members.forEach((member) => delete member.dataset.teamEntered);

      if (!mobileMotionEnabled) {
        delete root.dataset.teamMobileMotion;
        return;
      }

      root.dataset.teamMobileMotion = "ready";
      members.forEach((member) => mobileEntryObserver.observe(member));
    };

    const measure = () => {
      desktopMotionEnabled =
        tabletQuery.matches &&
        !reducedMotionQuery.matches &&
        window.innerHeight >= 640;
      root.dataset.teamMotion = desktopMotionEnabled ? "desktop" : "static";
      delete root.dataset.teamState;
      resetMemberStyles();
      configureMobileMotion();

      if (desktopMotionEnabled) {
        // The motion data attribute establishes the 150svh track before its
        // geometry is read, so resize-after-scroll always measures final CSS.
        void track.offsetHeight;
        const stickyInset = parseFloat(getComputedStyle(stage).top) || 0;
        start = window.scrollY + track.getBoundingClientRect().top - stickyInset;
        travel = Math.max(1, track.offsetHeight - stage.offsetHeight);
      }

      previousProgress = -1;
      needsMeasurement = false;
    };

    const update = () => {
      frame = 0;
      if (needsMeasurement) measure();
      if (!desktopMotionEnabled) return;

      const progress = clamp((window.scrollY - start) / travel);
      if (Math.abs(progress - previousProgress) < 0.0001) return;
      previousProgress = progress;

      members.forEach((member, index) => {
        const origin = ASSEMBLY_ORIGINS[index] ?? ASSEMBLY_ORIGINS[0];
        const stagger = index * 0.025;
        const assemble = smoothSegment(progress, 0.035 + stagger, 0.5 + stagger);
        const name = smoothSegment(progress, 0.3 + stagger, 0.68 + stagger);
        const role = smoothSegment(progress, 0.56 + stagger, 0.81 + stagger);
        const rule = smoothSegment(progress, 0.65 + stagger, 0.88 + stagger);
        const unresolved = 1 - assemble;

        member.style.setProperty(
          "--team-member-x",
          `${(origin.x * unresolved).toFixed(3)}vw`,
        );
        member.style.setProperty(
          "--team-member-y",
          `${(origin.y * unresolved).toFixed(3)}rem`,
        );
        member.style.setProperty(
          "--team-member-scale",
          (origin.scale + (1 - origin.scale) * assemble).toFixed(4),
        );
        member.style.setProperty(
          "--team-crop-top",
          `${(origin.cropTop * unresolved).toFixed(3)}%`,
        );
        member.style.setProperty(
          "--team-crop-right",
          `${(origin.cropRight * unresolved).toFixed(3)}%`,
        );
        member.style.setProperty(
          "--team-crop-bottom",
          `${(origin.cropBottom * unresolved).toFixed(3)}%`,
        );
        member.style.setProperty(
          "--team-crop-left",
          `${(origin.cropLeft * unresolved).toFixed(3)}%`,
        );
        member.style.setProperty(
          "--team-image-x",
          `${(origin.imageX * unresolved).toFixed(3)}%`,
        );
        member.style.setProperty(
          "--team-name-x",
          `${((index % 2 === 0 ? -1 : 1) * 1.35 * (1 - name)).toFixed(3)}rem`,
        );
        member.style.setProperty(
          "--team-name-clip",
          `${(76 * (1 - name)).toFixed(3)}%`,
        );
        member.style.setProperty(
          "--team-name-opacity",
          (0.4 + name * 0.6).toFixed(4),
        );
        member.style.setProperty(
          "--team-role-y",
          `${(0.8 * (1 - role)).toFixed(3)}rem`,
        );
        member.style.setProperty(
          "--team-role-opacity",
          role.toFixed(4),
        );
        member.style.setProperty("--team-rule-scale", rule.toFixed(4));
      });

      root.dataset.teamState = progress >= 0.9 ? "settled" : "assembling";
    };

    const schedule = () => {
      if (!frame && !disposed) frame = window.requestAnimationFrame(update);
    };
    const remeasure = () => {
      needsMeasurement = true;
      schedule();
    };
    const onScroll = () => {
      if (active && desktopMotionEnabled) schedule();
    };

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        active = entry.isIntersecting;
        if (active) remeasure();
      },
      { rootMargin: "60% 0px" },
    );
    const resizeObserver = new ResizeObserver(remeasure);

    visibilityObserver.observe(root);
    resizeObserver.observe(track);
    resizeObserver.observe(stage);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    window.addEventListener("orientationchange", remeasure);
    tabletQuery.addEventListener("change", remeasure);
    reducedMotionQuery.addEventListener("change", remeasure);
    document.fonts?.ready.then(() => {
      if (!disposed) remeasure();
    });
    remeasure();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frame);
      visibilityObserver.disconnect();
      resizeObserver.disconnect();
      mobileEntryObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      window.removeEventListener("orientationchange", remeasure);
      tabletQuery.removeEventListener("change", remeasure);
      reducedMotionQuery.removeEventListener("change", remeasure);
      resetMemberStyles();
      delete root.dataset.teamMotion;
      delete root.dataset.teamState;
      delete root.dataset.teamMobileMotion;
      members.forEach((member) => delete member.dataset.teamEntered);
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="team"
      className="team"
      aria-labelledby="team-title"
    >
      {children}
    </section>
  );
}
