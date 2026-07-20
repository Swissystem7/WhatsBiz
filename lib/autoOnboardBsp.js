function autoOnboardBsp(phoneNumberId, accessToken, config) {
  const errors = [];
  const requiredFields = ['webhookUrl', 'templateName', 'businessName'];
  const missingFields = requiredFields.filter(field => !config[field]);
  if (missingFields.length > 0) {
    return {
      status: 'failed',
      errors: missingFields.map(field => ({
        code: 400,
        message: `Missing required config field: ${field}`
      }))
    };
  }
  const { webhookUrl, templateName, businessName } = config;
  if (!accessToken || typeof accessToken !== 'string' || accessToken.trim() === '') {
    return {
      status: 'failed',
      errors: [{ code: 401, message: 'Invalid or missing access token' }]
    };
  }
  const validateToken = () => {
    return fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}?access_token=${accessToken}`, { method: 'GET' })
      .then(res => {
        if (res.status === 401) {
          return { valid: false, error: { code: 401, message: 'Invalid token' } };
        }
        if (res.status === 429) {
          return { valid: false, error: { code: 429, message: 'Rate limited' } };
        }
        if (!res.ok) {
          return { valid: false, error: { code: res.status, message: 'Token validation failed' } };
        }
        return { valid: true };
      })
      .catch(() => ({ valid: false, error: { code: 500, message: 'Network error during token validation' } }));
  };
  const checkTemplate = () => {
    return fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/message_templates?access_token=${accessToken}`, { method: 'GET' })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          return { error: { code: data.error.code || 500, message: data.error.message || 'Template check failed' } };
        }
        const existing = data.data.find(t => t.name === templateName);
        if (existing && existing.status === 'APPROVED') {
          return { approved: true };
        }
        return { approved: false };
      })
      .catch(() => ({ error: { code: 500, message: 'Network error checking templates' } }));
  };
  const submitTemplate = () => {
    return fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/message_templates?access_token=${accessToken}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: templateName,
        language: 'en_US',
        category: 'MARKETING',
        components: [
          {
            type: 'HEADER',
            format: 'TEXT',
            text: `Welcome to ${businessName}`
          },
          {
            type: 'BODY',
            text: 'Thank you for your interest. We will be in touch shortly.'
          }
        ]
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        if (data.error.code === 429) {
          return { rateLimited: true, error: { code: 429, message: 'Rate limited' } };
        }
        return { error: { code: data.error.code || 500, message: data.error.message || 'Template submission failed' } };
      }
      return { success: true };
    })
    .catch(() => ({ error: { code: 500, message: 'Network error submitting template' } }));
  };
  const setupWebhook = () => {
    return fetch(webhookUrl, { method: 'GET', mode: 'no-cors' })
      .then(() => {
        return fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/subscribed_apps?access_token=${accessToken}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            subscribed_fields: ['messages', 'message_deliveries', 'message_reads']
          })
        })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            return { error: { code: data.error.code || 500, message: data.error.message || 'Webhook setup failed' } };
          }
          return { success: true };
        })
        .catch(() => ({ error: { code: 500, message: 'Network error setting up webhook' } }));
      })
      .catch(() => ({ error: { code: 502, message: 'Webhook URL unreachable' } }));
  };
  const retryWithBackoff = (fn, retries = 3) => {
    return new Promise((resolve) => {
      const attempt = (n) => {
        fn().then(result => {
          if (result.rateLimited && n > 0) {
            setTimeout(() => attempt(n - 1), Math.pow(2, 3 - n) * 1000);
          } else {
            resolve(result);
          }
        });
      };
      attempt(retries);
    });
  };
  return validateToken().then(tokenResult => {
    if (!tokenResult.valid) {
      return { status: 'failed', errors: [tokenResult.error] };
    }
    return checkTemplate().then(templateResult => {
      if (templateResult.error) {
        return { status: 'failed', errors: [templateResult.error] };
      }
      if (templateResult.approved) {
        errors.push({ code: 200, message: 'Template already approved, skipping submission' });
        return setupWebhook().then(webhookResult => {
          if (webhookResult.error) {
            errors.push(webhookResult.error);
            return { status: 'partial', errors };
          }
          return { status: 'success', errors };
        });
      }
      return retryWithBackoff(submitTemplate).then(submitResult => {
        if (submitResult.error) {
          if (submitResult.error.code === 429) {
            errors.push({ code: 429, message: 'Rate limited after retries' });
            return setupWebhook().then(webhookResult => {
              if (webhookResult.error) {
                errors.push(webhookResult.error);
              }
              return { status: 'partial', errors };
            });
          }
          errors.push(submitResult.error);
          return { status: 'failed', errors };
        }
        return setupWebhook().then(webhookResult => {
          if (webhookResult.error) {
            errors.push(webhookResult.error);
            return { status: 'partial', errors };
          }
          return { status: 'success', errors };
        });
      });
    });
  });
}

module.exports = { autoOnboardBsp };