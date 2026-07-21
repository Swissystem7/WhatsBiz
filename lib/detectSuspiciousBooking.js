function detectSuspiciousBooking(sessionData) {
  if (!sessionData || typeof sessionData !== 'object') return { threatScore: 0, flagged: false };
  const { messages, senderPhone, sessionStart } = sessionData;
  if (!messages || messages.length === 0) {
    return { threatScore: 0, flagged: false };
  }
  const validMessages = messages.filter(m => typeof m.timestamp === 'number' && m.timestamp >= 0 && typeof m.text === 'string');
  if (validMessages.length === 0) {
    return { threatScore: 0, flagged: false };
  }
  const now = Math.max(...validMessages.map(m => m.timestamp));
  const start = typeof sessionStart === 'number' && sessionStart >= 0 ? sessionStart : Math.min(...validMessages.map(m => m.timestamp));
  let threatScore = 0;
  const last60s = validMessages.filter(m => now - m.timestamp <= 60000);
  if (last60s.length > 10) {
    threatScore += 40;
  }
  const hebrewSpamRegex = /\b(מבצע|זול|חינם|קנה|כסף|הצטרף|מזויף)\b/i;
  const spamRegex = /(?:^|[^\p{L}])(מבצע|זול|חינם|קנה|כסף|הצטרף|מזויף|mivtsa|zol|hinam|kene|kesef|hitztaref|mezuyaf)(?=$|[^\p{L}])/iu;
  const hasKeyword = validMessages.some(m => spamRegex.test(m.text));
  if (hasKeyword) {
    threatScore += 30;
  }
  const hourFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Jerusalem', hour: 'numeric', hourCycle: 'h23'
  });
  const allTimestamps = validMessages.map(m => m.timestamp);
  const allOffHours = allTimestamps.every(ts => {
    const hours = Number(hourFormatter.format(new Date(ts)));
    return hours >= 2 && hours < 6;
  });
  if (allOffHours) {
    threatScore += 20;
  }
  const textCounts = new Map();
  validMessages.forEach(m => {
    textCounts.set(m.text, (textCounts.get(m.text) || 0) + 1);
  });
  const maxCount = Math.max(...textCounts.values());
  if (maxCount / validMessages.length > 0.6) {
    threatScore += 10;
  }
  const flagged = threatScore >= 70;
  return { threatScore, flagged };
}
module.exports = { detectSuspiciousBooking };
