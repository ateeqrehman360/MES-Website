import Image from "next/image";

type FoundationPageProps = {
  title: string;
  description: string;
};

export function FoundationPage({ title, description }: FoundationPageProps) {
  return (
    <section className="site-container grid min-h-[calc(100svh-var(--nav-height))] content-center gap-12 py-14 md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.55fr)] lg:items-center lg:gap-20">
      <div>
        <h1 className="max-w-[11ch] font-display text-[length:var(--type-display-page)] leading-[0.9] font-normal tracking-[-0.045em] text-mes-green-ink">
          {title}
        </h1>
        <p className="mt-8 max-w-[var(--measure-copy)] text-balance text-[length:var(--type-lead)] leading-relaxed tracking-[-0.02em] text-mes-green-ink/85 lg:mt-10">
          {description}
        </p>
        <div className="mt-12 flex items-center gap-4 text-sm font-medium text-mes-deep-green lg:mt-20">
          <span aria-hidden="true" className="h-px w-14 bg-mes-deep-green" />
          <span>Foundation in progress</span>
        </div>
      </div>

      <div className="hidden justify-end lg:flex" aria-hidden="true">
        <Image
          src="/brand/mes-logo.svg"
          alt=""
          width={420}
          height={458}
          priority
          className="h-auto w-[min(27vw,25rem)] opacity-90"
        />
      </div>
    </section>
  );
}
