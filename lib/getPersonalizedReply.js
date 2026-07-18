function getPersonalizedReply(conversationId, incomingMessage, contextStore) {
  const normalizedMessage = String(incomingMessage || '').trim().normalize("NFKC").replace(/[ךםןףץ]/g, c => ({ך:'כ',ם:'מ',ן:'נ',ף:'פ',ץ:'צ'})[c]);
  contextStore = contextStore && typeof contextStore === 'object' ? contextStore : {};
  if (!normalizedMessage) {
    return { reply: "שלום! איך אפשר לעזור לך?", updatedContext: contextStore[conversationId] || { userName: "", step: "", lastBookingRequest: "", history: [] } };
  }
  if (!contextStore[conversationId]) {
    contextStore[conversationId] = { userName: "", step: "", lastBookingRequest: "", history: [] };
  }
  const context = contextStore[conversationId];
  context.history.push(normalizedMessage);
  const offensiveWords = ["זין", "בן זונה", "כוס", "לך תזדיין", "מפגר", "חרא"];
  const isOffensive = offensiveWords.some(word => normalizedMessage.includes(word));
  if (isOffensive) {
    return { reply: "אנא נסח את הבקשה בנימוס, תודה.", updatedContext: context };
  }
  if (context.step === "booking_confirm" && normalizedMessage === "כן") {
    context.step = "";
    context.lastBookingRequest = "";
    return { reply: "ההזמנה אושרה! תודה רבה.", updatedContext: context };
  }
  const nameMatch = normalizedMessage.match(/שמי\s+(\S+)/);
  if (nameMatch) {
    context.userName = nameMatch[1];
  }
  if (normalizedMessage.includes("הזמנה") || normalizedMessage.includes("להזמין")) {
    context.step = "booking_confirm";
    context.lastBookingRequest = normalizedMessage;
    return { reply: `בסדר, ${context.userName || "לקוח יקר"}! האם לאשר את ההזמנה? (כן/לא)`, updatedContext: context };
  }
  if (normalizedMessage.includes("שלום") || normalizedMessage.includes("היי") || normalizedMessage.includes("בוקר טוב") || normalizedMessage.includes("ערב טוב")) {
    return { reply: `שלום ${context.userName || "ולבבי"}! איך אוכל לסייע?`, updatedContext: context };
  }
  if (normalizedMessage.includes("תודה") || normalizedMessage.includes("תודה רבה")) {
    return { reply: "בשמחה! תמיד פה בשבילך.", updatedContext: context };
  }
  if (normalizedMessage.includes("להתראות") || normalizedMessage.includes("ביי")) {
    return { reply: "להתראות! יום טוב.", updatedContext: context };
  }
  return { reply: `מעניין, ${context.userName || "חבר"}! ספר לי עוד על מה חשבת.`, updatedContext: context };
}

module.exports = { getPersonalizedReply };
