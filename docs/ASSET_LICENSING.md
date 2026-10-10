# Asset Licensing

This document records the verified laptop source and the boundaries of the
project's asset licensing. It is not a certification of legal compliance.

## Laptop model

The third-party source is [“Laptop” by Aullwen](https://skfb.ly/6RVFt), available on
[Sketchfab](https://sketchfab.com/3d-models/laptop-7d870e900889481395b4a575b9fa8c3e).
Sketchfab's public model metadata was checked on 10 October 2026 and identifies
Aullwen as the creator and
[Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)
as the licence.

The runtime asset is `public/models/MES_Laptop.glb`; working assets are retained
in `assets-source/3d/`. The prepared model has a named `MES_Display` mesh. The MES
implementation replaces its display material with canvas-rendered MES artwork
and event photography, and applies custom chassis materials and lighting.
The third-party model should not be represented as original MES modelling work.

CC BY 4.0 requires appropriate credit, a licence link and an indication of changes.
Supplied copyright, licence and disclaimer notices must be retained where
applicable; attribution must not imply endorsement by the creator. See the
[licence deed](https://creativecommons.org/licenses/by/4.0/) and
[legal code](https://creativecommons.org/licenses/by/4.0/legalcode) for the full
conditions.

The [README](../README.md#credits-and-licensing) identifies the source, licence
and MES adaptations. The live [privacy page](https://mmumes.com/privacy) includes
the source, author and licence links. It does not currently describe the model
adaptations. The original download's full accompanying notice set has not been
verified, so completeness of notices and attribution across deployed and
redistributed copies remains an owner review item.

## Fonts

Apparel Display Regular and TAN Headline Regular are purchased webfonts retrieved
from a private repository. Their binaries, receipts and purchase-specific terms
must not be committed to this public repository. See
[Private Webfonts and Builds](PRIVATE_FONTS_AND_BUILDS.md) for the retained
operational guidance and licensing caveats, including:

- confirmation of licence versions, ownership/control, domains, preview use and
  combined pageview limits;
- confirmation of TAN's fixed canvas/WebGL branding use under the public
  webfont terms;
- retention of any required copyright/legal notices;
- separate remediation of older Apparel Display, TAN Headline and Kommon Grotesk
  TTF files still present in public Git history.

The live deployment does not resolve those questions. No history rewrite is part
of this documentation update.

Hanken Grotesk's SIL Open Font License notice is retained in
[`public/fonts/licenses/hanken-grotesk/OFL.txt`](../public/fonts/licenses/hanken-grotesk/OFL.txt).
Montserrat's bundled notice remains in
[`src/assets/fonts/montserrat/OFL.txt`](../src/assets/fonts/montserrat/OFL.txt).
The application also uses Google-hosted source font families through `next/font`
for self-hosted delivery. Do not infer that one font's licence covers every family.

## Photography, branding and other assets

MES event photography, society branding, team photographs, event posters and
third-party network logos are distinct from the laptop licence. Public inclusion
in this repository or its screenshots does not establish permission for arbitrary
reuse or transfer ownership. Their permissions and any additional credit
requirements should be confirmed with the relevant rights holders.

No repository-wide software licence is currently declared. CC BY 4.0 applies to
the laptop source; it is not a blanket licence for the site's source code or all
of its assets.
