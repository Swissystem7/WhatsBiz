function parseBookingRequest(message) {
  if (!message || typeof message !== 'string') return null;
  const lower = message.toLowerCase();
  const bookingKeywords = ['תור', 'לקבוע', 'להזמין', 'קבע', 'הזמן'];
  const hasBookingIntent = bookingKeywords.some(kw => lower.includes(kw));
  if (!hasBookingIntent) return null;

  const services = ['טיפול', 'ניקוי', 'בדיקה', 'השתלה'];
  let service = null;
  for (const s of services) {
    const regex = new RegExp(`תור ל${s}`, 'i');
    if (regex.test(message)) {
      service = s;
      break;
    }
  }

  const monthMap = {
    'ינואר': '01', 'פברואר': '02', 'מרץ': '03', 'אפריל': '04',
    'מאי': '05', 'יוני': '06', 'יולי': '07', 'אוגוסט': '08',
    'ספטמבר': '09', 'אוקטובר': '10', 'נובמבר': '11', 'דצמבר': '12'
  };
  let date = null;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);

  if (/מחר/i.test(message)) {
    date = tomorrow.toISOString().slice(0, 10);
  } else if (/בשבוע הבא/i.test(message)) {
    date = nextWeek.toISOString().slice(0, 10);
  } else {
    const dayMonthRegex = /ב(\d{1,2})\s*(ינואר|פברואר|מרץ|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר)/i;
    const match = message.match(dayMonthRegex);
    if (match) {
      const day = parseInt(match[1], 10);
      const month = monthMap[match[2]];
      if (day >= 1 && day <= 31 && month) {
        const year = today.getFullYear();
        const parsedDate = new Date(`${year}-${month}-${day}`);
        if (parsedDate < today) {
          parsedDate.setFullYear(year + 1);
        }
        date = parsedDate.toISOString().slice(0, 10);
      }
    }
  }

  let time = null;
  const timeRegex = /בשעה\s*(\d{1,2}:\d{2})/i;
  const timeMatch = message.match(timeRegex);
  if (timeMatch) {
    const [hours, minutes] = timeMatch[1].split(':').map(Number);
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
  }

  let patientName = null;
  const nameRegex = /שמי\s+([א-ת\s]+)/i;
  const nameMatch = message.match(nameRegex);
  if (nameMatch) {
    const name = nameMatch[1].trim();
    if (name.length > 0) patientName = name;
  }

  let confidence = 0;
  if (service) confidence += 0.33;
  if (date) confidence += 0.33;
  if (time) confidence += 0.33;
  if (patientName) confidence = Math.min(confidence + 0.1, 1);

  return {
    service,
    date,
    time,
    patientName,
    confidence: Math.round(confidence * 100) / 100
  };
}

module.exports = { parseBookingRequest };