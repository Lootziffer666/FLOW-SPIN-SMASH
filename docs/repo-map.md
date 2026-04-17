# Repo Map — FLOW-SPIN-SMASH

## Purpose

This repository contains the core writing system stack:

- FLOW → normalization and writing-friction reduction
- SPIN → structural manipulation and expression shaping
- SMASH → interruption / unblock layer
- LOOM → canonical shared engine and linguistic foundation

This is a monorepo. Structure and ownership are strict.

---

## Canonical Packages

### packages/loom
Single source of truth for shared language and text-processing logic.

Responsibilities:
- grammar rules
- orthographic truth
- phonetic logic
- structural constraints
- shared linguistic and text-processing abstractions
- trigger/state-processing foundations used by downstream systems

Rules:
- no duplication of linguistic logic outside LOOM
- downstream packages must treat LOOM as canonical

### packages/flow
Normalization engine.

Uses LOOM for:
- correctness models
- orthographic truth
- shared linguistic constraints

Responsibilities:
- error detection
- normalization pipelines
- LRS-/Dyslexia-prioritized transformations
- FLOW-specific assistive behavior

### packages/spin
Structural writing tool.

Uses LOOM for:
- grammar validation
- structural constraints
- phonetic insights

Responsibilities:
- sentence decomposition
- word-object rendering
- structure manipulation
- expression transformation

### packages/smash
Intervention layer.

Uses LOOM for:
- text-state context
- trigger/detection support
- text-processing expertise

Responsibilities:
- break writing blocks
- trigger state changes through intervention
- remain lightweight in direct linguistic ownership

---

## Data / Knowledge Zones

### flow-db
Canonical FLOW-specific data layer.

Responsibilities:
- normalization pairs
- benchmark and evaluation data
- LRS-/Dyslexia-prioritized profiles
- FLOW-specific corpus and assistive data

Rules:
- not the canonical home of general language truth
- builds on LOOM knowledge rather than replacing it

### database
Supporting / transitional knowledge zone unless explicitly marked otherwise.

Rules:
- do not assume canonical ownership without checking local README/docs
- migrate only with semantic justification

### data/benchmark
Benchmark and evaluation material.

### corpora
Raw or source corpus inputs.

---

## Dependency Rules

Allowed:
- flow → loom
- spin → loom
- smash → loom
- smash → flow/spin (read-only or narrowly scoped integration)

Forbidden:
- loom → anything downstream
- flow ↔ spin direct coupling without explicit justification
- any package → deprecated shared layer

---

## Legacy / Migration

### old_main
Status: legacy / removed or removal-only reference

Rules:
- no new changes
- do not restore ownership from it

### shared
Status: deprecated, replaced by `packages/loom`

Rules:
- must not be used
- must not be reintroduced

---

## Structural Rules

- All core product logic lives in `/packages`
- Scripts orchestrate only
- Root must not become a hidden logic layer
- Docs describe and constrain structure; they are not a dumping ground for operational assets

---

## Testing & Validation

Fast validation:
`./scripts/verify-fast.ps1`

Full validation:
`./scripts/verify-full.ps1`

Targeted package test:
`./scripts/test-package.ps1 flow`

Loom impact check:
`./scripts/loom-impact-check.ps1`

---

## Change Protocol

When modifying LOOM:
- inspect impact on FLOW, SPIN, and SMASH
- check for duplicated rule ownership
- prefer extending LOOM over local hacks

When modifying FLOW:
- ensure normalization remains aligned with LOOM
- keep FLOW-specific profiles and assistive logic out of LOOM unless they become truly shared

When modifying SPIN:
- ensure structure rules remain aligned with LOOM

When modifying SMASH:
- avoid reimplementing FLOW/SPIN responsibilities
- keep trigger/detection ownership aligned with LOOM

When modifying data layers:
- preserve semantic separation between corpus input, benchmark data, rule docs, and runtime DB ownership

---

## Mental Model

LOOM defines truth.  
FLOW applies truth to normalization.  
SPIN reshapes truth into formable structure.  
SMASH breaks blockage around truth.
