// Builds the static site: src/pages/*.html bodies into root HTML files with the shared shell.
// Usage: node src/build.mjs   (no dependencies)
import fs from "fs";
import path from "path";
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1")), "..");
const SRC = path.join(ROOT, "src");
const css = fs.readFileSync(path.join(SRC, "shell.css"), "utf8");
const icons = fs.readFileSync(path.join(SRC, "icons.html"), "utf8");
const fontsCss = fs.readFileSync(path.join(ROOT, "fonts", "fonts.css"), "utf8");
const SITE = "https://dropmatch.org";
const drop = `<svg viewBox="0 0 22 26" aria-hidden="true"><path d="M11 1.5C11 1.5 2.5 11 2.5 16.2a8.5 8.5 0 0 0 17 0C19.5 11 11 1.5 11 1.5z" fill="#4CC9F0"/></svg>`;
const pages = [
  { out: "index.html", route: "/", title: "Dropmatch", key: "home", body: "home.html", description: "Dropmatch certifies AI companies for funding ten liters of safe drinking water for every liter their AI usage consumes. One public standard, one public registry, every grant proven." },
  { out: "standard.html", route: "/standard", title: "The Dropmatch Standard", key: "standard", body: "standard.html", description: "How the water footprint of AI usage is measured, verified, matched and proven. The Dropmatch Standard, version 1." },
  { out: "get-certified.html", route: "/get-certified", title: "Get certified", key: "certify", body: "certify.html", description: "Six steps, three verification tiers, the fee at cost and the water commitment at ten to one." },
  { out: "partners.html", route: "/partners", title: "Partners and programs", key: "partners", body: "partners.html", description: "The safe-water programs Dropmatch funds first, how a program qualifies, and how water is counted." },
  { out: "registry.html", route: "/registry", title: "Registry and ledger", key: "registry", body: "registry.html", description: "Every certified company, its verified usage, the water it funded and the proof." },
  { out: "transparency.html", route: "/transparency", title: "Transparency", key: "transparency", body: "transparency.html", description: "Every dollar accounted for: the public ledger, what is published, and the standards Dropmatch aligns with." },
  { out: "governance.html", route: "/governance", title: "Governance", key: "governance", body: "governance.html", description: "The documents, the board, the disclosures and how the money moves." },
];
const href = (k) => pages.find((p) => p.key === k).route;
const nav = (key) => `
<div class="topbar"><div class="wrap"><span>Dropmatch is a US nonprofit. Recognition under section 501(c)(3) is in progress.</span><a href="${href("registry")}">Check a certification</a></div></div>
<nav class="main" aria-label="Main"><div class="wrap">
  <a class="brand" href="${href("home")}">${drop}<span>Dropmatch<small>Water certification for AI</small></span></a>
  <div class="links">
    <a href="${href("standard")}"${key === "standard" ? ' class="on" aria-current="page"' : ""}>The Standard</a>
    <a href="${href("certify")}"${key === "certify" ? ' class="on" aria-current="page"' : ""}>Get Certified</a>
    <a href="${href("partners")}"${key === "partners" ? ' class="on" aria-current="page"' : ""}>Partners</a>
    <a href="${href("registry")}"${key === "registry" ? ' class="on" aria-current="page"' : ""}>Registry</a>
    <a href="${href("transparency")}"${key === "transparency" ? ' class="on" aria-current="page"' : ""}>Transparency</a>
    <a href="${href("governance")}"${key === "governance" ? ' class="on" aria-current="page"' : ""}>Governance</a>
    <a class="btn btn-primary" href="${href("certify")}">Apply</a>
  </div>
</div></nav>`;
const footer = `
<footer><div class="wrap foot-grid">
  <div><div class="brand">${drop}Dropmatch</div><p>Dropmatch, Inc., a North Carolina nonprofit corporation, Charlotte, NC. Articles of Incorporation filed 2026-10-05. Application for recognition under section 501(c)(3) in progress.</p><p>Every drop matched, ten times over.</p></div>
  <div class="col"><b>The program</b><a href="${href("standard")}">The Dropmatch Standard</a><a href="${href("certify")}">Get certified</a><a href="${href("registry")}">Registry and ledger</a><a href="${href("partners")}">Partners and programs</a></div>
  <div class="col"><b>The organization</b><a href="${href("governance")}">Governance and documents</a><a href="${href("transparency")}">Transparency and the ledger</a><a href="${href("governance")}#board">Board</a><a href="${href("governance")}#disclosure">Disclosures</a><a href="mailto:hello@dropmatch.org">Contact</a></div>
</div></footer>`;
for (const p of pages) {
  const body = fs.readFileSync(path.join(SRC, "pages", p.body), "utf8")
    .replace(/\{\{(\w+)\}\}/g, (_, k) => href(k))
    .replace(/url\('assets\//g, "url('/assets/")
    .replace(/src="assets\//g, 'src="/assets/');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.description}">
<link rel="canonical" href="${SITE}${p.route === "/" ? "/" : p.route}">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.description}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE}${p.route === "/" ? "/" : p.route}">
<meta property="og:image" content="${SITE}/assets/hero-laughing.jpg">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<style>
${fontsCss}
${css}
</style>
</head>
<body>
${icons}
${nav(p.key)}
${body}
${footer}
</body>
</html>
`;
  fs.writeFileSync(path.join(ROOT, p.out), html);
  console.log("wrote", p.out);
}
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `  <url><loc>${SITE}${p.route === "/" ? "/" : p.route}</loc></url>`).join("\n")}\n</urlset>\n`);
fs.writeFileSync(path.join(ROOT, "robots.txt"), `User-agent: *\nAllow: /\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(ROOT, "favicon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 26"><path d="M11 1.5C11 1.5 2.5 11 2.5 16.2a8.5 8.5 0 0 0 17 0C19.5 11 11 1.5 11 1.5z" fill="#1F6FEB"/></svg>\n`);
console.log("wrote sitemap.xml, robots.txt, favicon.svg");
