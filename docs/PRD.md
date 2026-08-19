# Muslim Entrepreneurs Website — Product Requirements Document

**Product:** Muslim Entrepreneurs Website  
**Version:** 2.2 — University Society Revision  
**Date:** 19 August 2026  
**Target launch:** 22 September 2026  
**Developer:** Ateeq  
**Primary implementation agent:** Codex  
**Status:** Requirements complete / ready for design specification update

---

## 1. Product vision

The website will be the premium digital home of **Muslim Entrepreneurs (MES)**, the university Muslim entrepreneurship society based at **Manchester Metropolitan University**.

The website should establish MES as an unusually ambitious, professionally run and credible university society. Its university identity should be communicated confidently rather than hidden, while the quality of the website, events and partnerships should demonstrate that MES operates to a standard beyond what visitors may normally expect from a student society.

The website has three primary objectives:

1. **Establish credibility** — make MES immediately feel serious, ambitious and professionally run.
2. **Attract sponsors, businesses and established Muslim entrepreneurs** — make organisations and professionals want to engage with and support the society.
3. **Showcase MES's work** — communicate its events, impact, partnerships and community.

A secondary objective is to serve students and young Muslims interested in entrepreneurship by helping them discover MES, attend events, join the community, follow its social channels and apply for committee opportunities when available.

The intended first reaction is:

> **“This website is insane.”**

The intended reaction after exploring is:

> **“MES is a serious university society doing worthwhile work.”**

The first impression earns attention.  
The rest of the site earns trust.

The website should demonstrate that being university-based does not limit the quality, ambition or professionalism of MES.

---

## 2. Organisational positioning

MES is specifically a **university society at Manchester Metropolitan University**.

The website is not being built as the website of a separate CIC, external branch or independent organisation.

Any future external/CIC initiative is outside the scope of V1 and should not influence the site's information architecture, organisational claims or public positioning unless that initiative is formally established later.

MES's university identity should therefore be presented accurately and naturally throughout the site.

This does **not** mean the website should resemble a conventional university-society website.

The intended positioning is:

> **A premium, ambitious Muslim entrepreneurship society based at Manchester Metropolitan University.**

MES may work with:

- businesses;
- entrepreneurs;
- sponsors;
- other societies;
- Islamic societies;
- university organisations;
- community organisations.

These external relationships should demonstrate the society's reach and activity without implying that MES itself is currently an independent external organisation.

---

## 3. Geographic positioning

MES is based at **Manchester Metropolitan University** and operates primarily within **Greater Manchester**.

The site does not need to present MES as a national organisation or be designed around hypothetical expansion across the UK.

Preferred domain:

**`mesmcr.com`**

subject to final team approval.

The domain may use the broader Manchester identity while the website itself clearly explains MES's MMU basis.

---

## 4. Target audiences

### Primary: Sponsors and businesses

They should quickly understand:

- what MES is;
- its mission;
- who it reaches;
- its university/student audience;
- its track record;
- its impact;
- who it has worked with;
- how collaboration could benefit both sides;
- how to contact MES.

Primary CTA:

**Work With Us**

### Primary: Established Muslim entrepreneurs

The site should make MES appear worth engaging with through:

- speaking;
- sponsorship;
- event partnerships;
- mentoring or knowledge-sharing where relevant;
- collaboration;
- engagement with the student Muslim entrepreneurship community.

### Primary/secondary: Students and young Muslims

They should be able to:

- understand MES;
- discover upcoming events;
- obtain tickets where applicable;
- join the WhatsApp community;
- follow Instagram, LinkedIn and TikTok;
- apply to the committee when applications are open.

The website should primarily serve the MMU MES community while remaining accessible and credible to relevant visitors beyond the university.

MES has **no formal website membership system**.

Do not use language such as:

**Become a Member**

unless MES later establishes an actual membership journey requiring it.

Prefer:

- Join the Community
- Join WhatsApp
- Attend an Event
- Follow MES
- Apply to the Committee

---

## 5. Brand direction

The visual character, in priority order, should feel:

