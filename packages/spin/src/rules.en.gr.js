/**
 * GR – Grammar Normalization (English)
 *
 * LanguageTool-inspired grammar rules for the English language.
 * Covered: APOSTROPHE_CONTRACTION, MODAL_OF, DOUBLE_COMPARATIVE,
 * WORD_REPEAT, COMMON_MISTAKES, REDUNDANCY, COMMA_INTRODUCTORY,
 * NON_STANDARD_NEGATION
 */

export const EN_GR_RULES = [
  // APOSTROPHE_CONTRACTION
  { id: 'en-gr-dont', from: /\bdont\b/gi, to: "don't", confidence: 0.98 },
  { id: 'en-gr-cant', from: /\bcant\b/gi, to: "can't", confidence: 0.91 },
  { id: 'en-gr-wont', from: /\bwont\b/gi, to: "won't", confidence: 0.97 },
  { id: 'en-gr-shouldnt', from: /\bshouldnt\b/gi, to: "shouldn't", confidence: 0.99 },
  { id: 'en-gr-wouldnt', from: /\bwouldnt\b/gi, to: "wouldn't", confidence: 0.99 },
  { id: 'en-gr-couldnt', from: /\bcouldnt\b/gi, to: "couldn't", confidence: 0.99 },
  { id: 'en-gr-isnt', from: /\bisnt\b/gi, to: "isn't", confidence: 0.99 },
  { id: 'en-gr-wasnt', from: /\bwasnt\b/gi, to: "wasn't", confidence: 0.99 },
  { id: 'en-gr-werent', from: /\bwerent\b/gi, to: "weren't", confidence: 0.99 },
  { id: 'en-gr-arent', from: /\barent\b/gi, to: "aren't", confidence: 0.99 },
  { id: 'en-gr-hasnt', from: /\bhasnt\b/gi, to: "hasn't", confidence: 0.99 },
  { id: 'en-gr-havent', from: /\bhavent\b/gi, to: "haven't", confidence: 0.99 },
  { id: 'en-gr-hadnt', from: /\bhadnt\b/gi, to: "hadn't", confidence: 0.99 },
  { id: 'en-gr-didnt', from: /\bdidnt\b/gi, to: "didn't", confidence: 0.99 },
  { id: 'en-gr-doesnt', from: /\bdoesnt\b/gi, to: "doesn't", confidence: 0.99 },
  { id: 'en-gr-mustnt', from: /\bmustnt\b/gi, to: "mustn't", confidence: 0.99 },
  { id: 'en-gr-neednt', from: /\bneednt\b/gi, to: "needn't", confidence: 0.99 },
  { id: 'en-gr-mightnt', from: /\bmightnt\b/gi, to: "mightn't", confidence: 0.99 },
  { id: 'en-gr-theyre', from: /\btheyre\b/gi, to: "they're", confidence: 0.98 },
  { id: 'en-gr-youre', from: /\byoure\b/gi, to: "you're", confidence: 0.98 },
  { id: 'en-gr-ive', from: /\bive\b/gi, to: "I've", confidence: 0.95 },
  { id: 'en-gr-youve', from: /\byouve\b/gi, to: "you've", confidence: 0.98 },
  { id: 'en-gr-theyve', from: /\btheyve\b/gi, to: "they've", confidence: 0.98 },
  { id: 'en-gr-weve', from: /\bweve\b/gi, to: "we've", confidence: 0.98 },
  { id: 'en-gr-theyll', from: /\btheyll\b/gi, to: "they'll", confidence: 0.98 },
  { id: 'en-gr-youll', from: /\byoull\b/gi, to: "you'll", confidence: 0.98 },
  { id: 'en-gr-theyd', from: /\btheyd\b/gi, to: "they'd", confidence: 0.98 },
  { id: 'en-gr-youd', from: /\byoud\b/gi, to: "you'd", confidence: 0.98 },

  // MODAL_OF
  { id: 'en-gr-could-of', from: /\bcould\s+of\b/gi, to: 'could have', confidence: 0.97 },
  { id: 'en-gr-should-of', from: /\bshould\s+of\b/gi, to: 'should have', confidence: 0.97 },
  { id: 'en-gr-would-of', from: /\bwould\s+of\b/gi, to: 'would have', confidence: 0.97 },
  { id: 'en-gr-might-of', from: /\bmight\s+of\b/gi, to: 'might have', confidence: 0.96 },
  { id: 'en-gr-must-of', from: /\bmust\s+of\b/gi, to: 'must have', confidence: 0.96 },

  // DOUBLE_COMPARATIVE
  { id: 'en-gr-more-better', from: /\bmore\s+better\b/gi, to: 'better', confidence: 0.96 },
  { id: 'en-gr-more-worse', from: /\bmore\s+worse\b/gi, to: 'worse', confidence: 0.96 },
  { id: 'en-gr-more-bigger', from: /\bmore\s+bigger\b/gi, to: 'bigger', confidence: 0.96 },
  { id: 'en-gr-more-smaller', from: /\bmore\s+smaller\b/gi, to: 'smaller', confidence: 0.96 },
  { id: 'en-gr-most-best', from: /\bmost\s+best\b/gi, to: 'best', confidence: 0.96 },
  { id: 'en-gr-most-worst', from: /\bmost\s+worst\b/gi, to: 'worst', confidence: 0.96 },

  // WORD_REPEAT
  { id: 'en-gr-word-repeat', from: /\b(the|a|an|and|or|but|in|on|at|to|for|of|with|by|from|is|are|was|were|be|been|has|have|had|do|does|did|will|would|shall|should|can|could|may|might|must|this|that|these|those|my|your|his|her|its|our|their|I|you|he|she|it|we|they|not|no|if|so|as)\s+\1\b/gi, to: '$1', confidence: 0.96 },

  // COMMON_MISTAKES
  { id: 'en-gr-alot', from: /\balot\b/gi, to: 'a lot', confidence: 0.98 },
  { id: 'en-gr-aswell', from: /\baswell\b/gi, to: 'as well', confidence: 0.98 },
  { id: 'en-gr-eachother', from: /\beachother\b/gi, to: 'each other', confidence: 0.98 },
  { id: 'en-gr-noone', from: /\bnoone\b/gi, to: 'no one', confidence: 0.97 },
  { id: 'en-gr-infront', from: /\binfront\b/gi, to: 'in front', confidence: 0.98 },
  { id: 'en-gr-atleast', from: /\batleast\b/gi, to: 'at least', confidence: 0.98 },
  { id: 'en-gr-ofcourse', from: /\bofcourse\b/gi, to: 'of course', confidence: 0.98 },

  // REDUNDANCY
  { id: 'en-gr-repeat-again', from: /\brepeat\s+again\b/gi, to: 'repeat', confidence: 0.91 },
  { id: 'en-gr-revert-back', from: /\brevert\s+back\b/gi, to: 'revert', confidence: 0.93 },
  { id: 'en-gr-return-back', from: /\breturn\s+back\b/gi, to: 'return', confidence: 0.88 },

  // COMMA_INTRODUCTORY
  { id: 'en-gr-comma-however', from: /([.!?]\s+)(However)\s+([a-z])/g, to: '$1$2, $3', confidence: 0.92 },
  { id: 'en-gr-comma-therefore', from: /([.!?]\s+)(Therefore)\s+([a-z])/g, to: '$1$2, $3', confidence: 0.92 },
  { id: 'en-gr-comma-furthermore', from: /([.!?]\s+)(Furthermore)\s+([a-z])/g, to: '$1$2, $3', confidence: 0.93 },

  // NON_STANDARD
  { id: 'en-gr-aint-is', from: /\b(it|he|she|that|this)\s+aint\b/gi, to: "$1 isn't", confidence: 0.88 },
  { id: 'en-gr-aint-are', from: /\b(we|they|you)\s+aint\b/gi, to: "$1 aren't", confidence: 0.88 },
];
