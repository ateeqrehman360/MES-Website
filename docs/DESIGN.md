# MES Design System

The Muslim Entrepreneurs Society website uses cream surfaces, deep green type,
gold details and expressive serif headings. Editorial composition and authentic
MES photography connect the society's identity to its activities at Manchester
Metropolitan University. This reference describes the implemented website.

## Design Philosophy

The visual hierarchy comes from typography, scale and placement. Large headings,
small uppercase labels and fine rules organise content without enclosing every
item in a card. Asymmetric grids balance prominent statements with quieter copy,
photography and deliberate negative space.

The premium presentation is expressed through precise type treatment, restrained
surfaces and controlled motion. Green and gold retain the society's identity;
event photographs, team portraits and existing branding provide its visual
content. Motion reveals relationships between elements and follows the reader's
progress through the page.

## Colour System

The shared palette is defined in [tokens.css](../src/styles/tokens.css) and exposed
to Tailwind through [globals.css](../src/app/globals.css).

| Token | Value | Implemented role |
| --- | --- | --- |
| `--mes-cream` | `#eae2d4` | Base page surface; light text on green sections |
| `--mes-deep-green` | `#01500b` | Brand green, dark sections, controls and headings |
| `--mes-gold` | `#c29231` | Rules, brand details, dividers and dark-surface focus rings |
| `--mes-muted-green` | `#618c5d` | Configured supporting palette tone |
| `--mes-cream-soft` | `#f4ede2` | Homepage surface and light laptop artwork panel |
| `--mes-green-ink` | `#013609` | Body text and dark green typography on cream |
| `--mes-muted-green-deep` | `#3f7044` | Secondary green type, portrait surfaces and active states |
| `--mes-border` | `rgb(1 80 11 / 24%)` | Subtle borders on light surfaces |

Some sections define local supporting tones. The network uses `--network-paper:
#f1e9dc`; the footer uses `--footer-gold-readable: #d0ae6a` for selected links and
rules. These remain local to [our-network.css](../src/styles/our-network.css) and
[footer.css](../src/styles/footer.css).

Deep green or green ink on cream, and cream on deep green, form the main text
pairings. Gold is primarily an accent. Do not assume gold or muted green meets
small-text contrast requirements on every surface; assess the actual pairing,
font size and opacity. Translucent text, borders and focus indicators also need
checking against their rendered background.

## Typography

Font loading and CSS variables are configured in
[layout.tsx](../src/app/layout.tsx). All configured faces use `display: swap`.

| Family | CSS variable | Role |
| --- | --- | --- |
| Apparel Display Regular | `--font-hero-apparel` | Main editorial headings, homepage title, purpose statement, team names and footer closing |
| TAN Headline Regular | `--font-laptop-tan-headline` | Fixed “MUSLIM” branding inside the laptop display |
| Hanken Grotesk Regular | `--font-hero-hanken` | “ENTREPRENEURS” in the page hero, uppercase section labels and utility copy |
| Newsreader | `--font-newsreader` | Configured generic `font-display` family; used by the retained FoundationPage component |
| Manrope | `--font-manrope` | Body copy, navigation, controls and impact figures |
| Montserrat | `--font-montserrat`, `--font-laptop-montserrat` | Bold MES navigation lockup; separate regular face for laptop “ENTREPRENEURS” artwork |

Newsreader's generic display mapping does not determine the published editorial
heading appearance. The hero and purpose classes explicitly override it with
Apparel Display, and most section headings declare Apparel directly.
[FoundationPage](../src/components/sections/foundation-page.tsx) is not mounted by
the current public routes.

Apparel and TAN are local WOFF2 faces at weight 400. Hanken is configured at 400;
Manrope at 400, 500, 600, 700 and 800; the navigation Montserrat at 700 and 800.
The laptop's regular Montserrat is loaded separately from the bundled TTF.
See [Private Webfonts and Builds](PRIVATE_FONTS_AND_BUILDS.md) and
[Asset Licensing](ASSET_LICENSING.md) for setup and licensing requirements.

Hierarchy is component-specific. Apparel headings generally use normal weight,
tight tracking and short line heights, while labels use Hanken with uppercase
letterspacing. Manrope paragraphs use more generous line spacing and constrained
measures. Existing styles use `font-synthesis: none` for many editorial faces.

Representative implemented values:

- Desktop homepage “MUSLIM”: `min(23.75vw, 21.5rem)`, with `-0.06em` tracking.
- Mobile homepage “MUSLIM”: `clamp(4rem, 16.7vw, 4.35rem)`, line-height `0.78`.
- Team heading: `clamp(3rem, 12.5vw, 4.85rem)`, line-height `0.9`.
- Shared lead text: `--type-lead: clamp(1.125rem, 1.05rem + 0.5vw, 1.5rem)`.
- Privacy body copy: `1rem`, line-height `1.75`, maximum `min(65ch, 42rem)`.

Shared display tokens are defaults, not a universal heading scale. Section CSS
and aspect-ratio rules refine them. Preserve deliberate line breaks, balanced
headings and the distinction between expressive display type and readable copy.

## Layout and Spacing

