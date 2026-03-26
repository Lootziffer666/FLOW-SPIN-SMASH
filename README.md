# FLOW + SPIN + SMASH

Monorepo for three deterministic writing tools with a shared linguistic engine.

```
FLOW   repairs text         (orthographic normalization, grammar rules)
SPIN   diagnoses structure  (sentence chunks, drag & drop, 6 diagnostic states)
SMASH  breaks blockades     (micro-interventions for writer's block)
```

All tools share a common principle: **deterministic over "smart"**, **inspectable over black-box**, **no hidden semantic changes**.

---

## Architecture

```
                    @loot/shared
              ┌──────────┴──────────┐
              │  clauseDetector     │
              │  confidenceFilter   │
              │  phoneticSimilarity │
              │  contextWindowRules │
              │  rules.gr           │
              └──────────┬──────────┘
                    CJS + ESM
                 ┌────┼────┐
                 │    │    │
           @loot/flow │  @loot/spin
                      │
                @loot/smash
```

| Package | Description | Type |
|---------|-------------|------|
| `packages/shared` | Shared linguistic engine (clause detection, phonetics, grammar, confidence filtering) | CJS + ESM |
| `packages/flow` | Deterministic text repair pipeline (SN → SL → MO → PG → GR) + Lab + Windows tray app | CJS |
| `packages/spin` | Sentence structure diagnosis, chunk analysis, narrative graph | ESM |
| `packages/smash` | Writer's block micro-interventions (prototype) | standalone |

---

## Quick start

```bash
# Install all workspaces
npm install

# Run all tests
npm test

# FLOW: normalize text
node packages/flow/src/loom_cli.js "ich hab das gestern gelsen"
# → Ich habe das gestern gelesen

# FLOW: English mode
node packages/flow/src/loom_cli.js --lang en "i definately dont know"

# Root shim (backwards compatible with native Windows app)
node loom_cli.js "ich hab zeit"
```

**Requirements:** Node.js 18+

---

## Repository structure

```
package.json                     Workspace root (npm workspaces)
loom_cli.js                      Root shim for C# app compatibility

packages/
  shared/                        @loot/shared — Shared Linguistic Engine
    src/
      clauseDetector.js           Sentence/clause topology analysis
      confidenceFilter.js         Confidence-threshold filtering (CG-inspired)
      phoneticSimilarity.js       Cologne Phonetics (Koelner Phonetik)
      contextWindowRules.js       Multi-token context rules
      rules.gr.js                 German grammar normalization rules
      index.js                    CJS barrel export
    index.mjs                     ESM wrapper
    test/                         Standalone tests

  flow/                           @loot/flow — Text Repair Engine
    src/                          Pipeline, rule engine, rules, CLI, store
    lab/                          Lab state, benchmark, evaluation UI
    native/                       FLOW_Normalizer.cs, build scripts
    test/                         10 test suites
    assets/                       Splash screens, tray icons, sound

  spin/                           @loot/spin — Sentence Diagnosis
    src/                          Diagnosis, config, UI, earcons, nodes, phonotactics
    index.html                    Browser entry point (Tailwind + SortableJS)

  smash/                          @loot/smash — Blockade Breaker
    src/                          Prototype (placeholder)

docs/                             Shared documentation
```

---

## Tests

```bash
# All workspaces
npm test

# Individual packages
npm run test:shared
npm run test:flow
npm run test:spin

# FLOW focused runs
npm test -w packages/flow -- test:unit
npm test -w packages/flow -- test:rules
npm test -w packages/flow -- test:lab
npm test -w packages/flow -- test:batch
```

---

## Shared Engine (@loot/shared)

The shared engine provides linguistic primitives consumed by both FLOW and SPIN:

| Module | Purpose | Key exports |
|--------|---------|-------------|
| clauseDetector | Sentence/clause structure analysis | `detectClauses`, `splitSentences`, `SUBORDINATING_DE/EN` |
| confidenceFilter | CG-inspired rule filtering | `filterByConfidence`, `errorProfile` |
| phoneticSimilarity | Cologne Phonetics (Postel 1969) | `koelnerPhonetik`, `phoneticallyEqual`, `findPhoneticMatch` |
| contextWindowRules | Multi-token rules (2-5 words) | `contextWindowRules` array |
| rules.gr | German grammar rules | `GR_RULES` array |

**Dual export:** `require('@loot/shared')` (CJS) and `import from '@loot/shared'` (ESM).

---

## FLOW — Text Repair

Deterministic orthographic normalization with a multi-stage pipeline:

**SN** (syntactic) → **SL** (syllabic) → **MO** (morphological) → **PG** (phoneme-grapheme) → **GR** (grammar)

Plus: punctuation cleanup, context window rules, confidence filtering, learned exceptions.

Includes a Windows tray app (`FLOW_Normalizer.cs`) for real-time system-wide correction.

See [`packages/flow/README.md`](packages/flow/README.md) for full documentation.

---

## SPIN — Sentence Diagnosis

Diagnostic writing instrument with 6 structural diagnostic states:

`stabil` · `mehrkernig` · `konfliktaer` · `formal_stabil_semantisch_leer` · `normativ_selbstannullierend` · `performativ_instabil`

Features: chunk-based sentence decomposition, drag & drop reordering, DOGMA rules (structural resistance), earcon audio feedback, narrative node graph, phonotactic analysis.

---

## SMASH — Blockade Breaker

Targeted micro-interventions for writer's block. Not a text editor, not a writing course — a tool that converts "stillness" into "movement" through brief, low-friction interactions.

Currently in prototype phase.

---

## Ecosystem

| Tool | Layer | Function | Status |
|------|-------|----------|--------|
| FLOW | Repair | Bounded text normalization | Active |
| SPIN | Diagnosis | Sentence structure analysis | Active |
| SMASH | Unblocking | Micro-interventions | Prototype |
| Shared | Engine | Linguistic primitives | Active |

---

## Design principles

- deterministic over "smart"
- bounded repair over opaque rewriting
- inspectable behavior over black-box magic
- measurable quality over vibes
- no hidden semantic changes
- diagnosis before generation
- resistance as signal
- user remains author

---

## Language support

| Language | FLOW | SPIN |
|----------|------|------|
| German (de) | Full pipeline (default) | Full diagnosis (default) |
| English (en) | Conservative exceptions + presets | Clause detection |

---

## License

Currently `UNLICENSED`.
