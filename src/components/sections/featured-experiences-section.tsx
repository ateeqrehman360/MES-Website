import Image from "next/image";

import { featuredExperiences } from "@/data/featured-experiences";

import { FeaturedExperiencesMotion } from "./featured-experiences-motion";

function FeaturedExperiencesHeading({ semantic = false }) {
  const content = (
    <>
      <span className="featured-experiences__title-kicker">Featured</span>
      <span className="featured-experiences__title-display">Experiences</span>
    </>
  );

  return (
    <div className="featured-experiences__heading-inner site-container">
      {semantic ? (
        <h2 id="featured-experiences-title">{content}</h2>
      ) : (
        <div aria-hidden="true">{content}</div>
      )}
      <span className="featured-experiences__count" aria-hidden="true">
        01—04
      </span>
    </div>
  );
}

export function FeaturedExperiencesSection() {
  return (
    <FeaturedExperiencesMotion>
      <div className="featured-experiences__stage">
        <div
          className="featured-experiences__heading featured-experiences__heading--base"
          aria-hidden="true"
        >
          <FeaturedExperiencesHeading />
        </div>

        <div className="featured-experiences__reveal">
          <div className="featured-experiences__heading featured-experiences__heading--revealed">
            <FeaturedExperiencesHeading semantic />
          </div>

          <span className="featured-experiences__rule" aria-hidden="true" />

          <div className="featured-experiences__collection site-container">
            {featuredExperiences.map((experience, index) => (
              <article
                key={experience.id}
                className="featured-experience"
                data-featured-experience={experience.id}
              >
                <span
                  className="featured-experience__field"
                  aria-hidden="true"
                />

                <div className="featured-experience__copy">
                  <p className="featured-experience__position">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <span aria-hidden="true">/</span>
                    <span>04</span>
                  </p>
                  <h3>{experience.title}</h3>
                  <p className="featured-experience__descriptor">
                    {experience.descriptor}
                  </p>
                </div>

                <div className="featured-experience__poster">
                  <Image
                    src={experience.poster.src}
                    alt={experience.poster.alt}
                    width={experience.poster.width}
                    height={experience.poster.height}
                    sizes="(min-width: 1280px) 34rem, (min-width: 1024px) 38vw, (min-width: 768px) 48vw, 84vw"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </FeaturedExperiencesMotion>
  );
}
