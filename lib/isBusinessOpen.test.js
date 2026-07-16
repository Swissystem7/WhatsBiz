const assert = require('node:assert');
const { isBusinessOpen } = require('./isBusinessOpen.js');

// Fixed calendar anchors (local time):
// 2026-07-19 = Sunday, 07-20 Mon, ... 07-24 Fri, 07-25 Sat.

// Normal case: Wednesday 12:00 -> open
assert.strictEqual(isBusinessOpen(new Date(2026, 6, 22, 12, 0)), true);

// Sat closed all day
assert.strictEqual(isBusinessOpen(new Date(2026, 6, 25, 11, 0)), false);

// Before opening (08:59) -> closed
assert.strictEqual(isBusinessOpen(new Date(2026, 6, 22, 8, 59)), false);
// Exactly open (09:00) -> open
assert.strictEqual(isBusinessOpen(new Date(2026, 6, 22, 9, 0)), true);
// Exactly close on Sun–Thu (18:00) -> closed
assert.strictEqual(isBusinessOpen(new Date(2026, 6, 22, 18, 0)), false);
// 17:59 Sun–Thu -> open
assert.strictEqual(isBusinessOpen(new Date(2026, 6, 22, 17, 59)), true);

// Friday early close: 12:59 open, 13:00 closed
assert.strictEqual(isBusinessOpen(new Date(2026, 6, 24, 12, 59)), true);
assert.strictEqual(isBusinessOpen(new Date(2026, 6, 24, 13, 0)), false);
// Friday 09:00 open
assert.strictEqual(isBusinessOpen(new Date(2026, 6, 24, 9, 0)), true);

console.log('all tests passed');
