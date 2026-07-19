function checkHebrewResponseConfidence(userQuery, aiResponse, faqEntries) {
  if (typeof userQuery !== 'string' || !userQuery.trim() || typeof aiResponse !== 'string' || !aiResponse.trim()) {
    return { confidence: 0, isTrustworthy: false, reason: 'empty input' };
  }
  if (!Array.isArray(faqEntries) || faqEntries.length === 0) {
    return { confidence: 0.5, isTrustworthy: false, reason: 'no reference' };
  }
  const embed = (text) => {
    const words = text.toLowerCase().replace(/[^\u0590-\u05ff\s]/g, '').split(/\s+/).filter(Boolean);
    const freq = {};
    words.forEach(w => freq[w] = (freq[w] || 0) + 1);
    const keys = Object.keys(freq);
    const vec = keys.map(k => freq[k]);
    const norm = Math.sqrt(vec.reduce((s, v) => s + v * v, 0)) || 1;
    return { keys, vec: vec.map(v => v / norm) };
  };
  const cosineSimilarity = (a, b) => {
    const set = new Set([...a.keys, ...b.keys]);
    let dot = 0, na = 0, nb = 0;
    for (const k of set) {
      const va = a.keys.includes(k) ? a.vec[a.keys.indexOf(k)] : 0;
      const vb = b.keys.includes(k) ? b.vec[b.keys.indexOf(k)] : 0;
      dot += va * vb;
      na += va * va;
      nb += vb * vb;
    }
    const denom = Math.sqrt(na) * Math.sqrt(nb);
    return denom === 0 ? 0 : dot / denom;
  };
  const overlap = (response, answer) => {
    const rWords = new Set(response.toLowerCase().replace(/[^\u0590-\u05ff\s]/g, '').split(/\s+/).filter(Boolean));
    const aWords = new Set(answer.toLowerCase().replace(/[^\u0590-\u05ff\s]/g, '').split(/\s+/).filter(Boolean));
    if (aWords.size === 0) return 0;
    let common = 0;
    for (const w of rWords) if (aWords.has(w)) common++;
    return common / aWords.size;
  };
  const queryEmb = embed(userQuery);
  let bestScore = -1;
  let bestAnswer = '';
  for (const faq of faqEntries) {
    if (!faq || typeof faq.question !== 'string' || typeof faq.answer !== 'string') continue;
    const qEmb = embed(faq.question);
    const sim = cosineSimilarity(queryEmb, qEmb);
    if (sim > bestScore) {
      bestScore = sim;
      bestAnswer = faq.answer;
    }
  }
  if (bestScore < 0) return { confidence: 0.5, isTrustworthy: false, reason: 'no reference' };
  if (aiResponse === bestAnswer) {
    return { confidence: 1.0, isTrustworthy: true, reason: 'exact match' };
  }
  const overlapScore = overlap(aiResponse, bestAnswer);
  const confidence = bestScore * 0.5 + overlapScore * 0.5;
  const clamped = Math.min(1, Math.max(0, confidence));
  return {
    confidence: clamped,
    isTrustworthy: clamped >= 0.7,
    reason: clamped >= 0.7 ? 'sufficient confidence' : 'low confidence'
  };
}
module.exports = { checkHebrewResponseConfidence };
