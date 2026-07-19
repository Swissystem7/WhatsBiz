function maskHebrewPII(inputText) {
  if (typeof inputText !== 'string' || !inputText) return { maskedText: '', detectedEntities: [] };
  const patterns = [
    ['PHONE', /(?:\+972|0)(?:[-\s]?)(?:5\d|[2-9]\d)(?:[-\s]?\d){6,7}/g],
    ['ID', /(?<!\d)\d{9}(?!\d)/g],
    ['ID', /(?<!\d)\d{2,3}-\d{6,7}(?!\d)/g],
    ['ADDRESS', /(?:רחוב|שד["׳']?)\s+[א-ת]+(?:\s+[א-ת]+)*/g]
  ];
  const matches = [];
  for (const [type, regex] of patterns) {
    for (const match of inputText.matchAll(regex)) matches.push({ type, original: match[0], startIndex: match.index });
  }
  matches.sort((a, b) => a.startIndex - b.startIndex || b.original.length - a.original.length);
  const detectedEntities = matches.filter((match, i, all) => !all.slice(0, i).some(used => match.startIndex < used.startIndex + used.original.length));
  let maskedText = inputText;
  for (const entity of [...detectedEntities].reverse()) maskedText = maskedText.slice(0, entity.startIndex) + '[REDACTED]' + maskedText.slice(entity.startIndex + entity.original.length);
  return { maskedText, detectedEntities };
}
module.exports = { maskHebrewPII };
