# MES Website

A premium, interactive website for the **Muslim Entrepreneurs Society (MES)** at Manchester Metropolitan University.

I am designing and developing the website to give MES a stronger digital presence and showcase its events, community, partnerships and impact through a more ambitious experience than a conventional university society website.

The project combines editorial web design, responsive layouts, real event photography and an interactive 3D hero built with Three.js and React Three Fiber.

---

## Project Status

**In active development.**

The main homepage experience currently includes:

- responsive navigation;
- interactive 3D laptop hero;
- scroll-controlled 3D animation;
- MES branding integrated into the 3D model;
- event photography displayed through the laptop screen;
- seamless transition from WebGL into normal page content;
- responsive desktop and mobile hero compositions;
- reduced-motion behaviour;
- Vision section;
- animated `LEARN. CONNECT. BUILD.` sequence;
- Impact section using verified MES statistics;
- responsive editorial layouts across desktop and mobile.

Further homepage sections and supporting pages are currently being developed.

---

## Current Homepage Experience

The homepage currently progresses through:

```text
3D opening hero
      ↓
Interactive laptop sequence
      ↓
MES event photography
      ↓
"Built by Muslims. For ambition beyond the classroom."
      ↓
Vision
      ↓
LEARN. CONNECT. BUILD.
      ↓
Impact
```

The opening experience centres around a 3D laptop whose position, rotation and camera relationship respond directly to scroll progress.

As the user moves through the page, the laptop display changes between MES branding and real event photography before eventually filling the viewport and transitioning into normal HTML content.

Reverse scrolling also reverses the animation rather than relying on a one-way autoplay sequence.

---

## Impact

The website currently presents the following verified MES figures:

| | |
| --- | --- |
| **17** | Events hosted & collaborated on |
| **TBC** | Attendees |
| **422K+** | Social views |
| **£1,400+** | Raised |
| **Since 2024** | Building Muslim entrepreneurship at MMU |

Statistics are stored separately from the presentation components so they can be updated without changing the section layout.

---

## Tech Stack

### Frontend

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**

### 3D

- **Three.js**
- **React Three Fiber**
- **React Three Drei**

The site currently does not require a backend, database or CMS. Most content is maintained through typed data and component files within the repository.

---

## 3D Hero

One of the main technical challenges in the project is the homepage hero.

Rather than using a prerecorded animation, the laptop is rendered in real time using WebGL.

The interaction includes:

- loading and rendering a GLB laptop model;
- targeting the laptop display as a separate mesh;
- applying MES branding and photography to the display;
- coordinating model and camera movement;
- mapping scroll position to animation progress;
- supporting reverse scrolling;
- transitioning from the 3D screen into normal DOM content;
- adapting the composition for different aspect ratios;
- reducing unnecessary rendering once the scene has settled.

The laptop also contains MES branding on the rear of the display.

---

## Responsive Design

Desktop and mobile use deliberately different compositions rather than simply scaling the same layout.

The project has been tested across viewport sizes including:

```text
1440 × 1000
1280 × 800
430 × 932
390 × 844
375 × 667
320 × 568
```

The responsive work includes:

- mobile-specific hero positioning;
- responsive typography;
- mobile navigation;
- different photographic crops;
- adapted editorial compositions;
- overflow prevention;
- reduced vertical dead space;
- touch-friendly interaction.

---

## Design Direction

The visual direction combines:

- editorial typography;
- large-scale type;
- asymmetric composition;
- controlled motion;
- real MES photography;
- 3D interaction;
- strong use of negative space;
- premium brand presentation.

The aim is to make the site feel polished and distinctive while still representing MES accurately as a university society.

### Brand colours

| Colour | Hex |
| --- | --- |
| Cream | `#EAE2D4` |
| Deep Green | `#01500B` |
| Gold | `#C29231` |
| Muted Green | `#618C5D` |

Additional shades derived from these colours are used throughout the interface.

### Typography

The current typography system uses:

- **Apparel Display Regular** — large editorial statements (purchased WOFF2)
- **TAN Headline Regular** — the laptop canvas word “MUSLIM”
- **Hanken Grotesk Regular (400)** — selected labels and display elements
- **Newsreader** — supporting editorial typography
- **Manrope** — body copy and interface text
- **Montserrat** — MES header branding

---

## Project Structure

```text
MES-Website/
│
├── assets-source/
│   └── source photography and working assets
│
├── docs/
│   ├── PRD.md
│   ├── DESIGN.md
│   └── IMPLEMENTATION_PLAN.md
│
├── public/
│   ├── brand/
│   ├── hero/
│   ├── models/
│   └── ...
│
├── src/
│   ├── app/
│   ├── components/
│   │   ├── hero/
│   │   ├── layout/
│   │   ├── sections/
│   │   └── ui/
│   ├── data/
│   ├── lib/
│   └── styles/
│
└── ...
```

