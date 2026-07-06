# Skills overview

> Status: draft
> Scope: how the included installable Agent Skills help users adopt and operate LLM-Wiki systems.

## Thesis

This repository is not just a set of wiki maintenance commands. It is a **skill system for coding agents** that can guide a user through the full LLM-Wiki lifecycle:

```text
learn -> choose -> set up -> migrate -> operate -> audit -> evolve
```

Skills are operators over the user's context. They should describe **how to work**, not hide domain knowledge inside prompts.

## Skill map

### Learn and choose

| Skill | Purpose |
|---|---|
| [`llm-wiki-orient`](../skills/llm-wiki-orient/SKILL.md) | Explain the LLM-Wiki pattern, related ideas and solution landscape. |
| [`llm-wiki-news-radar`](../skills/llm-wiki-news-radar/SKILL.md) | Browse for fresh ecosystem news, releases, papers and technologies. |
| [`llm-wiki-choose`](../skills/llm-wiki-choose/SKILL.md) | Interview the user and recommend ready-made solution vs custom build. |

### Implement and migrate

| Skill | Purpose |
|---|---|
| [`llm-wiki-setup`](../skills/llm-wiki-setup/SKILL.md) | Install and connect a chosen LLM-Wiki workflow. |
| [`llm-wiki-design`](../skills/llm-wiki-design/SKILL.md) | Design a custom LLM-Wiki implementation, CLI, plugin or agent workflow. |
| [`llm-wiki-refactor`](../skills/llm-wiki-refactor/SKILL.md) | Refactor existing documents, docs folders or note vaults into an LLM-Wiki. |
| [`llm-wiki-capture-pipeline`](../skills/llm-wiki-capture-pipeline/SKILL.md) | Design inbox/capture pipelines from clips, chat, PDFs, voice and other sources. |
| [`llm-wiki-team-rollout`](../skills/llm-wiki-team-rollout/SKILL.md) | Roll out LLM-Wiki in a team with ownership, PR review and permissions. |

### Operate and trust

| Skill | Purpose |
|---|---|
| [`wiki-triage`](../skills/wiki-triage/SKILL.md) | Sort messy inbox material before full ingestion. |
| [`wiki-ingest`](../skills/wiki-ingest/SKILL.md) | Convert trusted raw sources into source/entity/concept pages. |
| [`wiki-query`](../skills/wiki-query/SKILL.md) | Answer questions from the compiled wiki and save reusable answers. |
| [`wiki-lint`](../skills/wiki-lint/SKILL.md) | Detect broken links, stale claims, provenance gaps and contradictions. |
| [`llm-wiki-trust-audit`](../skills/llm-wiki-trust-audit/SKILL.md) | Audit anti-slop controls, claim provenance, review gates and human-synthesis boundaries. |

## Installation model

This repo follows the Agent Skills structure:

```text
skills/<skill-name>/
  SKILL.md
  references/   # optional
  scripts/      # optional
  assets/       # optional
```

`SKILL.md` must have YAML frontmatter with `name` and `description`, and the `name` must match the directory.

## Skill composition

A typical advisory session:

```text
llm-wiki-orient -> llm-wiki-news-radar -> llm-wiki-choose
```

A typical personal adoption loop:

```text
llm-wiki-setup -> llm-wiki-refactor -> wiki-triage -> wiki-ingest -> wiki-query -> wiki-lint -> llm-wiki-trust-audit
```

A typical product/team loop:

```text
llm-wiki-design -> llm-wiki-team-rollout -> llm-wiki-setup -> wiki-lint -> llm-wiki-trust-audit
```

## Shared rules for all skills

1. Read existing project instructions before writing.
2. Preserve raw sources.
3. Preserve human-owned sections.
4. Prefer diffs and reports over silent rewrites.
5. Mark uncertainty explicitly.
6. For current ecosystem claims, browse and cite fresh sources.
7. Update `wiki/log.md` for durable changes in a user's vault.
8. Update `wiki/index.md` when a page becomes important to navigation.

## Anti-patterns

- One giant `second-brain` skill that does everything.
- Skills that contain hundreds of lines of volatile landscape facts.
- Skills that write verified pages without review.
- Query answers that are not saved when reusable.
- Lint jobs that rewrite truth instead of surfacing review tasks.
- Installation instructions tied to only one agent when the package is meant for multiple Agent Skills-compatible agents.
