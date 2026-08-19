# `IMPLEMENTATION_PLAN.md` — Muslim Entrepreneurs Website

**Product:** Muslim Entrepreneurs Website  
**Document:** Implementation Plan  
**Version:** 1.1 — University Society Revision  
**Date:** 19 August 2026  
**Target launch:** 22 September 2026  
**Primary implementation agent:** Codex  
**Human reviewer / developer:** Ateeq  
**Related documents:** `PRD.md` v2.2, `DESIGN.md` v1.1

---

## 1. Purpose

This document defines **how the MES website should be built and in what order**.

Before making significant product or visual decisions, read:

1. `PRD.md`
2. `DESIGN.md`
3. this document

The PRD is the product source of truth.

`DESIGN.md` is the visual and interaction source of truth.

This document defines the implementation workflow.

MES is currently the **Muslim Entrepreneurs university society at Manchester Metropolitan University**.

The website must not be implemented as the website of a CIC, independent external organisation, hypothetical external branch or national organisation.

Do not attempt to build the entire website in one pass.

The project should be implemented in **small visually reviewable phases**, with the highest-risk feature — the 3D hero — proven before the remainder of the site is built.

---

# 2. Core development principles

Throughout development:

- prioritise visual quality over unnecessary technical complexity;
- treat mobile performance as a release requirement;
- preserve graceful behaviour without WebGL;
- accurately represent MES as an MMU university society;
- allow the quality of the design to create prestige rather than artificial organisational positioning;
- avoid unnecessary dependencies;
- do not invent MES content;
- do not invent institutional relationships;
- keep content easy to update manually;
- build progressively;
- stop for human visual review at defined checkpoints;
- do not automatically commit or push to Git;
- do not build functionality excluded by the PRD.

The university-society identity is **not** a reason to reduce the site's visual ambition.

---

# 3. Do not build

Do **not** introduce:

- CIC/external-branch functionality;
- external-organisation positioning;
- admin dashboard;
- CMS;
- application database for site content;
- user accounts;
- public authentication;
- member system;
- custom event booking;
- payment processing;
- newsletter;
- blog;
- news system;
- gallery;
- page builder;
- complicated backend;
- individual pages for every event;
- 3D effects throughout the website.

Do not create architecture, routes or content in anticipation of a possible future CIC/external MES branch.

If implementation begins drifting toward any of these, stop.

---

# 4. Suggested project structure

Exact implementation may vary, but prefer a clear structure similar to:

```text
mes-website/
│
├── docs/
│   ├── PRD.md
│   ├── DESIGN.md
│   └── IMPLEMENTATION_PLAN.md
│
├── public/
│   ├── brand/
│   │   ├── mes-logo.*
│   │   └── ...
│   │
│   ├── models/
│   │   └── MES_Laptop.glb
│   │
│   ├── events/
│   ├── partners/
│   ├── people/
│   └── social/
│
├── src/
│   ├── app/
│   ├── components/
│   │   ├── hero/
│   │   ├── layout/
│   │   ├── sections/
│   │   └── ui/
│   │
│   ├── data/
│   │   ├── events.ts
│   │   ├── partners.ts
│   │   ├── testimonials.ts
│   │   ├── stats.ts
│   │   └── leadership.ts
│   │
│   ├── lib/
│   └── styles/
│
└── ...
```

Do not create excessive abstraction before it is useful.

---

# 5. Asset handling

The prepared laptop asset is:

```text
MES_Laptop.glb
```

Runtime destination:

```text
/public/models/MES_Laptop.glb
```

The Blender source:

```text
MES_Laptop.blend
```

is a working/source asset and does **not** need to be shipped to the public website.

The GLB contains a dedicated mesh:

```text
MES_Display
```

This mesh must remain separately targetable.

It will be used for:

- MES branding;
- three event photographs;
- final statement state;
- transition into the website.

The laptop also contains **MES branding on the rear of the display/lid**.

Preserve this branding.

Camera composition may make deliberate use of it where visually effective.

Do not modify the GLB geometry unless there is a demonstrated reason.

---

# 6. Attribution

The laptop model originated from a Creative Commons Attribution asset.