**Premium → Elegant → Luxurious → Corporate → Energetic → Technological → Experimental → Youthful → Futuristic**

The site is a **premium society and entrepreneurship brand website**, not a conventional university-society template.

Three words describing the desired result:

> **Premium. Polished. Wow.**

Explicit visual anti-goals:

> **Vibecoded. Boring. Basic.**

Where technical spectacle conflicts with visual quality or usability:

> **Beauty and usability win.**

The university-society positioning should not be interpreted as permission to lower the visual ambition.

Interactions should feel **polished rather than playful**.

---

## 6. Brand identity

Existing MES branding should be retained and elevated.

Current colours:

- Cream — `#EAE2D4`
- Deep green — `#01500B`
- Gold — `#C29231`
- Muted green — `#618C5D`

These are the core brand colours, not a requirement for every section to use all four equally.

Additional neutrals and tonal variants may be created as part of the digital design system.

The logo currently exists as a 500×500 Canva design and can be exported in the most suitable format.

### Islamic identity

The site's Muslim identity should primarily come through:

- MES itself;
- its audience;
- its work;
- photography;
- values;
- community.

Subtle Islamic geometric influence is acceptable where elegant.

Avoid forced crescents, mosque motifs or decorative Islamic clichés.

Arabic is not required.

Public-facing copy should remain professionally written.

---

## 7. Copy tone

Use **British English**.

Writing should feel:

- confident;
- ambitious;
- professional;
- human;
- community-focused;
- concise.

Use **“we”** naturally.

MES may proudly refer to itself as a society where relevant. Do not artificially replace accurate university terminology merely to sound more corporate.

Avoid:

- empty corporate jargon;
- unsupported grand claims;
- generic startup buzzwords;
- excessively informal/student-like language.

Strong positioning claims are acceptable where they are factually defensible.

---

# 8. Core experience

The site has two distinct modes.

### A. Cinematic introduction

The homepage opens with the technically ambitious 3D laptop experience.

This is where the greatest visual experimentation should happen.

### B. Premium society website

After the hero, the site should become:

- lighter;
- fast;
- clear;
- photography-led;
- easy to navigate;
- focused on evidence and credibility.

Do **not** attempt to place heavy 3D throughout the rest of the site.

---

# 9. 3D laptop asset

Existing production asset:

`MES_Laptop.glb`

Approximate size:

**491 KB**

Editable source:

`MES_Laptop.blend`

Dedicated screen mesh:

`MES_Display`

`MES_Display` must remain separately addressable so website code can place MES branding and photography on the screen without modifying the original model.

The laptop also includes **MES branding on the rear of the display/lid**.

This branding should be preserved.

Camera compositions may make deliberate use of the rear MES branding where doing so strengthens the hero composition.

---

# 10. Hero opening

The laptop should already be visible when the visitor lands.

It should dominate a **clean scene** rather than appearing amongst particles, floating objects or decorative 3D clutter.

The exact initial camera angle should be explored visually.

The background should primarily explore MES's **light brand colours**, rather than defaulting to a generic black 3D environment.

Lighting may be realistic or stylised depending on what looks strongest.

---

# 11. Hero typography

**Muslim Entrepreneurs** should likely be visible from the opening frame.

Its exact positioning should be tested visually.

Possibilities include:

- behind the laptop;
- beside it;
- partially obscured by it;
- integrated into the composition.

Opening copy should remain minimal.

Do not place a major CTA in the cinematic hero.

A subtle **scroll cue** may be used.

---

# 12. Hero scroll sequence

The hero must be **scroll-controlled**.

Scrolling backwards should reverse the animation naturally.

It must not simply trigger a one-way autoplay sequence.

### Stage 1 — Arrival

- laptop already visible;
- MES identity visible;
- MES branding displayed;
- transparent/floating navigation.

### Stage 2 — Exploration

As scrolling begins:

- laptop orientation changes;
- camera/model positioning changes;
- laptop may move subtly across the composition;
- screen imagery changes;
- rear MES branding may become visible where appropriate to the chosen camera path.

Movement should feel art-directed, not like a generic rotating 3D model demo.

