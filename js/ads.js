/* ==========================================================================
 * CppPractice — advertising configuration (Google AdSense)
 * --------------------------------------------------------------------------
 * Advertising is OFF until `publisherId` holds a real AdSense publisher ID.
 * That is deliberate: an unapproved deployment (or a fork) then never loads
 * Google's script, never sets an ad cookie, and needs no cookie banner.
 *
 * To turn ads on:
 *   1. Get approved at https://adsense.google.com and note `ca-pub-…`.
 *   2. Paste it into `publisherId` below.
 *   3. Create ad units in AdSense and paste each unit's `data-ad-slot` id into
 *      `slots` — a slot only renders once its id is filled, so you can enable
 *      them one at a time.
 *   4. Run `npm run brand:sync` (writes the ads.txt + verification meta) and
 *      redeploy. Then run `npm run check:adsense`.
 *
 * `requireConsent` must stay true if you serve visitors in the EU/UK: ads only
 * load after the visitor presses "Accept". Also switch on AdSense's own
 * certified consent platform (AdSense → Privacy & messaging), which is what
 * Google actually requires for personalised ads in the EEA.
 * ========================================================================== */
(function (root, factory) {
  const ads = factory();
  if (typeof module === 'object' && module.exports) module.exports = ads;
  if (root) root.CPP_ADS = ads;
})(typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  return {
    // 'ca-pub-' + 16 digits, e.g. 'ca-pub-1234567890123456'. Empty = ads disabled.
    publisherId: '',

    // Ad unit slot ids (data-ad-slot). One per placement; empty = not shown.
    slots: {
      home: '',        // /            — below the feature cards
      problems: '',    // /problems    — below the catalogue
      problem: '',     // /problems/:id — below the workspace
      reference: '',   // /reference   — below the snippets
    },

    // Ads never load before an explicit "Accept" while this is true.
    requireConsent: true,

    // AdSense responsive format hint: 'auto' | 'horizontal' | 'rectangle' | 'vertical'.
    format: 'auto',
  };
});
