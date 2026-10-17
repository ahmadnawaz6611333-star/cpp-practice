#!/usr/bin/env node
'use strict';
/* ==========================================================================
 * CppPractice — AdSense readiness check
 * --------------------------------------------------------------------------
 * Verifies the things a Google AdSense application depends on and prints what
 * is still missing. FAIL items block an application; WARN items are things that
 * usually get a site rejected or that cost you money; INFO is just status.
 *
 *   npm run check:adsense
 *
 * This checks the *site*. It cannot apply for you, and approval is never
 * guaranteed — see README → AdSense checklist.
 * ========================================================================== */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const brand = require(path.join(ROOT, 'js/brand.js'));
const ads = require(path.join(ROOT, 'js/ads.js'));

const PUBLISHER_RE = /^ca-pub-\d{16}$/;
let fails = 0, warns = 0;

function read(rel) {
  try { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch (e) { return null; }
}
function pass(msg) { console.log('  ✅ ' + msg); }
function fail(msg) { fails++; console.log('  ❌ ' + msg); }
function warn(msg) { warns++; console.log('  ⚠️  ' + msg); }
function info(msg) { console.log('  ℹ️  ' + msg); }

console.log('================================================');
console.log('CppPractice · AdSense readiness check');
console.log('================================================');

/* ------------------------------- identity -------------------------------- */
console.log('\nIdentity & contact');
if (brand.name && brand.wordmark && brand.wordmark.main && brand.wordmark.accent) pass('brand name + wordmark set (' + brand.name + ')');
else fail('js/brand.js needs name and wordmark.main/wordmark.accent');

const email = String(brand.contactEmail || '').trim();
if (!email) fail('js/brand.js → contactEmail is empty (AdSense and privacy law require a reachable contact)');
else if (/example\.(com|org|net)$/i.test(email)) fail('js/brand.js → contactEmail is still the placeholder (' + email + ')');
else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) fail('js/brand.js → contactEmail does not look like an address: ' + email);
else pass('contact email set (' + email + ')');

if (brand.jurisdiction) pass('terms governing law: ' + brand.jurisdiction);
else warn('js/brand.js → jurisdiction is empty (used by the Terms of Service)');