Before production launch, preserve the original attribution text and include suitable model credit somewhere appropriate, such as:

- site credits;
- footer legal area;
- source/code documentation.

Do not invent the attribution wording.

Use the exact credit information retained from the original model source.

---

# 7. Technology selection

Expected foundation:

- Next.js
- React
- TypeScript
- modern styling solution, likely Tailwind CSS
- Three.js / React Three Fiber for the hero

The exact scroll animation system should be chosen after considering the hero requirements.

Possible choices may include:

- GSAP / ScrollTrigger;
- Framer Motion;
- native/react-based scroll interpolation;
- another appropriate solution.

Do **not** automatically select GSAP merely because a scroll animation exists.

Choose the solution that best supports:

- reversible scroll control;
- R3F integration;
- maintainability;
- mobile performance;
- precise camera/model interpolation.

---

# 8. Dependency discipline

Before installing a package, ask:

> Does this materially simplify a requirement?

Avoid installing several overlapping animation/UI libraries.

For example, do not use:

- GSAP;
- Framer Motion;
- Lenis;
- another scroll library;
- another animation framework

all at once without a clear architectural reason.

Prefer the smallest sensible dependency set.

---

# 9. Phase 1 — Project foundation

Create the initial Next.js project and establish:

- TypeScript;
- routing;
- global styles;
- initial design tokens;
- font-loading strategy;
- responsive container system;
- base navigation;
- content directories;
- component directories.

Implement the core routes:

```text
/
/about
/events
/work-with-us
/privacy
```

At this stage, pages may contain placeholders.

Where basic metadata or placeholder copy identifies MES, describe it accurately as the **Muslim Entrepreneurs society at Manchester Metropolitan University**.

Do **not** build full sections yet.

---

# 10. Initial design tokens

Create CSS/design variables for the known MES colours:

```text
Cream       #EAE2D4
Deep Green  #01500B
Gold        #C29231
Muted Green #618C5D
```

Derive supporting neutrals only where required.

Do not introduce arbitrary extra brand colours.

---

# 11. Typography prototype

Test a small number of appropriate font combinations.

Target:

**premium editorial display font + modern sans-serif**

Do not spend excessive time cycling through dozens of fonts.

Assess:

- hero typography;
- large statements;
- body readability;
- mobile readability;
- brand compatibility;
- loading cost.

Once chosen, establish a clear type scale.

The typography should feel substantially more considered than a typical university-society website without attempting to imitate an unrelated luxury brand.

---

# 12. CHECKPOINT A — Foundation review

Stop after:

- base project works;
- routes exist;
- MES colours are configured;
- fonts are provisionally selected;
- navigation shell exists;
- basic MES positioning is accurate;
- no major errors exist.

Human reviewer should confirm the project foundation before major design construction.

Do not build the entire homepage before this review.

---

# 13. Phase 2 — Static hero composition

Before animating anything, create the opening hero as a **static composition**.

It should include:

- light MES background;
- 3D laptop;
- MES logo;
- oversized `MUSLIM ENTREPRENEURS` typography;
- floating navigation;
- optional subtle scroll indicator.

No scroll animation yet.

Goal:

> Prove the first viewport looks exceptional before spending time animating it.

The visual ambition should not be reduced because MES is a university society.

---

# 14. Load the GLB

Load:

```text
/public/models/MES_Laptop.glb
```

Verify:

- model renders correctly;
- materials look reasonable;
- scale is appropriate;
- camera composition works;
- rear MES branding renders correctly;
- there are no unexpected transforms;
- `MES_Display` can be found reliably.

Do not rely on fragile child-array indexes where a named mesh lookup is practical.

---

# 15. Test `MES_Display`

Before implementing hero animation, prove that `MES_Display` can display:

1. a plain test colour;
2. a test image;
3. the MES branding.

Ensure:

- UV orientation is correct;
- image isn't mirrored;
- aspect ratio is acceptable;
- colour management looks correct;
- screen does not visibly z-fight with the laptop;
- screen remains attached correctly during model transforms.

---

# 16. Lighting prototype

Use the simplest lighting capable of making the laptop look premium.

Explore:

- directional lighting;
- ambient/hemisphere lighting;
- simple environment lighting.

