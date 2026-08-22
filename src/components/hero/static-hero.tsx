import { HeroCanvasLoader } from "./hero-canvas-loader";

export function StaticHero() {
  return (
    <section className="hero-static" aria-labelledby="hero-title">
      <h1
        id="hero-title"
        aria-label="Muslim Entrepreneurs"
        className="hero-static__title font-display"
      >
        <span className="hero-static__line hero-static__line--muslim" aria-hidden="true">
          Muslim
        </span>
        <span
          className="hero-static__line hero-static__line--entrepreneurs-desktop"
          aria-hidden="true"
        >
          Entrepreneurs
        </span>
        <span
          className="hero-static__line hero-static__line--entrepreneurs-mobile"
          aria-hidden="true"
        >
          <span>Entre</span>
          <span>Preneurs</span>
        </span>
      </h1>

      <HeroCanvasLoader />
    </section>
  );
}
