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
"Built by Muslims. For Muslims with ambition."
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

- **Apparel Display** — large editorial statements
- **Kommon Grotesk** — selected labels and display elements
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
npm install
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
