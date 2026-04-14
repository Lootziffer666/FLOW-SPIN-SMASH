# FLOW/SPIN Corpus & Benchmark Review

## Current State
- Normalized SQLite DB built at `artifacts/corpora.sqlite3`.
- Total ingested samples: **30172**.

## Source Coverage
|source|samples|
|---|---|
|rueg|30172|

## Benchmark Summary
- Status: **executed**
- Cases: **80**
- Pass rate: **100.00%**

## Coverage Gaps
- Limited sentence-level imports outside RUEG + Birkbeck misspelling lists.
- Minimal expected-output gold for some robustness domains.

## Data Quality Issues
- Multiple archives are nested and partially overlapping; manifest dedupe mitigates duplicates.
- Some files are papers/binaries that are not directly benchmarkable.

## Hardening Recommendations
- Track per-corpus parser status and fail ingest when parser coverage regresses.
- Version pattern-suite generation by hash to guarantee deterministic benchmark baselines.

## Top 3 Next Steps
1. Expand non-RUEG parsers (Falko/Litkey XML, ANSELM CoraXML) to structured sentence-level imports.
2. Introduce gold normalization labels for multilingual/noisy cases and add CI threshold gates.
3. Add error-bucket analytics (diacritics, compounding, punctuation, code-switch) to prioritize rule upgrades.
