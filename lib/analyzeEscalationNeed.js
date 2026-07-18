function analyzeEscalationNeed(message, conversationHistory, options) {
  const { vertical, maxEscalationsPerDay } = options;
  const history = conversationHistory || [];
  const urgentWords = ["אמבולנס", "דחוף"];
  const msg = message || "";

  if (urgentWords.some(word => msg.includes(word))) {
    return { shouldEscalate: true, reason: "urgent", summary: msg.slice(0, 200) };
  }

  if (history.length === 0) {
    return { shouldEscalate: false, reason: null, summary: "" };
  }

  const userMessages = history.filter((_, i) => i % 2 === 0);
  const lastUserMessages = userMessages.slice(-4);
  const identicalCount = lastUserMessages.filter(m => m === msg).length;
  if (identicalCount >= 3) {
    return { shouldEscalate: true, reason: "stuck_loop", summary: msg.slice(0, 200) };
  }

  const systemReplies = history.filter((_, i) => i % 2 === 1).slice(-3);
  const summaryParts = systemReplies.concat(msg);
  const summary = summaryParts.join(" | ").slice(0, 200);

  if (maxEscalationsPerDay <= 0) {
    return { shouldEscalate: false, reason: "budget_exhausted", summary: "" };
  }

  return { shouldEscalate: false, reason: null, summary: summary };
}

module.exports = { analyzeEscalationNeed };