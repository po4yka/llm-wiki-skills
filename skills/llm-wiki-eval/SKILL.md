---
name: llm-wiki-eval
description: Define and execute LLM-Wiki measurement, including bounded pilot benchmarks. Use for usefulness, grounding, maintenance-health, and citation-coverage metrics, baseline vs with-wiki comparison, scoring, and decision gates; route framework/CI choices to llm-wiki-eval-tooling.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to the wiki; optional write access for evaluation reports.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Eval

## Goal

Measure whether the wiki improves real work instead of merely accumulating attractive notes.

Use `references/docs/18-evaluation-methodology.md` for the detailed methodology: retrieval metrics, grounding metrics, with-wiki experiments, human calibration, operational health, security gates and rollout roadmap.

Use `references/benchmarks/pilot-questions.md` and `references/benchmarks/scoring-rubric.md` when the user wants a bounded pilot benchmark with baseline and with-wiki passes.

## When to use

- The user asks to measure, benchmark or score whether the wiki is actually useful, not just growing.
- The user requests a bounded pilot benchmark with a baseline pass versus a with-wiki pass.
- The user wants a continue/pause/redesign decision for the LLM-Wiki workflow or a specific domain.
- The user wants to check grounding, citation coverage or unsupported-claim rate on recent answers.
- The user wants an operational-health check (staleness, review backlog, freshness lag) as part of a periodic review.
- Route pure tooling/CI/framework selection questions to `llm-wiki-eval-tooling` instead.

## Inputs

- LLM-Wiki vault path.
- Recent questions, queries or tasks if available.
- `wiki/index.md`, `wiki/log.md`, `wiki/queries/`, lint reports and eval reports.
- Optional evaluation question set or qrels.
- Optional adoption claim to test, such as "this wiki saves time" or "this beats RAG for our questions".
- Optional risk tier: low, medium, high, critical.

## Procedure

### 1. Define evaluation scope

Choose one scope:

- whole vault;
- one domain;
- one project;
- recent 30/60/90-day activity;
- before/after migration;
- pilot with 20-50 sources and 10-20 realistic questions;
- high-stakes slice such as policies, runbooks or customer data procedures.

### 2. State the evidence level

Classify the evaluation as:

| Evidence level | Meaning |
| --- | --- |
| external direct | Published LLM-Wiki benchmark or implementation evidence. |
| external adjacent | GraphRAG, memory, context-engineering or RAG benchmark evidence. |
| local operational | This user's own metrics, query tests, traces and human review. |

Local operational evidence should decide whether the workflow is worth continuing for this user.

### 3. Evaluate in layers

Do not produce one opaque score. Score these layers separately:

| Layer | Core question | Metrics |
| --- | --- | --- |
| Retrieval | Did we find the right pages/passages? | recall@k, MRR, nDCG, hit/miss labels. |
| Grounding | Are answer claims supported? | citation coverage, unsupported-claim rate, faithfulness, support labels. |
| Answer quality | Does it solve the task? | human rubric, pairwise preference, correctness, completeness. |
| Wiki usefulness | Does it reduce work? | answer reuse, retrieval hit rate, read/write ratio, context reconstruction avoided. |
| Operational health | Is it alive and governed? | stale-page rate, review backlog, provenance coverage, broken links. |
| Security | Can untrusted content bypass policy? | prompt-injection success, PII/secret leakage, cross-tenant leakage. |

### 4. Measure operational metrics

Collect:

| Metric | Meaning |
| --- | --- |
| retrieval hit rate | How often real answers used existing wiki pages. |
| answer reuse rate | How often saved query pages are reused. |
| read/write ratio | Whether the wiki is read, not only written. |
| review backlog | Draft/ambiguous pages waiting for human review. |
| provenance coverage | Important claims with sources. |
| stale verified pages | Trusted pages past refresh date. |
| output beyond vault | Reports, PRs, essays, decisions, docs shipped from wiki. |
| context reconstruction avoided | How often the wiki prevents re-explaining/re-reading old context. |
| freshness lag | Time between source change and wiki/index update. |

### 5. Run query tests

Use 10-20 realistic questions for a small pilot; 200-300 examples for a serious local benchmark.

For each, record:

```yaml
id: ""
question: ""
query_type: exact|conceptual|synthesis|multi-hop|recent|sensitive
used_wiki_pages: []
used_raw_sources: []
required_pages: []
required_sources: []
forbidden_sources: []
answer_saved: false
support_level: extracted|inferred|ambiguous|synthesis|unsupported|conflicting
citation_coverage: 0.0
unsupported_claims: 0
rating: useful|partial|miss
risk_tier: low|medium|high|critical
time_saved_estimate: none|small|medium|large
```

