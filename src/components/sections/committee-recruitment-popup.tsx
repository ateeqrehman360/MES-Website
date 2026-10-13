"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";
import { useCommitteeDialog } from "./use-committee-dialog";
import styles from "./committee-recruitment.module.css";

const exitDuration = 180;
type PopupProps = {
  triggerRef: RefObject<HTMLElement | null>;
  onDismiss: () => void;
  onApply: () => void;
};

export function CommitteeRecruitmentPopup({ triggerRef, onDismiss, onApply }: PopupProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const exitTimerRef = useRef<number | null>(null);
  useCommitteeDialog(true, dialogRef, closeRef, triggerRef);

  const finish = useCallback(
    (apply: boolean) => {
      if (exitTimerRef.current !== null) return;
      const next = apply ? onApply : onDismiss;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        next();
        return;
      }
      if (dialogRef.current) dialogRef.current.dataset.closing = "true";
      exitTimerRef.current = window.setTimeout(next, exitDuration);
    },
    [onApply, onDismiss],
  );

  useEffect(() => () => {
    if (exitTimerRef.current !== null) window.clearTimeout(exitTimerRef.current);
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className={styles.popup}
      aria-modal="true"
      aria-labelledby="committee-invitation-title"
      aria-describedby="committee-invitation-copy committee-invitation-deadline"
      onCancel={(event) => {
        event.preventDefault();
        finish(false);
      }}
    >
      <div className={styles.popupToolbar}>
        <span className={styles.popupRule} aria-hidden="true" />
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          aria-label="Close committee recruitment invitation"
          onClick={() => finish(false)}
        >
          <span>Close</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
      <div className={styles.popupContent}>
        <p className={styles.popupEyebrow}>MES COMMITTEE · 2026/27</p>
        <h2 id="committee-invitation-title" className={styles.popupHeading}>
          HELP BUILD WHAT COMES NEXT.
        </h2>
        <div id="committee-invitation-copy" className={styles.popupCopy}>
          <p>
            We&apos;re recruiting students to join our Operations, Events and
            Publicity teams.
          </p>
          <p>
            Gain experience, develop your skills and help shape the future of MES.
          </p>
        </div>
        <p id="committee-invitation-deadline" className={styles.popupDeadline}>
          APPLICATIONS CLOSE <time dateTime="2026-10-27">27 OCTOBER</time>
        </p>
        <div className={styles.popupActions}>
          <button
            type="button"
            className={`${styles.cta} ${styles.popupApply}`}
            aria-haspopup="dialog"
            onClick={() => finish(true)}
          >
            <span>APPLY NOW</span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </button>
          <button
            type="button"
            className={styles.popupLater}
            onClick={() => finish(false)}
          >
            MAYBE LATER
          </button>
        </div>
      </div>
    </dialog>
  );
}
