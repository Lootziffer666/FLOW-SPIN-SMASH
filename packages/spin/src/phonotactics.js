/**
 * Phonotaktischer Validator für Deutsch
 *
 * Exotischer Analyseansatz: Nutzt die phonotaktischen Constraints der
 * deutschen Sprache als heuristische Fehlererkennungsebene.
 *
 * Drei Analysedimensionen:
 * 1. Illegale Bigramme
 * 2. Sonoritätsprofil (SSP, Clements 1990)
 * 3. Silbengewicht-Heuristik
 */

export const ILLEGAL_BIGRAMS_INTERNAL = new Set([
  'db', 'bd', 'gb', 'bg',
  'tp', 'pt', 'kp', 'pk',
  'mn', 'nm',
  'qq', 'vv', 'yy', 'xx',
  'gn', 'tm',
]);

export const ILLEGAL_ONSETS = new Set([
  'gm', 'tl', 'dl', 'tm', 'pt', 'pn', 'ng',
  'sr', 'lr', 'nr', 'mr',
  'bk', 'dk', 'gk',
  'fb', 'vb',
]);

const FOREIGN_EXCEPTIONS = new Map([
  ['gn', new Set(['signal', 'design', 'kognition', 'kognitiv', 'diagnosis', 'gnosis', 'gnu', 'gnade'])],
  ['pt', new Set(['option', 'optimal', 'rezept', 'konzept', 'skript', 'krypt'])],
  ['pn', new Set(['pneum'])],
  ['mn', new Set(['hymn', 'amnest', 'gymnast'])],
]);

const SONORITY = {
  p: 1, b: 1, t: 1, d: 1, k: 1, g: 1,
  f: 2, v: 2, s: 2, z: 2, ß: 2, x: 2, j: 2, h: 2,
  c: 2, q: 1,
  m: 3, n: 3,
  l: 4, r: 4,
  w: 5,
  a: 6, e: 6, i: 6, o: 6, u: 6,
  ä: 6, ö: 6, ü: 6, y: 6,
};

export function sonorityProfile(word) {
  return [...word.toLowerCase()].map(ch => SONORITY[ch] ?? 0);
}

export function findSonorityViolations(word) {
  const violations = [];
  const lower = word.toLowerCase();
  const profile = sonorityProfile(lower);

  for (let i = 1; i < profile.length - 1; i++) {
    const prev = profile[i - 1];
    const curr = profile[i];
    const next = profile[i + 1];

    if (curr > 0 && curr < 6 && prev === 6 && next === 6) continue;

    if (curr < 3 && prev < 3 && curr <= prev && i >= 2 && profile[i - 2] === 6) {
      violations.push({
        position: i,
        bigram: lower[i - 1] + lower[i],
        type: 'sonority-valley',
      });
    }
  }

  return violations;
}

const LONG_VOWEL_MARKERS = [
  'ie', 'ei', 'au', 'eu', 'äu',
  'ah', 'eh', 'ih', 'oh', 'uh',
  'äh', 'öh', 'üh',
  'aa', 'ee', 'oo',
];

const DOUBLING_CONSONANTS = new Set([
  'b', 'd', 'f', 'g', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'z',
]);

function hasLongVowelBefore(text) {
  const lower = text.toLowerCase();
  return LONG_VOWEL_MARKERS.some(marker => lower.endsWith(marker));
}

export function checkSyllableWeight(word) {
  const suspects = [];
  const lower = word.toLowerCase();

  for (let i = 0; i < lower.length - 1; i++) {
    const ch = lower[i];
    const next = lower[i + 1];

    if (!DOUBLING_CONSONANTS.has(ch)) continue;

    if (ch === next && i >= 2) {
      const before = lower.slice(0, i);
      if (hasLongVowelBefore(before)) {
        suspects.push({ position: i, pattern: ch + next, expected: ch, type: 'double-after-long' });
      }
    }

    if (ch !== next && i >= 1 && i < lower.length - 1) {
      const prevCh = lower[i - 1];
      const isVowelBefore = 'aeiouyäöü'.includes(prevCh);
      const isVowelAfter = 'aeiouyäöü'.includes(next);

      if (isVowelBefore && isVowelAfter && !hasLongVowelBefore(lower.slice(0, i))) {
        suspects.push({ position: i, pattern: ch, expected: ch + ch, type: 'single-after-short' });
      }
    }
  }

  return suspects;
}

const FEATURES = {
  p: { voice: false, place: 0, manner: 0 },
  b: { voice: true, place: 0, manner: 0 },
  t: { voice: false, place: 1, manner: 0 },
  d: { voice: true, place: 1, manner: 0 },
  k: { voice: false, place: 3, manner: 0 },
  g: { voice: true, place: 3, manner: 0 },
  f: { voice: false, place: 0, manner: 1 },
  v: { voice: true, place: 0, manner: 1 },
  s: { voice: false, place: 1, manner: 1 },
  z: { voice: true, place: 1, manner: 1 },
  m: { voice: true, place: 0, manner: 2 },
  n: { voice: true, place: 1, manner: 2 },
  l: { voice: true, place: 1, manner: 3 },
  r: { voice: true, place: 1, manner: 3 },
  w: { voice: true, place: 0, manner: 4 },
  j: { voice: true, place: 2, manner: 4 },
  h: { voice: false, place: 4, manner: 1 },
};

export function featureDistance(a, b) {
  const fa = FEATURES[a.toLowerCase()];
  const fb = FEATURES[b.toLowerCase()];
  if (!fa || !fb) return -1;
  let dist = 0;
  if (fa.voice !== fb.voice) dist++;
  if (fa.place !== fb.place) dist++;
  if (fa.manner !== fb.manner) dist++;
  return dist;
}

export const VOICING_PAIRS = [
  ['b', 'p'], ['d', 't'], ['g', 'k'], ['v', 'f'], ['z', 's'],
];

export function checkPhonotactics(word) {
  const lower = word.toLowerCase();
  const illegalBigrams = [];

  for (let i = 0; i < lower.length - 1; i++) {
    const bigram = lower[i] + lower[i + 1];
    if (ILLEGAL_BIGRAMS_INTERNAL.has(bigram)) {
      const exceptions = FOREIGN_EXCEPTIONS.get(bigram);
      if (exceptions && [...exceptions].some(exc => lower.includes(exc))) continue;
      illegalBigrams.push({ position: i, bigram });
    }
  }

  if (lower.length >= 2) {
    const onset = lower[0] + lower[1];
    if (ILLEGAL_ONSETS.has(onset)) {
      const exceptions = FOREIGN_EXCEPTIONS.get(onset);
      if (!(exceptions && [...exceptions].some(exc => lower.includes(exc)))) {
        illegalBigrams.push({ position: 0, bigram: onset });
      }
    }
  }

  const sonorityViolations = findSonorityViolations(word);
  const syllableWeightSuspects = checkSyllableWeight(word);
  const suspectCount = illegalBigrams.length + sonorityViolations.length + syllableWeightSuspects.length;

  return {
    word,
    illegalBigrams,
    sonorityViolations,
    syllableWeightSuspects,
    hasSuspects: suspectCount > 0,
    suspectCount,
  };
}

export function analyzeTextPhonotactics(text) {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const results = [];

  for (const word of words) {
    const clean = word.replace(/[,.;:!?"""„"()\[\]{}]+$/g, '').replace(/^[,.;:!?"""„"()\[\]{}]+/g, '');
    if (clean.length < 2) continue;
    const analysis = checkPhonotactics(clean);
    if (analysis.hasSuspects) results.push(analysis);
  }

  return results;
}
