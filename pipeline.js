const { runNormalization } = require('./ruleEngine');

function runCorrection(text) {
  const corrected = runNormalization(text);
  return { corrected };
}

module.exports = {
  runCorrection,
};
