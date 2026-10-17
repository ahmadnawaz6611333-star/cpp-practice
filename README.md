# CppPractice

A premium, colourful C++ practice platform: **2,040 curated problems**, a multi-page
workspace with an advanced in-browser editor, and **genuinely working C++ execution** —
real compilation, real stdout, no mock output.

Code can run in one of two ways, and the active runtime is always displayed:

| Runtime | What it is | Needs |
| ------- | ---------- | ----- |
| **Local** (default) | The bundled Node.js backend shells out to the `g++`/`clang++` on *your* machine. | Node.js + a C++ compiler; the backend must be running |
| **Cloud** | The program is sent over HTTPS to the free hosted **Judge0 CE** service. | Only an internet connection — no laptop, no install, no API key |

---

## Highlights

- 🎨 **Premium design system** — deep navy/indigo/violet base with electric-blue, cyan,
  emerald, amber and coral accents; gradients, glass panels, subtle 3D tilt, animated
  gradient orbs. Full **dark and light** themes.
- 📚 **All 2,040 original problems preserved** — 12 sections × 170, with the original ids,
  titles, statements, input/output samples, difficulties and hints untouched.
- 🗂️ **Multi-page app** — Home, Problems catalogue, per-problem workspace, Progress
  dashboard, Bookmarks, Roadmap, C++ reference, Settings, About/Help, Compiler status, 404.
- 🔗 **Shareable problem URLs** — `/problems/1001` (clean history routing when served over
  HTTP; `#/problems/1001` when opened from `file://`).
- 💻 **Advanced editor** — Monaco (the VS Code editor) with C++ syntax highlighting, line
  numbers, bracket matching, find & replace, formatting, font-size controls, copy/download,
  reset-to-template, word wrap, editor themes — plus an automatic fallback editor if the
  Monaco CDN is unreachable.
- ⚡ **Two real runtimes** — *Local* (`g++ -std=c++17` on your machine) or *Cloud* (hosted
  Judge0 CE). Run Code shows real stdout, stderr, exit code, timing and memory; Submit
  Solution checks the problem's sample case and reports an honest sample verdict.
- ☁️ **Works without your machine being on** — pick the Cloud runtime and the site runs from
  any static host. Nothing to keep running.
- 📈 **Progress tracking** — solved/attempted/bookmarked, per-section and per-difficulty
  progress, activity heatmap and streaks, all stored locally.
- 🔒 **No database, no accounts, no secrets** — progress and code live in your browser's
  `localStorage`; neither runtime requires an API key.
- 🧾 **Privacy Policy + Terms of Use built in** — real pages that describe exactly what is
  stored (down to the `localStorage` keys) and where your code goes. Includes a GDPR-style
  advertising consent banner and a "reset my choice" control.
