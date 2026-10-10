# dropmatch.org

The public site of Dropmatch, Inc., the nonprofit certification body for AI companies that fund ten liters of safe drinking water for every liter their AI usage consumes.

Static HTML, no framework, no build dependencies. Served by Vercel from the repository root.

## Layout

- `src/pages/*.html`: the body of each page. `src/shell.css`: the one stylesheet. `src/icons.html`: the inline SVG icon sprite.
- `src/build.mjs`: stitches the shell around each page body and writes the root HTML files, `sitemap.xml`, `robots.txt` and `favicon.svg`. Run `node src/build.mjs` after any edit under `src/` and commit the output with the source.
- `assets/`: photographs. `fonts/`: self-hosted Manrope and IBM Plex Mono (latin subset, SIL Open Font License), `fonts/fonts.css` with the `@font-face` rules.
- `vercel.json`: clean URLs (`/standard`, `/get-certified`, `/partners`, `/registry`, `/transparency`, `/governance`), security headers, long cache on assets and fonts.

## Rules for copy

Positive language throughout. No double hyphens, no em dashes, no semicolons in prose. The badge states what was funded, verified, with a year. Every organization or standard named links to its own site, with no logos and no endorsement wording until an agreement exists.

## Photographs

Stock from Pexels (free for commercial use, no attribution required), a stand-in until partner photography from the funded programs exists. Pexels IDs: hero 11197466, band 20903276, about 27757411, standard 1231251, get certified 14474033, registry 13799233, governance 21927155, partners 13613219.
