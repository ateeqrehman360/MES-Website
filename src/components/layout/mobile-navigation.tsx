"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

import { mobileNavigationItems, siteConfig } from "@/data/site";

type MenuPhase = "closed" | "opening" | "open" | "closing";

type ScrollLockSnapshot = {
  bodyOverflow: string;
  bodyPaddingRight: string;
  bodyPosition: string;
  bodyTop: string;
  bodyWidth: string;
  rootCompensation: string;
  rootOverflow: string;
  rootScrollBehavior: string;
  scrollX: number;
  scrollY: number;
};

const desktopMediaQuery = "(min-width: 64rem)";
const reducedMotionMediaQuery = "(prefers-reduced-motion: reduce)";
const closeFallbackDuration = 520;

export function MobileNavigation() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openingFrameRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const scrollLockRef = useRef<ScrollLockSnapshot | null>(null);
  const shouldReturnFocusRef = useRef(true);
  const previousPathnameRef = useRef(pathname);
  const phaseRef = useRef<MenuPhase>("closed");
  const [phase, setPhaseState] = useState<MenuPhase>("closed");

  const setPhase = useCallback((nextPhase: MenuPhase) => {
    phaseRef.current = nextPhase;
    setPhaseState(nextPhase);
  }, []);

  const clearTransitionHandles = useCallback(() => {
    if (openingFrameRef.current !== null) {
      window.cancelAnimationFrame(openingFrameRef.current);
      openingFrameRef.current = null;
    }

    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const lockBodyScroll = useCallback(() => {
    if (scrollLockRef.current) {
      return;
    }

    const root = document.documentElement;
    const body = document.body;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
    const bodyPaddingRight = Number.parseFloat(
      window.getComputedStyle(body).paddingRight,
    );

    scrollLockRef.current = {
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      rootCompensation: root.style.getPropertyValue(
        "--navigation-scrollbar-compensation",
      ),
      rootOverflow: root.style.overflow,
      rootScrollBehavior: root.style.scrollBehavior,
      scrollX,
      scrollY,
    };

    root.style.setProperty(
      "--navigation-scrollbar-compensation",
      `${scrollbarWidth}px`,
    );
    root.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.paddingRight = `${
      (Number.isFinite(bodyPaddingRight) ? bodyPaddingRight : 0) +
      scrollbarWidth
    }px`;
  }, []);

  const unlockBodyScroll = useCallback(() => {
    const snapshot = scrollLockRef.current;

    if (!snapshot) {
      return;
    }

    const root = document.documentElement;
    const body = document.body;

    scrollLockRef.current = null;
    body.style.overflow = snapshot.bodyOverflow;
    body.style.paddingRight = snapshot.bodyPaddingRight;
    body.style.position = snapshot.bodyPosition;
    body.style.top = snapshot.bodyTop;
    body.style.width = snapshot.bodyWidth;
    root.style.overflow = snapshot.rootOverflow;

    if (snapshot.rootCompensation) {
      root.style.setProperty(
        "--navigation-scrollbar-compensation",
        snapshot.rootCompensation,
      );
    } else {
      root.style.removeProperty("--navigation-scrollbar-compensation");
    }

    root.style.scrollBehavior = "auto";
    window.scrollTo(snapshot.scrollX, snapshot.scrollY);
    root.style.scrollBehavior = snapshot.rootScrollBehavior;
  }, []);

  const settleClosed = useCallback(() => {
    const wasAlreadySettled =
      phaseRef.current === "closed" && scrollLockRef.current === null;

    if (wasAlreadySettled) {
      return;
    }

    clearTransitionHandles();
    unlockBodyScroll();
    setPhase("closed");

    if (shouldReturnFocusRef.current) {
      window.requestAnimationFrame(() => {
        triggerRef.current?.focus({ preventScroll: true });
      });
    }
  }, [clearTransitionHandles, setPhase, unlockBodyScroll]);

  const completeClose = useCallback(() => {
    const dialog = dialogRef.current;

    if (dialog?.open) {
      dialog.close();
    }

    settleClosed();
  }, [settleClosed]);

  const closeMenu = useCallback(
    ({
      immediate = false,
      returnFocus = true,
    }: {
      immediate?: boolean;
      returnFocus?: boolean;
    } = {}) => {
      if (phaseRef.current === "closed") {
        return;
      }

      shouldReturnFocusRef.current = returnFocus;

      if (
        immediate ||
        window.matchMedia(reducedMotionMediaQuery).matches
      ) {
        clearTransitionHandles();
        completeClose();
        return;
      }

      if (phaseRef.current === "closing") {
        return;
      }

      clearTransitionHandles();
      setPhase("closing");
      closeTimerRef.current = window.setTimeout(
        completeClose,
        closeFallbackDuration,
      );
    },
    [clearTransitionHandles, completeClose, setPhase],
  );

  const openMenu = useCallback(() => {
    const dialog = dialogRef.current;

    if (!dialog || dialog.open || phaseRef.current !== "closed") {
      return;
    }

    shouldReturnFocusRef.current = true;
    dialog.showModal();
    lockBodyScroll();
    setPhase("opening");

    const resolveOpenState = () => {
      setPhase("open");
      closeButtonRef.current?.focus({ preventScroll: true });
    };

    if (window.matchMedia(reducedMotionMediaQuery).matches) {
      resolveOpenState();
      return;
    }

    openingFrameRef.current = window.requestAnimationFrame(() => {
      openingFrameRef.current = window.requestAnimationFrame(() => {
        openingFrameRef.current = null;
        resolveOpenState();
      });
    });
  }, [lockBodyScroll, setPhase]);

  const handleNavigation = useCallback(
    (targetPath: string) => {
      closeMenu({
        immediate: true,
        returnFocus: pathname === targetPath,
      });
    },
    [closeMenu, pathname],
  );

  const handleDialogKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDialogElement>) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const dialog = dialogRef.current;

      if (!dialog) {
        return;
      }

      const focusableElements = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(
        (element) => element.tabIndex >= 0 && element.getClientRects().length > 0,
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    },
    [closeMenu],
  );

  useEffect(() => {
    const desktopQuery = window.matchMedia(desktopMediaQuery);
    const handleDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches && phaseRef.current !== "closed") {
        closeMenu({ immediate: true, returnFocus: false });
      }
    };

    desktopQuery.addEventListener("change", handleDesktopChange);

    return () => {
      desktopQuery.removeEventListener("change", handleDesktopChange);
    };
  }, [closeMenu]);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) {
      return;
    }

    previousPathnameRef.current = pathname;
    closeMenu({ immediate: true, returnFocus: false });

    const focusFrame = window.requestAnimationFrame(() => {
      document
        .getElementById("main-content")
        ?.focus({ preventScroll: true });
    });

    return () => {
      window.cancelAnimationFrame(focusFrame);
    };
  }, [closeMenu, pathname]);

  useEffect(() => {
    const dialog = dialogRef.current;

    return () => {
      shouldReturnFocusRef.current = false;
      clearTransitionHandles();

      if (dialog?.open) {
        dialog.close();
      }

      unlockBodyScroll();
    };
  }, [clearTransitionHandles, unlockBodyScroll]);

  const menuIsActive = phase !== "closed";

  return (
    <div className="site-header__mobile-navigation">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={menuIsActive}
        aria-controls="mobile-navigation"
        onClick={openMenu}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openMenu();
          }
        }}
        className="site-header__menu-trigger"
      >
        <span aria-hidden="true" className="site-header__menu-icon">
          <span />
          <span />
        </span>
        <span>Menu</span>
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        aria-labelledby="mobile-navigation-title"
        data-state={phase}
        onCancel={(event) => {
          event.preventDefault();
          closeMenu();
        }}
        onClose={settleClosed}
        onKeyDown={handleDialogKeyDown}
        className="mobile-navigation"
      >
        <div
          ref={surfaceRef}
          data-focus-surface="dark"
          className="mobile-navigation__surface"
          onTransitionEnd={(event) => {
            if (
              phaseRef.current === "closing" &&
              event.target === surfaceRef.current &&
              event.propertyName === "clip-path"
            ) {
              completeClose();
            }
          }}
        >
          <div className="mobile-navigation__frame">
            <div className="mobile-navigation__topbar">
              <Link
                href="/"
                aria-label="Muslim Entrepreneurs home"
                onClick={() => handleNavigation("/")}
                className="mobile-navigation__brand"
              >
                <Image
                  src="/brand/mes-logo.svg"
                  alt=""
                  width={56}
                  height={61}
                  loading="eager"
                  className="mobile-navigation__brand-mark"
                />
                <span aria-hidden="true" className="mobile-navigation__brand-mes">
                  MES
                </span>
                <span
                  aria-hidden="true"
                  className="mobile-navigation__brand-name"
                >
                  Muslim Entrepreneurs
                  <br />
                  Society
                </span>
              </Link>

              <button
                ref={closeButtonRef}
                type="button"
                autoFocus
                aria-label="Close menu"
                onClick={() => closeMenu()}
                className="mobile-navigation__close"
              >
                <span aria-hidden="true" />
                <span aria-hidden="true" />
              </button>
            </div>

            <div className="mobile-navigation__layout">
              <h2 id="mobile-navigation-title" className="sr-only">
                Site navigation
              </h2>

              <nav aria-label="Primary navigation" className="mobile-navigation__nav">
                <ol className="mobile-navigation__links">
                  {mobileNavigationItems.map((item, index) => {
                    const isCurrent = pathname === item.href;
                    const isPriority = item.href === "/work-with-us";

                    return (
                      <li
                        key={item.href}
                        className="mobile-navigation__item"
                        data-priority={isPriority ? "true" : undefined}
                      >
                        <Link
                          href={item.href}
                          aria-current={isCurrent ? "page" : undefined}
                          onClick={() => handleNavigation(item.href)}
                          className="mobile-navigation__link"
                        >
                          <span
                            aria-hidden="true"
                            className="mobile-navigation__index"
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="mobile-navigation__label">
                            {item.label}
                          </span>
                          <span
                            aria-hidden="true"
                            className="mobile-navigation__link-rule"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <div className="mobile-navigation__context">
                <div>
                  <p>{siteConfig.name} Society</p>
                  <p>Manchester Metropolitan University</p>
                </div>
                <a
                  href={`mailto:${siteConfig.email}`}
                  onClick={() => closeMenu({ immediate: true })}
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}
