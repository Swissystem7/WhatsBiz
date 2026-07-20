function canSendMessage(conversationId, timestamp) {
  if (typeof conversationId !== 'string' || !conversationId || !Number.isFinite(timestamp)) return false;
  const effectiveTimestamp = timestamp;
  const windowStart = effectiveTimestamp - 10000;
  const limit = 5;
  if (!canSendMessage._map) {
    canSendMessage._map = new Map();
  }
  const map = canSendMessage._map;
  let timestamps = map.get(conversationId);
  if (!timestamps) {
    timestamps = [];
    map.set(conversationId, timestamps);
  }
  const filtered = timestamps.filter(t => t > windowStart);
  if (filtered.length < limit) {
    filtered.push(effectiveTimestamp);
    if (filtered.length > 100) {
      filtered.splice(0, filtered.length - 100);
    }
    map.set(conversationId, filtered);
    return true;
  }
  return false;
}
module.exports = { canSendMessage };