Avoid committing immediately to:

- large HDRIs;
- expensive reflections;
- dynamic shadows;
- heavy post-processing.

The clean scene should allow the laptop itself to dominate.

Lighting should also preserve the visibility and quality of the MES branding on the laptop where the rear surface is shown.

---

# 17. CHECKPOINT B — Hero static review

Stop.

Human reviewer should inspect:

- laptop scale;
- angle;
- lighting;
- rear laptop branding where visible;
- logo;
- typography;
- whitespace;
- general premium feel.

Do not start complex scroll animation until the opening frame is approved.

If the static composition looks mediocre, animation will not rescue it.

---

# 18. Phase 3 — Hero motion proof of concept

Create only enough motion to prove the central interaction.

First prototype:

```text
opening angle
      ↓
model/camera interpolation
      ↓
front-facing laptop
      ↓
camera approaches screen
      ↓
screen fills viewport
```

Do not implement all photography transitions yet.

The camera path may make use of the rear MES branding where doing so strengthens the sequence, but do not force this at the expense of composition.

---

# 19. Scroll requirements

The prototype must prove:

- scroll directly controls progress;
- reverse scrolling reverses progress;
- there are no major jumps;
- laptop motion is smooth;
- camera movement feels intentional;
- scroll remains familiar and usable;
- no uncontrolled autoplay takes over.

Desktop target hero length:

approximately **3–4 viewport heights**, subject to tuning.

---

# 20. Camera versus scale

Prefer real camera/model spatial movement over simply increasing CSS or object scale.

The desired illusion is:

> the visitor is approaching the laptop.

Avoid a result that obviously looks like:

> laptop.png got bigger.

---

# 21. Screen takeover prototype

The critical transition is:

```text
3D laptop
→ camera approaches MES_Display
→ bezel exits viewport
→ display fills viewport
→ normal DOM website continues seamlessly
```

This does not need final polish yet.

The technical proof should establish that it is viable without obvious visual discontinuity.

---

# 22. DOM transition strategy

The Vision/Mission section should exist as normal DOM content.

Do not attempt to render the entire actual website inside WebGL.

A likely strategy is:

- match final screen appearance;
- synchronise WebGL and DOM layers;
- cross-control opacity/position carefully;
- transition ownership from the WebGL screen to normal HTML.

Exact implementation may vary.

The visual result matters more than ideological purity.

---

# 23. CHECKPOINT C — Core 3D concept review

Stop when the following works:

- laptop starts at approved composition;
- scroll rotates/repositions it;
- camera approaches;
- screen fills viewport;
- transition to a placeholder normal section works;
- reversing scroll mostly works.

Human reviewer decides whether the core hero concept is convincing.

Do **not** continue with full-site development if this transition feels weak.

---

# 24. Phase 4 — Mobile hero proof

Immediately test the hero concept on mobile **before** polishing desktop further.

Do not leave mobile until the end.

Reference devices available:

- iPhone 14 Pro Max
- iPhone 13
- iPhone XS
- Samsung Galaxy S22
- Nothing Phone (1)

---

# 25. Mobile first-pass goals

Try to preserve:

- real laptop GLB;
- real scroll-controlled camera movement;
- screen takeover;
- smooth reverse scrolling.

Create a portrait-specific composition.

Do not simply shrink desktop coordinates.

---

# 26. Performance metrics to observe

During real-device testing, assess:

- initial page responsiveness;
- obvious loading delay;
- scroll smoothness;
- frame drops;
- touch responsiveness;
- device heating;
- Safari/Chrome rendering behaviour;
- screen-texture loading;
- transition smoothness.

Use developer profiling tools where useful, but human-perceived quality is also important.

---

# 27. Mobile optimisation order

If performance is insufficient, optimise in this order:

1. reduce WebGL pixel ratio;
2. reduce texture resolution;
3. simplify lighting;
4. remove/avoid expensive shadows;
5. reduce continuous rendering;
6. simplify nonessential effects;
7. shorten mobile hero duration;
8. simplify image transitions;
9. only then consider stronger fallback behaviour.

Do not jump directly to replacing the real laptop with a static image.

---

# 28. iPhone XS decision

