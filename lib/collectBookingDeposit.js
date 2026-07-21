const { randomUUID } = require('crypto');
const depositStore = new Map();

function collectBookingDeposit(bookingConfirmMsg, patientPhone, clinicDepositPolicy) {
  if (typeof bookingConfirmMsg !== 'string' || typeof patientPhone !== 'string') return { success: false, error: 'Invalid input' };
  const normalized = bookingConfirmMsg.normalize('NFC').trim().toLocaleLowerCase();
  const confirmed = /^(?:כן[,.! ]*(?:תקבע|תקבעו|מאשר|מאשרת)|(?:i )?confirm|yes[,.! ]*book(?: it)?|book it)$/.test(normalized);
  if (!confirmed) return { success: false, error: 'Booking confirmation message not recognized' };
  if (!/^05\d{8}$/.test(patientPhone)) return { success: false, error: 'Invalid patient phone number (must be Israeli format)' };
  if (!clinicDepositPolicy || !Number.isFinite(clinicDepositPolicy.amount) || clinicDepositPolicy.amount <= 0 ||
      typeof clinicDepositPolicy.currency !== 'string' || !clinicDepositPolicy.currency.trim() ||
      !Number.isFinite(clinicDepositPolicy.timeLimitMinutes) || clinicDepositPolicy.timeLimitMinutes <= 0) {
    return { success: false, error: 'Clinic deposit policy missing or zero amount' };
  }
  const bookingKey = `${patientPhone}_${normalized}`;
  const existing = depositStore.get(bookingKey);
  if (existing && existing.expiresAt > Date.now()) return { success: false, error: 'Already deposited for this booking', depositId: existing.depositId };
  const startedAt = Date.now();
  const limitMs = clinicDepositPolicy.timeLimitMinutes * 60000;
  const depositId = `dep_${randomUUID()}`;
  const paymentLink = `https://pay.clinic.com/deposit/${encodeURIComponent(depositId)}?amount=${encodeURIComponent(clinicDepositPolicy.amount)}&currency=${encodeURIComponent(clinicDepositPolicy.currency)}`;
  if (Date.now() - startedAt >= limitMs) return { success: false, error: 'Deposit time limit expired' };
  depositStore.set(bookingKey, { depositId, expiresAt: startedAt + limitMs });
  return { success: true, paymentLink, depositId };
}
module.exports = { collectBookingDeposit };
