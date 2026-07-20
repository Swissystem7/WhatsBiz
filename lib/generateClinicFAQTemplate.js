function generateClinicFAQTemplate(clinicName, clinicType='clinic') {
  if (typeof clinicName !== 'string' || clinicName.trim() === '') {
    return 'שם המרפאה חסר';
  }
  const validTypes = ['clinic', 'dentist', 'optometrist'];
  if (!validTypes.includes(clinicType)) {
    clinicType = 'clinic';
  }
  const templates = {
    clinic: [
      { question: 'מהם שעות הפעילות של המרפאה?', answer: 'שעות הפעילות של {clinicName} הן בימים א-ה בין 08:00-20:00, וביום ו בין 08:00-14:00.', category: 'מידע כללי' },
      { question: 'כיצד אוכל לקבוע תור?', answer: 'ניתן לקבוע תור ב{clinicName} בטלפון או דרך האתר שלנו.', category: 'תורים' },
      { question: 'האם יש חניה במקום?', answer: 'ב{clinicName} קיימת חניה חינם ללקוחות המרפאה.', category: 'מידע כללי' }
    ],
    dentist: [
      { question: 'מהם שעות הפעילות של מרפאת השיניים?', answer: 'שעות הפעילות של {clinicName} הן בימים א-ה בין 09:00-19:00, וביום ו בין 09:00-13:00.', category: 'מידע כללי' },
      { question: 'כיצד אוכל לקבוע תור לבדיקת שיניים?', answer: 'ניתן לקבוע תור ב{clinicName} בטלפון או דרך האתר, כולל תורי חירום.', category: 'תורים' },
      { question: 'האם יש ביטוח שיניים במרפאה?', answer: 'ב{clinicName} אנו עובדים עם כל קופות החולים ומבטחים פרטיים.', category: 'ביטוח ותשלומים' }
    ],
    optometrist: [
      { question: 'מהם שעות הפעילות של האופטומטריסט?', answer: 'שעות הפעילות של {clinicName} הן בימים א-ה בין 10:00-18:00, וביום ו בין 10:00-14:00.', category: 'מידע כללי' },
      { question: 'כיצד אוכל לקבוע תור לבדיקת ראייה?', answer: 'ניתן לקבוע תור ב{clinicName} בטלפון או דרך האתר, מומלץ להגיע עם משקפיים קיימים.', category: 'תורים' },
      { question: 'האם יש אחריות על משקפיים שנרכשו במרפאה?', answer: 'ב{clinicName} יש אחריות לשנה על מסגרות ועדשות.', category: 'מוצרים ושירותים' }
    ]
  };
  const selected = templates[clinicType];
  return selected.map(item => ({
    question: item.question,
    answer: item.answer.replace(/{clinicName}/g, clinicName),
    category: item.category
  }));
}
module.exports = { generateClinicFAQTemplate };