Do not classify the iPhone XS as unsupported automatically.

Test it.

If it performs acceptably, retain 3D.

If it performs poorly, document which simplification meaningfully improves it.

Fallback should be based on observed capability rather than arbitrary model-age detection.

---

# 29. Loading architecture

Do not make the page wait for the 3D scene before showing anything.

Prefer:

```text
HTML/CSS shell renders
→ hero placeholder/composition appears
→ 3D loads
→ 3D becomes active
```

The site must remain navigable even if WebGL fails.

---

# 30. Loading screen

Do **not** implement the MES-logo loading animation initially.

Only revisit it if real testing demonstrates a visible loading gap that cannot be solved more elegantly.

If needed later, the approved concept is:

> MES logo gradually filling vertically with colour.

---

# 31. CHECKPOINT D — Mobile viability review

Stop once desktop and mobile hero prototypes work.

Human reviewer should test real devices.

Decision:

- continue with full 3D;
- reduce mobile quality;
- alter the mobile camera path;
- introduce specific fallback behaviour if demonstrably needed.

Do not make this decision without actual testing.

---

# 32. Phase 5 — Production hero

Only after the previous checkpoints are approved should the hero receive full polish.

Implement the complete storyboard from `DESIGN.md`.

Screen sequence:

```text
MES branding
→ Event image 1
→ Event image 2
→ Event image 3
→ statement
→ website
```

---

# 33. Event image transitions

Experiment with elegant techniques such as:

- directional masks;
- crop reveals;
- sliding layers;
- transition tied to model rotation;
- screen-relative wipes.

Avoid generic slideshow fades unless they genuinely look best.

Keep implementation performant.

---

# 34. Statement moment

Near the front-facing stage, show the short statement.

Conceptual text:

> **Built by Muslims.**  
> **For Muslims with ambition.**

Treat wording as editable content.

The existence and timing of the statement are more important than this exact sentence.

Do not introduce language here that implies MES is a separate external organisation.

---

# 35. Hero polish

Refine:

- easing;
- scroll distance;
- typography timing;
- navigation visibility;
- screen transitions;
- laptop framing;
- rear-brand visibility where useful;
- mobile camera positions;
- loading state;
- reduced motion;
- resize handling.

Avoid premature micro-optimisation until motion feels visually correct.

---

# 36. Reduced-motion hero

Implement a deliberately designed reduced-motion variant.

Possible structure:

- static premium laptop composition;
- MES branding;
- minimal fade/reveal;
- normal transition into content.

Do not leave users with a blank or visually broken hero.

---

# 37. CHECKPOINT E — Final hero review

This is a major milestone.

Before building the full homepage, review:

### Desktop

- first impression;
- typography;
- laptop lighting;
- scroll feel;
- image sequence;
- screen takeover.

### Mobile

- visual composition;
- performance;
- heat;
- responsiveness;
- portrait framing.

### Accessibility

- reduced motion;
- keyboard/nav behaviour;
- content still exists outside canvas.

### Positioning

- nothing in the experience falsely implies that MES is a CIC or independent external organisation;
- the visual ambition remains substantially above a generic university-society website.

Proceed only when the hero is worth building the rest of the site around.

---

# 38. Phase 6 — Vision and Impact

Build the first two normal content sections.

### Vision / Mission

Use:

- oversized editorial statement;
- generous whitespace;
- restrained copy.

The final content should explain MES's purpose while accurately grounding it as the Muslim entrepreneurship society at MMU.

### Impact

Use:

- deep-green takeover;
- large verified statistics;
- `Since 2024`;
- restrained count-up animation.

Do not use generic stat cards.

Statistics represent the achievements of the MES university society.

---

# 39. CHECKPOINT F — Visual system review

Review the hero → Vision → Impact sequence as one experience.

This determines whether the **2D website is visually strong enough to follow the 3D hero**.

If the quality drops dramatically after the hero, fix it before continuing.

Also verify that university positioning feels natural rather than either:

- hidden;
- excessively institutional.

---

# 40. Phase 7 — Story and human moment

Build the organisational growth roadmap.

Prioritise:

