# Anti-slop and trust

> Status: draft
> Scope: controls that prevent an LLM-Wiki from becoming organized misinformation.

## Thesis

The main risk of LLM-Wiki is not that it fails obviously. The main risk is that it succeeds aesthetically: clean structure, confident summaries and rich links can create false trust. The trust model must be designed before the wiki becomes large.

## Failure modes

### Context poisoning

A wrong summary becomes the context for later answers, so one error compounds across the wiki.

Mitigation:

- keep raw sources immutable;
- preserve source backlinks;
- mark claim type and confidence;
- run contradiction lint;
- avoid autonomous rewrite loops.

### Summary drift

Repeated rewrites smooth away detail, caveats and minority views.

Mitigation:

- prefer additive updates over full rewrites;
- keep source pages tied to source hashes;
- preserve old versions through git;
- lint for unsupported claims.

### Link hallucination

The agent creates plausible cross-links that imply relationships not present in sources.

Mitigation:

- type relationships as `extracted`, `inferred` or `ambiguous`;
- require low-confidence links to stay in draft reports;
- post-process links after the main summary is stable.

### Silent overwrite of human synthesis

The agent rewrites the part of the page where the human had done the actual thinking.

Mitigation:

- use explicit protected sections;
- add write guards in skills;
- require review for edits touching `## My synthesis`.

### Official-looking slop

Generated docs look complete enough to be treated as official knowledge.

Mitigation:

- lifecycle states;
- visible `review_required` field;
- provenance fields;
- stale dates;
- lint reports that are easy to read.

## Claim typing

Use these types consistently:

![Diagram of an agent auditing wiki content for evidence, confidence and review status.](assets/trust-audit.webp)

| Type | Meaning | Default action |
|---|---|---|
| `extracted` | Directly present in a source | Safe to summarize with citation. |
| `inferred` | Reasoned from one or more sources | Mark as inference. |
| `ambiguous` | Plausible but unresolved | Keep in review queue. |
| `synthesis` | Editorial conclusion | Human-owned unless explicitly delegated. |

## Confidence rules

- Use `0.0-1.0` confidence only when it affects workflow.
- Never use `0.5` as a lazy default.
- `ai_confidence < 0.70` should usually set `review_required: true`.
- High confidence does not remove the need for provenance.

## Review gates

| Trigger | Required gate |
|---|---|
| New source summary | Source-level provenance. |
| New synthesis page | Human review. |
| Bulk frontmatter migration | Dry-run report first. |
| Low-confidence extraction | Draft staging. |
| Contradiction found | Report, do not auto-resolve. |
| Stale time-sensitive page | Refresh or mark stale. |
| Protected section touched | Human approval. |

## Provenance levels

### Level 0: none

Useful only for scratch notes. Not acceptable for durable knowledge.

### Level 1: source-level

The page links to the source page or raw source that supports the overall summary.

### Level 2: claim-level

Individual claims link to specific source sections, paragraphs, line anchors or excerpts.

### Level 3: audit-ready

Claims include source hash, extraction date, model, confidence, review state and contradiction status.

For most personal workflows, Level 1 is the minimum and Level 2 is the target for important claims.

## Lint checks

A trustworthy `wiki-lint` should report:

- pages without inbound links;
- broken wikilinks;
- pages without `source_paths` or `source_urls`;
- high-confidence claims without provenance;
- low-confidence pages not in draft state;
- stale pages past `stale_after`;
- duplicate titles or IDs;
- vocabulary drift;
- protected human sections touched by agent commits;
- contradictions between pages.

## Rejection feedback loop

When a human rejects an agent output, store the reason. Future runs should read recent rejection reasons before writing.

Example:

```markdown
## Previous rejection reasons

- Created links to concepts not present in the source.
- Collapsed three competing claims into one conclusion.
- Removed a caveat from the human synthesis section.
```

This turns review into training signal for the workflow without fine-tuning a model.

## Draft staging

Low-confidence pages should go into `_agent/drafts/` or `wiki/*` with `status: draft` and `review_required: true`. Do not bury drafts in the same surface as verified knowledge without visible state.

## Human synthesis boundary

Use explicit markers when necessary:

```markdown
<!-- human-owned:start -->
## My synthesis

...
<!-- human-owned:end -->
```

Skills should treat these markers as read-only unless the user explicitly requests an edit.

## Trust metric

The practical quality of a knowledge base is the user's willingness to return to it. If the wiki produces beautiful but untrusted answers, the system has failed.
