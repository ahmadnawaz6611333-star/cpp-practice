/**
 * CppPractice — brand & AdSense readiness test
 * ---------------------------------------------------------------------------
 * Two things are verified here.
 *
 * 1. Behaviour that must not regress (loaded into a sandbox, so no browser is
 *    needed): advertising must never emit markup or load Google's script unless
 *    a valid publisher id is configured *and* the visitor has consented, and the
 *    2,040-problem catalogue must be untouched by the rebrand.
 *
 * 2. The static files an AdSense application depends on: the head tags in
 *    index.html, ads.txt, robots.txt, sitemap.xml, the legal pages, and that the
 *    generated files still match js/brand.js (run `npm run brand:sync` if not).
 *
 * Run: node tests/adsense.test.js
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');

const ROOT = path.join(__dirname, '..');
const brand = require(path.join(ROOT, 'js/brand.js'));
const ads = require(path.join(ROOT, 'js/ads.js'));

let passed = 0, failed = 0;
const failures = [];
function ok(name, cond, detail) {
  if (cond) { passed++; console.log('  ✅ ' + name); }
  else { failed++; failures.push(name); console.log('  ❌ ' + name + (detail ? ' — ' + detail : '')); }
}
function read(rel) {
  try { return fs.readFileSync(path.join(ROOT, rel), 'utf8'); } catch (e) { return null; }
}

/* ==========================================================================
 * 1. core.js loaded in a sandbox — advertising gating
 * ======================================================================== */
function sandbox(overrides) {
  const store = new Map();
  const created = [];
  const document = {
    currentScript: null,
    baseURI: 'http://localhost:3001/',
    createElement: (tag) => {
      const el = { tagName: String(tag).toUpperCase(), attributes: {}, appendChild() {} };
      created.push(el);
      return el;
    },
    head: { appendChild() {} },
    querySelectorAll: () => [],
    querySelector: () => null,
    documentElement: { setAttribute() {}, getAttribute: () => null },
    addEventListener() {},
  };
  const location = {
    protocol: 'http:', host: 'localhost:3001', hostname: 'localhost', port: '3001',
    origin: 'http://localhost:3001', pathname: '/', search: '', hash: '',
    href: 'http://localhost:3001/', replace() {}, assign() {},
  };
  const localStorage = {
    getItem: (k) => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    get length() { return store.size; },
    key: (i) => Array.from(store.keys())[i],
  };
  Object.assign(localStorage, {
    // Object.keys(localStorage) is used by Store.resetAll
    ...Object.fromEntries(Array.from(store.entries())),
  });

  const win = {};
  const ctx = {
    window: win, document, location, localStorage, navigator: { userAgent: 'node-test' },
    console, setTimeout, clearTimeout, fetch: () => Promise.reject(new Error('offline')),
    URL, URLSearchParams, encodeURIComponent, decodeURIComponent, AbortController,
    CPP_BRAND: Object.assign({}, brand, overrides && overrides.brand),
    CPP_ADS: Object.assign({ slots: {} }, ads, overrides && overrides.ads),
  };
  ctx.window = ctx;             // window === global-ish
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/core.js'), 'utf8'), ctx, { filename: 'core.js' });
  return { ctx, CPP: ctx.CPP, created, store };
}

console.log('================================================');
console.log('CppPractice · brand & AdSense readiness test');
console.log('================================================');

console.log('\nAdvertising is inert without configuration');
{
  // A fork or a fresh checkout with no publisher id must stay completely clean,
  // so this case is pinned explicitly rather than relying on the repo's config.
  const { CPP, created } = sandbox({ ads: { publisherId: '', slots: {} } });
  ok('brand is read from window.CPP_BRAND', CPP.brand.name === brand.name, CPP.brand.name);
  ok('wordmark renders from config', CPP.brand.wordmarkHtml() === brand.wordmark.main + '<span class="dot">' + brand.wordmark.accent + '</span>', CPP.brand.wordmarkHtml());
  ok('ads are disabled with no publisher id', CPP.ads.enabled() === false);
  ok('no ad markup is produced', CPP.ads.slotHtml('home') === '' && CPP.ads.slotHtml('problems') === '');
  ok('activate() loads nothing', CPP.ads.activate() === false && created.length === 0, JSON.stringify(created.map((c) => c.tagName)));
  ok('no consent banner is demanded when there are no ads', CPP.consent.needed() === false);
}

console.log('\nThe publisher id in this checkout');
{
  const pub = String(ads.publisherId || '').trim();
  if (!pub) {
    ok('advertising is not configured in this checkout (nothing loads)', true);
  } else {
    ok('js/ads.js carries a well-formed publisher id', /^ca-pub-\d{16}$/.test(pub), pub);
    const { CPP, created } = sandbox();
    ok('a configured publisher activates advertising', CPP.ads.enabled() === true);
    ok('but the visitor is asked before anything loads', CPP.consent.needed() === true && CPP.consent.allowsAds() === false);
    ok('and activate() still loads nothing on its own', CPP.ads.activate() === false && created.length === 0);
    ok('no placement renders without an ad unit id',
      CPP.ads.slotHtml('home') === '' || /data-ad-slot="[^"]+"/.test(CPP.ads.slotHtml('home')));
  }
}

