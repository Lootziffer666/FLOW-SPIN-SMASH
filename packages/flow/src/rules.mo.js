// MO = morphologische Normalisierung / Stammprinzip und Flexionsformen
const MO_RULES = [
  // nd/nt-Verwechslung im Wortstamm
  { from: /\birgentwie\b/gi,    to: 'irgendwie' },
  { from: /\birgentwann\b/gi,   to: 'irgendwann' },
  { from: /\beigendlich\b/gi,   to: 'eigentlich' },

  // Monophthongierung / fehlender Konsonant
  { from: /\bobwol\b/gi,        to: 'obwohl' },

  // Konsonantenkombinationen
  { from: /\berklert\b/gi,      to: 'erklärt' },
  { from: /\bgewessen\b/gi,     to: 'gewesen' },

  // Fallback Doppelkonsonant (Duplikat zu SL, da MO nach SL läuft)
  { from: /\bwolte\b/gi,        to: 'wollte' },
];

module.exports = MO_RULES;
