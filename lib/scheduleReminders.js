'use strict';

// WhatsBiz — scheduleReminders
// No-show reminders: given a confirmed booking start time, compute the
// reminder send-times (default 24h + 2h before — the pattern shown across
// 2026 market data to cut no-shows 40-60%). Skips any reminder whose
// send-time already passed relative to `now` (can't send into the past).
// Pure/deterministic: inject `now` for tests. No Math.random.
// Returns [{ hoursBefore, sendAt: ISO }] sorted ascending by sendAt.
// ponytail: fixed offsets + past-skip only. Quiet-hours shifting (don't
// fire a reminder at 03:00) is the upgrade path if SMBs complain about
// timing — pair with isBusinessOpen; not built until the need is real.

function scheduleReminders(bookingStart, opts) {
  const start = bookingStart instanceof Date ? bookingStart : new Date(bookingStart);
  if (isNaN(start.getTime())) return [];

  const o = opts && typeof opts === 'object' ? opts : {};
  const now = o.now instanceof Date ? o.now
    : (o.now != null ? new Date(o.now) : new Date());
  if (isNaN(now.getTime())) return [];

  const offsets = Array.isArray(o.hoursBefore) && o.hoursBefore.length
    ? o.hoursBefore
    : [24, 2];

  const reminders = [];
  for (const h of offsets) {
    const hours = Number(h);
    if (!isFinite(hours) || hours <= 0) continue;
    const sendAt = new Date(start.getTime() - hours * 3600 * 1000);
    if (sendAt.getTime() <= now.getTime()) continue;   // past — can't send
    if (sendAt.getTime() >= start.getTime()) continue; // guard against bad offset
    reminders.push({ hoursBefore: hours, sendAt: sendAt.toISOString() });
  }

  reminders.sort((a, b) => (a.sendAt < b.sendAt ? -1 : a.sendAt > b.sendAt ? 1 : 0));
  return reminders;
}

module.exports = { scheduleReminders };
