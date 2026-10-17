/**
 * CPPractice Lab - Compiler Test Suite
 * Tests the local C++ compiler backend
 *
 * Run with: node test-compiler.js
 * Prerequisites: Backend server running (npm start), g++ or clang++ installed
 */

const http = require('http');

const BASE_URL = 'http://localhost:3001';

let passed = 0;
let failed = 0;
let total = 0;

function test(name, fn) {
  total++;
  return fn()
    .then(() => {
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    })
    .catch((err) => {
      console.log(`  ❌ FAIL: ${name} — ${err.message}`);
      failed++;
    });
}

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runSuite() {
  console.log('============================================');
  console.log('CPPractice Lab Compiler Test Suite');
  console.log('============================================');
  console.log(`Backend: ${BASE_URL}`);
  console.log('');

  // Test 1: Health check
  await test('Health check returns OK', async () => {
    const res = await request('GET', '/health');
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.body.status) throw new Error('Missing status field');
    console.log(`    Compiler: ${res.body.compiler || 'NOT FOUND'}`);
    console.log(`    Message: ${res.body.message}`);
  });

  // Test 2: Hello World (no input)
  await test('Hello World program', async () => {
    const res = await request('POST', '/compile', {
      source_code: '#include <iostream>\nusing namespace std;\nint main() { cout << "Hello, World!" << endl; return 0; }',
      stdin: '',
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.error !== null) throw new Error(`Expected no error, got: ${res.body.error} — ${res.body.stderr}`);
    if (!res.body.stdout || !res.body.stdout.includes('Hello, World!')) throw new Error('Expected "Hello, World!" in stdout');
    console.log(`    Output: ${res.body.stdout.trim()}`);
    console.log(`    Exit code: ${res.body.exitCode}, Time: ${res.body.executionTimeMs} ms`);
  });

  // Test 3: Addition with stdin
  await test('Addition with stdin (10 + 20 = 30)', async () => {
    const res = await request('POST', '/compile', {
      source_code: '#include <iostream>\nusing namespace std;\nint main() { int a, b; cin >> a >> b; cout << a + b << endl; return 0; }',
      stdin: '10 20',
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.error !== null) throw new Error(`Expected no error, got: ${res.body.error} — ${res.body.stderr}`);
    if (!res.body.stdout || !res.body.stdout.includes('30')) throw new Error('Expected "30" in stdout, got: ' + res.body.stdout);
    console.log(`    Output: ${res.body.stdout.trim()}`);
  });

  // Test 4: Loop printing numbers
  await test('Loop printing 1 to 5', async () => {
    const res = await request('POST', '/compile', {
      source_code: '#include <iostream>\nusing namespace std;\nint main() { for (int i = 1; i <= 5; i++) cout << i << " "; cout << endl; return 0; }',
      stdin: '',
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.error !== null) throw new Error(`Expected no error, got: ${res.body.error}`);
    if (!res.body.stdout || !res.body.stdout.includes('1 2 3 4 5')) throw new Error('Expected "1 2 3 4 5" in stdout');
    console.log(`    Output: ${res.body.stdout.trim()}`);
  });

  // Test 5: Array usage
  await test('Array sum program', async () => {
    const res = await request('POST', '/compile', {
      source_code: '#include <iostream>\nusing namespace std;\nint main() { int arr[5] = {1, 2, 3, 4, 5}; int sum = 0; for (int i = 0; i < 5; i++) sum += arr[i]; cout << sum << endl; return 0; }',
      stdin: '',
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.error !== null) throw new Error(`Expected no error, got: ${res.body.error}`);
    if (!res.body.stdout || !res.body.stdout.includes('15')) throw new Error('Expected "15" in stdout');
    console.log(`    Output: ${res.body.stdout.trim()}`);
  });

  // Test 6: Syntax error
  await test('Syntax error detection', async () => {
    const res = await request('POST', '/compile', {
      source_code: '#include <iostream>\nint main() { cout << "Missing semicolon\nreturn 0; }',
      stdin: '',
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.error !== 'compilation_error') throw new Error(`Expected compilation_error, got: ${res.body.error}`);
    if (!res.body.stderr || res.body.stderr.length === 0) throw new Error('Expected stderr with compiler error');
    console.log(`    Error: ${res.body.stderr.substring(0, 100)}...`);
  });

  // Test 7: Non-zero exit code
  await test('Non-zero exit code', async () => {
    const res = await request('POST', '/compile', {
      source_code: '#include <iostream>\nint main() { return 42; }',
      stdin: '',
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.error !== 'runtime_error') throw new Error(`Expected runtime_error, got: ${res.body.error}`);
    if (res.body.exitCode !== 42) throw new Error(`Expected exit code 42, got: ${res.body.exitCode}`);
    console.log(`    Exit code: ${res.body.exitCode}`);
  });

  // Test 8: Empty source code
  await test('Empty source code', async () => {
    const res = await request('POST', '/compile', {
      source_code: '',
      stdin: '',
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (res.body.error !== 'compilation_error') throw new Error(`Expected compilation_error, got: ${res.body.error}`);
    console.log(`    Error handled correctly: ${res.body.error}`);
  });

  // Test 9: Repeated executions (no stale output)
  await test('Repeated executions produce consistent results', async () => {
    const code = '#include <iostream>\nusing namespace std;\nint main() { cout << 42 << endl; return 0; }';
    const r1 = await request('POST', '/compile', { source_code: code, stdin: '' });
    const r2 = await request('POST', '/compile', { source_code: code, stdin: '' });
    if (r1.body.stdout !== r2.body.stdout) throw new Error('Inconsistent output between runs');
    if (r1.body.stdout.trim() !== '42') throw new Error('Expected "42"');
    console.log(`    Run 1: ${r1.body.stdout.trim()}, Run 2: ${r2.body.stdout.trim()}`);
  });

  // Summary
  console.log('');
  console.log('============================================');
  console.log(`Results: ${passed}/${total} passed, ${failed} failed`);
  console.log('============================================');

  process.exit(failed > 0 ? 1 : 0);
}

runSuite().catch((err) => {
  console.error('Test suite error:', err);
  process.exit(1);
});