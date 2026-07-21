function suggestUpsells(conversationHistory, clinicServices, patientProfile) {
  if (!Array.isArray(conversationHistory) || !Array.isArray(clinicServices)) throw new TypeError('Invalid input');
  patientProfile = patientProfile && typeof patientProfile === 'object' ? patientProfile : {};
  const suggestions = [];
  const age = patientProfile.age || 0;
  const gender = patientProfile.gender || '';
  const pastServices = patientProfile.pastServices || [];
  const normalizedText = conversationHistory.filter(v=>typeof v==='string').join(' ').normalize('NFC').toLocaleLowerCase();
  const matchedServices = new Set();
  for (const service of clinicServices) {
    if (!service || typeof service.id !== 'string' || !Array.isArray(service.upsellTargets)) continue;
    if (pastServices.includes(service.id)) continue;
    const targetWords = service.upsellTargets.filter(t=>typeof t==='string').map(t => t.normalize('NFC').toLocaleLowerCase());
    const match = targetWords.some(tw => tw && normalizedText.includes(tw));
    if (!match) continue;
    let priority = 0;
    let reason = '';
    let discount;
    if (service.category === 'preventive' && age > 40) {
      priority = 3;
      reason = 'Age-appropriate preventive care recommended';
    } else if (service.category === 'cosmetic' && gender === 'female') {
      priority = 2;
      reason = 'Popular cosmetic service for your profile';
    } else {
      priority = 1;
      reason = 'Related to your inquiry';
    }
    if (service.price > 200 && priority > 1) {
      discount = 10;
      reason += ' - special discount available';
    }
    if (!matchedServices.has(service.id)) {
      matchedServices.add(service.id);
      const suggestion = { serviceId: service.id, reason, priority };
      if (discount !== undefined) suggestion.discount = discount;
      suggestions.push(suggestion);
    }
  }
  suggestions.sort((a, b) => b.priority - a.priority);
  return { suggestions, analytics: { totalUpsells: suggestions.length } };
}
module.exports = { suggestUpsells };
