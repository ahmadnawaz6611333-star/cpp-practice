/**
 * Exports the problem catalogue (js/data.js) to data/problems.json.
 * Useful for tooling, tests and any future static consumers.
 * Run:  npm run generate:data
 */
'use strict';

const fs = require('fs');
const path = require('path');

const CATALOGUE = require('../js/data.js');

const outDir = path.join(__dirname, '..', 'data');
fs.mkdirSync(outDir, { recursive: true });

const payload = {
  generatedAt: new Date().toISOString(),
  total: CATALOGUE.total,
  categories: CATALOGUE.categories.map((c) => ({ key: c.key, label: c.label, count: c.count })),
  problems: CATALOGUE.problems.map((p) => ({
    id: p.id,
    category: p.category,
    title: p.title,
    difficulty: p.difficulty,
    statement: p.statement,
    input: p.input,
    output: p.output,
    hint: p.hint,
  })),
};

const outFile = path.join(outDir, 'problems.json');
fs.writeFileSync(outFile, JSON.stringify(payload, null, 2));
console.log(`Wrote ${payload.total} problems to ${path.relative(process.cwd(), outFile)}`);
