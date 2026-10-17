# CPPractice Lab

A C++ practice website with a **local, secure C++ compiler backend** — no external API dependencies, no GitHub uploads, no Judge0.

## Features

- 💻 **Built-in C++ compiler** — compile and run C++ code directly in the browser via a local backend
- 🔒 **Secure execution** — isolated temp directories, timeouts, source size limits, cleanup after each run
- 📥 **stdin support** — provide input to your programs
- 📤 **Real output panel** — stdout, stderr, exit code, execution time
- 📚 **2000+ problems** across 12 sections with hints (logic + formulas, no code given)
- 🏆 Track progress (mark problems as solved)
- 📱 Mobile friendly, dark theme with neon cyan accents
- 🚀 No external APIs — everything runs locally

## Project Structure

```
cpp-practice-website/
├── index.html          # Frontend HTML (modal with editor, Execute button, output panel)
├── script.js           # Frontend logic (compile/execute calls to backend)
├── style.css           # Styling (black + neon cyan theme, 3D effects)
├── server.js           # Node.js + Express compiler backend
├── package.json        # Node.js dependencies and start script
├── test-compiler.js    # Automated test suite
└── README.md           # This file
```

## Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **A C++ compiler**: `g++` (MinGW on Windows) or `clang++` must be installed and available in your PATH

### Installation

```bash
# Navigate to the project folder
cd cpp-practice-website

# Install Node.js dependencies
npm install

# Start the compiler backend
npm start
```

The backend will start at `http://localhost:3001`.

### Verify Backend

Open a browser or curl:
```bash
curl http://localhost:3001/health
```

Expected response (when g++ is installed):
```json
{
  "status": "ok",
  "compiler": "g++",
  "message": "Compiler service is healthy"
}
```

If no compiler is found:
```json
{
  "status": "compiler_not_found",
  "compiler": null,
  "message": "No C++ compiler (g++/clang++) found on the system..."
}
```

### Running the Website

Open `index.html` directly in your browser, or serve it with any static server.

When you open a problem, you'll see:
1. **Execute button** — prominently placed above the code editor
2. **Code editor** — write your C++ code
3. **stdin panel** — enter program input (if needed)
4. **Output panel** — shows stdout, stderr, exit code, execution time

Click **Execute** to compile and run your code locally.

### Running Tests

```bash
# Make sure the backend is running (npm start)
npm test
```

Tests cover:
1. Health check
2. Hello World (no input)
3. Addition with stdin
4. Loop printing numbers
5. Array usage
6. Syntax error detection
7. Non-zero exit code
8. Empty source code
9. Repeated executions (no stale output)

## Security

All submitted C++ programs are treated as untrusted code:

- Each submission gets an isolated temp directory
- Source code limited to 64 KB
- Compilation timeout: 30 seconds
- Execution timeout: 10 seconds (configurable)
- Process killed on timeout
- Temp files cleaned up after execution
- stdout and stderr captured separately
- No external network API calls

## Backend Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `PORT` | `3001` | Backend server port |
| `HOST` | `0.0.0.0` | Backend bind address |
| `BACKEND_URL` | `window.location.origin + ':3001'` | Frontend-to-backend URL |

## GitHub

Source code is hosted at: https://github.com/ahmadnawaz6611333-star/cpp-practice

The compiler runs on your local backend — GitHub only stores source code, it does not execute submissions.