- MES's founding and development at MMU;
- meaningful milestones;
- growth in events/community;
- partnerships and collaborations;
- visual progression.

Do not simply duplicate the event archive.

Do not imply that the story culminates in a CIC or external organisation.

Then build the deliberate people/community transition with a strong photograph and statement.

---

# 41. Phase 8 — Featured experiences

Build three large event treatments.

Do not start with reusable card components.

First establish what the strongest event presentation looks like.

Each event may use a different composition while sharing underlying data.

Event content should come from:

```text
src/data/events.ts
```

or equivalent.

---

# 42. Event data model

Keep it straightforward.

For example:

```ts
type Event = {
  id: string
  title: string
  date: string
  description: string
  image: string
  featured: boolean
  upcoming: boolean
  ticketUrl?: string
  attendance?: number
}
```

Only add properties when actual requirements demand them.

Do not create a generic CMS schema.

---

# 43. Phase 9 — Network and partnerships

Implement:

- partners;
- societies;
- businesses worked with;
- logo marquee.

Store data separately from components.

For example:

```text
src/data/partners.ts
```

Categories must reflect the real relationship accurately.

Do not convert collaborations into formal partnerships merely because stronger wording appears more impressive.

---

# 44. Phase 10 — University context

Implement the MMU/Students' Union/ISoc context in the manner approved by `PRD.md` and `DESIGN.md`.

This does **not** necessarily require a standalone homepage section.

The information may be integrated naturally through:

- Vision/Mission;
- story;
- About;
- partner/society areas;
- footer.

MES remains visually dominant.

Institutional logos should support the explanation rather than turn the website into an institutional template.

Do not use old positioning that deliberately delays the university identity in order to make MES appear independent.

---

# 45. Phase 11 — Work With Us

Build the homepage conversion section first.

Then build:

```text
/work-with-us
```

V1 uses a universal collaboration message centred around:

- sponsorship;
- event partnerships.

The proposition should accurately explain what sponsors, businesses and entrepreneurs can gain from working with the **MES university society and its audience/community**.

Avoid splitting this into complicated separate funnels.

---

# 46. Contact implementation

Current contact:

```text
mmu.mes@outlook.com
```

Prefer the simplest reliable solution.

If a lightweight form can be implemented cleanly and securely, it may be used.

If doing so introduces unnecessary backend complexity, a polished email CTA is acceptable for V1.

Do not introduce a database or CRM for this.

---

# 47. Phase 12 — Community section

Build the homepage community area.

Actions:

- Join WhatsApp Community
- Follow Instagram
- See Upcoming Events
- Book Tickets when relevant
- Apply to Committee when applications are open

Do not build a dedicated Community page.

The section may communicate the student/community nature of MES more directly than the commercial sections.

---

# 48. Phase 13 — Supporting pages

Implement:

### `/about`

- expanded vision;
- MES's founding/development at MMU;
- organisational story;
- university/Greater Manchester context;
- leadership;
- LinkedIn icons for leadership.

### `/events`

- next upcoming event;
- expandable archive;
- no individual event pages.

### `/privacy`

- only describe services/data actually used.

Do not add a page describing a future CIC/external branch.

---

# 49. Leadership data

Store leadership in structured data.

Example:

```ts
type Leader = {
  name: string
  role: string
  image: string
  linkedinUrl?: string
}
```

Render only the current heads.

Use their actual society roles.

Do not substitute invented corporate titles merely to make MES appear more like a company.

No historical committee system.

---

# 50. Phase 14 — Motion refinement

After all content exists, add post-hero motion selectively.

Good candidates:

- editorial text reveal;
- stat count-up;
- story progression;
- image masks;
- event transitions;
- logo marquee;
- restrained hover states.

Do not animate every element simply because motion is available.

---

# 51. Phase 15 — Responsive pass

Perform a dedicated responsive pass rather than fixing layouts ad hoc forever.

Review:

- large desktop;
- laptop;
- tablet landscape;
- tablet portrait;
- common mobile widths.

Check:

- typography collisions;
- image crops;
- content order;
- nav behaviour;
- oversized text;
- section heights;
- event layouts;
- partner marquee;
- roadmap.

---

# 52. Phase 16 — Accessibility pass

