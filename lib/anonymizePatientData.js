function anonymizePatientData(input) {
  if (typeof input !== 'string') throw new TypeError('input must be a string');
  if (input === "") return "";
  const nameRegex = /\b(?:יוסי|דני|משה|אבי|שרה|רחל|לאה|רונית|אילנה|דוד|יואב|עומר|תמר|נועה|מיכל|אלון|גיל|רועי|אסף|אורית|חנה|רינה|ציפורה|אסתר|מרים|בתיה|שושנה|רוחמה|פנינה|אריאל|אליהו|יצחק|יעקב|אברהם|שלמה|שמואל|ישראל|בנימין|יהודה|יוסף|דבורה|נעמי|רות|אהרן|מנחם|נחמה|גבריאל|מיכאל|רפאל|דניאל)\b/g;
  const phoneRegex = /\b05[0-9]-[0-9]{3}-[0-9]{4}\b/g;
  const idRegex = /\b[0-9]{9}\b/g;
  const names = 'יוסי|דני|משה|אבי|שרה|רחל|לאה|רונית|אילנה|דוד|יואב|עומר|תמר|נועה|מיכל|אלון|גיל|רועי|אסף|אורית|חנה|רינה|ציפורה|אסתר|מרים|בתיה|שושנה|רוחמה|פנינה|אריאל|אליהו|יצחק|יעקב|אברהם|שלמה|שמואל|ישראל|בנימין|יהודה|יוסף|דבורה|נעמי|רות|אהרן|מנחם|נחמה|גבריאל|מיכאל|רפאל|דניאל';
  const hebrewNameRegex = new RegExp(`(?<![\\u0590-\\u05FF])(?:${names})(?![\\u0590-\\u05FF])`, 'gu');
  let result = input;
  result = result.replace(hebrewNameRegex, "[NAME]");
  result = result.replace(phoneRegex, (match) => {
    const last4 = match.slice(-4);
    return `[PHONE_LAST4:${last4}]`;
  });
  result = result.replace(idRegex, (match) => {
    const last4 = match.slice(-4);
    return `[ID_LAST4:${last4}]`;
  });
  return result;
}
module.exports = { anonymizePatientData };
