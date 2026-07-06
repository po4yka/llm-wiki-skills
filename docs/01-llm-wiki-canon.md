# LLM-Wiki canon

> Status: draft
> Scope: canonical mental model of LLM-Wiki as a data-layer pattern.

## Thesis

LLM-Wiki is a **persistent, compounding wiki generated and maintained by an LLM from immutable raw sources**. Its value comes from lowering the bookkeeping cost of a living knowledge base: summaries, cross-links, indexes, status updates, contradiction checks and resurfacing of relevant older material.

The pattern is not a note-taking app. It is a data-layer architecture for agentic knowledge work.

## The canonical triad

```text
raw/     immutable source of truth
wiki/    generated and curated knowledge layer
schema/  AGENTS.md, CLAUDE.md, skills and schemas
```

| Layer | Contents | Owner | Rule |
|---|---|---|---|
| `raw/` | PDFs, clips, transcripts, datasets, screenshots, source exports | Human / capture tools | Append-only; agent may read but not rewrite. |
| `wiki/` | Source pages, entity pages, concept pages, comparisons, syntheses, query results | Agent with human review | Agent may edit, but changes must be diffable. |
| `schema` | Conventions, templates, allowed statuses, workflows, skills | Human + agent | Small enough to load; stable enough to trust. |

## Required files

### `index.md`

The content-oriented map of the wiki. It should be read first by the agent before any serious query or ingest task.

Design constraints:

- one concise line per important page;
- grouped by topic, entity, project or source family;
- small enough to fit in context;
- updated during ingest and lint;
- not a dump of every frontmatter field.

### `log.md`

The append-only chronological activity trail.

Recommended format:

```markdown
## [2026-07-06] ingest | Source title

- Raw source: raw/sources/source-title.md
- Wiki pages touched: wiki/sources/source-title.md, wiki/concepts/example.md
- Review status: draft
- Open questions: 2
```

## The three operations

### 1. Ingest

Ingest turns one or more raw sources into structured wiki updates.

A strong ingest pass should:

1. read the raw source;
2. extract source-level claims and entities;
3. ask for review when claims are ambiguous;
4. create or update source, entity and concept pages;
5. update `index.md` and `log.md`;
6. avoid overwriting human synthesis.

Important invariant: **do not combine source interpretation, wiki placement and global reconciliation into one unreviewed pass**. Two-step ingest is safer: analyze first, write second.

### 2. Query

Query answers a user question from the compiled wiki and, when needed, from raw sources.

A strong query pass should:

1. inspect `index.md`;
2. use `rg`/search over the wiki before raw-source diving;
3. cite source pages or raw sources where possible;
4. mark inference versus extraction;
5. offer to file useful answers back into `wiki/queries/` or `wiki/synthesis/`.

The filing-back step is what turns useful chat output into compounding knowledge instead of chat exhaust.

### 3. Lint

Lint is the health-check operation.

It should detect:

- orphan pages;
- broken wikilinks;
- stale claims;
- missing source backlinks;
- unreviewed high-impact claims;
- duplicate or near-duplicate pages;
- contradictory pages;
- pages that should be promoted, merged or archived;
- data gaps that require additional research.

Lint should usually **report**, not silently resolve truth conflicts.

## What LLM-Wiki is not

LLM-Wiki is not:

- a replacement for raw sources;
- a replacement for retrieval;
- a fully autonomous truth engine;
- an excuse to stop reviewing generated summaries;
- a graph database requirement;
- a product category tied to one vendor.

## Design invariants

1. Raw sources are preserved.
2. The wiki is human-readable Markdown.
3. Every non-trivial claim should be traceable.
4. Agent edits must be reviewable through git.
5. The schema layer must stay smaller than the wiki.
6. Good answers become durable pages.
7. Bookkeeping may be automated; belief adoption may not.

## Minimal viable LLM-Wiki

```text
vault/
  raw/
    sources/
    assets/
  wiki/
    index.md
    log.md
    sources/
    entities/
    concepts/
    synthesis/
    queries/
  AGENTS.md
  CLAUDE.md
```

This is enough for the first 50-100 sources. Add hybrid search, vector indexes or graph infrastructure only after the index stops being a useful map.