- 💰 **AdSense-ready, but honest about it** — advertising is wired up and configured in
  `js/ads.js`, yet it stays **invisible**: no ad markup, no Google script and no ad cookie until
  a visitor accepts, and no unit at all until you fill in a slot id. A fork with no publisher id
  stays completely ad-free. See [Monetising with Google AdSense](#monetising-with-google-adsense).

---

## Architecture

```
cpp-practice-website/
├── index.html                  # App shell (single entry point for all routes)
├── styles.css                  # Design system (tokens, components, themes, responsive)
├── _redirects                  # SPA fallback for static hosts (Netlify/Cloudflare Pages)
├── .nojekyll                   # Keeps GitHub Pages from running Jekyll
├── ads.txt                     # AdSense authorisation (belongs at the site root; optional)
├── robots.txt                  # Written by `npm run sitemap`
├── sitemap.xml                 # Written by `npm run sitemap`
├── js/
│   ├── brand.js                # ⭐ Site name, links, legal details (single source of truth)
│   ├── ads.js                  # ⭐ AdSense config — advertising is OFF until this is filled in
│   ├── data.js                 # The 2,040 problems (original catalogue) + indexes
│   ├── core.js                 # Storage, theming, toasts, utils, runtime clients, ads/consent
│   ├── editor.js               # Monaco loader + fallback editor + code formatter
│   ├── views.js                # Every page/route renderer (incl. Privacy Policy + Terms)
│   └── app.js                  # Router, nav, global keyboard shortcuts, bootstrap
├── server.js                   # Express: static hosting + /api/health + /api/run (compiler)
├── tests/
│   ├── api.test.js             # Catalogue integrity + HTTP API + real compilation tests
│   ├── cloud.test.js           # Judge0 cloud runtime contract test (skips when offline)
│   ├── e2e.browser.js          # Headless-Chrome end-to-end test (render, run, submit, cloud)
│   ├── deploy.browser.js       # Verifies a live static deployment works end to end
│   └── adsense.test.js         # Brand, legal pages and "ads can never leak" guarantees
├── scripts/
│   ├── sync-brand.js           # Pushes js/brand.js + js/ads.js into the static files
│   ├── gen-sitemap.js          # Writes sitemap.xml + robots.txt
│   ├── check-adsense.js        # AdSense readiness report (what is still missing)
│   └── generate-problems-json.js   # Exports data/problems.json
├── data/problems.json          # Generated export of the catalogue
├── package.json
└── README.md
```

**Frontend:** plain HTML/CSS/JS (no build step). Monaco is the only CDN dependency.
**Backend:** Node.js + Express. It serves the site *and* exposes the compiler API on the
same origin, so the frontend needs no configuration when run normally.

### One place for the name

The site's name, tagline, links and legal details live **only** in `js/brand.js`, and the
advertising configuration (publisher id, ad units, consent) lives **only** in `js/ads.js`.
The running app reads both files directly, and this pushes them into the files that cannot:

```bash
npm run brand:sync     # index.html head tags + ads.txt + package.json + README.md
npm run brand:check    # fails if those files have drifted from js/brand.js
npm run sitemap        # writes sitemap.xml + robots.txt
npm run check:adsense  # AdSense readiness report
```

So renaming the site later is: edit `name`/`wordmark`/`title`/`description` in `js/brand.js`,
then run `npm run brand:sync`. `npm run test:adsense` fails if the static files and
`js/brand.js` ever disagree, so they cannot silently drift apart.

### Execution runtimes

The frontend talks to a runtime through one small client (`CPP.api` in `js/core.js`):

- `CPP.api.local` → `POST /api/run` on the Node backend (bundled `server.js`).
- `CPP.api.cloud` → `POST {judge0Url}/submissions` on hosted Judge0 CE.
- `CPP.api.execute()` picks one and returns `{ provider, data }`, so the UI can always state
  which runtime produced the result.

**Settings → Runtime** offers `Auto` (use Local when it is reachable and has a compiler,
otherwise Cloud), or you can pin `Local` / `Cloud`. When `Auto` falls back to the cloud you
get a one-time toast, and the workspace metrics row plus the page footer always name the
runtime that ran your code — switching is never silent.

Three independent, verified facts about the cloud path (checked live, see Tests):

- The public Piston API (`emkc.org`) is **not** usable — it became whitelist-only on
  15 Feb 2026.
- The public Judge0 CE instance at `https://ce.judge0.com` **does** work with **no API key**,
  and reports C++ (GCC) plus real time and memory.
- Because no key is involved, no secret ever ships in the browser bundle.

The problem catalogue is loaded as a static JS module and indexed at load time
(a `Map` for id lookups and a precomputed lowercase search blob). The list is paginated
(25 per page) so rendering stays fast with 2,040 entries.

---

## Requirements

- **Node.js** v18 or newer (tested on v24) — only needed for the **Local** runtime or to
  serve the site yourself.
- **A C++ compiler** on `PATH` — only needed for the **Local** runtime:
  - Windows: MinGW-w64 (`g++`), e.g. via Code::Blocks, MSYS2 or WinLibs
  - macOS/Linux: `g++` or `clang++`
- Optional: **Chrome/Edge** for the browser end-to-end test

> Neither is required if you use the **Cloud** runtime: a static host plus a browser is
> enough. See [Deploying without your laptop](#deploying-without-your-laptop).

> Node.js is **not** a C++ compiler. The Local backend shells out to your installed toolchain.

---

## Quick start

```bash
cd cpp-practice-website
npm install          # installs express
npm start            # starts the web + compiler server on http://localhost:3001
```

Then open **http://localhost:3001/**

> Windows PowerShell note: if `npm` is blocked by the script execution policy, run
> `npm.cmd start` or simply `node server.js`.

Check the compiler is detected:

```bash
curl http://localhost:3001/api/health
```

```json
{
  "status": "ok",
  "compiler": "g++",
  "compilerVersion": "g++ (MinGW-W64 ...) 14.2.0",
  "standard": "c++17",
  "message": "Compiler service is healthy."
}
```

If no compiler is found, `status` is `compiler_not_found` and the UI shows
“Compiler unavailable” with setup instructions.

### Opening the frontend without the server

You can still open `index.html` directly (double-click / `file://`). The UI loads and uses
hash routes (`#/problems/1001`). In that mode you can either set the backend URL in
**Settings** (default `http://localhost:3001`) and start the backend with `node server.js`,
or simply switch **Settings → Runtime** to **Cloud** and skip the backend entirely.

---

## Choosing a runtime

### “Do I have to keep my laptop on?”

**Only for the Local runtime.** Local execution is your own machine compiling and running the
code, so it can only work while that machine is running `server.js`.

Switch to **Cloud** and nothing needs to be running locally — the browser sends the program
to the hosted Judge0 CE service and displays the result. That makes a plain static host
enough to use the whole site from any device.

| | Local | Cloud |
| --- | --- | --- |
| Needs your machine on | ✅ yes | ❌ no |
| Needs Node.js + g++ | ✅ yes | ❌ no |
| Works offline | ✅ yes | ❌ no |
| Speed | fast, no queue | 1–5 s round trip |
| Limits | your machine | shared public service; can be slow or rate-limit at peak times |
| Where your code goes | stays on your machine | sent over HTTPS to Judge0 CE (a third party) |

Use Local while developing on your own computer; use Cloud when you want to practise from a
phone, a college lab PC, or a static deployment. Both produce real compiler output —
`g++` locally, and GCC inside Judge0 in the cloud.

---

## Deploying without your laptop

Because the Cloud runtime needs no server of your own, the site can be published as a static
site — no configuration, no build step:

1. Push the folder to a repository. The frontend is just `index.html`, `styles.css` and `js/`.
2. Host it anywhere that serves static files. This repository is published on two hosts:
   - **Cloudflare Pages** — the address everything points at. Connect the repository, framework
     preset *None*, empty build command, build output directory `/`. Live at
     <https://cpp-practice-37n.pages.dev/>. It is served from a domain root, so `/ads.txt`,
     `/robots.txt` and `/sitemap.xml` all resolve at the root — which is the one thing a GitHub
     Pages *project* site cannot do.
   - **GitHub Pages** — a mirror. Settings → Pages → Deploy from branch → `main` / `root`; a
     project site appears at `https://<user>.github.io/<repo>/`, serving the same app from a
     sub-path.
3. Set **Settings → Runtime** to **Cloud** on each device (or leave it on `Auto`: with no local
   backend reachable it picks Cloud and tells you it did).

### About URLs on a static host

`index.html` deliberately contains **no `<base>` tag** and uses relative asset paths, so the
same file works from a domain root, from a sub-path (`/<repo>/`) and from `file://`.

The router then adapts automatically:

| Host | URLs | Why |
| --- | --- | --- |
| Bundled Node server | `/problems/1001` (clean) | It rewrites deep links to `index.html` and injects `<base href="/">` |
| Static host (GitHub Pages, Netlify, `file://`) | `/#/problems/1001` (hash) | A static host cannot rewrite deep links, and rewriting relative assets would break the CSS/JS |

Both forms are unique, shareable links; only the prefix differs. You can force a mode with
`?router=path` or `?router=hash` (remembered per browser), which is useful if you put a
rewrite rule in front of a static host — the included `_redirects` does that for
Netlify/Cloudflare Pages.

The Node backend can also be deployed to a container host (Render, Fly.io, Railway, …) if you
want the Local runtime available remotely — that requires a Docker image with `g++`
installed, and the sandboxing warning below applies with full force.

### Deploying the Node backend (optional)

It must be a normal long-running container with `g++` available:

```dockerfile
FROM node:20-slim
RUN apt-get update && apt-get install -y --no-install-recommends g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY . .
RUN npm install --omit=dev
ENV PORT=3001
EXPOSE 3001
CMD ["node", "server.js"]
```

> Do not run this publicly without real isolation. The Local runtime executes untrusted code
> by design; on a shared host that must be a locked-down container, not the bare process.

---

## Monetising with Google AdSense

### Does it cost money?

| Item | Cost | Needed? |
| ---- | ---- | ------- |
| AdSense account | **free** | yes, to run ads |
| The code in this repository | **free** (already done) | — |
| A **free address** (see the table below) | **free** | optional |
| A **domain you own** (e.g. `cpppractice.com`) | **≈ $10–12 / year** | recommended, not required |
| Paid hosting | not needed | — |
| A paid email address | not needed | — |

**What Google's own documentation actually says** (checked, not assumed):

- **`ads.txt` is not mandatory.** Google's [Ads.txt guide](https://support.google.com/adsense/answer/12171612)
  states: *"Use of ads.txt is not mandatory, but it's highly recommended."* If you do publish one, it
  belongs in the **root directory of the site** — the folder immediately after the domain name, e.g.
  `https://your-site/ads.txt`.
- **No published rule requires a domain you bought.** Blogger users run AdSense on
  `*.blogspot.com` subdomains, so a subdomain is not automatically disqualified. What matters is
  that the site is yours, is verifiable, and has real content.
- **All three ownership-verification methods work on a free address**, because they live at the
  root of *your* host: the AdSense code snippet, the `google-adsense-account` meta tag (already
  generated here) and ads.txt.

So: **you can apply for free today with the current URL — it costs nothing to find out.** If the
review comes back citing ownership, that is the signal to get an address of your own.

**When you can afford it, buy a domain anyway.** It is the only address you actually control, a
free subdomain can be withdrawn or policed by its operator, and GitHub Pages serves a *project*
site from `/<repo>/`, so `/ads.txt` cannot sit at the site root without a custom domain. A `.com`
is roughly the price of a coffee per year, and HTTPS stays free on GitHub Pages, Netlify and
Cloudflare Pages.

### Free options (no money at all)

Every free option was checked against the provider's own rules, not assumed. The result matters,
because a site that intends to show ads is *monetised*, and some free services forbid exactly that.

| Option | Result | Time | Root-serving | Ads allowed? |
| ------ | ------ | ---- | ------------ | ------------ |
| **Keep `github.io/<repo>`** | Works right now, nothing to do | — | ❌ (`/ads.txt` would only be at `/<repo>/ads.txt`) | grey area — Pages may not be used to run a business |
| **`<project>.pages.dev`** / `<project>.netlify.app` | Free static hosting; the address openly says "hosting platform" | minutes | ✅ | yes (usual static-site terms) |
| **`cpppractice.edu.eu.org`** | Free, real-domain-shaped name from [nic.eu.org](https://nic.eu.org/); `EDU.eu.org` is their open domain for *educational sites* | request + manual approval, days–weeks | ✅ | discouraged — eu.org asks commercial sites to buy a domain |
| **`cpppractice.is-a.dev`** ([is-a.dev](https://github.com/is-a-dev/register)) | **Not usable here.** Their terms forbid commercial/for-profit use (§4.8), forbid monetising a subdomain "directly or indirectly" (§5) and forbid "any website that is orientated to courses" (§4.16) — this site is both, once ads run | — | ✅ | ❌ **no** |

**What this means in practice.**

- **Applying costs nothing and needs no domain.** Do that first: AdSense → add the site → verify
  with the meta tag or `ads.txt` that this repository already generates.
- **`eu.org` is not a drop-in.** Direct registration in `eu.org` gets *only* an NS delegation, so
  you must already have DNS hosting for the name (a free Cloudflare zone works), and EU.org advises
  registering inside one of its open subdomains instead — for a C++ learning site that is
  `EDU.eu.org`, giving `cpppractice.edu.eu.org`. Their policy also asks commercial sites to buy a
  domain instead, "unless they support EU.org goals", so approval is not guaranteed.
- **If you want a nicer free address only for sharing links**, a `*.pages.dev` site is the honest
  choice: instant, allowed, and it serves `/ads.txt` from the root. Keeping the same files in a
  repository means the deployment itself does not change.
- **When you can afford ~$10/year, buy the domain anyway.** It is the only address that is really
  yours, it is what AdSense looks best on, and no free provider can withdraw it.

Steps, once you settle on an address of your own:

1. Get the name (buy it, or request it from EU.org — read *their* instructions and follow their
   format exactly; is-a.dev explicitly rejects AI-generated requests, EU.org rejects requests that
   ignore their open-domain list).
2. Point its DNS at GitHub Pages: a `CNAME` record for the name →
   `ahmadnawaz6611333-star.github.io`.
3. In this repository add a `CNAME` file containing the name, and set it as the custom domain in
   **Settings → Pages**. GitHub then serves the site at the *root* of that name and issues the TLS
   certificate automatically.
4. Update `liveUrl` in `js/brand.js`, then run `npm run brand:sync && npm run sitemap`.
5. Verify it for real: `node tests/deploy.browser.js https://your-name/` — the same 19-check suite
   that proves the GitHub Pages deployment works, run against the new address.

### What is already done in this repository

- `js/brand.js` — the single config file. The contact email is already set (and shown on the
  Privacy Policy page); `npm run check:adsense` fails if it is ever blank or a placeholder.
- `/privacy` — a real Privacy Policy: every `localStorage` key listed, what leaves your device
  in Local vs Cloud mode, the advertising cookies, opt-out links, GDPR legal bases and your
  users' rights (access/export, erasure, withdrawal of consent).
- `/terms` — Terms of Use: acceptable use, and an honest description of what **Submit**
  actually does (a sample check, never a hidden-test verdict).
- A **cookie consent banner** that only appears when advertising is actually configured, with
  "Accept" and "Essential only", plus a "change my choice" control in Settings.
- Ad units that **cannot leak**: until the visitor accepts *and* the placement has an ad unit id,
  no ad markup is rendered, no Google script is requested and no cookie is set. This is enforced
  in `js/core.js` and covered by `npm run test:adsense`.
- `ads.txt`, `robots.txt`, `sitemap.xml`, canonical/Open Graph/Twitter tags, the AdSense
  account-verification meta, and a checker that tells you exactly what is still missing.

### Checklist

1. **Get an address — or skip this step.** Buy a domain, or take a free name from the table
   above, or simply apply with the current URL. If you use an address of your own, set it as the
   custom domain in **Settings → Pages** and update `liveUrl` in `js/brand.js` first.
2. Edit `js/brand.js` if needed: `contactEmail` is already set to a real address (the Privacy
   Policy page shows it — it is deliberately kept out of the repository docs), and
   `jurisdiction` is `Pakistan` — change it if you are elsewhere.
3. `npm run brand:sync && npm run sitemap` — writes the canonical/OG tags, the
   verification meta once a publisher id exists, `ads.txt` and `robots.txt`.
4. **Apply at <https://adsense.google.com>**, add the site, and verify ownership (the meta tag
   or ads.txt is already in place and is regenerated from `js/ads.js`). Applying costs nothing.
5. Once approved, paste your `ca-pub-…` id into `js/ads.js`, create an ad unit per placement
   and paste each unit id into `slots` (`home`, `problems`, `problem`, `reference`).
6. Run `npm run check:adsense` — it must say *ready to apply* (or list exactly what is left) —
   then `npm run brand:sync` and redeploy.
7. In AdSense, switch on **Privacy & messaging → GDPR / IAB TCF** messaging. For visitors in
   the EEA/UK Google actually requires their certified consent platform in addition to the
   on-page banner: leave `requireConsent: true` in `js/ads.js`.

### Honest caveats

- **Approval is Google's decision, not something code can guarantee.** Sites are commonly
  rejected for “low value content”, a missing privacy policy, or thin pages.
- **The 2,040 problems must be yours to publish.** AdSense rejects sites whose content is
  copied from somewhere else. Make sure you hold the rights to the catalogue you ship.
- **Traffic is what earns money.** `2,040` problems and a working compiler make the site
  *useful*, but without visitors ads earn close to nothing. See the note below.
- **Ads and a coding workspace are an awkward mix** — that is why every placement here is
  below the content, clearly labelled `Advertisement`, and never inside the editor.
- **A free address can be taken away, and some forbid ads outright.** `is-a.dev` prohibits
  commercial use and any monetisation of its subdomains, and EU.org asks commercial sites to buy a
  domain instead. All of them are run by volunteers or companies whose terms can change. None is a
  substitute for a domain you own once you can afford one.

---

## Routes

| Route                | Page                                   |
| -------------------- | -------------------------------------- |
| `/`                  | Home (hero, collections, progress, daily challenge) |
| `/problems`          | Catalogue with search, filters, sort, pagination |
| `/problems/:id`      | Full problem workspace (statement · execution · editor) |
| `/progress`          | Progress dashboard (rings, section bars, heatmap, streak) |
| `/bookmarks`         | Saved problems with quick remove       |
| `/roadmap`           | 12-step learning path with per-section progress |
| `/reference`         | C++ quick-reference snippets           |
| `/settings`          | Theme, editor, **runtime (Local/Cloud)**, backend URL, **advertising choice**, data export/reset |
| `/about`             | About, architecture, troubleshooting   |
| `/status`            | Live status of **both** runtimes + pipeline test |
| `/privacy`           | Privacy Policy — storage, data flows, advertising cookies, your rights |
| `/terms`             | Terms of Use — acceptable use, what compiler results mean, liability |
| `/health`            | **API** (JSON) — not the status page   |

> On a static host the same routes are reached with a `#` prefix (`/#/problems/1001`). See
> [About URLs on a static host](#about-urls-on-a-static-host).

---

## The problem workspace

Three panels (stacked with tabs on small screens):

1. **Left — statement:** id, title, difficulty/topic tags, statement, input format, output
   format, constraints note, hint, sample input/output with copy buttons, previous/next
   navigation, bookmark and solved controls.
2. **Center — execution:** **Run Code** (real stdout/stderr/exit code/time) and
   **Submit Solution**, a status pill, a metrics row that names the **runtime** used,
   Output / Errors / Tests console tabs, and a custom stdin box below the output.
3. **Right — editor:** Monaco with C++ highlighting, formatting, find, copy, download,
   reset, wrap and font-size controls.

### Run vs Submit

- **Run Code** executes your program with either the **Sample** input (default) or your
  **Custom** stdin and displays exactly what the program printed. An empty program is shown
  as “Program produced no output.” — never replaced by a “compiled successfully” message.
- **Submit Solution** compiles and runs against the problem's sample case.
  - If the sample has an exact reference answer → `Sample passed` or `Wrong answer (sample)`.
  - If the sample is written in words (no exact answer available in the catalogue) →
    the code is run and reported as `Ran (not judged)` with the reason.

> The catalogue ships **one example per problem**, so Submit is deliberately labelled a
> *sample* check. It never claims a full hidden-test verdict, because no hidden tests exist.

---

## The Local runtime (bundled backend)

`server.js` exposes:

| Endpoint                          | Purpose |
| --------------------------------- | ------- |
| `GET /api/health` (`/health`)     | Compiler + service status |
| `GET /api/info`                   | Limits and capabilities |
| `POST /api/run` (`/api/compile`, `/compile`, `/api/execute`) | Compile & execute |

Request body:

```json
{ "source_code": "#include <iostream>\nint main(){ std::cout << 1; }", "stdin": "", "timeout": 10000 }
```

Response:

```json
{
  "status": "success",
  "error": null,
  "stage": "complete",
  "stdout": "1",
  "stderr": "",
  "exitCode": 0,
  "compileTimeMs": 812.4,
  "executionTimeMs": 12.1,
  "totalTimeMs": 830.2,
  "memoryUsedKb": null,
  "cached": false,
  "compiler": "g++",
  "standard": "c++17"
}
```

`error` is one of `null`, `compilation_error`, `runtime_error`, `time_limit_exceeded`,
`compiler_unavailable`, `internal_error`, `invalid_request`, `source_too_large`.

### Safety & limits

- Source ≤ 128 KB, stdin ≤ 256 KB, output ≤ 2 MB per stream
- Compile timeout 30 s, execution timeout 1–60 s (default 10 s)
- Process killed on timeout; temp files removed afterwards
- stdout and stderr captured separately; absolute temp paths stripped from diagnostics
- Compiled binaries cached by source hash (LRU-capped) so re-running identical code is instant
- Max 4 concurrent compilations (bounded by CPU count)

> ⚠️ The backend executes untrusted code on the host. Keep it bound to localhost
> (default) and do **not** expose it to the public internet without an additional sandbox
> (container, `firejail`, Windows Job Objects, etc.).

### Environment variables

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `PORT`   | `3001`  | Server port |
| `HOST`   | `0.0.0.0` | Bind address (use `127.0.0.1` to restrict to localhost) |

No API keys or secrets are required.

---

## The Cloud runtime (Judge0 CE)

Nothing to install and nothing to keep running. The browser posts your program straight to a
hosted Judge0 instance:

```
POST https://ce.judge0.com/submissions?base64_encoded=false&wait=true
{ "source_code": "...", "language_id": 105, "stdin": "", "cpu_time_limit": 10, "wall_time_limit": 13 }
```

- **No API key.** The public CE instance is open, so there is no secret to leak or rotate.
- **Language is discovered, not hard-coded.** The client fetches `/languages`, picks the newest
  `C++ (GCC x.y.z)` entry and caches the choice for a week (ids drift between deployments).
- **Real metrics.** Judge0 returns wall time and peak memory, so the metrics row shows a real
  memory figure in cloud mode (the Local runtime reports `n/a`).
- **Statuses are mapped, never invented**:
  `Accepted → success`, `Wrong Answer → wrong_answer`, `Time Limit Exceeded → time_limit_exceeded`,
  `Compilation Error → compilation_error`, `SIGSEGV/SIGFPE/… → runtime_error`, HTTP 429 →
  `rate_limited`.

The endpoint is configurable under **Settings → Runtime → Cloud compiler endpoint**, and the
**Status** page tests both runtimes and runs a real end-to-end compile through whichever one
is active.

> ⚠️ `ce.judge0.com` is a free, shared, public service intended for light use. It can be slow
> or rate-limit you. For heavy or private use, host your own Judge0 (or another sandboxed
> runner) and point `judge0Url` at it.

---

## Tests

```bash
npm start              # terminal 1 — backend must be running
npm test               # terminal 2 — catalogue + API + real compilation (39 checks)
npm run test:cloud     # cloud runtime contract test (13 checks, skips if offline)
npm run test:e2e       # headless-Chrome end-to-end (render, run, submit, cloud) — needs Chrome (71 checks)
npm run test:adsense   # brand, legal pages and "ads can never leak" (59 checks, no browser)
npm run test:deploy    # verifies a live deployment (19 checks, skips if unreachable)
npm run test:all       # the local suites: api + cloud + e2e + adsense
```

Also useful:

```bash
npm run brand:check    # fails if index.html/ads.txt/package.json/README.md drifted from js/brand.js
npm run check:adsense  # AdSense readiness report (what is missing, what is blocking)
```

- `tests/api.test.js` — 2,040-problem integrity, unique ids, static hosting, and real
  compilation: hello world, stdin, loops, multi-test cases, compile error, runtime error,
  time-limit, **empty-output success**, whitespace preservation, caching, invalid requests.
- `tests/cloud.test.js` — asserts the exact Judge0 contract the browser relies on: no API key,
  a discoverable `C++ (GCC)` runtime, `status.id` mapping for Accepted and Compilation Error,
  real stdout/wall-time/peak-memory, and stdin pass-through. Exits `0` with a SKIP notice when
  there is no internet, so it never fails a build for being offline.
- `tests/e2e.browser.js` — drives real Chrome over the DevTools Protocol: renders every
  page, searches/filters the catalogue, edits code in Monaco, presses Run and Submit,
  asserts real output, **switches to the Cloud runtime and runs/submits real code there**
  (skipped with a notice if the cloud service is unreachable), checks the brand comes from
  `js/brand.js`, renders the Privacy Policy and Terms pages, proves that advertising is inert and that the consent banner + Accept/Essential-only flow behave correctly once ads are configured
  when unconfigured (no ad unit, no Google script, no advert request, no cookie banner),
  checks the 404 page, theme toggle and that no page errors occur. Override the browser with
  `CHROME_PATH=/path/to/chrome`. Current total: **71 checks**.
- `tests/deploy.browser.js` — verifies a **real deployment** (default: the GitHub Pages URL)
  in real Chrome: the stylesheet truly applied, the router chose hash mode, static nav links
  were rewritten, in-app navigation stays inside the deployment, a shareable deep link opens
  the right problem, and the Cloud runtime compiles and runs code there. Run it against any
  host: `node tests/deploy.browser.js https://example.com/my-app/`. It exits `0` with a SKIP
  notice if the host or the cloud compiler is unreachable.
- `tests/adsense.test.js` — loads `js/core.js` in a sandbox and proves the guarantees that
  matter for consent and for an AdSense review: advertising does nothing without a valid
  publisher id, a malformed id is rejected, neither markup nor Google's script appear before
  an explicit Accept, `ads.txt` uses the `pub-…` seller form rather than `ca-pub-…`, `"Essential only"` and withdrawing consent keep ads off, every unit is
  labelled, the catalogue is still exactly 2,040 intact problems, `index.html` carries the
  right title/description/canonical and no hard-coded ad script, `ads.txt`/`robots.txt`/
  `sitemap.xml` are valid, the legal pages contain the required disclosures, and the generated
  files match `js/brand.js`.

---

## Notes & limitations

- **Memory usage** is reported as `n/a` in Local mode: reliably measuring peak memory of a
  child process is not portable across Windows/Linux without extra tooling, so the UI shows
  `n/a` rather than inventing a number. (Cloud mode does report real memory, because Judge0
  measures it.)
- **One sample per problem** — see “Run vs Submit” above. Automatic judging needs a
  reference answer, which the source catalogue only provides for a subset of problems.
- **Monaco is loaded from a CDN.** If you are offline the app transparently falls back to a
  plain editor (with tab support) and tells you so. Cloud execution also needs the network;
  Local execution does not.
- **The Cloud runtime is a third party.** Your program text leaves your browser when you run
  it that way. Local execution keeps everything on your machine.
- **Advertising is configured but shows nothing yet.** `js/ads.js` carries your publisher id so
  AdSense can verify the site, and `ads.txt` authorises the seller id, but every ad unit id is
  still empty — so no unit renders anywhere (which is also what AdSense requires before
  approval). Paste a unit id and the unit appears, gated behind an explicit Accept. A fork that
  registers no publisher id stays completely ad-free: no script, no cookie, no banner.
- **Search visibility is limited by design.** This is a client-rendered single-page app, so
  every route is served from the same `index.html`. On a static host the addressable form is
  `#/problems/1001`, and fragments are not separate pages to a search engine: effectively
  **one indexable URL**. That is why `sitemap.xml` honestly lists a single URL. Adding a real
  prerendered page per route is the way to change this — worth doing before expecting organic
  traffic, and worth doing carefully, because mass-generated thin pages can be penalised as
  “scaled content”.
- Progress is per-browser (localStorage). Cross-device sync would require a real service and
  is intentionally out of scope.

---

## GitHub

Source: <https://github.com/ahmadnawaz6611333-star/cpp-practice>

Live site (Cloudflare Pages, Cloud runtime): <https://cpp-practice-37n.pages.dev/>

Mirror: <https://ahmadnawaz6611333-star.github.io/cpp-practice/> — GitHub Pages serves the same
app, but a project site cannot put `ads.txt` at the site root.

The repository stores source code only. Choose how code runs:

- **Cloud runtime** — a static host (Netlify, Cloudflare Pages, GitHub Pages, or just
  `file://`) is enough. Nothing else needs to be running.
- **Local runtime** — `node server.js` must be running on the machine that has your C++
  toolchain, and the frontend points at it (same origin, or a URL set in Settings).

MIT licensed.