Target WCAG 2.2 AA.

Check:

- headings;
- landmarks;
- keyboard navigation;
- focus visibility;
- menu accessibility;
- link/button semantics;
- image alt text;
- contrast;
- form labelling;
- error states;
- reduced motion.

Do not assume accessibility solely from automated tooling.

---

# 53. Phase 17 — Performance pass

Profile separately on desktop and mobile.

Focus especially on:

- JavaScript payload;
- Three.js bundle;
- WebGL render loop;
- model load;
- image payload;
- fonts;
- hero textures;
- excessive client components;
- layout shift.

The hero should not continue drawing aggressively after it is no longer relevant.

---

# 54. Image optimisation

Use modern image delivery where practical.

For normal website images:

- use framework image optimisation where appropriate;
- specify dimensions;
- avoid shipping huge originals unnecessarily;
- lazy-load below-the-fold imagery.

For `MES_Display` textures:

- prepare sensible sizes;
- avoid loading enormous social-media originals directly into WebGL;
- preload only what the hero actually needs.

---

# 55. Font performance

Avoid a large font family with many unused weights.

Load only required styles/weights.

Prefer self-hosting or an efficient framework-supported method where appropriate.

Do not sacrifice the site's initial load for marginal typographic variants.

---

# 56. SEO pass

Before release ensure:

- page titles;
- descriptions;
- canonical URLs;
- Open Graph;
- social image;
- sitemap;
- robots;
- favicon;
- crawlable headings/content.

The site must remain meaningful to search engines without executing the 3D scene.

SEO metadata should identify MES accurately as a **Muslim entrepreneurship society based at Manchester Metropolitan University**.

Do not use metadata that presents MES as an independent external organisation.

---

# 57. Analytics

Add privacy-conscious analytics only after the core product works.

Track useful interactions such as:

- Work With Us;
- ticket clicks;
- WhatsApp clicks;
- social clicks;
- committee application clicks;
- enquiry conversion if a form exists.

Avoid adding several analytics systems.

---

# 58. Browser testing

Test current:

- Safari;
- Chrome;
- Firefox;
- Edge.

Give special attention to:

- Safari/WebGL behaviour;
- mobile Safari viewport sizing;
- scroll-linked animation;
- resizing/orientation;
- texture rendering.

---

# 59. Content policy for Codex

Codex must never invent:

- attendance figures;
- social reach;
- money raised;
- event details;
- partner relationships;
- testimonials;
- leadership details;
- speaker names;
- university claims;
- Students' Union relationships;
- ISoc relationships;
- external/CIC status.

Use explicit placeholder values such as:

```text
[TBD — VERIFIED TOTAL ATTENDANCE]
```

rather than plausible-looking fake data.

Where the exact institutional relationship is not yet supplied, use a clear placeholder rather than attempting to infer it.

---

# 60. Organisational truth policy

For all copy, metadata and UI:

MES should be treated as the **university Muslim Entrepreneurs society at Manchester Metropolitan University**.

Do not describe MES as:

- a CIC;
- a company;
- an independent external organisation;
- a national organisation;
- an umbrella organisation with a university branch.

Do not use vague wording specifically to create that impression.

This does not prevent the site from communicating:

- ambition;
- professionalism;
- external collaborations;
- business relationships;
- Greater Manchester activity;
- sponsor opportunities;
- community reach.

Prestige should come from **design quality and evidence**, not organisational ambiguity.

---

# 61. Content update architecture

Content will be updated manually approximately monthly.

Make that easy.

A normal update should ideally look like:

1. edit a data file;
2. add/replace an image;
3. run the site;
4. verify;
5. commit;
6. deploy.

Do not require component edits for routine events/partners/testimonials.

---

# 62. Human review checkpoints

Codex should stop and request visual review after:

1. foundation;
2. static hero composition;
3. 3D screen-takeover proof;
4. mobile hero proof;
5. production hero;
6. Vision + Impact;
7. main homepage;
8. supporting pages;
9. final responsive/performance pass.

Do not interpret this as requiring permission after every tiny change.

The goal is to prevent many hours of work being built on top of a visually weak decision.

---

# 63. Codex visual autonomy

Within approved phases, Codex has permission to:

