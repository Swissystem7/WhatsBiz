const assert = require('node:assert');
const { assistBSPOnboarding } = require('./assistBSPOnboarding.js');

// Happy path: all four steps done, unique name.
let result = assistBSPOnboarding({
  clinicName: 'Alpha Clinic',
  phone: '050-1234567',
  email: 'alpha@example.com',
  businessCategory: 'medical'
});
assert.strictEqual(result.success, true);
assert.strictEqual(result.steps.length, 4);
assert.strictEqual(result.steps[0].status, 'done');
assert.strictEqual(result.steps[1].status, 'done');
assert.strictEqual(result.steps[2].status, 'done');
assert.strictEqual(result.steps[3].status, 'done');

// Invalid config: null / undefined / array all rejected before destructuring.
for (const bad of [null, undefined, []]) {
  result = assistBSPOnboarding(bad);
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.error, 'Invalid config object');
}

// Missing / invalid clinic name.
for (const name of [undefined, '', '   ', 123]) {
  result = assistBSPOnboarding({ clinicName: name, phone: '050-1234567', email: 'x@example.com', businessCategory: 'medical' });
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.error, 'Missing or invalid clinic name');
  assert.strictEqual(result.steps[0].status, 'error');
  assert.strictEqual(result.steps[0].details, 'Missing or invalid clinic name');
}

// Missing / non-string phone.
for (const ph of [undefined, 123]) {
  result = assistBSPOnboarding({ clinicName: 'Beta', phone: ph, email: 'x@example.com', businessCategory: 'medical' });
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.error, 'Missing phone number');
  assert.strictEqual(result.steps[0].status, 'error');
}

// Invalid phone format: wrong length and wrong prefix.
for (const ph of ['1234567890', '060-1234567']) {
  result = assistBSPOnboarding({ clinicName: 'Beta', phone: ph, email: 'x@example.com', businessCategory: 'medical' });
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.error, 'Invalid phone format');
  assert.strictEqual(result.steps[0].details, 'Phone must be a valid Israeli number (05X-XXXXXXX or +9725X-XXXXXXX)');
}

// Valid +972 international form.
result = assistBSPOnboarding({ clinicName: 'Gamma', phone: '+972501234567', email: 'g@example.com', businessCategory: 'medical' });
assert.strictEqual(result.success, true);

// Missing / invalid email (reported on step 1).
for (const em of [undefined, 123, '', 'no-at-sign.com']) {
  result = assistBSPOnboarding({ clinicName: 'Delta', phone: '050-1234567', email: em, businessCategory: 'medical' });
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.error, 'Missing or invalid email');
  assert.strictEqual(result.steps[1].status, 'error');
  assert.strictEqual(result.steps[1].details, 'Missing or invalid email');
}

// Missing / invalid business category.
for (const cat of [undefined, 'veterinary']) {
  result = assistBSPOnboarding({ clinicName: 'Epsilon', phone: '050-1234567', email: 'e@example.com', businessCategory: cat });
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.error, 'Invalid business category');
  assert.strictEqual(result.steps[1].status, 'error');
  assert.strictEqual(result.steps[1].details, 'Category must be one of: medical, dental, optical');
}

// All three allowed categories accepted (unique names).
result = assistBSPOnboarding({ clinicName: 'Dental One', phone: '052-1234567', email: 'd1@example.com', businessCategory: 'dental' });
assert.strictEqual(result.success, true);
result = assistBSPOnboarding({ clinicName: 'Optical One', phone: '053-1234567', email: 'o1@example.com', businessCategory: 'optical' });
assert.strictEqual(result.success, true);

// Duplicate detection is case-insensitive and persists across calls.
result = assistBSPOnboarding({ clinicName: 'Unique Clinic', phone: '050-1112222', email: 'u1@example.com', businessCategory: 'medical' });
assert.strictEqual(result.success, true);
result = assistBSPOnboarding({ clinicName: 'unique clinic', phone: '050-3334444', email: 'u2@example.com', businessCategory: 'dental' });
assert.strictEqual(result.success, false);
assert.strictEqual(result.error, 'Duplicate clinic name');
assert.strictEqual(result.steps[1].status, 'error');
assert.strictEqual(result.steps[1].details, 'Clinic name already registered');

console.log('ok');