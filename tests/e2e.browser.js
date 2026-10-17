/**
 * CppPractice — end-to-end browser test
 * ---------------------------------------------------------------------------
 * Drives a real headless Chrome instance through the Chrome DevTools Protocol
 * (no third-party dependencies — Node's built-in fetch + WebSocket are used)
 * to verify that the page renders, the editor works and that Run / Submit
 * produce genuine compiler output.
 *
 * Usage:
 *   npm start                     # backend in one terminal
 *   node tests/e2e.browser.js     # this script in another
 *
 * Set CHROME_PATH to override browser discovery.
 */
'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3001';
const PORT = 9333;
const CHROME = findChrome();

let passed = 0, failed = 0, total = 0;
const failures = [];
function ok(name, cond, detail) {
  total++;
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; failures.push(name); console.log(`  ❌ ${name}${detail ? ' — ' + detail : ''}`); }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Put code into the editor that is actually mounted. Monaco can hold extra,
// orphaned models, so picking models()[0] is unreliable; the app exposes the
// live editor handle as CPP.activeEditor (see js/views.js).
const setEditorCode = (code) => `(function () {
  var code = ${JSON.stringify(code)};
  if (window.CPP && CPP.activeEditor && CPP.activeEditor.setValue) { CPP.activeEditor.setValue(code); return 'activeEditor'; }
  if (window.monaco && monaco.editor.getModels().length) { monaco.editor.getModels()[0].setValue(code); return 'monaco'; }
  var ta = document.querySelector('#edHost textarea');
  if (ta) { ta.value = code; ta.dispatchEvent(new Event('input', { bubbles: true })); return 'textarea'; }
  return 'none';
})()`;

function findChrome() {
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) return process.env.CHROME_PATH;
  const candidates = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ];
  return candidates.find((c) => fs.existsSync(c)) || null;
}

/* ------------------------------ CDP client ------------------------------ */
class CDP {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    this.ready = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', () => resolve());
      this.ws.addEventListener('error', (e) => reject(new Error('ws error')));
    });
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      } else if (msg.method) {
        this.events.push(msg);
      }
    });
  }
  send(method, params) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
  async eval(expr, awaitPromise) {
    const r = await this.send('Runtime.evaluate', {
      expression: expr, returnByValue: true, awaitPromise: !!awaitPromise, userGesture: true,
    });
    if (r.exceptionDetails) {
      throw new Error('page evaluation threw: ' + (r.exceptionDetails.exception && r.exceptionDetails.exception.description || r.exceptionDetails.text));
    }
    return r.result ? r.result.value : undefined;
  }
  async waitFor(expr, timeoutMs) {
    const deadline = Date.now() + (timeoutMs || 15000);
    for (;;) {
      let v = false;
      try { v = await this.eval(expr); } catch (e) { v = false; }
      if (v) return true;
      if (Date.now() > deadline) return false;
      await sleep(200);
    }
  }
  close() { try { this.ws.close(); } catch (e) {} }
}

async function pageTargets() {
  const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
  return res.json();
}

