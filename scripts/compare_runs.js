#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : true;
    args[key] = value;
    if (value !== true) i += 1;
  }
  return args;
}

function ensureDirForFile(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function toNumberOrNull(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toBool(value) {
  if (value === true || value === false) return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return false;
}

function segmentKey(seg) {
  return `${seg.lang}/${seg.task}/${seg.segment}`;
}

function metricNamesForTask(task) {
  if (task === 'flow') {
    return [
      'global_score',
      'any_gold_match_rate',
      'needs_change_success_rate',
      'no_change_accuracy',
      'overcorrection_rate',
      'changed_rate',
      'avg_char_drift',
      'avg_token_drift',
      'determinism_ok_rate'
    ];
  }
  if (task === 'spin') {
    return [
      'global_score',
      'primary_diagnosis_accuracy',
      'top2_diagnosis_accuracy',
      'unusual_valid_respect_rate',
      'false_alarm_rate',
      'determinism_ok_rate'
    ];
  }
  return [];
}

function buildMetrics(currentSeg, candidateSeg) {
  const names = new Set([...Object.keys(currentSeg || {}), ...Object.keys(candidateSeg || {})]);
  const metrics = {};
  for (const name of names) {
    const current = toNumberOrNull(currentSeg ? currentSeg[name] : null);
    const candidate = toNumberOrNull(candidateSeg ? candidateSeg[name] : null);
    if (current === null && candidate === null) continue;
    metrics[name] = {
      current,
      candidate,
      delta: current === null || candidate === null ? null : candidate - current
    };
  }
  return metrics;
}

function extractPerItem(reportJson) {
  if (!reportJson || typeof reportJson !== 'object') return [];
  if (Array.isArray(reportJson.per_item)) return reportJson.per_item;
  if (Array.isArray(reportJson.items)) return reportJson.items;
  if (Array.isArray(reportJson.perItem)) return reportJson.perItem;
  return [];
}

function loadSegmentReport(runRoot, seg) {
  const filePath = path.join(runRoot, seg.lang, seg.task, seg.segment, 'report.json');
  if (!fs.existsSync(filePath)) {
    return { exists: false, perItem: [], path: filePath };
  }
  const report = readJson(filePath);
  return { exists: true, perItem: extractPerItem(report), path: filePath };
}

function classifyFlow(currentItem, candidateItem, isNoChangeCase) {
  const currentMatched = toBool(currentItem && currentItem.matched_any);
  const candidateMatched = toBool(candidateItem && candidateItem.matched_any);
  const currentChanged = toBool(currentItem && currentItem.changed);
  const candidateChanged = toBool(candidateItem && candidateItem.changed);

  if (!currentMatched && candidateMatched) return 'fixed';
  if (currentMatched && !candidateMatched) return 'regressed';
  if (isNoChangeCase && !currentChanged && candidateChanged) return 'new_no_change_violation';
  if (isNoChangeCase && currentChanged && !candidateChanged) return 'resolved_no_change_violation';
  return 'unchanged';
}

function isSpinFalseAlarm(item) {
  const unusual = toBool(item && item.unusual_but_valid);
  const flagged = toBool(item && item.flagged);
  const predPrimary = item && item.pred_primary;
  return unusual && flagged && predPrimary !== 'FRAGILE';
}

function classifySpin(currentItem, candidateItem) {
  const currentPrimary = toBool(currentItem && currentItem.primary_correct);
  const candidatePrimary = toBool(candidateItem && candidateItem.primary_correct);
  const currentFalseAlarm = isSpinFalseAlarm(currentItem);
  const candidateFalseAlarm = isSpinFalseAlarm(candidateItem);

  if (!currentPrimary && candidatePrimary) return 'fixed';
  if (currentPrimary && !candidatePrimary) return 'regressed';
  if (!currentFalseAlarm && candidateFalseAlarm) return 'new_false_alarm';
  if (currentFalseAlarm && !candidateFalseAlarm) return 'resolved_false_alarm';
  return 'unchanged';
}

function comparePerItem(task, segmentName, currentItems, candidateItems) {
  const currentById = new Map();
  const candidateById = new Map();

  for (const item of currentItems || []) {
    const key = String(item && item.id !== undefined ? item.id : '');
    if (key) currentById.set(key, item);
  }
  for (const item of candidateItems || []) {
    const key = String(item && item.id !== undefined ? item.id : '');
    if (key) candidateById.set(key, item);
  }

  const labels = [
    'fixed',
    'regressed',
    'new_no_change_violation',
    'resolved_no_change_violation',
    'new_false_alarm',
    'resolved_false_alarm',
    'unchanged'
  ];

  const counts = Object.fromEntries(labels.map((label) => [label, 0]));
  const perItem = [];
  const allIds = new Set([...currentById.keys(), ...candidateById.keys()]);

  for (const id of allIds) {
    const current = currentById.get(id) || null;
    const candidate = candidateById.get(id) || null;
    let classification = 'unchanged';
    if (task === 'flow') {
      const isNoChangeCase = segmentName === 'no_change' || toBool((current || candidate || {}).no_change_case);
      classification = classifyFlow(current, candidate, isNoChangeCase);
    } else if (task === 'spin') {
      classification = classifySpin(current, candidate);
    }

    counts[classification] = (counts[classification] || 0) + 1;
    perItem.push({ id, classification, current, candidate });
  }

  return { counts, perItem };
}

function computeGlobalByTask(task, segments) {
  const metrics = metricNamesForTask(task);
  const result = {};

  for (const metric of metrics) {
    let currentWeighted = 0;
    let candidateWeighted = 0;
    let currentWeight = 0;
    let candidateWeight = 0;

    for (const seg of segments) {
      if (seg.task !== task) continue;
      const totalCurrent = toNumberOrNull(seg.current.total);
      const totalCandidate = toNumberOrNull(seg.candidate.total);
      const currentValue = toNumberOrNull(seg.current[metric]);
      const candidateValue = toNumberOrNull(seg.candidate[metric]);

      if (currentValue !== null && totalCurrent !== null) {
        currentWeighted += currentValue * totalCurrent;
        currentWeight += totalCurrent;
      }
      if (candidateValue !== null && totalCandidate !== null) {
        candidateWeighted += candidateValue * totalCandidate;
        candidateWeight += totalCandidate;
      }
    }

    const current = currentWeight > 0 ? currentWeighted / currentWeight : null;
    const candidate = candidateWeight > 0 ? candidateWeighted / candidateWeight : null;
    if (current === null && candidate === null) {
      result[metric] = { current: null, candidate: null, delta: null };
    } else {
      result[metric] = {
        current,
        candidate,
        delta: current === null || candidate === null ? null : candidate - current
      };
    }
  }

  return result;
}

function main() {
  const args = parseArgs(process.argv);
  const currentRoot = args.current;
  const candidateRoot = args.candidate;
  const outDir = args.out;

  if (!currentRoot || !candidateRoot || !outDir) {
    console.error('Usage: node scripts/compare_runs.js --current <dir> --candidate <dir> --out <dir>');
    process.exit(1);
  }

  const currentSegments = readJson(path.join(currentRoot, 'segments.json'));
  const candidateSegments = readJson(path.join(candidateRoot, 'segments.json'));

  const currentMap = new Map(currentSegments.map((seg) => [segmentKey(seg), seg]));
  const candidateMap = new Map(candidateSegments.map((seg) => [segmentKey(seg), seg]));
  const allKeys = new Set([...currentMap.keys(), ...candidateMap.keys()]);

  const missingInCurrent = [];
  const missingInCandidate = [];
  const segments = [];

  for (const key of allKeys) {
    const currentSeg = currentMap.get(key) || null;
    const candidateSeg = candidateMap.get(key) || null;

    if (!currentSeg) {
      missingInCurrent.push(key);
      continue;
    }
    if (!candidateSeg) {
      missingInCandidate.push(key);
      continue;
    }

    const currentReport = loadSegmentReport(currentRoot, currentSeg);
    const candidateReport = loadSegmentReport(candidateRoot, candidateSeg);
    const perItemComparison = comparePerItem(
      currentSeg.task,
      currentSeg.segment,
      currentReport.perItem,
      candidateReport.perItem
    );

    segments.push({
      key,
      lang: currentSeg.lang,
      task: currentSeg.task,
      segment: currentSeg.segment,
      current: currentSeg,
      candidate: candidateSeg,
      metrics: buildMetrics(currentSeg, candidateSeg),
      per_item_counts: perItemComparison.counts,
      per_item: perItemComparison.perItem,
      report_presence: {
        current: currentReport.exists,
        candidate: candidateReport.exists
      }
    });
  }

  segments.sort((a, b) => a.key.localeCompare(b.key));
  missingInCurrent.sort();
  missingInCandidate.sort();

  const comparison = {
    compared_at: new Date().toISOString(),
    run_current: currentRoot,
    run_candidate: candidateRoot,
    global: {
      flow: computeGlobalByTask('flow', segments),
      spin: computeGlobalByTask('spin', segments)
    },
    segment_comparison: {
      missing_in_current: missingInCurrent,
      missing_in_candidate: missingInCandidate,
      segments
    }
  };

  const outPath = path.join(outDir, 'comparison.json');
  ensureDirForFile(outPath);
  fs.writeFileSync(outPath, `${JSON.stringify(comparison, null, 2)}\n`, 'utf8');
  console.log(`Wrote ${outPath}`);
}

main();
