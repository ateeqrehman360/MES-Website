# Production previews

Captured from [mmumes.com](https://mmumes.com) on 11 October 2026 in desktop Chrome 154.0.0.0:

| File | Viewport in CSS pixels | Content |
| --- | --- | --- |
| `homepage-desktop.jpg` | 1440 × 812 | Opening homepage, active 3D laptop |
| `homepage-mobile.jpg` | 390 × 844 | Opening homepage, active 3D laptop, emulated mobile viewport |

Both images are viewport-only JPEG captures at device pixel ratio 1, without
browser chrome, developer panels, loading placeholders or accidental focus
indicators. The visible layout was reviewed after loading;
`document.fonts.status` was `loaded`, the hero's WebGL state was `ready` and the
active WebGL context was not lost. Apparel, TAN, laptop Montserrat and Hanken
faces were loaded, and visible image assets had completed loading.
The laptop crop on mobile reflects the production portrait composition. Mobile
viewport and touch input were emulated in desktop Chrome; neither capture was
taken on a physical iPhone.

Production was checked against the final changes in PRs #55–#57 before capture:
the centred scroll cue and contextual homepage links were present, obsolete
Featured Experiences numbering was absent, and the mobile hero and Featured
Experiences tracks used the updated `250svh` and `220svh` heights respectively.

These previews demonstrate rendered appearance, not real-phone performance or
Lighthouse results. Third-party asset rights still apply; see
[Asset Licensing](../ASSET_LICENSING.md).
