# MES pre-deployment essentials

Review date: 9 October 2026 (Europe/London). Branch: `pre-deployment-essentials`.
Started from latest remote `main` at `cdd9106038f038e18dde7dad6430fd283ceac7f7`.
The implementation commit SHA is supplied in the final handoff; this report is part of that commit.

## Completed

Replaced the placeholder privacy page with a British English draft describing the actual website, hosting request information, Tally applications, email, external communities/social services and website resources. Kept the existing visual language, laptop credit, author and both source/licence links. Unconfirmed operational and legal details are visibly identified; this is not an approved final notice.

Implemented standard Next.js App Router metadata, canonical URLs, Open Graph, X cards, sitemap and robots. No SEO package, analytics, infrastructure, font change, photographic asset change or redesign was introduced. Recruitment wording and all existing external URLs remain unchanged. No PR, merge, deployment, DNS or domain configuration is part of this task.

### Exact files changed

- `src/app/layout.tsx` — metadata base, indexing defaults and sharing defaults only; font configuration unchanged.
- `src/app/page.tsx` — homepage metadata only.
- `src/app/about/page.tsx` — canonical path supplied to existing metadata helper.
- `src/app/events/page.tsx` — canonical path supplied to existing metadata helper.
- `src/app/work-with-us/page.tsx` — canonical path supplied to existing metadata helper.
- `src/app/privacy/page.tsx` — draft privacy notice and metadata; original credits retained.
- `src/app/robots.ts` — new standard metadata route.
- `src/app/sitemap.ts` — new standard metadata route.
- `src/lib/metadata.ts` — page metadata helper and existing logo sharing configuration.
- `src/data/site.ts` — production origin.
- `src/components/sections/foundation-page.tsx` — optional status text so Privacy can show its review status, using the existing layout.
- `docs/PRE_DEPLOYMENT_REPORT.md` — this handoff.

### SEO and indexing

`metadataBase` is `https://mesmcr.com`. All five public routes have unique titles/descriptions, their own canonical and Open Graph URL, `website` type, `en_GB` locale, MES site name and the existing PNG logo. X uses a square `summary` card with page-specific title, description and image alt text. No unverified social account handle or structured data was added.

| Route | Rendered title | Canonical |
| --- | --- | --- |
| `/` | Muslim Entrepreneurs Society at MMU \| MES | `https://mesmcr.com` |
| `/about` | About \| MES | `https://mesmcr.com/about` |
| `/events` | Events \| MES | `https://mesmcr.com/events` |
| `/work-with-us` | Work With Us \| MES | `https://mesmcr.com/work-with-us` |
| `/privacy` | Privacy \| MES | `https://mesmcr.com/privacy` |

Production pages emit `index, follow`. The sitemap contains exactly the five public routes (the homepage URL has its standard trailing slash); no generated last-modified dates, extra pages or placeholder routes were invented. Robots allows crawling and points to `https://mesmcr.com/sitemap.xml`. An unknown route returns HTTP 404 and Next.js's `noindex`.

The existing `/brand/mes-logo.svg` favicon is valid, contains its title/viewBox and returns `image/svg+xml`. It remains unchanged. No dedicated ICO or Apple touch icon exists; these are optional refinements.

