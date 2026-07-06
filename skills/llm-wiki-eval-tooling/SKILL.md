---
name: llm-wiki-eval-tooling
description: Map LLM-Wiki evaluation goals to concrete tools and CI gates. Use when the user wants Ragas, promptfoo, DeepEval, TruLens, LangSmith, retrieval metrics, red-team tests, prompt regression tests, or a with-wiki versus without-wiki benchmark.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse current tool docs before giving package commands, metric names or integration details.
metadata:
  author: po4yka
  version: "0.1.0"
---

# LLM-Wiki Eval Tooling

## Goal

Turn LLM-Wiki usefulness, retrieval quality, grounding and safety questions into measurable tests and repeatable CI or review gates.

## Inputs

- Wiki path and evaluation scope.
- User claim to test, such as “the wiki saves time” or “hybrid retrieval improved answers”.
- Recent real questions/tasks.
- Retrieval layer details.
- Model/provider policy.
- Desired tools: Ragas, promptfoo, DeepEval, TruLens, LangSmith, custom scripts.

## Procedure

### 1. Pick evaluation layer

| Layer | Question | Tools/metrics |
|---|---|---|
| Retrieval | Did we find the right wiki/source pages? | recall@k, MRR, nDCG, hit/miss labels, Ragas context precision/recall. |
| Grounding | Is the answer supported by sources? | citation coverage, claim audit, Ragas faithfulness/groundedness, manual support labels. |
| Wiki usefulness | Did the wiki reduce work? | retrieval hit rate, answer reuse, read/write ratio, output beyond vault, time saved estimate. |
| Prompt/model regression | Did behavior change after prompt/model edits? | promptfoo, DeepEval, LangSmith evals, snapshot tests. |
| Safety | Can malicious sources or prompts bypass policy? | promptfoo red-team, garak, custom malicious-source fixtures. |
| Operational health | Is the wiki alive and trusted? | `wiki-lint`, stale-page count, review backlog, unsupported claims, broken links. |

### 2. Build an eval set

Use 10-20 real questions for a pilot and expand only after the first run.

Record each item:

```yaml
id: ""
question: ""
expected_answer_traits: []
required_pages: []
required_sources: []
forbidden_sources: []
sensitivity: public|internal|sensitive|regulated|unknown
answer_type: factual|synthesis|comparison|decision|debugging|planning
must_cite_sources: true
```

### 3. Compare baselines

Use at least two modes when possible:

| Mode | Purpose |
|---|---|
| no-wiki | Baseline answer using only general model/context. |
| raw-RAG/search only | Measures whether precompiled wiki pages add value. |
| wiki-grep | Minimal LLM-Wiki baseline. |
| wiki-hybrid | Tests semantic/hybrid upgrade. |
| wiki-graph | Tests graph-aware upgrade. |

Do not claim a stack is better unless the eval set represents the user's real work.

### 4. Choose tools

| Tool | Use when |
|---|---|
| Ragas | RAG/context/faithfulness metrics and test data workflows. |
| promptfoo | Declarative prompt/model/RAG tests, CI, red-team and local matrix comparisons. |
| DeepEval | Unit-test style LLM app metrics and CI-friendly evaluation. |
| TruLens | Tracing/feedback functions for RAG and groundedness workflows. |
| LangSmith | Tracing, datasets, experiments and evals for LangChain/LangGraph-heavy stacks. |
| Phoenix/Arize or OpenTelemetry | Observability, traces and retrieval diagnostics. |
| Custom lint scripts | Wiki-specific structure, provenance, stale pages and review backlog. |

### 5. Define gates

Example gates:

```yaml
retrieval_recall_at_5_min: 0.80
citation_coverage_min: 0.90
unsupported_claims_max: 0
sensitive_leakage_max: 0
broken_links_max: 0
stale_verified_pages_max: 5
review_backlog_max: 25
prompt_regression_failures_max: 0
```

For early pilots, report gates without failing CI until the team agrees thresholds are fair.

### 6. Report actionably

Every eval report should include:

- what changed;
- what improved;
- what regressed;
- examples of misses;
- likely root causes;
- next fix;
- whether the next fix is schema, retrieval, ingestion, prompt or review process.

## Output

```markdown
## Evaluation plan

## Eval set schema

## Baselines

## Tooling recommendation

## Metrics and gates

## CI/review workflow

## Failure taxonomy

## Next skill
```

## Safety gates

- Do not optimize for note count, graph density or other vanity metrics.
- Do not use synthetic questions alone to justify adoption.
- Do not run evals on sensitive material through cloud tools without policy approval.
- Do not hide examples of failed queries; they are the most useful output.
- Do not claim external benchmarks prove the user's local wiki will work.