console.log('\nConsent gates every ad, even once a publisher id exists');
{
  const { CPP, created } = sandbox({
    ads: { publisherId: 'ca-pub-1234567890123456', slots: { home: '1112223333' } },
  });
  ok('a valid publisher id enables advertising', CPP.ads.enabled() === true);
  ok('a malformed publisher id would not', sandbox({ ads: { publisherId: 'ca-pub-123' } }).CPP.ads.enabled() === false);
  ok('before choosing, nothing may load', CPP.consent.allowsAds() === false && CPP.ads.slotHtml('home') === '');
  ok('the visitor is asked exactly once', CPP.consent.needed() === true);

  CPP.consent.set('denied');
  ok('"essential only" keeps ads off', CPP.consent.allowsAds() === false && CPP.ads.slotHtml('home') === '');
  ok('and loads no script', CPP.ads.activate() === false && created.length === 0);

  CPP.consent.set('granted');
  const html = CPP.ads.slotHtml('home');
  ok('"accept" produces a labelled ad unit', /adsbygoogle/.test(html) && /ca-pub-1234567890123456/.test(html) && /1112223333/.test(html), html.slice(0, 80));
  ok('the unit is clearly labelled as an advertisement', /Advertisement/.test(html));
  ok('slots without an id stay absent', CPP.ads.slotHtml('problems') === '');

  CPP.consent.clear();
  ok('withdrawing consent turns ads off again', CPP.consent.allowsAds() === false && CPP.ads.slotHtml('home') === '');
}

console.log('\nThe catalogue is untouched by the rebrand');
{
  const ctx = {};
  vm.createContext(ctx);
  const src = fs.readFileSync(path.join(ROOT, 'js/data.js'), 'utf8');
  // Top-level const/let live in the script scope, not on the global object, so
  // ask the script itself to hand the catalogue over.
  vm.runInContext(src + '\n;globalThis.__Catalogue = CATALOGUE;', ctx, { filename: 'data.js' });
  const cat = ctx.__Catalogue;
  const list = cat && cat.problems;
  ok('all 2,040 problems are still present', Array.isArray(list) && list.length === 2040, list ? String(list.length) : 'missing');
  ok('the catalogue index still resolves every id', !!cat && !!cat.byId && typeof cat.byId.get === 'function' && list.every((p) => cat.byId.get(p.id) === p));
  ok('every problem keeps its id, title, statement and samples',
    Array.isArray(list) && list.every((p) => p.id && p.title && p.statement != null && 'input' in p && 'output' in p && p.difficulty));
  ok('difficulty spread is intact', !!cat && cat.difficulties.length === 3 && list.every((p) => cat.difficulties.indexOf(p.difficulty) !== -1));
}

/* ==========================================================================
 * 2. Static files an AdSense review looks at
 * ======================================================================== */
console.log('\nindex.html (what a crawler sees)');
const html = read('index.html');
ok('index.html exists', !!html);
if (html) {
  ok('declares no hard-coded <base> (works on sub-path hosts)',
    !/<base\b/i.test(html.replace(/<!--[\s\S]*?-->/g, '')), '<base> found outside comments');
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1];
  ok('title matches js/brand.js', title === brand.title, JSON.stringify(title));
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  ok('meta description matches js/brand.js', desc === brand.description);
  const canon = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  ok('canonical points at the live URL', canon === String(brand.liveUrl).replace(/\/?$/, '/'), String(canon));
  ok('Open Graph tags present', /property="og:title"/.test(html) && /property="og:url"/.test(html));
  ok('viewport + theme colour present', /name="viewport"/.test(html) && /name="theme-color"/.test(html));
  ok('config scripts load before the app', html.indexOf('js/brand.js') < html.indexOf('js/core.js') && html.indexOf('js/ads.js') < html.indexOf('js/core.js'));
  ok('the old brand name is gone', !/CPPractice/.test(html), 'CPPractice still appears in index.html');
  ok('no adsbygoogle script is hard-coded in the page', !/pagead2\.googlesyndication\.com/.test(html));
  ok('footer links to the legal pages', /href="\/privacy"/.test(html) && /href="\/terms"/.test(html));
  ok('a consent host exists for the banner', /id="consentHost"/.test(html));
  ok('the wordmark is configurable at runtime', /data-brand="wordmark"/.test(html));
  const pubForMeta = String(ads.publisherId || '').trim();
  if (pubForMeta) {
    ok('the AdSense verification meta names the publisher',
      new RegExp('name="google-adsense-account" content="' + pubForMeta + '"').test(html), pubForMeta);
  } else {
    ok('the AdSense verification meta is absent while advertising is off', !/google-adsense-account/.test(html));
  }
}

