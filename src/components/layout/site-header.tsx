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
          className="site-header__desktop-navigation ml-auto"
        >
          <ul className="site-header__desktop-navigation-list">
            {primaryNavigationItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="site-header__nav-link">
                  {item.label}
                </Link>
              </li>
            ))}

            <li className="site-header__desktop-cta-item">
              <Link href="/work-with-us" className="site-header__cta">
                Work With Us
              </Link>
            </li>
          </ul>
        </nav>

        <MobileNavigation />
      </div>
    </header>
  );
}
