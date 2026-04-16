// SL = syllabische Ebene / Silbenstruktur, Vokalfolgen, Schärfung
const SL_RULES = [
  { from: /\bvilleicht\b/gi, to: 'vielleicht' },
  { from: /\bvieleicht\b/gi, to: 'vielleicht' },
  { from: /\bwier\b/gi, to: 'wir' },
  { from: /\bwolte\b/gi, to: 'wollte' },
  { from: /\btrozdem\b/gi, to: 'trotzdem' },
  { from: /\bdan\b/gi, to: 'dann' },
  { from: /\bwen\b/gi, to: 'wenn' },
  { from: /\bmanchma\b/gi, to: 'manchmal' },
  { from: /\bmuste\b/gi, to: 'musste' },
  { from: /\bmusten\b/gi, to: 'mussten' },
  { from: /\bobwol\b/gi, to: 'obwohl' },
];

module.exports = SL_RULES;
