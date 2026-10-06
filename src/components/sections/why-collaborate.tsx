import { WhyCollaborateMotion } from "./why-collaborate-motion";
import styles from "./why-collaborate.module.css";

const evidence = [
  { value: "17", label: "Events hosted & collaborated on", position: "events" },
  {
    value: "1,000+",
    label: "Attendees reached across events",
    position: "attendees",
  },
  { value: "422K+", label: "Social views", position: "social" },
  { value: "£1,400+", label: "Raised", position: "raised" },
  {
    value: "Since 2024",
    label: "Building Muslim entrepreneurship at MMU",
    position: "since",
  },
] as const;

export function WhyCollaborate() {
  return (
    <WhyCollaborateMotion className={styles.section}>
      <div className={`${styles.inner} site-container`}>
        <p className={styles.eyebrow}>
          <span aria-hidden="true" />
          Why collaborate with MES
        </p>

        <div className={styles.composition}>
          <h2
            id="why-collaborate-title"
            className={styles.statement}
            data-proof-reveal="statement"
          >
            A student community with a track record of making things happen.
          </h2>

          <dl className={styles.evidence}>
            {evidence.map((fact) => (
              <div
                key={fact.position}
                className={`${styles.fact} ${styles[fact.position]}`}
                data-proof-reveal={fact.position}
              >
                <dt className={styles.figure}>{fact.value}</dt>
                <dd className={styles.caption}>{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </WhyCollaborateMotion>
  );
}
