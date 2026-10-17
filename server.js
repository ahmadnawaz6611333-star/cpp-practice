/**
 * CppPractice — Local C++ Compiler Backend
 * ---------------------------------------------------------------------------
 * Node.js + Express service that:
 *   1. Serves the static frontend (so deep links like /problems/1001 work).
 *   2. Compiles and executes untrusted C++ (g++ / clang++, -std=c++17).
 *
 * Security & resource model
 *   - Each submission gets a private temp directory.
 *   - Source size cap, compile timeout, execution timeout, output size cap.
 *   - Process is killed on timeout; temp files are removed afterwards.
 *   - Compiled binaries are cached by source hash (LRU-capped) to avoid
 *     recompiling identical code on every Run.
 *   - stderr / stdout are captured separately and never mixed.
 *
 * NOTE: Node.js is not a C++ compiler. This service requires a real
 * g++ / clang++ toolchain on the host (see /api/health).
 */

'use strict';

const express = require('express');
const path = require('path');
const os = require('os');
const fs = require('fs');
const fsp = fs.promises;
const { spawn, execFileSync } = require('child_process');
const crypto = require('crypto');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const ROOT = __dirname;

// Brand and advertising live in one place for the whole project: js/brand.js
// and js/ads.js (loaded by the browser as window.CPP_BRAND / window.CPP_ADS).
const BRAND = require('./js/brand.js');
const ADS = require('./js/ads.js');

/* --------------------------------------------------------------------------
 * Configuration
 * ------------------------------------------------------------------------ */
const CONFIG = {
  MAX_SOURCE_SIZE: 128 * 1024,       // 128 KB source
  MAX_STDIN_SIZE: 256 * 1024,        // 256 KB stdin
  COMPILE_TIMEOUT: 30000,            // 30 s compile
  EXEC_TIMEOUT: 10000,               // default 10 s run
  MAX_EXEC_TIMEOUT: 60000,
  MAX_OUTPUT_SIZE: 2 * 1024 * 1024,  // 2 MB stdout/stderr each
  COMPILER_CANDIDATES: ['g++', 'clang++', 'c++', 'g++-14', 'g++-13'],
  STANDARD: 'c++17',
  TEMP_BASE: path.join(os.tmpdir(), 'cpp-practice-compiler'),
  CACHE_DIR: path.join(os.tmpdir(), 'cpp-practice-compiler', 'cache'),
  CACHE_MAX_ENTRIES: 300,
  MAX_CONCURRENT: Math.max(1, Math.min(4, (os.cpus() || [{}]).length - 1)),
};

/* --------------------------------------------------------------------------
 * Compiler discovery
 * ------------------------------------------------------------------------ */
