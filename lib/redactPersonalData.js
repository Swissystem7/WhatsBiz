function redactPersonalData(text) {
  if (typeof text !== 'string' || text.length === 0) return '';
  const patterns = [
    /(?:^|[^a-zA-Z0-9\u0590-\u05FF@.\-])(\d{9})(?![a-zA-Z0-9\u0590-\u05FF@.\-])/g,
    /(?:^|[^a-zA-Z0-9\u0590-\u05FF@.\-])(\d{3}-\d{6}|\d{2}-\d{3}-\d{2})(?![a-zA-Z0-9\u0590-\u05FF@.\-])/g,
    /(?:^|[^a-zA-Z0-9\u0590-\u05FF@.\-])(\d{2,3}-\d{3,4}-\d{4})(?![a-zA-Z0-9\u0590-\u05FF@.\-])/g,
    /(?:^|[^a-zA-Z0-9\u0590-\u05FF@.\-])(\+9725[0-9]-?\d{3}-?\d{4})(?![a-zA-Z0-9\u0590-\u05FF@.\-])/g,
    /(?:^|[^a-zA-Z0-9\u0590-\u05FF@.\-])(05[0-9]-?\d{3}-?\d{4})(?![a-zA-Z0-9\u0590-\u05FF@.\-])/g,
    /(?:^|[^a-zA-Z0-9\u0590-\u05FF@.\-])(0[2-9][0-9]-?\d{3}-?\d{4})(?![a-zA-Z0-9\u0590-\u05FF@.\-])/g,
    /(?:^|[^a-zA-Z0-9\u0590-\u05FF@.\-])([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?![a-zA-Z0-9\u0590-\u05FF@.\-])/g
  ];
  let result = text;
  for (const pattern of patterns) {
    result = result.replace(pattern, (match, p1, offset, full) => {
      const prefix = match[0] === p1[0] ? '' : match[0];
      return prefix + '[REDACTED]';
    });
  }
  return result;
}
module.exports = { redactPersonalData };
