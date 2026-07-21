function detectAndHandleEscalation(senderId, message, conversationHistory, context) {
  if (typeof message !== 'string' || message.trim().length === 0) {
    return { escalation: false, reason: null, summary: null };
  }
  const hebrewPattern = /[\u0590-\u05FF]/;
  if (!hebrewPattern.test(message)) {
    return { escalation: false, reason: null, summary: null };
  }
  const negativeKeywords = ["מבאס", "לא עובד", "מתוסכל", "נורא", "איום", "כישלון", "מעצבן", "לא בסדר", "חרא", "גרוע"];
  const lowerMessage = message.toLowerCase();
  let count = 0;
  for (const kw of negativeKeywords) {
    let offset = 0;
    while ((offset = lowerMessage.indexOf(kw, offset)) !== -1) { count++; offset += kw.length; }
  }
  if (count >= 2) {
    if (context && context.escalationState && context.escalationState[senderId]) {
      return context.escalationState[senderId];
    }
    const result = {
      escalation: true,
      reason: "multiple_frustration_keywords",
      summary: "User expressed frustration with multiple negative keywords."
    };
    if (context) {
      if (!context.escalationState) context.escalationState = {};
      context.escalationState[senderId] = result;
    }
    return result;
  }
  if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
    const lastThreeUser = [];
    for (let i = conversationHistory.length - 1; i >= 0 && lastThreeUser.length < 3; i--) {
      if (conversationHistory[i].role === 'user') {
        lastThreeUser.unshift(typeof conversationHistory[i].text === 'string' ? conversationHistory[i].text.toLowerCase() : '');
      }
    }
    let historyCount = 0;
    for (const msg of lastThreeUser) {
      for (const kw of negativeKeywords) {
        let offset = 0;
        while ((offset = msg.indexOf(kw, offset)) !== -1) { historyCount++; offset += kw.length; }
      }
    }
    if (historyCount >= 2) {
      if (context && context.escalationState && context.escalationState[senderId]) {
        return context.escalationState[senderId];
      }
      const result = {
        escalation: true,
        reason: "multiple_frustration_keywords_in_history",
        summary: "User expressed frustration in recent messages."
      };
      if (context) {
        if (!context.escalationState) context.escalationState = {};
        context.escalationState[senderId] = result;
      }
      return result;
    }
  }
  return { escalation: false, reason: null, summary: null };
}

module.exports = { detectAndHandleEscalation };
