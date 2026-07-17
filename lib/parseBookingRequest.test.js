const { parseBookingRequest } = require('./parseBookingRequest.js');
const assert = require('node:assert');

// Normal case: full booking request
const result1 = parseBookingRequest('אני רוצה לקבוע תור לבדיקה בשעה 14:30 ב15 מרץ שמי דוד');
assert.strictEqual(result1.service, 'בדיקה');
assert.strictEqual(result1.time, '14:30');
assert.strictEqual(result1.patientName, 'דוד');
assert.strictEqual(typeof result1.date, 'string');
assert.strictEqual(result1.confidence, 1);

// Normal case: booking with tomorrow
const result2 = parseBookingRequest('לקבוע תור לטיפול מחר בשעה 10:00');
assert.strictEqual(result2.service, 'טיפול');
assert.strictEqual(result2.time, '10:00');
assert.strictEqual(result2.date, new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().slice(0, 10));
assert.strictEqual(result2.patientName, null);
assert.strictEqual(result2.confidence, 0.99);

// Normal case: booking with next week
const result3 = parseBookingRequest('הזמן תור לניקוי בשבוע הבא');
assert.strictEqual(result3.service, 'ניקוי');
assert.strictEqual(result3.date, new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().slice(0, 10));
assert.strictEqual(result3.time, null);
assert.strictEqual(result3.patientName, null);
assert.strictEqual(result3.confidence, 0.66);

// Edge case: null input
assert.strictEqual(parseBookingRequest(null), null);

// Edge case: undefined input
assert.strictEqual(parseBookingRequest(undefined), null);

// Edge case: non-string input
assert.strictEqual(parseBookingRequest(123), null);

// Edge case: empty string
assert.strictEqual(parseBookingRequest(''), null);

// Edge case: no booking intent
assert.strictEqual(parseBookingRequest('שלום מה שלומך'), null);

// Edge case: booking intent but no service match
const result4 = parseBookingRequest('לקבוע תור');
assert.strictEqual(result4.service, null);
assert.strictEqual(result4.date, null);
assert.strictEqual(result4.time, null);
assert.strictEqual(result4.patientName, null);
assert.strictEqual(result4.confidence, 0);

// Edge case: invalid time format
const result5 = parseBookingRequest('קבע תור לטיפול בשעה 25:00');
assert.strictEqual(result5.time, null);
assert.strictEqual(result5.service, 'טיפול');
assert.strictEqual(result5.confidence, 0.33);

// Edge case: invalid day in date
const result6 = parseBookingRequest('תור לבדיקה ב32 ינואר');
assert.strictEqual(result6.date, null);
assert.strictEqual(result6.service, 'בדיקה');
assert.strictEqual(result6.confidence, 0.33);

// Edge case: patient name with multiple words
const result7 = parseBookingRequest('אני רוצה להזמין תור להשתלה שמי יוסי כהן');
assert.strictEqual(result7.service, 'השתלה');
assert.strictEqual(result7.patientName, 'יוסי כהן');
assert.strictEqual(result7.confidence, 0.43);

// Edge case: date in past (should advance to next year)
const pastDate = new Date();
pastDate.setFullYear(pastDate.getFullYear() - 1);
const pastDay = pastDate.getDate();
const pastMonth = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני','יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'][pastDate.getMonth()];
const result8 = parseBookingRequest(`תור לבדיקה ב${pastDay} ${pastMonth}`);
const expectedYear = new Date().getFullYear() + 1;
assert.strictEqual(result8.date, `${expectedYear}-${String(pastDate.getMonth() + 1).padStart(2, '0')}-${String(pastDay).padStart(2, '0')}`);

console.log('ok');