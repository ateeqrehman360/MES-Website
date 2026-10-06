"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CommitteeRecruitmentModal } from "./committee-recruitment-modal";
import styles from "./committee-recruitment.module.css";

export function CommitteeRecruitmentCta() {
  const tierRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const closeApplication = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const tier = tierRef.current;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (!tier || preference.matches || !("IntersectionObserver" in window)) {
      return;
    }

    // The resting content is server-rendered and visible; motion is additive.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          tier.dataset.recruitmentRevealed = "true";
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8%", threshold: 0 },
    );
    observer.observe(tier);

    const stopMotion = () => {
      if (preference.matches) {
        observer.disconnect();
        delete tier.dataset.recruitmentRevealed;
      }
    };
    preference.addEventListener("change", stopMotion);

    return () => {
      observer.disconnect();
      preference.removeEventListener("change", stopMotion);
    };
  }, []);

  return (
    <div ref={tierRef} className={styles.tier}>
      <div className={styles.divider} aria-hidden="true" />
      <p className={styles.label}>Committee recruitment · 2026/27</p>
      <div className={styles.composition}>
        <h3 className={styles.heading}>Want to help build what comes next?</h3>
        <div className={styles.invitation}>
          <p className={styles.copy}>
            Applications are open for students to join our Operations, Events and
            Publicity teams.
          </p>
          <a
            ref={triggerRef}
            className={styles.cta}
            href="https://tally.so/r/ob4kAb"
            aria-haspopup="dialog"
            onClick={(event) => {
              // Preserve modified clicks and the link when dialog isn't supported.
              if (
                event.metaKey ||
                event.ctrlKey ||
                event.shiftKey ||
                event.altKey ||
                typeof HTMLDialogElement === "undefined" ||
                !("showModal" in HTMLDialogElement.prototype)
              ) {
                return;
              }

              event.preventDefault();
              setIsOpen(true);
            }}
          >
            <span>Apply to join the MES committee</span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </a>
        </div>
      </div>
      <CommitteeRecruitmentModal
        isOpen={isOpen}
        onClose={closeApplication}
        triggerRef={triggerRef}
      />
    </div>
  );
}
