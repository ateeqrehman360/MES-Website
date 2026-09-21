import Image from "next/image";

import { JourneyMotion } from "@/components/sections/journey-motion";
import { journeyMilestones } from "@/data/journey";

export function JourneySection() {
  return (
    <section className="journey" aria-labelledby="journey-title">
      <div className="journey__inner site-container">
        <header className="journey__intro">
          <h2 id="journey-title" className="sr-only">
            Our journey
          </h2>
          <p className="journey__range">2024 — ongoing</p>
          <p className="journey__lede">
            From our first chapter at MMU to becoming an independent society.
          </p>
        </header>

        <JourneyMotion>
          <ol className="journey__milestones">
            {journeyMilestones.map((milestone, index) => (
              <li
                key={milestone.id}
                className="journey__milestone"
                data-journey-milestone={milestone.id}
                data-journey-state="visible"
                data-importance={milestone.importance}
                data-placement={milestone.placement}
                data-route={milestone.route}
                data-medium-route={milestone.mediumRoute}
                data-mobile-route={milestone.mobileRoute}
                data-has-media={milestone.image ? "true" : "false"}
              >
                <span
                  className="journey__node"
                  data-journey-node
                  aria-hidden="true"
                >
                  <span />
                </span>

                <article className="journey__copy">
                  <div className="journey__meta">
                    <span className="journey__position" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <time dateTime={milestone.dateTime}>{milestone.date}</time>
                    {milestone.importance === "current" ? (
                      <span className="journey__current-label">
                        Current chapter
                      </span>
                    ) : null}
                  </div>

                  <h3>{milestone.title}</h3>
                  <p className="journey__description">
                    {milestone.description}
                  </p>

                  {milestone.supportingDetails ? (
                    <dl className="journey__details">
                      {milestone.supportingDetails.map((detail) => (
                        <div key={detail.label}>
                          <dt>{detail.label}</dt>
                          <dd>{detail.value}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}

                  {milestone.speakers ? (
                    <div className="journey__speakers">
                      <p>Speakers</p>
                      <ul>
                        {milestone.speakers.map((speaker) => (
                          <li key={speaker}>{speaker}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>

                {milestone.image ? (
                  <figure
                    className="journey__media"
                    data-media-kind={milestone.image.kind}
                  >
                    <Image
                      src={milestone.image.src}
                      alt={milestone.image.alt}
                      width={milestone.image.width}
                      height={milestone.image.height}
                      sizes={
                        milestone.image.kind === "photo"
                          ? "(min-width: 80rem) 34vw, (min-width: 48rem) 38vw, calc(100vw - 5.5rem)"
                          : "(min-width: 80rem) 11rem, (min-width: 48rem) 10.5rem, 9rem"
                      }
                      loading="lazy"
                      placeholder={
                        milestone.image.blurDataURL ? "blur" : "empty"
                      }
                      blurDataURL={milestone.image.blurDataURL}
                      style={{
                        width: "100%",
                        height:
                          milestone.image.kind === "photo" ? "100%" : "auto",
                        objectPosition: milestone.image.objectPosition,
                      }}
                    />
                  </figure>
                ) : null}
              </li>
            ))}
          </ol>

          <div className="journey__continuation">
            <span
              className="journey__continuation-mark"
              data-journey-ending
              aria-hidden="true"
            />
            <p>The journey continues.</p>
          </div>
        </JourneyMotion>
      </div>
    </section>
  );
}
