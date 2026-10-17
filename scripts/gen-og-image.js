#!/usr/bin/env node
/* ==========================================================================
 * Generates og-image.png — the 1200x630 card that WhatsApp, Facebook,
 * LinkedIn, X and Discord show when somebody shares the site.
 *
 * Why a browser is involved: the card is a styled page (gradients, masks,
 * gradient text, a mock editor panel) and rendering it with the same engine
 * that renders the site is both the most accurate and the only way to do it
 * with no dependencies beyond the browser the tests already need. Nothing is
 * downloaded.
 *
 * Everything visible comes from js/brand.js, so the card cannot drift from
 * the name, the wordmark or the problem count:
 *
 *     npm run og:image      # writes og-image.png at the repository root
 *
 * The card is generated in the system temp directory; the only file this
 * script writes inside the repository is og-image.png itself.
 * ========================================================================== */
'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const brand = require(path.join(ROOT, 'js', 'brand.js'));
const OUT = path.join(ROOT, 'og-image.png');
const WIDTH = 1200;
const HEIGHT = 630;

/* --------------------------- browser discovery --------------------------- */

function findChrome() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  return candidates.find((p) => fs.existsSync(p)) || null;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ---------------------------- card contents ----------------------------- */

// The problem count is read out of the title so it can never go stale.
const count = (String(brand.title).match(/([\d,]{3,})\s*Problems/i) || [])[1] || '2,040';
const wordMain = esc((brand.wordmark && brand.wordmark.main) || brand.name);
const wordAccent = esc((brand.wordmark && brand.wordmark.accent) || '');
const tagline = esc(brand.tagline || brand.shortDescription || '');
const host = esc(String(brand.liveUrl || '').replace(/^https?:\/\//, '').replace(/\/$/, ''));

// The snippet in the editor panel is the smallest honest C++ program, and the
// column highlights only colour it — no output is faked anywhere in the card.
const snippet = [
  '<span class="pp">#include</span> <span class="st">&lt;iostream&gt;</span>',
  '',
  '<span class="kw">int</span> <span class="fn">main</span>() {',
  '  <span class="ns">std</span>::<span class="ns">cout</span> <span class="op">&lt;&lt;</span> <span class="st">"Hello, C++"</span>;',
  '  <span class="kw">return</span> <span class="nm">0</span>;',
  '}',
].join('\n');

const html = `<!DOCTYPE html>
<html lang="${esc(brand.locale || 'en')}">
<head>
<meta charset="UTF-8">
<title>${esc(brand.name)} — social card</title>
<style>
  html { width: ${WIDTH}px; height: ${HEIGHT}px; }
  body {
    box-sizing: border-box;
    width: ${WIDTH}px; height: ${HEIGHT}px; margin: 0; overflow: hidden;
    position: relative;
    font-family: 'Segoe UI', system-ui, -apple-system, Arial, sans-serif;
    background: #0a0e1a;
    color: #e9edf7;
    padding: 52px 68px;
    display: flex; flex-direction: column; justify-content: space-between;
  }
  body::before {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(760px 460px at 84% -14%, rgba(99, 102, 241, .45), transparent 62%),
      radial-gradient(620px 420px at 2% 116%, rgba(52, 211, 153, .24), transparent 60%);
  }
  .grid {
    position: absolute; inset: 0; opacity: .15;
    background-image:
      linear-gradient(rgba(255, 255, 255, .55) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, .55) 1px, transparent 1px);
    background-size: 56px 56px;
    -webkit-mask-image: radial-gradient(740px 460px at 30% 42%, #000, transparent 78%);
    mask-image: radial-gradient(740px 460px at 30% 42%, #000, transparent 78%);
  }
  header, main, footer { position: relative; }

  header { display: flex; align-items: center; gap: 22px; }
  .logo {
    box-sizing: border-box;
    width: 84px; height: 84px; border-radius: 22px;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(145deg, #6366f1, #8b5cf6);
    color: #fff; font-weight: 800; font-size: 34px; line-height: 1;
    font-family: 'Cascadia Mono', Consolas, monospace;
    box-shadow: 0 18px 50px rgba(99, 102, 241, .5);
  }
  .name { font-size: 54px; font-weight: 800; letter-spacing: -1.6px; line-height: 1; }
  .name .accent { color: #818cf8; }
  .tag { margin-top: 10px; font-size: 22px; color: #a7b2ce; }

  main { display: flex; align-items: center; gap: 52px; }
  .left { flex: 1 1 auto; }
  .count {
    font-size: 96px; font-weight: 800; letter-spacing: -4px; line-height: 1;
    background: linear-gradient(92deg, #c7d2fe, #818cf8 42%, #22d3ee);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .countlabel { margin-top: 8px; font-size: 26px; color: #c3cbe0; }
  .bar {
    margin-top: 22px; height: 7px; width: 340px; border-radius: 99px;
    background: linear-gradient(90deg, #6366f1, #22d3ee 60%, #34d399);
  }

  .code {
    box-sizing: border-box; flex: none; width: 436px;
    border: 1px solid rgba(255, 255, 255, .12); border-radius: 18px;
    background: rgba(9, 13, 26, .78);
    box-shadow: 0 26px 70px rgba(0, 0, 0, .55);
    overflow: hidden;
  }
  .codetop {
    display: flex; align-items: center; gap: 9px;
    padding: 13px 18px; border-bottom: 1px solid rgba(255, 255, 255, .09);
    background: rgba(255, 255, 255, .035);
  }
  .codetop i { width: 12px; height: 12px; border-radius: 99px; display: block; }
  .codetop i:nth-child(1) { background: #f87171; }
  .codetop i:nth-child(2) { background: #fbbf24; }
  .codetop i:nth-child(3) { background: #34d399; }
  .codetop span {
    margin-left: 8px; font-size: 15px; letter-spacing: .4px;
    color: #8d99b8; font-family: 'Cascadia Mono', Consolas, monospace;
  }
  pre {
    margin: 0; padding: 20px 20px 22px;
    font-family: 'Cascadia Mono', Consolas, monospace;
    font-size: 18px; line-height: 1.62; color: #dde4f4;
    white-space: pre; tab-size: 2;
  }
  .pp { color: #c084fc; }
  .st { color: #86efac; }
  .kw { color: #f472b6; }
  .fn { color: #7dd3fc; }
  .ns { color: #fcd34d; }
  .op { color: #94a3b8; }
  .nm { color: #fda4af; }

  footer { display: flex; align-items: center; justify-content: space-between; }
  .chips { display: flex; gap: 12px; }
  .chips span {
    font-size: 19px; color: #c8d2ea;
    border: 1px solid rgba(255, 255, 255, .16);
    background: rgba(255, 255, 255, .055);
    padding: 9px 18px; border-radius: 99px;
  }
  .host {
    font-family: 'Cascadia Mono', Consolas, monospace;
    font-size: 20px; color: #7ee2c0;
  }
</style>
</head>
<body>
  <div class="grid"></div>
  <header>
    <div class="logo">C++</div>
    <div>
      <div class="name">${wordMain}<span class="accent">${wordAccent}</span></div>
      <div class="tag">${tagline}</div>
    </div>
  </header>
  <main>
    <div class="left">
      <div class="count">${esc(count)}</div>
      <div class="countlabel">curated C++ problems, ready to solve</div>
      <div class="bar"></div>
    </div>
    <div class="code">
      <div class="codetop"><i></i><i></i><i></i><span>main.cpp</span></div>
      <pre>${snippet}</pre>
    </div>
  </main>
  <footer>
    <div class="chips">
      <span>In-browser editor</span>
      <span>Real g++</span>
      <span>Free</span>
    </div>
    <div class="host">${host}</div>
  </footer>
</body>
</html>
`;

/* -------------------------------- render -------------------------------- */

const chrome = findChrome();
if (!chrome) {
  console.error('✖ No Chrome/Edge found — set CHROME_PATH to regenerate og-image.png.');
  process.exit(1);
}

const cardPath = path.join(os.tmpdir(), 'cpppractice-og-card.html');
fs.writeFileSync(cardPath, html, 'utf8');

const fileUrl = 'file:///' + cardPath.replace(/\\/g, '/');
const outArg = OUT.replace(/\\/g, '/');

const run = spawnSync(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--no-first-run',
  '--force-device-scale-factor=1',
  '--window-size=' + WIDTH + ',' + HEIGHT,
  '--virtual-time-budget=4000',
  '--screenshot=' + outArg,
  fileUrl,
], { stdio: ['ignore', 'ignore', 'pipe'], timeout: 90000, encoding: 'utf8' });

if (!fs.existsSync(OUT)) {
  console.error('✖ Chrome did not produce og-image.png');
  if (run.stderr) console.error(run.stderr.split('\n').slice(0, 6).join('\n'));
  process.exit(1);
}

// A screenshot that silently came out blank is worse than no screenshot, so
// check the PNG signature and refuse to ship an empty file.
const head = fs.readFileSync(OUT).subarray(0, 8).toString('hex');
if (head !== '89504e470d0a1a0a') {
  console.error('✖ og-image.png is not a valid PNG (signature ' + head + ')');
  process.exit(1);
}

const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
console.log('✎ og-image.png  →  ' + WIDTH + '×' + HEIGHT + '  (' + kb + ' KB)');
console.log('  title card for "' + brand.name + '" — ' + count + ' problems, ' + host);