function findCompiler() {
  for (const cmd of CONFIG.COMPILER_CANDIDATES) {
    try {
      const out = execFileSync(cmd, ['--version'], { timeout: 5000, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
      return { cmd, version: String(out).split('\n')[0].trim() };
    } catch (e) { /* try next */ }
  }
  return null;
}

const COMPILER = findCompiler();

/* --------------------------------------------------------------------------
 * Tiny promise semaphore so a burst of submissions can't thrash the CPU
 * ------------------------------------------------------------------------ */
let active = 0;
const waiters = [];
function acquireSlot() {
  if (active < CONFIG.MAX_CONCURRENT) { active++; return Promise.resolve(); }
  return new Promise((resolve) => waiters.push(resolve));
}
function releaseSlot() {
  const next = waiters.shift();
  if (next) next(); else active--;
}

/* --------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------ */
function sha256(s) { return crypto.createHash('sha256').update(s).digest('hex'); }
function submissionId() { return crypto.randomBytes(12).toString('hex'); }

function sanitizeDiagnostics(text, dir) {
  if (!text) return '';
  let out = String(text);
  if (dir) {
    out = out.split(dir).join('');
    out = out.split(dir.replace(/\\/g, '/')).join('');
  }
  // Strip absolute temp paths that may leak the host directory layout.
  out = out.replace(/[A-Za-z]:[\\/][^\s:'"]*cpp-practice-compiler[^\s:'"]*/g, 'solution.cpp');
  out = out.replace(/(?:\/[^\s:'"]*?)\/cpp-practice-compiler\/(?:cache\/)?[0-9a-f]+\//g, '');
  out = out.replace(/^[ \t]+/gm, (m) => m); // keep indentation
  return out.trim();
}

function capOutput(text) {
  if (!text) return '';
  const buf = Buffer.from(text, 'utf8');
  if (buf.length <= CONFIG.MAX_OUTPUT_SIZE) return text;
  return buf.slice(0, CONFIG.MAX_OUTPUT_SIZE).toString('utf8') + '\n…[output truncated]…';
}

async function ensureDirs() {
  await fsp.mkdir(CONFIG.TEMP_BASE, { recursive: true });
  await fsp.mkdir(CONFIG.CACHE_DIR, { recursive: true });
}

async function pruneCache() {
  try {
    const entries = await fsp.readdir(CONFIG.CACHE_DIR);
    if (entries.length <= CONFIG.CACHE_MAX_ENTRIES) return;
    const stats = [];
    for (const name of entries) {
      try {
        const st = await fsp.stat(path.join(CONFIG.CACHE_DIR, name));
        stats.push({ name, mtime: st.mtimeMs });
      } catch (e) {}
    }
    stats.sort((a, b) => a.mtime - b.mtime);
    const remove = stats.slice(0, Math.max(0, stats.length - CONFIG.CACHE_MAX_ENTRIES));
    for (const r of remove) { try { await fsp.unlink(path.join(CONFIG.CACHE_DIR, r.name)); } catch (e) {} }
  } catch (e) {}
}

async function removeDir(dir) {
  try { await fsp.rm(dir, { recursive: true, force: true }); } catch (e) {}
}

// Spawn a process, feed optional stdin, enforce a timeout, capture streams.
function runProcess(cmd, args, opts) {
  opts = opts || {};
  return new Promise((resolve) => {
    const started = process.hrtime.bigint();
    let child;
    try {
      child = spawn(cmd, args, { windowsHide: true, cwd: opts.cwd, stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (err) {
      return resolve({ spawnError: err, stdout: '', stderr: err.message, exitCode: null, signal: null, timedOut: false, durationMs: 0 });
    }

    let stdout = '';
    let stderr = '';
    let stdoutBytes = 0;
    let stderrBytes = 0;
    let timedOut = false;
    let killed = false;

    const timer = setTimeout(() => {
      timedOut = true;
      try { child.kill('SIGKILL'); } catch (e) {}
      setTimeout(() => { try { if (!child.killed) child.kill('SIGKILL'); } catch (e) {} }, 500);
    }, opts.timeout || CONFIG.EXEC_TIMEOUT);

    child.stdout.on('data', (chunk) => {
      stdoutBytes += chunk.length;
      if (stdoutBytes <= CONFIG.MAX_OUTPUT_SIZE * 1.2) stdout += chunk.toString('utf8');
    });
    child.stderr.on('data', (chunk) => {
      stderrBytes += chunk.length;
      if (stderrBytes <= CONFIG.MAX_OUTPUT_SIZE * 1.2) stderr += chunk.toString('utf8');
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ spawnError: err, stdout, stderr: stderr || err.message, exitCode: null, signal: null, timedOut, durationMs: Number(process.hrtime.bigint() - started) / 1e6 });
    });

    child.on('close', (code, signal) => {
      clearTimeout(timer);
      resolve({
        stdout, stderr,
        exitCode: code,
        signal,
        timedOut: timedOut || signal === 'SIGKILL' || signal === 'SIGTERM',
        durationMs: Number(process.hrtime.bigint() - started) / 1e6,
      });
    });

    // Feed stdin
    if (opts.stdin) {
      child.stdin.on('error', () => {});
      child.stdin.write(opts.stdin);
    }
    child.stdin.end();
  });
}

/* --------------------------------------------------------------------------
 * Core: compile (with cache) + execute
 * ------------------------------------------------------------------------ */
async function compileAndRun({ sourceCode, stdin, timeout }) {
  const response = {
    status: 'internal_error',
    error: null,
    stage: 'complete',
    message: '',
    stdout: '',
    stderr: '',
    exitCode: null,
    compileTimeMs: null,
    executionTimeMs: null,
    memoryUsedKb: null,
    cached: false,
    compiler: COMPILER ? COMPILER.cmd : null,
    standard: CONFIG.STANDARD,
  };

  if (!COMPILER) {
    response.status = 'compiler_unavailable';
    response.error = 'compiler_unavailable';
    response.stage = 'compile';
    response.message = 'No C++ compiler (g++/clang++) is installed on this server.';
    response.stderr = 'Install MinGW-w64 (Windows) or g++/clang++ and make sure it is on PATH, then restart the backend.';
    return response;
  }

  const sourceHash = sha256(sourceCode);
  const binDir = path.join(CONFIG.CACHE_DIR, sourceHash);
  const binPath = path.join(binDir, process.platform === 'win32' ? 'solution.exe' : 'solution');

  // --- compile (or reuse cached binary) ---
  let haveBinary = false;
  try { const st = await fsp.stat(binPath); haveBinary = st.size > 0; } catch (e) { haveBinary = false; }

  if (haveBinary) {
    response.cached = true;
    response.compileTimeMs = 0;
  } else {
    const workDir = path.join(CONFIG.TEMP_BASE, submissionId());
    await fsp.mkdir(workDir, { recursive: true });
    const srcFile = path.join(workDir, 'solution.cpp');
    await fsp.mkdir(binDir, { recursive: true });
    const tmpBin = path.join(binDir, 'solution.tmp' + (process.platform === 'win32' ? '.exe' : ''));

    try {
      await fsp.writeFile(srcFile, sourceCode, 'utf8');
    } catch (e) {
      await removeDir(workDir);
      response.message = 'Failed to write source file: ' + e.message;
      return response;
    }

    const compile = await runProcess(COMPILER.cmd, [
      '-std=' + CONFIG.STANDARD, '-O2', '-pipe', '-Wall', '-o', tmpBin, srcFile,
    ], { timeout: CONFIG.COMPILE_TIMEOUT, cwd: workDir });

    response.compileTimeMs = Math.round(compile.durationMs * 100) / 100;

    if (compile.spawnError || compile.exitCode !== 0) {
      await removeDir(workDir);
      await removeDir(binDir);
      response.status = 'compilation_error';
      response.error = 'compilation_error';
      response.stage = 'compile';
      response.message = 'Compilation failed.';
      response.stderr = sanitizeDiagnostics(compile.stderr || compile.stdout, workDir) || 'Unknown compilation error.';
      response.exitCode = compile.exitCode;
      return response;
    }

    try {
      if (process.platform !== 'win32') await fsp.chmod(tmpBin, 0o755);
      await fsp.rename(tmpBin, binPath);
    } catch (e) {
      // A concurrent request may have produced the same binary already.
      let exists = false;
      try { const st = await fsp.stat(binPath); exists = st.size > 0; } catch (err) { exists = false; }
      await removeDir(workDir);
      if (!exists) {
        response.status = 'internal_error';
        response.message = 'Failed to finalise the compiled binary: ' + e.message;
        return response;
      }
    }

    await removeDir(workDir);
    pruneCache();

    // Warnings produced during a successful compile.
    const warnings = sanitizeDiagnostics(compile.stderr, workDir);
    if (warnings) response.stderr = warnings;
  }

  // --- execute compiled binary ---
  const exec = await runProcess(binPath, [], { timeout, stdin });

  response.executionTimeMs = Math.round(exec.durationMs * 100) / 100;
  response.stdout = capOutput(exec.stdout || '');
  response.exitCode = exec.exitCode;

  const execErr = sanitizeDiagnostics(exec.stderr, null);
  // Preserve compiler warnings, then append any runtime stderr.
  response.stderr = [response.stderr, execErr].filter(Boolean).join('\n').trim();

  if (exec.timedOut) {
    response.status = 'time_limit_exceeded';
    response.error = 'time_limit_exceeded';
    response.stage = 'execute';
    response.message = `Time limit exceeded (${Math.round(timeout)} ms).`;
  } else if (exec.spawnError) {
    response.status = 'runtime_error';
    response.error = 'runtime_error';
    response.stage = 'execute';
    response.message = 'Failed to start the program: ' + exec.spawnError.message;
  } else if (exec.exitCode !== 0) {
    response.status = 'runtime_error';
    response.error = 'runtime_error';
    response.stage = 'execute';
    response.message = 'Program exited with a non-zero status (' + exec.exitCode + ').';
  } else {
    response.status = 'success';
    response.error = null;
    response.stage = 'complete';
    response.message = 'Executed successfully.';
  }

  return response;
}

/* --------------------------------------------------------------------------
 * Middleware
 * ------------------------------------------------------------------------ */
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

app.use(express.json({ limit: CONFIG.MAX_SOURCE_SIZE + CONFIG.MAX_STDIN_SIZE }));
// Turn body-parser failures into JSON instead of an HTML error page.
app.use((err, req, res, next) => {
  if (!err) return next();
  const tooLarge = err.type === 'entity.too.large' || err.status === 413;
  return res.status(tooLarge ? 413 : 400).json({
    status: tooLarge ? 'source_too_large' : 'invalid_request',
    error: tooLarge ? 'source_too_large' : 'invalid_request',
    message: tooLarge
      ? `Request body exceeds the ${Math.round((CONFIG.MAX_SOURCE_SIZE + CONFIG.MAX_STDIN_SIZE) / 1024)} KB limit.`
      : 'Malformed JSON request body.',
    stdout: '', stderr: '', exitCode: null, memoryUsedKb: null,
  });
});

/* --------------------------------------------------------------------------
 * API: health
 * ------------------------------------------------------------------------ */
function healthPayload() {
  const ok = !!COMPILER;
  return {
    status: ok ? 'ok' : 'compiler_not_found',
    compiler: COMPILER ? COMPILER.cmd : null,
    compilerVersion: COMPILER ? COMPILER.version : null,
    standard: CONFIG.STANDARD,
    message: ok
      ? 'Compiler service is healthy.'
      : 'No C++ compiler (g++/clang++) found on the system. Install MinGW-w64 or clang and add it to PATH.',
    uptimeSeconds: Math.round(process.uptime()),
    node: process.version,
    maxConcurrent: CONFIG.MAX_CONCURRENT,
    timestamp: new Date().toISOString(),
  };
}
app.get(['/api/health', '/health'], (req, res) => res.json(healthPayload()));
app.get('/api/info', (req, res) => res.json({
  service: BRAND.name + ' compiler backend (Local runtime)',
  runtime: 'local',
  standard: CONFIG.STANDARD,
  limits: {
    maxSourceBytes: CONFIG.MAX_SOURCE_SIZE,
    maxStdinBytes: CONFIG.MAX_STDIN_SIZE,
    compileTimeoutMs: CONFIG.COMPILE_TIMEOUT,
    defaultExecTimeoutMs: CONFIG.EXEC_TIMEOUT,
    maxExecTimeoutMs: CONFIG.MAX_EXEC_TIMEOUT,
    maxOutputBytes: CONFIG.MAX_OUTPUT_SIZE,
  },
  compiler: COMPILER ? COMPILER.cmd : null,
  cacheEnabled: true,
}));

/* --------------------------------------------------------------------------
 * API: run / compile
 * ------------------------------------------------------------------------ */
async function handleRun(req, res) {
  const started = process.hrtime.bigint();
  const body = req.body || {};

  // Accept a few conventional field names so the endpoint is drop-in friendly.
  const sourceCode = body.source_code != null ? body.source_code
    : body.sourceCode != null ? body.sourceCode
      : body.source != null ? body.source : null;
  const stdin = body.stdin != null ? String(body.stdin) : '';
  const rawTimeout = body.timeout != null ? body.timeout
    : body.exec_timeout != null ? body.exec_timeout
      : body.cpu_time_limit != null ? Number(body.cpu_time_limit) * 1000 : CONFIG.EXEC_TIMEOUT;

  if (sourceCode == null || typeof sourceCode !== 'string' || sourceCode.trim() === '') {
    return res.status(400).json({
      status: 'invalid_request', error: 'invalid_request',
      message: 'source_code is required and must be a non-empty string.',
      stdout: '', stderr: '', exitCode: null, memoryUsedKb: null, stage: 'validate',
    });
  }
  if (Buffer.byteLength(sourceCode, 'utf8') > CONFIG.MAX_SOURCE_SIZE) {
    return res.status(400).json({
      status: 'source_too_large', error: 'source_too_large',
      message: `Source code exceeds the ${Math.round(CONFIG.MAX_SOURCE_SIZE / 1024)} KB limit.`,
      stdout: '', stderr: '', exitCode: null, memoryUsedKb: null, stage: 'validate',
    });
  }
  if (Buffer.byteLength(stdin, 'utf8') > CONFIG.MAX_STDIN_SIZE) {
    return res.status(400).json({
      status: 'invalid_request', error: 'invalid_request',
      message: `stdin exceeds the ${Math.round(CONFIG.MAX_STDIN_SIZE / 1024)} KB limit.`,
      stdout: '', stderr: '', exitCode: null, memoryUsedKb: null, stage: 'validate',
    });
  }

  let timeout = parseInt(rawTimeout, 10);
  if (!Number.isFinite(timeout)) timeout = CONFIG.EXEC_TIMEOUT;
  if (timeout < 1000 || timeout > CONFIG.MAX_EXEC_TIMEOUT) {
    return res.status(400).json({
      status: 'invalid_request', error: 'invalid_request',
      message: `timeout must be between 1000 and ${CONFIG.MAX_EXEC_TIMEOUT} ms.`,
      stdout: '', stderr: '', exitCode: null, memoryUsedKb: null, stage: 'validate',
    });
  }

  await acquireSlot();
  let result;
  try {
    await ensureDirs();
    result = await compileAndRun({ sourceCode, stdin, timeout });
  } catch (err) {
    console.error('[run] unexpected error:', err);
    result = {
      status: 'internal_error', error: 'internal_error', stage: 'internal',
      message: 'An unexpected error occurred while compiling or running the program.',
      stdout: '', stderr: err && err.message ? err.message : String(err),
      exitCode: null, compileTimeMs: null, executionTimeMs: null, memoryUsedKb: null,
    };
  } finally {
    releaseSlot();
  }

  result.totalTimeMs = Math.round(Number(process.hrtime.bigint() - started) / 1e6 * 100) / 100;
  const httpStatus = result.error === 'invalid_request' || result.error === 'source_too_large' ? 400 : 200;
  return res.status(httpStatus).json(result);
}

app.post(['/api/run', '/api/compile', '/compile', '/api/execute'], handleRun);

/* --------------------------------------------------------------------------
 * Static frontend + SPA fallback
 * ------------------------------------------------------------------------ */

// The shipped index.html deliberately has no <base> tag so the identical file
// works on a domain root, on a sub-path (GitHub Pages project sites) and from
// file://. When *this* server hosts it, we know the app lives at the root and
// that deep links are rewritten to index.html, so we inject the base tag (making
// relative assets resolve from "/" even at /problems/1001) plus a marker the
// client router uses to enable clean history URLs.
const INDEX_PATH = path.join(ROOT, 'index.html');
let shellCache = { mtimeMs: -1, html: null };

function readShell(cb) {
  fs.stat(INDEX_PATH, (err, st) => {
    const mtimeMs = err ? -1 : st.mtimeMs;
    if (shellCache.html && shellCache.mtimeMs === mtimeMs) return cb(null, shellCache.html);
    fs.readFile(INDEX_PATH, 'utf8', (e, raw) => {
      if (e) return cb(e);
      const inject = '<base href="/">\n    <script>window.CPP_APP_BASE = "/";</script>\n  ';
      const html = raw.indexOf('<head>') !== -1
        ? raw.replace('<head>', '<head>\n  ' + inject)
        : inject + raw;
      shellCache = { mtimeMs, html };
      cb(null, html);
    });
  });
}

const sendIndex = (req, res, next) => {
  readShell((err, html) => {
    if (err) {
      if (next) return next(err);
      return res.status(500).type('text/plain').send('index.html could not be read');
    }
    res.type('html').set('Cache-Control', 'no-cache').send(html);
  });
};
app.get('/', sendIndex);
app.get('/index.html', sendIndex);
app.use('/js', express.static(path.join(ROOT, 'js'), { dotfiles: 'ignore', maxAge: '1h' }));
app.get('/styles.css', (req, res) => res.sendFile(path.join(ROOT, 'styles.css')));
app.get('/robots.txt', (req, res) => res.type('text/plain').send(
  'User-agent: *\n' +
  'Allow: /\n' +
  'Disallow: /api/\n' +
  (BRAND.liveUrl ? 'Sitemap: ' + BRAND.liveUrl.replace(/\/?$/, '/') + 'sitemap.xml\n' : '')
));

// AdSense reads ads.txt from the *domain root*. It is served here for a
// root-mounted deployment; a static host serves the committed ./ads.txt file.
// The line is generated from js/ads.js so it can never disagree with the
// publisher id the page actually uses.
app.get('/ads.txt', (req, res) => {
  const pub = String(ADS.publisherId || '').trim();
  res.type('text/plain');
  if (!/^ca-pub-\d{16}$/.test(pub)) {
    return res.send('# Advertising is not configured on this deployment.\n' +
      '# Set publisherId in js/ads.js, then run `npm run brand:sync`.\n');
  }
  res.send('google.com, ' + pub + ', DIRECT, f08c47fec0942fa0\n');
});

app.get('/sitemap.xml', (req, res, next) => {
  res.sendFile(path.join(ROOT, 'sitemap.xml'), (err) => {
    if (err && !res.headersSent) next();
  });
});

// SPA fallback: any GET that is not /api/* and looks like a page route.
app.get(/^\/(?!api\/).*/, (req, res, next) => {
  if (path.extname(req.path)) return next(); // let real asset misses 404
  sendIndex(req, res);
});

app.use((req, res) => {
  res.status(404).json({ status: 'not_found', error: 'not_found', message: 'Unknown endpoint: ' + req.method + ' ' + req.path });
});

/* --------------------------------------------------------------------------
 * Start
 * ------------------------------------------------------------------------ */
ensureDirs().then(() => {
  app.listen(PORT, HOST, () => {
    console.log('===============================================');
    console.log(BRAND.name + ' — compiler + web server (Local runtime)');
    console.log('===============================================');
    console.log(`Site:      http://localhost:${PORT}/`);
    console.log(`API:       http://localhost:${PORT}/api/health`);
    console.log(`Compiler:  ${COMPILER ? COMPILER.cmd + ' — ' + COMPILER.version : 'NOT FOUND (install g++/clang++)'}`);
    console.log(`Standard:  ${CONFIG.STANDARD}`);
    console.log(`Concurrency: ${CONFIG.MAX_CONCURRENT}   Cache: ${CONFIG.CACHE_DIR}`);
    console.log('===============================================');
  });
});

process.on('SIGINT', () => { console.log('\nShutting down…'); process.exit(0); });

module.exports = app;
