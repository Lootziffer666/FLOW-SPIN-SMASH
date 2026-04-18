'use strict';

const shared = require('@loot/shared');
const clause = require('./clauseDetector');
const chunker = require('./chunker');
const structural = require('./structuralState');
const signals = require('./signalLayer');

module.exports = {
  ...shared,
  ...clause,
  ...chunker,
  ...structural,
  ...signals,

  // explizit festnageln, damit nichts versehentlich überschrieben wird
  chunkSentence: chunker.chunkSentence,
  chunkText: chunker.chunkText,
  tokenizeText: chunker.tokenizeText,
  tagTokens: chunker.tagTokens,
  TAG: chunker.TAG,
};
