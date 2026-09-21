import styles from "./ways-to-work-with-us.module.css";
import { WaysToWorkWithUsMotion } from "./ways-to-work-with-us-motion";

const pathways = [
  {
    number: "01",
    title: "Co-host an event",
    copy: "Create something together for Muslim students — from talks and panels to workshops, showcases and larger experiences.",
  },
  {
    number: "02",
    title: "Bring expertise into the room",
    copy: "Bring founders, professionals, speakers or specialists into meaningful conversations, workshops and practical sessions.",
  },
  {
    number: "03",
    title: "Create an opportunity",
    copy: "Give students something tangible to take part in — programmes, competitions, business opportunities, placements or practical experiences.",
  },
] as const;

export function WaysToWorkWithUs() {
  return (
    <WaysToWorkWithUsMotion className={styles.section}>
      <div className={`${styles.inner} site-container`}>
        <header className={styles.intro} data-reveal-block>
          <p className={styles.eyebrow}>
            <span aria-hidden="true" />
            Ways to work with us
          </p>

          <h2 id="ways-to-work-with-us-title" className={styles.heading}>
            What could we build together?
          </h2>

          <p className={styles.introCopy}>
            Start with a room, an idea or a real opportunity. We&apos;ll shape it
            into something useful for Muslim students.
          </p>
        </header>

        <ol className={styles.pathways}>
          {pathways.map((pathway) => (
            <li
              key={pathway.number}
              className={styles.pathway}
              data-reveal-block
            >
              <span className={styles.number} aria-hidden="true">
                {pathway.number}
              </span>

              <h3 className={styles.pathwayTitle}>{pathway.title}</h3>

              <p className={styles.pathwayCopy}>{pathway.copy}</p>
            </li>
          ))}
          <li className={`${styles.pathway} ${styles.support}`} data-reveal-block>
            <span className={styles.number} aria-hidden="true">
              04
            </span>

            <h3 className={styles.pathwayTitle}>Support an event</h3>

            <p className={styles.pathwayCopy}>
              For organisations that want to support an MES event financially or
              through resources, sponsorship can form part of the collaboration.
            </p>
          </li>
        </ol>
      </div>
    </WaysToWorkWithUsMotion>
  );
}
