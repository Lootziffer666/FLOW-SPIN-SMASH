# FLOW

Deterministic text repair engine with grammar-aware analysis, benchmark tooling, and a native Windows tray shell.

FLOW started as a bounded orthographic normalizer.  
It is now broader than that: the repository contains the correction pipeline itself, grammar/context analysis components, a lab-oriented evaluation layer, and a Windows-native real-time wrapper.

The core principle has not changed:

- deterministic over “smart”
- bounded repair over opaque rewriting
- inspectable behavior over black-box magic
- measurable quality over vibes

---

## What FLOW is

FLOW is currently a combination of four connected layers:

1. **Repair Engine**  
   Rule-based normalization and correction.

2. **Grammar / Context Layer**  
   Clause detection, contextual window rules, confidence filtering, and grammar-oriented rule handling.

3. **Lab / Benchmark Layer**  
   Benchmark inputs, run state, suite views, promotion flow, and test-driven evaluation.

4. **Native Windows Shell**  
   A WinForms tray application that connects the engine to real-time desktop usage.

This repository is therefore **not just a spellchecker** and **not just a desktop wrapper**.  
It is an evolving correction system with its own evaluation surface.

---

## Scope

FLOW is designed for **bounded text repair**, not for unrestricted rewriting.

### In scope

- orthographic normalization
- phoneme–grapheme correction
- morphology-aware repair
- punctuation / surface cleanup
- grammar-aware analysis and rule support
- deterministic pipeline execution
- benchmarkable output quality
- real-time Windows usage through a tray app

### Out of scope

- generative paraphrasing
- stylistic ghostwriting
- “AI improvement” without traceability
- freeform semantic rewriting
- hidden tone changes presented as correction

---

## Repository structure

```text
assets/                     Splash screens, tray icons, startup sound
docs/                       Protocol, comparison, review and process docs
src/                        Engine, grammar/context logic, lab UI/state
test/                       Unit, rule, batch, grammar, lab and integration tests

FLOW_Normalizer.cs          Native Windows tray app
FlowNormalizer.csproj       .NET project
build.bat                   Windows build script
build.sh                    Cross-platform publish helper
package.json                Node scripts and test entrypoints
````

### Notable source files

```text
src/
  AppShell.js
  LabConsolePage.js
  PromoteWizard.js
  SuiteRunsPage.js
  benchmarkInputs.js
  clauseDetector.js
  confidenceFilter.js
  contextWindowRules.js
  flowRulesStore.js
  labState.js
  loom_cli.js
  phoneticSimilarity.js
  pipeline.js
  ruleEngine.js
  rules.en.js
  rules.gr.js
  rules.mo.js
  rules.pg.js
  rules.punct.js
  rules.sl.js
  rules.sn.js
  uiBinding.js
