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

function pickMetric(segment, name) {
  return segment && segment.metrics && segment.metrics[name] ? segment.metrics[name] : { current: null, candidate: null, delta: null };
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.comparison || !args.promotion || !args.out) {
    console.error('Usage: node scripts/suite_runs_export.js --comparison <comparison.json> --promotion <promotion.json> --out <suite_runs_export.json>');
    process.exit(1);
  }

  const comparison = readJson(args.comparison);
  const promotion = readJson(args.promotion);
  const segments = (comparison.segment_comparison && comparison.segment_comparison.segments) || [];

  const rows = segments.map((seg) => {
    const counts = seg.per_item_counts || {};
    const globalScore = pickMetric(seg, 'global_score');
    const determinism = pickMetric(seg, 'determinism_ok_rate');
    const noChange = pickMetric(seg, 'no_change_accuracy');
    const falseAlarm = pickMetric(seg, 'false_alarm_rate');

    return {
      lang: seg.lang,
      task: seg.task,
      segment: seg.segment,
      total: seg.current && seg.current.total !== undefined ? seg.current.total : null,
      global_score_current: globalScore.current,
      global_score_candidate: globalScore.candidate,
      global_score_delta: globalScore.delta,
      determinism_ok_rate_current: determinism.current,
      determinism_ok_rate_candidate: determinism.candidate,
      determinism_ok_rate_delta: determinism.delta,
      no_change_accuracy_current: noChange.current,
      no_change_accuracy_candidate: noChange.candidate,
      no_change_accuracy_delta: noChange.delta,
      false_alarm_rate_current: falseAlarm.current,
      false_alarm_rate_candidate: falseAlarm.candidate,
      false_alarm_rate_delta: falseAlarm.delta,
      fixed: counts.fixed || 0,
      regressed: counts.regressed || 0,
      new_no_change_violation: counts.new_no_change_violation || 0,
      new_false_alarm: counts.new_false_alarm || 0,
      promotion_status: promotion.status
    };
  });

  const output = {
    promotion_status: promotion.status,
    run_current: comparison.run_current,
    run_candidate: comparison.run_candidate,
    rows
  };

  ensureDirForFile(args.out);
  fs.writeFileSync(args.out, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${args.out}`);
}

main();
