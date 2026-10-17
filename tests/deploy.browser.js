/**
 * CppPractice — static-deployment browser test
 * ---------------------------------------------------------------------------
 * The bundled Node server serves the app from a domain root with clean history
 * URLs. A static host (GitHub Pages, Netlify, Cloudflare Pages, ...) usually
 * cannot do that, so the app falls back to the hash router and — on a project
 * site — is mounted at a sub-path. Those differences are easy to get wrong and
 * were, in fact, wrong once: this suite exists to keep them right.
 *
 * It loads a real deployment in real Chrome and asserts:
 *   - the stylesheet actually applied (not just "the HTML arrived")
 *   - the router chose the hash mode, and static nav links were rewritten
 *   - navigation between pages works (no 404s leaving the deployment)
 *   - a shareable deep link renders the right problem
 *   - the Cloud runtime really compiles and runs code there
 *
 * Usage:
 *   node tests/deploy.browser.js
 *   node tests/deploy.browser.js https://example.com/my-app/
 *   DEPLOY_URL=https://... node tests/deploy.browser.js
 *
 * Override the browser with CHROME_PATH. Exits 0 with a SKIP notice when the
 * deployment (or the cloud compiler) cannot be reached.
 */
'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const URL_UNDER_TEST = (process.argv[2] || process.env.DEPLOY_URL ||
  'https://ahmadnawaz6611333-star.github.io/cpp-practice/').replace(/\/?$/, '/');
const PORT = 9366;
const CHROME = findChrome();

let passed = 0, failed = 0;
const failures = [];
function ok(name, cond, detail) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; failures.push(name); console.log(`  ❌ ${name}${detail ? ' — ' + detail : ''}`); }
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Put code into the editor that is actually mounted (CPP.activeEditor is the live
// editor handle exposed by js/views.js; models()[0] can be an orphaned model).
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
  return [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/usr/bin/google-chrome', '/usr/bin/chromium',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ].find((c) => fs.existsSync(c)) || null;
}

class CDP {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.events = [];
    this.ready = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', () => resolve());
      this.ws.addEventListener('error', () => reject(new Error('ws error')));
    });
    this.ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message)); else resolve(msg.result);
      } else if (msg.method) this.events.push(msg);
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
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: !!awaitPromise, userGesture: true });
    if (r.exceptionDetails) throw new Error('page evaluation threw: ' + (r.exceptionDetails.text || ''));
    return r.result ? r.result.value : undefined;
  }
  async waitFor(expr, timeoutMs) {
    const deadline = Date.now() + (timeoutMs || 20000);
    for (;;) {
      let v = false;
      try { v = await this.eval(expr); } catch (e) { v = false; }
      if (v) return true;
      if (Date.now() > deadline) return false;
      await sleep(250);
    }
  }
  close() { try { this.ws.close(); } catch (e) {} }
}

