/**
 * CPPractice Lab — automated test suite
 * ---------------------------------------------------------------------------
 * Part A: catalogue integrity (no server required)
 * Part B: HTTP API + real C++ compilation/execution (server required)
 *
 * Usage:
 *   npm start          # in one terminal
 *   npm test           # in another
 *
 * The suite exits non-zero if any test fails.
 */
'use strict';

const http = require('http');
const path = require('path');

const BASE = process.env.TEST_BASE_URL || 'http://localhost:3001';

let passed = 0, failed = 0, total = 0;
const failures = [];

function ok(name, cond, detail) {
  total++;
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; failures.push(name); console.log(`  ❌ ${name}${detail ? ' — ' + detail : ''}`); }
}

function request(method, p, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(p, BASE);
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: url.hostname, port: url.port, path: url.pathname + url.search, method,
      headers: data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {},
    }, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(raw); } catch (e) {}
        resolve({ status: res.statusCode, headers: res.headers, body: json, raw });
      });
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

function post(source, stdin, timeout) {
  return request('POST', '/api/run', { source_code: source, stdin: stdin || '', timeout: timeout || 10000 });
}

const rl = () => ' '.repeat(0);

async function partA() {
  console.log('\n=== Part A · catalogue integrity ===');
  const C = require(path.join(__dirname, '..', 'js', 'data.js'));

  ok('catalogue loads', !!C && Array.isArray(C.problems));
  ok(`catalogue has 2040 problems (got ${C.total})`, C.total === 2040);
  ok('12 categories present', C.categories.length === 12);
  ok('every category has 170 problems', C.categories.every((c) => c.count === 170),
    C.categories.filter((c) => c.count !== 170).map((c) => c.key + ':' + c.count).join(','));
  const ids = C.problems.map((p) => p.id);
  ok('problem ids are unique', new Set(ids).size === ids.length);
  ok('ids start at 1', Math.min(...ids) === 1);
  ok('ids run to 2050', Math.max(...ids) === 2050);
  ok('every problem has a title', C.problems.every((p) => typeof p.title === 'string' && p.title.length > 0));
  ok('every problem has a statement', C.problems.every((p) => typeof p.statement === 'string' && p.statement.length > 0));
  ok('every problem has a difficulty', C.problems.every((p) => ['Easy', 'Medium', 'Hard'].includes(p.difficulty)));
  ok('every problem has a hint', C.problems.every((p) => typeof p.hint === 'string' && p.hint.length > 0));
  ok('problem #1 is "Hello World"', C.byId.get(1) && C.byId.get(1).title === 'Hello World');
  ok('problem #1001 exists (deep-link target)', !!C.byId.get(1001));
  ok('byId lookup works for all ids', ids.every((id) => !!C.byId.get(id)));
}

