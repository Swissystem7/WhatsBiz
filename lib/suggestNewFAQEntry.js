function suggestNewFAQEntry(unansweredQuery, existingFAQ) {
  if (typeof unansweredQuery !== 'string' || unansweredQuery.trim().length === 0) return null;
  const cleanedQuery = unansweredQuery.trim().replace(/[^\u0590-\u05FF\s]/g, '');
  if (!cleanedQuery.trim()) return null;
  const queryTokens = cleanedQuery.split(/\s+/).filter(t => t.length > 0);
  if (queryTokens.length < 3) {
    return { suggestedQuestion: cleanedQuery, suggestedAnswer: '' };
  }
  const querySet = new Set(queryTokens);
  let maxSimilarity = 0;
  for (const faq of Array.isArray(existingFAQ) ? existingFAQ : []) {
    if (!faq || typeof faq.question !== 'string') continue;
    const faqTokens = faq.question.split(/\s+/).filter(t => t.length > 0);
    const faqSet = new Set(faqTokens);
    const intersection = new Set([...querySet].filter(t => faqSet.has(t)));
    const union = new Set([...querySet, ...faqSet]);
    const similarity = intersection.size / union.size;
    if (similarity > maxSimilarity) maxSimilarity = similarity;
  }
  if (maxSimilarity >= 0.6) return null;
  return { suggestedQuestion: cleanedQuery, suggestedAnswer: '' };
}
module.exports = { suggestNewFAQEntry };
