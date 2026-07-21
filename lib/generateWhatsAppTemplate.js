function generateWhatsAppTemplate(input) {
  const errors = [];
  const { clinicName, language, faqs, bookingInfo } = input && typeof input === 'object' ? input : {};
  if (language !== 'he') errors.push('Language must be "he"');

  const clinic = typeof clinicName === 'string' && clinicName.trim() ? clinicName.trim() : 'המרפאה';
  const entries = Array.isArray(faqs) ? faqs : [];
  if (faqs !== undefined && !Array.isArray(faqs)) errors.push('faqs must be an array');

  let bodyText;
  if (entries.length === 0) {
    bodyText = `שלום, ברוכים הבאים ל${clinic}. נשמח לעזור לכם בכל שאלה.`;
  } else {
    bodyText = entries.map((faq, index) => {
      const question = faq && faq.question != null ? String(faq.question) : '';
      let answer = faq && faq.answer != null ? String(faq.answer) : '';
      if (answer.length > 1024) {
        errors.push(`FAQ answer ${index + 1} exceeds 1024 chars, truncating`);
        answer = answer.slice(0, 1024);
      }
      return `שאלה: ${question}\nתשובה: ${answer}`;
    }).join('\n\n');
  }
  if (bodyText.length > 1024) {
    errors.push('Body text exceeds 1024 chars, truncating');
    bodyText = bodyText.slice(0, 1024);
  }

  let headerText = `ברוכים הבאים ל${clinic}`;
  if (headerText.length > 60) {
    errors.push('Header text exceeds 60 chars, truncating');
    headerText = headerText.slice(0, 60);
  }
  const components = [
    { type: 'HEADER', format: 'TEXT', text: headerText },
    { type: 'BODY', text: bodyText },
    { type: 'FOOTER', text: 'נשמח לעזור' }
  ];
  if (bookingInfo !== null && bookingInfo !== undefined) {
    if (!bookingInfo || typeof bookingInfo !== 'object' || !bookingInfo.businessHours) {
      errors.push('Invalid bookingInfo');
    } else {
      components.push({
        type: 'BUTTONS',
        buttons: [{ type: 'QUICK_REPLY', text: 'לקביעת תור' }]
      });
    }
  }
  return {
    templateJson: { name: 'hebrew_clinic_template', language: { code: 'he' }, components },
    errors
  };
}

module.exports = { generateWhatsAppTemplate };
