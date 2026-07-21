function buildBookingFlowTree(input) {
  const { clinicWorkingDays, slotDurationMinutes, maxAppointmentsPerDay } =
    input && typeof input === 'object' ? input : {};
  const validationErrors = [];
  const hebrewDays = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

  if (!Array.isArray(clinicWorkingDays) || clinicWorkingDays.length === 0) {
    validationErrors.push('clinicWorkingDays must be a non-empty array of Hebrew day names');
  } else {
    for (const day of clinicWorkingDays) {
      if (!hebrewDays.includes(day)) validationErrors.push(`Invalid Hebrew day name: ${day}`);
    }
  }
  if (!Number.isFinite(slotDurationMinutes) || slotDurationMinutes <= 0) {
    validationErrors.push('slotDurationMinutes must be > 0, defaulting to 30');
  }
  if (!Number.isFinite(maxAppointmentsPerDay) || maxAppointmentsPerDay <= 0) {
    validationErrors.push('maxAppointmentsPerDay must be > 0, defaulting to 10');
  }

  const flowTree = {
    question: 'באיזה תאריך תרצה לקבוע?',
    expectedRegex: '^(0[1-9]|[12][0-9]|3[01])\\/(0[1-9]|1[0-2])\\/\\d{4}$',
    next: {
      question: 'באיזו שעה תרצה לקבוע?',
      expectedRegex: '^([01]\\d|2[0-3]):[0-5]\\d$',
      next: {
        question: 'האם לאשר את התור?',
        expectedRegex: '^(כן|לא)$',
        next: null
      }
    }
  };
  return { flowTree, validationErrors };
}

module.exports = { buildBookingFlowTree };
