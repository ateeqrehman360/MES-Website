import { Fragment } from "react";

import { VisionMotion } from "./vision-motion";

const missionLines = [
  "We help Muslim",
  "students turn",
  "ambition into action.",
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
            <span aria-hidden="true">
              {missionLines.map((line) => (
                <span className="vision__line" key={line}>
                  {line.split(" ").map((word) => (
                    <Fragment key={word}>
                      <span className="vision__word">
                        <span className="vision__word-inner">{word}</span>
                      </span>{" "}
                    </Fragment>
                  ))}
                </span>
              ))}
            </span>
          </h2>

          <p className="vision__principles">
            <span className="sr-only">Learn. Connect. Build.</span>
            <span aria-hidden="true">
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
