function generateHybridReply(context, userMessage) {
  const blacklist = ['זין', 'בן זונה', 'כוס', 'לך תמות', 'מפגר', 'שמוק', 'חרא', 'טמבל'];
  const bookingKeywords = ['קבוע', 'תור', 'קבע'];
  const pricingKeywords = ['מחיר', 'עולה', 'כמה'];
  const locationKeywords = ['כתובת', 'איפה'];

  if (!userMessage || userMessage.trim() === '') {
    return 'סליחה, לא הצלחתי להבין. אפנה אותך לנציג תוך 5 דקות.';
  }

  const lowerMessage = userMessage.toLowerCase();
  for (const word of blacklist) {
    if (lowerMessage.includes(word)) {
      return 'אנא שמור על שפה מכבדת. אפנה אותך לנציג תוך 5 דקות.';
    }
  }

  const customerName = context.customerName || 'לך';
  const clinicName = context.clinicName || 'המרפאה';

  let intent = 'other';
  for (const keyword of bookingKeywords) {
    if (lowerMessage.includes(keyword)) {
      intent = 'booking';
      break;
    }
  }
  if (intent === 'other') {
    for (const keyword of pricingKeywords) {
      if (lowerMessage.includes(keyword)) {
        intent = 'pricing';
        break;
      }
    }
  }
  if (intent === 'other') {
    for (const keyword of locationKeywords) {
      if (lowerMessage.includes(keyword)) {
        intent = 'location';
        break;
      }
    }
  }

  if (intent === 'booking') {
    return `שלום ${customerName}, תודה שפנית אל ${clinicName}. אשמח לקבוע לך תור. מתי נוח לך?`;
  } else if (intent === 'pricing') {
    return `שלום ${customerName}, תודה שפנית אל ${clinicName}. המחירים משתנים לפי סוג הטיפול. אשמח לפרט לך במייל או בטלפון.`;
  } else if (intent === 'location') {
    return `שלום ${customerName}, הכתובת של ${clinicName} היא: רחוב הראשי 1, תל אביב. נשמח לראותך!`;
  } else {
    return `סליחה, לא הצלחתי להבין. אפנה אותך לנציג תוך 5 דקות.`;
  }
}

module.exports = { generateHybridReply };