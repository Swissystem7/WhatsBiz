function parseClinicHours(input) {
  if (typeof input !== 'string' || !input.trim()) return {};
  const result={sun:null,mon:null,tue:null,wed:null,thu:null,fri:null,sat:null};
  const names=[['sun','א','ראשון'],['mon','ב','שני'],['tue','ג','שלישי'],['wed','ד','רביעי'],['thu','ה','חמישי'],['fri','ו','שישי'],['sat','ש','שבת']];
  const dayIndex=s=>names.findIndex(([,letter,word])=>new RegExp(`^(?:יום\\s*)?(?:${letter}['׳]?|${word})$`).test(s.trim()));
  const time=s=>{const m=s.trim().match(/^(\d{1,2})(?::(\d{2}))?$/);if(!m)return null;let h=+m[1],n=+(m[2]||0);return h<24&&n<60?String(h).padStart(2,'0')+String(n).padStart(2,'0'):null};
  for(const part of input.split(/[,;]/)){const m=part.trim().match(/^(.+?)(?::|\s)\s*(\d{1,2}(?::\d{2})?)\s*[-–—]\s*(\d{1,2}(?::\d{2})?)$/);if(!m)continue;
    const bounds=m[1].split(/\s*[-–—]\s*/), a=dayIndex(bounds[0]), b=dayIndex(bounds[1]||bounds[0]), open=time(m[2]), close=time(m[3]);if(a<0||b<a||!open||!close)continue;
    for(let i=a;i<=b;i++)result[names[i][0]]={open,close};
  }
  return result;
}
module.exports = { parseClinicHours };
