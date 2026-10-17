/* ==========================================================================
 * CPPractice Lab — Core layer
 * Storage (preferences / progress / bookmarks), theming, toasts, utilities
 * and the compiler-backend API client.
 * ========================================================================== */
(function () {
  'use strict';

  const CPP = (window.CPP = window.CPP || {});

  /* ------------------------ Where is the app hosted? -------------------- */
  // CPP.mount is the path the app is served under: "" at a domain root,
  // "/cpp-practice" on a GitHub Pages project site, etc. It is derived from the
  // URL this script itself was loaded from, so no configuration is needed.
  CPP.mount = (function () {
    try {
      const src = document.currentScript && document.currentScript.src;
      if (src) return new URL(src).pathname.replace(/\/js\/[^/]*$/, '');
    } catch (e) {}
    return '';
  })();

  // The bundled Node backend injects window.CPP_APP_BASE ('/' plus a matching
  // <base> tag) because it serves the app from a domain root with an SPA
  // fallback, so clean URLs like /problems/1001 can be used directly.
  //
  // Static hosts cannot rewrite deep links — and rewriting relative assets would
  // break them — so everywhere else the router uses '#/problems/1001', which is
  // still a unique, shareable link. Force either mode with ?router=path|hash.
  CPP.appBase = (function () {
    const b = window.CPP_APP_BASE || null;
    return b ? String(b).replace(/\/+$/, '') : null;
  })();

  CPP.routerMode = (function () {
    try {
      const forced = new URLSearchParams(location.search).get('router');
      if (forced === 'hash' || forced === 'path') {
        localStorage.setItem('cpp-router', forced);
        return forced;
      }
      const saved = localStorage.getItem('cpp-router');
      if (saved === 'hash') return 'hash';
      if (saved === 'path' && CPP.appBase) return 'path';
    } catch (e) {}
    if (location.protocol === 'file:') return 'hash';
    return CPP.appBase !== null ? 'path' : 'hash';
  })();

  CPP.href = function (path) {
    if (CPP.routerMode === 'hash') return '#' + path;
    return (CPP.appBase || '') + path;
  };

  /* ----------------------------- Utilities ----------------------------- */
  const U = (CPP.util = {});

  U.escapeHtml = function (str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  };

  U.escapeAttr = function (str) { return U.escapeHtml(str); };

  // The catalogue stores some sample I/O with literal "\n" sequences.
  // Convert them into real newlines for readability / judging.
  U.expandEscapes = function (text) {
    if (text == null) return '';
    return String(text)
      .replace(/\\r\\n/g, '\n')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t');
  };

  U.plural = function (n, one, many) { return n === 1 ? one : (many || one + 's'); };

  U.clamp = function (n, lo, hi) { return Math.max(lo, Math.min(hi, n)); };

  // The catalogue marks "no input" with the literal word None, and some
  // samples are written as `None\n<real input>`. Strip that marker so the
  // value can be shown and fed to a program as genuine stdin.
  U.cleanSampleInput = function (raw) {
    const text = U.expandEscapes(raw == null ? '' : raw);
    const lines = text.split('\n');
    if (lines.length && /^none$/i.test(lines[0].trim())) lines.shift();
    return lines.join('\n').replace(/^\n+/, '');
  };

  U.cleanSampleOutput = function (raw) {
    const text = U.expandEscapes(raw == null ? '' : raw);
    if (/^none$/i.test(text.trim())) return '';
    return text;
  };

  U.debounce = function (fn, wait) {
    let t;
    return function () {
      const args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(() => fn.apply(ctx, args), wait);
    };
  };

  U.todayKey = function (d) {
    const dt = d ? new Date(d) : new Date();
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const day = String(dt.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  U.timeAgo = function (ts) {
    const diff = Date.now() - ts;
    const min = Math.round(diff / 60000);
    if (min < 1) return 'just now';
    if (min < 60) return min + 'm ago';
    const hr = Math.round(min / 60);
    if (hr < 24) return hr + 'h ago';
    const day = Math.round(hr / 24);
    if (day < 30) return day + 'd ago';
    return new Date(ts).toLocaleDateString();
  };

  // Normalise program output for comparison: unify newlines, trim trailing
  // whitespace on every line, drop leading/trailing blank lines.
  U.normalizeOutput = function (text) {
    return U.expandEscapes(text == null ? '' : text)
      .replace(/\r\n?/g, '\n')
      .split('\n')
      .map((l) => l.replace(/[ \t]+$/g, ''))
      .join('\n')
      .replace(/^\n+/, '')
      .replace(/\n+$/, '');
  };

  U.outputsMatch = function (actual, expected) {
    return U.normalizeOutput(actual) === U.normalizeOutput(expected);
  };

  /* ------------------------------ Storage ------------------------------ */
  const KEYS = {
    solved: 'cpp-solved-problems',
    attempted: 'cpp-attempted-problems',
    bookmarks: 'cpp-bookmarked-problems',
    activity: 'cpp-activity',
    settings: 'cpp-settings',
    codePrefix: 'cpp-code-',
    backend: 'cpp-backend-url',
  };

  const Store = (CPP.store = {});

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const val = JSON.parse(raw);
      return val == null ? fallback : val;
    } catch (e) {
      console.warn('storage read failed for', key, e);
      return fallback;
    }
  }
  function writeJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); }
    catch (e) { console.warn('storage write failed for', key, e); }
  }

  Store.settings = function () {
    const defaults = {
      theme: 'dark', editorTheme: 'dark', fontSize: 14, tabSize: 4, wrap: false, autoSamples: true,
      // Execution provider: 'auto' prefers the local Node backend when reachable,
      // otherwise falls back to the cloud compiler. 'local' / 'cloud' force one.
      provider: 'auto',
      judge0Url: 'https://ce.judge0.com',
      judge0LanguageId: null, // null = auto-detect newest C++ (GCC) runtime
      notifyProviderSwitch: true,
    };
    return Object.assign(defaults, readJSON(KEYS.settings, {}));
  };
  Store.saveSettings = function (patch) {
    const next = Object.assign(Store.settings(), patch);
    writeJSON(KEYS.settings, next);
    return next;
  };

  Store.solved = function () { return readJSON(KEYS.solved, []); };
  Store.isSolved = function (id) { return Store.solved().indexOf(Number(id)) !== -1; };
  Store.toggleSolved = function (id) {
    id = Number(id);
    const arr = Store.solved();
    const i = arr.indexOf(id);
    const nowSolved = i === -1;
    if (nowSolved) arr.push(id); else arr.splice(i, 1);
    writeJSON(KEYS.solved, arr);
    if (nowSolved) Store.recordActivity('solve');
    return nowSolved;
  };

  Store.attempted = function () { return readJSON(KEYS.attempted, []); };
  Store.markAttempted = function (id) {
    id = Number(id);
    const arr = Store.attempted();
    if (arr.indexOf(id) === -1) { arr.push(id); writeJSON(KEYS.attempted, arr); }
  };

  Store.bookmarks = function () { return readJSON(KEYS.bookmarks, []); };
  Store.isBookmarked = function (id) { return Store.bookmarks().indexOf(Number(id)) !== -1; };
  Store.toggleBookmark = function (id) {
    id = Number(id);
    const arr = Store.bookmarks();
    const i = arr.indexOf(id);
    const now = i === -1;
    if (now) arr.push(id); else arr.splice(i, 1);
    writeJSON(KEYS.bookmarks, arr);
    return now;
  };

  Store.recordActivity = function (type) {
    const act = readJSON(KEYS.activity, {});
    const key = U.todayKey();
    act[key] = act[key] || { runs: 0, solves: 0 };
    if (type === 'solve') act[key].solves += 1;
    if (type === 'run') act[key].runs += 1;
    // keep ~400 days
    const keys = Object.keys(act).sort();
    while (keys.length > 400) delete act[keys.shift()];
    writeJSON(KEYS.activity, act);
    return act;
  };
  Store.activity = function () { return readJSON(KEYS.activity, {}); };

  Store.streak = function () {
    const act = Store.activity();
    let streak = 0;
    const d = new Date();
    // Allow the streak to still count if today has no activity yet.
    if (!act[U.todayKey(d)]) d.setDate(d.getDate() - 1);
    for (;;) {
      const k = U.todayKey(d);
      const has = act[k] && (act[k].runs > 0 || act[k].solves > 0);
      if (!has) break;
      streak += 1;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  };

  Store.saveCode = function (id, code) {
    try { localStorage.setItem(KEYS.codePrefix + id, code); } catch (e) {}
  };
  Store.loadCode = function (id) {
    try { return localStorage.getItem(KEYS.codePrefix + id); } catch (e) { return null; }
  };
  Store.clearCode = function (id) {
    try { localStorage.removeItem(KEYS.codePrefix + id); } catch (e) {}
  };

  Store.resetAll = function () {
    Object.values(KEYS).forEach((k) => { if (k !== KEYS.settings) { try { localStorage.removeItem(k); } catch (e) {} } });
    try {
      Object.keys(localStorage).filter((k) => k.indexOf(KEYS.codePrefix) === 0).forEach((k) => localStorage.removeItem(k));
    } catch (e) {}
  };

  /* ------------------------------ Theming ------------------------------ */
  const Theme = (CPP.theme = {});
  Theme.apply = function (name) {
    const theme = name === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.textContent = theme === 'light' ? '☀️' : '🌙';
      btn.setAttribute('title', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    }
    CPP.store.saveSettings({ theme });
    if (CPP.editor && CPP.editor.setTheme) CPP.editor.setTheme(Store.settings().editorTheme);
    return theme;
  };
  Theme.toggle = function () {
    const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    return Theme.apply(cur === 'light' ? 'dark' : 'light');
  };
  Theme.current = function () { return document.documentElement.getAttribute('data-theme') || 'dark'; };

  /* ------------------------------- Toasts ------------------------------ */
  const Toast = (CPP.toast = {});
  const ICONS = { success: '✅', error: '⛔', info: '💡', warn: '⚠️' };
  Toast.show = function (message, type, ttl) {
    const host = document.getElementById('toastStack');
    if (!host) return;
    type = type || 'info';
    const el = document.createElement('div');
    el.className = 'toast ' + type;
    el.setAttribute('role', type === 'error' ? 'alert' : 'status');
    el.innerHTML = `<span class="ico" aria-hidden="true">${ICONS[type] || '💡'}</span><span>${U.escapeHtml(message)}</span>`;
    host.appendChild(el);
    const remove = () => {
      el.classList.add('leaving');
      setTimeout(() => el.remove(), 260);
    };
    setTimeout(remove, ttl || 3600);
    el.addEventListener('click', remove);
  };

  /* --------------------------- Backend client -------------------------- */
  const API = (CPP.api = {});

  API.resolveBase = function () {
    // Explicit override (?backend= or saved setting) wins.
    try {
      const url = new URL(window.location.href);
      const q = url.searchParams.get('backend');
      if (q) { localStorage.setItem(KEYS.backend, q); return q.replace(/\/$/, ''); }
      const saved = localStorage.getItem(KEYS.backend);
      if (saved) return saved.replace(/\/$/, '');
    } catch (e) {}
    if (location.protocol === 'file:') return 'http://localhost:3001';
    // Served over http(s): the Node backend serves this site, so same-origin.
    return '';
  };

  API.base = API.resolveBase();
  API.setBase = function (b) {
    const clean = String(b || '').replace(/\/$/, '');
    localStorage.setItem(KEYS.backend, clean);
    API.base = clean;
  };
  API.endpoint = function (p) { return (API.base || '') + p; };
  API.displayBase = function () { return API.base || (location.origin || 'same-origin'); };

  /* ---------------------- Provider: local Node backend ------------------ */
  const Local = (API.local = {});

  Local.health = async function () {
    const res = await fetch(API.endpoint('/api/health'), { method: 'GET', signal: AbortSignal.timeout(6000) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  };

  Local.run = async function (payload) {
    const res = await fetch(API.endpoint('/api/run'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout((Number(payload && payload.timeout) || 10000) + 20000),
    });
    let data = null;
    const text = await res.text();
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
    if (!data) {
      throw new Error(`Backend returned ${res.status} with a non-JSON response.`);
    }
    return { httpStatus: res.status, data };
  };

  // Backwards-compatible aliases (older callers used API.health / API.run).
  API.health = Local.health;
  API.run = Local.run;

  /* ------------------------ Provider: cloud (Judge0) --------------------- */
  // A hosted code-execution service. No API key is required by the public
  // Judge0 CE instance, so nothing secret ships in the browser bundle.
  const Cloud = (API.cloud = {});
  const LANG_CACHE_KEY = 'cpp-judge0-language';

  Cloud.baseUrl = function () {
    return String(Store.settings().judge0Url || 'https://ce.judge0.com').replace(/\/+$/, '');
  };

  Cloud.health = async function () {
    const res = await fetch(Cloud.baseUrl() + '/about', { signal: AbortSignal.timeout(9000) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const info = await res.json().catch(() => ({}));
    return { status: 'ok', service: 'Judge0 CE', version: info.version || null, url: Cloud.baseUrl() };
  };

  // Judge0 numbers its runtimes; the C++ id drifts between deployments, so we
  // discover the newest "C++ (GCC x.y.z)" entry and cache it for a week.
  Cloud.resolveLanguage = async function () {
    const forced = Store.settings().judge0LanguageId;
    if (forced) return { id: Number(forced), name: 'C++ (language id ' + forced + ')' };

    try {
      const cached = JSON.parse(localStorage.getItem(LANG_CACHE_KEY) || 'null');
      if (cached && cached.url === Cloud.baseUrl() && Date.now() - cached.ts < 7 * 864e5) {
        return cached.lang;
      }
    } catch (e) {}

    const res = await fetch(Cloud.baseUrl() + '/languages', { signal: AbortSignal.timeout(9000) });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const list = await res.json();
    const cppOnly = (list || []).filter((l) => /^C\+\+ \(GCC/.test(l.name));
    const pool = cppOnly.length ? cppOnly : (list || []).filter((l) => /C\+\+/.test(l.name));
    if (!pool.length) throw new Error('No C++ runtime offered by ' + Cloud.baseUrl());
    const version = (name) => (name.match(/(\d+)\.(\d+)\.(\d+)/) || [0, 0, 0, 0]).slice(1).reduce((a, b) => a * 10000 + Number(b), 0);
    const lang = pool.slice().sort((a, b) => version(b.name) - version(a.name))[0];
    const picked = { id: lang.id, name: lang.name };
    try { localStorage.setItem(LANG_CACHE_KEY, JSON.stringify({ url: Cloud.baseUrl(), ts: Date.now(), lang: picked })); } catch (e) {}
    return picked;
  };

  function mapJudge0(j, lang, totalMs) {
    const id = j.status ? j.status.id : null;
    const desc = (j.status && j.status.description) || '';
    let status = 'internal_error', error = 'internal_error';
    if (id === 3) { status = 'success'; error = null; }
    else if (id === 1 || id === 2) { status = 'running'; error = 'running'; }
    else if (id === 4) { status = 'wrong_answer'; error = 'wrong_answer'; }
    else if (id === 5) { status = 'time_limit_exceeded'; error = 'time_limit_exceeded'; }
    else if (id === 6) { status = 'compilation_error'; error = 'compilation_error'; }
    else if (id >= 7 && id <= 12) { status = 'runtime_error'; error = 'runtime_error'; }

    const compileOut = j.compile_output || '';
    const stderr = error === 'compilation_error'
      ? (compileOut || j.stderr || desc)
      : (j.stderr || j.message || '');
    const execSec = j.time != null ? parseFloat(j.time) : null;

    return {
      status, error,
      stage: error === 'compilation_error' ? 'compile' : 'complete',
      message: desc,
      stdout: j.stdout || '',
      stderr: stderr || '',
      exitCode: typeof j.exit_code === 'number' ? j.exit_code : (error === null ? 0 : null),
      compileTimeMs: null,
      executionTimeMs: execSec != null && isFinite(execSec) ? Math.round(execSec * 1000) : null,
      totalTimeMs: totalMs,
      memoryUsedKb: j.memory != null ? j.memory : null,
      cached: false,
      provider: 'cloud',
      language: lang.name,
      token: j.token || null,
    };
  }

  Cloud.run = async function (payload) {
    const lang = await Cloud.resolveLanguage();
    const timeoutMs = Number(payload && payload.timeout) || 10000;
    const body = {
      source_code: payload.source_code,
      language_id: lang.id,
      stdin: payload.stdin || '',
      cpu_time_limit: Math.max(1, Math.round(timeoutMs / 1000)),
      wall_time_limit: Math.max(2, Math.round(timeoutMs / 1000) + 3),
    };
    const t0 = Date.now();
    const res = await fetch(Cloud.baseUrl() + '/submissions?base64_encoded=false&wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs + 45000),
    });
    const totalMs = Date.now() - t0;

    if (res.status === 429) {
      return {
        status: 'rate_limited', error: 'rate_limited', stage: 'complete',
        message: 'Cloud compiler rate limit reached — wait a moment and try again.',
        stdout: '', stderr: '', exitCode: null, compileTimeMs: null,
        executionTimeMs: null, totalTimeMs: totalMs, memoryUsedKb: null,
        cached: false, provider: 'cloud', language: lang.name,
      };
    }
    if (!res.ok) {
      let detail = '';
      try { detail = (await res.text()).slice(0, 300); } catch (e) {}
      throw new Error('Cloud compiler returned HTTP ' + res.status + (detail ? ' — ' + detail : ''));
    }
    return mapJudge0(await res.json(), lang, totalMs);
  };

  /* --------------------------- Provider dispatch ------------------------- */
  API.providerLabel = function (p) {
    if (!p) return 'Auto (detecting…)';
    return p === 'cloud' ? 'Cloud (Judge0 CE)' : 'Local (your machine)';
  };

  API.activeProvider = function () {
    const s = Store.settings();
    if (s.provider === 'local' || s.provider === 'cloud') return s.provider;
    // 'auto': prefer local when it is reachable and has a compiler.
    const st = Runtime.state;
    if (st.online === null) return null; // not probed yet — don't guess
    return (st.online && st.compiler) ? 'local' : 'cloud';
  };

  // Returns { provider, data } so the UI can always report which runtime ran it.
  API.execute = async function (payload) {
    const s = Store.settings();
    if (s.provider === 'auto' && Runtime.state.online === null) {
      await Runtime.probe({ quiet: true, cloud: false });
    }
    const provider = API.activeProvider();
    if (provider === 'local') {
      const out = await Local.run(payload);
      return { provider: 'local', data: out.data, httpStatus: out.httpStatus };
    }
    return { provider: 'cloud', data: await Cloud.run(payload) };
  };

  /* ----------------------- Compiler status caching ---------------------- */
  const Runtime = (CPP.runtime = {
    state: { online: null, compiler: null, message: '', cloudOnline: null, cloudMessage: '', cloudName: null },
    _subs: [],
    _inflight: null,
  });

  Runtime.probe = function (opts) {
    // De-duplicate: the boot probe, the workspace and the settings page may all
    // ask at once, and one round of requests is enough for everyone.
    if (!Runtime._inflight) {
      Runtime._inflight = Runtime._probe(opts || {}).then(function (s) {
        Runtime._inflight = null;
        return s;
      });
    }
    return Runtime._inflight;
  };

  // Called after every completed probe so views can refresh their labels.
  Runtime.subscribe = function (fn) {
    Runtime._subs.push(fn);
    return function () {
      Runtime._subs = Runtime._subs.filter(function (f) { return f !== fn; });
    };
  };

  Runtime._probe = async function (opts) {
    opts = opts || {};
    const wantCloud = opts.cloud !== false && Store.settings().provider !== 'local';

    const jobs = [Local.health().then(
      (h) => {
        Runtime.state.online = true;
        Runtime.state.compiler = h.compiler || null;
        Runtime.state.message = h.message || '';
        Runtime.state.status = h.status;
      },
      (e) => {
        Runtime.state.online = false;
        Runtime.state.compiler = null;
        Runtime.state.message = e.message || 'unreachable';
        Runtime.state.status = 'unreachable';
      }
    )];

    if (wantCloud) {
      jobs.push(Cloud.health().then(
        (h) => {
          Runtime.state.cloudOnline = true;
          Runtime.state.cloudName = h.service || 'Judge0 CE';
          Runtime.state.cloudMessage = h.service || 'reachable';
        },
        (e) => {
          Runtime.state.cloudOnline = false;
          Runtime.state.cloudMessage = e.message || 'unreachable';
        }
      ));
    }

    await Promise.all(jobs);
    Runtime.state.provider = API.activeProvider();
    if (!opts.quiet) Runtime.renderBadge();
    Runtime._subs.forEach(function (fn) { try { fn(Runtime.state); } catch (e) {} });
    return Runtime.state;
  };

  Runtime.renderBadge = function () {
    const el = document.getElementById('footerBackend');
    if (!el) return;
    const s = Runtime.state;

    // Always name the runtime that will actually execute code.
    if (!s.provider) {
      el.textContent = 'compiler: detecting…';
      el.style.color = '';
      return;
    }
    if (Store.settings().provider === 'local' && s.online === null) {
      el.textContent = 'compiler: checking…'; return;
    }
    if (s.provider === 'local') {
      if (s.online === false) {
        el.textContent = 'compiler: local offline (' + API.displayBase() + ')';
        el.style.color = 'var(--c-coral)';
      } else if (!s.compiler) {
        el.textContent = 'compiler: local online, no C++ compiler';
        el.style.color = 'var(--c-amber)';
      } else {
        el.textContent = 'compiler: local · ' + s.compiler;
        el.style.color = 'var(--c-emerald)';
      }
      return;
    }

    // Cloud provider active.
    if (s.cloudOnline === null) {
      el.textContent = 'compiler: cloud (' + Cloud.baseUrl() + ')';
      el.style.color = 'var(--c-sky)';
      return;
    }
    if (!s.cloudOnline) {
      el.textContent = 'compiler: cloud unreachable (' + s.cloudMessage + ')';
      el.style.color = 'var(--c-coral)';
      return;
    }
    el.textContent = 'compiler: cloud · ' + (s.cloudName || 'Judge0 CE');
    el.style.color = 'var(--c-emerald)';
  };

  // One-time nudge the first time 'auto' falls back to the cloud compiler,
  // so the switch is never silent.
  Runtime.announceProvider = function (provider) {
    if (!Store.settings().notifyProviderSwitch) return;
    if (Runtime.lastAnnounced === provider) return;
    Runtime.lastAnnounced = provider;
    if (provider === 'cloud') {
      Toast.show('Using the cloud compiler — no local backend needed.', 'info', 4200);
    }
  };
})();
