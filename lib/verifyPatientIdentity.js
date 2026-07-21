function generateVerificationCode(phone) {
  if (!/^05[0-9]{8}$/.test(phone)) {
    throw new Error("Invalid phone number");
  }
  const codeBytes = require("crypto").randomBytes(3);
  const code = (codeBytes.readUIntBE(0, 3) % 1000000).toString().padStart(6, "0");
  const expiresAt = Date.now() + 5 * 60 * 1000;
  const entry = { code, expiresAt, attempts: 0, lockedUntil: 0 };
  store.set(phone, entry);
  return { code, expiresAt };
}

const store = new Map();

function confirmVerificationCode(phone, code) {
  if (!/^05[0-9]{8}$/.test(phone)) {
    return { verified: false, attemptsRemaining: 3 };
  }
  const entry = store.get(phone);
  if (!entry) {
    return { verified: false, attemptsRemaining: 3 };
  }
  if (Date.now() < entry.lockedUntil) {
    return { verified: false, attemptsRemaining: 0 };
  }
  if (Date.now() > entry.expiresAt) {
    store.delete(phone);
    return { verified: false, attemptsRemaining: 3 };
  }
  if (entry.attempts >= 3) {
    entry.lockedUntil = Date.now() + 10 * 60 * 1000;
    store.set(phone, entry);
    return { verified: false, attemptsRemaining: 0 };
  }
  if (entry.code !== code) {
    entry.attempts++;
    store.set(phone, entry);
    const remaining = Math.max(0, 3 - entry.attempts);
    return { verified: false, attemptsRemaining: remaining };
  }
  store.delete(phone);
  return { verified: true, attemptsRemaining: 3 };
}

function verifyPatientIdentity(phone, code) {
  if (!code) {
    return generateVerificationCode(phone);
  }
  return confirmVerificationCode(phone, code);
}

module.exports = { verifyPatientIdentity };