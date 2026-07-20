function fuzzyHebrewMatcher(userMessage, intentExamples, threshold = 0.6) {
  if (typeof userMessage !== 'string' || userMessage.trim().length === 0 || /^\d+$/.test(userMessage.trim())) return null;
  if (!Array.isArray(intentExamples) || intentExamples.length === 0) return null;
  
  threshold = Number.isFinite(threshold) ? Math.max(0, Math.min(1, threshold)) : 0.6;
  
  let msg = userMessage.trim();
  if (msg.length > 500) msg = msg.slice(0, 500);
  
  const hebrewSynonymMap = {
    'שלום': ['שלום', 'היי', 'הי', 'שלום עליכם'],
    'היי': ['שלום', 'היי', 'הי'],
    'מחיר': ['מחיר', 'עלות', 'כמה עולה', 'מחירון'],
    'עלות': ['מחיר', 'עלות', 'כמה עולה'],
    'שעות': ['שעות', 'זמני', 'פתוח', 'שעות פעילות'],
    'זמני': ['שעות', 'זמני', 'פתוח'],
    'פתוח': ['שעות', 'זמני', 'פתוח', 'פתוחים'],
    'תור': ['תור', 'קביעת תור', 'להזמין תור'],
    'רופא': ['רופא', 'דוקטור', 'רופאה'],
    'טלפון': ['טלפון', 'פלאפון', 'מספר טלפון'],
    'כתובת': ['כתובת', 'מיקום', 'איפה אתם']
  };
  
  const normalizeTokens = (str) => {
    const tokens = str.split(/\s+/);
    const normalized = [];
    for (const token of tokens) {
      let found = false;
      for (const [key, synonyms] of Object.entries(hebrewSynonymMap)) {
        if (synonyms.includes(token)) {
          normalized.push(key);
          found = true;
          break;
        }
      }
      if (!found) normalized.push(token);
    }
    return normalized.join(' ');
  };
  
  const normalizedMsg = normalizeTokens(msg);
  
  const levenshtein = (a, b) => {
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[m][n];
  };
  
  const similarity = (a, b) => {
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1;
    return 1 - levenshtein(a, b) / maxLen;
  };
  
  const intentMap = new Map();
  for (const entry of intentExamples) {
    if (!entry || typeof entry.intent !== 'string' || !Array.isArray(entry.examples)) continue;
    const validExamples = entry.examples.filter(e => typeof e === 'string');
    if (intentMap.has(entry.intent)) {
      intentMap.get(entry.intent).push(...validExamples);
    } else {
      intentMap.set(entry.intent, validExamples);
    }
  }
  
  let bestIntent = null;
  let bestConfidence = 0;
  
  for (const [intent, examples] of intentMap) {
    let maxSim = 0;
    for (const example of examples) {
      const normalizedExample = normalizeTokens(example);
      const sim = similarity(normalizedMsg, normalizedExample);
      if (sim > maxSim) maxSim = sim;
    }
    if (maxSim > bestConfidence) {
      bestConfidence = maxSim;
      bestIntent = intent;
    }
  }
  
  if (bestConfidence >= threshold) {
    return { intent: bestIntent, confidence: bestConfidence };
  }
  
  return null;
}

module.exports = { fuzzyHebrewMatcher };
