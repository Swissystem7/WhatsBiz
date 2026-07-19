function validateBookingConsent(messages, lastActionType) {
  if (!['booking', 'order', 'reschedule'].includes(lastActionType) || !Array.isArray(messages) || !messages.length) return { consentGranted: false, nextAction: 'confirm_prompt' };
  const message = messages[messages.length - 1];
  if (typeof message !== 'string') return { consentGranted: false, nextAction: 'confirm_prompt' };
  const confirm = new Set(['כן', 'אשר', 'לאשר', 'בסדר']);
  const reject = new Set(['לא', 'בטל', 'דחה']);
  const keyword = (message.match(/[א-ת]+/g) || []).filter(word => confirm.has(word) || reject.has(word)).pop();
  if (reject.has(keyword)) return { consentGranted: false, nextAction: 'reject' };
  if (lastActionType === 'booking' && confirm.has(keyword)) return { consentGranted: true, nextAction: 'finalize' };
  return { consentGranted: false, nextAction: 'confirm_prompt' };
}
module.exports = { validateBookingConsent };
