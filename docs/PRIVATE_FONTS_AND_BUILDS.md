# Private Webfonts and Builds

Current operational guidance. See the [README](../README.md#local-development) for
the short setup path and [asset licensing](ASSET_LICENSING.md) for attribution.

Use Node.js 22.x and npm. Install locked dependencies with `npm ci`, then run
`npm run fonts:prepare` before starting the application. Local development requires
authorised access to the purchased webfonts; the public clone alone is insufficient.

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

## Authentication and token permissions

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

## Vercel build configuration

The website is live at [mmumes.com](https://mmumes.com) on Vercel. The following
settings describe the required build workflow; project settings and credentials
remain under the owner’s control:

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
is used on the next owner-authorised build; changing it does not alter existing
build artefacts. Verify retrieval on a fresh cache when rotating, because a valid
cached font does not require authentication.

For retrieval regression checks after preparing the fonts:

```bash
npm run test:fonts
npm run lint
npm run typecheck
npm run build
git diff --check
```

## Licence review and source history

Licensed fonts remain outside the public source repository. The
[Creative Market webfont terms](https://creativemarket.com/licenses/terms/fonts)
permit CSS `@font-face` embedding of supplied WOFF/WOFF2 files and prohibit
redistributing fonts with website source code. `next/font/local` generates
`@font-face` CSS and serves the unchanged purchased files as web assets. Webfonts
necessarily remain downloadable by browsers from the deployed site's font URLs;
private source storage does not make those deployed assets secret.

The owner reports purchasing both webfont licences for £39.72 total. Receipts and
purchase-specific terms are not in this public repository and were not reviewed.
The live deployment does not establish licence compliance. The owner must still
confirm the applicable licence versions, licensee/site ownership, domains/preview
use and purchased combined pageview limit,
and retain any required accompanying copyright/legal notices through an approved
private-asset workflow. No purchased licence documents are committed here.

TAN is loaded via generated CSS `@font-face` and the browser Font Loading API,
then used only to draw fixed, read-only MES branding in a canvas texture. There is
no end-user typesetting editor or font export. The current public terms do not
explicitly address canvas/WebGL textures under the **@Font-Face Only** restriction;
confirm this use with Creative Market/the licensor. Apparel's exact
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
