import { Fragment } from "react";

import { VisionMotion } from "./vision-motion";

const missionWords = [
  { text: "We help", position: "lead" },
  { text: "Muslim", position: "muslim" },
  { text: "students", position: "students" },
  { text: "turn", position: "turn" },
  { text: "ambition", position: "ambition" },
  { text: "into", position: "into" },
  { text: "action.", position: "action" },
];

export function VisionSection() {
  return (
    <VisionMotion>
      <div className="site-container vision__inner">
        <p className="home-section-label vision__label">Our purpose</p>

        <div className="vision__passages">
          <h2 id="vision-title" className="vision__mission">
            <span className="sr-only">
              We help Muslim students turn ambition into action.
            </span>
            <span className="vision__mission-layout" aria-hidden="true">
              {missionWords.map(({ text, position }) => (
                <Fragment key={position}>
                  <span className={`vision__word vision__word--${position}`}>
                    <span className="vision__word-inner">{text}</span>
                  </span>{" "}
                </Fragment>
              ))}
            </span>
          </h2>

          <p className="vision__principles">
            <span className="sr-only">Learn. Connect. Build.</span>
            <span className="vision__principles-layout" aria-hidden="true">
              {["Learn.", "Connect.", "Build."].map((word) => (
                <Fragment key={word}>
                  <span className="vision__principle">
                    <span className="vision__word-inner">{word}</span>
                  </span>{" "}
                </Fragment>
              ))}
            </span>
          </p>
        </div>

        <p className="vision__support">
          MES brings together aspiring founders, professionals and businesses
          to learn, connect and build — starting at Manchester Metropolitan
          University.
        </p>
      </div>
    </VisionMotion>
  );
}