- experiment;
- adjust layouts;
- change camera curves;
- choose better transitions;
- alter typography positioning;
- improve visual balance.

It should not continuously stop to ask about trivial visual details.

Use the PRD and DESIGN specification as the boundary.

It does **not** have autonomy to change MES's organisational identity or invent a more commercially impressive structure.

---

# 64. When Codex should ask

Stop and ask only where a decision would materially alter:

- product scope;
- navigation;
- content truth;
- organisational/institutional positioning;
- major visual concept;
- data/privacy behaviour;
- deployment architecture;
- paid service requirements.

Small implementation choices do not require approval.

---

# 65. Skills and plugins

Codex may use multiple relevant installed skills where useful.

Likely useful categories include:

- frontend application building;
- React/Next.js best practices;
- UX/design review;
- frontend testing/debugging.

Do not force a skill into the workflow simply because it is installed.

Use whichever tools materially improve the phase currently being implemented.

---

# 66. Testing approach

Automated tests are useful where behaviour warrants them, but this is primarily a visually driven public website.

Do not build an oversized test suite for static presentation.

Prioritise testing for:

- navigation;
- event-data behaviour;
- expandable event archive;
- form behaviour if present;
- critical utility functions;
- important accessibility interactions.

Visual review and real-device testing are essential.

---

# 67. Build/lint policy

Codex does **not** need to interrupt every visual iteration to run every check.

However:

- run lint/build at sensible milestones;
- production build must pass before release;
- console errors should be resolved;
- TypeScript errors must not be ignored.

---

# 68. Git policy

Codex must **not automatically commit or push**.

At an approved checkpoint, provide commands similar to:

```bash
git status
git add .
git commit -m "feat: implement 3D hero prototype"
git push
```

Use a commit message appropriate to the actual work.

Ateeq will run the commands manually.

---

# 69. Commit strategy

Prefer meaningful checkpoints over tiny commits for every CSS adjustment.

Examples:

```text
chore: initialise MES website
feat: add static 3D hero composition
feat: implement scroll-driven laptop transition
feat: build homepage impact and story sections
feat: add events and work-with-us pages
perf: optimise mobile 3D experience
fix: final responsive and accessibility issues
```

---

# 70. Deployment workflow

Use Vercel initially for preview/test deployment.

Do not make production hosting a blocker during development.

Later:

- confirm `mesmcr.com`;
- configure DNS;
- redirect `www` appropriately;
- evaluate final hosting setup.

Domain registrar and hosting provider need not be the same company.

---

# 71. Pre-launch content checklist

Before production launch, replace all placeholders for:

- tagline;
- vision/mission;
- impact figures;
- hero photography;
- featured events;
- testimonials;
- partner logos;
- leadership;
- LinkedIn URLs;
- social links;
- WhatsApp link;
- event ticket URLs;
- model attribution;
- contact information;
- MMU/Students' Union/ISoc relationship wording.

Search the codebase for:

```text
TBD
PLACEHOLDER
TODO
```

before release.

Also search for outdated organisational language such as:

```text
CIC
external branch
independent organisation
national organisation
Built beyond campus
```

and manually verify any occurrence is intentional and accurate.

---

# 72. Pre-launch technical checklist

Before launch:

- production build passes;
- no important console errors;
- hero tested on physical phones;
- hero works when scrolling backwards;
- reduced-motion mode works;
- site works without WebGL;
- navigation works;
- mobile menu works;
- images load properly;
- links verified;
- forms/contact verified;
- SEO metadata present;
- privacy page matches implementation;
- attribution included;
- analytics confirmed;
- no accidental secrets in client code;
- no development-only logging;
- no unused giant assets.

---

# 73. Pre-launch visual and positioning checklist

Ask:

- Does the first viewport look genuinely premium?
- Is the laptop still impressive on mobile?
- Does the page feel fast?
- Does the 2D site maintain quality after the hero?
- Is gold restrained?
- Is cream still the dominant identity?
- Are portrait photographs being used intentionally?
- Does anything look like generic AI-generated SaaS UI?
- Does anything look like a generic Students' Union society template?
- Are there too many cards?
- Are animations helping rather than distracting?
- Is any section boring compared with the others?
- Does the site still clearly serve sponsors/businesses?
- Can a visitor understand that MES is based at Manchester Metropolitan University?
- Does the site accidentally imply MES is a CIC or independent external organisation?
- Does the university identity feel confidently integrated rather than apologetically hidden?
- Does MES remain the dominant visual brand?