### Stage 3 — MES imagery

Use **three images maximum** during the hero.

For V1:

- photography only;
- no hero video;
- imagery should generally speak for itself;
- no unnecessary text over each image.

### Stage 4 — Approach

The laptop gradually moves toward a near-front-facing composition.

The intended illusion is that the **camera is moving towards the laptop**, not merely that the model is being scaled up.

### Stage 5 — Screen takeover

The camera continues approaching until the bezel moves beyond the viewport edges and the display effectively occupies the screen.

### Stage 6 — Enter MES

The laptop screen becomes the visual bridge into the real website.

The user should feel as though they have moved:

> **through the laptop screen into MES.**

The transition should be seamless rather than an obvious cut.

Destination:

**Vision & Mission**

---

# 13. Navigation

Navigation is present from the beginning.

### During the hero

- floating;
- transparent;
- no background;
- unobtrusive.

### After the hero

It gains a proper light navigation surface.

Desktop navigation:

**Home · About · Events · Work With Us**

Primary navbar CTA:

**Work With Us**

Mobile should use a polished **full-screen menu**.

---

# 14. Homepage story

Recommended homepage narrative:

1. 3D Hero
2. Vision & Mission
3. Lifetime Impact
4. Featured Events
5. MES Story / What We Do
6. Testimonials
7. Partners / Societies / Businesses
8. Work With Us
9. Upcoming Event / Community
10. Leadership
11. Footer

The intended visitor journey is:

> **Understand who we are → Understand our purpose → See our impact → See our work → See who trusts us → Work with us or join the community**

Exact ordering may still change if visual design reveals a better storytelling sequence.

---

# 15. Vision and mission

This is the first substantive section after the 3D experience.

It should communicate:

- why MES exists;
- what it wants to achieve;
- who it serves;
- its MMU/student foundation;
- its Greater Manchester context where relevant.

MES currently has no final official tagline or public mission statement.

Final wording will be produced and approved during the content phase.

---

# 16. About page

Dedicated route:

`/about`

The story should be presented creatively rather than as one large paragraph.

A visual progression/roadmap is encouraged, for example:

**Founded at MMU in 2024**  
↓  
**Why MES was created**  
↓  
**What the society has built**  
↓  
**Where MES is heading**

The MMU and ISoc context should be explained accurately as part of the MES story rather than deliberately delayed to preserve an independent-organisational impression.

Relevant MMU/ISoc branding may appear where it adds context.

MES should remain the primary visual brand of its own website.

---

# 17. Impact

Use **verified lifetime statistics**.

Required categories:

- total events;
- total attendees;
- money raised;
- social views/reach.

Include:

**Since 2024**

Statistics may animate upward as they enter the viewport.

No statistic should be estimated or invented merely to complete a design.

Where useful, the context should make clear that these are achievements of the MES university society.

---

# 18. Events

Dedicated route:

`/events`

The events experience should be a **visual archive with expandable entries**, not a wall of generic cards.

No event categories are necessary for V1.

### Upcoming events

Upcoming events should appear when available.

Each event may have its own configurable external ticket/registration link.

If there are no upcoming events, direct users toward:

- Instagram;
- WhatsApp community.

---

# 19. Featured events

Homepage should support up to **three featured events**.

Current candidates:

1. Ramadhan Bazaar
2. Halal Business Series
3. How to Keep Learning to Stay Ahead with Saffana Teaches Comms

The third is not considered permanently flagship and should be replaced once stronger 2026/27 events become available.

Featured events are controlled simply through structured site data.

---

# 20. Photography

MES has permission to use existing event photography.

Most existing images are portrait-oriented because they were primarily captured for social media.

The design must work intelligently with portrait assets rather than assuming everything is 16:9.

There is **no dedicated Gallery page**.

Photography should instead be used selectively through:

- hero;
- events;
- About;
- testimonials where appropriate.

Avoid covering every section in imagery.

---

# 21. Partners, societies and businesses

Current approximate inventory:

- 12 partners;
- 3 societies;
- 15 Bazaar businesses.

Most have logos available.

