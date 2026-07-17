const assert = require('node:assert');
const { generateHybridReply } = require('./generateHybridReply.js');

// booking intent (via 'תור')
assert.strictEqual(
  generateHybridReply({ customerName: 'דוד', clinicName: 'מרפאת שיניים' }, 'אני רוצה לקבוע תור'),
  'שלום דוד, תודה שפנית אל מרפאת שיניים. אשמח לקבוע לך תור. מתי נוח לך?'
);

// booking intent (via 'קבע')
assert.strictEqual(
  generateHybridReply({ customerName: 'דוד', clinicName: 'מרפאה' }, 'תקבע לי משהו'),
  'שלום דוד, תודה שפנית אל מרפאה. אשמח לקבוע לך תור. מתי נוח לך?'
);

// pricing intent (via 'מחיר')
assert.strictEqual(
  generateHybridReply({ customerName: 'רונית', clinicName: 'מרפאת עור' }, 'מה המחיר של טיפול?'),
  'שלום רונית, תודה שפנית אל מרפאת עור. המחירים משתנים לפי סוג הטיפול. אשמח לפרט לך במייל או בטלפון.'
);

// pricing intent (via 'כמה')
assert.strictEqual(
  generateHybridReply({ customerName: 'רונית', clinicName: 'מרפאה' }, 'כמה זה?'),
  'שלום רונית, תודה שפנית אל מרפאה. המחירים משתנים לפי סוג הטיפול. אשמח לפרט לך במייל או בטלפון.'
);

// location intent (via 'כתובת')
assert.strictEqual(
  generateHybridReply({ customerName: 'יוסי', clinicName: 'מרפאת עיניים' }, 'מה הכתובת שלכם?'),
  'שלום יוסי, הכתובת של מרפאת עיניים היא: רחוב הראשי 1, תל אביב. נשמח לראותך!'
);

// location intent (via 'איפה', plain — no diacritics; spec does not require niqqud normalization)
assert.strictEqual(
  generateHybridReply({ customerName: 'יובל', clinicName: 'מרפאת ילדים' }, 'איפה אתם?'),
  'שלום יובל, הכתובת של מרפאת ילדים היא: רחוב הראשי 1, תל אביב. נשמח לראותך!'
);

// other intent (no keyword match) -> empathetic fallback
assert.strictEqual(
  generateHybridReply({ customerName: 'מיכל', clinicName: 'מרפאה כללית' }, 'אני רוצה מידע על שעות פעילות'),
  'סליחה, לא הצלחתי להבין. אפנה אותך לנציג תוך 5 דקות.'
);

// multiple intents -> first match wins (booking scanned before pricing)
assert.strictEqual(
  generateHybridReply({ customerName: 'נועה', clinicName: 'מרפאה' }, 'לקבוע תור וגם לדעת מחיר'),
  'שלום נועה, תודה שפנית אל מרפאה. אשמח לקבוע לך תור. מתי נוח לך?'
);

// empty / whitespace / null / undefined userMessage -> fallback
assert.strictEqual(
  generateHybridReply({ customerName: 'משה', clinicName: 'מרפאה' }, ''),
  'סליחה, לא הצלחתי להבין. אפנה אותך לנציג תוך 5 דקות.'
);
assert.strictEqual(
  generateHybridReply({ customerName: 'משה', clinicName: 'מרפאה' }, '   '),
  'סליחה, לא הצלחתי להבין. אפנה אותך לנציג תוך 5 דקות.'
);
assert.strictEqual(
  generateHybridReply({ customerName: 'משה', clinicName: 'מרפאה' }, null),
  'סליחה, לא הצלחתי להבין. אפנה אותך לנציג תוך 5 דקות.'
);
assert.strictEqual(
  generateHybridReply({ customerName: 'משה', clinicName: 'מרפאה' }, undefined),
  'סליחה, לא הצלחתי להבין. אפנה אותך לנציג תוך 5 דקות.'
);

// offensive language -> respectful redirect
assert.strictEqual(
  generateHybridReply({ customerName: 'דני', clinicName: 'מרפאה' }, 'אתה זין'),
  'אנא שמור על שפה מכבדת. אפנה אותך לנציג תוך 5 דקות.'
);

// offensive language takes precedence over a valid intent
assert.strictEqual(
  generateHybridReply({ customerName: 'דני', clinicName: 'מרפאה' }, 'אני רוצה לקבוע תור בן זונה'),
  'אנא שמור על שפה מכבדת. אפנה אותך לנציג תוך 5 דקות.'
);

// missing customerName -> generic 'לך'; missing clinicName -> 'המרפאה'
assert.strictEqual(
  generateHybridReply({}, 'קבוע'),
  'שלום לך, תודה שפנית אל המרפאה. אשמח לקבוע לך תור. מתי נוח לך?'
);

// partial context (customerName only)
assert.strictEqual(
  generateHybridReply({ customerName: 'שרה' }, 'מחיר'),
  'שלום שרה, תודה שפנית אל המרפאה. המחירים משתנים לפי סוג הטיפול. אשמח לפרט לך במייל או בטלפון.'
);

console.log('ok');