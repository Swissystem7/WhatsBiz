const { randomBytes } = require('crypto');
const usedDiscountCodes = new Set();

function scheduleAbandonedInquiryFollowUp(inquiryMessage, patientId, clinicDiscountRules, lastInteractionTime) {
  if (typeof inquiryMessage !== 'string' || typeof patientId !== 'string' || !Array.isArray(clinicDiscountRules) ||
      !(lastInteractionTime instanceof Date) || Number.isNaN(lastInteractionTime.getTime())) throw new TypeError('Invalid input');
  const empty = () => ({ followUpMessages: [], analytics: { patientId, scheduledCount: 0 } });
  if (lastInteractionTime > new Date()) return empty();
  const optedOut = globalThis.blacklistedPatientIds instanceof Set ? globalThis.blacklistedPatientIds : new Set();
  if (optedOut.has(patientId)) return empty();
  const booked = globalThis.bookedPatientIds instanceof Set ? globalThis.bookedPatientIds : new Set();
  if (booked.has(patientId)) return empty();
  const rule = clinicDiscountRules.find(item => item && typeof item.serviceId === 'string' && inquiryMessage.includes(item.serviceId));
  if (!rule || !Number.isFinite(rule.discountPercent) || !Number.isFinite(rule.validHours) || rule.maxUses <= 0) return empty();
  let discountCode;
  do { discountCode = `DISC${randomBytes(5).toString('hex').toUpperCase()}`; } while (usedDiscountCodes.has(discountCode));
  usedDiscountCodes.add(discountCode);
  const followUpMessages = [
    { delayMinutes: 30, messageTemplate: `שלום, שמנו לב שפנית אלינו בנוגע ל${rule.serviceId}. אנו מציעים לך ${rule.discountPercent}% הנחה. קוד: ${discountCode}`, discountCode },
    { delayMinutes: 120, messageTemplate: `תזכורת: ההנחה שלך בתוקף ל${rule.validHours} שעות. קוד: ${discountCode}`, discountCode }
  ];
  return { followUpMessages, analytics: { patientId, scheduledCount: followUpMessages.length } };
}
module.exports = { scheduleAbandonedInquiryFollowUp };
