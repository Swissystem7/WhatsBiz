function generateBookingFollowUp(conversationState, lastUserMessage, hoursSinceLastInteraction) {
  if (!conversationState || typeof conversationState !== 'object' || !Number.isFinite(hoursSinceLastInteraction)) {
    return { followUpMessage: null, followUpType: null };
  }
  if (conversationState.intent !== 'booking') return { followUpMessage: null, followUpType: null };
  if (conversationState.stage === 'completed') return { followUpMessage: null, followUpType: null };
  if (hoursSinceLastInteraction <= 2) return { followUpMessage: null, followUpType: null };
  if (hoursSinceLastInteraction <= 24) {
    return {
      followUpMessage: 'שלום, ראינו שהפסקת בתהליך קביעת התור. נוכל לעזור לך להשלים?',
      followUpType: 'firstReminder'
    };
  }
  if (conversationState.stage === 'confirmation_pending') {
    return {
      followUpMessage: 'התור עדיין פתוח? נוכל לסייע לך לסדר זאת עכשיו.',
      followUpType: 'offerAssistance'
    };
  }
  return {
    followUpMessage: 'התור עדיין פתוח? נוכל לסייע לך לסדר זאת עכשיו.',
    followUpType: 'offerAssistance'
  };
}
module.exports = { generateBookingFollowUp };
