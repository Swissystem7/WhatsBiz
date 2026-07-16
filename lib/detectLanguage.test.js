'use strict';

const assert = require('node:assert');
const { detectLanguage } = require('./detectLanguage.js');

// Normal cases
assert.strictEqual(detectLanguage('Hello world'), 'en');
assert.strictEqual(detectLanguage('שלום עולם'), 'he');

// Digits/spaces/punct ignored in the denominator
assert.strictEqual(detectLanguage('abc 123 !!!'), 'en');
assert.strictEqual(detectLanguage('שלום, מה קורה? 2026'), 'he');

// No letters at all -> unknown
assert.strictEqual(detectLanguage('12345 !!! ...'), 'unknown');
assert.strictEqual(detectLanguage(''), 'unknown');

// Strict >30% boundary: exactly 30% Hebrew (3 of 10) is NOT 'he'
assert.strictEqual(detectLanguage('שלוabcdefg'), 'en'); // 3 he / 10 = 30% -> latin 70%

// Both exceed 30% -> Hebrew precedence
assert.strictEqual(detectLanguage('שלום Hi'), 'he'); // 4 he / 6, 2 latin / 6 both >30%

// Non-string defensive
assert.strictEqual(detectLanguage(null), 'unknown');
assert.strictEqual(detectLanguage(42), 'unknown');

console.log('all passed');
