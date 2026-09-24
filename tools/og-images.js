#!/usr/bin/env node
//
// Generates Open Graph preview cards (1200×630 JPEG) for link previews in
// Telegram, WhatsApp, VK, Facebook, X, Slack and so on.
//
//   assets/img/og/default.jpg  — the site card (home, tabs, cv.html, ...)
//   assets/img/og/<slug>.jpg   — one card per post in _posts/
//
// _includes/head.html picks up a post's card automatically by its slug and
// falls back to the site card. The deploy workflow runs this script before
// the Jekyll build, so post cards are not kept in git. To preview locally:
//
//   node tools/og-images.js           # only the missing cards
//   node tools/og-images.js --force   # redraw every card
//
// Needs Playwright (`playwright` or `playwright-core`, local or global) and a
// Chromium-based browser; OG_CHROME sets the browser's path.

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function loadPlaywright() {
  const globalRoot = execSync('npm root -g').toString().trim();
  const candidates = ['playwright', 'playwright-core'].flatMap((name) => [name, path.join(globalRoot, name)]);
  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch {}
  }
  throw new Error('Playwright not found: npm install --no-save playwright-core');
}

function browserPath() {
  if (process.env.OG_CHROME) return process.env.OG_CHROME;
  if (fs.existsSync('/opt/pw-browsers/chromium')) return '/opt/pw-browsers/chromium';
  return undefined; // the browser bundled with Playwright
}

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'assets/img/og');
const force = process.argv.includes('--force');

const SITE = {
  name: 'Андрей Лендель',
  tagline: 'Личный блог',
  about: 'Сайты, программирование, Telegram-боты и заметки',
  host: 'lendel.github.io'
};

const MONTHS = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
];

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

// Keeps short words (prepositions, conjunctions) on the line with the next word.
function typograph(s) {
  return escapeHtml(s).replace(/(^|\s)([а-яёa-z]{1,2}) /giu, '$1$2&nbsp;');
}

function unquote(s) {
  s = s.trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1);
  }
  return s;
}

// Just enough YAML for the front matter keys we need.
function readPost(file) {
  const src = fs.readFileSync(file, 'utf8');
  const fm = (src.match(/^---\n([\s\S]*?)\n---/) || [])[1] || '';
  const get = (key) => {
    const m = fm.match(new RegExp(`^${key}:\\s*(.*)$`, 'm'));
    return m ? m[1].trim() : '';
  };
  const list = (key) => {
    const v = get(key);
    return v.startsWith('[') ? v.slice(1, -1).split(',').map(unquote).filter(Boolean) : [];
  };

  const base = path.basename(file).replace(/\.(md|markdown|html)$/, '');
  const dateMatch = base.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);

  return {
    slug: dateMatch[4],
    title: unquote(get('title')),
    category: list('categories')[0] || '',
    date: `${Number(dateMatch[3])} ${MONTHS[Number(dateMatch[2]) - 1]} ${dateMatch[1]}`,
    ogImage: get('image') !== ''
  };
}

const STYLE = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1200px; height: 630px; }
  body {
    font-family: 'Inter', 'DejaVu Sans', sans-serif;
    color: #fff;
    background: linear-gradient(135deg, #4f46e5 0%, #6d28d9 45%, #0ea5e9 100%);
    position: relative;
    overflow: hidden;
  }
  body::before, body::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgb(255 255 255 / 20%), transparent 70%);
  }
  body::before { width: 640px; height: 640px; right: -220px; top: -260px; }
  body::after { width: 420px; height: 420px; left: -160px; bottom: -220px; opacity: 0.6; }
  .card {
    position: relative;
    z-index: 1;
    height: 100%;
    padding: 72px 80px;
    display: flex;
    flex-direction: column;
  }
  .brand { display: flex; align-items: center; gap: 18px; font-size: 30px; font-weight: 600; }
  .mark {
    width: 56px; height: 56px; border-radius: 16px;
    display: grid; place-items: center;
    background: rgb(255 255 255 / 20%);
    border: 2px solid rgb(255 255 255 / 35%);
    font-size: 26px; font-weight: 800; letter-spacing: -0.02em;
  }
  .main { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  .kicker {
    align-self: flex-start;
    padding: 8px 20px;
    border-radius: 999px;
    background: rgb(255 255 255 / 18%);
    font-size: 26px; font-weight: 600;
    margin-bottom: 28px;
  }
  h1 { font-weight: 800; letter-spacing: -0.025em; line-height: 1.1; }
  .lead { margin-top: 24px; font-size: 34px; font-weight: 500; opacity: 0.9; line-height: 1.3; }
  .foot { display: flex; justify-content: space-between; font-size: 26px; font-weight: 500; opacity: 0.85; }
`;

// Inter (variable, SIL OFL) is bundled in tools/fonts, so rendering needs no network.
function fontFace(file, range) {
  const data = fs.readFileSync(path.join(__dirname, 'fonts', file)).toString('base64');
  return `@font-face {
    font-family: 'Inter'; font-weight: 100 900; font-display: block;
    src: url(data:font/woff2;base64,${data}) format('woff2');
    unicode-range: ${range};
  }`;
}

const FONTS = [
  fontFace('inter-latin.woff2', 'U+0000-00FF, U+2000-206F, U+20AC, U+2122, U+2212'),
  fontFace('inter-cyrillic.woff2', 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116')
].join('\n');

function page(body) {
  return `<!DOCTYPE html><html lang="ru"><head><meta charset="utf-8">
<style>${FONTS}${STYLE}</style></head><body><div class="card">${body}</div></body></html>`;
}

const brand = `<div class="brand"><div class="mark">АЛ</div>${escapeHtml(SITE.name)}</div>`;

function siteCard() {
  return page(`
    ${brand}
    <div class="main">
      <div class="kicker">${escapeHtml(SITE.tagline)}</div>
      <h1 style="font-size: 96px">${escapeHtml(SITE.name)}</h1>
      <div class="lead">${escapeHtml(SITE.about)}</div>
    </div>
    <div class="foot"><span>${SITE.host}</span><span>Павлодар, Казахстан</span></div>`);
}

function postCard(post) {
  const size = post.title.length > 70 ? 56 : post.title.length > 40 ? 68 : 80;
  return page(`
    ${brand}
    <div class="main">
      ${post.category ? `<div class="kicker">${escapeHtml(post.category)}</div>` : ''}
      <h1 style="font-size: ${size}px">${typograph(post.title)}</h1>
    </div>
    <div class="foot"><span>${SITE.host}</span><span>${escapeHtml(post.date)}</span></div>`);
}

async function main() {
  const jobs = [{ file: path.join(outDir, 'default.jpg'), html: siteCard() }];

  for (const name of fs.readdirSync(path.join(root, '_posts')).sort()) {
    if (!/\.(md|markdown|html)$/.test(name)) continue;
    const post = readPost(path.join(root, '_posts', name));
    if (post.ogImage) continue; // the post has its own `image`
    jobs.push({ file: path.join(outDir, `${post.slug}.jpg`), html: postCard(post) });
  }

  const todo = jobs.filter((job) => force || !fs.existsSync(job.file));
  if (todo.length === 0) {
    console.log('All OG images are up to date (use --force to redraw).');
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });

  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ executablePath: browserPath() });
  const tab = await browser.newPage({ viewport: { width: 1200, height: 630 } });

  for (const job of todo) {
    await tab.setContent(job.html);
    await tab.evaluate(() => document.fonts.ready);
    await tab.screenshot({ path: job.file, type: 'jpeg', quality: 90 });
    console.log('✔', path.relative(root, job.file));
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
