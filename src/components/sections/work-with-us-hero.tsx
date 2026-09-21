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

        <p className="work-with-us-hero__support" data-reveal="support">
          {supportCopy}
        </p>

        <div className="work-with-us-hero__structure" aria-hidden="true">
          <span className="work-with-us-hero__structure-rule" data-reveal="rule" />
          <span className="work-with-us-hero__structure-word" data-reveal="word">
            WITH
          </span>
        </div>
      </div>
    </WorkWithUsHeroMotion>
  );
}
