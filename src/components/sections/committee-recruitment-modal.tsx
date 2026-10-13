"use client";

import { useRef, type RefObject } from "react";
import { useCommitteeDialog } from "./use-committee-dialog";
import styles from "./committee-recruitment.module.css";

type CommitteeRecruitmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: RefObject<HTMLElement | null>;
};

export function CommitteeRecruitmentModal({
  isOpen,
  onClose,
  triggerRef,
}: CommitteeRecruitmentModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLIFrameElement>(null);

  useCommitteeDialog(isOpen, dialogRef, closeRef, triggerRef);

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-modal="true"
      aria-labelledby="committee-application-title"
      aria-describedby="committee-application-privacy"
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
      <p id="committee-application-privacy" className={styles.privacyNotice}>
        Your application information is shared with MES when you submit the
        form. You can save your progress and return later using the same browser.
        Read our{" "}
        <a href="https://mmumes.com/privacy" target="_blank" rel="noopener noreferrer">
          privacy notice<span className={styles.srOnly}> (opens in a new tab)</span>
        </a>{" "}for details about how we handle your information.
      </p>
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
