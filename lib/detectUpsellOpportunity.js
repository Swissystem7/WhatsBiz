const clinicServices = [
  { serviceId: 'S001', serviceName: 'Annual Checkup', keywords: ['בדיקה שנתית', 'בדיקת רופא', "צ'ק אפ", 'בדיקה כללית'] },
  { serviceId: 'S002', serviceName: 'Blood Test Panel', keywords: ['בדיקת דם', 'דם', 'ספירת דם', 'בדיקות דם'] },
  { serviceId: 'S003', serviceName: 'Allergy Medication', keywords: ['אלרגיה', 'תרופה לאלרגיה', 'אנטיהיסטמין', 'כדור אלרגיה'] },
  { serviceId: 'S004', serviceName: 'Physiotherapy Session', keywords: ['פיזיותרפיה', 'טיפול פיזיותרפי', 'פיזיו', 'שיקום'] },
  { serviceId: 'S005', serviceName: 'Dental Cleaning', keywords: ['ניקוי שיניים', 'טיפול שיניים', 'סתימה', 'שן'] },
  { serviceId: 'S006', serviceName: 'Eye Exam', keywords: ['בדיקת עיניים', 'ראייה', 'משקפיים', 'עיניים'] },
  { serviceId: 'S007', serviceName: 'Vaccination', keywords: ['חיסון', 'זריקה', 'חיסונים', 'התחסנות'] },
  { serviceId: 'S008', serviceName: 'Diabetes Management', keywords: ['סוכרת', 'סוכר', 'אינסולין', 'גלוקוז'] },
  { serviceId: 'S009', serviceName: 'Heart Health Check', keywords: ['לב', 'לחץ דם', 'קרדיולוג'] },
  { serviceId: 'S010', serviceName: 'Skin Check', keywords: ['עור', 'שומה', 'נגע', 'דרמטולוג'] }
];

const conflictMap = {
  'Allergy Medication': ['אלרגיה', 'allergy', 'רגישות'],
  'Diabetes Management': ['סוכרת', 'diabetes']
};

function normalize(value) {
  return value.toLocaleLowerCase('he-IL').replace(/[^\u0590-\u05ffa-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

function levenshteinDistance(a, b) {
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let i = 1; i <= a.length; i++) {
    let diagonal = previous[0];
    previous[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const above = previous[j];
      previous[j] = Math.min(previous[j] + 1, previous[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
      diagonal = above;
    }
  }
  return previous[b.length];
}

function fuzzyMatch(text, keywords) {
  if (typeof text !== 'string') return false;
  const normalized = normalize(text);
  if (!normalized) return false;
  const words = normalized.split(' ');
  return keywords.some(keyword => {
    const target = normalize(keyword);
    if (normalized.includes(target)) return true;
    const targetWords = target.split(' ');
    const width = targetWords.length;
    for (let i = 0; i <= words.length - width; i++) {
      const phrase = words.slice(i, i + width).join(' ');
      if (levenshteinDistance(phrase, target) <= Math.max(1, Math.floor(target.length * 0.25))) return true;
    }
    return false;
  });
}

async function detectUpsellOpportunity(conversation, patientProfile) {
  if (!Array.isArray(conversation) || conversation.length === 0) return [];

  const conditions = Array.isArray(patientProfile?.knownConditions)
    ? patientProfile.knownConditions.filter(value => typeof value === 'string').map(normalize)
    : [];
  const results = [];

  for (const service of clinicServices) {
    const patientMessage = conversation.find(message => message?.sender === 'patient' && fuzzyMatch(message.text, service.keywords));
    const clinicMessage = patientMessage ? null : conversation.find(message => message?.sender === 'clinic' && fuzzyMatch(message.text, service.keywords));
    if (!patientMessage && !clinicMessage) continue;

    const conflicts = conflictMap[service.serviceName] || [];
    const hasConflict = conditions.some(condition => conflicts.some(trigger => {
      const normalizedTrigger = normalize(trigger);
      return condition.includes(normalizedTrigger) || normalizedTrigger.includes(condition);
    }));
    if (hasConflict) continue;

    let confidence = clinicMessage ? 0.3 : 0.6;
    if (patientMessage && patientProfile?.hasPastVisits) confidence += 0.2;
    if (patientMessage && Number.isFinite(patientProfile?.age) && patientProfile.age > 50) confidence += 0.1;
    if (patientMessage && !patientProfile) confidence -= 0.15;
    confidence = Math.max(0, Math.min(1, confidence));
    if (confidence < 0.5) continue;

    results.push({
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      confidence: Math.round(confidence * 100) / 100,
      triggerPhrase: patientMessage.text
    });
  }

  return results;
}

module.exports = { detectUpsellOpportunity };