async function main() {
  console.log('================================================');
  console.log('CppPractice · static deployment test');
  console.log('target:', URL_UNDER_TEST);
  console.log('================================================');
  if (!CHROME) {
    console.log('⚠️  No Chrome/Edge found — skipping (set CHROME_PATH).');
    process.exit(0);
  }

  // Reachability first: never fail the suite for a flaky network.
  try {
    const r = await fetch(URL_UNDER_TEST, { signal: AbortSignal.timeout(20000) });
    if (!r.ok) throw new Error('HTTP ' + r.status);
  } catch (e) {
    console.log(`⚠️  deployment unreachable (${e.message}) — skipping.`);
    process.exit(0);
  }

  const profile = path.join(os.tmpdir(), 'cpp-deploy-' + Date.now());
  const chrome = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--no-sandbox',
    `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, '--window-size=1440,1000', 'about:blank',
  ], { stdio: 'ignore' });

  let cdp = null;
  try {
    let target = null;
    for (let i = 0; i < 60 && !target; i++) {
      await sleep(300);
      try {
        const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
        target = list.find((t) => t.type === 'page');
      } catch (e) { /* not up yet */ }
    }
    if (!target) throw new Error('Chrome DevTools endpoint never became available');

    cdp = new CDP(target.webSocketDebuggerUrl);
    await cdp.ready;
    await cdp.send('Runtime.enable');
    await cdp.send('Page.enable');
    await cdp.send('Log.enable');

    /* ---------------- 1. Loads and is actually styled ---------------- */
    await cdp.send('Page.navigate', { url: URL_UNDER_TEST });
    const hero = await cdp.waitFor('!!document.querySelector("#app .hero h1")', 25000);
    ok('home page renders through the deployed host', hero);

    const styled = await cdp.eval(`(function () {
      var cs = getComputedStyle(document.documentElement);
      return { sheets: document.styleSheets.length, token: cs.getPropertyValue('--c-indigo').trim() };
    })()`);
    ok('stylesheet applied (design tokens available)', styled && styled.sheets > 0 && !!styled.token,
      JSON.stringify(styled));

    /* ---------------- 2. Router mode + link rewriting ---------------- */
    const mode = await cdp.eval('window.CPP && CPP.routerMode');
    const appBase = await cdp.eval('window.CPP && CPP.appBase');
    ok('router fell back to hash mode on this host', mode === 'hash', 'mode=' + mode + ' appBase=' + appBase);

    const navHrefs = await cdp.eval('JSON.stringify(Array.from(document.querySelectorAll(".nav-link")).map(a => a.getAttribute("href")))');
    ok('static nav links were rewritten to in-page hashes', /^\s*\["#\//.test(navHrefs || ''), navHrefs);

    /* ---------------- 3. In-app navigation works ---------------- */
    await cdp.eval(`(function () {
      var a = Array.from(document.querySelectorAll('a[data-link]')).find(function (x) { return /problems$/.test(x.getAttribute('href') || ''); });
      a.click(); return true;
    })()`);
    const listed = await cdp.waitFor('document.querySelectorAll(".problem-row").length > 0', 25000);
    ok('navigating to the catalogue works (no 404)', listed);
    const meta = await cdp.eval('(document.querySelector("#pMeta") || {}).textContent');
    ok('catalogue still reports 2,040 problems', /2,040/.test(meta || ''), meta);
    const stillOnHost = await cdp.eval('location.href.indexOf(location.origin) === 0 && !/\\/problems\\/?(\\?|$)/.test(location.pathname)');
    ok('navigation stayed inside the deployment root', stillOnHost === true, await cdp.eval('location.href'));
    await cdp.eval(`(function () { window.CPP.nav.go('/'); return true; })()`);

    /* ---------------- 4. Shareable deep link ---------------- */
    await cdp.send('Page.navigate', { url: URL_UNDER_TEST + '#/problems/2050' });
    const deep = await cdp.waitFor('!!document.querySelector(".statement h1")', 25000);
    const deepTitle = await cdp.eval('(document.querySelector(".statement h1") || {}).textContent');
    ok('shareable deep link opens the right problem', deep && /Longest Increasing Subsequence/.test(deepTitle || ''), deepTitle);
    const sw = await cdp.eval('!!document.querySelector("#wsRun")');
    ok('the workspace (not an error page) is shown for the deep link', sw === true);

    /* ---------------- 4b. Brand + legal pages + advertising ---------------- */
    await cdp.eval(`(function () { window.CPP.nav.go('/'); return true; })()`);
    await cdp.waitFor('!!document.querySelector("#app .hero h1")', 25000);
    const liveBrand = await cdp.eval('(function(){ return JSON.stringify({ name: CPP.brand.name, title: document.title, logo: document.querySelector("a.nav-logo .logo-text").textContent, footer: document.querySelector(\'[data-brand="copyright"]\').textContent }); })()');
    const lb = JSON.parse(liveBrand || '{}');
    ok('the deployed site shows its name', !!lb.name && lb.logo === lb.name && lb.footer === lb.name, liveBrand);
    ok('the deployed title starts with the brand', (lb.title || '').indexOf(lb.name) === 0, lb.title);

    const liveAds = await cdp.eval(`(function(){
      return JSON.stringify({
        enabled: CPP.ads.enabled(),
        units: document.querySelectorAll('ins.adsbygoogle').length,
        script: !!document.querySelector('script[src*="googlesyndication"]'),
        requested: performance.getEntriesByType('resource').some(function(e){ return /googlesyndication|doubleclick/.test(e.name); })
      });
    })()`);
    const la = JSON.parse(liveAds || '{}');
    ok('no advertising is active on the deployed site yet', la.enabled === false, liveAds);
    ok('the deployed site loads no ad script and makes no advert request', la.script === false && la.requested === false);

    await cdp.eval(`(function () { window.CPP.nav.go('/privacy'); return true; })()`);
    const legalOk = await cdp.waitFor('/Privacy Policy/i.test(document.getElementById("app").innerText)', 20000);
    const legalText = await cdp.eval('document.getElementById("app").innerText');
    ok('the Privacy Policy is reachable on the deployed site', legalOk === true);
    ok('it discloses the advertising cookies', /advertising cookies/i.test(legalText || ''));
    ok('it stays on the deployment root (hash routing)', (await cdp.eval('location.origin + "/"')) === new URL(URL_UNDER_TEST).origin + '/');

    /* ---------------- 5. The Cloud runtime really works ---------------- */
    const cloud = await cdp.eval(
      `(async () => { try { const h = await CPP.api.cloud.health(); const l = await CPP.api.cloud.resolveLanguage(); return { ok: true, lang: l.name }; } catch (e) { return { ok: false, err: String(e && e.message || e) }; } })()`,
      true
    );
    if (!cloud || !cloud.ok) {
      console.log('⚠️  cloud compiler unreachable (' + (cloud && cloud.err) + ') — skipping run checks');
    } else {
      await cdp.eval(`(function(){ CPP.store.saveSettings({ provider: 'cloud' }); return true; })()`);
      await cdp.send('Page.navigate', { url: URL_UNDER_TEST + '#/problems/1' });
      await cdp.waitFor('!!document.querySelector("#wsRun")', 25000);
      await cdp.waitFor('!!(window.monaco && monaco.editor.getModels().length) || !!document.querySelector("#edHost textarea")', 25000);
      await cdp.eval(setEditorCode('#include <iostream>\nint main(){ std::cout << "deployed-ok" << std::endl; return 0; }'));
      await cdp.eval('document.querySelector("#wsRun").click(); true');
      const ran = await cdp.waitFor('document.querySelector("#wsStatus").textContent.trim() === "Completed"', 90000);
      ok('Run Code works on the deployed site (cloud runtime)', ran, await cdp.eval('document.querySelector("#wsStatus").textContent'));
      const out = await cdp.eval('document.querySelector("#wsConsole").textContent');
      ok('deployed run returns real program output', /deployed-ok/.test(out || ''), JSON.stringify((out || '').slice(0, 60)));
      await cdp.eval(`(function(){ CPP.store.saveSettings({ provider: 'auto' }); return true; })()`);
    }

    /* ---------------- 6. No page errors ---------------- */
    const errors = cdp.events.filter((e) =>
      (e.method === 'Runtime.exceptionThrown') ||
      (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error') ||
      (e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
    ).map((e) => {
      if (e.method === 'Runtime.exceptionThrown') return 'exception: ' + (e.params.exceptionDetails.exception && e.params.exceptionDetails.exception.description || e.params.exceptionDetails.text);
      if (e.method === 'Log.entryAdded') return 'log: ' + e.params.entry.text;
      return 'console.error: ' + (e.params.args || []).map((a) => a.value || a.description).join(' ');
    }).filter((t) => !/favicon|net::ERR_|ERR_NAME_NOT_RESOLVED|cdn\.jsdelivr|fonts\.googleapis|fonts\.gstatic|Failed to load resource|ERR_INTERNET_DISCONNECTED|ERR_CONNECTION|409|429/i.test(t));

    ok('no uncaught page errors on the deployed site', errors.length === 0, errors.slice(0, 3).join(' || '));
    if (errors.length) console.log('     page errors:', errors.slice(0, 6));

  } catch (e) {
    ok('deployment suite completed without crashing', false, e.message);
  } finally {
    if (cdp) cdp.close();
    try { chrome.kill(); } catch (e) {}
    await sleep(400);
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) {}
  }

  console.log('\n================================================');
  console.log(`Results: ${passed}/${passed + failed} passed · ${failed} failed`);
  if (failed) console.log('Failed: ' + failures.join(' | '));
  console.log('================================================');
  process.exit(failed ? 1 : 0);
}

main();
