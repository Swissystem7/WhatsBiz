'use strict';

// detectLanguage: 'he'/'en'/'unknown' by share of Hebrew vs Latin LETTERS.
// Letters = Hebrew (֐-׿) or Latin (A-Za-z) only; digits/spaces/punct
// (and other scripts) are ignored in the denominator.
function detectLanguage(text) {
  if (typeof text !== 'string') return 'unknown';
  let he = 0;
  let latin = 0;
  for (const ch of text) {
    if (ch >= '֐' && ch <= '׿') he++;
    else if ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z')) latin++;
  }
  const letters = he + latin;
  if (letters === 0) return 'unknown';
  if (he / letters > 0.3) return 'he'; // Hebrew wins ties when both exceed 30%
  if (latin / letters > 0.3) return 'en';
  return 'unknown';
}

module.exports = { detectLanguage };