Implementation follows the [Next.js metadata documentation](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [sitemap convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap) and [robots convention](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots).

### Social-sharing image

Visually inspected the existing `public/brand/mes-logo.png`: 1254 × 1254, PNG, 923,253 bytes (about 902 KiB), MES green/gold emblem on cream. It is a suitable existing square identity image, so it is referenced unchanged in OG and X metadata with explicit OG dimensions and alt text. Other existing photographs/posters are event-specific or portrait compositions rather than general website sharing graphics. SVG is retained for the favicon, while the PNG supplies a raster sharing image.

A dedicated landscape graphic would improve large previews: owner-approved **1200 × 630 px** PNG/JPEG, existing cream/green/gold palette and logo, “Muslim Entrepreneurs Society”, “Manchester Metropolitan University” and optionally `mesmcr.com`. Keep the logo and essential text within a central safe area to tolerate cropping; use the approved brand typography with appropriate licences. Avoid small text and unreviewed new artwork. Save the approved asset under `public/brand/`, update `socialImage` dimensions/path/alt text and change X to `summary_large_image`. Validate real platform previews once the domain is live. This is optional and no new graphic was created.

### Link audit

Read-only HTTP GET requests followed redirects and checked public response titles on 9 October 2026. HTTP success does not establish account ownership, submission delivery, membership eligibility or mailbox deliverability. No applications were submitted, communities joined or emails sent.

| Link | Result | Evidence / limitation |
| --- | --- | --- |
| [Instagram](https://www.instagram.com/mmu.mes) | Working | HTTP 200; title identifies Muslim Entrepreneurs Society / `mmu.mes`. |
| [TikTok](https://www.tiktok.com/@mmu.mes) | Unable to verify profile | HTTP 200 with generic “TikTok - Make Your Day” shell; owner should check the profile in the app/browser. |
| [LinkedIn](https://www.linkedin.com/company/muslimentrepreneurs) | Working | HTTP 200; Muslim Entrepreneurs Manchester title. |
| [Facebook](https://www.facebook.com/people/Muslims-Entrepreneurs-Manchester/61588418034482/) | Working | HTTP 200; Muslims Entrepreneurs Manchester title. |
| [Brothers WhatsApp](https://chat.whatsapp.com/LN5moVwtJZADmKr7ijBiNH) | Working landing page | HTTP 200, “WhatsApp Group Invite”; actual joining and correct group identity require committee confirmation. |
| [Sisters WhatsApp](https://chat.whatsapp.com/Bupi8tfkIyc3GCqyHbwADU) | Working landing page | HTTP 200, “WhatsApp Group Invite”; same membership/identity limitation. |
| [Tally application](https://tally.so/r/ob4kAb) | Working | HTTP 200, “MES Committee Recruitment 2026/27”; public form state reports `isClosed: false`. |
| [Tally embed](https://tally.so/embed/ob4kAb?transparentBackground=1) | Working | HTTP 200, same recruitment title. No submission tested. |
| `mailto:mmu.mes@outlook.com` | Unable to verify delivery | Every MES email link uses this address; collaboration subject/body encoding is valid. Owner must confirm mailbox access and receipt. |
| [Laptop source](https://skfb.ly/6RVFt) | Redirecting, working | Redirects to [Aullwen's Laptop on Sketchfab](https://sketchfab.com/3d-models/laptop-7d870e900889481395b4a575b9fa8c3e), HTTP 200. |
| [CC BY 4.0 licence](http://creativecommons.org/licenses/by/4.0/) | Redirecting, working | HTTP → HTTPS; HTTP 200 licence deed. Original URL retained. |
| [Vercel privacy notice](https://vercel.com/legal/privacy-notice) | Working | HTTP 200; newly cited by the privacy draft. |
| [Tally privacy policy](https://tally.so/help/privacy-policy) | Working | HTTP 200; newly cited by the privacy draft. |
| [ICO complaints](https://ico.org.uk/make-a-complaint/) | Working | HTTP 200; newly cited by the privacy draft. |
| `https://mesmcr.com` | Unable to verify | DNS did not resolve during the check; production/domain setup is intentionally owner work after merge. |
| All five internal routes and internal anchors | Working locally | HTTP 200 on the branch's production server; navigation and anchor targets resolve. |

No confirmed broken existing link was found. **Recruitment availability is time-sensitive**: the form was open at the audit time; confirm again immediately before launch. Existing “Applications are open” wording was not changed.

### Vercel technical readiness and environment

The project uses Next.js 16.3.2, React 19.2.8, TypeScript, Tailwind 4, Three.js, React Three Fiber and Drei. Existing strict mode and typed routes are compatible with the successful production build. No `vercel.json`, custom server or infrastructure change is technically needed for these routes. [Vercel supports Next.js directly](https://vercel.com/docs/frameworks/full-stack/nextjs).

All public pages and metadata routes are statically prerendered. Page metadata stays in Server Components. Browser/WebGL work is isolated in Client Components, with the canvas dynamically loaded using `ssr: false`; its existing fallback is retained. Tally is a cross-origin iframe/direct link and email uses `mailto:`, without backend submission endpoints or secret keys. Images use local public paths; the GLB uses embedded buffers/images with no external resource URIs or Draco extensions. No asset prefix/base-path, localhost production URLs, filesystem runtime writes or application environment dependencies were found. Next.js image optimisation remains available through the hosting platform.

**Required application environment variables: none.** The only source environment check found is `NODE_ENV` for a development WebGL fallback, which Next.js manages. No Tally key, mail credential, analytics ID or domain environment variable is needed.

After review/merge and resolution of the launch items below, the owner should import the repository into Vercel with Next.js preset, repository root, `main` as production branch, locked dependency installation (`npm ci`), automatic output directory and build override **`npx next build --webpack`** to use the path validated here. The existing `npm run build` uses Next.js's default builder; a Turbopack build was not tested in this task. Select a supported Node version (local validation used Node 20.19.4; match a supported Vercel runtime), keep Web Analytics/Speed Insights disabled and verify preview access/indexing controls separately. Production metadata deliberately points to the eventual production domain, not preview hosts.

The owner must subsequently add the apex domain `mesmcr.com`, decide the `www` redirect, apply only the DNS values supplied by Vercel in GoDaddy and confirm HTTPS/redirects. No DNS values are guessed here and no platform settings were changed. Confirm Vercel plan eligibility first: [Hobby is limited to personal, non-commercial use](https://vercel.com/docs/plans/hobby); MES's eligibility has not been established.

### Validation

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npx next build --webpack` — passed using the unchanged font setup; all five public routes plus sitemap/robots prerendered successfully.
- `git diff --check` — passed.
- Production HTTP checks on `127.0.0.1:3199` — all five routes, unique metadata, canonical/OG URLs, X card tags, index/follow, internal paths and anchors passed.
- `/sitemap.xml` — HTTP 200, `application/xml`, exactly five production URLs.
- `/robots.txt` — HTTP 200, `text/plain`, `User-Agent: *`, `Allow: /`, correct sitemap URL.
- Existing SVG favicon, PNG sharing image and GLB — HTTP 200 with expected content types.
- Unknown route — HTTP 404 and `noindex`.
- Privacy visual check — desktop 1440 × 1000 and mobile 390 × 844; existing palette/type/layout retained, readable wrapping and no horizontal overflow at mobile width.
- Complete diff reviewed for unrelated changes; fonts, dependencies, assets, navigation, animations and other page render trees unchanged.

This does not certify deployed Vercel behaviour, real social preview rendering, email delivery or form submissions. The full cross-browser, accessibility and performance audit remains deferred as requested.

## Requires owner confirmation

### Privacy facts

Confirm the actual controller/legal identity and contact details, responsibility for privacy requests, who accesses the mailbox and Tally account, recipients (including any university/society sharing), lawful bases for each purpose, any legitimate-interest rationale if chosen, retention periods or real decision criteria, provider/processor arrangements, international transfers and safeguards. Do not fill these by assumption. The [ICO notice guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/individual-rights/the-right-to-be-informed/what-privacy-information-should-we-provide/) identifies the information organisations need to disclose.

The live Tally form requests full name, course, study year, email, team choice, motivations, skills/contribution, an idea, weekly availability and meeting commitment. All these questions are required; the final additional-information field is optional. No explicit religion question was observed, but free text or society participation may reveal religious beliefs; the committee must assess whether special-category processing occurs and identify an appropriate additional condition if it does. The public form shows save-for-later enabled, partial submissions disabled and no listed integrations; those observations do not establish private account settings, notification/export practices or actual browser storage behaviour.

The iframe is mounted on About even when its dialog is closed. Check live Tally requests, cookies/storage, provider settings and any required consent before launch; this task does not claim Tally is cookie-free or add a speculative consent banner. Also confirm application purposes, human/automated selection practices and the privacy information supplied at collection in the Tally form. The website itself has no automated recruitment decision code. Confirm the arrangements for published committee names/photos and event photography if they need coverage in the final notice.

### Fonts and licences

> Font inventory below is historical (pre-migration). See the README’s Private Webfonts and Builds section for the purchased WOFF2 retrieval system and Hanken Grotesk replacement. Historical TTF exposure and purchase-specific licence/canvas confirmation remain owner actions.

| Font | Loading / use | Licence findings |
| --- | --- | --- |
| Newsreader | `next/font/google`, Latin subset, variable; display/canvas text | Upstream [SIL OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/newsreader/OFL.txt); no commercial purchase requirement identified. |
| Manrope | `next/font/google`, Latin, weights 400–800; body/UI | Upstream [SIL OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/OFL.txt). |
| Montserrat | `next/font/google`, Latin, weights 700/800; brand type | Upstream [SIL OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/montserrat/OFL.txt). |
| Montserrat Regular | `next/font/local`, `src/assets/fonts/montserrat/Montserrat-Regular.ttf`, 400; laptop canvas | Bundled `OFL.txt` explicitly allows embedding subject to its terms; retain copyright/licence notices and verify provenance of this file. |
| Apparel Display Regular | `next/font/local`, `src/assets/fonts/Apparel Display Regular/Apparel Display Regular.ttf`, 400 | No licence evidence in repository. Confirm a valid web-embedding licence for the exact file/domain and any format-conversion restrictions; see [Latinotype Webfont EULA](https://www.latinotype.com/wp-content/uploads/Latinotype_EULA_Webfont_en.pdf). |
| Kommon Grotesk Regular | `next/font/local`, `src/assets/fonts/kommon-grotesk-regular/kommon-grotesk-regular.ttf`, 400 | No licence evidence in repository. Verify purchase/provenance and web-embedding terms for this exact file/domain; desktop ownership is insufficient. |
| TAN Headline Regular | `next/font/local`, `src/assets/fonts/TAN-Headline/TANHEADLINE-Regular.ttf`, 400; laptop canvas | No licence evidence in repository. Verify purchase/provenance and web-embedding terms for the exact file, including its use in canvas text. |

All fonts use `display: swap`. Local TTFs are bundled by Next.js and delivered to browsers, including those used to draw the canvas. A rendered canvas does not avoid web-embedding requirements when the font file is sent to the visitor. Preserve applicable OFL copyright/licence notices with font distribution. No font configuration/file/type styling was changed.

Google Fonts are fetched during production compilation and then self-hosted; visitors do not need Google Fonts requests for these configured families. **Builds still depend on external Google font downloads.** Both Webpack builds succeeded here with network access, which does not remove the previously reported intermittent failure risk. Local fonts require no external download. Any later font replacement is a separate owner-reviewed typography task.

## Must be resolved before public deployment

1. Approve and complete the privacy notice with actual controller, lawful-basis, retention, recipient/provider and transfer facts. Remove the draft marker only after the committee has supplied/approved those facts. Confirm Tally collection information and storage/consent requirements.
2. Establish valid web-embedding permission for Apparel Display, Kommon Grotesk and TAN Headline **before** any public deployment serving these files. Purchasing licences after launch would leave the launch period unresolved unless adequate permissions already exist. Possession of the TTFs proves no permission; the task cannot establish that the owner lacks licences either.
3. Resolve or document a verified platform-specific mitigation for existing runtime dependency advisories. `npm ci`/`npm audit` reported **10 affected dependency entries: 9 high, 1 critical**, including direct `next@16.3.2` and runtime `sharp@0.35.3`; `source-map-js` and development lint dependencies are also reported. No dependency/lockfile changes or blanket `npm audit fix` were made. Several advisories involve features this project does not use (Windows hosting, `next/og`, Draft Mode/cache and root catch-all pages), so audit counts do not prove this Vercel deployment is exploitable. Nonetheless, production Next.js/image-processing dependencies require a reviewed patched version or demonstrated mitigation before launch. Relevant primary advisories: [Next.js image optimisation/AVIF](https://github.com/advisories/GHSA-2xp9-vwfh-vxw4), [Next.js catch-all cache poisoning](https://github.com/advisories/GHSA-mcj8-r9mp-w47p), [sharp/librsvg](https://github.com/advisories/GHSA-wq5f-xc86-pv6w). Re-run validation after any dependency update.
4. Confirm an eligible Vercel plan, mailbox access, recruitment status and correct WhatsApp/community destinations. Complete the owner-controlled domain/HTTPS setup after merge and check the actual Vercel production build.

## Safe to defer until after deployment

- Dedicated landscape sharing graphic and optional additional favicon formats; the existing raster logo is already configured.
- Search Console submission and real sharing-platform preview checks once the domain is live.
- Full cross-browser, accessibility and performance audit, as requested.
- Known accepted iPhone Safari Journey stepping; unchanged.
- Optional font replacements/design refinements, provided existing embedding licences are settled before launch.

Google font build reliability is an acknowledged operational risk to check on the first Vercel build, not evidence of a failing build in this validation. Future offline/self-hosting changes would require a separate authorised task because font configuration is explicitly frozen here.