/* --------------------------------- domain -------------------------------- */
console.log('\nDomain');
const live = String(brand.liveUrl || '');
if (/^https:\/\//.test(live)) pass('liveUrl is https: ' + live);
else fail('js/brand.js → liveUrl must be an https URL');
if (/\.github\.io\//.test(live) || /\.github\.io\/?$/.test(live)) {
  warn('liveUrl is a *.github.io address: a GitHub Pages project site is served from /<repo>/, so its');
  warn('  ads.txt cannot sit at the site root. ads.txt is optional (Google: "not mandatory, but highly');
  warn('  recommended"), so applying is still possible. An address of your own is recommended — free');
  warn('  options: cpppractice.edu.eu.org (nic.eu.org) or a *.pages.dev site, or a ~$10/yr domain.');
} else {
  pass('the site is on an address of its own, so ads.txt can be served at the site root');
}

/* ---------------------------------- docs --------------------------------- */
// The README's links are hand-maintained (see scripts/sync-brand.js), so verify
// them here rather than rewriting them.
console.log('\nDocumentation');
{
  const readme = read('README.md') || '';
  const liveNoSlash = String(brand.liveUrl || '').replace(/\/$/, '');
  if (liveNoSlash && readme.indexOf(liveNoSlash) !== -1) pass('README.md links to the live site');
  else fail('README.md does not mention liveUrl (' + brand.liveUrl + ') — update it by hand');
  if (brand.repository && readme.indexOf(brand.repository) !== -1) pass('README.md links to the repository');
  else fail('README.md does not mention the repository URL');
  if (/CPPractice/.test(readme)) fail('the old name "CPPractice" still appears in README.md');
  else pass('no stale brand name in README.md');
}

/* ---------------------------------- SEO ---------------------------------- */
console.log('\nStatic head tags (index.html)');
const html = read('index.html');
if (!html) fail('index.html is missing');
else {
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  if (title === brand.title) pass('<title> matches js/brand.js'); else fail('<title> is out of date — run npm run brand:sync');
  if (desc === brand.description) pass('meta description matches js/brand.js'); else fail('meta description is out of date — run npm run brand:sync');
  if (canon) pass('canonical link present: ' + canon); else fail('no canonical link — run npm run brand:sync');
  if (/property="og:title"/.test(html)) pass('Open Graph tags present'); else warn('no Open Graph tags');
  if (/<script src="js\/brand\.js"><\/script>\s*<script src="js\/ads\.js"><\/script>/.test(html)) pass('brand.js + ads.js load before the app');
  else fail('index.html must load js/brand.js and js/ads.js before js/core.js');
  const brandIdx = html.indexOf('js/brand.js');
  const coreIdx = html.indexOf('js/core.js');
  if (brandIdx !== -1 && coreIdx !== -1 && brandIdx < coreIdx) pass('config scripts are ordered before core.js');
  else fail('js/brand.js and js/ads.js must be included before js/core.js');
}

/* --------------------------------- pages --------------------------------- */
console.log('\nRequired pages');
const appJs = read('js/app.js') || '';
const viewsJs = read('js/views.js') || '';
for (const route of ['privacy', 'terms']) {
  const routed = new RegExp("\\['" + route + "'").test(appJs);
  const view = new RegExp('views\\.' + route + '\\s*=').test(viewsJs);
  if (routed && view) pass('/' + route + ' route + view exist');
  else fail('/' + route + ' is not wired up (' + (routed ? 'route ok, ' : 'no route, ') + (view ? 'view ok' : 'no view') + ')');
}
for (const [label, needle] of [
  ['privacy policy names Google/AdSense', /AdSense/],
  ['privacy policy explains cookies', /cookie/i],
  ['privacy policy gives an opt-out link', /adssettings\.google\.com/],
  ['terms state the sample-only judging limit', /sample check, not full judging/],
  ['terms cover acceptable use', /Acceptable use/],
]) {
  const src = /privacy/.test(label) ? viewsJs : viewsJs;
  if (needle.test(src)) pass(label); else fail('missing from the legal pages: ' + label);
}

/* ------------------------------- advertising ------------------------------ */
console.log('\nAdvertising configuration (js/ads.js)');
const pub = String(ads.publisherId || '').trim();
const adsOn = PUBLISHER_RE.test(pub);
if (!pub) info('publisherId is empty — advertising is off, so no ad script or ad cookie is loaded anywhere');
else if (!adsOn) fail('publisherId is malformed: ' + JSON.stringify(pub) + ' (expected ca-pub- + 16 digits)');
else pass('publisherId is valid: ' + pub);

if (adsOn) {
  const slots = Object.keys(ads.slots || {}).filter((k) => String(ads.slots[k]).trim());
  if (slots.length) pass('ad units configured: ' + slots.join(', '));
  else warn('no ad slots configured — the site would request the ad script but never render a unit');
}
if (ads.requireConsent === true) pass('requireConsent is true — no ad cookie before an explicit Accept');
else warn('requireConsent is false: visitors in the EU/UK could get ad cookies without consent (enable AdSense → Privacy & messaging as well)');

/* --------------------------------- ads.txt -------------------------------- */
console.log('\nads.txt');
const adsTxt = read('ads.txt');
if (!adsTxt) fail('ads.txt is missing from the repository root (npm run brand:sync creates it)');
else if (adsOn && adsTxt.indexOf(String(pub).replace(/^ca-/, '')) === -1) fail('ads.txt does not contain the configured seller id (pub-…) — run npm run brand:sync');
else if (adsOn && adsTxt.indexOf('ca-pub-') !== -1) fail('ads.txt must use the seller form "pub-…", not "ca-pub-…" — see Google\'s Ads.txt guide');
else if (adsOn) pass('ads.txt authorises ' + String(pub).replace(/^ca-/, '') + ' at the site root');
else info('ads.txt is a placeholder (advertising is off)');

if (/\.github\.io/.test(live)) {
  warn('on a *.github.io project site ads.txt is served at /<repo>/ads.txt, which is not the site root, so');
  warn('  AdSense will report its ads.txt status as "Not found" (this does not block the review)');
}

/* ---------------------------- sitemap / robots ---------------------------- */
console.log('\nCrawlability');
const sitemap = read('sitemap.xml');
if (sitemap && /<urlset/.test(sitemap)) {
  const n = (sitemap.match(/<url>/g) || []).length;
  pass('sitemap.xml present (' + n + ' url' + (n === 1 ? '' : 's') + ')');
  if (n === 1) info('one URL: a hash-routed SPA has a single addressable address (see README → Search visibility)');
} else fail('sitemap.xml missing — run npm run sitemap');
const robots = read('robots.txt');
if (robots && /User-agent/.test(robots)) pass('robots.txt present'); else fail('robots.txt missing — run npm run sitemap');

/* ------------------------------ brand sync -------------------------------- */
console.log('\nGenerated files match js/brand.js');
try {
  execFileSync(process.execPath, [path.join(__dirname, 'sync-brand.js'), '--check'], { stdio: 'pipe' });
  pass('index.html / ads.txt / package.json / README.md are in sync');
} catch (e) {
  fail('generated files are out of date — run npm run brand:sync');
}

/* -------------------------------- summary -------------------------------- */
console.log('\n================================================');
if (fails) console.log(`Result: NOT ready — ${fails} blocking issue(s), ${warns} warning(s)`);
else if (warns) console.log(`Result: technically ready — ${warns} warning(s) worth fixing before applying`);
else console.log('Result: ready to apply');
console.log('================================================');
console.log('Reminder: this checks the site only. Approval is Google\'s decision and');
console.log('depends on traffic, originality of the content and their policies.');
process.exit(fails ? 1 : 0);
