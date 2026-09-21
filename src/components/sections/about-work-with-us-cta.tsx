import Link from "next/link";

import { AboutWorkWithUsMotion } from "@/components/sections/about-work-with-us-motion";

export function AboutWorkWithUsCta() {
  return (
    <AboutWorkWithUsMotion>
      <div className="about-work-with-us__inner site-container">
        <p className="about-work-with-us__label">Work with us</p>

        <span className="about-work-with-us__axis" aria-hidden="true" />

        <h2
          id="about-work-with-us-title"
          className="about-work-with-us__title"
        >
          <span>Build something</span>
          <span>meaningful with us.</span>
        </h2>

        <div className="about-work-with-us__action">
          <p className="about-work-with-us__support">
            We work with businesses, speakers, sponsors and organisations that
            want to create valuable opportunities for Muslim students.
          </p>

          <Link
            href="/work-with-us"
            className="about-work-with-us__cta"
          >
            <span>Explore Work With Us</span>
            <span className="about-work-with-us__cta-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </AboutWorkWithUsMotion>
  );
}