Relationship types should be described accurately.

Do not put every organisation under **Our Partners** if the relationship was not actually a partnership.

Possible groupings:

- Partners
- Societies
- Businesses We've Worked With

The site's university positioning does not change the requirement for accurate relationship labels.

---

# 22. Logo marquee

Use a slow, continuous horizontal logo rail.

Requirements:

- smooth;
- restrained;
- infinite-feeling;
- non-interactive;
- clearly categorised where required.

It should function as social proof, not as a visual gimmick.

---

# 23. Testimonials

Homepage should include approximately **3–5 strong testimonials**.

Priority sources:

- established entrepreneurs;
- speakers;
- sponsors;
- businesses.

Where permission exists, include:

- portrait;
- name;
- role/company;
- quote.

Professional external testimonials are particularly valuable because they demonstrate the credibility and quality of MES's university activity.

---

# 24. Work With Us

Dedicated route:

`/work-with-us`

Primary collaboration types:

- Sponsorship
- Event partnerships

The page should clearly communicate that organisations are collaborating with or sponsoring the **MES university society**.

Future sponsorship-pack functionality may be added later.

It is not required for V1.

---

# 25. Enquiry form

Suggested fields:

- Name
- Organisation
- Email
- Enquiry type
- Message

Current destination email:

**`mmu.mes@outlook.com`**

This can later be replaced by a domain-based address.

Form submissions only need to be emailed.

No CRM is required.

Use appropriate anti-spam protection.

After successful submission, show a polished inline success state.

---

# 26. Community

There is no formal website membership journey.

Community actions include:

- join WhatsApp;
- follow Instagram;
- follow LinkedIn;
- follow TikTok;
- attend events;
- apply to committee when open.

WhatsApp should be treated as a genuine **community channel**, not merely another social icon.

The community experience should primarily support students and young Muslims interested in MES and entrepreneurship.

---

# 27. University and ISoc context

MES is a **Manchester Metropolitan University society**.

Its university context is part of the organisation's present identity rather than a secondary detail that needs to be minimised.

The site may appropriately acknowledge:

- Manchester Metropolitan University;
- relevant Students' Union context;
- MES's relationship with ISoc;
- university-side events and activity;
- collaborations with other societies.

The exact organisational wording must reflect the current real structure and should not be invented by Codex.

MES should nevertheless retain its own distinctive visual identity.

MMU, Students' Union and ISoc branding should provide institutional context without visually overwhelming the MES brand.

---

# 28. External/CIC scope

The website must **not** imply that MES currently operates as:

- a CIC;
- an independent external organisation;
- a separate external branch;
- a national organisation.

A possible future CIC/external branch is uncertain and is outside the scope of this website.

Do not:

- reserve sections for it;
- design navigation around it;
- write copy anticipating it;
- imply that the university society is merely one branch of a larger MES organisation.

If the organisational structure changes in future, the website can be revised then.

---

# 29. Leadership

Do not display the full committee.

Show only key heads, with **fewer than five people**.

For each:

- photo;
- name;
- university-society role.

LinkedIn links may be included where available.

No previous-leadership archive.

No founder history section.

The current leadership list can simply be updated annually.

---

# 30. Public routes

V1:

- `/` — Home
- `/about` — About
- `/events` — Events
- `/work-with-us` — Work With Us
- `/privacy` — Privacy

Do not build:

- Gallery
- Blog
- News
- Contact page
- standalone Partners page
- member portal

---

# 31. Content management

**No admin dashboard.**

**No CMS.**

**No content-management backend.**

The site will realistically be updated around once per month by the sole developer, so adding authentication, CRUD screens, image-upload infrastructure and database-backed content would unnecessarily bloat V1.

Content should instead be stored in clearly structured repository files, for example:

```text
data/
  events.ts
  partners.ts
  testimonials.ts
  stats.ts
  leadership.ts
```

Routine updates should involve editing simple structured data rather than editing page components.

For example, featured events should be determined from event data rather than manually hard-coded into the homepage layout.

The architecture may allow a lightweight CMS/admin to be introduced later **only if update frequency or maintainer requirements change**.

