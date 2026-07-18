function generateUpsellSuggestion(args) {
  const { patientId, currentIntent, patientHistory, availableServices, discountRules, currentAppointment } = args;
  if (!discountRules.applicableIntents.includes(currentIntent)) {
    return { suggestionText: null, suggestedService: null, confidenceScore: 0 };
  }
  if (patientHistory.totalSpent < discountRules.minPastSpent) {
    return { suggestionText: null, suggestedService: null, confidenceScore: 0 };
  }
  const totalAppointments = patientHistory.pastServices.length + patientHistory.noShowCount;
  const noShowRate = totalAppointments > 0 ? patientHistory.noShowCount / totalAppointments : 0;
  if (noShowRate > discountRules.maxNoShowRate) {
    return { suggestionText: null, suggestedService: null, confidenceScore: 0 };
  }
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  const recentServiceTypes = new Set(
    patientHistory.pastServices
      .filter(s => new Date(s.completedAt) >= threeMonthsAgo)
      .map(s => s.serviceType)
  );
  let candidateServices = availableServices.filter(s => s.canBeUpsold && !recentServiceTypes.has(s.serviceType));
  if (currentAppointment && currentAppointment.serviceType) {
    const complementary = candidateServices.filter(s => s.complementaryServices.includes(currentAppointment.serviceType));
    if (complementary.length > 0) {
      candidateServices = complementary;
    } else {
      const fallback = candidateServices.filter(s => s.serviceType !== currentAppointment.serviceType);
      if (fallback.length > 0) {
        candidateServices = fallback;
      }
    }
  }
  if (candidateServices.length === 0) {
    return { suggestionText: null, suggestedService: null, confidenceScore: 0 };
  }
  const bestService = candidateServices.reduce((a, b) => a.basePrice > b.basePrice ? a : b);
  const maxDiscount = Number.isFinite(discountRules.maxDiscountPercent) ? discountRules.maxDiscountPercent : 20;
  const discountPercent = Math.max(0, Math.min(maxDiscount, 20));
  const priceWithDiscount = Math.round(bestService.basePrice * (1 - discountPercent / 100));
  let confidenceScore = 0.5;
  if (currentAppointment && currentAppointment.serviceType && bestService.complementaryServices.includes(currentAppointment.serviceType)) {
    confidenceScore += 0.2;
  }
  if (patientHistory.noShowCount === 0) {
    confidenceScore += 0.1;
  }
  if (patientHistory.totalSpent > 2 * discountRules.minPastSpent) {
    confidenceScore += 0.2;
  }
  confidenceScore = Math.min(confidenceScore, 1.0);
  const suggestionText = `האם תרצה להוסיף ${bestService.name} ב-${discountPercent}% הנחה?`;
  return {
    suggestionText,
    suggestedService: {
      serviceId: bestService.serviceId,
      name: bestService.name,
      priceWithDiscount,
      discountPercent
    },
    confidenceScore
  };
}
module.exports = { generateUpsellSuggestion };
