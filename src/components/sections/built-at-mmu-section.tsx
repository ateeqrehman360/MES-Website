import { BuiltAtMmuMotion } from "@/components/sections/built-at-mmu-motion";

export function BuiltAtMmuSection() {
  return (
    <BuiltAtMmuMotion>
      <div className="built-at-mmu__inner site-container">
        <span className="built-at-mmu__background-type" aria-hidden="true">
          MMU
        </span>

        <p className="built-at-mmu__label">Built at MMU</p>

        <h2 id="built-at-mmu-title" className="built-at-mmu__title">
          Built at Manchester Metropolitan University.
        </h2>

        <p className="built-at-mmu__support">
          MES is a student-led society at Manchester Metropolitan University,
          creating opportunities for Muslim students to learn, connect and
          build.
        </p>

        <footer className="built-at-mmu__institution">
          <span className="built-at-mmu__rule" aria-hidden="true" />
          <p>Manchester Metropolitan University · Established 2024</p>
        </footer>
      </div>
    </BuiltAtMmuMotion>
  );
}
