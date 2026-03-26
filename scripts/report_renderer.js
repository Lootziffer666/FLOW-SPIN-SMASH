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

function esc(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fmt(value) {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'number') return Number.isFinite(value) ? value.toFixed(6) : '—';
  return esc(value);
}

function deltaClass(metric, delta) {
  if (delta === null || delta === undefined) return 'neutral';
  const higherIsBad = new Set(['overcorrection_rate', 'changed_rate', 'avg_char_drift', 'avg_token_drift', 'false_alarm_rate']);
  if (higherIsBad.has(metric)) {
    if (delta < 0) return 'good';
    if (delta > 0) return 'bad';
    return 'neutral';
  }
  if (delta > 0) return 'good';
  if (delta < 0) return 'bad';
  return 'neutral';
}

function metricTable(taskName, metrics) {
  const rows = Object.keys(metrics || {}).map((metric) => {
    const row = metrics[metric] || {};
    return `<tr><td>${esc(metric)}</td><td>${fmt(row.current)}</td><td>${fmt(row.candidate)}</td><td class="${deltaClass(metric, row.delta)}">${fmt(row.delta)}</td></tr>`;
  });
  return `
    <section>
      <h2>${esc(taskName)} global metrics</h2>
      <table>
        <thead><tr><th>Metric</th><th>Current</th><th>Candidate</th><th>Delta</th></tr></thead>
        <tbody>${rows.join('')}</tbody>
      </table>
    </section>
  `;
}

function checksTable(promotion) {
  const rows = (promotion.checks || []).map((check) => {
    const cls = check.passed ? 'good' : check.severity === 'fail' ? 'bad' : 'warn';
    return `<tr><td>${esc(check.severity)}</td><td>${esc(check.name)}</td><td class="${cls}">${check.passed ? 'PASS' : 'FAIL'}</td><td><pre>${esc(JSON.stringify(check.details || {}, null, 2))}</pre></td></tr>`;
  });
  return `
    <section>
      <h2>Promotion gates</h2>
      <table>
        <thead><tr><th>Severity</th><th>Check</th><th>Result</th><th>Details</th></tr></thead>
        <tbody>${rows.join('')}</tbody>
      </table>
    </section>
  `;
}

function segmentTable(comparison) {
  const segments = (comparison.segment_comparison && comparison.segment_comparison.segments) || [];
  const rows = segments.map((seg) => {
    const counts = seg.per_item_counts || {};
    const metric = (seg.metrics && seg.metrics.global_score) || {};
    const noChangeReg = (counts.new_no_change_violation || 0) > 0;
    const cls = seg.segment === 'no_change' || noChangeReg ? 'highlight' : '';
    const summary = `fixed=${counts.fixed || 0}, regressed=${counts.regressed || 0}, new_no_change_violation=${counts.new_no_change_violation || 0}, new_false_alarm=${counts.new_false_alarm || 0}`;
    return `<tr class="${cls}"><td>${esc(seg.lang)}</td><td>${esc(seg.task)}</td><td>${esc(seg.segment)}</td><td>${fmt(seg.current && seg.current.total)}</td><td>${fmt(metric.current)}</td><td>${fmt(metric.candidate)}</td><td class="${deltaClass('global_score', metric.delta)}">${fmt(metric.delta)}</td><td>${esc(summary)}</td></tr>`;
  });

  return `
    <section>
      <h2>Segment comparison</h2>
      <p>Missing in current: ${(comparison.segment_comparison && comparison.segment_comparison.missing_in_current || []).length} | Missing in candidate: ${(comparison.segment_comparison && comparison.segment_comparison.missing_in_candidate || []).length}</p>
      <table>
        <thead><tr><th>Lang</th><th>Task</th><th>Segment</th><th>Total</th><th>Global score current</th><th>Global score candidate</th><th>Delta</th><th>Per-item summary</th></tr></thead>
        <tbody>${rows.join('')}</tbody>
      </table>
    </section>
  `;
}

function regressionSummary(comparison) {
  const segments = (comparison.segment_comparison && comparison.segment_comparison.segments) || [];
  let fixed = 0;
  let regressed = 0;
  let newNoChangeViolation = 0;
  let newFalseAlarm = 0;
  for (const seg of segments) {
    const counts = seg.per_item_counts || {};
    fixed += counts.fixed || 0;
    regressed += counts.regressed || 0;
    newNoChangeViolation += counts.new_no_change_violation || 0;
    newFalseAlarm += counts.new_false_alarm || 0;
  }
  return `
    <section>
      <h2>Regressions and fixes summary</h2>
      <ul>
        <li>Fixed: <strong>${fixed}</strong></li>
        <li>Regressed: <strong>${regressed}</strong></li>
        <li>New no_change violations: <strong>${newNoChangeViolation}</strong></li>
        <li>New false alarms: <strong>${newFalseAlarm}</strong></li>
      </ul>
    </section>
  `;
}

function badgeClass(status) {
  if (status === 'PASS') return 'badge-pass';
  if (status === 'WARN') return 'badge-warn';
  return 'badge-fail';
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.comparison || !args.promotion || !args.out) {
    console.error('Usage: node scripts/report_renderer.js --comparison <comparison.json> --promotion <promotion.json> --out <index.html>');
    process.exit(1);
  }

  const comparison = readJson(args.comparison);
  const promotion = readJson(args.promotion);

  const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>FLOW/SPIN Governance Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; color: #222; }
    table { border-collapse: collapse; width: 100%; margin: 12px 0 24px; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; vertical-align: top; }
    th { background: #f6f6f6; }
    .good { color: #137333; font-weight: 600; }
    .bad { color: #b42318; font-weight: 600; }
    .warn { color: #b54708; font-weight: 600; }
    .neutral { color: #555; }
    .highlight { background: #fff8d6; }
    .badge { padding: 4px 10px; border-radius: 999px; font-weight: 700; color: white; }
    .badge-pass { background: #137333; }
    .badge-warn { background: #b54708; }
    .badge-fail { background: #b42318; }
    pre { margin: 0; white-space: pre-wrap; }
  </style>
</head>
<body>
  <header>
    <h1>FLOW/SPIN Governance Report</h1>
    <p><strong>Current run:</strong> ${esc(comparison.run_current)}</p>
    <p><strong>Candidate run:</strong> ${esc(comparison.run_candidate)}</p>
    <p><strong>Compared at:</strong> ${esc(comparison.compared_at)}</p>
    <p><span class="badge ${badgeClass(promotion.status)}">${esc(promotion.status)}</span></p>
  </header>
  ${metricTable('FLOW', comparison.global && comparison.global.flow)}
  ${metricTable('SPIN', comparison.global && comparison.global.spin)}
  ${checksTable(promotion)}
  ${segmentTable(comparison)}
  ${regressionSummary(comparison)}
</body>
</html>`;

  ensureDirForFile(args.out);
  fs.writeFileSync(args.out, html, 'utf8');
  console.log(`Wrote ${args.out}`);
}

main();
