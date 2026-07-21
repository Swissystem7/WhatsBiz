function composeInitialBotMessages(input) {
  const { clinicName, clinicPhone, businessHours, services } = input && typeof input === 'object' ? input : {};
  const name = clinicName ? String(clinicName) : 'המרפאה';
  const phone = clinicPhone ? String(clinicPhone) : '';
  const days = businessHours && Array.isArray(businessHours.days) && businessHours.days.length > 0
    ? businessHours.days.map(String).join(', ')
    : 'ימי חול';
  const open = businessHours && businessHours.open ? String(businessHours.open) : '';
  const close = businessHours && businessHours.close ? String(businessHours.close) : '';
  const hoursStr = open && close ? `${days} מ-${open} עד ${close}` : days;
  const servicesList = Array.isArray(services) && services.length > 0 ? services.map(String).join(', ') : '';
  const welcomeMessage = `ברוכים הבאים ל${name}! כיצד אוכל לעזור לך?`;
  const businessHoursMessage = `שעות הפעילות של ${name}: ${hoursStr}. ליצירת קשר: ${phone}`;
  const faqPromptMessage = servicesList
    ? `אנו מציעים את השירותים הבאים: ${servicesList}. האם תרצה מידע נוסף על אחד מהם?`
    : `האם תרצה מידע נוסף על השירותים שלנו?`;
  return { welcomeMessage, businessHoursMessage, faqPromptMessage };
}
module.exports = { composeInitialBotMessages };
