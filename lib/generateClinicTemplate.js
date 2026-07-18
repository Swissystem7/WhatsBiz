function generateClinicTemplate(clinicType, clinicName, hours) {
  const validTypes = ['dentist', 'optometrist', 'general', 'psychologist', 'other'];
  if (!validTypes.includes(clinicType)) {
    console.warn('Invalid clinicType, falling back to general');
    clinicType = 'general';
  }
  if (!clinicName || clinicName.trim() === '') {
    clinicName = 'המרפאה שלנו';
  }
  const hoursFallback = 'נא להתקשר לתיאום תור';
  let parsedHours = hoursFallback;
  if (hours && typeof hours === 'string' && hours.trim() !== '') {
    const hoursRegex = /^[\u0590-\u05FF\s\d\-,\']+$/;
    if (hoursRegex.test(hours.trim())) {
      parsedHours = hours.trim();
    }
  }
  const greeting = `ברוכים הבאים ל${clinicName}! שעות הפעילות: ${parsedHours}. כיצד אוכל לעזור?`;
  const dictionary = {
    'תור': 'תור',
    'מחיר': 'מחיר',
    'שעות': 'שעות',
    'כתובת': 'כתובת',
    'טלפון': 'טלפון',
    'ביטול': 'ביטול',
    'התייעצות': 'התייעצות'
  };
  const autoReplies = [
    {
      pattern: new RegExp(dictionary['תור'], 'i'),
      response: `אשמח לקבוע לך תור ב${clinicName}. נא לבחור תאריך ושעה מתאימים.`
    },
    {
      pattern: new RegExp(dictionary['מחיר'], 'i'),
      response: `לפרטי מחירים ב${clinicName}, נא ליצור קשר בטלפון או לבקר באתר.`
    },
    {
      pattern: new RegExp(dictionary['שעות'], 'i'),
      response: `שעות הפעילות של ${clinicName}: ${parsedHours}.`
    },
    {
      pattern: new RegExp(dictionary['כתובת'], 'i'),
      response: `כתובת ${clinicName} זמינה באתר האינטרנט או בפנייה טלפונית.`
    },
    {
      pattern: new RegExp(dictionary['טלפון'], 'i'),
      response: `ניתן ליצור קשר עם ${clinicName} בטלפון: 03-1234567 (להחלפה במספר אמיתי).`
    },
    {
      pattern: new RegExp(dictionary['ביטול'], 'i'),
      response: `לביטול תור ב${clinicName}, נא להודיע לפחות 24 שעות מראש.`
    },
    {
      pattern: new RegExp(dictionary['התייעצות'], 'i'),
      response: `אשמח להפנות אותך לייעוץ מקצועי ב${clinicName}. נא להשאיר פרטים.`
    }
  ];
  const bookingFlow = {
    steps: [
      { prompt: 'נא לבחור שירות', options: ['בדיקה', 'טיפול', 'ייעוץ'] },
      { prompt: 'נא לבחור תאריך', type: 'date' },
      { prompt: 'נא לבחור שעה', type: 'time' },
      { prompt: 'נא לאשר את הפרטים', type: 'confirmation' }
    ],
    confirmationMessage: `התור ב${clinicName} נקבע בהצלחה! נשלח תזכורת.`
  };
  return { greeting, autoReplies, bookingFlow };
}
module.exports = { generateClinicTemplate };