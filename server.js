/**
 * CPPractice Lab - Local C++ Compiler Backend
 * Secure C++ compilation and execution service using Node.js + Express
 *
 * Security model:
 * - Each submission runs in an isolated temp directory
 * - Source code size limit (64 KB)
 * - Compilation timeout (30 seconds)
 * - Execution timeout (configurable, default 10 seconds)
 * - Process killed on timeout
 * - Temp files cleaned up after execution
 * - stderr and stdout captured separately
 * - No external network API dependency
 */

const express = require('express');
const path = require('path');
const os = require('os');
const fs = require('fs');
const fsPromises = fs.promises;
const { execFileSync, spawnSync } = require('child_process');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const CONFIG = {
  // Max source code size in bytes (64 KB)
  MAX_SOURCE_SIZE: 64 * 1024,
  // Compilation timeout in milliseconds
  COMPILE_TIMEOUT: 30000,
  // Default execution timeout in milliseconds
  EXEC_TIMEOUT: 10000,
  // Max output size in bytes (1 MB)
  MAX_OUTPUT_SIZE: 1024 * 1024,
  // Allowed C++ compiler commands (in order of preference)
  COMPILER_CANDIDATES: ['g++', 'clang++', 'c++'],
  // Temp directory base
  TEMP_BASE: path.join(os.tmpdir(), 'cpp-practice-compiler'),
};

// ---------------------------------------------------------------------------
// Helper: Find an available C++ compiler
// ---------------------------------------------------------------------------
function findCompiler() {
  for (const cmd of CONFIG.COMPILER_CANDIDATES) {
    try {
      execFileSync(cmd, ['--version'], {
        timeout: 5000,
        stdio: ['ignore', 'pipe', 'pipe'],
      });
      return cmd;
    } catch (err) {
      // Compiler not found or not executable, try next
      continue;
    }
  }
  return null;
}

const COMPILER = findCompiler();

// ---------------------------------------------------------------------------
// Helper: Generate a unique submission ID
// ---------------------------------------------------------------------------
function generateSubmissionId() {
  return crypto.randomBytes(16).toString('hex');
}

// ---------------------------------------------------------------------------
// Helper: Create isolated temp directory for a submission
// ---------------------------------------------------------------------------
async function createSubmissionDir(submissionId) {
  const dir = path.join(CONFIG.TEMP_BASE, submissionId);
  await fsPromises.mkdir(dir, { recursive: true });
  return dir;
}

// ---------------------------------------------------------------------------
// Helper: Clean up a submission directory
// ---------------------------------------------------------------------------
async function cleanupSubmissionDir(dir) {
  try {
    const entries = await fsPromises.readdir(dir);
    for (const entry of entries) {
      const fullPath = path.join(dir, entry);
      try {
        await fsPromises.unlink(fullPath);
      } catch (e) {
        // Ignore individual file deletion errors
      }
    }
    await fsPromises.rmdir(dir);
  } catch (e) {
    // Ignore cleanup errors
  }
}

