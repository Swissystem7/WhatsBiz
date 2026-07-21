function scheduleFollowUp(conversationId, lastBotMessage, customerLastResponseTime, noResponseDuration) {
  if (!globalThis.__pendingFollowUps) globalThis.__pendingFollowUps = new Set();
  const pendingFollowUps = globalThis.__pendingFollowUps;
  if (noResponseDuration !== undefined && (!Number.isFinite(noResponseDuration) || noResponseDuration <= 0)) {
    return { followUpNeeded: false, followUpMessage: '', flagForHuman: false };
  }
  const now = new Date();
  const suppliedTime = customerLastResponseTime instanceof Date ? customerLastResponseTime : new Date(customerLastResponseTime);
  if (Number.isNaN(suppliedTime.getTime())) return { followUpNeeded: false, followUpMessage: '', flagForHuman: false };
  const responseTime = suppliedTime > now ? now : suppliedTime;
  const elapsed = (now - responseTime) / 60000;
  const timeout = noResponseDuration === undefined ? 30 : noResponseDuration;
  if (elapsed < timeout) {
    return { followUpNeeded: false, followUpMessage: '', flagForHuman: false };
  }
  if (pendingFollowUps.has(conversationId)) {
    return { followUpNeeded: false, followUpMessage: '', flagForHuman: false };
  }
  pendingFollowUps.add(conversationId);
  let followUpMessage;
  if (!lastBotMessage || lastBotMessage.trim() === '') {
    followUpMessage = 'Hi there! I noticed you stepped away. Would you like to continue where we left off or ask something new?';
  } else {
    followUpMessage = `I noticed you haven't responded. ${lastBotMessage}`;
  }
  return {
    followUpNeeded: true,
    followUpMessage: followUpMessage,
    flagForHuman: elapsed >= timeout * 2
  };
}
module.exports = { scheduleFollowUp };
