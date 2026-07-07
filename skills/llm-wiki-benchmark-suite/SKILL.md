---
name: llm-wiki-benchmark-suite
description: Execute a bounded LLM-Wiki pilot benchmark. Use when the user already has or wants a small task set, baseline pass, with-wiki pass, scoring rubric, and continue/pause/redesign decision; route metric design to llm-wiki-eval and framework/CI choices to llm-wiki-eval-tooling.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to a vault and optional write access for benchmark reports.
metadata:
  author: po4yka
  version: "0.1.0"
  install_scope: self-contained
---

# LLM-Wiki Benchmark Suite

## Goal

Run a small, repeatable pilot that tests whether an LLM-Wiki helps the user's actual work.

## Inputs

- Target vault or domain.
- 20-50 representative sources if available.
- 10-20 realistic questions.
- Desired comparison: with-wiki, without-wiki, or before/after migration.

## Procedure

### 1. Read benchmark materials

Use `references/benchmarks/pilot-questions.md` and `references/benchmarks/scoring-rubric.md` when available.

### 2. Build the question set

Questions should include:

- factual lookup;
- synthesis across sources;
- decision provenance;
- stale/current fact;
- "where did I stop?" context recovery;
- output generation from wiki knowledge.

### 3. Run with-wiki pass

Use `wiki/index.md`, search, relevant wiki pages and raw sources when needed. Record pages used and support level.

### 4. Run baseline pass when possible

Compare against no wiki, raw search only, or previous workflow. Do not fabricate baseline data if it is not available.

### 5. Score results

Use:

- correctness/support;
- time-to-context;
- answer completeness;
- provenance quality;
- whether the answer was reusable;
- user usefulness rating.

### 6. Decide next action

Recommend:

```text
continue | pause automation | redesign structure | improve provenance | improve retrieval | stop using LLM-Wiki for this domain
```

## Output

```markdown
## Benchmark summary

## Question set

## With-wiki results

## Baseline comparison

## Metrics

## Failure modes

## Decision

## Next benchmark date
```

## Safety gates

- Do not overclaim from small pilots.
- Do not optimize for note count or graph density.
- Do not reveal sensitive source contents in benchmark summaries.
- Do not treat adjacent academic results as local proof.
