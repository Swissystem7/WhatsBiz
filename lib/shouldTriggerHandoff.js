function shouldTriggerHandoff(sessionHistory, threshold = 3) {
  if (!Array.isArray(sessionHistory) || sessionHistory.length === 0) return false;
  if (!Number.isInteger(threshold)) threshold = 3;
  if (threshold <= 0) threshold = 1;
  let count = 0;
  for (let i = sessionHistory.length - 1; i >= 0; i--) {
    const msg = sessionHistory[i];
    if (msg.role === 'bot') break;
    if (msg.role === 'customer') {
      if (msg.answered === false) {
        count++;
        if (count >= threshold) return true;
      } else {
        break;
      }
    }
  }
  return false;
}
module.exports = { shouldTriggerHandoff };
