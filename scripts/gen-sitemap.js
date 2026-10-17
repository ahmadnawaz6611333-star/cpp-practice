#!/usr/bin/env node
'use strict';
/* ==========================================================================
 * CppPractice — sitemap generator
 * --------------------------------------------------------------------------
 * Writes /sitemap.xml at the repository root.
 *
 * A hash-routed single-page app has exactly one addressable URL, so the honest
 * sitemap is small: the site root, plus any page you add to EXTRA below once it
 * is a real URL (a prerendered page, or a route that a server rewrite serves at
 * its own path). Listing URLs that return 404 — /problems/1001 on GitHub Pages,
 * for example — would actively harm crawling, so none are listed by default.
 *
 *   node scripts/gen-sitemap.js
 * ========================================================================== */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const brand = require(path.join(ROOT, 'js/brand.js'));

const base = String(brand.liveUrl || '').replace(/\/?$/, '/');
if (!/^https?:\/\//.test(base)) {
  console.error('✗ set a real liveUrl in js/brand.js first (currently: ' + JSON.stringify(brand.liveUrl) + ')');
  process.exit(1);
}

// Add real, server-addressable page URLs here (they must return HTTP 200):
//   'problems/', 'roadmap/', 'reference/', 'about/'
const EXTRA = [];

const today = new Date().toISOString().slice(0, 10);
const urls = [base.replace(/\/$/, '') || base].concat(EXTRA.map((p) => base + String(p).replace(/^\//, '')));

const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => '  <url>\n' +
    '    <loc>' + u.replace(/&/g, '&amp;') + '</loc>\n' +
    '    <lastmod>' + today + '</lastmod>\n' +
    (u === urls[0] ? '    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n'
      : '    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n') +
    '  </url>').join('\n') +
  '\n</urlset>\n';

const out = path.join(ROOT, 'sitemap.xml');
fs.writeFileSync(out, xml);
console.log('✎ wrote sitemap.xml with ' + urls.length + ' url' + (urls.length === 1 ? '' : 's') + ':');
urls.forEach((u) => console.log('    ' + u));

// robots.txt for static hosts (the Node backend serves its own copy with the
// same content). Must sit at the domain root to be honoured.
const robots = 'User-agent: *\n' +
  'Allow: /\n' +
  'Disallow: /api/\n' +
  'Sitemap: ' + base + 'sitemap.xml\n';
fs.writeFileSync(path.join(ROOT, 'robots.txt'), robots);
console.log('✎ wrote robots.txt (sitemap: ' + base + 'sitemap.xml)');

console.log('\n  A hash-routed SPA has one addressable URL, so per-page entries are omitted');
console.log('  unless you add real (HTTP 200) page URLs to EXTRA in this script.');
