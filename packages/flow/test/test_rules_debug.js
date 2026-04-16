const { runNormalization } = require('../src/ruleEngine');

const checks = [
  // PG rules
  { input: 'ich hab das', expectContains: 'habe das', label: 'PG hab -> habe' },
  { input: 'gelsen', expectContains: 'gelesen', label: 'PG gelsen -> gelesen' },
  { input: 'weis er noch', expectContains: 'weiß er noch', label: 'PG weis -> weiß' },
  { input: 'in der shule lernen', expectContains: 'in der Schule lernen', label: 'PG shule -> Schule' },

  // SN rules
  { input: 'er dachte das noch', expectContains: 'dachte, dass noch', label: 'SN dachte das -> dachte, dass' },
  { input: 'sie hat gesagt das wir', expectContains: 'gesagt, dass wir', label: 'SN gesagt das -> gesagt, dass' },
  { input: 'weiter gegangen', expectContains: 'weitergegangen', label: 'SN weiter gegangen -> weitergegangen' },
  { input: 'hab ich ausversehen', expectContains: 'aus Versehen', label: 'SN ausversehen -> aus Versehen' },
  { input: 'garnicht mehr', expectContains: 'gar nicht mehr', label: 'SN garnicht -> gar nicht' },

  // SL rules
  { input: 'wier kommen', expectContains: 'wir kommen', label: 'SL wier -> wir' },
  { input: 'er wolte gehen', expectContains: 'wollte gehen', label: 'SL wolte -> wollte' },
  { input: 'dan kam er', expectContains: 'dann kam er', label: 'SL dan -> dann' },
  { input: 'wen es regnet', expectContains: 'wenn es regnet', label: 'SL wen -> wenn' },
  { input: 'der balon gebrant', expectContains: 'gebrannt', label: 'SL gebrant -> gebrannt' },
  { input: 'trozdem weiter', expectContains: 'trotzdem weiter', label: 'SL trozdem -> trotzdem' },

  // MO rules
  { input: 'irgentwie falsch', expectContains: 'irgendwie falsch', label: 'MO irgentwie -> irgendwie' },
  { input: 'irgentwann später', expectContains: 'irgendwann später', label: 'MO irgentwann -> irgendwann' },
  { input: 'obwol ich', expectContains: 'obwohl ich', label: 'MO obwol -> obwohl' },
  { input: 'eigendlich nicht', expectContains: 'eigentlich nicht', label: 'MO eigendlich -> eigentlich' },
];

console.log('Debug rule checks');
let passed = 0;

for (const { input, expectContains, label } of checks) {
  const output = runNormalization(input);
  const ok = output.toLowerCase().includes(expectContains.toLowerCase());
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${label}`);
  if (!ok) {
    console.log(`  input:  ${input}`);
    console.log(`  output: ${output}`);
    console.log(`  need:   ${expectContains}`);
  } else {
    passed += 1;
  }
}

console.log(`\n${passed}/${checks.length} checks passed.`);
