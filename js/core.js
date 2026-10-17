/* ==========================================================================
 * CPPractice Lab — Core layer
 * Storage (preferences / progress / bookmarks), theming, toasts, utilities
 * and the compiler-backend API client.
 * ========================================================================== */
(function () {
  'use strict';

  const CPP = (window.CPP = window.CPP || {});

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
    const defaults = { theme: 'dark', editorTheme: 'dark', fontSize: 14, tabSize: 4, wrap: false, autoSamples: true };
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

  API.health = async function () {
    const res = await fetch(API.endpoint('/api/health'), { method: 'GET' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  };

  API.run = async function (payload) {
    const res = await fetch(API.endpoint('/api/run'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    let data = null;
    const text = await res.text();
    try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
    if (!data) {
      throw new Error(`Backend returned ${res.status} with a non-JSON response.`);
    }
    return { httpStatus: res.status, data };
  };

  /* ----------------------- Compiler status caching ---------------------- */
  const Runtime = (CPP.runtime = { state: { online: null, compiler: null, message: '' } });
  Runtime.probe = async function () {
    try {
      const h = await API.health();
      Runtime.state.online = true;
      Runtime.state.compiler = h.compiler || null;
      Runtime.state.message = h.message || '';
      Runtime.state.status = h.status;
    } catch (e) {
      Runtime.state.online = false;
      Runtime.state.compiler = null;
      Runtime.state.message = e.message || 'unreachable';
      Runtime.state.status = 'unreachable';
    }
    Runtime.renderBadge();
    return Runtime.state;
  };
  Runtime.renderBadge = function () {
    const el = document.getElementById('footerBackend');
    if (!el) return;
    const s = Runtime.state;
    if (s.online === null) { el.textContent = 'backend: checking…'; return; }
    if (!s.online) { el.textContent = 'backend: offline (' + API.displayBase() + ')'; el.style.color = 'var(--c-coral)'; return; }
    if (!s.compiler) { el.textContent = 'backend: online, no C++ compiler'; el.style.color = 'var(--c-amber)'; return; }
    el.textContent = 'backend: online · ' + s.compiler;
    el.style.color = 'var(--c-emerald)';
  };
})();
