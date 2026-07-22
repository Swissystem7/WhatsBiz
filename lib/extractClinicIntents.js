function extractClinicIntents(faqText) {
  if (!faqText || faqText.trim().length === 0) return [];
  const lines = faqText.split('\n').filter(line => line.trim().length > 0);
  const stopWords = new Set([
    'את', 'הוא', 'היא', 'אני', 'אנחנו', 'אתם', 'אתן', 'הם', 'הן',
    'של', 'על', 'אל', 'עם', 'ל', 'ב', 'מ', 'כ', 'ו', 'ש', 'ה',
    'זה', 'זו', 'אלה', 'אלו', 'כל', 'אם', 'כי', 'אז', 'או', 'לא',
    'גם', 'רק', 'עוד', 'מאוד', 'יותר', 'פחות', 'איך', 'מה', 'למה',
    'איפה', 'מתי', 'מי', 'איזה', 'איזו', 'כמה', 'האם', 'יש', 'אין',
    'היה', 'היתה', 'יהיה', 'תהיה', 'היו', 'להיות', 'עשה', 'עושה',
    'לעשות', 'ניתן', 'יכול', 'יכולה', 'רוצה', 'רוצים', 'צריך', 'צריכה',
    'חייב', 'חייבת', 'אפשר', 'אי אפשר', 'כדאי', 'מומלץ', 'מותר', 'אסור'
  ]);
  const intentMap = new Map();
  const normalizeQuestion = (q) => q.replace(/[^\u0590-\u05FFa-zA-Z0-9\s]/g, '').trim().toLowerCase();
  const extractKeywords = (q) => {
    const cleaned = q.replace(/[^\u0590-\u05FFa-zA-Z\s]/g, '').toLowerCase();
    const words = cleaned.split(/\s+/).filter(w => w.length > 1 && !stopWords.has(w));
    return [...new Set(words)];
  };
  const generateIntent = (keywords) => {
    if (keywords.length === 0) return 'general_inquiry';
    const base = keywords.slice(0, 3).join('_');
    return base.replace(/[^a-zA-Z0-9_\u0590-\u05FF]/g, '').toLowerCase() || 'general_inquiry';
  };
  for (const line of lines) {
    const trimmed = line.trim();
    const delimiterMatch = trimmed.match(/^(.+?)[\?\?]\s*(.+)$/);
    if (!delimiterMatch) continue;
    const question = delimiterMatch[1].trim();
    const answer = delimiterMatch[2].trim();
    if (!question || !answer) continue;
    const normalizedQ = normalizeQuestion(question);
    const keywords = extractKeywords(question);
    if (intentMap.has(normalizedQ)) {
      const existing = intentMap.get(normalizedQ);
      existing.keywords = [...new Set([...existing.keywords, ...keywords])];
    } else {
      const intent = generateIntent(keywords);
      intentMap.set(normalizedQ, { intent, reply: answer, keywords });
    }
  }
  return Array.from(intentMap.values());
}
module.exports = { extractClinicIntents };