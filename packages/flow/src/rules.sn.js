// SN = syntaktische Normalisierung / Wortgrenzen und lokale Fügungen
const SN_RULES = [
  // Bekannte Zusammenschreibungen (Worttrennung)
  { from: /\bgarnich\b/gi,      to: 'gar nicht' },
  { from: /\bgarnicht\b/gi,     to: 'gar nicht' },
  { from: /\bausversehen\b/gi,  to: 'aus Versehen' },
  { from: /\baufeinmal\b/gi,    to: 'auf einmal' },
  { from: /\bzuende\b/gi,       to: 'zu Ende' },

  // Falsch zusammengeschriebene Komposita
  { from: /\bweiter gegangen\b/gi, to: 'weitergegangen' },
  { from: /\bhats\b/gi,            to: 'hat es' },

  // dass-Konjunktion nach Kognitions- und Kommunikationsverben
  // Einfaches Wortgrenzenmuster: (verb) das → (verb), dass
  // Funktioniert auch wenn das nächste Wort noch nicht korrigiert ist (SL läuft danach)
  { from: /\b(dachte|gemerkt|gesagt|gewusst|gehört)\s+das\b/gi, to: '$1, dass' },
];

module.exports = SN_RULES;
