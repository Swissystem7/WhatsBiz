const { randomBytes } = require('crypto');

function generateReferralCode(clinicId, options = {}) {
  if (!clinicId || typeof clinicId !== 'string') {
    throw new Error('clinicId must be a non-empty string');
  }
  const { prefix, expiresInDays } = options;
  if (prefix !== undefined) {
    if (typeof prefix !== 'string' || !/^[a-zA-Z0-9]{1,3}$/.test(prefix)) {
      throw new Error('prefix must be alphanumeric and ≤3 characters');
    }
  }
  if (expiresInDays !== undefined && (!Number.isFinite(expiresInDays) || expiresInDays <= 0)) {
    throw new Error('expiresInDays must be a positive number');
  }
  const codeLength = prefix ? 6 - prefix.length : 8;
  let code;
  let attempts = 0;
  const maxAttempts = 3;
  const db = globalThis.__referralDb || (globalThis.__referralDb = []);
  const usedCodes = new Set(db.map(entry => entry.code));
  while (attempts < maxAttempts) {
    const randomPart = randomBytes(codeLength).toString('base64url').replace(/[^A-Za-z0-9]/g, '').slice(0, codeLength);
    code = prefix ? prefix + randomPart : randomPart;
    if (!usedCodes.has(code)) {
      usedCodes.add(code);
      break;
    }
    attempts++;
  }
  if (attempts >= maxAttempts) {
    throw new Error('Unable to generate unique referral code after retries');
  }
  const dbEntry = {
    clinicId,
    code,
    createdAt: new Date().toISOString(),
    expiresAt: expiresInDays ? new Date(Date.now() + expiresInDays * 86400000).toISOString() : null
  };
  db.push(dbEntry);
  return code;
}
module.exports = { generateReferralCode };
