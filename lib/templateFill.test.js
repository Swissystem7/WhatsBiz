'use strict';
const assert = require('node:assert');
const { templateFill } = require('./templateFill.js');

// normal: single + multiple + repeated placeholders
assert.strictEqual(templateFill('Hi {{name}}', { name: 'Dan' }), 'Hi Dan');
assert.strictEqual(
  templateFill('{{a}}-{{b}}-{{a}}', { a: 'x', b: 'y' }),
  'x-y-x'
);

// non-string values coerced via String()
assert.strictEqual(templateFill('n={{n}}', { n: 0 }), 'n=0');
assert.strictEqual(templateFill('f={{f}}', { f: false }), 'f=false');
assert.strictEqual(templateFill('z={{z}}', { z: null }), 'z=null');

// unknown key (absent) left literal
assert.strictEqual(templateFill('Hi {{name}}', {}), 'Hi {{name}}');
assert.strictEqual(templateFill('Hi {{name}}', { other: 1 }), 'Hi {{name}}');
// key present but value undefined -> still "known", becomes "undefined"
assert.strictEqual(templateFill('u={{u}}', { u: undefined }), 'u=undefined');

// missing/omitted vars -> everything unknown, left literal
assert.strictEqual(templateFill('Hi {{name}}'), 'Hi {{name}}');
assert.strictEqual(templateFill('plain text', {}), 'plain text');

// non-string template -> ""
assert.strictEqual(templateFill(null, { a: 1 }), '');
assert.strictEqual(templateFill(undefined), '');
assert.strictEqual(templateFill(42, { a: 1 }), '');
assert.strictEqual(templateFill({}, {}), '');

// no placeholders, empty string
assert.strictEqual(templateFill('', { a: 1 }), '');

console.log('all tests passed');
