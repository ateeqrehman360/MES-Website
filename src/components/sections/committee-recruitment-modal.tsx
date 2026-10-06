"use client";

import { useEffect, useRef, type RefObject } from "react";
import styles from "./committee-recruitment.module.css";

type CommitteeRecruitmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLAnchorElement | null>;
};

export function CommitteeRecruitmentModal({
  isOpen,
  onClose,
  triggerRef,
}: CommitteeRecruitmentModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!isOpen || !dialog) {
      return;
    }

    const body = document.body;
    const root = document.documentElement;
    const trigger = triggerRef.current;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
    const paddingRight = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;
    const previousBody = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
      paddingRight: body.style.paddingRight,
    };
    const previousRootOverflow = root.style.overflow;
    const previousScrollBehavior = root.style.scrollBehavior;

    // Fixed-body locking also prevents background touch scrolling on iOS Safari.
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = `-${scrollX}px`;
    body.style.width = "100%";
    body.style.paddingRight = `${paddingRight + scrollbarWidth}px`;

    // The native top layer makes background content inert. Focus guards below
    // also wrap Tab at the cross-origin iframe's browsing-context boundaries.
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      Object.assign(body.style, previousBody);
      root.style.overflow = previousRootOverflow;
      root.style.scrollBehavior = "auto";
      window.scrollTo(scrollX, scrollY);
      root.style.scrollBehavior = previousScrollBehavior;
      trigger?.focus({ preventScroll: true });
    };
  }, [isOpen, triggerRef]);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-modal="true"
      aria-labelledby="committee-application-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) {
          return;
        }

        const bounds = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < bounds.left ||
          event.clientX > bounds.right ||
          event.clientY < bounds.top ||
          event.clientY > bounds.bottom
        ) {
          onClose();
        }
      }}
    >
      <h2 id="committee-application-title" className={styles.srOnly}>
        MES committee application · 2026/27
      </h2>
      <span
        className={styles.srOnly}
        tabIndex={0}
        data-focus-guard
        onFocus={() => formRef.current?.focus()}
      />
      <div className={styles.toolbar}>
        <button
          ref={closeRef}
          type="button"
          className={styles.close}
          aria-label="Close committee application"
          onClick={onClose}
        >
          <span>Close</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m4 4 8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
      {isOpen && (
        <iframe
          ref={formRef}
          className={styles.form}
          src="https://tally.so/embed/ob4kAb?transparentBackground=1"
          title="MES committee recruitment application form, 2026/27"
        />
      )}
      <span
        className={styles.srOnly}
        tabIndex={0}
        data-focus-guard
        onFocus={() => closeRef.current?.focus({ preventScroll: true })}
      />
    </dialog>
  );
}
