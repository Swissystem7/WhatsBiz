function adjustToneWithEmpathy(userMessage, defaultReply) {
  if (typeof userMessage !== 'string') return defaultReply;
  if (!userMessage || userMessage.trim().length === 0) {
    return defaultReply;
  }
  const negativeKeywords = ['כועס', 'מתסכל', 'לא עובד', 'נורא', 'מעצבן', 'בבקשה עזרה'];
  const lowerMessage = userMessage.toLowerCase();
  const hasNegative = negativeKeywords.some(keyword => lowerMessage.includes(keyword));
  if (hasNegative) {
    return 'אני מבין שזה מתסכל, אנסה לעזור לך 🙏' + defaultReply + '😊';
  }
  return defaultReply;
}
module.exports = { adjustToneWithEmpathy };
