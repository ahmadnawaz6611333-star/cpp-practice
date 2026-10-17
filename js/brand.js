/* ==========================================================================
 * CppPractice — brand & site configuration  (SINGLE SOURCE OF TRUTH)
 * --------------------------------------------------------------------------
 * The name, links and legal fields live here and nowhere else. The running app
 * reads this file (window.CPP_BRAND), so the navbar, footer, page titles, the
 * About page and the server banner all follow it automatically.
 *
 * The few places that cannot read JavaScript at runtime — the static <title>
 * and meta tags in index.html, package.json and README.md — are updated by:
 *
 *     npm run brand:sync
 *
 * Renaming the site later is therefore: edit `name` + `wordmark` + `title` +
 * `description` here, run that command, done. `npm test` fails if index.html
 * and this file ever disagree, so the two cannot silently drift apart.
 * ========================================================================== */
(function (root, factory) {
  const brand = factory();
  if (typeof module === 'object' && module.exports) module.exports = brand;
  if (root) root.CPP_BRAND = brand;
})(typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  return {
    /* ------------------------------- Identity ------------------------------ */
    name: 'CppPractice',
    // The two-tone wordmark: `accent` is rendered in the brand colour.
    wordmark: { main: 'Cpp', accent: 'Practice' },
    tagline: 'Master C++ with 2,040 problems — with a real compiler.',
    shortDescription: 'A C++ practice platform with 2,040 problems and a real compiler.',

    /* --------------------------- Search / social --------------------------- */
    // index.html's <title> and <meta name="description"> are generated from these.
    title: 'CppPractice — Master C++ with 2,040 Problems',
    description: 'A premium C++ practice platform with 2,040 curated problems, an in-browser IDE and a real C++ (g++) compiler that runs locally or in the cloud.',
    locale: 'en',
    themeColor: '#6366f1',

    /* -------------------------------- Links -------------------------------- */
    repository: 'https://github.com/ahmadnawaz6611333-star/cpp-practice',
    liveUrl: 'https://cpp-practice-37n.pages.dev/',

    /* --------------------------- Search Console ---------------------------- */
    // Optional, but this is how the site gets found on Google. Paste the
    // `content` value of the HTML tag that Search Console shows you
    // (Search Console → Add property → URL prefix → HTML tag), then run
    // `npm run brand:sync`. Empty = no verification tag is emitted at all.
    searchConsole: 'DKT_2hapVungoznHbcoikzz787z_t1-Zyk4hYC544-s',

    /* --------------------------- Legal / contact --------------------------- */
    copyrightHolder: 'CppPractice',
    // AdSense + privacy law require a reachable contact address.
    contactEmail: 'ahmadnawaz6611333@gmail.com',
    // Used by the Terms of Service. Change if you are not in Pakistan.
    jurisdiction: 'Pakistan',
    // Shown on the Privacy Policy and Terms pages.
    policiesUpdated: '17 October 2026',
  };
});
