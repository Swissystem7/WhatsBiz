'use strict';

const assert = require('assert');
const { scheduleReminders } = require('./scheduleReminders');

// Fixed `now` so every assertion is deterministic.
const now = new Date('2026-07-20T08:00:00Z');

// Booking 50h out: both default reminders (24h + 2h) land in the future.
const start = new Date('2026-07-22T10:00:00Z');
let r = scheduleReminders(start, { now });
assert.strictEqual(r.length, 2, 'two default reminders');
assert.strictEqual(r[0].hoursBefore, 24, 'sorted ascending: 24h reminder is earlier');
assert.strictEqual(r[0].sendAt, '2026-07-21T10:00:00.000Z');
assert.strictEqual(r[1].hoursBefore, 2);
assert.strictEqual(r[1].sendAt, '2026-07-22T08:00:00.000Z');

// Booking only 3h away: the 24h reminder is already in the past -> skipped.
r = scheduleReminders(new Date('2026-07-20T11:00:00Z'), { now });
assert.strictEqual(r.length, 1, 'only the 2h reminder survives');
assert.strictEqual(r[0].hoursBefore, 2);

// Booking 30min away: even the 2h reminder is past -> empty.
assert.deepStrictEqual(
  scheduleReminders(new Date('2026-07-20T08:30:00Z'), { now }), [],
  'no reminders when all offsets are in the past');

// Past booking -> empty.
assert.deepStrictEqual(
  scheduleReminders(new Date('2026-07-19T10:00:00Z'), { now }), [],
  'past booking yields no reminders');

// Invalid inputs -> empty, never throw.
assert.deepStrictEqual(scheduleReminders('not-a-date', { now }), []);
assert.deepStrictEqual(scheduleReminders(null, { now }), []);
assert.deepStrictEqual(scheduleReminders(undefined, { now }), []);

// Custom offsets, and ISO string accepted for the start.
r = scheduleReminders('2026-07-22T10:00:00Z', { now, hoursBefore: [48, 1] });
assert.strictEqual(r.length, 2);
assert.strictEqual(r[0].hoursBefore, 48, '48h reminder sorts first');
assert.strictEqual(r[1].hoursBefore, 1);

// Junk offsets are ignored, not counted.
r = scheduleReminders(start, { now, hoursBefore: [24, -5, 0, 'x'] });
assert.strictEqual(r.length, 1, 'only the valid 24h offset kept');
assert.strictEqual(r[0].hoursBefore, 24);

console.log('scheduleReminders: all assertions passed');
