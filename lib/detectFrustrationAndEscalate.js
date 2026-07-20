function detectFrustrationAndEscalate(message, conversation, clinicId) {
  const frustrationKeywords = [
    'מתעצבן', 'לא עוזר', 'בבקשה אדם', 'בוט גרוע', 'אני מתוסכל', 'תעביר אותי'
  ];
  const bookingPattern = /(לקבוע|תור|הזמנה|להזמין|מועד|תאריך)/i;
  const faqPattern = /(שאלה|מידע|איך|מה|למה|מתי|איפה|כמה)/i;

  if (typeof message !== 'string' || message.trim().length === 0) {
    return { frustrationScore: 0, shouldEscalate: false, suggestedResponse: 'המשך לשאול, אני פה בשבילך.' };
  }

  let baseScore = 0;
  for (const keyword of frustrationKeywords) {
    const regex = new RegExp(keyword, 'iu');
    if (regex.test(message)) {
      baseScore = 0.8;
      break;
    }
  }

  const customerMessages = (Array.isArray(conversation) ? conversation : [])
    .filter(entry => entry && entry.role === 'customer' && typeof entry.text === 'string')
    .map(entry => entry.text);

  let repeatCount = 0;
  if (customerMessages.length >= 3) {
    const lastThree = customerMessages.slice(-3);
    let intent = null;
    let allSameIntent = true;
    for (const msg of lastThree) {
      let currentIntent = null;
      if (bookingPattern.test(msg)) currentIntent = 'booking';
      else if (faqPattern.test(msg)) currentIntent = 'faq';
      if (intent === null) {
        intent = currentIntent;
      } else if (currentIntent !== intent) {
        allSameIntent = false;
        break;
      }
    }
    if (allSameIntent && intent !== null) {
      repeatCount = 2;
    }
  }

  const frustrationScore = Math.min(1, baseScore + repeatCount * 0.2);
  const shouldEscalate = frustrationScore >= 0.6;
  const suggestedResponse = shouldEscalate
    ? 'נראה שאני מתקשה לעזור. אעביר אותך לנציג אנושי תוך מספר דקות.'
    : 'המשך לשאול, אני פה בשבילך.';

  return { frustrationScore, shouldEscalate, suggestedResponse };
}

module.exports = { detectFrustrationAndEscalate };