---

# 32. Mobile strategy

Mobile performance is a **release requirement**.

The preferred experience is still genuine interactive 3D where it performs well.

Do not assume:

> mobile = static image.

Instead, test and progressively reduce complexity only where necessary.

---

# 33. Real-device test matrix

Available physical devices:

- iPhone 14 Pro Max
- iPhone 13
- iPhone XS
- Samsung Galaxy S22
- Nothing Phone (1)

These devices should be used to make evidence-based performance decisions.

---

# 34. Mobile quality levels

### Full 3D

Where performance is good:

- real GLB;
- scroll-controlled movement;
- three-image sequence;
- screen takeover.

### Simplified 3D

If necessary:

- simpler lighting;
- reduced internal render resolution;
- no expensive effects;
- lower-cost textures;
- reduced scene complexity;
- shorter animation where useful.

### Graceful fallback

Only where real testing demonstrates that interactive 3D is unacceptable or WebGL is unavailable.

Do not disable 3D purely because a device is considered old by release year.

---

# 35. Loading behaviour

Preferred architecture:

> **Useful HTML/CSS appears immediately; 3D progressively enhances it.**

The public site must not require WebGL to become usable.

Avoid a dedicated full-screen loading screen if possible.

If testing proves a loader is genuinely necessary on slower mobile devices, a fallback concept may use the MES logo with its colour filling vertically to show progress.

That is **Plan B**, not default behaviour.

---

# 36. 3D performance

The current laptop asset is already lightweight at approximately 491 KB.

Avoid unnecessary:

- huge environment maps;
- large textures;
- heavy post-processing;
- dynamic shadow complexity;
- expensive shaders;
- constant render work after the hero has left the viewport.

High-DPI phones may render WebGL internally below their native pixel density where visually acceptable.

The 3D scene should stop or substantially reduce unnecessary GPU work after the visitor has moved beyond it.

---

# 37. Responsive design

Desktop, tablet and mobile should each feel intentionally designed.

The desktop site may use:

- asymmetry;
- overlapping photography;
- oversized typography;
- unconventional layouts.

Mobile may restructure these completely where necessary.

Do not simply shrink desktop layouts.

---

# 38. Motion

Outside the hero, motion should remain restrained.

Appropriate examples:

- reveal animations;
- image masks;
- stat counters;
- subtle hover feedback;
- marquee;
- controlled image transitions.

Avoid:

- repeated scroll hijacking;
- excessive parallax;
- random floating objects;
- heavy 3D sections;
- animation for its own sake.

---

# 39. Accessibility

Target:

**WCAG 2.2 AA**

Requirements include:

- semantic HTML;
- logical heading hierarchy;
- keyboard navigation;
- accessible menus;
- meaningful alt text;
- labelled forms;
- visible focus states;
- appropriate contrast;
- accessible error states;
- reduced-motion support.

Respect:

`prefers-reduced-motion`

Reduced-motion users may receive a shortened/simplified hero.

All meaningful information must remain accessible without WebGL or animation.

---

# 40. Browser support

Support current mainstream versions of:

- Safari
- Chrome
- Edge
- Firefox

Desktop and mobile where applicable.

No Internet Explorer support.

Unsupported environments should fail gracefully.

---

# 41. SEO

Required:

- meaningful titles;
- descriptions;
- canonical URLs;
- Open Graph metadata;
- social sharing image;
- favicon;
- sitemap;
- robots configuration;
- crawlable HTML content.

Important MES content must not exist only inside WebGL.

SEO copy and metadata should accurately identify MES as a Manchester Metropolitan University-based Muslim entrepreneurship society.

---

# 42. Analytics and privacy

Use lightweight, privacy-conscious analytics.

Useful events include:

- page visits;
- traffic source;
- Work With Us clicks;
- enquiry submissions;
- event ticket clicks;
- WhatsApp clicks;
- social clicks;
- committee application clicks.

Prefer solutions that avoid unnecessary invasive tracking and cookie-banner complexity.

A `/privacy` page is required because the enquiry form collects personal information.

