// PG = Phonem-Graphem-Korrespondenz / lautnahe Schreibvarianten
const PG_RULES = [
  // Vokalsubstitution / Silbenlesen
  { from: /\bgelsen\b/gi,   to: 'gelesen' },
  { from: /\bferig\b/gi,    to: 'fertig' },

  // ß / ss / s Verwechslung
  { from: /\bweis\b/gi,     to: 'weiß' },

  // sh → sch (Anglizismus-Transfer / phonologische Annäherung)
  // 'shule' ist immer Schule (Substantiv), daher korrekte Großschreibung direkt
  { from: /\bshule\b/gi,    to: 'Schule' },

  // Auslassung von Buchstaben / Reduktion
  { from: /\bnich\b/gi,     to: 'nicht' },
  { from: /\bhab\b/gi,      to: 'habe' },
];

module.exports = PG_RULES;