[base.css](../src/styles/base.css) defines `.site-container` as
`width: min(100%, var(--site-max-width))`, centred with inline padding.
`--site-max-width` is `90rem`; `--site-gutter` is
`clamp(1.25rem, 4vw, 4.5rem)`. The homepage hero also uses its own viewport-based
positioning rather than placing every element inside that container.

Grids vary by section. About and Events introduce six columns at `48rem` and
12 at `64rem`. What We Do uses 12 columns from `48rem`. Homepage vision uses
12 columns from `64rem`, while impact uses eight below that breakpoint and 16
above it. There is no single grid imposed on the entire site.

Use the relevant section's alignment and column spans when extending it.
Headings, labels, rules and body copy share alignment anchors, but photographs
and oversized figures can occupy different spans. Team portraits deliberately
vary in width and position; featured experiences pair poster art with offset
text rather than repeating equal-sized tiles.

Spacing is fluid and local. For example, What We Do uses mobile block padding of
`clamp(5rem, 16vw, 8rem)` and `clamp(6rem, 20vw, 10rem)`, with larger values from
`48rem`. The network uses `clamp(5rem, 10vw, 8rem)` above and
`clamp(5.5rem, 10vw, 8rem)` below. Whitespace separates narrative stages and
protects large type; it is part of the composition.

Control and surface radii are `--radius-control: 0.5rem` and
`--radius-surface: 0.75rem`. Their presence does not imply that every section
should become a rounded panel.

## 3D Hero

The opening composition places oversized “MUSLIM” typography above the tracked
“ENTREPRENEURS” line. A laptop overlaps the right-hand area on desktop, balanced
by the society's statement, MMU affiliation, establishment date and scroll cue
on the left. Fine gold rules connect these elements visually.

The runtime model is `public/models/MES_Laptop.glb`. Its light metallic chassis,
dark screen surround and keyboard receive custom physical materials. Broad
reflection lights, a warm key light and a cooler fill light define the product
form. Ground shadows anchor it to the cream surface. Mobile uses a generated
radial shadow instead of real-time shadow maps.

The display opens with a green branding panel, cream logo panel and gold divider.
TAN Headline and regular Montserrat form the screen lockup. The display artwork
is unlit, so its colours and typography remain independent of chassis lighting.

Scrolling changes the camera and model composition while revealing three real
MES photographs: a Halal Business Series audience, a group photograph and the
Ramadhan Bazaar. Crops and subtle image movement are authored for the screen.
The final artwork presents the purpose statement:

> Built by Muslims.<br>
> For ambition beyond the classroom.

On desktop, the lead statement sits on green and the closing statement on cream,
separated by gold. Mobile stacks the statement within the visible cream panel.
Apparel Display is used for both parts; Hanken supplies the “OUR PURPOSE” label.

The laptop screen grows to fill the viewport before matching HTML artwork takes
over. Shared layout coordinates keep the canvas and HTML statements aligned.
The transition includes dedicated tablet adjustments and a portrait display
anchor. The continuation then leads into the homepage's vision section.

A small “SCROLL TO EXPLORE” label and static downward arrow remain at the stage's
bottom edge after the opening title fades. Existing hero progress fades the cue
out before the HTML takeover; reversing the scroll restores it. The cue is
decorative, adds no focus target and also appears in the static WebGL and
reduced-motion alternatives, where it leaves with the opening stage.

Homepage next steps use uppercase Hanken text links, a fine gold underline and a
small arrow: the society story beside Vision, the 2026/27 programme announcement
after Featured Experiences, and collaboration beside Our Network.

