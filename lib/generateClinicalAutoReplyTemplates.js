function generateClinicalAutoReplyTemplates(clinicServices, clinicHours) {
  const templates = [];
  const seenIntents = new Set();
  const serviceMap = new Map();

  if (!Array.isArray(clinicServices) || clinicServices.length === 0) {
    return [{
      intent: 'default',
      triggers: ['ברירת מחדל', 'עזרה', 'מידע'],
      reply: 'שלום, ברוכים הבאים למרפאה. כיצד אוכל לעזור?'
    }];
  }

  for (const service of clinicServices) {
    if (!service || !service.serviceName) continue;
    const name = service.serviceName;
    if (serviceMap.has(name)) {
      const existing = serviceMap.get(name);
      if (service.description) existing.descriptions.push(service.description);
      if (service.price && /^\d+(\.\d{1,2})?$/.test(service.price)) {
        existing.prices.push(service.price);
      }
    } else {
      const descriptions = service.description ? [service.description] : [];
      const prices = (service.price && /^\d+(\.\d{1,2})?$/.test(service.price)) ? [service.price] : [];
      serviceMap.set(name, { name, descriptions, prices });
    }
  }

  const uniqueServices = Array.from(serviceMap.values());

  if (uniqueServices.length > 0) {
    const serviceNames = uniqueServices.map(s => s.name);
    const triggers = serviceNames.map(n => `מידע על ${n}`).concat(serviceNames.map(n => `פרטים על ${n}`));
    const replyLines = uniqueServices.map(s => {
      let line = s.name;
      if (s.descriptions.length > 0) line += ` - ${s.descriptions.join(', ')}`;
      if (s.prices.length > 0) line += ` (מחיר: ${s.prices.join(', ')})`;
      return line;
    });
    templates.push({
      intent: 'services',
      triggers: triggers,
      reply: `השירותים שלנו:\n${replyLines.join('\n')}`
    });
    seenIntents.add('services');
  }

  if (clinicHours) {
    const hoursTriggers = ['שעות פעילות', 'מתי אתם פתוחים', 'שעות פתיחה'];
    let reply = 'שעות הפעילות שלנו:\n';
    if (clinicHours.weekdays) {
      reply += `ימי חול: ${clinicHours.weekdays}\n`;
    }
    if (clinicHours.saturday) {
      reply += `שבת: ${clinicHours.saturday}`;
    } else {
      reply += 'שבת: סגור';
    }
    templates.push({
      intent: 'hours',
      triggers: hoursTriggers,
      reply: reply
    });
    seenIntents.add('hours');
  }

  if (uniqueServices.length > 0) {
    const pricingTriggers = [];
    const pricingLines = [];
    for (const s of uniqueServices) {
      if (s.prices.length > 0) {
        pricingTriggers.push(`מחיר ${s.name}`, `כמה עולה ${s.name}`);
        pricingLines.push(`${s.name}: ${s.prices.join(', ')}`);
      }
    }
    if (pricingLines.length > 0) {
      templates.push({
        intent: 'pricing',
        triggers: pricingTriggers,
        reply: `מחירים:\n${pricingLines.join('\n')}`
      });
      seenIntents.add('pricing');
    }
  }

  if (templates.length === 0) {
    templates.push({
      intent: 'default',
      triggers: ['ברירת מחדל', 'עזרה', 'מידע'],
      reply: 'שלום, ברוכים הבאים למרפאה. כיצד אוכל לעזור?'
    });
  }

  return templates;
}

module.exports = { generateClinicalAutoReplyTemplates };
