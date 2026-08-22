import Image from "next/image";
import Link from "next/link";

import { primaryNavigationItems } from "@/data/site";

import { MobileNavigation } from "./mobile-navigation";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-[var(--layer-navigation)] h-[var(--nav-height)] border-b border-mes-border bg-mes-cream">
      <div className="site-container flex h-full items-center justify-between gap-8">
        <Link
          href="/"
          aria-label="Muslim Entrepreneurs home"
          className="flex min-h-12 min-w-12 items-center"
        >
          <Image
            src="/brand/mes-logo.svg"
            alt=""
            width={56}
            height={61}
            priority
            className="h-12 w-auto lg:h-14"
          />
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
          className="hidden min-h-12 items-center justify-center rounded-[var(--radius-control)] bg-mes-deep-green px-6 text-sm font-semibold text-mes-cream transition-colors duration-[var(--duration-fast)] hover:bg-mes-green-ink lg:inline-flex"
        >
          Work With Us
        </Link>

        <MobileNavigation />
      </div>
    </header>
  );
}
