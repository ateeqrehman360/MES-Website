"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { mobileNavigationItems } from "@/data/site";

export function MobileNavigation() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function openMenu() {
    dialogRef.current?.showModal();
    setIsOpen(true);
  }

  function closeMenu() {
    dialogRef.current?.close();
  }

  function handleDialogClose() {
    setIsOpen(false);
    triggerRef.current?.focus();
  }

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        onClick={openMenu}
        className="site-header__menu-trigger inline-flex min-h-12 items-center gap-3 rounded-[var(--radius-control)] border border-mes-deep-green px-4 text-sm font-semibold tracking-[-0.01em] text-mes-deep-green transition-colors duration-[var(--duration-fast)] hover:bg-mes-deep-green hover:text-mes-cream"
      >
        <span
          aria-hidden="true"
          className="site-header__menu-icon grid w-5 gap-1.5"
        >
          <span className="h-px w-full bg-current" />
          <span className="h-px w-full bg-current" />
          <span className="h-px w-full bg-current" />
        </span>
        Menu
      </button>

      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        aria-label="Primary navigation"
        data-focus-surface="dark"
        onClose={handleDialogClose}
        className="fixed inset-0 z-[var(--layer-dialog)] m-0 h-dvh max-h-none w-screen max-w-none bg-mes-deep-green p-0 text-mes-cream backdrop:bg-mes-green-ink/35 open:flex open:flex-col"
      >
        <div className="site-container flex h-[var(--nav-height)] shrink-0 items-center justify-between border-b border-mes-cream/25">
          <Image
            src="/brand/mes-logo.svg"
            alt=""
            width={56}
            height={61}
            loading="eager"
            className="h-12 w-auto brightness-0 invert"
          />
          <button
            type="button"
            autoFocus
            onClick={closeMenu}
            className="inline-flex min-h-12 items-center gap-3 rounded-[var(--radius-control)] border border-mes-cream/55 px-4 text-sm font-semibold transition-colors duration-[var(--duration-fast)] hover:border-mes-gold"
          >
            <span aria-hidden="true" className="relative block size-5">
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 rotate-45 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 -rotate-45 bg-current" />
            </span>
            Close
          </button>
        </div>

        <nav
          aria-label="Mobile navigation"
          className="site-container flex min-h-0 flex-1 items-center overflow-y-auto py-8 sm:py-10"
        >
          <ul className="my-auto w-full">
            {mobileNavigationItems.map((item) => {
              const isCurrent = pathname === item.href;

              return (
                <li
                  key={item.href}
                  className="border-b border-mes-cream/20 first:border-t"
                >
                  <Link
                    href={item.href}
                    aria-current={isCurrent ? "page" : undefined}
                    onClick={closeMenu}
                    className="group flex min-h-20 items-center justify-between gap-6 py-5 font-display text-[clamp(2.5rem,12vw,4.5rem)] leading-[0.92] tracking-[-0.035em]"
                  >
                    <span className="transition-transform duration-[var(--duration-fast)] group-hover:translate-x-1">
                      {item.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`h-px transition-[width,background-color] duration-[var(--duration-fast)] ${
                        isCurrent
                          ? "w-12 bg-mes-gold"
                          : "w-6 bg-mes-cream/55 group-hover:w-12 group-hover:bg-mes-gold"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </dialog>
    </div>
  );
}