---

## Routes

The website is structured around the following routes:

```text
/
/about
/events
/work-with-us
/privacy
```

The homepage is currently receiving the majority of development work before the supporting pages receive their final content and design.

---

## Local Development

Clone the repository and install dependencies:

```bash
npm ci
```

Authenticate with GitHub CLI (`gh auth login`) using an account that can read
[`ateeqrehman360/MES-Private-Assets`](https://github.com/ateeqrehman360/MES-Private-Assets),
then retrieve the fonts once:

```bash
npm run fonts:prepare
```

Start the development server:

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

### Lint

```bash
npm run lint
```

### Type checking

```bash
npm run typecheck
```

### Production build

```bash
npm run build
```

---

## Private Webfonts and Builds

The purchased Apparel Display Regular and TAN Headline Regular WOFF2 files live
only in the private repository
[`ateeqrehman360/MES-Private-Assets`](https://github.com/ateeqrehman360/MES-Private-Assets),
on its `main` branch, at the repository root:

- `appareldisplay-regular-webfont.woff2`
- `tan_-_headline-webfont.woff2`

`scripts/prepare-private-fonts.mjs` uses Node's built-in APIs and the authenticated
GitHub Contents API. It writes byte-identical fonts to the gitignored
`src/assets/fonts/private/` directory. WOFF2 header, length and SHA-256 checks pin
the exact verified purchased files. Downloads are written atomically. Invalid
or unavailable fonts stop the command before Next.js compiles; there is no
replacement-font build. To replace a purchased file in future, verify its identity,
format and licence before updating the script's size/hash pins.

`npm run dev` runs `predev`; `npm run build` runs `prebuild`. Both prepare the fonts
before Next.js reads `next/font/local` paths. Valid local cached files are reused
without network access. `npm run fonts:prepare` can also be run separately.
If a cached file is corrupt, delete only the named file from
`src/assets/fonts/private/` and run `npm run fonts:prepare` again.
Do not use `next dev`, `next build`, or `npx next build` directly on a clean clone,
as these bypass npm's preparation lifecycle.

### Authentication and token permissions

Local development normally uses the owner's existing GitHub CLI authentication.
No token file is needed. Alternatively, provide `MES_PRIVATE_ASSETS_TOKEN` as a
process environment variable (for example through your shell's secret manager).
The standalone Node script does not load Next.js `.env.local` files.
An explicitly supplied token takes precedence over GitHub CLI authentication.

For automated builds, create a **fine-grained personal access token**:

1. Resource owner: `ateeqrehman360`.
2. Repository access: **Only select repositories** → **MES-Private-Assets**.
3. Repository permissions: **Contents: Read-only**. GitHub may include its
   required Metadata read permission automatically; no write permission is needed.
4. Choose an expiry and retain a renewal reminder privately.

Use the exact variable name **`MES_PRIVATE_ASSETS_TOKEN`**, without `NEXT_PUBLIC_`.
The script sends the credential only in an HTTPS Authorization header to
`api.github.com`; never in a URL. It does not echo subprocess errors, response
bodies or credentials. It is build tooling and is never imported into the app.
Never commit tokens, receipts, purchased licence documents or paid font binaries.

### Vercel configuration — owner setup required

No Vercel project or deployment is configured by this change. When the owner sets
up the existing GitHub-connected workflow:

- Framework preset: **Next.js**; root directory: the MES repository root.
- Build Command: **`npm run build`** (set this explicitly to ensure `prebuild`
  runs; an override of `next build` bypasses the retrieval step).
- Install Command: standard npm installation with the committed lockfile;
  `npm ci` is suitable. Keep the normal Next.js output directory.
- Use a Node version supported by this Next.js version (Node **22.x** is suitable).
- Add **`MES_PRIVATE_ASSETS_TOKEN`** as a sensitive environment variable for
  **Production** and, if desired and covered by the licences, **Preview** builds.
  Do not enable licensed-font preview builds from untrusted code/contributors.
- The private assets repository does not need a separate Vercel project or Git
  integration. The Node script retrieves the two files during `prebuild`.

The GitHub-connected build installs dependencies, runs `npm run build`, retrieves
and validates missing fonts, then compiles Next.js. Cached fonts are always
validated before reuse. Google font families continue to be downloaded at build
time and self-hosted by `next/font/google`; no browser Google Fonts request is added.

To rotate an expired/revoked token, create a replacement with the same single
repository and read-only Contents access, replace its value in the relevant Vercel
environments and any local secret manager, and revoke the old token. The new value
is used on the next owner-authorized build; changing it does not alter existing
build artifacts. Verify retrieval on a fresh cache when rotating, because a valid
cached font does not require authentication.

For retrieval regression checks after preparing the fonts:

```bash
npm run test:fonts
npm run lint
npm run typecheck
npm run build
git diff --check
```

### Licence review and source history

Licensed fonts remain outside the public source repository. The
[Creative Market webfont terms](https://creativemarket.com/licenses/terms/fonts)
permit CSS `@font-face` embedding of supplied WOFF/WOFF2 files and prohibit
redistributing fonts with website source code. `next/font/local` generates
`@font-face` CSS and serves the unchanged purchased files as web assets. Webfonts
necessarily remain downloadable by browsers from the deployed site's font URLs;
private source storage does not make those deployed assets secret.

The owner reports purchasing both webfont licences for £39.72 total. Receipts and
purchase-specific terms are not in this public repository and were not reviewed.
Before deployment, the owner must confirm the applicable licence versions,
licensee/site ownership, domains/preview use and purchased combined pageview limit,
and retain any required accompanying copyright/legal notices through an approved
private-asset workflow. No purchased licence documents are committed here.

TAN is loaded via generated CSS `@font-face` and the browser Font Loading API,
then used only to draw fixed, read-only MES branding in a canvas texture. There is
no end-user typesetting editor or font export. The current public terms do not
explicitly address canvas/WebGL textures under the **@Font-Face Only** restriction;
confirm this use with Creative Market/the licensor before launch. Apparel's exact
purchase-specific terms and any additional foundry requirements also need owner
confirmation. This implementation is not a legal-compliance certification.

Hanken Grotesk uses the [SIL Open Font License](https://github.com/google/fonts/blob/main/ofl/hankengrotesk/OFL.txt);
its notice is retained in `public/fonts/licenses/hanken-grotesk/OFL.txt`.
The existing Montserrat file and `src/assets/fonts/montserrat/OFL.txt` remain intact.

**Outstanding history cleanup:** the old Apparel Display, TAN Headline and Kommon
Grotesk TTFs have been removed from the current branch tree, but remain in the public
repository's historical commits. No history was rewritten and no force push was
performed. The owner must approve a separate remediation plan covering affected
refs, forks/clones, coordination with collaborators and GitHub support if required.
Deleting current files does not remove past public copies. The older
`docs/PRE_DEPLOYMENT_REPORT.md` font inventory records the pre-migration state.

---

## Accessibility

The project targets **WCAG 2.2 AA**.

Current accessibility considerations include:

- keyboard-accessible navigation;
- visible focus states;
- responsive text sizing;
- colour contrast;
- reduced-motion support;
- meaningful content outside WebGL;
- mobile-friendly interaction.

The 3D hero is intentionally isolated from the rest of the site so the main website content remains normal semantic HTML.

---

## Performance

Performance is particularly important because of the real-time 3D hero.

The project therefore focuses on:

- limiting 3D rendering when the scene is idle;
- keeping the GLB model relatively small;
- optimising image assets;
- avoiding unnecessary animation libraries;
- limiting heavy 3D effects to the hero;
- using normal DOM content for the rest of the site;
- testing across smaller mobile viewports.

---

## Roadmap

### Completed

- Project foundation
- Responsive site shell
- Static 3D hero
- Scroll-controlled 3D interaction
- Mobile hero
- Production hero
- Vision section
- Impact section
- Hero-to-content transition refinement

### In Progress / Planned

- Story and community section
- Featured experiences
- Network and partnerships
- University context
- Work With Us
- Community section
- Supporting pages
- Final motion refinement
- Responsive refinement
- Accessibility review
- Performance optimisation
- Production deployment

---

## About MES

Muslim Entrepreneurs Society is a student society at **Manchester Metropolitan University**.

The society brings Muslim students together around entrepreneurship, professional development, networking and opportunities to learn from people with real business experience.

MES was founded in **2024**.

---

## Asset Attribution

Some third-party assets used by the project have separate licensing requirements.

The 3D laptop model originated from a Creative Commons Attribution asset. The exact original attribution will be retained and included appropriately before the website is released publicly.

MES photography, branding and project-specific visual assets remain separate from third-party asset licensing.

---

## Developer

**Designed and developed by Ateeq Rehman**

BSc Software Engineering  
Manchester Metropolitan University
