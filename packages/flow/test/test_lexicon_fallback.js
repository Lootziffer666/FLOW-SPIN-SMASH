'use strict';

const assert = require('node:assert/strict');
const { runCorrection } = require('../src/pipeline');

const fallbackCases = [
  ['Bak', 'bank'],
  ['Nes', 'nest'],
  ['Bain', 'bein'],
];

for (const [input, expectedLower] of fallbackCases) {
  const result = runCorrection(input);
  assert.equal(
    String(result.corrected).toLowerCase(),
    expectedLower,
    `Lexikon-Fallback sollte "${input}" -> "${expectedLower}" korrigieren`
  );
  assert.equal(result.applied_learning, 'lexicon');
  assert.ok(Array.isArray(result.applied_stages) && result.applied_stages.includes('LEXICON'));
}

const validWord = runCorrection('Bus');
assert.equal(validWord.corrected, 'Bus', 'Korrektes Wort darf nicht umkorrigiert werden');

console.log('Lexicon fallback tests passed.');
