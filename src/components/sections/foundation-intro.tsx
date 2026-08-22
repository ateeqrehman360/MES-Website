import Image from "next/image";

import { siteConfig } from "@/data/site";

export function FoundationIntro() {
  return (
    <section className="site-container grid min-h-[calc(100svh-var(--nav-height))] content-center gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:items-center lg:gap-16 lg:py-20">
      <div className="relative z-10">
        <h1 className="max-w-[8.5ch] font-display text-[length:var(--type-display-home)] leading-[0.86] font-normal tracking-[-0.045em] text-mes-green-ink">
          Muslim Entrepreneurs
        </h1>
        <p className="mt-8 max-w-[var(--measure-intro)] text-balance text-[length:var(--type-lead)] leading-relaxed font-medium tracking-[-0.02em] text-mes-green-ink lg:mt-10">
          {siteConfig.description}
        </p>
        <div className="mt-10 flex items-center gap-4 text-sm font-medium text-mes-deep-green lg:mt-20">
          <span aria-hidden="true" className="h-px w-14 bg-mes-deep-green" />
          <span>Foundation in progress</span>
        </div>
      </div>

      <div className="flex justify-end lg:justify-center" aria-hidden="true">
        <Image
          src="/brand/mes-logo.svg"
          alt=""
          width={560}
          height={610}
          priority
          className="h-auto w-[min(66vw,17rem)] lg:w-[min(35vw,35rem)]"
        />
      </div>
    </section>
  );
}
