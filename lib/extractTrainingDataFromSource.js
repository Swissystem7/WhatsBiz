function extractTrainingDataFromSource(sourceType, sourceData) {
  const faqs = [];
  const bookingRules = [];

  if (sourceType === 'url') {
    if (typeof sourceData !== 'string' || sourceData.trim() === '') {
      return { faqs, bookingRules };
    }
    try {
      const url = new URL(sourceData);
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url.href, false);
      xhr.overrideMimeType('text/plain');
      xhr.send();
      if (xhr.status !== 200) {
        return { faqs, bookingRules };
      }
      const contentType = xhr.getResponseHeader('content-type') || '';
      if (!contentType.includes('text') && !contentType.includes('html') && !contentType.includes('javascript')) {
        console.warn('URL points to non-text content (PDF, image, etc.)');
        return { faqs, bookingRules };
      }
      const text = xhr.responseText;
      if (!/[\u0590-\u05FF]/.test(text)) {
        return { faqs, bookingRules };
      }
      const lines = text.split('\n');
      let currentQuestion = null;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('Q:') || line.startsWith('שאלה:')) {
          currentQuestion = line.replace(/^(Q:|שאלה:)\s*/i, '').trim();
        } else if ((line.startsWith('A:') || line.startsWith('תשובה:')) && currentQuestion) {
          const answer = line.replace(/^(A:|תשובה:)\s*/i, '').trim();
          if (currentQuestion && answer) {
            faqs.push({ question: currentQuestion, answer });
          }
          currentQuestion = null;
        }
        const serviceMatch = line.match(/שירות:\s*(.+?)\s*,\s*משך:\s*(\d+)\s*דקות?\s*,\s*מחיר:\s*₪?\s*([\d.,]+)/i);
        if (serviceMatch) {
          const service = serviceMatch[1].trim();
          const durationMinutes = parseInt(serviceMatch[2], 10);
          let price = parseFloat(serviceMatch[3].replace(/,/g, ''));
          if (!isNaN(durationMinutes) && !isNaN(price)) {
            bookingRules.push({ service, durationMinutes, price });
          }
        }
        const priceRangeMatch = line.match(/₪\s*(\d+)\s*-\s*(\d+)/);
        if (priceRangeMatch) {
          const low = parseFloat(priceRangeMatch[1]);
          const high = parseFloat(priceRangeMatch[2]);
          const avg = (low + high) / 2;
          const serviceNameMatch = line.match(/שירות:\s*(.+?)(?:\s*,|$)/i);
          const service = serviceNameMatch ? serviceNameMatch[1].trim() : 'Unknown';
          const durationMatch = line.match(/משך:\s*(\d+)\s*דקות?/i);
          const durationMinutes = durationMatch ? parseInt(durationMatch[1], 10) : 60;
          bookingRules.push({ service, durationMinutes, price: avg });
        }
      }
    } catch (e) {
      return { faqs, bookingRules };
    }
  } else if (sourceType === 'chatHistory') {
    if (!Array.isArray(sourceData) || sourceData.length === 0) {
      return { faqs, bookingRules };
    }
    const allText = sourceData.map(m => m.text || '').join(' ');
    if (!/[\u0590-\u05FF]/.test(allText)) {
      return { faqs, bookingRules };
    }
    let currentQuestion = null;
    for (let i = 0; i < sourceData.length; i++) {
      const msg = sourceData[i];
      if (!msg || !msg.text) continue;
      const text = msg.text.trim();
      if (msg.role === 'user') {
        if (text.endsWith('?') || /^(מה|איך|למה|מתי|איפה|מי|האם)/i.test(text)) {
          currentQuestion = text;
        }
      } else if (msg.role === 'bot' && currentQuestion) {
        if (text.length > 10) {
          faqs.push({ question: currentQuestion, answer: text });
        }
        currentQuestion = null;
      }
      const serviceMatch = text.match(/שירות:\s*(.+?)\s*,\s*משך:\s*(\d+)\s*דקות?\s*,\s*מחיר:\s*₪?\s*([\d.,]+)/i);
      if (serviceMatch) {
        const service = serviceMatch[1].trim();
        const durationMinutes = parseInt(serviceMatch[2], 10);
        let price = parseFloat(serviceMatch[3].replace(/,/g, ''));
        if (!isNaN(durationMinutes) && !isNaN(price)) {
          bookingRules.push({ service, durationMinutes, price });
        }
      }
      const priceRangeMatch = text.match(/₪\s*(\d+)\s*-\s*(\d+)/);
      if (priceRangeMatch) {
        const low = parseFloat(priceRangeMatch[1]);
        const high = parseFloat(priceRangeMatch[2]);
        const avg = (low + high) / 2;
        const serviceNameMatch = text.match(/שירות:\s*(.+?)(?:\s*,|$)/i);
        const service = serviceNameMatch ? serviceNameMatch[1].trim() : 'Unknown';
        const durationMatch = text.match(/משך:\s*(\d+)\s*דקות?/i);
        const durationMinutes = durationMatch ? parseInt(durationMatch[1], 10) : 60;
        bookingRules.push({ service, durationMinutes, price: avg });
      }
    }
  }

  return { faqs, bookingRules };
}

module.exports = { extractTrainingDataFromSource };