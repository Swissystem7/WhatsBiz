function matchClinicFAQ(userMessage, faqDatabase) {
  if (typeof userMessage !== 'string' || userMessage.trim() === '') {
    return { answer: 'אנא כתוב שאלה', confidence: 0, needsHuman: true };
  }
  if (!Array.isArray(faqDatabase) || faqDatabase.length === 0) {
    return { answer: 'אנא כתוב שאלה', confidence: 0, needsHuman: true };
  }
  const stripNiqqud = (s) => s.replace(/[\u0591-\u05C7]/g, '');
  const stripPunctuation = (s) => s.replace(/[^\u0590-\u05FF\s]/g, '');
  const normalize = (s) => stripPunctuation(stripNiqqud(s.trim())).toLowerCase();
  const suffixMap = {
    'ים': '', 'ות': '', 'ה': '', 'י': '', 'ן': '', 'ת': '', 'ך': '', 'ם': '', 'נו': '', 'תי': '', 'תם': '', 'תן': '', 'כם': '', 'כן': '', 'יהם': '', 'יהן': '', 'ינו': '', 'ייך': '', 'יך': '', 'כנו': '', 'כני': '', 'תני': '', 'תנו': '', 'תיה': '', 'תיך': '', 'תיכם': '', 'תיכן': '', 'תינו': '', 'תייך': '', 'תיך': '', 'תיכם': '', 'תיכן': ''
  };
  const stem = (word) => {
    let w = word;
    for (const [suffix, replacement] of Object.entries(suffixMap)) {
      if (w.endsWith(suffix) && w.length > suffix.length + 1) {
        w = w.slice(0, -suffix.length) + replacement;
        break;
      }
    }
    return w;
  };
  const tokenize = (s) => {
    const cleaned = normalize(s);
    return cleaned.split(/\s+/).filter(t => t.length > 0).map(stem);
  };
  const userTokens = tokenize(userMessage);
  if (userTokens.length === 0) {
    return { answer: 'אנא כתוב שאלה', confidence: 0, needsHuman: true };
  }
  const jaccard = (setA, setB) => {
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size === 0 ? 0 : intersection.size / union.size;
  };
  let bestMatch = null;
  let bestScore = -1;
  for (const faq of faqDatabase) {
    if (!faq || typeof faq.question !== 'string' || typeof faq.answer !== 'string' || !Array.isArray(faq.keywords)) continue;
    const keywordTokens = faq.keywords.map(k => stem(normalize(k))).filter(t => t.length > 0);
    const questionTokens = tokenize(faq.question);
    const keywordSet = new Set(keywordTokens);
    const questionSet = new Set(questionTokens);
    const userSet = new Set(userTokens);
    const keywordScore = jaccard(userSet, keywordSet);
    const questionScore = jaccard(userSet, questionSet);
    const combinedScore = Math.max(keywordScore, questionScore);
    if (combinedScore > bestScore) {
      bestScore = combinedScore;
      bestMatch = faq;
    }
  }
  if (!bestMatch) return { answer: 'מצטערים, לא מצאנו תשובה. רוצה לדבר עם נציג?', confidence: 0, needsHuman: true };
  if (bestScore >= 0.6) {
    return { answer: bestMatch.answer, confidence: bestScore, needsHuman: false };
  } else if (bestScore > 0.3) {
    return { answer: bestMatch.answer, confidence: bestScore, needsHuman: true };
  } else {
    return { answer: 'מצטערים, לא מצאנו תשובה. רוצה לדבר עם נציג?', confidence: 0, needsHuman: true };
  }
}
module.exports = { matchClinicFAQ };
