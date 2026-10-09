import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";
import styles from "./privacy.module.css";

const description =
  "How we handle your information when you visit mmumes.com, apply to the MES committee or contact the society.";

export const metadata = createPageMetadata("Privacy", description, "/privacy");

const noticeSections = [
  {
    id: "about-this-notice",
    title: "Who we are",
    content: (
      <>
        <p>
          Muslim Entrepreneurs Society (MES), an independent student society at
          Manchester Metropolitan University, is the data controller for the
          personal information we use for the purposes described in this notice.
          This means MES decides why and how that information is used. This
          notice covers mmumes.com, committee recruitment and email enquiries.
        </p>
        <p>
          For privacy questions, concerns or requests, email{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </>
    ),
  },
  {
    id: "visiting-the-website",
    title: "Visiting the website",
    content: (
      <p>
        Our website is hosted on Vercel. Vercel processes technical information
        needed to deliver and protect the site, which may include your IP
        address, browser and device information, requested page and request time.
        MES has no visitor analytics, user accounts, application database,
        advertising or tracking scripts, or custom payment processing on this
        website. See{" "}
        <a href="https://vercel.com/legal/privacy-notice">Vercel’s privacy notice</a>{" "}
        for its handling of technical information.
      </p>
    ),
  },
  {
    id: "committee-applications",
    title: "Committee applications",
    content: (
      <>
        <p className={styles.important}>
          <strong>Before you start:</strong> our Tally form has partial submissions
          enabled. Answers you enter may be collected and stored by Tally and
          made available to MES even if you do not press Submit or finish the form.
        </p>
        <p>
          Applications use <a href="https://tally.so/r/ob4kAb">our Tally form</a>,
          available directly or through the Work With Us page. Tally processes
          answers on our behalf; they are not stored in a MES website database.
          The embedded form loads when you open the application dialog. Tally may
          also process technical information when you open the form.
        </p>
        <p>
          The form asks for your full name, email address, course, year of study,
          preferred committee team, skills and experience, motivation, ideas and
          availability. We also receive any other answers you voluntarily provide.
          We use application information to review applications, assess suitability
          for available roles, contact applicants, organise interviews and manage
          successful recruitment. Providing information is your choice, but we
          may be unable to assess your application without the relevant answers.
        </p>
        <p>
          The form does not explicitly ask for religion, ethnicity, health
          information or disabilities. Free-text answers can still reveal
          sensitive personal information. Please keep answers relevant to the
          role and avoid including unnecessary sensitive details or information
          about other people.
        </p>
        <p>
          Tally’s separate “Save answers for later” feature is disabled. This
          does not prevent partial answers from being collected. Read{" "}
          <a href="https://tally.so/help/privacy-policy">Tally’s privacy notice</a>{" "}
          for more about its service.
        </p>
      </>
    ),
  },
  {
    id: "application-access",
    title: "Who sees applications",
    content: (
      <>
        <p>
          Only the Operations Lead and the President (Asma) review applications
          for MES. The Tally account is currently registered using the Operations
          Lead’s personal email. Notifications of submitted applications go to
          that personal mailbox, and the Operations Lead manually shares relevant
          applications with the President. They do not currently go to our
          official Outlook mailbox. Tally does not send notifications for partial
          submissions, but those answers remain available in Tally.
        </p>
        <p>
          Tally and the email services used by the authorised reviewers process
          information to provide their services. There are no Google Sheets
          integrations or other automated application integrations.
        </p>
      </>
    ),
  },
  {
    id: "email-enquiries",
    title: "Email enquiries",
    content: (
      <p>
        When you email <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>,
        we receive your name, email address, message and any attachments you
        choose to send. We use these to respond to and resolve your enquiry.
        Your email provider and Microsoft’s Outlook service process the
        correspondence, and MES members handling the enquiry can access it.
        Please send only information relevant to your enquiry. See{" "}
        <a href="https://www.microsoft.com/en-gb/privacy/privacystatement">Microsoft’s privacy statement</a>.
      </p>
    ),
  },
  {
    id: "lawful-basis",
    title: "Why we use information",
    content: (
      <>
        <p>
          We rely on legitimate interests under Article 6(1)(f) of the UK GDPR
          for committee recruitment and handling enquiries. Our interests are
          recruiting suitable committee members, managing recruitment and
          responding to people who contact MES. We use information relevant to
          these purposes, taking account of your interests and privacy rights.
          You have a right to object to this use.
        </p>
        <p>
          Delivering and protecting the website also serves our legitimate
          interest in maintaining a working, secure website. Service providers
          may process information for their own purposes as described in their
          privacy notices. Legitimate interests alone does not authorise the use
          of special category information, such as religious beliefs or health
          details.
        </p>
      </>
    ),
  },
  {
    id: "retention",
    title: "How long we keep it",
    content: (
      <>
        <p>MES has adopted the following retention periods:</p>
        <dl className={styles.retention}>
          <div>
            <dt>Unsuccessful applications</dt>
            <dd>Delete within 3 months after recruitment closes.</dd>
          </div>
          <div>
            <dt>Successful applications</dt>
            <dd>
              Keep information needed during committee membership, then delete
              within 3 months after membership ends.
            </dd>
          </div>
          <div>
            <dt>Incomplete or partial applications</dt>
            <dd>Delete within 30 days after recruitment closes.</dd>
          </div>
          <div>
            <dt>Email enquiries</dt>
            <dd>
              Keep only as needed, normally no longer than 12 months after the
              enquiry is resolved.
            </dd>
          </div>
        </dl>
        <p>
          Deletion is manual. Tally keeps submissions until someone deletes them;
          MES’s schedule is not an automatic Tally setting. The schedule covers
          submissions, partial answers, relevant notification emails and copies
          shared between authorised reviewers. Our deletion procedure includes
          clearing the relevant Tally Trash entries. Otherwise, Tally allows
          deleted entries to be recovered from Trash for up to 90 days.
        </p>
        <p>
          Removing our copies does not mean information is immediately erased
          from every service-provider backup. Providers manage technical logs
          and backup retention under their own arrangements. See{" "}
          <a href="https://tally.so/help/how-to-delete-and-recover-form-data">Tally’s deletion guidance</a>.
        </p>
      </>
    ),
  },
  {
    id: "international-processing",
    title: "Processing outside the UK",
    content: (
      <p>
        Our providers may process information outside the UK. Tally states that
        form responses are stored in Europe; its email notification service
        uses SendGrid in the United States, as listed in{" "}
        <a href="https://tally.so/help/gdpr">Tally’s provider information</a>.
        Vercel and Microsoft also describe
        international processing, including in the United States. Information
        sent to reviewers’ email accounts is also handled by their email
        providers. The provider notices linked above explain their arrangements.
        You can contact MES for further information about where your information
        is processed and the protections relevant to it.
      </p>
    ),
  },
  {
    id: "cookies-and-links",
    title: "Cookies and external links",
    content: (
      <>
        <p>
          The MES website code does not set first-party cookies or use local or
          session storage. Images, fonts and the 3D laptop are served as website
          assets. Google Fonts are downloaded during the build and served with
          the site. The Tally form is a separate third-party resource, subject to
          Tally’s own cookies and storage arrangements. Disabling its
          save-for-later feature does not disable partial submissions. We do not
          claim that hosting or linked services are cookie-free.
        </p>
        <p>
          Links to WhatsApp, Instagram, TikTok, LinkedIn and Facebook take you to
          external services with their own privacy terms and settings. These are
          links, not embedded social-media login systems; MES does not receive
          your login details through them. Check the service’s settings before
          joining a group or sharing information.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights and concerns",
    content: (
      <>
        <p>
          Under UK data protection law, you can ask for access to your personal
          information, correction of inaccurate information, deletion or
          restriction of its use. You can object to processing based on
          legitimate interests, including committee recruitment and enquiries.
          These rights apply subject to the circumstances and legal exceptions.
        </p>
        <p>
          The right to data portability generally applies to automated processing
          based on consent or a contract, rather than the legitimate interests
          processing described here. If we rely on consent for any separate use,
          you can withdraw it at any time without affecting earlier lawful use.
          Committee applications are reviewed by people, not decided solely by
          automated processing.
        </p>
        <p>
          To exercise a right or raise a concern, email{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          You also have the right to complain to the UK Information
          Commissioner’s Office (ICO). Visit the{" "}
          <a href="https://ico.org.uk/make-a-complaint/">ICO complaints page</a>.
        </p>
      </>
    ),
  },
  {
    id: "asset-credits",
    title: "Asset Credits",
    content: (
      <p>
        <a href="https://skfb.ly/6RVFt" target="_blank" rel="noopener noreferrer">
          &quot;Laptop&quot;<span className="sr-only"> (opens in a new tab)</span>
        </a>{" "}
        by Aullwen is licensed under{" "}
        <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">
          Creative Commons Attribution 4.0.
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <article className={`${styles.notice} site-container`}>
      <header className={styles.hero}>
        <p className={styles.label}>MES · Privacy notice</p>
        <h1 className={styles.title}>Privacy</h1>
        <p className={styles.intro}>{description}</p>
        <p className={styles.updated}>
          Last updated <time dateTime="2026-10-09">9 October 2026</time>
        </p>
      </header>
      <nav className={styles.contents} aria-label="Privacy notice sections">
        <a href="#committee-applications">Applications</a>
        <a href="#retention">Retention</a>
        <a href="#your-rights">Your rights</a>
        <a href="#about-this-notice">Contact MES</a>
      </nav>
      {noticeSections.map(({ id, title, content }) => (
        <section key={id} className={styles.section} aria-labelledby={id}>
          <h2 id={id} className={styles.heading}>{title}</h2>
          <div className={styles.copy}>{content}</div>
        </section>
      ))}
    </article>
  );
}
