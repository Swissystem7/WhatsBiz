const { randomUUID } = require('crypto');
const handoffQueue = [];
const recentRequests = new Map();

function requestHumanHandoff(conversationHistory, clinicId, userPhone) {
    const clinics = {
        'clinic1': { staffOnline: true },
        'clinic2': { staffOnline: true },
        'clinic3': { staffOnline: false }
    };
    if (!Array.isArray(conversationHistory) || conversationHistory.length === 0) {
        return { error: 'No conversation to handoff' };
    }
    if (!clinics[clinicId]) {
        return { error: 'Clinic not found' };
    }
    if (!/^(05\d{8}|\+9725\d{8})$/.test(userPhone)) {
        return { error: 'Invalid phone number' };
    }
    const now = Date.now();
    if (recentRequests.has(userPhone) && (now - recentRequests.get(userPhone)) < 300000) {
        return { error: 'Handoff already requested' };
    }
    if (!clinics[clinicId].staffOnline) {
        return { error: 'No agents available' };
    }

    const handoffToken = randomUUID();
    const agentQueuePosition = handoffQueue.length + 1;
    const estimatedWaitSeconds = agentQueuePosition * 120;

    handoffQueue.push({ handoffToken, clinicId, userPhone, timestamp: now });
    recentRequests.set(userPhone, now);

    return { handoffToken, agentQueuePosition, estimatedWaitSeconds };
}

module.exports = { requestHumanHandoff };
