---
name: llm-wiki-eval-tooling
description: Select evaluation tools and CI gates for LLM-Wiki measurement. Use when the user asks which eval framework, dataset format, scorecard file, red-team config, prompt regression test, hosted/self-hosted service, or human calibration workflow to use; route actual pilot runs to llm-wiki-eval.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse current tool docs before giving package commands, metric names, license, pricing, hosted/self-hosted, deprecation or integration details.
metadata:
  author: po4yka
  version: "1.0.1"
  install_scope: self-contained
---

# LLM-Wiki Eval Tooling

## Goal

Turn LLM-Wiki usefulness, retrieval quality, grounding, security and maintenance questions into measurable tests, scorecards and repeatable CI/review gates.

Use `references/docs/18-evaluation-methodology.md` as the reference methodology for metric definitions, experiment design, dataset construction, CI strategy and rollout.

## When to use

- The user asks which eval framework, dataset format, scorecard, or CI gate fits their LLM-Wiki (e.g. "should we use Ragas or promptfoo", "what does a retrieval eval set look like").
- The user wants to prove or disprove a claim such as "the wiki saves time" or "hybrid retrieval improved answers" with measurable tests.
- The user needs to design PR-time, nightly, or release-time CI gates for retrieval, grounding, or security regressions.
- The user needs a red-team/prompt-injection test plan or a human calibration workflow for LLM judges.
- Route to `llm-wiki-eval` instead when the user wants an actual pilot run executed, not tool/format selection.

## Inputs

- Wiki path and evaluation scope.
- User claim to test, such as “the wiki saves time” or “hybrid retrieval improved answers”.
- Recent real questions/tasks or production traces.
- Retrieval layer details.
- Model/provider policy.
- Desired tools: Ragas, promptfoo, DeepEval, TruLens, LangSmith, OpenAI Evals/API Evals, Phoenix/Arize, pytrec_eval, custom scripts.
- Security constraints and risk tier.

## Procedure

### 1. Pick evaluation layer

| Layer | Question | Tools/metrics |
| --- | --- | --- |
| Retrieval | Did we find the right wiki/source pages? | recall@k, MRR, nDCG, qrels, hit/miss labels, pytrec_eval, Ragas context precision/recall. |
| Grounding | Is the answer supported by sources? | citation coverage, unsupported-claim rate, claim audit, Ragas/DeepEval faithfulness, TruLens groundedness. |
| Answer quality | Does the answer solve the task? | human rubric, pairwise preference, model-graded rubric, correctness/completeness/actionability. |
| Wiki usefulness | Did the wiki reduce work? | retrieval hit rate, answer reuse, read/write ratio, output beyond vault, time saved estimate. |
| Prompt/model regression | Did behavior change after prompt/model edits? | promptfoo, DeepEval, LangSmith evals, snapshot tests, PromptEval-style prompt variants. |
| Safety | Can malicious sources or prompts bypass policy? | promptfoo red-team, indirect prompt injection tests, PII/secret canaries, OWASP-aligned fixtures. |
| Operational health | Is the wiki alive and trusted? | `wiki-lint`, stale-page count, review backlog, provenance coverage, broken links. |

### 2. Choose the tool stack

| Need | Default recommendation |
| --- | --- |
| Fully open-source lean baseline | `pytrec_eval` + Ragas + promptfoo + custom wiki-lint/claim-audit scripts. |
| Python unit-test ergonomics | DeepEval plus custom tests. |
| Trace-level RAG introspection | TruLens. |
| Managed datasets, experiments and annotation queues | LangSmith. |
| Production observability | Phoenix/Arize, LangSmith, TruLens/OpenTelemetry or existing APM. |
| Fine-grained RAG diagnostics | RAGChecker-style analysis after basic gates exist. |
| Calibrated judge training with synthetic data | ARES-style workflow after human labels exist. |
| OpenAI-native eval workflows | OpenAI Evals/API Evals only after checking current deprecation/platform state. |

Do not require every tool. Pick the smallest stack that answers the user's evaluation question.

### 3. Build an eval set

Use 10-20 real questions for a pilot and expand only after the first run. For serious evaluation, build 200-300 examples plus a high-stakes slice.

Record each item:

