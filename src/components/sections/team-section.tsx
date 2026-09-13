import Image from "next/image";

import { TeamMotion } from "@/components/sections/team-motion";
import { teamMembers } from "@/data/team";

export function TeamSection() {
  return (
    <TeamMotion>
      <div className="team__track" data-team-track>
        <div className="team__stage site-container" data-team-stage>
          <header className="team__intro">
            <p className="team__label">The team</p>
            <h2 id="team-title" className="team__title">
              The people building MES.
            </h2>
            <p className="team__support">
              A student-led team shaping the society, its events and the
              community around it.
            </p>
          </header>

          <ol className="team__spread" aria-label="MES team members">
            {teamMembers.map((member, index) => (
              <li
                key={member.id}
                className="team__member"
                data-team-member={member.id}
                data-team-tier={member.tier}
                data-team-layout={member.layout}
              >
                <figure className="team__figure">
                  <div
                    className="team__portrait-frame"
                    data-portrait-state={
                      member.portrait ? "portrait" : "placeholder"
                    }
                  >
                    {member.portrait ? (
                      <Image
                        className="team__portrait"
                        src={member.portrait}
                        alt={member.alt}
                        fill
                        sizes={
                          member.tier === "primary"
                            ? "(min-width: 64rem) 23vw, (min-width: 48rem) 28vw, 84vw"
                            : "(min-width: 64rem) 18vw, (min-width: 48rem) 23vw, 78vw"
                        }
                        loading="lazy"
                        style={{ objectPosition: member.objectPosition }}
                      />
                    ) : (
                      <div
                        className="team__placeholder"
                        data-placeholder-tone={member.placeholderTone}
                        aria-hidden="true"
                      >
                        <span className="team__placeholder-index">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="team__placeholder-mark" />
                        <span className="team__placeholder-status">
                          Portrait pending
                        </span>
                      </div>
                    )}
                  </div>

                  <figcaption className="team__caption">
                    <h3 className="team__name-mask">
                      <span className="team__name">{member.name}</span>
                    </h3>
                    <p className="team__role">{member.role}</p>
                    <span className="team__member-rule" aria-hidden="true" />
                  </figcaption>
                </figure>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </TeamMotion>
  );
}
