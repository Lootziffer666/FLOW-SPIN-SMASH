/**
 * SPIN Konfiguration — Chunk-Typen, Marker, DOGMA-Regeln
 *
 * Zentrale Konfigurationsdatei für alle strukturellen Definitionen.
 * Alle Werte sind gemäß PRD und DEFINITION_OF_DONE_v0.3 festgelegt.
 */

// Alle Chunk-Typen gemäß PRD (inkl. evaluation.social)
export const CHUNK_TYPES = [
  'ornament',
  'core.subject',
  'core.predicate',
  'core.object',
  'apposition',
  'relation',
  'state',
  'evaluation.social',
  'judgement.normative',
];

// Selbstreferenz-Marker (für performativ_instabil)
export const META_MARKERS = [
  'satz', 'sprache', 'bedeutung', 'wahrheit', 'ausdruck',
];

// Negations-/Nullifikations-Marker (für performativ_instabil)
export const NULL_MARKERS = [
  'schweigt', 'zerfällt', 'verpufft', 'unlesbar', 'ohne bedeutung', 'schweigen',
];

// Negations-Marker für Polarität (für konfliktaer & normativ_selbstannullierend)
export const NEGATIVE_POLARITY = [
  'nicht', 'kein', 'nie', 'verweigert', 'scheitert',
  'unmöglich', 'falsch', 'schlecht', 'untragbar',
];

// Marker für normativ_selbstannullierend
export const NORM_NEGATORS = [
  'nicht gültig', 'nichtig', 'ohne grundlage',
  'existiert nicht', 'keinerlei gültigkeit', 'keine regeln',
];

/**
 * DOGMA-Regeln — Struktureller Widerstand
 *
 * Jede Regel definiert:
 * id — eindeutiger Bezeichner
 * from — Chunk-Typ, der verschoben wird
 * condition — Funktion(targetIdx, currentChunks) → true wenn Verstoß
 * reason — menschenlesbare Begründung
 */
export const DOGMA_RULES = [
  {
    id: 'subj_before_pred',
    from: 'core.predicate',
    condition: (targetIdx, currentChunks) => {
      const subjIdx = currentChunks.findIndex(c => c.type === 'core.subject');
      return subjIdx !== -1 && targetIdx < subjIdx;
    },
    reason: 'Ein Prädikat vor dem Subjekt unterbricht den Handlungsfluss.',
  },
  {
    id: 'obj_after_subj',
    from: 'core.object',
    condition: (targetIdx, currentChunks) => {
      const subjIdx = currentChunks.findIndex(c => c.type === 'core.subject');
      return subjIdx !== -1 && targetIdx < subjIdx;
    },
    reason: 'Das Objekt darf nicht vor dem handelnden Subjekt stehen.',
  },
  {
    id: 'no_obj_without_pred',
    from: 'core.object',
    condition: (_targetIdx, currentChunks) =>
      !currentChunks.some(c => c.type === 'core.predicate'),
    reason: 'Ein Objekt ohne Prädikat ist bedeutungslos.',
  },
];
