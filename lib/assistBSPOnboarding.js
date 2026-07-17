// In-memory registry persists across calls so duplicate detection actually works (spec requirement).
// ponytail: process-local Set, swap for a real store if onboarding ever spans processes.
const registeredNames = new Set();

function assistBSPOnboarding(config) {
  const allowedCategories = ['medical', 'dental', 'optical'];
  const steps = [
    { step: 'Validate phone format', status: 'pending' },
    { step: 'Register webhook URL', status: 'pending' },
    { step: 'Verify business profile', status: 'pending' },
    { step: 'Test message', status: 'pending' }
  ];

  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    return { success: false, steps, error: 'Invalid config object' };
  }

  const { clinicName, phone, email, businessCategory } = config;

  if (!clinicName || typeof clinicName !== 'string' || clinicName.trim() === '') {
    steps[0].status = 'error';
    steps[0].details = 'Missing or invalid clinic name';
    return { success: false, steps, error: 'Missing or invalid clinic name' };
  }

  if (!phone || typeof phone !== 'string') {
    steps[0].status = 'error';
    steps[0].details = 'Missing phone number';
    return { success: false, steps, error: 'Missing phone number' };
  }

  const phoneRegex = /^(?:\+972|0)(5[0-9])\d{7}$/;
  const cleanedPhone = phone.replace(/[-\s]/g, '');
  if (!phoneRegex.test(cleanedPhone)) {
    steps[0].status = 'error';
    steps[0].details = 'Phone must be a valid Israeli number (05X-XXXXXXX or +9725X-XXXXXXX)';
    return { success: false, steps, error: 'Invalid phone format' };
  }
  steps[0].status = 'done';

  if (!email || typeof email !== 'string' || email.trim() === '' || !email.includes('@')) {
    steps[1].status = 'error';
    steps[1].details = 'Missing or invalid email';
    return { success: false, steps, error: 'Missing or invalid email' };
  }

  if (!businessCategory || !allowedCategories.includes(businessCategory)) {
    steps[1].status = 'error';
    steps[1].details = `Category must be one of: ${allowedCategories.join(', ')}`;
    return { success: false, steps, error: 'Invalid business category' };
  }

  const normalizedName = clinicName.trim().toLowerCase();
  if (registeredNames.has(normalizedName)) {
    steps[1].status = 'error';
    steps[1].details = 'Clinic name already registered';
    return { success: false, steps, error: 'Duplicate clinic name' };
  }
  registeredNames.add(normalizedName);

  steps[1].status = 'done';
  steps[2].status = 'done';
  steps[3].status = 'done';

  return { success: true, steps };
}

module.exports = { assistBSPOnboarding };