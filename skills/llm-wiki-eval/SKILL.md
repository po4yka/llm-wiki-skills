---
name: llm-wiki-eval
description: Evaluate whether an LLM-Wiki is actually useful. Use to measure retrieval hit rate, answer reuse, read/write ratio, review backlog, stale verified pages, unsupported claims, and with-wiki versus without-wiki answer quality.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to the wiki; optional write access for evaluation reports.
metadata:
  author: po4yka
  version: "0.2.0"
---

# LLM-Wiki Eval

## Goal

Measure whether the wiki improves real work instead of merely accumulating attractive notes.

## Inputs

- LLM-Wiki vault path.
- Recent questions, queries or tasks if available.
- `wiki/index.md`, `wiki/log.md`, `wiki/queries/`, lint reports.
- Optional evaluation question set.
- Optional adoption claim to test, such as "this wiki saves time" or "this beats RAG for our questions".

## Procedure

### 1. Define evaluation scope

Choose one scope:

- whole vault;
- one domain;
- one project;
- recent 30/60/90-day activity;
- before/after migration;
- pilot with 20-50 sources and 10-20 realistic questions.

### 2. State the evidence level

Classify the evaluation as:

| Evidence level | Meaning |
|---|---|
| external direct | Published LLM-Wiki benchmark or implementation evidence. |
| external adjacent | GraphRAG, memory, context-engineering or RAG benchmark evidence. |
| local operational | This user's own metrics and query tests. |

Local operational evidence should decide whether the workflow is worth continuing for this user.

### 3. Measure operational metrics

Collect:

| Metric | Meaning |
|---|---|
| retrieval hit rate | How often real answers used existing wiki pages. |
| answer reuse rate | How often saved query pages are reused. |
| read/write ratio | Whether the wiki is read, not only written. |
| review backlog | Draft/ambiguous pages waiting for human review. |
| provenance coverage | Important claims with sources. |
| stale verified pages | Trusted pages past refresh date. |
| output beyond vault | Reports, PRs, essays, decisions, docs shipped from wiki. |
| context reconstruction avoided | How often the wiki prevents re-explaining/re-reading old context. |

### 4. Run query tests

Use 10-20 realistic questions. For each, record:

```yaml
question: ""
used_wiki_pages: []
used_raw_sources: []
answer_saved: false
support_level: source-backed|wiki-backed|inferred|missing|conflicting
rating: useful|partial|miss
time_saved_estimate: none|small|medium|large
```

When possible, compare a with-wiki answer to a without-wiki answer.

### 5. Sample random pages

Open 10-20 random pages and score:

- clear purpose;
- source support;
- useful links;
- status accuracy;
- human synthesis boundary;
- reusability.

### 6. Test the living-wiki loop

Check whether the wiki has evidence of:

```text
capture -> triage -> ingest -> query -> file-back -> lint -> review -> refresh
```

A wiki that only captures and never files back/lints is likely becoming an archive, not a living knowledge base.

### 7. Recommend improvements

Prioritize fixes:

1. retrieval/index problems;
2. provenance gaps;
3. review backlog;
4. stale pages;
5. capture pipeline gaps;
6. missing answer file-back;
7. unnecessary infrastructure.

## Output

```markdown
## Evaluation summary

## Evidence level

## Metrics

## Query test results

## Living-wiki loop check

## Random page sample

## Failure modes

## Recommended improvements

## Continue / pause / redesign decision

## Next measurement date
```

## Safety gates

- Do not optimize for vanity metrics such as note count or graph density.
- Do not mark pages trusted as part of evaluation.
- Do not reveal sensitive content in aggregated reports.
- Be explicit when evidence is too sparse for a strong conclusion.
- Do not claim external benchmarks prove local success; use local metrics to decide.
