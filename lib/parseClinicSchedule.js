function parseClinicSchedule(scheduleText) {
  if (typeof scheduleText !== 'string' || !scheduleText.trim()) return [];
  const days = new Map([
    ['ראשון', 'sun'], ['א', 'sun'], ['שני', 'mon'], ['ב', 'mon'],
    ['שלישי', 'tue'], ['ג', 'tue'], ['רביעי', 'wed'], ['ד', 'wed'],
    ['חמישי', 'thu'], ['ה', 'thu'], ['שישי', 'fri'], ['ו', 'fri'],
    ['שבת', 'sat'], ['ש', 'sat']
  ]);
  const byDay = new Map();
  for (const segment of scheduleText.split(/[,;\n]+/)) {
    const match = segment.trim().match(/^([^\s'׳״]+)['׳]?\s+(\d{1,2})(?::(\d{2}))?\s*-\s*(\d{1,2})(?::(\d{2}))?(.*)$/u);
    if (!match) continue;
    const day = days.get(match[1]);
    const sh = Number(match[2]), sm = Number(match[3] || 0);
    const eh = Number(match[4]), em = Number(match[5] || 0);
    if (!day || sh > 23 || eh > 23 || sm > 59 || em > 59) continue;
    const start = sh * 60 + sm, end = eh * 60 + em;
    if (start >= end) continue;
    let duration = 60;
    const minutes = match[6].match(/(\d+)\s*דקות/u);
    const hours = match[6].match(/(?:(\d+)\s*)?שע[ה״']/u);
    if (minutes) duration = Number(minutes[1]);
    else if (hours) duration = Number(hours[1] || 1) * 60;
    if (!Number.isInteger(duration) || duration <= 0) continue;
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day).push({ start, end, duration });
  }
  const format = value => `${String(Math.floor(value / 60)).padStart(2, '0')}:${String(value % 60).padStart(2, '0')}`;
  const result = [];
  for (const day of ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']) {
    const slots = (byDay.get(day) || []).sort((a, b) => a.start - b.start);
    const merged = [];
    for (const slot of slots) {
      const current = merged[merged.length - 1];
      if (current && slot.start <= current.end) {
        current.end = Math.max(current.end, slot.end);
        current.duration = Math.min(current.duration, slot.duration);
      } else merged.push({ ...slot });
    }
    for (const slot of merged) result.push({ day, start: format(slot.start), end: format(slot.end), slotDurationMinutes: slot.duration });
  }
  return result;
}
module.exports = { parseClinicSchedule };
