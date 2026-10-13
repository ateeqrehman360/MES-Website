"use client";

import { useEffect, type RefObject } from "react";

// Shared by the invitation and the existing application. Only one is active at
// a time; its cleanup runs before the next dialog acquires the scroll lock.
export function useCommitteeDialog(
  isOpen: boolean,
  dialogRef: RefObject<HTMLDialogElement | null>,
  closeRef: RefObject<HTMLButtonElement | null>,
  triggerRef: RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!isOpen || !dialog) return;

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

    // Fixed-body locking prevents background touch scrolling on iOS Safari.
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = `-${scrollX}px`;
    body.style.width = "100%";
    body.style.paddingRight = `${paddingRight + scrollbarWidth}px`;
    dialog.showModal();
    closeRef.current?.focus({ preventScroll: true });

    return () => {
      dialog.close();
      Object.assign(body.style, previousBody);
      root.style.overflow = previousRootOverflow;
      root.style.scrollBehavior = "auto";
      window.scrollTo(scrollX, scrollY);
      root.style.scrollBehavior = previousScrollBehavior;
      // Navigation can remove a CTA. Never focus a detached element.
      const destination = trigger?.isConnected
        ? trigger
        : document.getElementById("main-content");
      destination?.focus({ preventScroll: true });
    };
  }, [isOpen, dialogRef, closeRef, triggerRef]);
}
