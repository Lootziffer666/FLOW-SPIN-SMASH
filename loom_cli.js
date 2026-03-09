// loom_cli.js
// Minimaler CLI-Wrapper für FLOW-Pipeline (stdout: nur korrigierter Text)

const { runCorrection } = require('./pipeline.js');

const input = process.argv.slice(2).join(' ').trim();
if (!input) {
  process.stdout.write('');
  process.exit(0);
}

try {
  const result = runCorrection(input);
  process.stdout.write((result && result.corrected) || '');
} catch {
  // Für externe Aufrufer robust bleiben: bei Fehlern leere Ausgabe statt Stacktrace.
  process.stdout.write('');
  process.exit(0);
}
