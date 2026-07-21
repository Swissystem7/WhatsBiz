function createAuditLog(conversationId, messages) {
  let logEntry = '';
  let redactionsApplied = 0;
  const phoneRegex = /05[0-9]-?[0-9]{7}/g;
  const idRegex = /\b\d{9}\b/g;
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const combinedRegex = new RegExp(`(${phoneRegex.source})|(${idRegex.source})|(${emailRegex.source})`, 'g');
  for (const msg of messages) {
    const original = msg.content;
    const replaced = original.replace(combinedRegex, (match) => {
      redactionsApplied++;
      return '[REDACTED]';
    });
    if (logEntry) logEntry += ',';
    logEntry += JSON.stringify({ role: msg.role, content: replaced, timestamp: msg.timestamp });
  }
  if (logEntry) {
    logEntry = `{"conversationId":${JSON.stringify(conversationId)},"messages":[${logEntry}]}`;
  }
  return { logEntry, redactionsApplied };
}
module.exports = { createAuditLog };
