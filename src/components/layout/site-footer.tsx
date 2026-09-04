import Link from "next/link";

import {
  footerCommunityLinks,
  footerNavigationItems,
  footerSocialLinks,
  type FooterSocialIcon,
} from "@/data/footer";
import { siteConfig } from "@/data/site";

function SocialIcon({ icon }: { icon: FooterSocialIcon }) {
  if (icon === "instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4.25" />
        <circle className="site-footer__icon-fill" cx="17.4" cy="6.7" r="1" />
      </svg>
    );
  }

  if (icon === "tiktok") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          className="site-footer__icon-fill"
          d="M14.2 2.75h3.05c.25 2.05 1.42 3.45 3.5 3.82v3.08a8.2 8.2 0 0 1-3.5-1.02v6.18a6.05 6.05 0 1 1-5.28-6v3.12a3.02 3.02 0 1 0 2.23 2.9V2.75Z"
        />
      </svg>
    );
  }

  if (icon === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          className="site-footer__icon-fill"
          d="M5.35 7.75A1.85 1.85 0 1 0 5.34 4a1.85 1.85 0 0 0 .01 3.75ZM3.75 9.1h3.2v10.65h-3.2V9.1Zm5.15 0h3.07v1.46h.04c.43-.81 1.47-1.67 3.03-1.67 3.24 0 3.84 2.13 3.84 4.91v5.95h-3.2v-5.27c0-1.26-.02-2.88-1.75-2.88-1.76 0-2.03 1.38-2.03 2.79v5.36H8.9V9.1Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        className="site-footer__icon-fill"
        d="M14.2 21v-8h2.75l.42-3.12H14.2V7.9c0-.9.26-1.52 1.58-1.52h1.7V3.6c-.3-.04-1.3-.12-2.5-.12-2.45 0-4.13 1.47-4.13 4.2v2.2H8.08V13h2.77v8h3.35Z"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer
      className="site-footer"
      data-focus-surface="dark"
      aria-labelledby="site-footer-closing-title"
    >
      <div className="site-footer__inner site-container">
        <div className="site-footer__body">
          <div className="site-footer__editorial">
            <p className="site-footer__identity">
              <span>Muslim Entrepreneurs Society</span>
              <span>Manchester Metropolitan University</span>
            </p>

            <h2
              id="site-footer-closing-title"
              className="site-footer__closing"
            >
              <span>Built at MMU.</span>
              <span>For Muslims with ambition.</span>
            </h2>
          </div>

          <div className="site-footer__utility">
            <nav aria-label="Footer navigation">
              <ul className="site-footer__navigation-list">
                {footerNavigationItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="site-footer__utility-link">
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="MES social media">
              <ul className="site-footer__social-list">
                {footerSocialLinks.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      title={item.label}
                      className="site-footer__social-link"
                    >
                      <SocialIcon icon={item.icon} />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="MES WhatsApp communities">
              <ul className="site-footer__community-list">
                {footerCommunityLinks.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="site-footer__community-link"
                    >
                      <span>{item.label}</span>
                      <span aria-hidden="true">↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href={`mailto:${siteConfig.email}`}
              className="site-footer__email-link"
            >
              {siteConfig.email}
            </a>
          </div>
        </div>

        <div className="site-footer__meta">
          <p>© 2026 Muslim Entrepreneurs Society</p>
          <p>Developed by Ateeq Ur Rehman</p>
        </div>
      </div>
    </footer>
  );
}