Design sources: [hero.css](../src/styles/hero.css),
[hero data](../src/data/hero.ts),
[purpose layout](../src/components/hero/hero-purpose-layout.ts) and
[display artwork](../src/components/hero/hero-display-texture.ts).
See the [main README](../README.md#engineering-highlights) for rendering architecture.

## Motion and Interaction

The hero, vision, journey, activities, team and featured experiences use scroll
progress to reveal or assemble their content. Progress-driven sequences respond
to scrolling in either direction. Other sections, including Built at MMU and
collaboration content, use viewport entry to trigger short, staggered reveals.

Motion combines translation, opacity, clipping and scale. The shared easing is
`--ease-premium: cubic-bezier(0.22, 1, 0.36, 1)`, with interaction tokens of
`180ms` and `320ms`. Section reveals have their own timings: the collaboration
hero uses `620ms`, while Built at MMU uses `920ms` transforms with short staggers.
These timings support an ordered reading sequence rather than a uniform delay
on every component.

Desktop navigation links reveal a gold underline on hover and keyboard focus.
Buttons change colour and can shift slightly. Fine-pointer portrait hover adds
a small scale and image offset; network logo hover restores stronger colour and
pauses the hovered marquee row.

Below `64rem`, navigation opens a full-height green dialog with numbered Apparel
links. Its surface uses a clipped reveal, and closing reverses the direction.
The implementation locks background scrolling, supports Escape and Tab cycling,
focuses the close control and restores focus when the menu is dismissed.
The existing “Menu” label and icon remain visible through the homepage sequence;
a cream header surface maintains contrast once the opening scene starts moving.
On narrow screens, the purpose handoff restores the transparent header while
retaining a cream menu trigger, leaving the purpose label unobstructed.
See [mobile-navigation.tsx](../src/components/layout/mobile-navigation.tsx) and
[navigation.css](../src/styles/navigation.css).

With `prefers-reduced-motion: reduce`, the hero remains at its opening state and
the purpose continuation stays visible in HTML. Scroll assemblies use static
layouts, impact counters show final values, menu transitions are removed and
network marquees become a static grid. Smooth scrolling is also disabled.
These alternatives preserve content and hierarchy without requiring the animated
sequence. See [base.css](../src/styles/base.css) and each section's motion styles.

## Responsive Design

The principal CSS thresholds are `48rem` and `64rem`, but individual sections
also use narrower or wider thresholds and viewport-height conditions. Work With
Us introduces its wide composition at `70rem`; journey layouts expand at
`80rem`. Breakpoints belong to their components, not a universal device taxonomy.

| Range | Composition |
| --- | --- |
| Below `48rem` | Compact title lockup, portrait laptop crop, bottom-positioned hero facts and vertically arranged section content |
| `48rem` to below `64rem` | Intermediate grids and larger type; menu navigation remains; tablet height and aspect-ratio adjustments apply |
| From `64rem` | Desktop navigation, wider editorial arrangements and larger multi-column sections, subject to local height conditions |

Mobile omits the opening hero's supporting statement and vertical “Since 2024”
marker. Its scroll cue sits below the opening facts. Laptop framing and purpose
artwork have separate
coordinates. The 3D scene selects portrait composition at aspect ratio below
`0.64`; mobile rendering quality is selected separately below `48rem`.

Tablet is not simply the desktop layout with less space. Hero CSS adjusts the
title and editorial block at narrow aspect ratios, and portrait-tablet purpose
copy uses a smaller support size. Team and activity sequences also account for
available height. Short landscape screens have dedicated hero adjustments.

Photography uses cover crops and per-image focal positions; posters and network
logos use contain sizing to retain their artwork. Review these separately when
changing a composition. Mobile title sizes, line breaks and copy measures are
chosen for the portrait layout rather than proportionally shrinking desktop.

The document has a `20rem` minimum width. Global border-box sizing, body
`overflow-x: clip`, section clipping and `minmax(0, 1fr)` tracks contain oversized
visuals. These safeguards do not replace checking text, focus outlines and image
crops at narrow widths, zoomed text and short viewports.

## Photography and Imagery

Use MES event photography to show actual society activity. Hero images are
configured in [hero.ts](../src/data/hero.ts); About photography sits alongside
society history and MMU context. Runtime imagery lives in `public/`, with source
photography and working 3D assets in `assets-source/`.

Team portraits appear on a deep green field with gold rules and serif names.
Frames use a `4 / 5` aspect ratio and cover sizing. Each member's focal position
and editorial placement are stored in [team.ts](../src/data/team.ts); adjust
those values to preserve faces when replacing an image.

Featured event posters retain their original artwork with contain sizing.
The network uses shape and optical-size metadata to balance varied logos, with
reduced saturation and opacity on its paper surface. Duplicate marquee sequences
are decorative; the primary sequence supplies accessible names.

Keep natural photographic colour, intentional subject crops and consistent
frames. Do not flatten event posters or third-party marks into the page's type
system. Consult [Asset Licensing](ASSET_LICENSING.md) before reusing assets.

## Accessibility

The project targets WCAG 2.2 AA; this reference does not claim certification.
The implementation uses semantic headings and landmarks, an English (UK)
document language, a skip link and a focusable main-content target. Paragraph
measures and line spacing support responsive reading.

Global `:focus-visible` styling uses a `0.1875rem` outline with `0.25rem` offset.
Dark surfaces marked with `data-focus-surface="dark"` switch the ring to gold.
Navigation links also expose visible focus treatments; menus and recruitment use
native dialogs with focus handling and dismissal controls.

The WebGL layer is decorative to assistive technology. The hero has a labelled
HTML heading, text descriptions of the event photographs and a readable purpose
statement in the HTML continuation. A branded fallback preserves the opening
page if WebGL is unavailable, fails or loses its context.

Informative images have alternative text; decorative marks and repeated visual
content are hidden where appropriate. Reduced-motion layouts retain the content.
Maintain these provisions and check actual colour contrast, keyboard behaviour,
reading order and responsive legibility when changing a component.

## Maintaining Design Consistency

- Reuse the shared palette and existing local surface tones.
- Keep Apparel for editorial emphasis, Hanken for labels and Manrope for reading.
- Align new content with its section's grid, rules and copy measures.
- Preserve asymmetry and negative space where they establish the hierarchy.
- Use authentic photographs and tune focal positions for each composition.
- Give motion a clear relationship to content, with a complete static alternative.
- Retain semantic HTML, focus treatments and meaningful image descriptions.
- Review desktop, tablet, mobile and short-height layouts as distinct compositions.
- Keep source links and this reference aligned with implemented changes.
