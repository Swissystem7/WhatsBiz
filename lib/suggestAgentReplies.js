function suggestAgentReplies(conversationHistory, clinicProfile) {
  const specialty = (clinicProfile && clinicProfile.specialty) || 'general';
  const services = clinicProfile && Array.isArray(clinicProfile.services) ? clinicProfile.services.filter(s => typeof s === 'string') : [];
  const language = (clinicProfile && clinicProfile.language) || 'he';

  const phraseLibrary = {
    general: [
      'איך אוכל לקבוע תור?',
      'האם תוכל לפרט יותר?',
      'אשמח לעזור לך בהמשך'
    ],
    dentistry: [
      'מתי מתאים לך להגיע לבדיקה?',
      'האם יש כאב או רגישות?',
      'אפשר לקבוע תור לניקוי שיניים'
    ],
    dermatology: [
      'האם יש פריחה או גירוד?',
      'מתי הופיע הנגע?',
      'כדאי לקבוע תור לבדיקה'
    ],
    pediatrics: [
      'מה גיל הילד?',
      'האם יש חום?',
      'כדאי להגיע לבדיקה בהקדם'
    ],
    orthopedics: [
      'איפה הכאב ממוקם?',
      'האם יש נפיחות?',
      'כדאי לצלם רנטגן'
    ]
  };

  if (!Array.isArray(conversationHistory) || conversationHistory.length === 0) {
    return ['שלום, איך אוכל לעזור?', 'ברוכים הבאים, כיצד אוכל לסייע?', 'אשמח לעזור לך'];
  }

  const lastUserMessage = conversationHistory.slice(-5).filter(msg => msg && msg.role === 'user' && typeof msg.content === 'string').pop();
  if (!lastUserMessage) {
    return ['אודה לך לפרט יותר', 'האם תוכל להסביר שוב?'];
  }

  const userText = lastUserMessage.content.toLowerCase();
  const library = phraseLibrary[specialty] || phraseLibrary.general;

  const matched = library.filter(phrase => {
    const keywords = phrase.split(' ').map(w => w.replace(/[?]/g, '').toLowerCase());
    return keywords.some(kw => userText.includes(kw));
  });

  if (matched.length > 0) {
    return matched.slice(0, 3);
  }

  if (services.length > 0) {
    const serviceMatch = services.filter(s => userText.includes(s.toLowerCase()));
    if (serviceMatch.length > 0) {
      return [`אפשר לקבוע תור ל${serviceMatch[0]}`, 'מתי נוח לך להגיע?', 'אשמח לסייע בקביעת תור'];
    }
  }

  return ['אודה לך לפרט יותר', 'האם תוכל להסביר שוב?'];
}

module.exports = { suggestAgentReplies };
