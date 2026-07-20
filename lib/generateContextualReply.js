function generateContextualReply(clinicProfile, userMessage, conversationHistory) {
  if (!userMessage || userMessage.trim() === '') {
    return { reply: '', confidence: 0 };
  }
  const profanityList = ['זין', 'בן זונה', 'לך תזדיין', 'כוס אמק', 'שיט', 'פאק'];
  const lowerMessage = userMessage.toLowerCase();
  for (let word of profanityList) {
    if (lowerMessage.includes(word)) {
      return { reply: 'אנא נסח את שאלתך בנימוס.', confidence: 0.8 };
    }
  }
  let history = conversationHistory;
  if (history.length > 100) {
    history = history.slice(-50);
  }
  const { name, services, hours, doctors, language } = clinicProfile;
  const hoursStr = hours ? `${hours.open || 'לא צוין'} - ${hours.close || 'לא צוין'}` : 'לא צוין';
  const servicesStr = services && services.length > 0 ? services.join(', ') : 'לא צוין';
  const doctorsStr = doctors && doctors.length > 0 ? doctors.join(', ') : 'לא צוין';
  const faq = [
    { keywords: ['שעות', 'פתוח', 'פתיחה', 'סגור', 'סגירה'], reply: `שעות הפעילות של ${name}: ${hoursStr}.`, confidence: 0.95 },
    { keywords: ['שירות', 'טיפול', 'מטפלים', 'תחום'], reply: `השירותים שאנו מציעים ב${name}: ${servicesStr}.`, confidence: 0.95 },
    { keywords: ['רופא', 'דוקטור', 'מומחה', 'שם רופא'], reply: `הרופאים ב${name}: ${doctorsStr}.`, confidence: 0.95 },
    { keywords: ['כתובת', 'מיקום', 'איפה', 'ממוקם'], reply: `המרפאה ${name} ממוקמת בכתובת: ${clinicProfile.address || 'לא צוין'}.`, confidence: 0.9 },
    { keywords: ['טלפון', 'פלאפון', 'מספר', 'ליצור קשר'], reply: `מספר הטלפון של ${name}: ${clinicProfile.phone || 'לא צוין'}.`, confidence: 0.9 },
    { keywords: ['מחיר', 'עלות', 'כמה עולה', 'תשלום'], reply: `לפרטי מחירים יש לפנות למרפאה ${name} בטלפון: ${clinicProfile.phone || 'לא צוין'}.`, confidence: 0.85 },
    { keywords: ['תור', 'להזמין', 'קביעת', 'פגישה'], reply: `לקביעת תור ב${name}, אנא התקשר ל: ${clinicProfile.phone || 'לא צוין'} או השאר הודעה.`, confidence: 0.85 },
    { keywords: ['ביטוח', 'קופת חולים', 'מבטחים', 'כיסוי'], reply: `אנא בדוק מול קופת החולים שלך או התקשר למרפאה ${name} לפרטי ביטוח.`, confidence: 0.7 },
    { keywords: ['שלום', 'היי', 'בוקר טוב', 'ערב טוב'], reply: `שלום! ברוכים הבאים ל${name}. כיצד אוכל לעזור?`, confidence: 0.9 },
    { keywords: ['תודה', 'תודה רבה', 'תודה לך'], reply: 'בשמחה! אם יש שאלות נוספות, אנא פנה אלי.', confidence: 0.9 },
    { keywords: ['להתראות', 'ביי', 'שלום ולהתראות'], reply: 'תודה שפנית אלינו. יום טוב!', confidence: 0.9 },
  ];
  let bestMatch = null;
  let bestScore = 0;
  for (let item of faq) {
    let score = 0;
    for (let kw of item.keywords) {
      if (lowerMessage.includes(kw)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }
  if (bestMatch && bestScore > 0) {
    return { reply: bestMatch.reply, confidence: bestMatch.confidence };
  }
  return { reply: '?אנא פרט שאלתך', confidence: 0.2 };
}
module.exports = { generateContextualReply };