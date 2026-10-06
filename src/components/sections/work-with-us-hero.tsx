import { WorkWithUsHeroMotion } from "./work-with-us-hero-motion";

const supportCopy =
  "MES works with businesses, founders, speakers and organisations to create meaningful events, conversations and opportunities for Muslim students.";

export function WorkWithUsHero() {
  return (
    <WorkWithUsHeroMotion>
      <div className="work-with-us-hero__inner site-container">
        <p className="work-with-us-hero__label" data-reveal="label">
          <span aria-hidden="true" className="work-with-us-hero__label-rule" />
          Work with us
        </p>

        <h1 id="work-with-us-hero-title" className="work-with-us-hero__title">
          <span className="sr-only">
            Let&apos;s create something worth showing up for.
          </span>
          <span className="work-with-us-hero__title-layout" aria-hidden="true">
            <span className="work-with-us-hero__title-line" data-reveal="title">
              Let&apos;s create
            </span>
            <span className="work-with-us-hero__title-line" data-reveal="title">
              something worth
            </span>
            <span className="work-with-us-hero__title-line" data-reveal="title">
              showing up for.
            </span>
          </span>
        </h1>

        <div className="work-with-us-hero__support-area">
          <p className="work-with-us-hero__support" data-reveal="support">
            {supportCopy}
          </p>
          <a
            className="work-with-us-hero__cta"
            data-reveal="cta"
            href="mailto:mmu.mes@outlook.com?subject=Collaboration%20enquiry%20%E2%80%94%20MES&body=Hi%20MES%2C%0A%0AI%E2%80%99d%20like%20to%20discuss%20a%20potential%20collaboration.%0A%0AName%3A%0AOrganisation%3A%0AIdea%20%2F%20opportunity%3A"
          >
            Propose a collaboration <span aria-hidden="true">→</span>
          </a>
        </div>

        <div className="work-with-us-hero__structure" aria-hidden="true">
          <span className="work-with-us-hero__structure-rule" data-reveal="rule" />
        </div>
      </div>
    </WorkWithUsHeroMotion>
  );
}