When possible, compare a with-wiki answer to a without-wiki answer under the same model and prompt family.

### 5a. Run pilot benchmark mode when requested

Use this mode when the user asks to run a small benchmark, baseline pass, with-wiki pass, scoring rubric or continue/pause/redesign decision.

Build a 10-20 question set from real work. Include:

- factual lookup;
- synthesis across sources;
- decision provenance;
- stale/current fact;
- context recovery;
- output generation from wiki knowledge.

Run the with-wiki pass using `wiki/index.md`, search, relevant wiki pages and raw sources when needed. Record pages used and support level.

Run the baseline pass only when comparable baseline data is available. Use no wiki, raw search only or the previous workflow. Do not fabricate baseline data.

Score each question on:

- correctness and support;
- time-to-context;
- answer completeness;
- provenance quality;
- whether the answer was reusable;
- user usefulness rating.

Then recommend:

```text
continue | pause automation | redesign structure | improve provenance | improve retrieval | stop using LLM-Wiki for this domain
```

### 6. Run grounding checks

For answer samples:

- split answer into sentences or atomic claims;
- verify each claim has a citation or support source;
- classify support as source-backed, wiki-backed, inferred, missing or conflicting;
- count unsupported material claims;
- check that citations point to valid pages/sources/anchors;
- oversample high-risk answers for human review.

Recommended starting gates:

| Risk tier | Citation coverage | Unsupported claims |
| --- | ---: | ---: |
| Low | >= 0.80 | <= 0.10 |
| Medium | >= 0.90 | <= 0.05 |
| High | >= 0.95 | <= 0.02 |
| Critical | >= 0.98 | 0 material unsupported claims |

### 7. Sample random pages

Open 10-20 random pages and score:

- clear purpose;
- source support;
- useful links;
- status accuracy;
- human synthesis boundary;
- freshness metadata;
- review state;
- reusability.

### 8. Test the living-wiki loop

Check whether the wiki has evidence of:

```text
capture -> triage -> ingest -> query -> file-back -> lint -> review -> refresh -> eval
```

A wiki that only captures and never files back/lints/evaluates is likely becoming an archive, not a living knowledge base.

### 9. Classify failure modes

| Failure | Likely fix |
| --- | --- |
| Relevant page missing from top-k | Retrieval/index/chunking fix. |
| Relevant page found but answer unsupported | Prompt/context-packing/grounding fix. |
| Correct answer but no citations | Answer formatting/citation enforcement fix. |
| Citation exists but does not support claim | Claim verifier/citation span fix. |
| Draft/rejected page used | Review-state filter fix. |
| Sensitive page surfaced | Permission/sensitivity filter fix. |
| Stale page trusted | Freshness/review policy fix. |
| Human says answer is bad but metrics pass | Judge/rubric calibration fix. |
| Metrics regress but humans prefer output | Label/qrel/rubric review. |
| Security red-team succeeds | Instruction hierarchy/tool boundary/redaction fix. |

### 10. Recommend improvements

Prioritize fixes:

1. security and data-boundary failures;
2. retrieval/index problems;
3. grounding and unsupported claims;
4. provenance gaps;
5. review backlog;
6. stale pages;
7. capture pipeline gaps;
8. missing answer file-back;
9. unnecessary infrastructure.

### 11. Decide continue / pause / redesign

Use:

| Decision | Use when |
| --- | --- |
| continue | Retrieval and grounding are improving; no critical safety failures. |
| continue with gates | Utility is visible but eval/security debt remains. |
| pause | Data is insufficient or review/security debt blocks trust. |
| redesign | Core workflow does not improve real tasks or repeatedly violates trust boundaries. |

## Output

```markdown
## Evaluation summary

## Scope and evidence level

## Layered metrics

## Query test results

## Grounding and citation audit

## Living-wiki loop check

## Random page sample

## Failure modes

## Security findings

## Recommended improvements

## Continue / pause / redesign decision

## Next measurement date
```

For pilot benchmark mode, include:

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

- Do not optimize for vanity metrics such as note count or graph density.
- Do not mark pages trusted as part of evaluation.
- Do not reveal sensitive content in aggregated reports.
- Be explicit when evidence is too sparse for a strong conclusion.
- Do not claim external benchmarks prove local success; use local metrics to decide.
- Do not rely only on LLM judges; keep human calibration samples.
- Do not compare runs across changed datasets without recording dataset revision.
