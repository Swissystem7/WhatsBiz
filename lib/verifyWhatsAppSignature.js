function verifyWhatsAppSignature(body, signatureHeader, appSecret) {
  if (!signatureHeader || typeof signatureHeader !== 'string') return false;
  if (!appSecret || typeof appSecret !== 'string') return false;
  if (typeof body !== 'string') return false;

  const parts = signatureHeader.split('=');
  if (parts.length !== 2 || parts[0] !== 'sha256') return false;

  const expectedSignature = parts[1].trim();
  if (!/^[0-9a-fA-F]{64}$/.test(expectedSignature)) return false;

  const crypto = require('crypto');
  const computedSignature = crypto.createHmac('sha256', appSecret).update(body).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(computedSignature), Buffer.from(expectedSignature));
}

module.exports = { verifyWhatsAppSignature };
