// One-time helper: reads the Google Fonts CSS saved as fonts/gf.css, downloads the latin woff2 files
// for each family and weight into fonts/, and writes fonts/fonts.css with local @font-face rules.
import fs from "fs";
import path from "path";
import https from "https";
const dir = path.resolve("fonts");
const css = fs.readFileSync(path.join(dir, "gf.css"), "utf8");
const blocks = css.split("@font-face").slice(1);
const wanted = [];
for (const b of blocks) {
  if (!/U\+0000-00FF/.test(b)) continue; // latin subset only
  const family = /font-family:\s*'([^']+)'/.exec(b)[1];
  const weight = /font-weight:\s*(\d+)/.exec(b)[1];
  const url = /url\((https:[^)]+\.woff2)\)/.exec(b)[1];
  const file = `${family.replace(/\s+/g, "")}-${weight}.woff2`;
  wanted.push({ family, weight, url, file });
}
const get = (url, file) => new Promise((res, rej) => {
  https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (r) => {
    if (r.statusCode !== 200) return rej(new Error(`${r.statusCode} ${url}`));
    const out = fs.createWriteStream(path.join(dir, file));
    r.pipe(out); out.on("finish", () => out.close(res));
  }).on("error", rej);
});
let out = "/* Self-hosted fonts, latin subset, from Google Fonts (OFL). */\n";
for (const w of wanted) {
  await get(w.url, w.file);
  out += `@font-face { font-family: "${w.family}"; font-style: normal; font-weight: ${w.weight}; font-display: swap; src: url("/fonts/${w.file}") format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }\n`;
  console.log("fetched", w.file);
}
fs.writeFileSync(path.join(dir, "fonts.css"), out);
fs.unlinkSync(path.join(dir, "gf.css"));
console.log("wrote fonts/fonts.css with", wanted.length, "faces");
