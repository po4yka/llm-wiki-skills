# Evaluation and metrics

> Status: draft
> Scope: how to decide whether an LLM-Wiki workflow is actually working.
> Current as of: 2026-07-07

## Thesis

The success metric is not the number of notes. A successful LLM-Wiki helps produce better decisions, answers, writing and recall with less repeated context-building.

## Bad vanity metrics

Avoid optimizing for:

- total note count;
- total backlinks;
- total tags;
- daily streaks;
- graph beauty;
- number of plugins;
- size of the instruction file.

These can grow while the knowledge base becomes less useful.

## Practical success metrics

| Metric | Meaning | Healthy signal |
|---|---|---|
| Retrieval hit rate | How often answers use existing wiki pages | Rising over time |
| Read/write ratio | Whether the wiki is read, not only written | Reads are not near zero |
| Reuse rate | Saved answers reused later | Repeated questions get faster |
| Review backlog | Draft/ambiguous items waiting for human review | Visible and bounded |
| Provenance coverage | Important claims with source links | Increasing for high-impact pages |
| Stale page count | Time-sensitive pages needing refresh | Managed, not hidden |
| Surprise rate | Random old pages still produce useful ideas | Non-zero |
| Output beyond vault | Articles, decisions, PRs, reports, strategies | Increasing |

## Retrieval hit rate

For each serious query, record:

```yaml
query: "..."
date: 2026-07-06
used_wiki_pages: 4
used_raw_sources: 2
answer_saved: true
user_rating: useful|partial|miss
```

A low hit rate means either the wiki is not useful, retrieval is weak or questions are not being filed back.

## Review backlog

Track pages by status:

```text
draft: 42
reviewed: 118
verified: 23
stale: 9
archived: 31
```

A growing draft pile is not automatically bad. It is bad when important draft pages are indistinguishable from trusted pages.

## Lint report scorecard

A weekly lint report should include:

| Check | Count | Severity | Action |
|---|---:|---|---|
| Broken links | 0 | high | fix |
| Orphan pages | 12 | medium | review |
| Missing provenance | 8 | high | add sources or demote |
| Stale pages | 5 | medium | refresh or mark stale |
| Contradictions | 2 | high | human review |
| Vocabulary drift | 7 | low | normalize |
| Protected-section edits | 0 | critical | revert or review |

## Page quality rubric

Score important pages on a 0-2 scale:

| Dimension | 0 | 1 | 2 |
|---|---|---|---|
| Purpose | unclear | understandable | immediately clear |
| Provenance | none | source-level | claim-level for key claims |
| Links | isolated | some links | useful in/out links |
| Status | missing | present | accurate and current |
| Synthesis boundary | mixed | partly separated | clearly separated |
| Reusability | one-off | maybe reusable | repeatedly useful |

## Experiment design

Before adding infrastructure, run a small experiment:

1. Pick one domain.
2. Ingest 20-50 sources.
3. Ask 20 real questions.
4. Save useful answers.
5. Run lint twice.
6. Measure retrieval hit rate and review backlog.

Only then decide whether to add embeddings, graph storage or automation.

## Failure indicators

The workflow is failing if:

- you avoid reading the wiki because you do not trust it;
- generated pages look polished but cannot be traced to sources;
- lint reports are ignored;
- the agent frequently overwrites human synthesis;
- questions still start from raw web search instead of the wiki;
- the instruction file grows into a knowledge dump;
- there is no output beyond the vault.

## Quarterly review

Every quarter:

1. Open 20 random wiki pages.
2. Check whether each page is still useful.
3. Check provenance on the most important claims.
4. Archive or merge low-value pages.
5. Identify the top 5 missing pages.
6. Review the automation rules that caused bad pages.

## Decision rule

A smaller trusted wiki beats a large untrusted one. Optimize for durable reuse, not capture volume.
