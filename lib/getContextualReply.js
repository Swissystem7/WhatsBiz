function getContextualReply(message, history, clinicProfile, patientProfile) {
  if (typeof message !== 'string' || message.trim().length === 0) {
    return { reply: "I'm sorry, I didn't receive your message. Could you please try again?", updatedContext: { name: patientProfile?.name, lastTopic: "error" } };
  }
  let truncatedHistory = Array.isArray(history) ? history : [];
  if (truncatedHistory.length > 50) {
    truncatedHistory = truncatedHistory.slice(-10);
  }
  clinicProfile = clinicProfile && typeof clinicProfile === 'object' ? clinicProfile : {};
  const clinicName = typeof clinicProfile.clinicName === 'string' ? clinicProfile.clinicName : 'the clinic';
  const specialties = Array.isArray(clinicProfile.specialties) ? clinicProfile.specialties.filter(s => typeof s === 'string') : [];
  const name = patientProfile?.name || (() => {
    const nameMatch = message.match(/(?:my name is|i am|i'm|call me)\s+([A-Za-z]+)/i);
    return nameMatch ? nameMatch[1] : undefined;
  })() || "there";
  const lastTopic = patientProfile?.lastTopic || "";
  const greeting = truncatedHistory.length === 0 ? `Welcome to ${clinicName}. We specialize in ${specialties.join(", ")}. How can I assist you today?` : "";
  const intents = [];
  if (/\b(hello|hi|hey|greetings)\b/i.test(message)) intents.push({ intent: "greeting", confidence: 0.9 });
  if (/\b(appointment|book|schedule|reschedule|cancel)\b/i.test(message)) intents.push({ intent: "appointment", confidence: 0.8 });
  if (/\b(pain|symptom|hurt|ache|illness|condition)\b/i.test(message)) intents.push({ intent: "symptom", confidence: 0.7 });
  if (/\b(medication|prescription|refill|drug)\b/i.test(message)) intents.push({ intent: "medication", confidence: 0.6 });
  if (/\b(bill|payment|insurance|cost|fee)\b/i.test(message)) intents.push({ intent: "billing", confidence: 0.5 });
  if (/\b(doctor|specialist|physician|provider)\b/i.test(message)) intents.push({ intent: "doctor", confidence: 0.4 });
  if (/\b(thank|thanks|appreciate)\b/i.test(message)) intents.push({ intent: "thanks", confidence: 0.3 });
  if (/\b(bye|goodbye|see you|farewell)\b/i.test(message)) intents.push({ intent: "farewell", confidence: 0.2 });
  if (intents.length === 0) intents.push({ intent: "general", confidence: 0.1 });
  intents.sort((a, b) => b.confidence - a.confidence);
  const topIntent = intents[0].intent;
  let reply = "";
  switch (topIntent) {
    case "greeting":
      reply = greeting || `Hello ${name}! How can I help you today?`;
      break;
    case "appointment":
      reply = `I can help you with appointments. Would you like to book, reschedule, or cancel an appointment at ${clinicName}?`;
      break;
    case "symptom":
      reply = `I understand you're experiencing symptoms. Our specialties include ${specialties.join(", ")}. Could you describe your symptoms in more detail?`;
      break;
    case "medication":
      reply = `For medication-related inquiries, please contact our pharmacy or your prescribing doctor. Is there a specific medication you need help with?`;
      break;
    case "billing":
      reply = `For billing questions, please reach out to our billing department. Would you like me to transfer you or provide contact information?`;
      break;
    case "doctor":
      reply = `We have specialists in ${specialties.join(", ")}. Would you like to know more about a specific doctor?`;
      break;
    case "thanks":
      reply = `You're welcome, ${name}! Is there anything else I can help you with?`;
      break;
    case "farewell":
      reply = `Goodbye, ${name}! Take care and feel free to reach out anytime.`;
      break;
    default:
      reply = greeting || `I'm here to help with appointments, symptoms, medications, billing, or general inquiries. What can I assist you with?`;
  }
  if (lastTopic && topIntent === "general") {
    reply = `Regarding your previous question about ${lastTopic}, ${reply.toLowerCase()}`;
  }
  const updatedContext = { name: name !== "there" ? name : undefined, lastTopic: topIntent };
  return { reply, updatedContext };
}
module.exports = { getContextualReply };
