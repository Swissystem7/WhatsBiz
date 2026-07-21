function extractFaqSuggestion(conversationHistory, resolutionText, currentFaqRules) {
  if (!Array.isArray(conversationHistory) || conversationHistory.length === 0 || typeof resolutionText !== 'string' || resolutionText.trim().length === 0) {
    return { suggestedRule: null, confidence: 0, reason: 'empty input' };
  }

  const hebrewStopwords = new Set([
    'אני', 'אתה', 'את', 'אנחנו', 'אתם', 'אתן', 'הוא', 'היא', 'הם', 'הן',
    'זה', 'זאת', 'אלה', 'אלו', 'כאן', 'שם', 'עם', 'ללא', 'על', 'אל',
    'את', 'של', 'כי', 'אם', 'אז', 'או', 'אבל', 'גם', 'רק', 'עוד',
    'לא', 'כן', 'היה', 'היתה', 'היו', 'יהיה', 'תהיה', 'להיות',
    'יש', 'אין', 'כל', 'כמה', 'הרבה', 'מעט', 'אחד', 'שתיים', 'שלוש',
    'ארבע', 'חמש', 'ראשון', 'שני', 'שלישי', 'אחר', 'אחרת', 'אחרים',
    'אותו', 'אותה', 'אותם', 'אותן', 'לי', 'לך', 'לו', 'לה', 'לנו',
    'לכם', 'לכן', 'להם', 'להן', 'שלי', 'שלך', 'שלו', 'שלה', 'שלנו',
    'שלכם', 'שלכן', 'שלהם', 'שלהן', 'בתוך', 'מחוץ', 'לפני', 'אחרי',
    'בין', 'דרך', 'ליד', 'אצל', 'עד', 'מ', 'מן', 'ל', 'ב', 'ו', 'ש',
    'ה', 'כ', 'למה', 'מדוע', 'איך', 'מתי', 'איפה', 'לאן', 'מאיפה',
    'מי', 'מה', 'איזה', 'איזו', 'אילו', 'האם', 'נא', 'בבקשה', 'תודה',
    'בסדר', 'אוקיי', 'טוב', 'יפה', 'נכון', 'בדיוק', 'פשוט', 'ממש',
    'קצת', 'הרבה', 'מאוד', 'כבר', 'עדיין', 'שוב', 'תמיד', 'לעולם',
    'אף', 'אפילו', 'רק', 'בכלל', 'דווקא', 'בעצם', 'למעשה', 'בקשר',
    'בשביל', 'בגלל', 'למרות', 'אלא', 'הרי', 'הנה', 'הנו', 'הנם',
    'הנן', 'אולי', 'כנראה', 'בוודאי', 'ודאי', 'בטח', 'חייב', 'צריך',
    'יכול', 'רוצה', 'מקווה', 'מצטער', 'סליחה', 'אנא', 'בבקשה'
  ]);

  const tokenize = (text) => {
    return text.toLowerCase().replace(/[^א-תa-z0-9\s]/g, '').split(/\s+/).filter(t => t.length > 1 && !hebrewStopwords.has(t));
  };

  const userMessages = conversationHistory.filter(msg => msg && msg.role === 'user' && typeof msg.text === 'string').map(msg => msg.text);
  if (userMessages.length === 0) {
    return { suggestedRule: null, confidence: 0, reason: 'no user messages' };
  }

  const allUserTokens = userMessages.flatMap(text => tokenize(text));
  if (allUserTokens.length === 0) {
    return { suggestedRule: null, confidence: 0, reason: 'no significant tokens' };
  }

  const tf = {};
  allUserTokens.forEach(t => { tf[t] = (tf[t] || 0) + 1; });
  const totalDocs = userMessages.length;
  const df = {};
  userMessages.forEach(msg => {
    const uniqueTokens = new Set(tokenize(msg));
    uniqueTokens.forEach(t => { df[t] = (df[t] || 0) + 1; });
  });

  const scores = {};
  Object.keys(tf).forEach(t => {
    const idf = Math.log((totalDocs + 1) / (df[t] + 1)) + 1;
    scores[t] = tf[t] * idf;
  });

  const sortedTokens = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topKeywords = sortedTokens.slice(0, 3).map(entry => entry[0]);
  if (topKeywords.length === 0) {
    return { suggestedRule: null, confidence: 0, reason: 'no key phrases found' };
  }

  const trigger = topKeywords.join(' ');
  const response = resolutionText.length > 100 ? resolutionText.substring(0, 100) : resolutionText;

  const similarity = (str1, str2) => {
    const set1 = new Set(str1.toLowerCase().split(/\s+/));
    const set2 = new Set(str2.toLowerCase().split(/\s+/));
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return union.size === 0 ? 0 : intersection.size / union.size;
  };

  for (const rule of Array.isArray(currentFaqRules) ? currentFaqRules : []) {
    if (!rule || typeof rule.trigger !== 'string' || typeof rule.response !== 'string') continue;
    const triggerSim = similarity(trigger, rule.trigger);
    const responseSim = similarity(response, rule.response);
    if (triggerSim > 0.8 && responseSim > 0.8) {
      return { suggestedRule: null, confidence: 0, reason: 'duplicate' };
    }
  }

  const userQuestionPhrase = userMessages.join(' ').toLowerCase();
  const resolutionLower = resolutionText.toLowerCase();
  const matchCount = topKeywords.filter(k => userQuestionPhrase.includes(k) && resolutionLower.includes(k)).length;
  const confidence = matchCount / topKeywords.length;

  return {
    suggestedRule: { trigger, response },
    confidence: Math.round(confidence * 100) / 100,
    reason: 'new suggestion'
  };
}

module.exports = { extractFaqSuggestion };
