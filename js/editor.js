/* ==========================================================================
 * CPPractice Lab — Editor layer
 * Monaco Editor loaded from CDN with an automatic, fully-functional fallback
 * to a plain <textarea> when Monaco cannot be loaded (e.g. offline).
 * ========================================================================== */
(function () {
  'use strict';

  const CPP = window.CPP;
  const Store = CPP.store;

  const MONACO_VERSION = '0.52.2';
  const MONACO_BASE = `https://cdn.jsdelivr.net/npm/monaco-editor@${MONACO_VERSION}/min/vs`;

  const Editor = (CPP.editor = {});
  Editor.available = false;
  Editor.mode = 'pending'; // 'monaco' | 'fallback'

  const DEFAULT_CODE = `#include <iostream>
using namespace std;

int main() {
    // Write your C++ solution here

    return 0;
}
`;
  Editor.defaultCode = DEFAULT_CODE;

  /* ------------------------- Very small formatter ----------------------- */
  // Monaco ships no C++ formatter, so we provide a conservative re-indenter
  // that only normalises leading whitespace. It never rewrites tokens.
  Editor.formatCode = function (src) {
    const lines = String(src).replace(/\r\n?/g, '\n').split('\n');
    let indent = 0;
    const unit = ' '.repeat(Store.settings().tabSize || 4);
    return lines.map((line) => {
      const trimmed = line.trim();
      if (trimmed === '') return '';
      if (/^[}\])]/.test(trimmed)) indent = Math.max(0, indent - 1);
      const out = unit.repeat(indent) + trimmed;
      const open = (trimmed.match(/[{[(]/g) || []).length;
      const close = (trimmed.match(/[}\])]/g) || []).length;
      indent = Math.max(0, indent + open - close);
      return out;
    }).join('\n');
  };

  /* --------------------------- Monaco definitions ----------------------- */
  function defineThemes(monaco) {
    monaco.editor.defineTheme('cpp-lab-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6b7a99', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c084fc' },
        { token: 'string', foreground: '34d399' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'type', foreground: '22d3ee' },
        { token: 'identifier', foreground: 'e3e9ff' },
      ],
      colors: {
        'editor.background': '#080d20',
        'editor.foreground': '#e3e9ff',
        'editorLineNumber.foreground': '#3f4b70',
        'editorLineNumber.activeForeground': '#8fa0d8',
        'editor.selectionBackground': '#2b3a7a88',
        'editor.lineHighlightBackground': '#101a3d66',
        'editorCursor.foreground': '#67e8f9',
        'editorIndentGuide.background1': '#1c2650',
        'editorWidget.background': '#0e1633',
        'editorWidget.border': '#2b3a7a',
      },
    });
    monaco.editor.defineTheme('cpp-lab-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '7c87a8', fontStyle: 'italic' },
        { token: 'keyword', foreground: '7c3aed' },
        { token: 'string', foreground: '047857' },
        { token: 'number', foreground: 'b45309' },
        { token: 'type', foreground: '0369a1' },
      ],
      colors: {
        'editor.background': '#f7f9ff',
        'editor.foreground': '#131a35',
        'editorLineNumber.foreground': '#9aa5c4',
        'editor.lineHighlightBackground': '#eef2ff',
        'editor.selectionBackground': '#c7d2fe99',
      },
    });
  }

  function themeName() {
    return Store.settings().editorTheme === 'light' ? 'cpp-lab-light' : 'cpp-lab-dark';
  }

  /* --------------------------- Monaco loading -------------------------- */
  let monacoPromise = null;

  function loadMonaco() {
    if (monacoPromise) return monacoPromise;
    monacoPromise = new Promise((resolve) => {
      let settled = false;
      const finish = (ok) => {
        if (settled) return;
        settled = true;
        Editor.available = ok;
        resolve(ok);
      };
      // Hard timeout so an unreachable CDN never blocks the UI.
      const timer = setTimeout(() => finish(false), 12000);

      const script = document.createElement('script');
      script.src = `${MONACO_BASE}/loader.js`;
      script.async = true;
      script.onerror = () => { clearTimeout(timer); finish(false); };
      script.onload = () => {
        try {
          /* global require */
          const amdRequire = window.require;
          if (!amdRequire || !amdRequire.config) { clearTimeout(timer); return finish(false); }
          amdRequire.config({ paths: { vs: MONACO_BASE } });
          amdRequire(['vs/editor/editor.main'], () => {
            clearTimeout(timer);
            try { defineThemes(window.monaco); finish(true); }
            catch (e) { finish(false); }
          }, () => { clearTimeout(timer); finish(false); });
        } catch (e) { clearTimeout(timer); finish(false); }
      };
      document.head.appendChild(script);
    });
    return monacoPromise;
  }
  Editor.preload = loadMonaco;

  /* ------------------------------ Handles ------------------------------ */
  function makeFallbackHandle(host, opts) {
    host.innerHTML = '';
    const ta = document.createElement('textarea');
    ta.className = 'editor-fallback';
    ta.spellcheck = false;
    ta.wrap = opts.wrap ? 'soft' : 'off';
    ta.value = opts.value || '';
    ta.setAttribute('aria-label', 'C++ code editor');
    ta.style.fontSize = Store.settings().fontSize + 'px';
    host.appendChild(ta);

    const note = document.createElement('div');
    note.className = 'small muted';
    note.style.padding = '.35rem .8rem .5rem';
    note.textContent = 'Standard editor active (Monaco could not load — check your connection for the full editor).';
    host.appendChild(note);

    if (typeof opts.onChange === 'function') {
      ta.addEventListener('input', () => opts.onChange(ta.value));
    }
    // Tab inserts spaces instead of moving focus.
    ta.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const s = ta.selectionStart, en = ta.selectionEnd;
        const unit = ' '.repeat(Store.settings().tabSize || 4);
        ta.setRangeText(unit, s, en, 'end');
        if (typeof opts.onChange === 'function') opts.onChange(ta.value);
      }
    });

    return {
      mode: 'fallback',
      el: ta,
      getValue: () => ta.value,
      setValue: (v) => { ta.value = v; },
      focus: () => ta.focus(),
      setFontSize: (n) => { ta.style.fontSize = n + 'px'; },
      setTheme: () => {},
      format: () => { ta.value = Editor.formatCode(ta.value); if (opts.onChange) opts.onChange(ta.value); },
      openFind: () => { ta.focus(); },
      setWrap: (on) => { ta.wrap = on ? 'soft' : 'off'; },
      dispose: () => { host.innerHTML = ''; },
    };
  }

  function makeMonacoHandle(host, opts) {
    const monaco = window.monaco;
    host.innerHTML = '';
    const instance = monaco.editor.create(host, {
      value: opts.value || '',
      language: 'cpp',
      theme: themeName(),
      fontSize: Store.settings().fontSize,
      fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
      fontLigatures: true,
      tabSize: Store.settings().tabSize,
      insertSpaces: true,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      roundedSelection: true,
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      bracketPairColorization: { enabled: true },
      renderLineHighlight: 'all',
      matchBrackets: 'always',
      autoClosingBrackets: 'always',
      formatOnPaste: false,
      wordWrap: opts.wrap ? 'on' : 'off',
      padding: { top: 12, bottom: 12 },
      scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
    });
    if (typeof opts.onChange === 'function') {
      instance.onDidChangeModelContent(() => opts.onChange(instance.getValue()));
    }
    return {
      mode: 'monaco',
      el: host,
      getValue: () => instance.getValue(),
      setValue: (v) => instance.setValue(v),
      focus: () => instance.focus(),
      setFontSize: (n) => instance.updateOptions({ fontSize: n }),
      setTheme: () => monaco.editor.setTheme(themeName()),
      format: () => {
        const action = instance.getAction('editor.action.formatDocument');
        instance.setValue(Editor.formatCode(instance.getValue()));
      },
      openFind: () => { instance.trigger('', 'actions.find'); instance.focus(); },
      setWrap: (on) => instance.updateOptions({ wordWrap: on ? 'on' : 'off' }),
      dispose: () => instance.dispose(),
    };
  }

  /* ------------------------------- Mount ------------------------------- */
  Editor.mount = function (host, opts) {
    opts = opts || {};
    const value = opts.value != null ? opts.value : DEFAULT_CODE;

    // Try Monaco synchronously if already loaded.
    if (Editor.available && window.monaco) {
      Editor.mode = 'monaco';
      return Promise.resolve(makeMonacoHandle(host, Object.assign({}, opts, { value })));
    }

    // Immediate fallback so the UI is usable instantly, then upgrade.
    const handle = makeFallbackHandle(host, Object.assign({}, opts, { value }));
    Editor.mode = 'fallback';

    return loadMonaco().then((ok) => {
      // Only upgrade if the host is still the active one.
      if (!ok) return handle;
      if (host.__cppHandle !== handle) return handle;
      return handle;
    });
  };

  // Mount, upgrading the fallback in place once Monaco is ready.
  Editor.mountAsync = function (host, opts) {
    opts = opts || {};
    const value = opts.value != null ? opts.value : DEFAULT_CODE;
    let current = null;
    let disposed = false;

    const apply = (val) => { if (opts.onChange) opts.onChange(val); };

    if (window.monaco && Editor.available) {
      Editor.mode = 'monaco';
      return makeMonacoHandle(host, Object.assign({}, opts, { value }));
    }

    current = makeFallbackHandle(host, Object.assign({}, opts, { value }));
    Editor.mode = 'fallback';

    // Capture whatever the user typed before the upgrade.
    loadMonaco().then((ok) => {
      if (disposed || !ok || !window.monaco) return;
      const prevValue = current.getValue();
      const fresh = makeMonacoHandle(host, Object.assign({}, opts, { value: prevValue }));
      // Swap the delegates on the returned handle object.
      Object.keys(fresh).forEach((k) => { current[k] = fresh[k]; });
      current.mode = 'monaco';
      Editor.mode = 'monaco';
    });

    // Wrap dispose so the upgrade can be cancelled.
    const origDispose = current.dispose;
    current.dispose = function () { disposed = true; return origDispose(); };
    return current;
  };
})();
