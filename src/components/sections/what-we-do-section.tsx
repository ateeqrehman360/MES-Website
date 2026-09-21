import { WhatWeDoMotion } from "./what-we-do-motion";

const pillars = [
  {
    id: "learn",
    number: "01",
    word: "LEARN",
    statement: "Learn from people building in the real world.",
    description:
      "MES brings Muslim founders, professionals and industry voices into the university environment — giving students access to practical insight, honest conversations and ideas they can apply beyond the room.",
  },
  {
    id: "connect",
    number: "02",
    word: "CONNECT",
    statement: "Meet people worth building with.",
    description:
      "MES brings together ambitious students, entrepreneurs, businesses and organisations across Manchester, creating relationships that can become the starting point for ideas, opportunities and collaborations.",
  },
  {
    id: "build",
    number: "03",
    word: "BUILD",
    statement: "Turn ambition into something tangible.",
    description:
      "MES encourages students to move beyond consuming ideas and start putting them into practice — supporting Muslim businesses, creating opportunities and building things together.",
  },
] as const;

function PillarWord({ word }: { word: string }) {
  return (
    <h3 className="what-we-do__word">
      <span className="sr-only">{word}</span>
      <span
        className="what-we-do__word-letters"
        data-what-we-do-word={word.toLowerCase()}
        aria-hidden="true"
      >
        {[...word].map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className="what-we-do__letter"
            data-what-we-do-letter
          >
            {letter}
          </span>
        ))}
      </span>
    </h3>
  );
}

export function WhatWeDoSection() {
  return (
    <WhatWeDoMotion>
      <header className="what-we-do__intro site-container">
        <p className="what-we-do__label">What we do</p>
        <h2 id="what-we-do-title" className="what-we-do__title">
          We create the spaces where Muslim ambition can move forward.
        </h2>
        <p className="what-we-do__introduction">
          Through events, conversations and opportunities to get involved, MES
          helps students learn from people doing the work, connect with the right
          people and start building for themselves.
        </p>
      </header>

      <div className="what-we-do__track" data-what-we-do-track>
        <div className="what-we-do__stage" data-what-we-do-stage>
          <span
            className="what-we-do__surface what-we-do__surface--connect"
            aria-hidden="true"
          />
          <span
            className="what-we-do__surface what-we-do__surface--build"
            aria-hidden="true"
          />

          {pillars.map((pillar) => (
            <article
              key={pillar.id}
              className={`what-we-do__chapter what-we-do__chapter--${pillar.id}`}
              data-what-we-do-chapter={pillar.id}
              aria-labelledby={`what-we-do-${pillar.id}-title`}
            >
              <div className="what-we-do__chapter-grid site-container">
                <p className="what-we-do__counter" aria-hidden="true">
                  <span>{pillar.number}</span>
                  <span className="what-we-do__counter-rule" />
                  <span>03</span>
                </p>

                <div id={`what-we-do-${pillar.id}-title`}>
                  <PillarWord word={pillar.word} />
                </div>

                <p className="what-we-do__statement">{pillar.statement}</p>
                <p className="what-we-do__description">
                  {pillar.description}
                </p>

                <span
                  className="what-we-do__structural-rule"
                  aria-hidden="true"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </WhatWeDoMotion>
  );
}
