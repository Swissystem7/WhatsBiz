const lastReminded = new Map();

function recoverAbandonedBooking(patientPhone, clinicId, intentData, abandonedAt) {
  if (typeof patientPhone !== 'string' || !patientPhone.trim()) {
    throw new Error('Missing patient phone');
  }
  if (!intentData || typeof intentData.serviceType !== 'string' || !intentData.serviceType.trim()) {
    return { reminded: false };
  }

  const now = Date.now();
  if (!Number.isFinite(abandonedAt) || abandonedAt > now || now - abandonedAt < 3600000) {
    return { reminded: false };
  }

  const key = JSON.stringify([patientPhone, clinicId, intentData.serviceType]);
  const bookings = globalThis._completedBookings || {};
  const lastCompleted = bookings[key];
  if (Number.isFinite(lastCompleted) && now - lastCompleted < 7200000) {
    return { reminded: false };
  }

  if (lastReminded.has(key) && now - lastReminded.get(key) < 3600000) {
    return { reminded: false };
  }

  lastReminded.set(key, now);
  return {
    reminded: true,
    reminderMessage: 'היי, נראה שהשארת הזמנה לא גמורה. לחץ כאן להשלמה.'
  };
}

module.exports = { recoverAbandonedBooking };
