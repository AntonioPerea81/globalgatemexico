import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

type HreflangEntry = { lang: string; href: string };
type PageMeta = {
  title?: string;
  description?: string;
  canonical?: string;
  hreflang?: HreflangEntry[];
  lang?: string;
};

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const template = await readFile(path.join(dist, 'index.html'), 'utf8');
const sitemap = await readFile(path.join(root, 'public', 'sitemap.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>https:\/\/www\.globalgatemexico\.com([^<]*)<\/loc>/g)]
  .map((match) => match[1] || '/');
const serverEntry = pathToFileURL(path.join(root, '.prerender', 'server', 'entry-server.js')).href;
const { render } = await import(serverEntry) as { render: (url: string) => { html: string; meta: PageMeta } };

// Keep a neutral client-rendered shell for operational routes that are not
// indexable (enrollment, payment completion, tracking embeds, etc.).
const spaShell = template.replace('<head>', '<head>\n    <meta name="robots" content="noindex,follow" />');
await writeFile(path.join(dist, 'spa.html'), spaShell);

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderHead(html: string, meta: PageMeta) {
  const title = meta.title ?? 'Global Gate Mexico | Dangerous Goods Logistics & Compliance';
  const description = meta.description ?? 'Global Gate Mexico — premium dangerous goods logistics, ADN/IATA/IMDG compliance consulting, and regulatory training across Mexico and North America.';
  const canonical = meta.canonical ?? 'https://www.globalgatemexico.com';
  const alternates = (meta.hreflang ?? [])
    .map(({ lang, href }) => `    <link rel="alternate" hreflang="${escapeHtml(lang)}" href="${escapeHtml(href)}" />`)
    .join('\n');
  const tags = [
    `    <meta name="description" content="${escapeHtml(description)}" />`,
    `    <meta property="og:title" content="${escapeHtml(title)}" />`,
    `    <meta property="og:description" content="${escapeHtml(description)}" />`,
    `    <meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `    <meta property="og:locale" content="${meta.lang === 'es' ? 'es_MX' : 'en_US'}" />`,
    `    <meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `    <meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `    <link rel="canonical" href="${escapeHtml(canonical)}" />`,
    `    <script src="https://analytics.ahrefs.com/analytics.js" data-key="fZis1kYF463+GFh5JW4cWg" async></script>`,
    alternates,
    `    <title>${escapeHtml(title)}</title>`,
  ].filter(Boolean).join('\n');

  return html
    .replace(/<html lang="[^"]*">/, `<html lang="${meta.lang ?? 'en'}">`)
    .replace(/\s*<meta name="description"[^>]*>/, '')
    .replace(/\s*<meta property="og:title"[^>]*>/, '')
    .replace(/\s*<meta property="og:description"[^>]*>/, '')
    .replace(/\s*<meta property="og:locale"[^>]*>/, '')
    .replace(/\s*<meta name="twitter:title"[^>]*>/, '')
    .replace(/\s*<meta name="twitter:description"[^>]*>/, '')
    .replace(/\s*<title>[\s\S]*?<\/title>/, '')
    .replace('    <meta property="og:type" content="website" />', `    <meta property="og:type" content="website" />\n${tags}`);
}

for (const route of routes) {
  const { html: appHtml, meta } = render(route);
  const page = renderHead(template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`), meta);
  const output = route === '/' ? path.join(dist, 'index.html') : path.join(dist, `${route.slice(1)}.html`);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, page);
}

await rm(path.join(root, '.prerender'), { recursive: true, force: true });
console.log(`Prerendered ${routes.length} canonical routes.`);