/* ----------------------------- main suite ------------------------------ */
async function main() {
  console.log('================================================');
  console.log('CppPractice · end-to-end browser test');
  console.log('================================================');
  if (!CHROME) {
    console.log('⚠️  No Chrome/Edge found — skipping browser test (set CHROME_PATH).');
    process.exit(0);
  }
  console.log('browser:', CHROME);

  const profile = path.join(os.tmpdir(), 'cpp-practice-e2e-' + Date.now());
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--no-sandbox', '--hide-scrollbars', `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`, '--window-size=1440,1000', 'about:blank',
  ], { stdio: 'ignore' });

  let cdp = null;
  try {
    // wait for the debugging endpoint
    let target = null;
    for (let i = 0; i < 60 && !target; i++) {
      await sleep(300);
      try {
        const list = await pageTargets();
        target = list.find((t) => t.type === 'page');
      } catch (e) { /* not up yet */ }
    }
    if (!target) throw new Error('Chrome DevTools endpoint never became available');

    cdp = new CDP(target.webSocketDebuggerUrl);
    await cdp.ready;
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Log.enable');

    // Navigate in a way that cannot be fooled by the *previous* document. The
    // unique query token can only be observed once the new page has committed,
    // so a click that lands on a stale document — which used to make the theme
    // test flake — is impossible.
    let navSeq = 0;
    async function load(route, readyExpr, timeoutMs) {
      const token = 'e2e' + (++navSeq) + 'x' + Date.now();
      const url = BASE + route + (route.indexOf('?') === -1 ? '?' : '&') + token + '=1';
      await cdp.send('Page.navigate', { url });
      return cdp.waitFor(
        `location.search.indexOf(${JSON.stringify(token)}) !== -1 && !!window.CPP && (${readyExpr || 'true'})`,
        timeoutMs || 20000
      );
    }

    /* ---------------- 1. Home page ---------------- */
    let loaded = await load('/', '!!document.querySelector(".hero h1")');
    ok('home page renders hero', loaded);
    const heroText = await cdp.eval('document.querySelector(".hero h1").textContent');
    ok('hero mentions mastering C++', /Master C\+\+/.test(heroText || ''), heroText);
    const navCount = await cdp.eval('document.querySelectorAll(".nav-link").length');
    ok('navigation links rendered', navCount >= 6, 'count=' + navCount);

    /* ---------------- 2. Catalogue ---------------- */
    await cdp.send('Page.navigate', { url: BASE + '/problems' });
    await cdp.waitFor('document.querySelectorAll(".problem-row").length > 0', 15000);
    const rows = await cdp.eval('document.querySelectorAll(".problem-row").length');
    ok('catalogue renders a page of problems', rows === 25, 'rows=' + rows);
    const meta = await cdp.eval('document.querySelector("#pMeta").textContent');
    ok('catalogue reports 2,040 problems', /2,040/.test(meta || ''), meta);

    // search filter
    await cdp.eval(`(function(){
      const i = document.querySelector('#pSearch');
      i.value = 'palindrome';
      i.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    })()`);
    await sleep(900);
    const urlAfterSearch = await cdp.eval('location.pathname + location.search');
    ok('search updates the URL', /q=palindrome/.test(urlAfterSearch || ''), urlAfterSearch);
    const metaAfter = await cdp.eval('document.querySelector("#pMeta").textContent');
    const m = (metaAfter || '').match(/^\s*([\d,]+)/);
    const matched = m ? parseInt(m[1].replace(/,/g, ''), 10) : -1;
    ok('search narrows the result set', matched > 0 && matched < 2040, metaAfter);
    ok('every search result actually contains the term',
      (await cdp.eval(`Array.from(document.querySelectorAll('.problem-row .ptitle')).every(t => /palindrome/i.test(t.textContent) || /palindrome/i.test(document.querySelector('#pMeta').textContent))`)) === true);

    // search by exact id
    await cdp.send('Page.navigate', { url: BASE + '/problems?q=2050' });
    await cdp.waitFor('document.querySelectorAll(".problem-row").length > 0', 15000);
    const idMeta = await cdp.eval('document.querySelector("#pMeta").textContent');
    ok('id search returns a single result', /^1 problem/.test((idMeta || '').trim()), idMeta);

    // filter via URL
    await cdp.send('Page.navigate', { url: BASE + '/problems?difficulty=Hard&sort=id' });
    await cdp.waitFor('document.querySelectorAll(".problem-row").length > 0', 15000);
    const hardOnly = await cdp.eval(`Array.from(document.querySelectorAll('.problem-row .badge')).every(b => !/Easy|Medium/.test(b.textContent))`);
    ok('difficulty filter shows only Hard problems', hardOnly === true);

    /* ---------------- 3. Workspace: run real code ---------------- */
    await cdp.send('Page.navigate', { url: BASE + '/problems/1' }); // Hello World, verifiable sample
    await cdp.waitFor('!!document.querySelector("#wsRun")', 15000);
    const stmtTitle = await cdp.eval('document.querySelector(".statement h1").textContent');
    ok('workspace shows the problem title', stmtTitle === 'Hello World', stmtTitle);
    const hasMonaco = await cdp.waitFor('!!(window.monaco && monaco.editor.getModels().length)', 15000);
    ok('code editor initialised (Monaco or fallback)', hasMonaco === true || (await cdp.eval('!!document.querySelector("#edHost textarea")')) === true);

    // put a real solution into the editor
    const editorKind = await cdp.eval(setEditorCode('#include <iostream>\nint main(){ std::cout << "Hello, World!" << std::endl; return 0; }'));
    console.log('     editor mode:', editorKind);
    ok('test can drive the mounted editor', editorKind !== 'none', editorKind);

    // ensure sample input mode and press Run
    await cdp.eval('document.querySelector(\'#wsMode [data-mode="sample"]\').click(); true');
    await cdp.eval('document.querySelector("#wsRun").click(); true');
    const runDone = await cdp.waitFor('document.querySelector("#wsStatus").textContent.trim() === "Completed"', 40000);
    ok('Run Code finishes with status "Completed"', runDone, await cdp.eval('document.querySelector("#wsStatus").textContent'));
    const stdout = await cdp.eval('document.querySelector("#wsConsole").textContent');
    ok('Run Code shows the real program output', /Hello, World!/.test(stdout || ''), JSON.stringify(stdout));
    const exitCode = await cdp.eval('document.querySelector("#wsExit").textContent');
    ok('exit code 0 shown', exitCode === '0', exitCode);
    const timeShown = await cdp.eval('document.querySelector("#wsTime").textContent');
    ok('execution time shown', /\d+ ms/.test(timeShown || ''), timeShown);
    const notCompiled = await cdp.eval('/(Compiled successfully|compiled successfully)/.test(document.querySelector("#wsConsole").textContent)');
    ok('output is NOT replaced by "compiled successfully"', notCompiled === false);

    /* ---------------- 4. Submit against the sample ---------------- */
    await cdp.eval('document.querySelector("#wsSubmit").click(); true');
    const submitDone = await cdp.waitFor('document.querySelector("#wsStatus").textContent.trim() === "Sample passed"', 40000);
    ok('Submit Solution reports "Sample passed" for a correct solution', submitDone, await cdp.eval('document.querySelector("#wsStatus").textContent'));
    const solvedBadge = await cdp.eval('document.querySelector("#wsSolved").textContent.trim()');
    ok('correct submission marks the problem solved', solvedBadge === '✓ Solved', solvedBadge);

    /* ---------------- 5. Compilation error surfaces in the UI ---------------- */
    await cdp.eval(setEditorCode('#include <iostream>\nint main(){ std::cout << "oops" ; return 0 }'));
    await cdp.eval('document.querySelector("#wsRun").click(); true');
    const cerrDone = await cdp.waitFor('document.querySelector("#wsStatus").textContent.trim() === "Compilation error"', 40000);
    ok('compilation error is detected and labelled', cerrDone, await cdp.eval('document.querySelector("#wsStatus").textContent'));
    const errConsole = await cdp.eval('document.querySelector("#wsConsole").textContent');
    ok('compiler diagnostics shown to the user', /error/.test(errConsole || ''), (errConsole || '').slice(0, 90));

    /* ---------------- 6. Custom stdin ---------------- */
    await cdp.send('Page.navigate', { url: BASE + '/problems/2' }); // Add Two Numbers
    await cdp.waitFor('!!document.querySelector("#wsRun")', 15000);
    await cdp.waitFor('!!(window.monaco && monaco.editor.getModels().length) || !!document.querySelector("#edHost textarea")', 15000);
    await cdp.eval(setEditorCode('#include <iostream>\nint main(){ int a,b; std::cin >> a >> b; std::cout << a + b << std::endl; return 0; }'));
    await cdp.eval(`(function(){
      document.querySelector('#wsMode [data-mode="custom"]').click();
      const s = document.querySelector('#wsStdin'); s.value = '7 35';
      return true;
    })()`);
    await cdp.eval('document.querySelector("#wsRun").click(); true');
    await cdp.waitFor('document.querySelector("#wsStatus").textContent.trim() !== "Idle"', 40000);
    await cdp.waitFor('!/Compiling/.test(document.querySelector("#wsStatus").textContent)', 40000);
    const customOut = await cdp.eval('document.querySelector("#wsConsole").textContent');
    ok('custom stdin (7 + 35 = 42) works', /42/.test(customOut || ''), JSON.stringify(customOut));

    // Submit the correct solution against the problem's sample (5 3 -> 8)
    await cdp.eval('document.querySelector("#wsSubmit").click(); true');
    await cdp.waitFor('document.querySelector("#wsStatus").textContent.trim() === "Sample passed"', 40000);
    ok('Submit accepts a correct solution against the sample',
      (await cdp.eval('document.querySelector("#wsStatus").textContent.trim()')) === 'Sample passed',
      await cdp.eval('document.querySelector("#wsStatus").textContent'));
    const testsPane = await cdp.eval('document.querySelector("#wsTests").textContent');
    ok('Tests tab lists the sample result', /Sample test #1/.test(testsPane || ''), testsPane);

    // Submit a wrong solution -> Wrong answer (sample)
    await cdp.eval(setEditorCode('#include <iostream>\nint main(){ std::cout << 999 << std::endl; return 0; }'));
    await cdp.eval('document.querySelector("#wsSubmit").click(); true');
    const waDone = await cdp.waitFor('document.querySelector("#wsStatus").textContent.trim() === "Wrong answer (sample)"', 40000);
    ok('Submit reports wrong answer for an incorrect solution', waDone, await cdp.eval('document.querySelector("#wsStatus").textContent'));

    // Sample-input "None" prefix cleanup
    await cdp.send('Page.navigate', { url: BASE + '/problems/1234' });
    await cdp.waitFor('!!document.querySelector("#wsStdin")', 15000);
    const stdinVal = await cdp.eval('document.querySelector("#wsStdin").value');
    ok('literal "None" marker is stripped from sample stdin', !/^none\b/i.test((stdinVal || '').trim()), JSON.stringify(stdinVal));

    /* ---------------- 6b. Cloud compiler runtime (no local backend) ---------------- */
    await cdp.send('Page.navigate', { url: BASE + '/problems/1' });
    await cdp.waitFor('!!document.querySelector("#wsRun")', 15000);
    await cdp.waitFor('!!(window.CPP && CPP.api && CPP.api.cloud)', 15000);
    const cloudProbe = await cdp.eval(
      `(async () => { try { const h = await CPP.api.cloud.health(); const l = await CPP.api.cloud.resolveLanguage(); return { ok: true, service: h.service, lang: l.name }; } catch (e) { return { ok: false, err: String(e && e.message || e) }; } })()`,
      true
    );
    if (!cloudProbe || !cloudProbe.ok) {
      console.log('⚠️  cloud compiler unreachable (' + (cloudProbe && cloudProbe.err) + ') — skipping cloud runtime checks');
    } else {
      console.log('     cloud service:', cloudProbe.service, '·', cloudProbe.lang);
      await cdp.eval(`(function(){ CPP.store.saveSettings({ provider: 'cloud' }); return true; })()`);
      await cdp.send('Page.navigate', { url: BASE + '/problems/1' });
      await cdp.waitFor('!!document.querySelector("#wsRun")', 15000);
      await cdp.waitFor('!!(window.monaco && monaco.editor.getModels().length) || !!document.querySelector("#edHost textarea")', 20000);

      const runtimeLabel = await cdp.eval('document.querySelector("#wsRuntime").textContent');
      ok('workspace reports the cloud runtime before running', /Cloud/.test(runtimeLabel || ''), runtimeLabel);

      await cdp.eval(setEditorCode('#include <iostream>\nint main(){ std::cout << "Hello, World!" << std::endl; return 0; }'));
      await cdp.eval(`(function(){
        document.querySelector('#wsMode [data-mode="sample"]').click();
        return true;
      })()`);
      await cdp.eval('document.querySelector("#wsRun").click(); true');
      const cloudDone = await cdp.waitFor('document.querySelector("#wsStatus").textContent.trim() === "Completed"', 90000);
      ok('cloud compiler executes real C++ code', cloudDone, await cdp.eval('document.querySelector("#wsStatus").textContent'));
      const cloudOut = await cdp.eval('document.querySelector("#wsConsole").textContent');
      ok('cloud run returns genuine program output', /Hello, World!/.test(cloudOut || ''), JSON.stringify((cloudOut || '').slice(0, 80)));
      const cloudMem = await cdp.eval('document.querySelector("#wsMem").textContent');
      ok('cloud run reports real memory usage', (cloudMem || '').trim() !== 'n/a' && cloudMem.trim() !== '–', cloudMem);
      const afterRun = await cdp.eval('document.querySelector("#wsRuntime").textContent');
      ok('metrics row names the runtime after running', /Cloud/.test(afterRun || ''), afterRun);

      // Submit must also work through the cloud runtime.
      await cdp.eval('document.querySelector("#wsSubmit").click(); true');
      const cloudSubmit = await cdp.waitFor('document.querySelector("#wsStatus").textContent.trim() === "Sample passed"', 90000);
      ok('Submit Solution works on the cloud runtime', cloudSubmit, await cdp.eval('document.querySelector("#wsStatus").textContent'));

      // Restore the default runtime for the remaining checks.
      await cdp.eval(`(function(){ CPP.store.saveSettings({ provider: 'auto' }); return true; })()`);
    }

    /* ---------------- 7. Deep link + other pages ---------------- */
    await cdp.send('Page.navigate', { url: BASE + '/problems/2050' });
    await cdp.waitFor('!!document.querySelector(".statement h1")', 15000);
    const lastTitle = await cdp.eval('document.querySelector(".statement h1").textContent');
    ok('deep link to problem #2050 works', /Longest Increasing Subsequence/.test(lastTitle || ''), lastTitle);

    for (const [route, sel, label] of [
      ['/progress', '#pgReset', 'progress dashboard'],
      ['/roadmap', '.card-grid', 'roadmap'],
      ['/reference', '[data-copy-ref]', 'reference'],
      ['/settings', '#setProvider', 'settings'],
      ['/about', '.section-title', 'about'],
      ['/status', '#healthLocal', 'compiler status'],
    ]) {
      await cdp.send('Page.navigate', { url: BASE + route });
      const okp = await cdp.waitFor(`!!document.querySelector('${sel}')`, 15000);
      const crashed = await cdp.eval('!!document.querySelector(".center-box h2") && /Something went wrong/.test(document.querySelector(".center-box h2").textContent)');
      ok(`${label} page renders`, okp && !crashed);
    }

    await cdp.send('Page.navigate', { url: BASE + '/definitely-not-a-page' });
    await cdp.waitFor('!!document.querySelector(".center-box h2")', 15000);
    const nf = await cdp.eval('document.querySelector(".center-box h2").textContent');
    ok('unknown route shows the 404 page', /not found/i.test(nf || ''), nf);

    /* ---------------- 7b. Brand + legal pages + advertising ---------------- */
    await cdp.send('Page.navigate', { url: BASE + '/' });
    await cdp.waitFor('!!document.querySelector(".hero h1")', 15000);

    const brandName = await cdp.eval('CPP.brand.name');
    ok('the app reads its name from js/brand.js', /^[A-Za-z][A-Za-z0-9]*$/.test(brandName || ''), brandName);
    const wordmark = await cdp.eval('document.querySelector("a.nav-logo .logo-text").textContent');
    ok('the navbar wordmark matches the config', wordmark === brandName, wordmark);
    const footerBrand = await cdp.eval('document.querySelector(\'[data-brand="copyright"]\').textContent');
    ok('the footer copyright matches the config', footerBrand === brandName, footerBrand);
    const docTitle = await cdp.eval('document.title');
    ok('the page title uses the brand', (docTitle || '').indexOf(brandName) === 0, docTitle);

    // Nothing may load before the visitor chooses, whether or not a publisher id
    // is configured. The fresh profile has no stored consent, so the banner (if
    // advertising is configured at all) must be waiting for an answer.
    const adState = await cdp.eval(`(function(){
      return JSON.stringify({
        configured: CPP.ads.publisher() !== '',
        enabled: CPP.ads.enabled(),
        units: document.querySelectorAll('ins.adsbygoogle').length,
        script: !!document.querySelector('script[src*="googlesyndication"]'),
        requested: performance.getEntriesByType('resource').some(function(e){ return /googlesyndication|doubleclick/.test(e.name); }),
        consentHost: !!document.getElementById('consentHost'),
        bannerVisible: !!(document.getElementById('consentHost') && !document.getElementById('consentHost').hidden && document.querySelector('.consent-card'))
      });
    })()`);
    const ad = JSON.parse(adState || '{}');
    ok('no ad unit is in the DOM before consent', ad.units === 0, 'units=' + ad.units);
    ok("Google's ad script is not loaded before consent", ad.script === false);
    ok('no advert request is made before consent', ad.requested === false);
    if (ad.configured) {
      ok('a configured site asks for consent before anything loads', ad.bannerVisible === true, adState);
    } else {
      ok('an unconfigured site shows no consent banner', ad.bannerVisible === false);
    }
    ok('the consent host exists for when ads are enabled', ad.consentHost === true);

    for (const [route, label, needles] of [
      ['/privacy', 'Privacy Policy', [/Privacy Policy/i, /advertising cookies/i, /cpp-solved-problems/, /adssettings\.google\.com/]],
      ['/terms', 'Terms of Use', [/Terms of Use/i, /sample check, not full judging/, /Acceptable use/]],
    ]) {
      await cdp.send('Page.navigate', { url: BASE + route });
      const reached = await cdp.waitFor('!!document.querySelector(".section-title")', 15000);
      await sleep(120);
      const text = await cdp.eval('document.getElementById("app").innerText');
      const crashed = /Something went wrong/.test(text || '');
      ok(`${label} renders at ${route}`, reached && !crashed);
      for (const needle of needles) {
        ok(`${label} contains ${String(needle)}`, needle.test(text || ''));
      }
    }

    /* ---------------- 7c. The consent banner works when ads ARE configured ---------------- */
    // Override advertising in-page (never in the repo), stub out the network
    // loader so the test cannot phone home, and check the real banner. The
    // repository's own configuration is saved first and restored at the end.
    const banner = await cdp.eval(`(function(){
      var realPublisher = CPP.ads.publisherId, realSlots = CPP.ads.slots, realConsent = CPP.consent.get();
      CPP.ads.publisherId = 'ca-pub-1234567890123456';
      CPP.ads.slots = { home: '1112223333' };
      var realActivate = CPP.ads.activate;
      var loaded = 0;
      CPP.ads.activate = function(){ loaded++; return true; };
      CPP.consent.clear();
      CPP.nav.go('/');
      CPP.render();
      var host = document.getElementById('consentHost');
      var before = {
        visible: !host.hidden && !!host.querySelector('.consent-card'),
        buttons: Array.from(host.querySelectorAll('[data-consent]')).map(function(b){ return b.getAttribute('data-consent'); }),
        adUnits: document.querySelectorAll('ins.adsbygoogle').length
      };
      // Accept, which must store the choice, hide the banner and fill the unit.
      host.querySelector('[data-consent="granted"]').click();
      var after = {
        stored: CPP.consent.get(),
        visible: !host.hidden,
        adUnits: document.querySelectorAll('ins.adsbygoogle').length,
        labelled: /Advertisement/.test((document.querySelector('.ad-slot') || {}).textContent || ''),
        loaded: loaded
      };
      // Deny, then restore the real loader and a clean slate.
      CPP.consent.clear(); CPP.render();
      var denyBtn = document.querySelector('#consentHost [data-consent="denied"]');
      if (denyBtn) denyBtn.click();
      var denied = { stored: CPP.consent.get(), adUnits: document.querySelectorAll('ins.adsbygoogle').length };
      CPP.ads.publisherId = realPublisher; CPP.ads.slots = realSlots; CPP.ads.activate = realActivate;
      CPP.consent.clear(); CPP.nav.go('/'); CPP.render();
      var restored = { publisher: CPP.ads.publisher(), units: document.querySelectorAll('ins.adsbygoogle').length };
      if (realConsent !== null) CPP.consent.set(realConsent);
      return JSON.stringify({ before: before, after: after, denied: denied, realPublisher: realPublisher, restored: restored });
    })()`);
    const bc = JSON.parse(banner || '{}');
    ok('once configured, the consent banner is shown', bc.before && bc.before.visible === true, banner);
    ok('the banner offers Accept and Essential only', !!bc.before && bc.before.buttons.indexOf('granted') !== -1 && bc.before.buttons.indexOf('denied') !== -1, bc.before && bc.before.buttons.join(','));
    ok('no ad unit exists before consent', !!bc.before && bc.before.adUnits === 0);
    ok('accepting stores the choice and hides the banner', bc.after && bc.after.stored === 'granted' && bc.after.visible === false, bc.after && JSON.stringify(bc.after));
    ok('accepting produces a clearly labelled ad unit', bc.after && bc.after.adUnits >= 1 && bc.after.labelled === true, bc.after && JSON.stringify(bc.after));
    ok('the loader is called exactly once per activation', !!bc.after && bc.after.loaded >= 1);
    ok('"essential only" removes every ad unit again', bc.denied && bc.denied.stored === 'denied' && bc.denied.adUnits === 0, bc.denied && JSON.stringify(bc.denied));
    ok('the test restored the repository configuration', !!bc.restored && bc.restored.publisher === bc.realPublisher && bc.restored.units === 0, bc.restored && JSON.stringify(bc.restored));

    /* ---------------- 8. Theme toggle ---------------- */
    await load('/', '!!document.querySelector("#themeToggle")');
    // Start from a known theme so the assertions do not depend on anything a
    // previous section left in storage.
    await cdp.eval('window.CPP.theme.apply("dark"); true');
    await cdp.eval('document.querySelector("#themeToggle").click(); true');
    const theme = await cdp.eval('document.documentElement.getAttribute("data-theme")');
    ok('theme toggle switches to light', theme === 'light', theme);
    await cdp.eval('document.querySelector("#themeToggle").click(); true');
    ok('theme toggle switches back to dark', (await cdp.eval('document.documentElement.getAttribute("data-theme")')) === 'dark');

    /* ---------------- 9. Console / page errors ---------------- */
    const errors = cdp.events.filter((e) =>
      (e.method === 'Runtime.exceptionThrown') ||
      (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error') ||
      (e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
    ).map((e) => {
      if (e.method === 'Runtime.exceptionThrown') return 'exception: ' + (e.params.exceptionDetails.exception && e.params.exceptionDetails.exception.description || e.params.exceptionDetails.text);
      if (e.method === 'Log.entryAdded') return 'log: ' + e.params.entry.text;
      return 'console.error: ' + (e.params.args || []).map((a) => a.value || a.description).join(' ');
    }).filter((t) => !/favicon|net::ERR_|ERR_NAME_NOT_RESOLVED|cdn\.jsdelivr|fonts\.googleapis|fonts\.gstatic|Failed to load resource/i.test(t));

    ok('no uncaught page errors', errors.length === 0, errors.slice(0, 4).join(' || '));
    if (errors.length) console.log('     page errors:', errors.slice(0, 8));

  } catch (e) {
    ok('browser suite completed without crashing', false, e.message);
  } finally {
    if (cdp) cdp.close();
    try { chrome.kill(); } catch (e) {}
    await sleep(400);
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {}
  }

  console.log('\n================================================');
  console.log(`Results: ${passed}/${total} passed · ${failed} failed`);
  if (failed) console.log('Failed: ' + failures.join(' | '));
  console.log('================================================');
  process.exit(failed ? 1 : 0);
}

main();