The final privacy notice must describe the **actual implementation**, not generic services that the website does not use.

---

# 43. Technology direction

The PRD defines behaviour, not a rigid implementation stack.

Likely foundation:

- Next.js
- React
- TypeScript
- Tailwind CSS or equivalent
- Three.js / React Three Fiber
- appropriate scroll-animation tooling

Specific libraries should be selected based on actual need.

Do not use packages merely because they are fashionable.

With the removal of the admin dashboard, **a persistent application database is not required for normal site content**.

---

# 44. Domain and deployment

Preferred domain:

**`mesmcr.com`**

Likely registrar:

**GoDaddy**

Configure:

**`www.mesmcr.com` → `mesmcr.com`**

Domain registration and application hosting should be treated separately.

Vercel is the preferred initial deployment option for testing and remains a strong production option for a Next.js application.

Do not assume the application should be hosted by GoDaddy simply because the domain is registered there.

---

# 45. Budget

Paid services are acceptable where they provide meaningful value.

Do not introduce subscriptions or recurring costs without a clear reason.

Use free tiers where they adequately meet the requirement.

---

# 46. Development workflow

Codex should build the project **phase-by-phase**, with human review between significant visual stages.

Codex has freedom to make implementation and visual decisions within the product direction.

If an early idea does not work visually or technically, it may propose a better implementation that achieves the same goal.

The developer will run and inspect the frontend personally.

Do not treat:

> build passes

as equivalent to:

> design is good.

---

# 47. Git workflow

Use GitHub from the beginning.

Codex should **not commit or push automatically**.

At appropriate checkpoints it should provide:

- `git add`
- `git commit`
- `git push`

commands and a suitable commit message.

The developer performs them manually.

---

# 48. Development phases

### Phase 0 — Content and visual preparation

Prepare:

- logo exports;
- brand assets;
- event photos;
- logos;
- testimonials;
- impact figures;
- copy;
- visual references.

### Phase 1 — Foundation

Build:

- project structure;
- routing;
- layout;
- design tokens;
- typography;
- navigation;
- content-data structure.

### Phase 2 — 3D proof of concept

Before building the full homepage, prove:

`MES_Laptop.glb loads`  
→ `MES_Display can receive an image`  
→ `scroll animation works forwards/backwards`  
→ `camera can enter screen`  
→ `screen-to-page transition works`  
→ `mobile performance is viable`

### Phase 3 — Production hero

Build:

- final composition;
- typography;
- three-image sequence;
- laptop/camera movement;
- navbar transition;
- screen takeover;
- responsive variants;
- reduced-motion version.

### Phase 4 — Homepage

Build:

- vision/mission;
- impact;
- featured events;
- story;
- testimonials;
- partner marquee;
- Work With Us;
- community;
- leadership;
- footer.

### Phase 5 — Supporting pages

Build:

- About;
- Events;
- Work With Us;
- Privacy.

### Phase 6 — Responsive refinement

Test actual devices and fix:

- typography;
- layouts;
- touch behaviour;
- 3D performance;
- menu behaviour;
- forms.

### Phase 7 — Content polish

Replace placeholders with final:

- copy;
- photography;
- statistics;
- logos;
- testimonials;
- event information.

### Phase 8 — QA and optimisation

Check:

- production build;
- browser console;
- performance;
- accessibility;
- SEO;
- analytics;
- form delivery;
- broken links;
- mobile behaviour.

### Phase 9 — Launch

Connect the final domain and deploy when quality is sufficient.

---

# 49. Launch policy

Target:

**22 September 2026**

This is a personal target, not a public hard deadline.

Do **not** launch an unfinished site simply to hit the date.

Quality takes priority.

Aim to stop adding substantial new features approximately **5–7 days before launch**, leaving the final period for:

- bugs;
- responsive issues;
- performance;
- accessibility;
- content corrections;
- compatibility.

---

# 50. V1 must-have scope

