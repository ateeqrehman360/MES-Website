import Link from "next/link";

import {
  footerCommunityLinks,
  footerNavigationItems,
  footerSocialLinks,
} from "@/data/footer";
import { siteConfig } from "@/data/site";

type ExternalFooterLinkProps = {
  href: string;
  label: string;
  handle?: string;
};

function ExternalFooterLink({
  href,
  label,
  handle,
}: ExternalFooterLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="site-footer__link site-footer__link--external"
    >
      <span className="site-footer__link-copy">
        <span>{label}</span>
        {handle ? (
          <span className="site-footer__handle">{handle}</span>
        ) : null}
      </span>
      <span className="site-footer__external-mark" aria-hidden="true">
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer" data-focus-surface="dark">
      <div className="site-footer__inner site-container">
        <div className="site-footer__grid">
          <div className="site-footer__identity">
            <Link
              href="/"
              className="site-footer__wordmark"
              aria-label="MES home"
            >
              MES
            </Link>
            <p className="site-footer__university">
              Muslim Entrepreneurs Society · Manchester Metropolitan University
            </p>
          </div>

          <nav
            className="site-footer__navigation"
            aria-labelledby="footer-navigation-title"
          >
            <h2 id="footer-navigation-title" className="site-footer__heading">
              Explore
            </h2>
            <ul className="site-footer__list">
              {footerNavigationItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="site-footer__link">
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav
            className="site-footer__social"
            aria-labelledby="footer-social-title"
          >
            <h2 id="footer-social-title" className="site-footer__heading">
              Social
            </h2>
            <ul className="site-footer__list">
              {footerSocialLinks.map((item) => (
                <li key={item.href}>
                  <ExternalFooterLink {...item} />
                </li>
              ))}
            </ul>
          </nav>

          <nav
            className="site-footer__community"
            aria-labelledby="footer-community-title"
          >
            <h2 id="footer-community-title" className="site-footer__heading">
              Community
            </h2>
            <ul className="site-footer__list">
              {footerCommunityLinks.map((item) => (
                <li key={item.href}>
                  <ExternalFooterLink {...item} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-footer__email">
            <p className="site-footer__heading">Email</p>
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
