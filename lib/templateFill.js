'use strict';

// templateFill(template, vars): replace every {{key}} with String(vars[key]).
// Unknown keys (absent from vars) are left literal. Non-string template -> "".
function templateFill(template, vars) {
  if (typeof template !== 'string') return '';
  const v = vars && typeof vars === 'object' ? vars : {};
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(v, key) ? String(v[key]) : match
  );
}

module.exports = { templateFill };
