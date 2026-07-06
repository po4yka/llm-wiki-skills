# Skills overview

> Status: draft
> Scope: how the included skill specs implement LLM-Wiki operations.

## Thesis

Skills are operators over the wiki. They should describe **how to work**, not hide domain knowledge inside prompts.

This repository provides four core skills:

| Skill | Operation | Output |
|---|---|---|
| [`wiki-triage`](../skills/wiki-triage/SKILL.md) | inbox -> candidates | triage report and proposed moves |
| [`wiki-ingest`](../skills/wiki-ingest/SKILL.md) | raw source -> wiki pages | source/entity/concept updates |
| [`wiki-query`](../skills/wiki-query/SKILL.md) | question -> grounded answer | answer plus optional saved page |
| [`wiki-lint`](../skills/wiki-lint/SKILL.md) | wiki -> health report | report, not silent truth edits |

## Skill boundaries

### `wiki-triage`

Use when material is messy, recent or not yet worth full ingestion.

It should:

- scan inbox items;
- classify keep/drop/defer;
- propose page types;
- identify duplicates;
- create a review report;
- avoid promoting material to trusted status.

### `wiki-ingest`

Use when a source is worth adding to the durable wiki.

It should:

- preserve source provenance;
- extract claims, entities and concepts;
- stage low-confidence claims;
- update pages;
- update index and log.

### `wiki-query`

Use when answering from the compiled wiki.

It should:

- inspect `index.md`;
- search the wiki;
- verify against source pages or raw sources when needed;
- distinguish extraction from inference;
- save reusable answers.

### `wiki-lint`

Use for trust maintenance.

It should:

- report structural and provenance issues;
- find stale claims and contradictions;
- produce a review queue;
- avoid silent conflict resolution.

## Skill composition

A typical daily loop:

```text
capture -> wiki-triage -> wiki-ingest -> wiki-query -> wiki-lint
```

A typical weekly loop:

```text
wiki-lint -> review report -> targeted ingest/query -> index cleanup
```

## Shared rules for all skills

1. Read `AGENTS.md` and `CLAUDE.md` first if present.
2. Preserve raw sources.
3. Preserve human-owned sections.
4. Prefer diffs and reports over silent rewrites.
5. Mark uncertainty explicitly.
6. Update `wiki/log.md` for durable changes.
7. Update `wiki/index.md` when a page becomes important to navigation.

## Suggested downstream installation

```text
.claude/
  skills/
    wiki-triage/SKILL.md
    wiki-ingest/SKILL.md
    wiki-query/SKILL.md
    wiki-lint/SKILL.md
```

If the agent runtime uses another skill format, keep the same contracts:

- trigger conditions;
- inputs;
- write permissions;
- output format;
- safety gates;
- completion checklist.

## Anti-patterns

- One giant `second-brain` skill that does everything.
- Skills that contain hundreds of lines of domain facts.
- Skills that write verified pages without review.
- Query answers that are not saved when reusable.
- Lint jobs that rewrite truth instead of surfacing review tasks.
