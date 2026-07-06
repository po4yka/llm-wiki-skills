---
name: llm-wiki-eval
description: Evaluate whether an LLM-Wiki is actually useful. Use to measure retrieval hit rate, answer reuse, read/write ratio, review backlog, stale verified pages, unsupported claims, and with-wiki versus without-wiki answer quality.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to the wiki; optional write access for evaluation reports.
metadata:
  author: po4yka
  version: "0.1.0"
---

# LLM-Wiki Eval

## Goal

Measure whether the wiki improves real work instead of merely accumulating attractive notes.

## Inputs

- LLM-Wiki vault path.
- Recent questions, queries or tasks if available.
- `wiki/index.md`, `wiki/log.md`, `wiki/queries/`, lint reports.
- Optional evaluation question set.

## Procedure

### 1. Define evaluation scope

Choose one scope:

- whole vault;
- one domain;
- one project;
- recent 30/60/90-day activity;
- before/after migration.

### 2. Measure operational metrics

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

### 3. Run query tests

Use 10-20 realistic questions. For each, record:

```yaml
question: ""
used_wiki_pages: []
used_raw_sources: []
answer_saved: false
support_level: source-backed|wiki-backed|inferred|missing|conflicting
rating: useful|partial|miss
```

When possible, compare a with-wiki answer to a without-wiki answer.

### 4. Sample random pages

Open 10-20 random pages and score:

- clear purpose;
- source support;
- useful links;
- status accuracy;
- human synthesis boundary;
- reusability.

### 5. Recommend improvements

Prioritize fixes:

1. retrieval/index problems;
2. provenance gaps;
3. review backlog;
4. stale pages;
5. capture pipeline gaps;
6. unnecessary infrastructure.

## Output

```markdown
## Evaluation summary

## Metrics

## Query test results

## Random page sample

## Failure modes

## Recommended improvements

## Next measurement date
```

## Safety gates

- Do not optimize for vanity metrics such as note count or graph density.
- Do not mark pages trusted as part of evaluation.
- Do not reveal sensitive content in aggregated reports.
- Be explicit when evidence is too sparse for a strong conclusion.
