import Image from "next/image";

const aboutCopy =
  "Founded in 2024, MES is the Muslim Entrepreneurs Society at Manchester Metropolitan University — bringing together aspiring founders, professionals and businesses to learn, connect and build.";

export function AboutHero() {
  return (
    <section className="about-hero" aria-labelledby="about-hero-title">
      <div className="site-container about-hero__inner">
        <p className="about-hero__eyebrow">About MES</p>

        <h1 id="about-hero-title" className="about-hero__title">
          <span className="sr-only">
            Built to help Muslim ambition go further.
          </span>
          <span className="about-hero__title-layout" aria-hidden="true">
            <span className="about-hero__title-line">Built to help</span>
            <span className="about-hero__title-line about-hero__title-line--accent">
              Muslim ambition
            </span>
            <span className="about-hero__title-line">go further.</span>
          </span>
        </h1>

        <figure className="about-hero__media">
          <Image
            src="/hero/ramadhan-bazaar-crowd.webp"
            alt="Visitors browsing independent businesses at the MES Ramadhan Bazaar."
            width={900}
            height={1600}
            sizes="(min-width: 64rem) 26vw, (min-width: 48rem) 30vw, 72vw"
            loading="eager"
            fetchPriority="high"
            className="about-hero__image"
          />
        </figure>

        <p className="about-hero__support">{aboutCopy}</p>

        <div className="about-hero__journey-cue" aria-label="Next section: Our journey">
          <span className="about-hero__journey-rule" aria-hidden="true" />
          <span>Our journey</span>
        </div>
      </div>
    </section>
  );
}