```yaml
id: ""
question: ""
query_type: exact|conceptual|synthesis|multi-hop|recent|sensitive
expected_answer_traits: []
required_pages: []
required_sources: []
expected_passages: []
forbidden_sources: []
required_filters: {}
gold_answer_points: []
freshness_sla_days: 0
sensitivity: public|internal|sensitive|regulated|unknown
risk_tier: low|medium|high|critical
answer_type: factual|synthesis|comparison|decision|debugging|planning
must_cite_sources: true
```

Use synthetic generation only to expand coverage. Do not use synthetic questions alone to justify adoption.

### 4. Add qrels and support labels

Use TREC-style qrels for retrieval:

```yaml
relevance:
  wiki/page.md#heading: 3
  raw/source.pdf#p12: 2
  wiki/related.md#section: 1
```

Use support labels for grounding:

```yaml
support_level: extracted|inferred|ambiguous|synthesis|unsupported|conflicting
```

### 5. Compare baselines

Use at least two modes when possible:

| Mode | Purpose |
| --- | --- |
| no-wiki | Baseline answer using only general model/context. |
| raw-RAG/search only | Measures whether precompiled wiki pages add value. |
| wiki-grep | Minimal LLM-Wiki baseline. |
| wiki-hybrid | Tests semantic/hybrid upgrade. |
| wiki-hybrid-rerank | Tests reranker value. |
| wiki-graph | Tests graph-aware upgrade. |

Do not claim a stack is better unless the eval set represents the user's real work.

### 6. Define gates by risk tier

Example gates:

```yaml
retrieval:
  recall_at_10_min: 0.85
  mrr_min: 0.70
  ndcg_at_10_min: 0.80
grounding:
  citation_coverage_min: 0.90
  unsupported_claim_rate_max: 0.05
security:
  prompt_injection_success_rate_max: 0.05
  pii_secret_leaks_max: 0
  cross_tenant_leaks_max: 0
operations:
  stale_tier1_pages_max_pct: 5
  median_review_age_days_max: 7
  broken_verified_links_max: 0
```

For early pilots, report gates without failing CI until the team agrees thresholds are fair.

### 7. Plan CI/review workflow

PR-time checks:

- deterministic lint;
- broken links/citations;
- retrieval smoke set;
- promptfoo quality subset;
- secret/PII scan;
- no critical unsupported-claim regressions.

Nightly checks:

- full retrieval eval;
- full grounding eval;
- prompt-injection red team;
- stale-page report;
- review backlog report;
- latency/cost trend report.

Release checks:

- with-wiki vs without-wiki comparison;
- retrieval ablations for major index changes;
- human calibration review;
- security sign-off for public/team deployments.

### 8. Add human calibration

Monthly sample:

- 25 passing examples;
- 25 failing examples;
- 25 judge/human disagreements;
- 25 high-risk examples.

Use a rubric:

```yaml
correctness: 1-5
completeness: 1-5
groundedness: 1-5
citation_quality: 1-5
actionability: 1-5
risk: low|medium|high|critical
reviewer_notes: ""
```

Use human review to calibrate LLM judges and thresholds.

### 9. Report actionably

Every eval report should include:

- what changed;
- what improved;
- what regressed;
- examples of misses;
- likely root causes;
- next fix;
- whether the next fix is schema, retrieval, ingestion, prompt, review process, security or data policy.

### 10. Use templates

Recommended templates:

- `references/templates/retrieval-eval-set.yaml` for retrieval qrels and gates.
- `references/templates/eval-scorecard.yaml` for multi-layer scorecards.
- `references/templates/promptfoo-llm-wiki.yaml` for CI/rubric/security eval configuration.
- `references/templates/llm-wiki-evals.github-actions.yml` for a GitHub Actions starter workflow.

## Output

```markdown
## Evaluation plan

## Eval set schema

## Baselines and ablations

## Tooling recommendation

## Metrics and gates

## CI/review workflow

## Human calibration plan

## Security/red-team plan

## Scorecard

## Failure taxonomy

## Next skill
```

## Safety gates

- Do not optimize for note count, graph density or other vanity metrics.
- Do not use synthetic questions alone to justify adoption.
- Do not run evals on sensitive material through cloud tools without policy approval.
- Do not hide examples of failed queries; they are the most useful output.
- Do not claim external benchmarks prove the user's local wiki will work.
- Do not rely exclusively on LLM judges; keep human calibration.
- Do not compare eval runs across changed datasets without recording dataset revision.
