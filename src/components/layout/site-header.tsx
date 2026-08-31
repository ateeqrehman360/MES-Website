import Image from "next/image";
import Link from "next/link";

import { primaryNavigationItems } from "@/data/site";

import { MobileNavigation } from "./mobile-navigation";

export function SiteHeader() {
  return (
    <header className="site-header sticky top-0 z-[var(--layer-navigation)] h-[var(--nav-height)] border-b border-mes-border bg-mes-cream transition-[background-color,border-color] duration-[var(--duration-base)]">
      <div className="site-container flex h-full items-center justify-between gap-8">
        <Link
          href="/"
          aria-label="Muslim Entrepreneurs home"
          className="site-header__brand flex min-h-12 min-w-12 items-center gap-3"
        >
          <Image
            src="/brand/mes-logo.svg"
            alt=""
            width={56}
            height={61}
            crossOrigin="anonymous"
            priority
            className="site-header__brand-mark h-12 w-auto shrink-0 lg:h-14"
          />

          <span
            className="site-header__brand-lockup hidden items-center lg:flex"
            aria-hidden="true"
          >
            <span className="site-header__brand-abbreviation">
              MES
            </span>

            <span className="site-header__brand-rule ml-5 mr-4 hidden h-10 w-px bg-mes-gold/70 xl:block" />

            <span className="site-header__brand-name hidden font-[family-name:var(--font-hero-kommon)] text-[0.7rem] font-normal uppercase leading-[1.15] tracking-[0.08em] text-mes-deep-green xl:block">
              Muslim
              <br />
              Entrepreneurs
              <br />
              Society
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="ml-auto hidden items-center gap-7 lg:flex xl:gap-10"
        >
          {primaryNavigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="border-b border-transparent py-3 text-sm font-medium tracking-[-0.01em] text-mes-green-ink transition-colors duration-[var(--duration-fast)] hover:border-mes-gold hover:text-mes-deep-green"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/work-with-us"
          className="site-header__cta hidden min-h-12 items-center justify-center rounded-[var(--radius-control)] bg-mes-deep-green px-6 text-sm font-semibold text-mes-cream transition-colors duration-[var(--duration-fast)] hover:bg-mes-green-ink lg:inline-flex"
        >
          Work With Us
        </Link>

        <MobileNavigation />
      </div>
    </header>
  );
}