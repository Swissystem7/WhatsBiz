async function processNoShowAndBalanceReminder(args) {
  const {
    appointmentId,
    patientPhone,
    clinicPolicy,
    paymentLinkGenFn,
    currentTimestamp,
    appointmentData
  } = args;

  const current = new Date(currentTimestamp);
  const start = new Date(appointmentData.scheduledStart);

  if (current < start) {
    return { action: 'no_action', messageText: '', paymentLink: null };
  }

  if (appointmentData.cancelled || appointmentData.paymentStatus === 'cancelled') {
    return { action: 'no_action', messageText: '', paymentLink: null };
  }

  const graceEnd = new Date(start.getTime() + clinicPolicy.gracePeriodMinutes * 60000);
  const isNoShow = !appointmentData.patientHasArrived && current >= graceEnd;

  let action = 'no_action';
  let messageText = '';
  let paymentLink = null;

  const balanceExceedsThreshold = appointmentData.outstandingBalance > clinicPolicy.unpaidBalanceThreshold;

  if (isNoShow && clinicPolicy.applyNoShowFee && appointmentData.paymentStatus !== 'paid') {
    action = 'charge_fee';
    messageText = `שלום, לא הגעת לתור שנקבע לך. נגבה ממך דמי אי-התייצבות בסך ${clinicPolicy.noShowFee} ש"ח.`;
    try { paymentLink = await paymentLinkGenFn(clinicPolicy.noShowFee, patientPhone, 'no-show fee'); } catch {}
  }

  if (balanceExceedsThreshold && action !== 'charge_fee') {
    action = 'send_reminder';
    messageText = `שלום, יתרת החוב שלך היא ${appointmentData.outstandingBalance} ש"ח. אנא שלם בהקדם.`;
    try { paymentLink = await paymentLinkGenFn(appointmentData.outstandingBalance, patientPhone, 'balance reminder'); } catch {}
  }

  if (isNoShow && clinicPolicy.applyNoShowFee && balanceExceedsThreshold) {
    action = 'charge_fee';
    messageText = `שלום, לא הגעת לתור שנקבע לך. נגבה ממך דמי אי-התייצבות בסך ${clinicPolicy.noShowFee} ש"ח. כמו כן, יתרת החוב שלך היא ${appointmentData.outstandingBalance} ש"ח.`;
    try { paymentLink = await paymentLinkGenFn(clinicPolicy.noShowFee + appointmentData.outstandingBalance, patientPhone, 'no-show fee and balance'); } catch {}
  }

  return { action, messageText, paymentLink };
}

module.exports = { processNoShowAndBalanceReminder };
