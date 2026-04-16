// MO = morphologische Normalisierung / Stammprinzip und Flexionsformen
const MO_RULES = [
  { from: /\birgentwie\b/gi, to: 'irgendwie' },
  { from: /\beigendlich\b/gi, to: 'eigentlich' },
  { from: /\berklert\b/gi, to: 'erklärt' },
  { from: /\bgewessen\b/gi, to: 'gewesen' },
  { from: /\bwolte\b/gi, to: 'wollte' },
  { from: /\banderst\b/gi, to: 'anders' },
  { from: /\babents\b/gi, to: 'abends' },
  { from: /\bdrausen\b/gi, to: 'draußen' },
  { from: /\baufeinmal\b/gi, to: 'auf einmal' },
  { from: /\bwider\b/gi, to: 'wieder' },
];

module.exports = MO_RULES;
