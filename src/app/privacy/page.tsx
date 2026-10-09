import { FoundationPage } from "@/components/sections/foundation-page";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

const description =
  "How information is handled when you visit the MES website, apply to join the committee or contact the society.";

export const metadata = createPageMetadata("Privacy", description, "/privacy");

const linkClass =
  "font-semibold text-mes-deep-green underline decoration-mes-gold decoration-1 underline-offset-4";

const noticeSections = [
  {
    id: "about-this-notice",
    title: "About this notice",
    content: (
      <>
        <p>
          Muslim Entrepreneurs Society (MES) is an independent student society at
          Manchester Metropolitan University. This notice covers mmumes.com and
          the contact and committee application links provided on the website.
          For privacy questions or requests, email{" "}
          <a href={`mailto:${siteConfig.email}`} className={linkClass}>
            {siteConfig.email}
          </a>.
        </p>
        <p>
          This is a draft for committee review. The committee must confirm who is
          responsible for personal data, the lawful bases, retention arrangements
          and service settings described below before public launch.
        </p>
      </>
    ),
  },
  {
    id: "visiting-the-website",
    title: "Visiting the website",
    content: (
      <p>
        The website is prepared for hosting on Vercel. When hosted there, Vercel
        processes technical request information to deliver and protect the site.
        This may include your IP address, browser and device information, the
        requested address and request time in technical logs. The project has no
        visitor analytics, accounts, database or custom payment processing.
        Vercel’s handling of technical information is described in its{" "}
        <a href="https://vercel.com/legal/privacy-notice" className={linkClass}>
          privacy notice
        </a>.
      </p>
    ),
  },
  {
    id: "committee-applications",
    title: "Committee applications",
    content: (
      <>
        <p>
          Committee applications use a form hosted by Tally, available through an
          embedded form on the Work With Us page or a direct link. Information you enter
          is submitted to Tally rather than a MES website backend. It may include
          your full name, course, year of study, email address, preferred team,
          motivations, skills, ideas, weekly availability and any additional
          information you choose to provide. Application
          information is intended for reviewing applications and contacting
          applicants about recruitment.
        </p>
        <p>
          The embedded form loads only when you open the application dialog.
          Tally may process technical information when you open the embedded
          application form or visit its direct link. Read{" "}
          <a href="https://tally.so/help/privacy-policy" className={linkClass}>
            Tally’s privacy policy
          </a>{" "}
          and any information accompanying the form before submitting. The
          committee still needs to confirm access to submissions, integrations
          and any exports or email notifications. The live form also has a
          save-for-later setting; its browser storage behaviour needs verification.
        </p>
      </>
    ),
  },
  {
    id: "email-correspondence",
    title: "Email correspondence",
    content: (
      <p>
        Email links open your email application. If you email MES, your email
        provider and the society’s Outlook email service process the message.
        Your address, message and any attachments are available in the receiving
        mailbox so that your enquiry can be handled. Send only information
        relevant to your enquiry. The committee needs to confirm mailbox access,
        any sharing of correspondence and how messages are retained.
      </p>
    ),
  },
  {
    id: "external-services",
    title: "WhatsApp, social media and other links",
    content: (
      <p>
        The website links to WhatsApp communities, Instagram, TikTok, LinkedIn
        and Facebook, as well as asset attribution pages. Following a link takes
        you to another service, whose privacy terms and account settings apply.
        These social services are linked rather than embedded. Joining a
        WhatsApp community can make profile or contact information visible to
        others depending on the service and group settings; check those settings
        before joining. This website does not receive your social media login
        details through these links.
      </p>
    ),
  },
  {
    id: "cookies-and-resources",
    title: "Cookies and website resources",
    content: (
      <p>
        The website code does not set first-party cookies or use local storage or
        session storage. It contains no analytics or advertising scripts. Images,
        fonts and the 3D laptop are served as website assets; Google Fonts are
        downloaded during the build and served with the site. The embedded Tally
        form is a separate third-party resource. Its cookies, storage and other
        requests depend on Tally and the live form configuration, which need to
        be checked before launch. This notice does not claim that third-party
        services or hosting are cookie-free.
      </p>
    ),
  },
  {
    id: "committee-confirmation",
    title: "Details awaiting committee confirmation",
    content: (
      <p>
        The committee must confirm the identity and contact details of the data
        controller; the lawful basis for each use of personal data; who can
        access, receive or export it; and how long it is kept, or the criteria for
        deciding that. It must also confirm any international transfers and
        applicable safeguards, provider arrangements and whether application
        answers reveal sensitive information such as religious beliefs. Any such
        processing needs an appropriate additional condition. No legal basis,
        retention period or contractual safeguard is asserted in this draft.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights and concerns",
    content: (
      <>
        <p>
          Depending on the circumstances and lawful basis, UK data protection law
          gives you rights to request access to, correction or deletion of your
          personal data, restriction of its use and data portability. You may
          also have a right to object to its use. Where processing relies on
          consent, you can withdraw that consent. Contact MES using the email
          above to raise a concern or make a request.
        </p>
        <p>
          You can also complain to the UK Information Commissioner’s Office.
          Visit the{" "}
          <a href="https://ico.org.uk/make-a-complaint/" className={linkClass}>
            ICO complaints page
          </a>{" "}
          for information about raising a data protection complaint.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <FoundationPage
        title="Privacy"
        description={description}
        status="Draft for committee review"
      />
      {noticeSections.map(({ id, title, content }) => (
        <section
          key={id}
          className="site-container border-t border-mes-border py-14 md:py-20"
          aria-labelledby={id}
        >
          <div className="max-w-[var(--measure-copy)]">
            <h2
              id={id}
              className="font-[family-name:var(--font-hero-apparel)] text-4xl font-normal leading-none tracking-[-0.035em] text-mes-green-ink md:text-5xl"
            >
              {title}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-mes-green-ink/85">
              {content}
            </div>
          </div>
        </section>
      ))}
      <section
        className="site-container border-t border-mes-border py-14 md:py-20"
        aria-labelledby="asset-credits-title"
      >
        <div className="max-w-[var(--measure-copy)]">
          <h2
            id="asset-credits-title"
            className="font-[family-name:var(--font-hero-apparel)] text-4xl font-normal leading-none tracking-[-0.035em] text-mes-green-ink md:text-5xl"
          >
            Asset Credits
          </h2>
          <p className="mt-6 text-base leading-relaxed text-mes-green-ink/85">
            <a
              href="https://skfb.ly/6RVFt"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-mes-deep-green underline decoration-mes-gold decoration-1 underline-offset-4"
            >
              &quot;Laptop&quot;
              <span className="sr-only"> (opens in a new tab)</span>
            </a>{" "}
            by Aullwen is licensed under{" "}
            <a
              href="http://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-mes-deep-green underline decoration-mes-gold decoration-1 underline-offset-4"
            >
              Creative Commons Attribution 4.0.
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
