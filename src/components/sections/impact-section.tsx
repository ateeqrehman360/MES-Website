import { impactStatistics } from "@/data/stats";

import { ImpactCountUp } from "./impact-count-up";

export function ImpactSection() {
  return (
    <section
      id="impact"
      className="impact"
      aria-labelledby="impact-title"
      data-focus-surface="dark"
    >
      <div className="site-container">
        <h2 id="impact-title" className="home-section-label impact__title">
          Our impact
        </h2>

        <ImpactCountUp>
          {impactStatistics.map((statistic) => (
            <div
              key={statistic.id}
              className="impact__statistic"
              data-statistic={statistic.id}
            >
              <dt className="impact__label">{statistic.label}</dt>
              <dd className="impact__value">
                {statistic.value === undefined ? statistic.displayValue : (
                  <>
                    <span className="sr-only">{statistic.displayValue}</span>
                    <span
                      aria-hidden="true"
                      data-count-target={statistic.value}
                      data-count-prefix={statistic.prefix}
                      data-count-suffix={statistic.suffix}
                      data-count-final={statistic.displayValue}
                    >
                      {statistic.displayValue}
                    </span>
                  </>
                )}
              </dd>
            </div>
          ))}
        </ImpactCountUp>
      </div>
    </section>
  );
}
