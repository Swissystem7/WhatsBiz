function suggestOptimalAppointmentSlots(args) {
  const { clinicId, patientPrefs, revenueRules, availableSlots } = args;
  const { preferredTimeRange, preferredDate, durationMinutes, serviceType } = patientPrefs;
  const { slotWeights, priceByService, fillLowDemandHours } = revenueRules;

  const targetDate = new Date(preferredDate + 'T00:00:00');
  if (Number.isNaN(targetDate.getTime())) return [];
  const dayOfWeek = targetDate.getDay();

  const filteredSlots = availableSlots.filter(slot => {
    const slotStart = new Date(slot.start);
    const slotEnd = new Date(slot.end);
    if (Number.isNaN(slotStart.getTime()) || Number.isNaN(slotEnd.getTime())) return false;
    if (slotStart.toISOString().slice(0,10) !== preferredDate) return false;
    if (!slot.serviceTypes.includes(serviceType)) return false;
    const slotDuration = (slotEnd - slotStart) / 60000;
    if (slotDuration < durationMinutes) return false;
    if (preferredTimeRange) {
      const prefStart = new Date(preferredDate + 'T' + preferredTimeRange.start + ':00');
      const prefEnd = new Date(preferredDate + 'T' + preferredTimeRange.end + ':00');
      if (slotStart < prefStart || slotEnd > prefEnd) return false;
    }
    return true;
  });

  if (filteredSlots.length === 0) return [];

  const basePrice = priceByService[serviceType] || 0;

  const scoredSlots = filteredSlots.map(slot => {
    const slotStart = new Date(slot.start);
    const slotHour = slotStart.getHours();
    const slotMinute = slotStart.getMinutes();
    const slotTimeMinutes = slotHour * 60 + slotMinute;

    let weight = 1;
    if (slotWeights.length > 0) {
      const matchingWeight = slotWeights.find(w => 
        w.dayOfWeek === dayOfWeek && 
        slotHour >= w.hourStart && 
        slotHour < w.hourEnd
      );
      if (matchingWeight) {
        weight = matchingWeight.weight;
      } else {
        weight = 1;
      }
    }

    if (fillLowDemandHours && slotWeights.length > 0) {
      const isPeak = slotWeights.some(w => 
        w.dayOfWeek === dayOfWeek && 
        slotHour >= w.hourStart && 
        slotHour < w.hourEnd
      );
      if (!isPeak) {
        weight = weight * 1.5;
      }
    }

    const revenueScore = basePrice * weight;
    return { start: slot.start, end: slot.end, price: basePrice, revenueScore };
  });

  scoredSlots.sort((a, b) => {
    if (b.revenueScore !== a.revenueScore) return b.revenueScore - a.revenueScore;
    return new Date(a.start) - new Date(b.start);
  });

  return scoredSlots;
}

module.exports = { suggestOptimalAppointmentSlots };
