function checkBusinessHoursAndRespond(clinicId, currentTime, requestedAction, clinicTimeZone, holidays) {
  const clinicHours = new Map([
    ['clinic1', { open: 9, close: 17 }],
    ['clinic2', { open: 10, close: 18 }],
    ['default', { open: 9, close: 17 }]
  ]);

  if (!clinicId || typeof clinicId !== 'string' || clinicId.trim() === '') {
    return { allowed: false, response: 'Please verify your clinic.' };
  }

  const tz = clinicTimeZone || 'Asia/Jerusalem';
  const parsedTime = new Date(currentTime);
  if (Number.isNaN(parsedTime.getTime())) {
    return { allowed: false, response: null };
  }
  let parts;
  try {
    parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
      timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
      weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(parsedTime).filter(p => p.type !== 'literal').map(p => [p.type, p.value]));
  } catch { return { allowed: false, response: null }; }
  const localHours = Number(parts.hour);
  const utcMinutes = Number(parts.minute);
  const localDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(parts.weekday);
  const localDateStr = `${parts.year}-${parts.month}-${parts.day}`;

  if (Array.isArray(holidays) && holidays.includes(localDateStr)) {
    if (requestedAction === 'booking') {
      return { allowed: false, response: "We'll contact you when we reopen." };
    } else {
      return { allowed: false, response: 'We are closed today. Please contact us during business hours (09:00-17:00) or send a message for next business day.' };
    }
  }

  if (localDay === 5 || localDay === 6) {
    if (requestedAction === 'booking') {
      return { allowed: false, response: "We'll contact you when we reopen." };
    } else {
      return { allowed: false, response: 'We are closed on weekends. Please contact us during business hours (09:00-17:00) or send a message for next business day.' };
    }
  }

  const hours = clinicHours.get(clinicId) || clinicHours.get('default');
  const openHour = hours.open;
  const closeHour = hours.close;

  const localMinutes = localHours * 60 + utcMinutes;
  const openMinutes = openHour * 60;
  const closeMinutes = closeHour * 60;

  if (localMinutes >= openMinutes && localMinutes < closeMinutes) {
    return { allowed: true, response: 'We are open and ready to assist you.' };
  } else {
    if (requestedAction === 'booking') {
      return { allowed: false, response: "We'll contact you when we reopen." };
    } else {
      return { allowed: false, response: `We are currently closed. Our hours are ${openHour}:00-${closeHour}:00. Please contact us during business hours or send a message for next business day.` };
    }
  }
}

module.exports = { checkBusinessHoursAndRespond };
