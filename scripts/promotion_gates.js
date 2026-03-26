#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    if (!argv[i].startsWith('--')) continue;
    const key = argv[i].slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true;
    args[key] = value;
    if (value !== true) i += 1;
  }
  return args;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function getMetric(comparison, task, metric) {
  return comparison && comparison.global && comparison.global[task]
    ? comparison.global[task][metric] || null
    : null;
}

function buildCheck(severity, name, passed, details) {
  return { severity, name, passed, details };
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.comparison || !args.out) {
    console.error('Usage: node scripts/promotion_gates.js --comparison <comparison.json> --out <promotion.json>');
    process.exit(1);
  }

  const comparison = readJson(args.comparison);
  const checks = [];

  const missingCurrent = (comparison.segment_comparison && comparison.segment_comparison.missing_in_current) || [];
  const missingCandidate = (comparison.segment_comparison && comparison.segment_comparison.missing_in_candidate) || [];

  checks.push(
    buildCheck(
      'fail',
      'dataset_or_segment_mismatch',
      missingCurrent.length === 0 && missingCandidate.length === 0,
      { missing_in_current: missingCurrent, missing_in_candidate: missingCandidate }
    )
  );

  const flowDet = getMetric(comparison, 'flow', 'determinism_ok_rate');
  checks.push(
    buildCheck(
      'fail',
      'flow_determinism_must_remain_100_percent',
      !flowDet || flowDet.candidate === null || flowDet.candidate === 1,
      { metric: flowDet }
    )
  );

  const spinDet = getMetric(comparison, 'spin', 'determinism_ok_rate');
  checks.push(
    buildCheck(
      'fail',
      'spin_determinism_must_remain_100_percent',
      !spinDet || spinDet.candidate === null || spinDet.candidate === 1,
      { metric: spinDet }
    )
  );

  const flowNoChange = getMetric(comparison, 'flow', 'no_change_accuracy');
  checks.push(
    buildCheck(
      'fail',
      'flow_no_change_must_not_regress',
      !flowNoChange || flowNoChange.delta === null || flowNoChange.delta >= 0,
      { metric: flowNoChange }
    )
  );

  const flowGlobal = getMetric(comparison, 'flow', 'global_score');
  checks.push(
    buildCheck(
      'fail',
      'flow_global_score_must_not_drop',
      !flowGlobal || flowGlobal.delta === null || flowGlobal.delta >= 0,
      { metric: flowGlobal }
    )
  );

  const spinFalseAlarm = getMetric(comparison, 'spin', 'false_alarm_rate');
  checks.push(
    buildCheck(
      'fail',
      'spin_false_alarm_rate_must_not_increase',
      !spinFalseAlarm || spinFalseAlarm.delta === null || spinFalseAlarm.delta <= 0,
      { metric: spinFalseAlarm }
    )
  );

  const spinGlobal = getMetric(comparison, 'spin', 'global_score');
  checks.push(
    buildCheck(
      'warn',
      'spin_global_score_should_not_drop',
      !spinGlobal || spinGlobal.delta === null || spinGlobal.delta >= 0,
      { metric: spinGlobal }
    )
  );

  const flowCharDrift = getMetric(comparison, 'flow', 'avg_char_drift');
  checks.push(
    buildCheck(
      'warn',
      'flow_avg_char_drift_jump',
      !flowCharDrift || flowCharDrift.delta === null || flowCharDrift.delta <= 0.05,
      { metric: flowCharDrift, threshold: 0.05 }
    )
  );

  const flowTokenDrift = getMetric(comparison, 'flow', 'avg_token_drift');
  checks.push(
    buildCheck(
      'warn',
      'flow_avg_token_drift_jump',
      !flowTokenDrift || flowTokenDrift.delta === null || flowTokenDrift.delta <= 0.05,
      { metric: flowTokenDrift, threshold: 0.05 }
    )
  );

  const segments = (comparison.segment_comparison && comparison.segment_comparison.segments) || [];
  let regressionCount = 0;
  let totalComparedItems = 0;
  for (const seg of segments) {
    const counts = seg.per_item_counts || {};
    regressionCount += (counts.regressed || 0) + (counts.new_no_change_violation || 0) + (counts.new_false_alarm || 0);
    for (const key of Object.keys(counts)) totalComparedItems += counts[key] || 0;
  }
  const regressionRate = totalComparedItems > 0 ? regressionCount / totalComparedItems : 0;
  const regressionPassed = regressionCount <= 25 && regressionRate <= 0.1;
  checks.push(
    buildCheck('warn', 'many_new_regressions', regressionPassed, {
      regression_count: regressionCount,
      total_compared_items: totalComparedItems,
      regression_rate: regressionRate,
      thresholds: { max_count: 25, max_rate: 0.1 }
    })
  );

  const failedChecks = checks.filter((c) => c.severity === 'fail' && !c.passed).map((c) => c.name);
  const warningChecks = checks.filter((c) => c.severity === 'warn' && !c.passed).map((c) => c.name);

  let status = 'PASS';
  if (failedChecks.length > 0) status = 'FAIL';
  else if (warningChecks.length > 0) status = 'WARN';

  const promotion = {
    status,
    failed_checks: failedChecks,
    warning_checks: warningChecks,
    checks
  };

  ensureDirForFile(args.out);
  fs.writeFileSync(args.out, `${JSON.stringify(promotion, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${args.out}`);
}

main();