```

---

## Conceptual architecture

```text
Windows Native Layer (C#)
        │
        ▼
CLI Wrapper (loom_cli.js)
        │
        ▼
Pipeline (pipeline.js)
        │
        ├── Rule Engine
        │     ├── SN
        │     ├── SL
        │     ├── MO
        │     ├── PG
        │     └── punctuation / surface cleanup
        │
        ├── Grammar / Context Layer
        │     ├── clause detection
        │     ├── grammar rules
        │     ├── context window rules
        │     └── confidence filtering
        │
        └── Lab / Evaluation Layer
              ├── benchmark inputs
              ├── suite runs
              ├── console / review
              └── promotion workflow
```

---

## Pipeline

The original core pipeline remains central:

`SN → SL → MO → PG`

Where useful, that bounded chain is now supported by adjacent analysis components rather than treated as an isolated spelling-only pass.

### Layer overview

* **SN** — syntactic / surface normalization
* **SL** — syllabic / letter-pattern normalization
* **MO** — morphological normalization
* **PG** — phoneme–grapheme correction
* **GR / Context support** — clause-aware and window-based rule handling where the pipeline needs more than token-local repair

---

## Why FLOW exists

Many text tools fail in one of two ways:

* they are too weak to repair noisy real-world input
* or they are too “smart” and silently rewrite meaning, tone, or structure

FLOW exists to stay bounded while still being useful.

It aims to answer a stricter question:

> Can text repair be strong, reproducible, inspectable, and benchmarkable without collapsing into black-box rewriting?

---

## Quick start

### CLI normalization

```bash
node src/loom_cli.js "ich hab das gestern gelsen"
```

### English mode

```bash
node src/loom_cli.js --lang en "i definately dont know"
```

### Learn an exception

```bash
node src/loom_cli.js --learn-exception "teh" "the"
```

---

## Installation

### Node.js layer

Requirements:

* Node.js 18+

Install dependencies:

```bash
npm install
```

### Native Windows layer

Requirements:

* .NET 8 SDK
* Node.js 18+ in `PATH`

---

## Tests

FLOW already includes more than a single “does normalization run” check.

### Full suite

```bash
npm test
```

### Focused runs

```bash
npm run test:unit
npm run test:rules
npm run test:lab
npm run test:batch
npm run debug:rules
```

### What is covered

The current scripts indicate coverage for:

* normalization behavior
* UI integration
* learned rule handling
* grammar rules
* phonetic similarity
* confidence filtering
* rule debugging
* randomized LRS-style batch testing
* lab integration

This matters because FLOW is not meant to be judged by anecdotal examples alone.

---

## Benchmark and lab layer

A major part of this repository is the shift from “tool that edits text” to “system whose behavior can be evaluated”.

The lab-facing files in `src/` show that FLOW now includes an internal evaluation surface:

* benchmark input handling
* suite run management
* lab console views
* promotion workflow
* run-state handling

This turns FLOW into more than an autocorrect engine.
It becomes a correction system with an explicit quality loop.

### Practical implication

Changes should ideally not be justified by:

* “sounds better”
* “looks smarter”
* “the model liked it”

They should be justified by:

* lower damage
* better retention of valid text
* stronger handling of noisy text
* cleaner boundary behavior
* better benchmark outcomes

---

## Native Windows app

`FLOW_Normalizer.cs` is the Windows tray shell around the Node-based engine.

It is intended for real-time usage and diagnostics rather than just offline CLI calls.

### Build

#### Debug

```bash
dotnet build FlowNormalizer.csproj
```

#### Release

```bash
dotnet build FlowNormalizer.csproj -c Release
```

#### Self-contained single-file EXE

```bash
dotnet publish FlowNormalizer.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -o publish
```

### Build helpers

```bash
build.bat
build.bat publish
./build.sh publish
```

---

## Troubleshooting

* Check the tray balloon on startup
* Open **Status anzeigen**
* Run **Diagnose erneut prüfen**
* Inspect `flow_startup.log`
* Verify `node -v`
* Verify `loom_cli.js` and `pipeline.js` are available where expected
* Run a manual CLI sanity test:

```bash
node src/loom_cli.js "ich hab zeit"
```

---

## Language support

| Setting         | Description                        |
| --------------- | ---------------------------------- |
| Default         | German (`de`)                      |
| ENV             | `FLOW_LANGUAGE=en`                 |
| CLI             | `--lang en`                        |
| Hotkey          | `Ctrl+Alt+Space` toggles `DE ↔ EN` |
| Optional preset | `--en-preset en-prose-plus`        |

Learned exceptions are stored per language in `flow_rules.json`.

---

## Docs

The `docs/` folder contains process and comparison material, including:

* evolution protocol
* comparison notes
* external review notes
* PR body / process material
* unusual approaches

That means the repo does not just contain code.
It also carries part of its own reasoning and development record.

---

## Current status

FLOW is best described as an **active engine repo** with four live concerns:

* correction
* grammar/context analysis
* benchmarking / lab evaluation
* native desktop delivery

It is already operational, but clearly still evolving.

The important thing is that the repo should no longer be described as **only** an orthographic normalizer.
That origin still matters, but it is no longer the whole truth.

---

## Design principles

* deterministic where possible
* bounded instead of overreaching
* explicit quality loops
* inspectable internals
* no fake smartness
* repair first, hallucination never

---

## License

Currently `UNLICENSED`.

