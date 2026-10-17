# CPPractice Lab

A premium, colourful C++ practice platform: **2,040 curated problems**, a multi-page
workspace with an advanced in-browser editor, and a **genuinely working local
C++ compiler backend** (real `g++` / `clang++` execution — no mock output, no Judge0,
no external APIs).

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
- ⚡ **Real execution** — Run Code compiles with `-std=c++17` and executes the binary,
  showing real stdout, stderr, exit code and timing. Submit Solution checks the problem's
  sample case and reports an honest sample verdict.
- 📈 **Progress tracking** — solved/attempted/bookmarked, per-section and per-difficulty
  progress, activity heatmap and streaks, all stored locally.
- 🔒 **Local-first** — no database, no accounts, no uploads. Progress and code live in your
  browser's `localStorage`.

---

## Architecture

```
cpp-practice-website/
├── index.html                  # App shell (single entry point for all routes)
├── styles.css                  # Design system (tokens, components, themes, responsive)
├── js/
│   ├── data.js                 # The 2,040 problems (original catalogue) + indexes
│   ├── core.js                 # Storage, theming, toasts, utils, backend API client
│   ├── editor.js               # Monaco loader + fallback editor + code formatter
│   ├── views.js                # Every page/route renderer
│   └── app.js                  # Router, nav, global keyboard shortcuts, bootstrap
├── server.js                   # Express: static hosting + /api/health + /api/run (compiler)
├── tests/
│   ├── api.test.js             # Catalogue integrity + HTTP API + real compilation tests
│   └── e2e.browser.js          # Headless-Chrome end-to-end test (render, run, submit)
├── scripts/
│   └── generate-problems-json.js   # Exports data/problems.json
├── data/problems.json          # Generated export of the catalogue
├── package.json
└── README.md
```

**Frontend:** plain HTML/CSS/JS (no build step). Monaco is the only CDN dependency.
**Backend:** Node.js + Express. It serves the site *and* exposes the compiler API on the
same origin, so the frontend needs no configuration when run normally.

The problem catalogue is loaded as a static JS module and indexed at load time
(a `Map` for id lookups and a precomputed lowercase search blob). The list is paginated
(25 per page) so rendering stays fast with 2,040 entries.

---

## Requirements

- **Node.js** v18 or newer (tested on v24)
- **A C++ compiler** on `PATH`:
  - Windows: MinGW-w64 (`g++`), e.g. via Code::Blocks, MSYS2 or WinLibs
  - macOS/Linux: `g++` or `clang++`
- Optional: **Chrome/Edge** for the browser end-to-end test

> Node.js is **not** a C++ compiler. The backend shells out to your installed toolchain.

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
hash routes (`#/problems/1001`). In that mode set the backend URL in **Settings**
(default `http://localhost:3001`) and start the backend with `node server.js`.

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
| `/settings`          | Theme, editor, backend URL, data export/reset |
| `/about`             | About, architecture, troubleshooting   |
| `/status`            | Live compiler backend status + pipeline test |
| `/health`            | **API** (JSON) — not the status page   |

---

## The problem workspace

Three panels (stacked with tabs on small screens):

1. **Left — statement:** id, title, difficulty/topic tags, statement, input format, output
   format, constraints note, hint, sample input/output with copy buttons, previous/next
   navigation, bookmark and solved controls.
2. **Center — execution:** **Run Code** (real stdout/stderr/exit code/time) and
   **Submit Solution**, a status pill, metrics row, Output / Errors / Tests console tabs,
   and a custom stdin box below the output.
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

## Compiler backend

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

## Tests

```bash
npm start              # terminal 1 — backend must be running
npm test               # terminal 2 — catalogue + API + real compilation (39 checks)
npm run test:e2e       # headless-Chrome end-to-end (render, run, submit) — needs Chrome
npm run test:all       # both
```

- `tests/api.test.js` — 2,040-problem integrity, unique ids, static hosting, and real
  compilation: hello world, stdin, loops, multi-test cases, compile error, runtime error,
  time-limit, **empty-output success**, whitespace preservation, caching, invalid requests.
- `tests/e2e.browser.js` — drives real Chrome over the DevTools Protocol: renders every
  page, searches/filters the catalogue, edits code in Monaco, presses Run and Submit,
  asserts real output, checks the 404 page, theme toggle and that no page errors occur.
  Override the browser with `CHROME_PATH=/path/to/chrome`.

---

## Notes & limitations

- **Memory usage** is reported as `n/a`: reliably measuring peak memory of a child process
  is not portable across Windows/Linux without extra tooling, so the UI shows `n/a` rather
  than inventing a number.
- **One sample per problem** — see “Run vs Submit” above. Automatic judging needs a
  reference answer, which the source catalogue only provides for a subset of problems.
- **Monaco is loaded from a CDN.** If you are offline the app transparently falls back to a
  plain editor (with tab support) and tells you so.
- Progress is per-browser (localStorage). Cross-device sync would require a real service and
  is intentionally out of scope.

---

## GitHub

Source: <https://github.com/ahmadnawaz6611333-star/cpp-practice>

The repository stores source code only. Compilation and execution always happen on the
machine running `server.js`; a static host (GitHub Pages) can serve the frontend but cannot
run the C++ backend, in which case set the backend URL in Settings.

MIT licensed.
