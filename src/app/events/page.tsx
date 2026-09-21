import { createPageMetadata } from "@/lib/metadata";

const description =
  "Our 2026/27 events programme is taking shape. Check back soon for upcoming events, speakers and experiences from MES.";

export const metadata = createPageMetadata("Events", description);

export default function EventsPage() {
  return (
    <section className="events-holding" aria-labelledby="events-holding-title">
      <div className="events-holding__inner site-container">
        <p className="events-holding__label">
          <span aria-hidden="true" className="events-holding__label-rule" />
          EVENTS
        </p>

        <h1 id="events-holding-title" className="events-holding__title">
          <span>The next chapter</span> <span>is coming.</span>
        </h1>

        <p className="events-holding__support">{description}</p>

        <p className="events-holding__status">
          2026/27 <span aria-hidden="true">·</span> Programme coming soon
        </p>

        <div className="events-holding__mark" aria-hidden="true" />
      </div>
    </section>
  );
}