Do not launch until the answer is satisfactory.

---

# 74. Feature freeze

Aim to stop adding major features around:

**15–17 September 2026**

if targeting the 22 September launch.

After feature freeze, focus on:

- performance;
- responsive polish;
- bugs;
- accessibility;
- browser compatibility;
- copy;
- imagery;
- SEO.

Do not jeopardise the final site for a last-minute unnecessary feature.

---

# 75. Definition of done

The project is ready to launch when:

### Hero

The 3D experience is impressive, smooth and responsive.

### Mobile

The tested phones provide an acceptable experience without frustrating waits or major stutter.

### Public site

Home, About, Events and Work With Us feel complete.

### Content

No fabricated or placeholder public content remains.

### Positioning

Visitors accurately understand MES as the Muslim entrepreneurship society at Manchester Metropolitan University.

The website does not imply that MES is currently a CIC, independent external organisation or hypothetical larger umbrella organisation.

### Conversion

Visitors can clearly discover events, community routes and partnership contact.

### Technical quality

Build, accessibility, responsive design and major browser behaviour are sound.

### Brand

The site looks recognisably like **Muslim Entrepreneurs** — not a template with MES colours pasted onto it, and not a generic university-society website.

---

# 76. Initial instruction for Codex

When implementation begins, give Codex something along these lines:

> Read `docs/PRD.md`, `docs/DESIGN.md`, and `docs/IMPLEMENTATION_PLAN.md` completely before making changes. Treat them as the project source of truth.
>
> MES is the Muslim Entrepreneurs university society at Manchester Metropolitan University. Do not position MES as a CIC, independent external organisation, national organisation or hypothetical external branch. Do not invent institutional relationships or MES facts.
>
> Do not build the whole website yet.
>
> Begin with **Phase 1 only**: establish the project foundation and prepare the structure required for the later 3D hero. Do not add an admin dashboard, CMS, database, public authentication, blog, newsletter, custom ticketing, external-branch functionality or other excluded scope.
>
> Preserve mobile performance as a first-class requirement. The site's university-society identity should be represented accurately without reducing the premium visual ambition defined in `DESIGN.md`.
>
> Do not commit or push changes yourself. When Checkpoint A is reached, stop. Explain what changed, what I should visually inspect, any decisions you made that I should know about, and provide the Git commands and proposed commit message for me to run manually.

---

## Implementation status

| Phase | Status |
|---|---|
| Product requirements | ✅ Complete — PRD v2.2 |
| Design specification | ✅ Complete — DESIGN v1.1 |
| Implementation plan | ✅ Complete — v1.1 |
| University positioning | ✅ Revised |
| CIC/external branch | ❌ Outside scope |
| Laptop GLB | ✅ Ready |
| Laptop Blender source | ✅ Ready |
| Rear MES laptop branding | ✅ Ready/documented |
| Other assets preparation | 🟡 Partial |
| Project foundation | ⚪ Not started |
| Static hero | ⚪ Not started |
| 3D proof | ⚪ Not started |
| Mobile proof | ⚪ Not started |
| Production hero | ⚪ Not started |
| Homepage | ⚪ Not started |
| Supporting pages | ⚪ Not started |
| Responsive QA | ⚪ Not started |
| Performance QA | ⚪ Not started |
| Launch | ⚪ Not started |

---

## Final implementation instruction

> **Build the website for the MES that exists now: the Muslim Entrepreneurs society at Manchester Metropolitan University. Do not design architecture or public positioning around an uncertain future CIC/external branch. The university identity should be accurate and confident, while the execution should remain far more ambitious and polished than a conventional student-society website. Let the design quality, real events, verified impact, partnerships, testimonials and community create credibility. Build progressively, prove the 3D experience early, test mobile before committing to the production hero, and stop at the defined visual checkpoints rather than racing through the entire website.**
