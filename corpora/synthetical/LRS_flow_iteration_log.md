# FLOW LRS Iterationsprotokoll (16. April 2026)

## Ablauf

1. **Testlauf 1 (Baseline)**
   - Command: `node packages/flow/eval_lrs.js > corpora/synthetical/LRS_flow_eval_report_round1.md`
2. **Verbesserung 1 (Regelerweiterung)**
   - Erweiterte Orthografie-Regeln in `SL`, `MO`, `PG`, `SN`.
3. **Testlauf 2**
   - Command: `node packages/flow/eval_lrs.js > corpora/synthetical/LRS_flow_eval_report_round2.md`
4. **Verbesserung 2 (weitere Regelerweiterung)**
   - Zusätzliche mappings für häufige lautnahe und Segmentierungsfehler.
5. **Testlauf 3**
   - Command: `node packages/flow/eval_lrs.js > corpora/synthetical/LRS_flow_eval_report_round3.md`

## Wichtiger Hinweis

- In allen drei Läufen wurden **alle 70 Sätze mindestens partiell verändert**.
- Die aktuellste Vollauswertung (inkl. dokumentierter Regelentscheidungen pro Satz und Stage) liegt in:
  - `corpora/synthetical/LRS_flow_eval_report.md` (entspricht Round 3)
