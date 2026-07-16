module.exports = {
  maskPhone(str) {
    if (typeof str !== 'string') return '';
    
    const digitsOnly = str.replace(/[^0-9]/g, '');
    const length = digitsOnly.length;
    
    if (length <= 4) return '*'.repeat(length);
    
    let maskedPart = '*'.repeat(Math.max(1, length - 4));
    let visibleEnds = digitsOnly.slice(-4).split('').map(char => char === '*' ? 'X' : char).join('');
    
    return `${maskedPart}${visibleEnds}`;
  }
};