// ---------------------------------------------------------------------------
// Helper: Read file with size cap
// ---------------------------------------------------------------------------
async function readFileCapped(filePath, maxBytes) {
  const stat = await fsPromises.stat(filePath);
  if (stat.size > maxBytes) {
    throw new Error(`Output exceeds ${Math.round(maxBytes / 1024)} KB limit`);
  }
  const data = await fsPromises.readFile(filePath, 'utf8');
  return data;
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(express.json({ limit: CONFIG.MAX_SOURCE_SIZE }));

// CORS middleware - allows frontend (even file://) to call backend
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

// ---------------------------------------------------------------------------
// Health check endpoint
// ---------------------------------------------------------------------------
app.get('/health', (req, res) => {
  const compilerAvailable = COMPILER !== null;
  res.json({
    status: compilerAvailable ? 'ok' : 'compiler_not_found',
    compiler: COMPILER || null,
    timestamp: new Date().toISOString(),
    message: compilerAvailable
      ? 'Compiler service is healthy'
      : 'No C++ compiler (g++/clang++) found on system. Install MinGW or clang to enable compilation.',
  });
});

// ---------------------------------------------------------------------------
// Compile and execute endpoint
// ---------------------------------------------------------------------------
app.post('/compile', async (req, res) => {
  let submissionDir = null;
  let submissionId = null;

  try {
    // --- Validate compiler availability ---
    if (!COMPILER) {
      return res.status(503).json({
        error: 'compiler_unavailable',
        message: 'No C++ compiler (g++/clang++) is installed on this server.',
        stdout: null,
        stderr: null,
        exitCode: null,
        executionTimeMs: null,
        memoryUsedKb: null,
      });
    }

    // --- Parse and validate request ---
    const { source_code, stdin = '', timeout = CONFIG.EXEC_TIMEOUT } = req.body;

    if (!source_code || typeof source_code !== 'string') {
      return res.status(400).json({
        error: 'invalid_request',
        message: 'source_code is required and must be a string.',
        stdout: null,
        stderr: null,
        exitCode: null,
        executionTimeMs: null,
        memoryUsedKb: null,
      });
    }

    if (Buffer.byteLength(source_code, 'utf8') > CONFIG.MAX_SOURCE_SIZE) {
      return res.status(400).json({
        error: 'source_too_large',
        message: `Source code exceeds ${Math.round(CONFIG.MAX_SOURCE_SIZE / 1024)} KB limit.`,
        stdout: null,
        stderr: null,
        exitCode: null,
        executionTimeMs: null,
        memoryUsedKb: null,
      });
    }

    const execTimeout = Math.min(parseInt(timeout, 10) || CONFIG.EXEC_TIMEOUT, 60000);
    if (execTimeout < 1000 || execTimeout > 60000) {
      return res.status(400).json({
        error: 'invalid_timeout',
        message: 'timeout must be between 1000 and 60000 milliseconds.',
        stdout: null,
        stderr: null,
        exitCode: null,
        executionTimeMs: null,
        memoryUsedKb: null,
      });
    }

    // --- Create isolated submission directory ---
    submissionId = generateSubmissionId();
    submissionDir = await createSubmissionDir(submissionId);

    const sourceFile = path.join(submissionDir, 'solution.cpp');
    const binaryFile = path.join(submissionDir, 'solution' + (process.platform === 'win32' ? '.exe' : ''));
    const stdinFile = path.join(submissionDir, 'input.txt');
    const stdoutFile = path.join(submissionDir, 'stdout.txt');
    const stderrFile = path.join(submissionDir, 'stderr.txt');

    // --- Write source code and stdin to temp files ---
    await fsPromises.writeFile(sourceFile, source_code, 'utf8');
    await fsPromises.writeFile(stdinFile, stdin, 'utf8');

    // --- Step 1: Compile ---
    const compileStart = process.hrtime.bigint();
    let compileResult;
    try {
      compileResult = execFileSync(COMPILER, [
        '-std=c++17',
        '-O2',
        '-o',
        binaryFile,
        sourceFile,
      ], {
        timeout: CONFIG.COMPILE_TIMEOUT,
        maxBuffer: 1024 * 1024, // 1 MB buffer for compiler errors
      });
    } catch (compileErr) {
      const compileEnd = process.hrtime.bigint();
      const compileTimeMs = Number(compileEnd - compileStart) / 1_000_000;

      // Capture compiler stderr/stdout
      const compileStderr = compileErr.stderr ? compileErr.stderr.toString('utf8') : '';
      const compileStdout = compileErr.stdout ? compileErr.stdout.toString('utf8') : '';

      // Clean up
      await cleanupSubmissionDir(submissionDir);
      submissionDir = null;

      return res.status(200).json({
        error: 'compilation_error',
        message: 'Compilation failed. See stderr for details.',
        stdout: compileStdout || null,
        stderr: compileStderr || 'Unknown compilation error.',
        exitCode: compileErr.status || 1,
        executionTimeMs: compileTimeMs,
        memoryUsedKb: null,
        stage: 'compile',
      });
    }
    const compileEnd = process.hrtime.bigint();
    const compileTimeMs = Number(compileEnd - compileStart) / 1_000_000;

    // --- Step 2: Execute ---
    const execStart = process.hrtime.bigint();

    // Write stdin to a file and redirect it to the process
    // Use spawnSync for better control over timeouts and streams
    let execResult;
    try {
      execResult = spawnSync(binaryFile, [], {
        timeout: execTimeout,
        maxBuffer: CONFIG.MAX_OUTPUT_SIZE,
        encoding: 'utf8',
        input: stdin, // Pass stdin directly
        windowsHide: true,
      });
    } catch (spawnErr) {
      const execEnd = process.hrtime.bigint();
      const execTimeMs = Number(execEnd - execStart) / 1_000_000;
      await cleanupSubmissionDir(submissionDir);
      submissionDir = null;

      return res.status(500).json({
        error: 'execution_failed',
        message: `Failed to start execution: ${spawnErr.message}`,
        stdout: null,
        stderr: spawnErr.message,
        exitCode: null,
        executionTimeMs: execTimeMs,
        memoryUsedKb: null,
        stage: 'execute',
      });
    }

    const execEnd = process.hrtime.bigint();
    const execTimeMs = Number(execEnd - execStart) / 1_000_000;

    // --- Determine result status ---
    let status = 'success';
    let exitCode = execResult.status;
    let stdout = execResult.stdout || '';
    let stderr = execResult.stderr || '';

    if (execResult.error) {
      if (execResult.error.code === 'ETIMEDOUT' || execResult.signal === 'SIGTERM') {
        status = 'time_limit_exceeded';
      } else {
        status = 'runtime_error';
      }
    } else if (exitCode !== 0) {
      status = 'runtime_error';
    }

    // Clean up
    await cleanupSubmissionDir(submissionDir);
    submissionDir = null;

    // Truncate output if too large
    if (Buffer.byteLength(stdout, 'utf8') > CONFIG.MAX_OUTPUT_SIZE) {
      stdout = stdout.slice(0, CONFIG.MAX_OUTPUT_SIZE) + '\n...[output truncated]...';
    }
    if (Buffer.byteLength(stderr, 'utf8') > CONFIG.MAX_OUTPUT_SIZE) {
      stderr = stderr.slice(0, CONFIG.MAX_OUTPUT_SIZE) + '\n...[stderr truncated]...';
    }

    return res.status(200).json({
      error: status === 'success' ? null : status,
      message:
        status === 'success'
          ? 'Run executed successfully'
          : status === 'time_limit_exceeded'
            ? 'Time limit exceeded'
            : status === 'compilation_error'
              ? 'Compilation failed'
              : 'Runtime error',
      stdout: stdout || null,
      stderr: stderr || null,
      exitCode: exitCode ?? null,
      executionTimeMs: Math.round((compileTimeMs + execTimeMs) * 100) / 100,
      memoryUsedKb: null, // Not directly measurable without additional tooling
      stage: status === 'success' ? 'complete' : status,
    });
  } catch (unexpectedErr) {
    // Unexpected error - clean up if needed
    if (submissionDir) {
      await cleanupSubmissionDir(submissionDir);
    }
    console.error(`[${submissionId || 'unknown'}] Unexpected error:`, unexpectedErr);
    return res.status(500).json({
      error: 'internal_error',
      message: 'An unexpected error occurred in the compiler service.',
      stdout: null,
      stderr: unexpectedErr.message,
      exitCode: null,
      executionTimeMs: null,
      memoryUsedKb: null,
      stage: 'internal',
    });
  }
});

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
app.listen(PORT, HOST, () => {
  console.log(`===============================================`);
  console.log(`CPPractice Lab Compiler Service`);
  console.log(`===============================================`);
  console.log(`Server running at http://${HOST}:${PORT}`);
  console.log(`Compiler: ${COMPILER || 'NOT FOUND (install g++ or clang++)'}`);
  console.log(`Temp base: ${CONFIG.TEMP_BASE}`);
  console.log(`Max source size: ${CONFIG.MAX_SOURCE_SIZE} bytes`);
  console.log(`Compile timeout: ${CONFIG.COMPILE_TIMEOUT} ms`);
  console.log(`Default exec timeout: ${CONFIG.EXEC_TIMEOUT} ms`);
  console.log(`===============================================`);
});

module.exports = app;