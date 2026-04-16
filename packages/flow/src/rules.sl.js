// SL = syllabische Ebene / Silbenstruktur, Vokalfolgen, Schärfung
const SL_RULES = [
  // Vokalfolgen / Vokalqualität
  { from: /\bvilleicht\b/gi,  to: 'vielleicht' },
  { from: /\bvieleicht\b/gi,  to: 'vielleicht' },
  { from: /\bwier\b/gi,       to: 'wir' },

  // Fehlende Schärfung / Doppelkonsonant
  { from: /\bwolte\b/gi,      to: 'wollte' },
  { from: /\btrozdem\b/gi,    to: 'trotzdem' },
  { from: /\bdan\b/gi,        to: 'dann' },
  { from: /\bgebrant\b/gi,    to: 'gebrannt' },

  // Konjunktions-Doppelkonsonant: wen → wenn
  // (LRS-typische Verwechslung; Risiko: accusativ 'wen' = 'whom' – selten im Kindertext)
  { from: /\bwen\b/gi,        to: 'wenn' },
];

module.exports = SL_RULES;