- premium 3D hero;
- strong mobile experience;
- Vision & Mission;
- verified lifetime impact;
- featured events;
- upcoming events;
- About page;
- expandable event archive;
- partners/businesses/societies;
- testimonials;
- Work With Us page;
- enquiry/contact route;
- community/social routes;
- leadership;
- clear MMU/university-society positioning;
- responsive design;
- WCAG 2.2 AA baseline;
- SEO;
- privacy-conscious analytics;
- production deployment.

---

# 51. Explicit non-goals

Do **not** build for V1:

- CIC/external-branch functionality or positioning;
- admin dashboard;
- CMS;
- application database for normal site content;
- public accounts;
- member dashboard;
- formal website membership system;
- user roles;
- custom ticketing;
- payment processing;
- newsletter;
- blog;
- news system;
- Gallery;
- page builder;
- individual pages for every event;
- sponsor CRM;
- extensive 3D beyond the hero;
- previous committee archive.

---

# 52. Success criteria

### Brand

A visitor should recognise MES as an unusually polished and ambitious Muslim entrepreneurship society at Manchester Metropolitan University.

The website should not resemble a generic student-society template.

### Visual

The opening should be genuinely memorable.

### Credibility

Events, verified figures, testimonials, relationships and photography should demonstrate real activity.

### Commercial

A sponsor, business or entrepreneur should understand what MES is, who it serves and how to engage with the society.

### Student/community

A student or young Muslim should understand how to attend events, follow MES and join the community.

### University identity

The site should communicate the MMU context accurately without allowing generic university branding to overpower MES's own identity.

### Mobile

Opening the website from Instagram or WhatsApp on a normal modern phone should feel fast, polished and intentional.

### Maintainability

A monthly content update should be quick and straightforward through structured repository files without requiring a CMS.

---

# 53. Remaining content decisions

These do **not** block implementation:

- final tagline;
- final mission wording;
- exact hero headline;
- three hero images;
- verified total event count;
- verified attendance;
- verified fundraising total;
- verified lifetime social reach;
- testimonial quotes;
- complete logo inventory;
- leadership names/photos;
- committee application URL;
- exact wording describing the current MMU/ISoc/Students' Union relationship;
- final domain approval;
- future professional MES email;
- final production hosting choice.

Where content is unavailable during development, use obvious placeholders.

Never invent MES facts.

---

# 54. Codex source-of-truth instruction

> **Treat this PRD as the product source of truth. MES is currently the Muslim Entrepreneurs university society at Manchester Metropolitan University. Do not position the website as belonging to a CIC, independent external organisation or hypothetical future external branch. Do not invent MES facts, statistics, events, partnerships, testimonials, institutional relationships or organisational claims. Do not expand scope without a clear product reason. Preserve the existing MES identity while elevating its digital execution. The fact that MES is a university society should be communicated accurately without reducing the site's ambition or making it resemble a generic student-society website. Prioritise beautiful, polished UX over gratuitous technical complexity. Mobile performance is a release requirement. The 3D hero must progressively enhance the website rather than make the site dependent on WebGL. Public content should be stored in simple structured repository files; do not build an admin dashboard, CMS or unnecessary backend. If an implementation idea is visually or technically weak, propose a better implementation that achieves the same goal.**

---

## Current status

**Requirements:** ✅ complete  
**University-society positioning:** ✅ complete  
**Brand direction:** ✅ complete  
**Information architecture:** ✅ complete  
**Hero concept:** ✅ complete  
**Laptop asset:** ✅ complete  
**Laptop rear MES branding:** ✅ complete  
**Mobile philosophy:** ✅ complete  
**Content architecture:** ✅ complete  
**Admin/CMS:** ❌ intentionally excluded  
**Design & Interaction Specification:** ✅ complete  
**Implementation Plan:** ✅ complete  
**Final copy:** 🟡 pending  
**Final imagery:** 🟡 pending asset review  
**Verified statistics:** 🟡 pending  
**Testimonials:** 🟡 pending  
**Partner/business logo inventory:** 🟡 pending  
**Leadership content:** 🟡 pending  
**Remaining asset preparation:** 🟡 in progress  
**Project repository:** ⚪ not created  
**Implementation:** ⚪ not started
