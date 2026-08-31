"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function HomeContent({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // The production hero retains ownership until the new content reaches
    // the top. Observing a top-edge strip also handles large scroll jumps.
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      observer = new IntersectionObserver(
        ([intersection]) => {
          root.dataset.contentNavigation = intersection.isIntersecting
            ? "visible"
            : "hidden";
        },
        { rootMargin: `0px 0px -${window.innerHeight - 1}px 0px` },
      );
      observer.observe(root);
    };

    observe();
    window.addEventListener("resize", observe);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", observe);
    };
  }, []);

  return (
    <div ref={rootRef} className="home-content">
      {children}
    </div>
  );
}
