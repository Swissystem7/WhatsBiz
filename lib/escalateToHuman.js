function escalateToHuman(message, context) {
  const defaultThreshold = 0.3;
  context = context && typeof context === 'object' ? context : {};
  const rules = context.clinicEscalationRules || {};
  const keywords = Array.isArray(rules.keywords) ? rules.keywords.filter(k => typeof k === 'string') : [];
  const intentsToEscalate = Array.isArray(rules.intentsToEscalate) ? rules.intentsToEscalate : [];
  const confidenceThreshold = Number.isFinite(rules.confidenceThreshold) ? rules.confidenceThreshold : defaultThreshold;
  const confidence = Number.isFinite(context.confidence) ? context.confidence : 0;
  const intent = typeof context.intent === 'string' ? context.intent : '';
  const history = Array.isArray(context.history) ? context.history.slice(-5).map(item => typeof item === 'string' ? item : item && item.content).filter(Boolean).join(' ') : '';

  if (!message || message.trim() === '') {
    return {
      shouldEscalate: true,
      reason: 'empty_message',
      contextForHuman: {
        message: message || '',
        confidence: confidence,
        intent: intent,
        history
      }
    };
  }

  if (keywords.length > 0) {
    const lowerMessage = message.toLowerCase();
    const matched = keywords.some(kw => lowerMessage.includes(kw.toLowerCase()));
    if (matched) {
      return {
        shouldEscalate: true,
        reason: 'keyword_match',
        contextForHuman: {
          message: message,
          confidence: confidence,
          intent: intent,
          history
        }
      };
    }
  }

  if (intentsToEscalate.includes(intent)) {
    return {
      shouldEscalate: true,
      reason: 'intent_match',
      contextForHuman: {
        message: message,
        confidence: confidence,
        intent: intent,
        history
      }
    };
  }

  if (confidence <= confidenceThreshold) {
    return {
      shouldEscalate: true,
      reason: 'low_confidence',
      contextForHuman: {
        message: message,
        confidence: confidence,
        intent: intent,
        history
      }
    };
  }

  return {
    shouldEscalate: false,
    contextForHuman: {
      message: message,
      confidence: confidence,
      intent: intent,
      history
    }
  };
}

module.exports = { escalateToHuman };
