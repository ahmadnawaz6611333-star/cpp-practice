/* ==========================================================================
 * CPPractice Lab — Router & bootstrap
 * Hash-based fallback (file://) plus clean history routing when served over
 * HTTP by the Node backend.
 * ========================================================================== */
(function () {
  'use strict';

  const CPP = window.CPP;
  const Store = CPP.store;
  const views = CPP.views;

  const ROUTES = [
    ['home', /^\/?$/, (q) => views.home],
    ['problems', /^\/problems\/?$/, () => views.problems],
    ['workspace', /^\/problems\/(\d+)\/?$/, () => views.workspace],
    ['progress', /^\/progress\/?$/, () => views.progress],
    ['bookmarks', /^\/bookmarks\/?$/, () => views.bookmarks],
    ['roadmap', /^\/roadmap\/?$/, () => views.roadmap],
    ['reference', /^\/reference\/?$/, () => views.reference],
    ['settings', /^\/settings\/?$/, () => views.settings],
    ['about', /^\/about\/?$/, () => views.about],
    ['status', /^\/status\/?$/, () => views.health],
    ['privacy', /^\/privacy\/?$/, () => views.privacy],
    ['terms', /^\/terms\/?$/, () => views.terms],
  ];

  // Which pages may show an ad unit (key into CPP.ads.slots). Content pages
  // only — problem statements, the catalogue, the reference — never the utility
  // pages (settings, status, legal) and never inside the editor.
  const AD_SLOT_BY_ROUTE = {
    home: 'home',
    problems: 'problems',
    workspace: 'problem',
    reference: 'reference',
  };

  function currentPath() {
    if (CPP.routerMode === 'hash') {
      // '#/problems/1001' — or the site root when there is no hash yet.
      const h = location.hash;
      if (h && h.indexOf('#/') === 0) return h.slice(1);
      return '/';
    }
    let p = location.pathname || '/';
    // Strip the mount prefix so '/cpp-practice/problems' matches '/problems'.
    if (CPP.mount && p.indexOf(CPP.mount) === 0) {
      p = p.slice(CPP.mount.length);
      if (!p || p.charAt(0) !== '/') p = '/' + p;
    }
    return p || '/';
  }

  function parseRoute(rawPath) {
    let path = rawPath || '/';
    let search = '';
    const qi = path.indexOf('?');
    if (qi !== -1) { search = path.slice(qi + 1); path = path.slice(0, qi); }
    // When there is no query in the hash, fall back to the real query string
    // (only meaningful when the router reads location.pathname).
    if (!search && CPP.routerMode === 'path') search = location.search.replace(/^\?/, '');

    const query = {};
    new URLSearchParams(search).forEach((v, k) => { query[k] = v; });

    for (const [name, re, pick] of ROUTES) {
      const m = path.match(re);
      if (m) return { name, path, query, params: { id: m[1] }, view: pick() };
    }
    return { name: 'notFound', path, query, params: {}, view: views.notFound };
  }

  const nav = (CPP.nav = {});

  nav.path = function (to) { return to; };

  nav.go = function (to, opts) {
    opts = opts || {};
    if (CPP.routerMode === 'hash') {
      if (('#' + to) === location.hash) { render(); return; }
      location.hash = '#' + to;
      return;
    }
    const url = (CPP.mount || '') + to;
    if (opts.replace) history.replaceState({}, '', url);
    else history.pushState({}, '', url);
    render();
  };

  // Static links in index.html are written as app-root paths ("/problems").
  // On a sub-path host they must become hash links, otherwise they would leave
  // the deployment entirely.
  function rewriteStaticLinks() {
    if (CPP.routerMode !== 'hash') return;
    document.querySelectorAll('a[href^="/"]').forEach((a) => {
      a.setAttribute('href', '#' + a.getAttribute('href'));
    });
  }

  function setActiveNav(name) {
    const map = { home: 'home', problems: 'problems', workspace: 'problems', progress: 'progress', bookmarks: 'bookmarks', roadmap: 'roadmap', reference: 'reference' };
    const target = map[name];
    document.querySelectorAll('.nav-link[data-nav]').forEach((a) => {
      const on = a.dataset.nav === target;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }

  function render() {
    const route = parseRoute(currentPath());
    const root = document.getElementById('app');
    CPP.workspaceRun = null; // reset per view
    setActiveNav(route.name);
    document.title = titleFor(route);
    closeNav();
    let renderOk = true;
    try {
      route.view(root, route);
    } catch (err) {
      console.error('View render failed:', err);
      root.innerHTML = `
        <section class="section"><div class="container"><div class="card card-pad center-box">
          <div style="font-size:3rem">💥</div>
          <h2 class="mb-1">Something went wrong</h2>
          <p class="muted">${CPP.util.escapeHtml(err && err.message ? err.message : String(err))}</p>
          <a class="btn btn-primary mt-2" href="${CPP.href('/')}" data-link>Go home</a>
        </div></div></section>`;
      renderOk = false;
    }
    CPP.currentRouteName = route.name;
    // Advertising is opt-in and appears on content pages only: one clearly
    // labelled unit below the page. Emitted here rather than inside each view so
    // a page cannot double up, and nothing at all is emitted when advertising is
    // unconfigured or consent has not been granted.
    if (renderOk) {
      const adKey = AD_SLOT_BY_ROUTE[route.name];
      const adHtml = adKey ? CPP.ads.slotHtml(adKey) : '';
      if (adHtml) {
        root.insertAdjacentHTML('beforeend',
          '<section class="section ad-section"><div class="container">' + adHtml + '</div></section>');
      }
    }
    CPP.ads.activate(root);
    syncConsentBanner();

    if (!route.query.anchor) window.scrollTo({ top: 0, behavior: 'auto' });
  }
  CPP.render = render;

  /* ------------------------ advertising consent ------------------------ */
  // Shown only when ads are configured *and* the visitor has not chosen yet, so
  // a site without ads never nags anyone about cookies.
  function syncConsentBanner() {
    const host = document.getElementById('consentHost');
    if (!host) return;
    if (!CPP.consent.needed()) {
      host.innerHTML = '';
      host.hidden = true;
      delete host.dataset.shown; // so the card is rebuilt if it is ever needed again
      return;
    }
    host.hidden = false;
    if (host.dataset.shown === '1') return;
    host.dataset.shown = '1';
    host.innerHTML = `
      <div class="consent-card" role="dialog" aria-label="Advertising cookies">
        <div class="consent-text">
          <strong>Cookies for advertising</strong>
          <p class="muted small mb-0">
            Ads from Google AdSense keep this site free, and they may use cookies.
            Your progress, bookmarks and code are stored only in this browser and
            do not depend on this choice.
            <a href="${CPP.href('/privacy')}" data-link>Privacy Policy</a>
          </p>
        </div>
        <div class="consent-actions">
          <button type="button" class="btn btn-ghost btn-small" data-consent="denied">Essential only</button>
          <button type="button" class="btn btn-primary btn-small" data-consent="granted">Accept</button>
        </div>
      </div>`;
  }

  function wireConsent() {
    const host = document.getElementById('consentHost');
    if (!host) return;
    host.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-consent]');
      if (!btn) return;
      CPP.consent.set(btn.getAttribute('data-consent'));
      syncConsentBanner();
      if (CPP.consent.allowsAds()) CPP.ads.activate(document);
      // Re-render so consented slots appear. Skipped on the workspace, where a
      // re-render could interrupt code the user is typing.
      if (CPP.currentRouteName !== 'workspace') render();
    });
  }

  /* ------------------------- shell branding --------------------------- */
  // index.html carries the name statically so crawlers and no-JS visitors see
  // it; this refreshes it from js/brand.js so a rename only ever edits one file.
  function applyBrandToShell() {
    const brand = CPP.brand;
    document.querySelectorAll('[data-brand="wordmark"]').forEach((el) => { el.innerHTML = brand.wordmarkHtml(); });
    document.querySelectorAll('[data-brand="copyright"]').forEach((el) => { el.textContent = brand.copyrightHolder; });
    const logo = document.querySelector('a.nav-logo');
    if (logo) logo.setAttribute('aria-label', brand.name + ' home');
  }

  /* ---------------------- clean-path → hash hand-off -------------------- */
  // Some static hosts do rewrite deep links to index.html (the bundled
  // `_redirects` does). The router still prefers hash URLs there, so translate
  // a delivered clean path such as /problems/1001 into #/problems/1001 instead
  // of quietly landing on the home page. On GitHub Pages such a URL 404s before
  // it ever reaches us, so this is a no-op there.
  function adoptCleanPathAsHash() {
    if (CPP.routerMode !== 'hash') return;
    if (location.hash && location.hash.indexOf('#/') === 0) return;
    let p = location.pathname || '/';
    if (CPP.mount && p.indexOf(CPP.mount) === 0) p = p.slice(CPP.mount.length);
    if (!p || p.charAt(0) !== '/') p = '/' + p;
    if (!/^\/(problems|progress|bookmarks|roadmap|reference|settings|about|status|privacy|terms)(\/|$)/.test(p)) return;
    try {
      history.replaceState({}, '', (CPP.mount || '') + '/' + CPP.href(p + (location.search || '')));
    } catch (e) { /* history unavailable — the hash still resolves */ }
  }

  function titleFor(route) {
    const base = CPP.brand.name;
    switch (route.name) {
      case 'home': return CPP.brand.title || base;
      case 'problems': return 'All Problems · ' + base;
      case 'workspace': {
        const p = window.CATALOGUE.byId.get(Number(route.params.id));
        return p ? `#${p.id} ${p.title} · ${base}` : 'Problem · ' + base;
      }
      case 'progress': return 'Progress · ' + base;
      case 'bookmarks': return 'Bookmarks · ' + base;
      case 'roadmap': return 'Roadmap · ' + base;
      case 'reference': return 'C++ Reference · ' + base;
      case 'settings': return 'Settings · ' + base;
      case 'about': return 'About · ' + base;
      case 'status': return 'Compiler Status · ' + base;
      case 'privacy': return 'Privacy Policy · ' + base;
      case 'terms': return 'Terms of Use · ' + base;
      default: return 'Not found · ' + base;
    }
  }

  /* -------------------------- global wiring ---------------------------- */
  function closeNav() {
    const links = document.getElementById('navLinks');
    const burger = document.getElementById('navBurger');
    if (links) links.classList.remove('open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }

  function wireGlobal() {
    // Link interception
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[data-link]');
      if (!a) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      let target = a.getAttribute('href');
      if (!target) return;
      if (target.indexOf('#/') === 0) target = target.slice(1);
      else if (target.charAt(0) !== '/') return; // external or relative file
      if (target.indexOf('://') !== -1) return;
      e.preventDefault();
      nav.go(target);
    });

    window.addEventListener('popstate', render);
    window.addEventListener('hashchange', render);

    // Theme toggle
    const tt = document.getElementById('themeToggle');
    if (tt) tt.addEventListener('click', () => CPP.theme.toggle());

    // Nav burger
    const burger = document.getElementById('navBurger');
    const links = document.getElementById('navLinks');
    if (burger && links) burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
    });

    // Nav search
    const nsb = document.getElementById('navSearchBtn');
    if (nsb) nsb.addEventListener('click', () => {
      if (/^\/problems(\/|\?|$)/.test(currentPath())) {
        const inp = document.getElementById('pSearch');
        if (inp) { inp.focus(); return; }
      }
      nav.go('/problems');
    });

    // Keyboard: "/" focuses search, Ctrl/Cmd+Enter runs current workspace code
    document.addEventListener('keydown', (e) => {
      const tag = (e.target && e.target.tagName) || '';
      const typing = tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable);
      if (e.key === '/' && !typing) {
        e.preventDefault();
        nsb && nsb.click();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && CPP.workspaceRun) {
        e.preventDefault();
        CPP.workspaceRun();
      }
      if (e.key === 'Escape') closeNav();
    });

    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  /* ------------------------------ boot -------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    // Apply saved theme + settings
    const s = Store.settings();
    CPP.theme.apply(s.theme);

    wireGlobal();
    wireConsent();
    applyBrandToShell();
    rewriteStaticLinks();
    adoptCleanPathAsHash();
    CPP.runtime.probe();

    // Preload Monaco in the background so the first workspace is instant.
    if (CPP.editor && CPP.editor.preload) setTimeout(() => CPP.editor.preload(), 400);

    render();
  });
})();
