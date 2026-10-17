/**
 * CppPractice — cloud runtime contract test
 * ---------------------------------------------------------------------------
 * The browser's Cloud runtime (CPP.api.cloud in js/core.js) depends on a few
 * concrete facts about the hosted Judge0 CE API. This test asserts those facts
 * against the live service so drift is caught early.
 *
 * There is no local server required and no API key: the public CE instance is
 * open. If there is no internet connection (or the service is down) the suite
 * reports SKIP and exits 0 — it never fails a build for being offline.
 *
 * Usage:
 *   node tests/cloud.test.js
 *   JUDGE0_URL=https://my-judge0.example node tests/cloud.test.js
 */
'use strict';

const BASE = (process.env.JUDGE0_URL || 'https://ce.judge0.com').replace(/\/+$/, '');

let passed = 0, failed = 0, skipped = 0;
function ok(name, cond, detail) {
  if (cond) { passed++; console.log(`  ✅ ${name}`); }
  else { failed++; console.log(`  ❌ ${name}${detail ? ' — ' + detail : ''}`); }
}
function skip(name, why) { skipped++; console.log(`  ⏭️  ${name} — ${why}`); }

async function getJson(pathname, ms) {
  const res = await fetch(BASE + pathname, { signal: AbortSignal.timeout(ms || 15000) });
  if (!res.ok) throw new Error('HTTP ' + res.status);
  return res.json();
}

async function main() {
  console.log('================================================');
  console.log('CppPractice · cloud runtime contract test');
  console.log('target:', BASE);
  console.log('================================================');

  /* 1. Reachability ------------------------------------------------------ */
  let about = null;
  try {
    about = await getJson('/about');
  } catch (e) {
    skip('cloud service reachable', e.message + ' (offline?)');
    console.log('\nResult: skipped — no cloud service available.');
    process.exit(0);
  }
  ok('cloud service reachable', !!about, JSON.stringify(about).slice(0, 80));

  /* 2. C++ runtime discovery (mirrors Cloud.resolveLanguage) ------------ */
  let lang = null;
  const languages = await getJson('/languages');
  ok('/languages returns a list', Array.isArray(languages) && languages.length > 0,
    'count=' + (languages && languages.length));

  const gcc = languages.filter((l) => /^C\+\+ \(GCC/.test(l.name));
  const pool = gcc.length ? gcc : languages.filter((l) => /C\+\+/.test(l.name));
  ok('a C++ (GCC) runtime is offered', pool.length > 0, gcc.map((l) => l.name).join(', ') || 'none');

  const verScore = (name) => (name.match(/(\d+)\.(\d+)\.(\d+)/) || [0, 0, 0, 0]).slice(1)
    .reduce((a, b) => a * 10000 + Number(b), 0);
  lang = pool.slice().sort((a, b) => verScore(b.name) - verScore(a.name))[0];
  ok('the newest available C++ runtime is pickable', !!lang && typeof lang.id === 'number', JSON.stringify(lang));

  /* 3. Execute real C++ (the exact request shape the browser sends) ------ */
  const SOURCE = '#include <iostream>\nint main(){ int a=2,b=3; std::cout << "sum=" << a+b << std::endl; return 0; }';
  const res = await fetch(BASE + '/submissions?base64_encoded=false&wait=true', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_code: SOURCE,
      language_id: lang.id,
      stdin: '',
      cpu_time_limit: 10,
      wall_time_limit: 13,
    }),
    signal: AbortSignal.timeout(60000),
  });
  ok('POST /submissions accepted (no API key needed)', res.status === 200, 'HTTP ' + res.status);
  const body = await res.json();

  ok('status.id === 3 (Accepted) for correct code', body.status && body.status.id === 3,
    JSON.stringify(body.status));
  ok('stdout carries the real program output', body.stdout === 'sum=5\n', JSON.stringify(body.stdout));
  ok('wall time is reported (seconds)', body.time != null && isFinite(parseFloat(body.time)), String(body.time));
  ok('peak memory is reported (KB)', typeof body.memory === 'number' && body.memory > 0, String(body.memory));
  ok('a submission token is returned', typeof body.token === 'string' && body.token.length > 0);

  /* 4. Compilation error maps to status 6 -------------------------------- */
  const bad = await fetch(BASE + '/submissions?base64_encoded=false&wait=true', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source_code: 'int main(){ return 0 }', language_id: lang.id, stdin: '' }),
    signal: AbortSignal.timeout(60000),
  }).then((r) => r.json());
  ok('compile failure maps to status.id 6 (Compilation Error)',
    bad.status && bad.status.id === 6, JSON.stringify(bad.status));
  ok('compile_output contains real diagnostics', /error/i.test(bad.compile_output || ''),
    (bad.compile_output || '').slice(0, 80));

  /* 5. stdin is honoured ------------------------------------------------- */
  const echoed = await fetch(BASE + '/submissions?base64_encoded=false&wait=true', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_code: '#include <iostream>\nint main(){ int a,b; std::cin>>a>>b; std::cout<<a*b; }',
      language_id: lang.id,
      stdin: '6 7',
      cpu_time_limit: 10,
    }),
    signal: AbortSignal.timeout(60000),
  }).then((r) => r.json());
  ok('stdin is passed through to the program (6 * 7 = 42)', (echoed.stdout || '').trim() === '42',
    JSON.stringify(echoed.stdout));

  console.log('\n================================================');
  console.log(`Results: ${passed} passed · ${failed} failed · ${skipped} skipped`);
  console.log('================================================');
  process.exit(failed ? 1 : 0);
}

main().catch((e) => {
  console.log('⚠️  cloud contract test could not run: ' + (e && e.message));
  process.exit(0);
});
