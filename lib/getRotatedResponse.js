const responseCounters = new Map();

function getRotatedResponse(intent, context) {
  const templates = new Map([
    ['greeting', ['Hello! How can I assist you today?', 'Hi there! What can I help you with?', 'Welcome! How may I help you?']],
    ['hours', ['Our hours are 9 AM to 5 PM Monday to Friday.', 'We are open from 9 AM to 5 PM on weekdays.', 'Our business hours are 9-5 weekdays.']],
    ['booking', ['I can help you book an appointment.', 'Let me assist you with scheduling.', 'Would you like to book a time slot?']],
    ['faq_order', ['Your order status can be checked online.', 'For order inquiries, please visit our portal.', 'Order details are available in your account.']]
  ]);
  const fallback = 'I can help with that.';
  const repetitionVariants = ['Let me check again...', 'Here is the info again', 'As I mentioned earlier...'];
  context = context && typeof context === 'object' ? context : {};
  const customerKey = `${context.clinicId || ''}:${context.customerId || ''}:${intent}`;
  if (!responseCounters.has(customerKey)) {
    responseCounters.set(customerKey, 0);
  }
  let counter = responseCounters.get(customerKey);
  if (!templates.has(intent)) {
    return { response: fallback, rotationKey: 'fallback' };
  }
  let intentTemplates = templates.get(intent);
  let isRepetitive = false;
  if (context.previousIntents && context.previousIntents.length >= 2) {
    const lastTwo = context.previousIntents.slice(-2);
    if (lastTwo[0] === intent && lastTwo[1] === intent) {
      isRepetitive = true;
    }
  }
  let response;
  let rotationKey;
  if (isRepetitive) {
    const repIndex = counter % repetitionVariants.length;
    response = repetitionVariants[repIndex];
    rotationKey = `rep_${repIndex}`;
  } else {
    const templateIndex = counter % intentTemplates.length;
    response = intentTemplates[templateIndex];
    rotationKey = `${intent}_${templateIndex}`;
  }
  responseCounters.set(customerKey, counter + 1);
  return { response, rotationKey };
}
module.exports = { getRotatedResponse };