async function partB() {
  console.log('\n=== Part B · HTTP API & real compilation ===');

  // --- health ---
  let health;
  try {
    health = await request('GET', '/api/health');
  } catch (e) {
    ok('backend reachable at ' + BASE, false, e.message + ' — start it with `npm start`');
    return;
  }
  ok('GET /api/health → 200', health.status === 200);
  ok('health reports a compiler', !!health.body.compiler, 'no g++/clang++ found on PATH');
  if (!health.body.compiler) {
    console.log('     Compiler missing — skipping execution tests.');
    return;
  }
  console.log(`     compiler: ${health.body.compiler} (${health.body.compilerVersion})`);
  ok('health reports c++17 standard', health.body.standard === 'c++17');

  // --- static frontend ---
  const index = await request('GET', '/');
  ok('GET / serves index.html', index.status === 200 && /CPPractice Lab/.test(index.raw));
  const deep = await request('GET', '/problems/1001');
  ok('GET /problems/1001 (deep link) serves the SPA shell', deep.status === 200 && /id="app"/.test(deep.raw));
  const css = await request('GET', '/styles.css');
  ok('GET /styles.css → 200', css.status === 200 && /--c-indigo/.test(css.raw));
  const dataJs = await request('GET', '/js/data.js');
  ok('GET /js/data.js → 200', dataJs.status === 200 && /const problems/.test(dataJs.raw));
  const unknownApi = await request('GET', '/api/does-not-exist');
  ok('unknown /api route → 404 JSON', unknownApi.status === 404 && unknownApi.body && unknownApi.body.error === 'not_found');

  // --- hello world ---
  const hello = await post('#include <iostream>\nusing namespace std;\nint main(){ cout << "Hello, World!" << endl; return 0; }');
  ok('hello world compiles & runs', hello.status === 200 && hello.body.error === null && /Hello, World!/.test(hello.body.stdout),
    JSON.stringify(hello.body).slice(0, 160));

  // --- stdin ---
  const add = await post('#include <iostream>\nusing namespace std;\nint main(){ int a,b; cin>>a>>b; cout<<a+b<<endl; return 0; }', '10 20');
  ok('stdin addition (10+20=30)', add.body.error === null && add.body.stdout.trim() === '30', JSON.stringify(add.body.stdout));

  // --- loop ---
  const loop = await post('#include <iostream>\nint main(){ for(int i=1;i<=5;i++) std::cout<<i<<" "; std::cout<<std::endl; return 0; }');
  ok('loop prints 1 2 3 4 5', loop.body.error === null && /1 2 3 4 5/.test(loop.body.stdout));

  // --- multiple test cases via while(cin) ---
  const multi = await post('#include <iostream>\nusing namespace std;\nint main(){ int n; while(cin>>n){ cout<<n*n<<"\\n"; } return 0; }', '2\n3\n4');
  ok('multiple test cases (2,3,4 → 4,9,16)',
    multi.body.error === null && multi.body.stdout.replace(/\s+/g, ' ').trim() === '4 9 16',
    JSON.stringify(multi.body.stdout));

  // --- compile error ---
  const cerr = await post('#include <iostream>\nint main(){ cout << "x"\n return 0; }');
  ok('compilation error detected', cerr.body.error === 'compilation_error' && (cerr.body.stderr || '').length > 0);
  ok('compile-error diagnostics do not leak temp paths', !/cpp-practice-compiler/.test(cerr.body.stderr || ''), (cerr.body.stderr || '').slice(0, 120));

  // --- runtime error ---
  const rerr = await post('#include <iostream>\nint main(){ std::cout << "before\\n"; return 42; }');
  ok('runtime error (exit 42) reported', rerr.body.error === 'runtime_error' && rerr.body.exitCode === 42, JSON.stringify(rerr.body.exitCode));

  // --- time limit exceeded ---
  const tle = await post('#include <iostream>\nint main(){ volatile long long x=0; while(true){ x++; } return 0; }', '', 1000);
  ok('time limit exceeded detected', tle.body.error === 'time_limit_exceeded', tle.body.error);

  // --- empty output is success, not an error ---
  const silent = await post('#include <iostream>\nint main(){ return 0; }');
  ok('empty output is a successful run', silent.body.error === null && silent.body.exitCode === 0 && (silent.body.stdout === '' || silent.body.stdout == null),
    JSON.stringify({ err: silent.body.error, out: silent.body.stdout, code: silent.body.exitCode }));
  ok('empty output is NOT reported as stdout text', String(silent.body.stdout || '') === '', JSON.stringify(silent.body.stdout));

  // --- whitespace-only output ---
  const ws = await post('#include <iostream>\nint main(){ std::cout << "   \\n"; return 0; }');
  ok('whitespace-only output preserved', ws.body.error === null && ws.body.stdout.replace(/\r/g, '') === '   \n', JSON.stringify(ws.body.stdout));

  // --- repeated runs are consistent and cached ---
  const code = '#include <iostream>\nint main(){ std::cout << 42 << std::endl; return 0; }';
  const r1 = await post(code);
  const r2 = await post(code);
  ok('repeated runs are consistent', r1.body.stdout.trim() === '42' && r2.body.stdout.trim() === '42');
  ok('second identical run hits the binary cache', r2.body.cached === true, 'cached=' + r2.body.cached);

  // --- invalid request ---
  const empty = await post('');
  ok('empty source → 400 invalid_request', empty.status === 400 && empty.body.error === 'invalid_request', empty.status + ' ' + empty.body.error);

  // --- metrics ---
  ok('execution time is reported', typeof add.body.executionTimeMs === 'number' && add.body.executionTimeMs >= 0);
  ok('compile time is reported', typeof add.body.compileTimeMs === 'number');
  ok('compiler name echoed in response', add.body.compiler === health.body.compiler);
}

(async function main() {
  console.log('================================================');
  console.log('CPPractice Lab · test suite');
  console.log('================================================');
  await partA();
  await partB();
  console.log('\n================================================');
  console.log(`Results: ${passed}/${total} passed · ${failed} failed`);
  if (failed) console.log('Failed: ' + failures.join(' | '));
  console.log('================================================');
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error('Suite crashed:', e); process.exit(1); });
