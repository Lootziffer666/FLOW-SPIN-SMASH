// PG = Phonem-Graphem-Korrespondenz / lautnahe Schreibvarianten
const PG_RULES = [
  { from: /\bgelsen\b/gi, to: 'gelesen' },
  { from: /\bferig\b/gi, to: 'fertig' },
  { from: /\bweis\b/gi, to: 'weiß' },
  { from: /\bnich\b/gi, to: 'nicht' },
  { from: /\bhab\b/gi, to: 'habe' },
  { from: /\bfor\b/gi, to: 'vor' },
  { from: /\bgesakt\b/gi, to: 'gesagt' },
  { from: /\bferge(?:ß|s)en\b/gi, to: 'vergessen' },
  { from: /\bshule\b/gi, to: 'schule' },
  { from: /\bkucken\b/gi, to: 'gucken' },
  { from: /\bhatt\b/gi, to: 'hat' },
  { from: /\bwahren\b/gi, to: 'waren' },
  { from: /\bknurt\b/gi, to: 'knurrt' },
  { from: /\bleuft\b/gi, to: 'läuft' },
  { from: /\bgekipt\b/gi, to: 'gekippt' },
  { from: /\bsoken\b/gi, to: 'socken' },
  { from: /\bgebrant\b/gi, to: 'gebrannt' },
  { from: /\bgequitscht\b/gi, to: 'gequietscht' },
  { from: /\bfrür\b/gi, to: 'früher' },
  { from: /\bvileicht\b/gi, to: 'vielleicht' },
];

module.exports = PG_RULES;
