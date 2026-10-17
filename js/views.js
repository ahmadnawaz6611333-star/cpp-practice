/* ==========================================================================
 * CPPractice Lab — Views
 * Every page of the app. Each view sets root.innerHTML then wires listeners.
 * ========================================================================== */
(function () {
  'use strict';

  const CPP = window.CPP;
  const U = CPP.util;
  const Store = CPP.store;
  const CATALOGUE = window.CATALOGUE;
  const problems = CATALOGUE.problems;
  const LABELS = CATALOGUE.categoryLabels;

  /* --------------------------- shared helpers -------------------------- */
  // CPP.href is defined in core.js (it needs the detected mount path / router
  // mode), so views just reuse it.

  const views = (CPP.views = {});

  function esc(s) { return U.escapeHtml(s); }
  function href(p) { return CPP.href(p); }

  async function copyText(text, okMsg) {
    try {
      if (navigator.clipboard && window.isSecureContext !== false) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
      }
      CPP.toast.show(okMsg || 'Copied to clipboard', 'success');
      return true;
    } catch (e) {
      CPP.toast.show('Copy failed — select the text manually.', 'warn');
      return false;
    }
  }
  CPP.copy = copyText;

  function diffBadge(d) {
    const cls = d === 'Easy' ? 'badge-easy' : d === 'Medium' ? 'badge-medium' : 'badge-hard';
    return `<span class="badge ${cls}">${esc(d)}</span>`;
  }
  function catTag(p) {
    return `<span class="tag"><i style="background:var(--c-${p.accent})"></i>${esc(LABELS[p.category] || p.category)}</span>`;
  }
  function problemHref(id) { return href('/problems/' + id); }

  function svgRing(pct, id) {
    const r = 72, c = 2 * Math.PI * r;
    const off = c - (U.clamp(pct, 0, 100) / 100) * c;
    return `
      <div class="ring-wrap" role="img" aria-label="${pct}% complete">
        <svg width="168" height="168" viewBox="0 0 168 168">
          <defs>
            <linearGradient id="${id || 'ringGrad'}" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#6366f1"/><stop offset="55%" stop-color="#8b5cf6"/><stop offset="100%" stop-color="#22d3ee"/>
            </linearGradient>
          </defs>
          <circle class="ring-bg" cx="84" cy="84" r="${r}"></circle>
          <circle class="ring-fill" cx="84" cy="84" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${off}"></circle>
        </svg>
        <div class="ring-center"><div><div class="big">${pct}%</div><div class="sub">complete</div></div></div>
      </div>`;
  }

  function emptyState(emoji, title, body, actionHtml) {
    return `<div class="empty-state">
      <div class="emoji">${emoji}</div>
      <h3>${esc(title)}</h3>
      <p class="mb-0">${body || ''}</p>
      ${actionHtml || ''}
    </div>`;
  }

  function difficultyCounts(list) {
    const out = { Easy: 0, Medium: 0, Hard: 0 };
    list.forEach((p) => { out[p.difficulty] = (out[p.difficulty] || 0) + 1; });
    return out;
  }

  /* ============================== HOME ================================= */
  views.home = function (root) {
    const total = problems.length;
    const diff = difficultyCounts(problems);
    const solved = Store.solved().length;
    const pct = total ? Math.round((solved / total) * 100) : 0;
    const dayIdx = Math.floor(Date.now() / 86400000) % total;
    const daily = problems[dayIdx];

    const catCards = CATALOGUE.categories.map((c) => `
      <a class="problem-card card-hover" href="${href('/problems?category=' + c.key)}" data-link>
        <div class="row" style="justify-content:space-between">
          <span class="tag"><i style="background:var(--c-${(problems.find((p) => p.category === c.key) || {}).accent || 'blue'})"></i>Section</span>
          <span class="badge badge-neutral">${c.count} problems</span>
        </div>
        <h3>${esc(c.label)}</h3>
        <p class="excerpt mb-0">Browse every problem in this section with a full statement, hint and sample I/O.</p>
      </a>`).join('');

    root.innerHTML = `
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-content">
            <div class="hero-badge"><span class="pulse-dot"></span> ${total.toLocaleString()} curated C++ problems · 12 sections</div>
            <h1>Master C++ <span class="gradient-text">one real problem</span> at a time.</h1>
            <p class="lead">
              Read the statement, open the built-in editor, and run your code against a genuine local
              <code>g++</code> compiler. Learn with logic and hints — not copy-paste answers.
            </p>
            <div class="hero-buttons">
              <a class="btn btn-large btn-primary" href="${href('/problems')}" data-link>Start practicing →</a>
              <a class="btn btn-large btn-outline" href="${href('/roadmap')}" data-link>View roadmap</a>
            </div>
            <div class="hero-meta">
              <div class="m"><b>${total.toLocaleString()}</b><span>Problems</span></div>
              <div class="m"><b>${CATALOGUE.categories.length}</b><span>Sections</span></div>
              <div class="m"><b>${diff.Easy}·${diff.Medium}·${diff.Hard}</b><span>Easy / Med / Hard</span></div>
              <div class="m"><b>${solved}</b><span>Solved by you</span></div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="tilt-wrap" id="tiltWrap">
              <div class="code-window">
                <div class="code-window-bar">
                  <span class="dots"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></span>
                  <span class="file">sum.cpp</span>
                </div>
                <div class="code-body">
<div class="ln"><span class="tok-key">#include</span> <span class="tok-str">&lt;iostream&gt;</span></div>
<div class="ln"><span class="tok-key">#include</span> <span class="tok-str">&lt;vector&gt;</span></div>
<div class="ln"><span class="tok-key">using namespace</span> std;</div>
<div class="ln"></div>
<div class="ln"><span class="tok-type">int</span> <span class="tok-fn">main</span>() {</div>
<div class="ln">    <span class="tok-type">int</span> n; cin &gt;&gt; n;</div>
<div class="ln">    <span class="tok-type">long long</span> sum = <span class="tok-num">0</span>;</div>
<div class="ln">    <span class="tok-key">for</span> (<span class="tok-type">int</span> i = <span class="tok-num">0</span>; i &lt; n; ++i) {</div>
<div class="ln">        <span class="tok-type">int</span> x; cin &gt;&gt; x; sum += x;</div>
<div class="ln">    }</div>
<div class="ln">    cout &lt;&lt; sum &lt;&lt; endl;  <span class="tok-com">// real output</span></div>
<div class="ln">    <span class="tok-key">return</span> <span class="tok-num">0</span>;</div>
<div class="ln">}</div>
                </div>
              </div>
            </div>
            <div class="row mt-2" style="gap:.5rem;position:relative">
              <span class="chip cyan">g++ · C++17</span>
              <span class="chip emerald">real compiler</span>
              <span class="chip amber">no mock output</span>
            </div>
            <p class="hero-code-note">Choose where code runs: your own machine, or a hosted cloud compiler. The active runtime is always shown.</p>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="card card-pad" style="display:grid;gap:1.4rem;grid-template-columns:auto 1fr">
            <div>${svgRing(pct)}</div>
            <div>
              <div class="between mb-2">
                <div>
                  <h2 class="mb-0">Your progress</h2>
                  <p class="muted mb-0">${solved} of ${total.toLocaleString()} problems solved · ${Store.streak()} day streak</p>
                </div>
                <a class="btn btn-outline" href="${href('/progress')}" data-link>Open dashboard</a>
              </div>
              <div class="grid-3">
                <div><div class="between small mb-1"><span class="muted">Easy</span><span class="mono">${Store.solved().filter((id) => (CATALOGUE.byId.get(id) || {}).difficulty === 'Easy').length}/${diff.Easy}</span></div><div class="meter easy"><span style="width:${pctOf('Easy')}%"></span></div></div>
                <div><div class="between small mb-1"><span class="muted">Medium</span><span class="mono">${Store.solved().filter((id) => (CATALOGUE.byId.get(id) || {}).difficulty === 'Medium').length}/${diff.Medium}</span></div><div class="meter medium"><span style="width:${pctOf('Medium')}%"></span></div></div>
                <div><div class="between small mb-1"><span class="muted">Hard</span><span class="mono">${Store.solved().filter((id) => (CATALOGUE.byId.get(id) || {}).difficulty === 'Hard').length}/${diff.Hard}</span></div><div class="meter hard"><span style="width:${pctOf('Hard')}%"></span></div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="card card-pad" style="display:grid;gap:1.2rem;grid-template-columns:1fr auto;align-items:center">
            <div>
              <span class="eyebrow">Daily challenge</span>
              <h2 class="mb-1">${esc(daily.title)}</h2>
              <p class="muted mb-0">${esc(daily.statement)}</p>
            </div>
            <a class="btn btn-primary btn-large" href="${problemHref(daily.id)}" data-link>Open challenge #${daily.id} →</a>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">Find a problem</span>
            <h2 class="section-title">Search the full catalogue</h2>
            <p class="section-subtitle">Jump straight to any of the ${total.toLocaleString()} problems by id, title, topic or keyword.</p>
          </div>
          <form class="toolbar" id="homeSearchForm" role="search" style="max-width:640px">
            <div class="search-wrap">
              <span class="search-icon">🔍</span>
              <input class="input" id="homeSearch" type="search" placeholder="e.g. 1234, “binary search”, palindrome…" aria-label="Search problems">
            </div>
            <button class="btn btn-primary" type="submit">Search</button>
          </form>
          <div class="seg mt-2" id="homeDiff">
            <a class="btn btn-ghost btn-small" href="${href('/problems?difficulty=Easy')}" data-link>Easy</a>
            <a class="btn btn-ghost btn-small" href="${href('/problems?difficulty=Medium')}" data-link>Medium</a>
            <a class="btn btn-ghost btn-small" href="${href('/problems?difficulty=Hard')}" data-link>Hard</a>
            <a class="btn btn-ghost btn-small" href="${href('/problems')}" data-link>All</a>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">Collections</span>
            <h2 class="section-title">Browse by section</h2>
            <p class="section-subtitle">Twelve structured sections take you from your first <code>cin</code> to advanced algorithms.</p>
          </div>
          <div class="card-grid">${catCards}</div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">Why here</span>
            <h2 class="section-title">A complete practice workspace</h2>
          </div>
          <div class="grid-3">
            ${[
              ['⚙️', 'Real compiler, not a simulator', 'Your C++17 code is compiled by g++ and actually executed. Empty output is shown as empty — never faked.'],
              ['🧠', 'Hints, not spoilers', 'Every problem ships with logic and formula hints instead of copy-paste code.'],
              ['📈', 'Track everything', 'Solved, attempted and bookmarked problems, per-section progress, activity heatmap and streaks.'],
              ['💾', 'Private by default', 'Progress, code and preferences live in your browser. Nothing is uploaded.'],
              ['🧩', '2,040 problems', 'Input/output, variables, operators, conditions, loops, functions, arrays, strings, pointers, OOP, STL and DSA.'],
              ['⚡', 'Fast & responsive', 'Virtualised pagination, keyboard-friendly controls, light and dark themes, mobile layout.'],
            ].map(([i, t, d]) => `
              <div class="card card-pad card-hover">
                <div style="font-size:1.7rem">${i}</div>
                <h3>${t}</h3><p class="muted mb-0">${d}</p>
              </div>`).join('')}
          </div>
        </div>
      </section>`;

    // hero tilt (kept subtle, disabled on touch / reduced motion)
    const tilt = root.querySelector('#tiltWrap');
    if (tilt && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const hero = root.querySelector('.hero-visual');
      hero.addEventListener('mousemove', (e) => {
        const r = hero.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = `rotateY(${-11 + px * 8}deg) rotateX(${5 - py * 8}deg)`;
      });
      hero.addEventListener('mouseleave', () => { tilt.style.transform = ''; });
    }

    const f = root.querySelector('#homeSearchForm');
    f.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = root.querySelector('#homeSearch').value.trim();
      CPP.nav.go('/problems' + (q ? '?q=' + encodeURIComponent(q) : ''));
    });
  };

  function pctOf(d) {
    const total = problems.filter((p) => p.difficulty === d).length;
    const sol = Store.solved().filter((id) => (CATALOGUE.byId.get(id) || {}).difficulty === d).length;
    return total ? Math.round((sol / total) * 100) : 0;
  }

  /* ============================ PROBLEMS =============================== */
  const PAGE_SIZE = 25;

  function filterProblems(q) {
    const search = (q.q || '').trim().toLowerCase();
    const category = q.category || 'all';
    const difficulty = q.difficulty || 'all';
    const status = q.status || 'all';
    const solved = new Set(Store.solved());
    const attempted = new Set(Store.attempted());
    const bookmarks = new Set(Store.bookmarks());

    let list = problems.filter((p) => {
      if (category !== 'all' && p.category !== category) return false;
      if (difficulty !== 'all' && p.difficulty !== difficulty) return false;
      if (search && p.searchBlob.indexOf(search) === -1) return false;
      if (status === 'solved' && !solved.has(p.id)) return false;
      if (status === 'unsolved' && solved.has(p.id)) return false;
      if (status === 'attempted' && !attempted.has(p.id)) return false;
      if (status === 'bookmarked' && !bookmarks.has(p.id)) return false;
      return true;
    });

    const sort = q.sort || 'id';
    if (sort === 'id') list.sort((a, b) => a.id - b.id);
    else if (sort === 'id-desc') list.sort((a, b) => b.id - a.id);
    else if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'difficulty') {
      const rank = { Easy: 0, Medium: 1, Hard: 2 };
      list.sort((a, b) => rank[a.difficulty] - rank[b.difficulty] || a.id - b.id);
    }
    return list;
  }

  function rowHtml(p) {
    const solved = Store.isSolved(p.id);
    const marked = Store.isBookmarked(p.id);
    return `<a class="problem-row ${solved ? 'is-solved' : ''} ${marked ? 'is-bookmarked' : ''}" href="${problemHref(p.id)}" data-link>
      <span class="pid">#${p.id}</span>
      <span class="ptitle">${esc(p.title)}</span>
      <span class="pmeta">${catTag(p)} ${diffBadge(p.difficulty)}</span>
    </a>`;
  }

  function cardHtml(p) {
    const solved = Store.isSolved(p.id);
    return `<a class="problem-card ${solved ? 'is-solved' : ''}" href="${problemHref(p.id)}" data-link>
      <div class="between">
        <span class="pid mono muted small">#${p.id}</span>${diffBadge(p.difficulty)}
      </div>
      <h3>${esc(p.title)}</h3>
      <p class="excerpt">${esc(p.statement)}</p>
      <div class="foot">${catTag(p)}${solved ? '<span class="badge badge-easy">✓ solved</span>' : ''}</div>
    </a>`;
  }

  views.problems = function (root, route) {
    const q = route.query;
    const view = q.view === 'grid' ? 'grid' : 'list';
    const page = Math.max(1, parseInt(q.page, 10) || 1);
    const results = filterProblems(q);
    const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
    const current = Math.min(page, pages);
    const slice = results.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

    const catOptions = ['all'].concat(CATALOGUE.categories.map((c) => c.key))
      .map((k) => `<option value="${k}" ${((q.category || 'all') === k) ? 'selected' : ''}>${k === 'all' ? 'All sections' : esc(LABELS[k])}</option>`).join('');
    const diffOptions = ['all', 'Easy', 'Medium', 'Hard']
      .map((k) => `<option value="${k}" ${((q.difficulty || 'all') === k) ? 'selected' : ''}>${k === 'all' ? 'Any difficulty' : k}</option>`).join('');
    const statusOptions = [['all', 'Any status'], ['solved', 'Solved'], ['unsolved', 'Unsolved'], ['attempted', 'Attempted'], ['bookmarked', 'Bookmarked']]
      .map(([k, l]) => `<option value="${k}" ${((q.status || 'all') === k) ? 'selected' : ''}>${l}</option>`).join('');
    const sortOptions = [['id', 'Id ↑'], ['id-desc', 'Id ↓'], ['title', 'Title A→Z'], ['difficulty', 'Difficulty']]
      .map(([k, l]) => `<option value="${k}" ${((q.sort || 'id') === k) ? 'selected' : ''}>${l}</option>`).join('');

    root.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">Catalogue</span>
            <h2 class="section-title">All ${problems.length.toLocaleString()} problems</h2>
            <p class="section-subtitle">Filter by section, difficulty and status, or search the full text of every statement.</p>
          </div>

          <div class="toolbar card card-pad mb-3" style="align-items:flex-end">
            <div class="search-wrap" style="min-width:260px;flex:2">
              <span class="search-icon">🔍</span>
              <input class="input" id="pSearch" type="search" value="${esc(q.q || '')}" placeholder="Search id, title or statement…" aria-label="Search problems">
            </div>
            <div class="field"><span class="label">Section</span><select class="select" id="pCategory">${catOptions}</select></div>
            <div class="field"><span class="label">Difficulty</span><select class="select" id="pDifficulty">${diffOptions}</select></div>
            <div class="field"><span class="label">Status</span><select class="select" id="pStatus">${statusOptions}</select></div>
            <div class="field"><span class="label">Sort</span><select class="select" id="pSort">${sortOptions}</select></div>
            <button class="btn btn-ghost" id="pReset">Reset</button>
          </div>

          <div class="between mb-2">
            <span class="muted small" id="pMeta">${results.length.toLocaleString()} problems match · page ${current} of ${pages}</span>
            <div class="seg" role="group" aria-label="Layout">
              <button data-view="list" class="${view === 'list' ? 'active' : ''}">List</button>
              <button data-view="grid" class="${view === 'grid' ? 'active' : ''}">Cards</button>
            </div>
          </div>

          <div id="pResults">
            ${slice.length === 0
              ? emptyState('🔍', 'No problems match your filters', 'Try clearing the search box or choosing “Any difficulty”.', `<button class="btn btn-primary mt-2" id="pClearEmpty">Clear filters</button>`)
              : (view === 'grid'
                ? `<div class="card-grid">${slice.map(cardHtml).join('')}</div>`
                : `<div class="problem-list">${slice.map(rowHtml).join('')}</div>`)}
          </div>

          ${pages > 1 ? paginationHtml(current, pages, q) : ''}
        </div>
      </section>`;

    const nav = (patch) => {
      const next = Object.assign({}, q, patch);
      Object.keys(next).forEach((k) => { if (next[k] === '' || next[k] == null) delete next[k]; });
      if (patch.page === undefined) delete next.page;
      const qs = new URLSearchParams(next).toString();
      CPP.nav.go('/problems' + (qs ? '?' + qs : ''));
    };

    const debouncedSearch = U.debounce((v) => nav({ q: v, page: 1 }), 320);
    const search = root.querySelector('#pSearch');
    search.focus();
    search.setSelectionRange(search.value.length, search.value.length);
    search.addEventListener('input', (e) => debouncedSearch(e.target.value));
    root.querySelector('#pCategory').addEventListener('change', (e) => nav({ category: e.target.value, page: 1 }));
    root.querySelector('#pDifficulty').addEventListener('change', (e) => nav({ difficulty: e.target.value, page: 1 }));
    root.querySelector('#pStatus').addEventListener('change', (e) => nav({ status: e.target.value, page: 1 }));
    root.querySelector('#pSort').addEventListener('change', (e) => nav({ sort: e.target.value, page: 1 }));
    root.querySelector('#pReset').addEventListener('click', () => CPP.nav.go('/problems'));
    const clearEmpty = root.querySelector('#pClearEmpty');
    if (clearEmpty) clearEmpty.addEventListener('click', () => CPP.nav.go('/problems'));
    root.querySelectorAll('[data-view]').forEach((b) => b.addEventListener('click', () => nav({ view: b.dataset.view, page: 1 })));
    root.querySelectorAll('[data-page]').forEach((b) => b.addEventListener('click', () => nav({ page: Number(b.dataset.page) })));
  };

  function paginationHtml(current, pages, q) {
    const mk = (p, label, cls, dis) =>
      `<button class="page-btn ${cls || ''}" data-page="${p}" ${dis ? 'disabled' : ''} aria-label="Page ${p}">${label}</button>`;
    let html = `<nav class="pagination" aria-label="Pagination">`;
    html += mk(Math.max(1, current - 1), '‹ Prev', '', current === 1);
    const window0 = 2;
    const nums = new Set([1, pages, current, current - 1, current + 1, current - window0, current + window0]);
    const list = [...nums].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
    let last = 0;
    list.forEach((n) => {
      if (n - last > 1) html += `<span class="page-info">…</span>`;
      html += mk(n, String(n), n === current ? 'active' : '');
      last = n;
    });
    html += mk(Math.min(pages, current + 1), 'Next ›', '', current === pages);
    html += `</nav>`;
    return html;
  }

  /* =========================== WORKSPACE =============================== */
  const VERIFIER_DESCRIPTIVE = /\b(printed|shown|created|declared|used|based|operations?|traversal|values?|demonstrat\w*|displayed|list|result|output|etc)\b|\.\.\.|\{|\bas described\b/i;

  function verifiability(p) {
    const out = U.cleanSampleOutput(p.output).trim();
    const inp = U.expandEscapes(p.input == null ? '' : p.input).trim();
    if (!out) return { ok: false, reason: 'this problem has no reference output in the catalogue' };
    if (VERIFIER_DESCRIPTIVE.test(out)) return { ok: false, reason: 'the sample output is described in words rather than an exact value' };
    if (/as described/i.test(inp)) return { ok: false, reason: 'the sample input is described in words rather than exact values' };
    return { ok: true };
  }

  let ws = null; // per-render workspace state

  function starterFor(p) {
    const saved = Store.loadCode(p.id);
    if (saved != null) return saved;
    return `#include <iostream>
using namespace std;

int main() {
    // Problem #${p.id} — ${p.title}
    // ${p.statement}

    // Write your solution here

    return 0;
}
`;
  }

  views.workspace = function (root, route) {
    const p = CATALOGUE.byId.get(Number(route.params.id));
    if (!p) { views.notFound(root, route); return; }

    const idx = problems.indexOf(p);
    const prev = idx > 0 ? problems[idx - 1] : null;
    const next = idx < problems.length - 1 ? problems[idx + 1] : null;
    const sampleIn = U.cleanSampleInput(p.input);
    const sampleOut = U.cleanSampleOutput(p.output);
    const ver = verifiability(p);
    const settings = Store.settings();

    ws = {
      problem: p,
      mode: 'sample',
      busy: false,
      stdout: '',
      stderr: '',
      tests: [],
      editor: null,
      activeTab: 'out',
      provider: null,
    };

    root.innerHTML = `
      <div class="container">
        <div class="row small muted mt-2 mb-2" style="gap:.4rem">
          <a href="${href('/problems')}" data-link>Problems</a><span>›</span>
          <a href="${href('/problems?category=' + p.category)}" data-link>${esc(LABELS[p.category] || p.category)}</a><span>›</span>
          <span class="mono">#${p.id}</span>
        </div>

        <div class="between mb-2">
          <div class="row" style="gap:.5rem">
            ${diffBadge(p.difficulty)} ${catTag(p)}
            <span class="badge badge-neutral mono">#${p.id}</span>
          </div>
          <div class="row" style="gap:.4rem">
            <button class="btn btn-outline btn-small" id="wsBookmark">${Store.isBookmarked(p.id) ? '★ Bookmarked' : '☆ Bookmark'}</button>
            <button class="btn ${Store.isSolved(p.id) ? 'btn-success' : 'btn-outline'} btn-small" id="wsSolved">${Store.isSolved(p.id) ? '✓ Solved' : 'Mark solved'}</button>
          </div>
        </div>

        <div class="mobile-tabs" role="tablist" aria-label="Workspace sections">
          <button data-mtab="statement" class="active" role="tab">Statement</button>
          <button data-mtab="run" role="tab">Run &amp; output</button>
          <button data-mtab="code" role="tab">Code</button>
        </div>

        <div class="workspace" id="wsGrid" data-mobile="statement">
          <!-- LEFT: statement -->
          <section class="panel statement-panel">
            <div class="panel-head"><span class="title">📄 Problem statement</span><span class="spacer"></span><button class="mini-btn" id="wsCopyStmt">Copy</button></div>
            <div class="panel-body statement">
              <h1>${esc(p.title)}</h1>
              <div class="stmt-block"><h4>Statement</h4><p>${esc(p.statement)}</p></div>
              <div class="io-grid">
                <div class="stmt-block"><h4>Input</h4><p>${esc(sampleIn) || '<span class="muted">No input required.</span>'}</p></div>
                <div class="stmt-block"><h4>Output</h4><p>${esc(sampleOut) || '<span class="muted">(no output)</span>'}</p></div>
              </div>
              <div class="stmt-block">
                <h4>Constraints</h4>
                <p class="muted">Not specified in the source catalogue. Assume standard competitive limits — use <code>long long</code> for large sums and aim for an efficient solution.</p>
              </div>
              <div class="stmt-block"><h4>Hint (logic &amp; formula)</h4><p>${esc(p.hint || 'Break the problem into smaller steps.')}</p></div>

              <div class="stmt-block">
                <h4>Sample test</h4>
                <div class="io-grid">
                  <div class="sample-box">
                    <div class="sb-head">Input <span class="spacer"></span><button class="copy-mini" id="wsCopyIn">copy</button></div>
                    <pre>${esc(sampleIn) || '<span class="muted">No input required.</span>'}</pre>
                  </div>
                  <div class="sample-box">
                    <div class="sb-head">Expected output <span class="spacer"></span><button class="copy-mini" id="wsCopyOut">copy</button></div>
                    <pre>${esc(sampleOut) || '<span class="muted">(no output)</span>'}</pre>
                  </div>
                </div>
                <p class="small muted mt-1 mb-0">
                  ${ver.ok
                    ? 'This sample has an exact reference answer, so Submit can check it automatically.'
                    : 'Automatic checking is unavailable for this problem because ' + esc(ver.reason) + '. Submit will still compile and run your code honestly.'}
                </p>
              </div>

              <hr class="divider">
              <div class="problem-nav">
                ${prev ? `<a class="btn btn-outline btn-small pn-btn" href="${problemHref(prev.id)}" data-link>‹ #${prev.id}</a>` : `<button class="btn btn-outline btn-small pn-btn" disabled>‹ Prev</button>`}
                <span class="pn-label">${idx + 1} / ${problems.length}</span>
                ${next ? `<a class="btn btn-outline btn-small pn-btn" href="${problemHref(next.id)}" data-link>#${next.id} ›</a>` : `<button class="btn btn-outline btn-small pn-btn" disabled>Next ›</button>`}
              </div>
            </div>
          </section>

          <!-- CENTER: execution -->
          <section class="panel exec-panel">
            <div class="panel-head"><span class="title">⚡ Execution</span><span class="spacer"></span><span class="status-pill idle" id="wsStatus">Idle</span></div>

            <div class="run-bar">
              <button class="btn btn-primary" id="wsRun">▶ Run Code</button>
              <button class="btn btn-success" id="wsSubmit" title="Compile and run against the problem sample">✔ Submit Solution</button>
              <span class="grow"></span>
              <div class="seg" id="wsMode" role="group" aria-label="Input mode">
                <button data-mode="sample" class="active" title="Run with the problem's sample input">Sample</button>
                <button data-mode="custom" title="Run with your own stdin">Custom</button>
              </div>
            </div>

            <div class="metric-row" id="wsMetrics">
              <span>Runtime: <b id="wsRuntime">${esc(CPP.api.providerLabel(CPP.api.activeProvider()))}</b></span>
              <span>Exit code: <b id="wsExit">–</b></span>
              <span>Time: <b id="wsTime">–</b></span>
              <span>Memory: <b id="wsMem">n/a</b></span>
            </div>

            <div class="console-tabs" role="tablist">
              <button class="console-tab active" data-ctab="out" role="tab">Output</button>
              <button class="console-tab" data-ctab="err" role="tab">Errors <span class="dotmark hidden" id="wsErrDot"></span></button>
              <button class="console-tab" data-ctab="test" role="tab">Tests</button>
            </div>
            <pre class="console empty" id="wsConsole" tabindex="0" aria-live="polite">Run your code to see the program's real output here.</pre>
            <div class="test-results hidden" id="wsTests"></div>

            <div class="io-field">
              <div class="head"><span class="t">Custom input (stdin)</span><span class="spacer"></span><span class="small muted" id="wsStdinNote">Sample input loaded</span></div>
              <textarea id="wsStdin" spellcheck="false" placeholder="Type the input your program should read…" aria-label="Custom program input"></textarea>
            </div>
          </section>

          <!-- RIGHT: editor -->
          <section class="panel editor-panel">
            <div class="panel-head"><span class="title">💻 C++ editor</span><span class="spacer"></span><span class="badge badge-brand">C++17</span></div>
            <div class="editor-toolbar">
              <button class="mini-btn" id="edFormat" title="Re-indent code">⌘ Format</button>
              <button class="mini-btn" id="edFind" title="Find &amp; replace">🔍 Find</button>
              <button class="mini-btn" id="edCopy" title="Copy code">⧉ Copy</button>
              <button class="mini-btn" id="edDownload" title="Download solution.cpp">⤓ .cpp</button>
              <button class="mini-btn" id="edReset" title="Reset to starter template">↺ Reset</button>
              <button class="mini-btn" id="edWrap" title="Toggle word wrap">⏎ Wrap</button>
              <span class="grow"></span>
              <button class="mini-btn" id="edFontDown" aria-label="Decrease font size">A−</button>
              <span class="small muted mono" id="edFontVal">${settings.fontSize}px</span>
              <button class="mini-btn" id="edFontUp" aria-label="Increase font size">A+</button>
              <button class="mini-btn" id="edTheme" title="Toggle editor theme">◐</button>
            </div>
            <div class="editor-shell"><div class="monaco-host" id="edHost"></div></div>
          </section>
        </div>

        <div class="card card-pad mt-3" style="border-left:3px solid var(--c-cyan)">
          <div class="row" style="align-items:flex-start">
            <span style="font-size:1.3rem">🛡️</span>
            <div>
              <h4 class="mb-1">How execution works here</h4>
              <p class="muted mb-0 small">
                <strong>Run Code</strong> compiles your source with <code>g++ -std=c++17</code> and executes the resulting binary,
                returning real stdout, stderr, exit code and timing. Two runtimes are supported and the active one is always shown
                in the metrics row above:
              </p>
              <ul class="muted small mb-0" style="margin:.4rem 0 0 1.1rem;padding:0">
                <li><strong>Local (your machine)</strong> — the bundled Node.js backend (<code>npm start</code>) shells out to your installed g++.
                  Works offline, no rate limits, but the backend must be running.</li>
                <li><strong>Cloud (Judge0 CE)</strong> — code is sent to the free hosted Judge0 <code>ce.judge0.com</code> service over HTTPS.
                  Nothing to install and no laptop required; it is a shared public service, so it is rate-limited and slower.</li>
              </ul>
              <p class="muted mb-0 small mt-2">
                <strong>Submit Solution</strong> runs the same code against this problem's sample input. Because the catalogue stores only one
                example per problem (and some examples are written in words), Submit reports a <em>sample check</em>, not a hidden-test verdict.
                Pick a runtime in <a href="${href('/settings')}" data-link>Settings</a>.
              </p>
            </div>
          </div>
        </div>
      </div>`;

    wireWorkspace(root, p, sampleIn);
  };

  function wireWorkspace(root, p, sampleIn) {
    const $ = (id) => root.querySelector(id);
    const stdinEl = $('#wsStdin');
    const consoleEl = $('#wsConsole');
    const testsEl = $('#wsTests');
    if (ws.mode === 'sample') stdinEl.value = sampleIn;

    /* --- editor --- */
    const host = $('#edHost');
    ws.editor = CPP.editor.mountAsync(host, {
      value: starterFor(p),
      onChange: U.debounce((code) => Store.saveCode(p.id, code), 500),
    });
    // Expose the editor that is actually mounted. Monaco can hold extra, orphaned
    // models, so "models()[0]" is not reliably the visible one — tests (and the
    // console) use this instead.
    CPP.activeEditor = ws.editor;

    const s = Store.settings();
    const fontEl = $('#edFontVal');
    const setFont = (n) => {
      const size = U.clamp(n, 10, 28);
      Store.saveSettings({ fontSize: size });
      if (ws.editor && ws.editor.setFontSize) ws.editor.setFontSize(size);
      fontEl.textContent = size + 'px';
    };
    $('#edFontDown').addEventListener('click', () => setFont(Store.settings().fontSize - 1));
    $('#edFontUp').addEventListener('click', () => setFont(Store.settings().fontSize + 1));
    $('#edFormat').addEventListener('click', () => { ws.editor.format(); CPP.toast.show('Re-indented your code', 'success'); });
    $('#edFind').addEventListener('click', () => ws.editor.openFind());
    $('#edCopy').addEventListener('click', () => copyText(ws.editor.getValue(), 'Code copied'));
    $('#edDownload').addEventListener('click', () => {
      const blob = new Blob([ws.editor.getValue()], { type: 'text/x-c++src' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `problem-${p.id}-solution.cpp`;
      a.click();
      URL.revokeObjectURL(a.href);
      CPP.toast.show('Downloaded solution.cpp', 'success');
    });
    $('#edReset').addEventListener('click', () => {
      Store.clearCode(p.id);
      ws.editor.setValue(starterFor(p));
      CPP.toast.show('Editor reset to starter template', 'info');
    });
    let wrap = Store.settings().wrap;
    $('#edWrap').addEventListener('click', () => {
      wrap = !wrap; Store.saveSettings({ wrap });
      ws.editor.setWrap(wrap);
    });
    $('#edTheme').addEventListener('click', () => {
      const next = Store.settings().editorTheme === 'light' ? 'dark' : 'light';
      Store.saveSettings({ editorTheme: next });
      CPP.editor.setTheme(next);
      CPP.toast.show('Editor theme: ' + next, 'info');
    });
    if (ws.editor.setWrap) ws.editor.setWrap(wrap);
    ws.editor.setValue(starterFor(p));

    /* --- statement actions --- */
    $('#wsCopyStmt').addEventListener('click', () => copyText(`${p.title}\n\n${p.statement}\n\nInput: ${U.cleanSampleInput(p.input) || '(none)'}\nOutput: ${U.cleanSampleOutput(p.output) || '(none)'}\n\nHint: ${p.hint || ''}`, 'Statement copied'));
    $('#wsCopyIn').addEventListener('click', () => copyText(sampleIn || '', 'Sample input copied'));
    $('#wsCopyOut').addEventListener('click', () => copyText(sampleOut, 'Expected output copied'));

    $('#wsBookmark').addEventListener('click', (e) => {
      const on = Store.toggleBookmark(p.id);
      e.target.textContent = on ? '★ Bookmarked' : '☆ Bookmark';
      CPP.toast.show(on ? 'Added to bookmarks' : 'Removed from bookmarks', on ? 'success' : 'info');
    });
    $('#wsSolved').addEventListener('click', (e) => {
      const on = Store.toggleSolved(p.id);
      e.target.textContent = on ? '✓ Solved' : 'Mark solved';
      e.target.className = 'btn ' + (on ? 'btn-success' : 'btn-outline') + ' btn-small';
      CPP.toast.show(on ? 'Marked as solved' : 'Marked as unsolved', on ? 'success' : 'info');
    });

    /* --- mobile tabs --- */
    root.querySelectorAll('[data-mtab]').forEach((b) => b.addEventListener('click', () => {
      root.querySelectorAll('[data-mtab]').forEach((x) => x.classList.toggle('active', x === b));
      $('#wsGrid').setAttribute('data-mobile', b.dataset.mtab);
      if (b.dataset.mtab === 'code' && ws.editor && ws.editor.focus) setTimeout(() => ws.editor.focus(), 40);
    }));

    /* --- input mode --- */
    root.querySelectorAll('#wsMode [data-mode]').forEach((b) => b.addEventListener('click', () => {
      root.querySelectorAll('#wsMode [data-mode]').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      ws.mode = b.dataset.mode;
      if (ws.mode === 'sample') {
        stdinEl.value = sampleIn;
        $('#wsStdinNote').textContent = 'Sample input loaded';
      } else {
        $('#wsStdinNote').textContent = 'Your custom input';
      }
    }));

    /* --- console tabs --- */
    root.querySelectorAll('[data-ctab]').forEach((b) => b.addEventListener('click', () => switchTab(b.dataset.ctab)));
    function switchTab(tab) {
      ws.activeTab = tab;
      root.querySelectorAll('[data-ctab]').forEach((x) => x.classList.toggle('active', x.dataset.ctab === tab));
      const showTests = tab === 'test';
      consoleEl.classList.toggle('hidden', showTests);
      testsEl.classList.toggle('hidden', !showTests);
      if (showTests) renderTests();
      else paintConsole();
    }
    function paintConsole() {
      if (ws.activeTab === 'err') {
        consoleEl.textContent = ws.stderr || 'No compiler or runtime errors. ✅';
        consoleEl.classList.toggle('err', !!ws.stderr);
        consoleEl.classList.toggle('empty', !ws.stderr);
      } else {
        consoleEl.textContent = ws.stdout !== '' ? ws.stdout : 'Program produced no output.';
        consoleEl.classList.toggle('err', false);
        consoleEl.classList.toggle('empty', ws.stdout === '');
      }
    }
    function renderTests() {
      if (!ws.tests.length) {
        testsEl.innerHTML = `<div class="small muted" style="padding:.2rem 0">No test run yet. Press <strong>Submit Solution</strong> to check the problem sample.</div>`;
        return;
      }
      testsEl.innerHTML = ws.tests.map((t) => `
        <div class="test-item ${t.state}">
          <span class="mark">${t.state === 'pass' ? '✓' : t.state === 'fail' ? '✕' : t.state === 'skip' ? '!' : '·'}</span>
          <span class="tname">${esc(t.name)}</span>
          <span class="tnote">${esc(t.note || '')}</span>
        </div>`).join('');
    }

    /* --- status helpers --- */
    function setStatus(kind, label) {
      const el = $('#wsStatus');
      el.className = 'status-pill ' + kind;
      const spinning = kind === 'compiling' || kind === 'running' || kind === 'queued';
      el.innerHTML = (spinning ? '<span class="spin"></span>' : '') + esc(label);
    }
    function setBusy(on) {
      ws.busy = on;
      $('#wsRun').disabled = on;
      $('#wsSubmit').disabled = on;
      $('#wsMode').querySelectorAll('button').forEach((b) => { b.disabled = on; });
    }
    function setMetrics(exit, time, mem) {
      $('#wsExit').textContent = exit === null || exit === undefined ? '–' : String(exit);
      $('#wsTime').textContent = time == null ? '–' : Math.round(time) + ' ms';
      $('#wsMem').textContent = mem == null ? 'n/a' : Math.round(mem / 1024) + ' MB';
    }

    async function callBackend(stdin) {
      const out = await CPP.api.execute({
        source_code: ws.editor.getValue(),
        stdin: stdin == null ? '' : stdin,
        language: 'cpp',
        timeout: 10000,
      });
      ws.provider = out.provider;
      const label = $('#wsRuntime');
      if (label) label.textContent = CPP.api.providerLabel(out.provider);
      CPP.runtime.announceProvider(out.provider);
      return out;
    }

    function applyResult(res) {
      const d = res.data || {};
      ws.stdout = d.stdout == null ? '' : String(d.stdout);
      ws.stderr = d.stderr == null ? '' : String(d.stderr);
      const errDot = $('#wsErrDot');
      if (errDot) errDot.classList.toggle('hidden', !ws.stderr);
      setMetrics(d.exitCode, d.executionTimeMs, d.memoryUsedKb);
      const label = $('#wsRuntime');
      if (label && d.provider) {
        label.textContent = CPP.api.providerLabel(d.provider) + (d.language ? ' · ' + d.language : '');
      }
      paintConsole();
      return d;
    }

    /* Message shown when the chosen runtime could not be reached at all. */
    function offlineMessage(err) {
      const provider = Store.settings().provider;
      if (provider === 'cloud') {
        return 'Could not reach the cloud compiler (' + CPP.api.cloud.baseUrl() + ').\n\n' +
          (err.message || err) +
          '\n\nCheck your internet connection, or switch to the local runtime in Settings.';
      }
      if (provider === 'local') {
        return 'Could not reach the local backend.\n\n' + (err.message || err) +
          '\n\nStart it with:\n  cd cpp-practice-website\n  npm start\n\nBackend: ' + CPP.api.displayBase() +
          '\n\nNo laptop? Switch the runtime to Cloud in Settings.';
      }
      return 'Could not reach any compiler runtime.\n\n' + (err.message || err) +
        '\n\nLocal backend: ' + CPP.api.displayBase() + ' (start with "npm start")\n' +
        'Cloud compiler: ' + CPP.api.cloud.baseUrl() + ' (needs internet)';
    }

    /* --- RUN --- */
    $('#wsRun').addEventListener('click', async () => {
      if (ws.busy) return;
      setBusy(true);
      setStatus('compiling', 'Compiling & running…');
      ws.stdout = ''; ws.stderr = ''; ws.tests = [];
      consoleEl.textContent = 'Compiling and running…';
      consoleEl.className = 'console empty';
      $('#wsErrDot').classList.add('hidden');
      setMetrics(null, null, null);
      Store.markAttempted(p.id);
      Store.recordActivity('run');
      try {
        const res = await callBackend(stdinEl.value);
        const d = applyResult(res);
        switchTab(d.error ? 'err' : 'out');
        if (!d.error) setStatus('accepted', 'Completed');
        else if (d.error === 'compilation_error') setStatus('compilation_error', 'Compilation error');
        else if (d.error === 'runtime_error') setStatus('runtime_error', 'Runtime error');
        else if (d.error === 'time_limit_exceeded') setStatus('time_limit_exceeded', 'Time limit exceeded');
        else if (d.error === 'rate_limited') setStatus('internal_error', 'Cloud rate limit');
        else if (d.error === 'compiler_unavailable') { setStatus('internal_error', 'Compiler unavailable'); }
        else setStatus('internal_error', d.error || 'Error');
      } catch (err) {
        ws.stderr = offlineMessage(err);
        switchTab('err');
        setStatus('internal_error', 'Runtime offline');
        setMetrics(null, null, null);
      } finally {
        setBusy(false);
      }
    });

    /* --- SUBMIT --- */
    $('#wsSubmit').addEventListener('click', async () => {
      if (ws.busy) return;
      const ver = verifiability(p);
      setBusy(true);
      setStatus('compiling', 'Compiling & judging…');
      ws.stdout = ''; ws.stderr = ''; ws.tests = [];
      consoleEl.textContent = 'Compiling and running the sample test…';
      consoleEl.className = 'console empty';
      $('#wsErrDot').classList.add('hidden');
      setMetrics(null, null, null);
      Store.markAttempted(p.id);
      Store.recordActivity('run');
      try {
        const res = await callBackend(sampleIn);
        const d = applyResult(res);

        const tests = [];
        if (d.error === 'compilation_error') {
          tests.push({ name: 'Sample test #1', state: 'fail', note: 'Compilation error' });
          setStatus('compilation_error', 'Compilation error');
        } else if (d.error === 'runtime_error') {
          tests.push({ name: 'Sample test #1', state: 'fail', note: 'Runtime error (exit ' + d.exitCode + ')' });
          setStatus('runtime_error', 'Runtime error');
        } else if (d.error === 'time_limit_exceeded') {
          tests.push({ name: 'Sample test #1', state: 'fail', note: 'Time limit exceeded' });
          setStatus('time_limit_exceeded', 'Time limit exceeded');
        } else if (d.error) {
          const friendly = d.error === 'rate_limited' ? 'Cloud compiler rate limit — try again shortly' : d.error;
          tests.push({ name: 'Sample test #1', state: 'skip', note: friendly });
          setStatus('internal_error', d.error === 'rate_limited' ? 'Cloud rate limit' : 'Execution error');
        } else if (!ver.ok) {
          tests.push({ name: 'Sample test #1', state: 'skip', note: 'Not auto-judged — ' + ver.reason });
          setStatus('accepted', 'Ran (not judged)');
        } else if (U.outputsMatch(ws.stdout, U.cleanSampleOutput(p.output))) {
          tests.push({ name: 'Sample test #1', state: 'pass', note: 'Output matches the sample' });
          setStatus('accepted', 'Sample passed');
          const wasSolved = Store.isSolved(p.id);
          if (!wasSolved) {
            Store.toggleSolved(p.id);
            $('#wsSolved').textContent = '✓ Solved';
            $('#wsSolved').className = 'btn btn-success btn-small';
          }
        } else {
          tests.push({ name: 'Sample test #1', state: 'fail', note: 'Output differs from the expected sample' });
          setStatus('wrong_answer', 'Wrong answer (sample)');
        }
        ws.tests = tests;
        switchTab('test');
      } catch (err) {
        ws.stderr = offlineMessage(err);
        ws.tests = [{ name: 'Sample test #1', state: 'skip', note: 'Runtime offline' }];
        switchTab('err');
        setStatus('internal_error', 'Runtime offline');
      } finally {
        setBusy(false);
      }
    });

    /* --- keyboard shortcut (Ctrl/Cmd+Enter) is wired globally in app.js --- */
    CPP.workspaceRun = () => { if (!ws.busy) $('#wsRun').click(); };

    /* --- runtime label: keep it accurate until the first real run --- */
    const syncRuntimeLabel = () => {
      if (ws.provider) return;
      const label = $('#wsRuntime');
      if (label) label.textContent = CPP.api.providerLabel(CPP.api.activeProvider());
    };
    if (CPP.runtime.state.provider) syncRuntimeLabel();
    else {
      const unsub = CPP.runtime.subscribe(() => { syncRuntimeLabel(); unsub(); });
    }

    setStatus('idle', 'Idle');
    renderTests();
  }

  function sampleOut(p) { return U.cleanSampleOutput(p.output); }

  /* ============================ PROGRESS =============================== */
  views.progress = function (root) {
    const total = problems.length;
    const solved = Store.solved();
    const attempted = Store.attempted();
    const diff = difficultyCounts(problems);
    const pct = total ? Math.round((solved.length / total) * 100) : 0;
    const activity = Store.activity();
    const runs = Object.values(activity).reduce((a, d) => a + (d.runs || 0), 0);
    const solvesToday = (activity[U.todayKey()] || {}).solves || 0;
    const runsToday = (activity[U.todayKey()] || {}).runs || 0;

    const byDiff = (d) => {
      const totalD = problems.filter((x) => x.difficulty === d).length;
      const solD = solved.filter((id) => (CATALOGUE.byId.get(id) || {}).difficulty === d).length;
      return { totalD, solD, pct: totalD ? Math.round((solD / totalD) * 100) : 0 };
    };
    const easy = byDiff('Easy'), medium = byDiff('Medium'), hard = byDiff('Hard');

    const catRows = CATALOGUE.categories.map((c) => {
      const totalC = c.count;
      const solC = solved.filter((id) => (CATALOGUE.byId.get(id) || {}).category === c.key).length;
      const pc = totalC ? Math.round((solC / totalC) * 100) : 0;
      return `<div class="bar-row">
        <span class="bl">${esc(c.label)}</span>
        <span class="meter"><span style="width:${pc}%"></span></span>
        <span class="bv">${solC}/${totalC}</span>
      </div>`;
    }).join('');

    // activity heatmap (last 20 weeks)
    const weeks = 20;
    const cells = [];
    const start = new Date();
    start.setDate(start.getDate() - (weeks * 7 - 1));
    start.setDate(start.getDate() - start.getDay());
    for (let i = 0; i < weeks * 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const k = U.todayKey(d);
      const a = activity[k] || { runs: 0, solves: 0 };
      const score = a.solves * 2 + a.runs;
      const lvl = score === 0 ? 0 : score < 3 ? 1 : score < 8 ? 2 : score < 16 ? 3 : 4;
      const colors = ['var(--panel-2)', 'rgba(99,102,241,.35)', 'rgba(99,102,241,.6)', 'rgba(139,92,246,.8)', 'var(--c-cyan)'];
      cells.push(`<span title="${k} · ${a.solves} solved, ${a.runs} runs" style="width:13px;height:13px;border-radius:3px;background:${colors[lvl]};display:inline-block"></span>`);
    }

    const recent = solved.slice(-8).reverse().map((id) => {
      const p = CATALOGUE.byId.get(id); if (!p) return '';
      return `<a class="problem-row" href="${problemHref(p.id)}" data-link><span class="pid">#${p.id}</span><span class="ptitle">${esc(p.title)}</span><span class="pmeta">${diffBadge(p.difficulty)} ${catTag(p)}</span></a>`;
    }).join('');

    const attemptedOnly = attempted.filter((id) => !Store.isSolved(id));

    root.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">Dashboard</span>
            <h2 class="section-title">Your progress</h2>
            <p class="section-subtitle">All figures are computed from your real local activity — nothing here is simulated.</p>
          </div>

          <div class="card card-pad mb-3">
            <div class="progress-hero">
              ${svgRing(pct, 'ringGrad')}
              <div style="width:100%">
                <div class="stat-grid">
                  <div class="stat-card"><div class="k">Solved</div><div class="v">${solved.length}</div></div>
                  <div class="stat-card"><div class="k">Attempted</div><div class="v">${attempted.length}</div></div>
                  <div class="stat-card"><div class="k">Runs</div><div class="v">${runs}</div></div>
                  <div class="stat-card"><div class="k">Streak</div><div class="v">${Store.streak()}d</div></div>
                  <div class="stat-card"><div class="k">Today</div><div class="v">${solvesToday}/${runsToday}</div></div>
                </div>
                <div class="grid-3 mt-2">
                  <div><div class="between small mb-1"><span class="muted">Easy</span><span class="mono">${easy.solD}/${easy.totalD}</span></div><div class="meter easy"><span style="width:${easy.pct}%"></span></div></div>
                  <div><div class="between small mb-1"><span class="muted">Medium</span><span class="mono">${medium.solD}/${medium.totalD}</span></div><div class="meter medium"><span style="width:${medium.pct}%"></span></div></div>
                  <div><div class="between small mb-1"><span class="muted">Hard</span><span class="mono">${hard.solD}/${hard.totalD}</span></div><div class="meter hard"><span style="width:${hard.pct}%"></span></div></div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid-2 mb-3">
            <div class="card card-pad">
              <h3>Progress by section</h3>
              <div class="bar-track">${catRows}</div>
            </div>
            <div class="card card-pad">
              <h3>Activity</h3>
              <p class="muted small">Each square is a day — brighter means more solves and runs.</p>
              <div style="display:grid;grid-template-columns:repeat(${weeks},13px);gap:3px;overflow-x:auto;padding-bottom:.4rem">${cells.join('')}</div>
              <div class="row mt-2 small muted">
                <span>Less</span>
                ${['var(--panel-2)', 'rgba(99,102,241,.35)', 'rgba(99,102,241,.6)', 'rgba(139,92,246,.8)', 'var(--c-cyan)'].map((c) => `<span style="width:13px;height:13px;border-radius:3px;background:${c};display:inline-block"></span>`).join('')}
                <span>More</span>
              </div>
            </div>
          </div>

          <div class="grid-2">
            <div class="card card-pad">
              <div class="between mb-2"><h3 class="mb-0">Recently solved</h3><a class="btn btn-ghost btn-small" href="${href('/bookmarks')}" data-link>Bookmarks</a></div>
              ${recent ? `<div class="problem-list">${recent}</div>` : emptyState('🌱', 'Nothing solved yet', 'Open any problem and press <strong>Submit Solution</strong> to mark it solved.')}
            </div>
            <div class="card card-pad">
              <div class="between mb-2"><h3 class="mb-0">Attempted, not solved</h3><span class="badge badge-neutral">${attemptedOnly.length}</span></div>
              ${attemptedOnly.length
                ? `<div class="problem-list">${attemptedOnly.slice(0, 8).map((id) => { const p = CATALOGUE.byId.get(id); return p ? rowHtml(p) : ''; }).join('')}</div>`
                : `<p class="muted mb-0">Once you run a problem it will appear here until it is solved.</p>`}
            </div>
          </div>

          <div class="between mt-3">
            <span class="muted small">Data source: localStorage on this device.</span>
            <button class="btn btn-danger btn-small" id="pgReset">Reset all progress</button>
          </div>
        </div>
      </section>`;

    root.querySelector('#pgReset').addEventListener('click', () => {
      if (confirm('Erase all solved, attempted, bookmark, activity and saved-code data on this device?')) {
        Store.resetAll();
        CPP.toast.show('Progress reset', 'info');
        views.progress(root);
      }
    });
  };

  /* ============================ BOOKMARKS ============================== */
  views.bookmarks = function (root) {
    const ids = Store.bookmarks().slice().reverse();
    const list = ids.map((id) => CATALOGUE.byId.get(id)).filter(Boolean);

    root.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">Saved</span>
            <h2 class="section-title">Bookmarks</h2>
            <p class="section-subtitle">Problems you starred, newest first.</p>
          </div>
          ${list.length
            ? `<div class="problem-list" id="bmList">${list.map((p) => `
                <div class="row" style="gap:.5rem">
                  <div style="flex:1">${rowHtml(p)}</div>
                  <button class="btn btn-outline btn-small" data-remove="${p.id}" title="Remove bookmark">✕</button>
                </div>`).join('')}</div>`
            : emptyState('★', 'No bookmarks yet', 'Open a problem and press <strong>Bookmark</strong> to save it here.', `<a class="btn btn-primary mt-2" href="${href('/problems')}" data-link>Browse problems</a>`)}
        </div>
      </section>`;

    root.querySelectorAll('[data-remove]').forEach((b) => b.addEventListener('click', () => {
      Store.toggleBookmark(Number(b.dataset.remove));
      CPP.toast.show('Bookmark removed', 'info');
      views.bookmarks(root);
    }));
  };

  /* ============================= ROADMAP =============================== */
  const ROADMAP_TEXT = {
    io: 'Start here: reading input with cin, printing with cout, and formatting output.',
    variables: 'Types, sizes, constants, conversions and the building blocks of every program.',
    operators: 'Arithmetic, relational, logical and bitwise operators plus precedence.',
    conditionals: 'if / else, switch, ternary and nested decisions.',
    loops: 'for, while, do-while, nested iteration, patterns and number theory.',
    functions: 'Parameters, return values, references, overloading and recursion.',
    arrays: '1-D and 2-D arrays, searching, sorting and matrix work.',
    strings: 'std::string, traversal, palindromes, compression and parsing.',
    pointers: 'Addresses, dereferencing, dynamic memory and smart pointers.',
    oop: 'Classes, encapsulation, inheritance, polymorphism and operator overloading.',
    stl: 'vector, list, stack, queue, set, map and the algorithms library.',
    dsa: 'Complexity, linked lists, trees, graphs, sorting and dynamic programming.',
  };

  views.roadmap = function (root) {
    const solvedSet = new Set(Store.solved());
    const steps = CATALOGUE.categories.map((c, i) => {
      const inCat = problems.filter((p) => p.category === c.key);
      const solC = inCat.filter((p) => solvedSet.has(p.id)).length;
      const pc = inCat.length ? Math.round((solC / inCat.length) * 100) : 0;
      const first = inCat[0];
      return `
        <div class="card card-pad card-hover" style="border-left:3px solid var(--c-${(first && first.accent) || 'blue'})">
          <div class="between">
            <span class="badge badge-brand mono">Step ${String(i + 1).padStart(2, '0')}</span>
            <span class="badge badge-neutral">${pc}%</span>
          </div>
          <h3 class="mt-1">${esc(c.label)}</h3>
          <p class="muted">${esc(ROADMAP_TEXT[c.key] || '')}</p>
          <div class="meter mb-2"><span style="width:${pc}%"></span></div>
          <div class="between">
            <span class="small muted">${solC}/${inCat.length} solved</span>
            <a class="btn btn-outline btn-small" href="${href('/problems?category=' + c.key)}" data-link>Practice →</a>
          </div>
        </div>`;
    }).join('');

    root.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">Learning path</span>
            <h2 class="section-title">The 12-step C++ roadmap</h2>
            <p class="section-subtitle">Follow the sections in order, or jump to the topic you need. Progress updates as you solve problems.</p>
          </div>
          <div class="card-grid">${steps}</div>
        </div>
      </section>`;
  };

  /* ============================ REFERENCE ============================== */
  const REFERENCE = [
    ['Program skeleton', `#include <iostream>
using namespace std;

int main() {
    // your code
    return 0;
}`],
    ['Fast input / output', `ios_base::sync_with_stdio(false);
cin.tie(nullptr);`],
    ['Reading input', `int a, b; cin >> a >> b;              // whitespace separated
string line; getline(cin, line);      // whole line
int n; cin >> n; vector<int> v(n);
for (auto &x : v) cin >> x;`],
    ['Formatted output', `#include <iomanip>
cout << fixed << setprecision(2) << 3.14159;   // 3.14`],
    ['Data types', `int      ~4 bytes      short / long / long long for range
double   ~8 bytes      prefer over float
char     ~1 byte       'A' == 65
bool     true / false
string   #include <string>`],
    ['Control flow', `if (x > 0) { ... } else if (x == 0) { ... } else { ... }

switch (day) { case 1: ...; break; default: ...; }

for (int i = 0; i < n; ++i) { ... }
while (n > 0) { n /= 10; }`],
    ['Functions & recursion', `int add(int a, int b = 0) { return a + b; }
void swapByRef(int &a, int &b) { int t = a; a = b; b = t; }
long long fact(int n) { return n <= 1 ? 1 : n * fact(n - 1); }`],
    ['Arrays & matrices', `int a[5] = {1, 2, 3, 4, 5};
int grid[3][3] = {};
for (int i = 0; i < 3; ++i)
    for (int j = 0; j < 3; ++j) cin >> grid[i][j];`],
    ['Strings', `string s = "hello";
s.size(); s.substr(1, 3); s += " world";
reverse(s.begin(), s.end());
toupper(s[0]);        // #include <cctype>`],
    ['Pointers & memory', `int x = 10, *p = &x;
cout << *p;                       // 10
int *arr = new int[n];
delete[] arr;`],
    ['Classes (OOP)', `class Point {
public:
    int x, y;
    Point(int x, int y) : x(x), y(y) {}
    int sum() const { return x + y; }
};`],
    ['STL containers', `vector<int> v = {3, 1, 2};
sort(v.begin(), v.end());
stack<int> st; st.push(1); st.top();
queue<int> q; q.push(1); q.front();
set<int> s; map<string, int> m;
unordered_map<string, int> fast;`],
    ['Common algorithms', `sort(v.begin(), v.end());                    // O(n log n)
binary_search(sorted.begin(), sorted.end(), x);
reverse(v.begin(), v.end());
*max_element(v.begin(), v.end());
accumulate(v.begin(), v.end(), 0LL);        // #include <numeric>`],
    ['Complexity cheat-sheet', `O(1)        hash lookup, array index
O(log n)    binary search, balanced tree
O(n)        single pass
O(n log n)  sorting, efficient divide & conquer
O(n^2)      nested loops — avoid for n > ~5000`],
    ['Useful idioms', `// Sum of digits
while (n) { sum += n % 10; n /= 10; }
// GCD
while (b) { int t = b; b = a % b; a = t; }
// Power of two check
if (n > 0 && (n & (n - 1)) == 0) { /* yes */ }`],
  ];

  views.reference = function (root) {
    root.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="section-head">
            <span class="eyebrow">Notes</span>
            <h2 class="section-title">C++ quick reference</h2>
            <p class="section-subtitle">Bite-sized snippets covering everything the catalogue asks for. Click copy to reuse a snippet.</p>
          </div>
          <div class="grid-2">
            ${REFERENCE.map(([title, code], i) => `
              <div class="card card-pad">
                <div class="between mb-1"><h3 class="mb-0" style="font-size:1rem">${esc(title)}</h3><button class="mini-btn" data-copy-ref="${i}">copy</button></div>
                <pre class="sample-box" style="margin:0"><code style="display:block;padding:.7rem .8rem;font-size:.82rem;white-space:pre-wrap">${esc(code)}</code></pre>
              </div>`).join('')}
          </div>
        </div>
      </section>`;

    root.querySelectorAll('[data-copy-ref]').forEach((b) => b.addEventListener('click', () => copyText(REFERENCE[Number(b.dataset.copyRef)][1], 'Snippet copied')));
  };

  /* ============================ SETTINGS =============================== */
  views.settings = function (root) {
    const s = Store.settings();
    root.innerHTML = `
      <section class="section">
        <div class="container" style="max-width:820px">
          <div class="section-head">
            <span class="eyebrow">Preferences</span>
            <h2 class="section-title">Settings</h2>
            <p class="section-subtitle">Everything is stored locally on this device.</p>
          </div>

          <div class="card card-pad mb-3">
            <h3>Appearance</h3>
            <div class="between mb-2"><span>Website theme</span>
              <div class="seg" id="setTheme"><button data-v="dark" class="${s.theme === 'dark' ? 'active' : ''}">Dark</button><button data-v="light" class="${s.theme === 'light' ? 'active' : ''}">Light</button></div>
            </div>
            <div class="between mb-2"><span>Editor theme</span>
              <div class="seg" id="setEditorTheme"><button data-v="dark" class="${s.editorTheme === 'dark' ? 'active' : ''}">Dark</button><button data-v="light" class="${s.editorTheme === 'light' ? 'active' : ''}">Light</button></div>
            </div>
            <div class="between mb-2"><span>Editor font size</span>
              <div class="row"><button class="btn btn-outline btn-small" id="setFontDown">−</button><span class="mono" id="setFontVal">${s.fontSize}px</span><button class="btn btn-outline btn-small" id="setFontUp">+</button></div>
            </div>
            <div class="between mb-2"><span>Tab size</span>
              <div class="seg" id="setTab"><button data-v="2" class="${s.tabSize === 2 ? 'active' : ''}">2</button><button data-v="4" class="${s.tabSize === 4 ? 'active' : ''}">4</button><button data-v="8" class="${s.tabSize === 8 ? 'active' : ''}">8</button></div>
            </div>
            <div class="between"><span>Word wrap in editor</span>
              <div class="seg" id="setWrap"><button data-v="off" class="${!s.wrap ? 'active' : ''}">Off</button><button data-v="on" class="${s.wrap ? 'active' : ''}">On</button></div>
            </div>
          </div>

          <div class="card card-pad mb-3">
            <h3>Runtime</h3>
            <p class="muted small">Where your C++ is compiled and executed. The active runtime is always shown in the workspace metrics row and in the page footer — nothing switches silently.</p>
            <div class="seg mb-2" id="setProvider">
              <button data-v="auto" class="${s.provider === 'auto' ? 'active' : ''}">Auto</button>
              <button data-v="local" class="${s.provider === 'local' ? 'active' : ''}">Local</button>
              <button data-v="cloud" class="${s.provider === 'cloud' ? 'active' : ''}">Cloud</button>
            </div>
            <div class="small muted mb-2" id="setProviderState"></div>
            <div class="row">
              <button class="btn btn-outline btn-small" id="setProviderTestLocal">Test local</button>
              <button class="btn btn-outline btn-small" id="setProviderTestCloud">Test cloud</button>
            </div>
            <div class="small mt-2" id="setProviderResult"></div>
            <details class="mt-2">
              <summary class="small muted" style="cursor:pointer">Cloud compiler endpoint</summary>
              <div class="row mt-2">
                <input class="input" id="setJudge0Url" value="${esc(s.judge0Url)}" placeholder="https://ce.judge0.com" style="flex:1">
                <button class="btn btn-primary btn-small" id="setJudge0Save">Save</button>
              </div>
              <p class="small muted mt-1 mb-0">
                Default is the free public Judge0 CE instance at <code>https://ce.judge0.com</code> — no API key required.
                It is a shared service, so expect occasional slowness or rate limiting.
              </p>
            </details>
          </div>

          <div class="card card-pad mb-3">
            <h3>Local backend URL</h3>
            <p class="muted small">Only used by the <strong>Local</strong> runtime. Leave blank to use the same origin that serves this page (recommended when you run <code>npm start</code>). Set it when the site is opened from <code>file://</code>.</p>
            <div class="row">
              <input class="input" id="setBackend" value="${esc(CPP.api.base)}" placeholder="http://localhost:3001" style="flex:1">
              <button class="btn btn-primary" id="setBackendSave">Save</button>
              <button class="btn btn-outline" id="setBackendTest">Test</button>
            </div>
            <div class="small mt-2" id="setBackendResult"></div>
          </div>

          <div class="card card-pad">
            <h3>Data</h3>
            <p class="muted small">Solved, attempted, bookmarks, activity, saved code and preferences are kept in <code>localStorage</code>. Nothing leaves your device.</p>
            <div class="row">
              <button class="btn btn-outline" id="setExport">Export progress (JSON)</button>
              <button class="btn btn-danger" id="setReset">Reset everything</button>
            </div>
          </div>
        </div>
      </section>`;

    const seg = (id, fn) => root.querySelectorAll('#' + id + ' button').forEach((b) => b.addEventListener('click', () => {
      root.querySelectorAll('#' + id + ' button').forEach((x) => x.classList.toggle('active', x === b));
      fn(b.dataset.v);
    }));
    seg('setTheme', (v) => { CPP.theme.apply(v); CPP.toast.show('Theme: ' + v, 'info'); });
    seg('setEditorTheme', (v) => { Store.saveSettings({ editorTheme: v }); CPP.editor.setTheme(v); });
    seg('setTab', (v) => Store.saveSettings({ tabSize: Number(v) }));
    seg('setWrap', (v) => Store.saveSettings({ wrap: v === 'on' }));

    /* --- runtime provider --- */
    const provState = root.querySelector('#setProviderState');
    const renderProvState = () => {
      const st = CPP.runtime.state;
      const active = CPP.api.activeProvider();
      const local = st.online === null ? 'checking…'
        : st.online ? ('online' + (st.compiler ? ' · ' + st.compiler : ' · no compiler')) : 'offline';
      const cloud = Store.settings().provider === 'local' ? 'not checked'
        : st.cloudOnline === null ? 'checking…'
        : st.cloudOnline ? 'reachable · ' + (st.cloudName || 'Judge0 CE') : 'unreachable (' + st.cloudMessage + ')';
      provState.innerHTML = `Active runtime: <b>${esc(CPP.api.providerLabel(active))}</b><br>
        Local backend: <b>${esc(local)}</b><br>
        Cloud compiler (${esc(CPP.api.cloud.baseUrl())}): <b>${esc(cloud)}</b>`;
    };
    seg('setProvider', (v) => {
      Store.saveSettings({ provider: v });
      CPP.toast.show('Runtime: ' + v, 'info');
      CPP.runtime.lastAnnounced = null;
      CPP.runtime.probe().then(renderProvState);
    });
    renderProvState();
    // Resolve the live state once on entry, then refresh the summary line.
    CPP.runtime.probe().then(renderProvState, renderProvState);

    root.querySelector('#setProviderTestLocal').addEventListener('click', async () => {
      const out = root.querySelector('#setProviderResult');
      out.textContent = 'Testing the local backend…';
      try {
        const h = await CPP.api.local.health();
        out.innerHTML = `✅ Local online — compiler: <b>${esc(h.compiler || 'none')}</b> · ${esc(h.message || '')}`;
      } catch (e) {
        out.innerHTML = `⛔ Local unreachable — ${esc(e.message)}. Start it with <code>npm start</code>, or use the Cloud runtime.`;
      }
    });
    root.querySelector('#setProviderTestCloud').addEventListener('click', async () => {
      const out = root.querySelector('#setProviderResult');
      out.textContent = 'Testing the cloud compiler…';
      try {
        const h = await CPP.api.cloud.health();
        const lang = await CPP.api.cloud.resolveLanguage();
        out.innerHTML = `✅ Cloud online — ${esc(h.service)}${h.version ? ' v' + esc(h.version) : ''} · <b>${esc(lang.name)}</b>`;
      } catch (e) {
        out.innerHTML = `⛔ Cloud unreachable — ${esc(e.message)}. Check your internet connection.`;
      }
    });
    root.querySelector('#setJudge0Save').addEventListener('click', () => {
      Store.saveSettings({ judge0Url: root.querySelector('#setJudge0Url').value.trim() || 'https://ce.judge0.com' });
      try { localStorage.removeItem('cpp-judge0-language'); } catch (e) {}
      CPP.toast.show('Cloud compiler endpoint saved', 'success');
      renderProvState();
      CPP.runtime.probe().then(renderProvState);
    });

    const fontVal = root.querySelector('#setFontVal');
    root.querySelector('#setFontDown').addEventListener('click', () => { const n = U.clamp(Store.settings().fontSize - 1, 10, 28); Store.saveSettings({ fontSize: n }); fontVal.textContent = n + 'px'; });
    root.querySelector('#setFontUp').addEventListener('click', () => { const n = U.clamp(Store.settings().fontSize + 1, 10, 28); Store.saveSettings({ fontSize: n }); fontVal.textContent = n + 'px'; });

    root.querySelector('#setBackendSave').addEventListener('click', () => {
      CPP.api.setBase(root.querySelector('#setBackend').value.trim());
      CPP.toast.show('Backend URL saved', 'success');
      CPP.runtime.probe();
    });
    root.querySelector('#setBackendTest').addEventListener('click', async () => {
      const out = root.querySelector('#setBackendResult');
      out.textContent = 'Testing…';
      try {
        const h = await CPP.api.health();
        out.innerHTML = `✅ Online — compiler: <b>${esc(h.compiler || 'none')}</b> · ${esc(h.message || '')}`;
      } catch (e) {
        out.innerHTML = `⛔ Unreachable — ${esc(e.message)}`;
      }
    });

    root.querySelector('#setExport').addEventListener('click', () => {
      const data = {
        exportedAt: new Date().toISOString(),
        solved: Store.solved(),
        attempted: Store.attempted(),
        bookmarks: Store.bookmarks(),
        activity: Store.activity(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'cppractice-progress.json';
      a.click();
      URL.revokeObjectURL(a.href);
    });
    root.querySelector('#setReset').addEventListener('click', () => {
      if (confirm('Erase ALL local data for CPPractice Lab?')) {
        Store.resetAll();
        CPP.toast.show('All local data cleared', 'info');
        CPP.theme.apply('dark');
        views.settings(root);
      }
    });
  };

  /* ============================== ABOUT ================================ */
  views.about = function (root) {
    root.innerHTML = `
      <section class="section">
        <div class="container" style="max-width:900px">
          <div class="section-head">
            <span class="eyebrow">About</span>
            <h2 class="section-title">About CPPractice Lab</h2>
            <p class="section-subtitle">A local-first C++ practice platform with a genuine compiler backend.</p>
          </div>

          <div class="card card-pad mb-3">
            <h3>How to use it</h3>
            <ol class="muted" style="padding-left:1.2rem">
              <li>Open <a href="${href('/problems')}" data-link>Problems</a> and pick any of the ${problems.length.toLocaleString()} problems.</li>
              <li>Read the statement, then write your solution in the C++ editor.</li>
              <li>Type input in the stdin box (or keep the sample input), then press <strong>Run Code</strong>.</li>
              <li>Read the real program output. Press <strong>Submit Solution</strong> to check the sample and mark the problem solved.</li>
              <li>Track your work on the <a href="${href('/progress')}" data-link>progress dashboard</a>.</li>
            </ol>
          </div>

          <div class="grid-2 mb-3">
            <div class="card card-pad">
              <h3>Architecture</h3>
              <ul class="muted small" style="padding-left:1.1rem">
                <li><strong>Frontend:</strong> static HTML/CSS/JS (no build step). Works from a server or <code>file://</code>.</li>
                <li><strong>Editor:</strong> Monaco (VS Code engine) loaded from a CDN, with a built-in fallback editor.</li>
                <li><strong>Backend:</strong> Node.js + Express in <code>server.js</code> (the <em>Local</em> runtime).</li>
                <li><strong>Compilers:</strong> your machine's <code>g++</code>/<code>clang++</code> (<code>-std=c++17</code>) for the Local runtime, or the hosted Judge0 CE service for the Cloud runtime.</li>
                <li><strong>Storage:</strong> the browser's localStorage. No database, no accounts.</li>
              </ul>
            </div>
            <div class="card card-pad">
              <h3>Troubleshooting</h3>
              <ul class="muted small" style="padding-left:1.1rem">
                <li>“Runtime offline” → for <em>Local</em>, run <code>npm install</code> then <code>npm start</code>; for <em>Cloud</em>, check your internet connection.</li>
                <li>“Compiler unavailable” → install MinGW-w64 (Windows) or <code>g++</code>/<code>clang++</code> and add it to PATH, or switch to the Cloud runtime.</li>
                <li>No laptop available? Set <strong>Settings → Runtime</strong> to <strong>Cloud</strong> — nothing needs to be running locally.</li>
                <li>Deep links like <code>/problems/1001</code> work when the bundled server hosts the site; on a static host (or <code>file://</code>) the router uses <code>#/problems/1001</code> instead — both are shareable.</li>
                <li>Check both runtimes on the <a href="${href('/status')}" data-link>status page</a>.</li>
              </ul>
            </div>
          </div>

          <div class="card card-pad">
            <h3>Privacy &amp; safety</h3>
            <p class="muted small mb-0">
              With the <strong>Local</strong> runtime your code stays on your computer: the bundled Node backend compiles and runs it in an
              isolated temporary directory with source-size, compile-time and run-time limits, then deletes it. Do not expose that backend
              to the public internet without extra sandboxing — it executes untrusted code by design.
            </p>
            <p class="muted small mb-0 mt-2">
              With the <strong>Cloud</strong> runtime the program you run is sent over HTTPS to the hosted Judge0 CE service and its output is
              returned to your browser. Nothing is stored here, but this is a third-party service — avoid running anything sensitive.
              Your progress, saved code and bookmarks never leave your browser either way.
            </p>
          </div>
        </div>
      </section>`;
  };

  /* ============================== HEALTH ============================== */
  views.health = function (root) {
    root.innerHTML = `
      <section class="section">
        <div class="container" style="max-width:860px">
          <div class="section-head">
            <span class="eyebrow">System</span>
            <h2 class="section-title">Compiler status</h2>
            <p class="section-subtitle">Live check of both execution runtimes. The active one is highlighted.</p>
          </div>

          <div class="grid-2" style="align-items:start">
            <div class="card card-pad" id="healthLocal">
              <h3 class="mb-2" style="font-size:1.05rem">Local backend <span class="badge badge-brand hidden" id="healthLocalBadge">active</span></h3>
              <div id="healthLocalBody"><div class="center-box"><div class="spinner"></div><p class="muted mb-0">Contacting local backend…</p></div></div>
            </div>
            <div class="card card-pad" id="healthCloud">
              <h3 class="mb-2" style="font-size:1.05rem">Cloud compiler <span class="badge badge-brand hidden" id="healthCloudBadge">active</span></h3>
              <div id="healthCloudBody"><div class="center-box"><div class="spinner"></div><p class="muted mb-0">Contacting cloud compiler…</p></div></div>
            </div>
          </div>

          <div class="card card-pad mt-3">
            <h3>Test the pipeline</h3>
            <p class="muted small">Compiles and runs a tiny program through the <strong>active runtime</strong>
              (<b id="healthRuntime">detecting…</b>) so you can confirm real execution works.</p>
            <button class="btn btn-primary" id="healthRun">Run hello test</button>
            <pre class="console mt-2" id="healthOut" style="max-height:none">Waiting…</pre>
          </div>
        </div>
      </section>`;

    /* The "active" highlight is decided only once both runtimes have reported,
       so it never depends on which probe happened to answer first. */
    function paintActive() {
      const active = CPP.api.activeProvider();
      const rt = root.querySelector('#healthRuntime');
      if (rt) rt.textContent = CPP.api.providerLabel(active);
      const lb = root.querySelector('#healthLocalBadge');
      const cb = root.querySelector('#healthCloudBadge');
      if (lb) lb.classList.toggle('hidden', active !== 'local');
      if (cb) cb.classList.toggle('hidden', active !== 'cloud');
    }

    const localCard = root.querySelector('#healthLocalBody');
    const pLocal = CPP.api.local.health().then((h) => {
      const ok = h.compiler;
      localCard.innerHTML = `
        <div class="row" style="align-items:flex-start">
          <span style="font-size:1.4rem">${ok ? '🟢' : '🟠'}</span>
          <div style="flex:1">
            <table class="table"><tbody>
              <tr><td>Endpoint</td><td class="mono">${esc(CPP.api.displayBase() || location.origin)}</td></tr>
              <tr><td>Status</td><td class="mono">${esc(h.status)}</td></tr>
              <tr><td>Compiler</td><td class="mono">${esc(h.compiler || '—')}</td></tr>
              <tr><td>Standard</td><td class="mono">${esc(h.standard || 'c++17')}</td></tr>
            </tbody></table>
            ${ok ? '' : '<p class="muted small mb-0">Install MinGW-w64 (Windows) or <code>g++</code>/<code>clang++</code>, then restart the backend. Or switch to the Cloud runtime — it needs nothing installed.</p>'}
          </div>
        </div>`;
    }).catch((e) => {
      localCard.innerHTML = `
        <div class="row" style="align-items:flex-start">
          <span style="font-size:1.4rem">🔴</span>
          <div>
            <p class="muted small mb-2"><b>Offline</b> — ${esc(e.message)} at <span class="mono">${esc(CPP.api.displayBase() || 'same-origin')}</span></p>
            <pre class="console" style="max-height:none">cd cpp-practice-website
npm install
npm start</pre>
            <p class="muted small mb-0">No laptop available? Pick <strong>Cloud</strong> under Settings → Runtime.</p>
          </div>
        </div>`;
    });

    const cloudCard = root.querySelector('#healthCloudBody');
    const pCloud = CPP.api.cloud.health().then(async (h) => {
      let langLine = '';
      try {
        const lang = await CPP.api.cloud.resolveLanguage();
        langLine = `<tr><td>C++ runtime</td><td class="mono">${esc(lang.name)}</td></tr>`;
      } catch (e) {}
      cloudCard.innerHTML = `
        <div class="row" style="align-items:flex-start">
          <span style="font-size:1.4rem">🟢</span>
          <div style="flex:1">
            <table class="table"><tbody>
              <tr><td>Service</td><td class="mono">${esc(h.service)}</td></tr>
              <tr><td>Endpoint</td><td class="mono">${esc(h.url)}</td></tr>
              ${h.version ? `<tr><td>Version</td><td class="mono">${esc(h.version)}</td></tr>` : ''}
              ${langLine}
            </tbody></table>
            <p class="muted small mb-0">Shared public service — no API key, but it can be slow or rate-limit you at peak times.</p>
          </div>
        </div>`;
    }).catch((e) => {
      cloudCard.innerHTML = `
        <div class="row" style="align-items:flex-start">
          <span style="font-size:1.4rem">🔴</span>
          <div>
            <p class="muted small mb-2"><b>Unreachable</b> — ${esc(e.message)} at <span class="mono">${esc(CPP.api.cloud.baseUrl())}</span></p>
            <p class="muted small mb-0">Check your internet connection, or change the endpoint in Settings → Runtime.</p>
          </div>
        </div>`;
    });

    // Refresh the shared runtime state, then decide the highlight + footer badge.
    Promise.all([pLocal, pCloud])
      .then(() => CPP.runtime.probe({ cloud: true }))
      .then(paintActive, paintActive);

    root.querySelector('#healthRun').addEventListener('click', async (e) => {
      const out = root.querySelector('#healthOut');
      e.target.disabled = true;
      out.textContent = 'Compiling & running…';
      try {
        const res = await CPP.api.execute({ source_code: '#include <iostream>\nint main(){ std::cout << "compiler ok\\n"; return 0; }', stdin: '', timeout: 10000 });
        out.textContent = 'Ran on: ' + CPP.api.providerLabel(res.provider) + '\n\n' + JSON.stringify(res.data, null, 2);
      } catch (err) {
        out.textContent = 'Failed on ' + CPP.api.providerLabel(Store.settings().provider === 'cloud' ? 'cloud' : 'local') + ': ' + err.message;
      } finally {
        e.target.disabled = false;
      }
    });
  };

  /* ============================== NOT FOUND ============================ */
  views.notFound = function (root) {
    root.innerHTML = `
      <section class="section">
        <div class="container">
          <div class="card card-pad center-box" style="padding:4rem 1rem">
            <div style="font-size:3.4rem">🧭</div>
            <h2 class="mb-1">Page not found</h2>
            <p class="muted">That route doesn't exist. It may be a mistyped problem id, or a page that was moved.</p>
            <div class="row mt-2">
              <a class="btn btn-primary" href="${href('/')}" data-link>Go home</a>
              <a class="btn btn-outline" href="${href('/problems')}" data-link>Browse all problems</a>
            </div>
          </div>
        </div>
      </section>`;
  };
})();