console.log('\nads.txt, robots.txt, sitemap.xml');
const adsTxt = read('ads.txt');
ok('ads.txt exists at the repository root', !!adsTxt);
if (adsTxt) {
  const pub = String(ads.publisherId || '').trim();
  if (!pub) ok('while advertising is off it explains itself instead of authorising anyone', adsTxt.trim().startsWith('#'));
  else {
    const sellerId = pub.replace(/^ca-/, '');
    ok('it authorises the configured publisher id',
      adsTxt.indexOf(sellerId) !== -1 && new RegExp('^google\\.com, pub-\\d{16}, DIRECT, f08c47fec0942fa0$', 'm').test(adsTxt));
    // ads.txt uses the bare `pub-…` seller id; `ca-pub-…` belongs to the tag.
    ok('it uses the ads.txt seller-id form, not the tag form', adsTxt.indexOf('ca-pub-') === -1);
  }
}
const robots = read('robots.txt');
ok('robots.txt exists', !!robots && /User-agent: \*/.test(robots));
ok('robots.txt points to the sitemap', /Sitemap: https?:\/\//.test(robots || ''));
ok('robots.txt does not block the site', !/^Disallow: \/$/m.test(robots || ''));

const sitemap = read('sitemap.xml');
ok('sitemap.xml exists and is well formed', !!sitemap && /^<\?xml/.test(sitemap) && /<urlset[\s\S]*<\/urlset>/.test(sitemap));
if (sitemap) {
  const locs = (sitemap.match(/<loc>([^<]+)<\/loc>/g) || []).map((s) => s.replace(/<\/?loc>/g, ''));
  ok('the sitemap lists https URLs only', locs.length > 0 && locs.every((u) => /^https:\/\//.test(u)), locs.join(', '));
  ok('every sitemap URL is inside the live site', locs.every((u) => u.indexOf(String(brand.liveUrl).replace(/\/?$/, '/')) === 0 || u === String(brand.liveUrl).replace(/\/$/, '')));
}

console.log('\nLegal pages and their disclosures');
{
  const src = read('js/views.js') || '';
  const app = read('js/app.js') || '';
  ok('privacy route is registered', /\['privacy',/.test(app));
  ok('terms route is registered', /\['terms',/.test(app));
  ok('privacy policy is rendered by a view', /views\.privacy\s*=/.test(src));
  ok('terms page is rendered by a view', /views\.terms\s*=/.test(src));
  ok('privacy policy names the ad provider', /AdSense/.test(src));
  ok('privacy policy describes the cookies', /advertising cookies/i.test(src));
  ok('privacy policy links the opt-out', /adssettings\.google\.com/.test(src));
  ok('privacy policy lists the real localStorage keys',
    ['cpp-solved-problems', 'cpp-bookmarked-problems', 'cpp-settings', 'cpp-consent'].every((k) => src.indexOf(k) !== -1));
  ok('privacy policy is honest about cloud code leaving the device', /sent over HTTPS to the hosted compiler service/.test(src));
  ok('terms state that Submit is a sample check only', /sample check, not full judging/.test(src));
  ok('terms cover acceptable use and liability', /Acceptable use/.test(src) && /Limitation of liability/.test(src));
  ok('both pages show a last-updated date', (src.match(/policiesUpdated/g) || []).length >= 2);
}

console.log('\nGenerated files match js/brand.js');
{
  let inSync = true, detail = '';
  try {
    execFileSync(process.execPath, [path.join(ROOT, 'scripts', 'sync-brand.js'), '--check'], { stdio: 'pipe' });
  } catch (e) {
    inSync = false;
    detail = String(e.stderr || e.stdout || '').split('\n').filter(Boolean).slice(0, 4).join(' | ');
  }
  ok('index.html / ads.txt / package.json / README.md are in sync', inSync, detail);
}
{
  const pkg = JSON.parse(read('package.json'));
  ok('package.json description matches the brand', pkg.description === brand.description);
  ok('package.json exposes the brand tooling',
    pkg.scripts['brand:sync'] && pkg.scripts['check:adsense'] && pkg.scripts['sitemap'] && pkg.scripts['test:adsense']);
}
{
  const readme = read('README.md') || '';
  ok('README links to the live site', readme.indexOf(String(brand.liveUrl).replace(/\/$/, '')) !== -1);
  ok('README links to the repository', readme.indexOf(brand.repository) !== -1);
  ok('README keeps the contact email in js/brand.js, not in the docs', readme.indexOf(brand.contactEmail) === -1);
  // Regression guard: sync-brand once rewrote every GitHub URL, which clobbered
  // unrelated links such as the is-a.dev registration repo.
  ok('README keeps unrelated third-party links intact', readme.indexOf('https://github.com/is-a-dev/register') !== -1);
}
ok('server.js takes the service name from js/brand.js', /BRAND\.name/.test(read('server.js') || ''));
ok('the server serves ads.txt, robots.txt and sitemap.xml', /app\.get\('\/ads\.txt'/.test(read('server.js') || '') && /app\.get\('\/sitemap\.xml'/.test(read('server.js') || ''));

console.log('\n================================================');
console.log(`Results: ${passed}/${passed + failed} passed · ${failed} failed`);
if (failed) console.log('Failed: ' + failures.join(' | '));
console.log('================================================');
process.exit(failed ? 1 : 0);
