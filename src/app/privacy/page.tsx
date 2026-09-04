import { FoundationPage } from "@/components/sections/foundation-page";
import { createPageMetadata } from "@/lib/metadata";

const description =
  "The final privacy notice will describe only the data and services used by the completed MES website.";

export const metadata = createPageMetadata("Privacy", description);

export default function PrivacyPage() {
  return (
    <>
      <FoundationPage title="Privacy" description={description} />
      <section
        className="site-container border-t border-mes-border py-14 md:py-20"
        aria-labelledby="asset-credits-title"
      >
        <div className="max-w-[var(--measure-copy)]">
          <h2
            id="asset-credits-title"
            className="font-[family-name:var(--font-hero-apparel)] text-4xl font-normal leading-none tracking-[-0.035em] text-mes-green-ink md:text-5xl"
          >
            Asset Credits
          </h2>
          <p className="mt-6 text-base leading-relaxed text-mes-green-ink/85">
            <a
              href="https://skfb.ly/6RVFt"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-mes-deep-green underline decoration-mes-gold decoration-1 underline-offset-4"
            >
              &quot;Laptop&quot;
              <span className="sr-only"> (opens in a new tab)</span>
            </a>{" "}
            by Aullwen is licensed under{" "}
            <a
              href="http://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-mes-deep-green underline decoration-mes-gold decoration-1 underline-offset-4"
            >
              Creative Commons Attribution 4.0.
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
