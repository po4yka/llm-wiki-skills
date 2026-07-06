# LLM-Wiki Skills

Portable Agent Skills for coding agents that help users understand, choose, build, migrate and operate **LLM-Wiki** systems.

LLM-Wiki is a pattern where an agent compiles raw sources into a persistent, human-readable, git-versioned Markdown wiki:

```text
raw/  ->  wiki/  ->  AGENTS.md / CLAUDE.md / skills
```

This repository packages that pattern as installable skills for Claude Code, Codex, Cursor, OpenCode and other Agent Skills-compatible coding agents.

## Install

List available skills:

```bash
npx skills add po4yka/llm-wiki-skills --list
```

Install the full pack for Claude Code:

```bash
npx skills add po4yka/llm-wiki-skills --skill '*' -a claude-code
```

Install selected advisory skills for Claude Code and Codex:

```bash
npx skills add po4yka/llm-wiki-skills \
  --skill llm-wiki-orient \
  --skill llm-wiki-choose \
  --skill llm-wiki-setup \
  -a claude-code -a codex
```

Use one skill without installing it:

```bash
npx skills use po4yka/llm-wiki-skills --skill llm-wiki-choose --agent claude-code
```

## Skill groups

### Learn and choose

| Skill | Use when |
|---|---|
| [`llm-wiki-orient`](skills/llm-wiki-orient/SKILL.md) | The user is new to LLM-Wiki and wants the pattern, trade-offs and solution landscape explained. |
| [`llm-wiki-news-radar`](skills/llm-wiki-news-radar/SKILL.md) | The user asks for fresh news, new projects, papers, releases or ecosystem changes. |
| [`llm-wiki-choose`](skills/llm-wiki-choose/SKILL.md) | The user needs help deciding whether to adopt OpenWiki, Obsidian/local-first tools, GraphRAG-like systems, qmd-style retrieval or a custom implementation. |

### Implement and migrate

| Skill | Use when |
|---|---|
| [`llm-wiki-setup`](skills/llm-wiki-setup/SKILL.md) | The user chose a target setup and wants installation, connection, config, hooks, templates or git workflow help. |
| [`llm-wiki-design`](skills/llm-wiki-design/SKILL.md) | The user wants to design or build a custom LLM-Wiki product, plugin, CLI or agent workflow. |
| [`llm-wiki-refactor`](skills/llm-wiki-refactor/SKILL.md) | The user already has documents, notes, docs folders or a vault and wants them reorganized into an LLM-Wiki. |
| [`llm-wiki-capture-pipeline`](skills/llm-wiki-capture-pipeline/SKILL.md) | The user wants capture/inbox pipelines from web clips, chat, PDFs, voice, Telegram, email or code sessions. |
| [`llm-wiki-team-rollout`](skills/llm-wiki-team-rollout/SKILL.md) | A team wants onboarding, ownership, PR review, permissions and knowledge-maintenance workflows. |

### Operate a wiki

| Skill | Use when |
|---|---|
| [`wiki-triage`](skills/wiki-triage/SKILL.md) | Inbox material needs sorting before full ingest. |
| [`wiki-ingest`](skills/wiki-ingest/SKILL.md) | Trusted raw sources should become source/entity/concept/synthesis pages. |
| [`wiki-query`](skills/wiki-query/SKILL.md) | A question should be answered from the compiled wiki and useful answers saved back. |
| [`wiki-lint`](skills/wiki-lint/SKILL.md) | The wiki needs structural health checks, stale-claim detection and review queues. |
| [`llm-wiki-trust-audit`](skills/llm-wiki-trust-audit/SKILL.md) | The user wants an anti-slop, provenance, confidence and human-synthesis audit. |

## Repository contents

| Path | Purpose |
|---|---|
| [`skills/`](skills/) | Installable Agent Skills. Each folder has a `SKILL.md` with valid Agent Skills frontmatter. |
| [`skills.sh.json`](skills.sh.json) | Directory grouping metadata for skills.sh-style discovery. |
| [`docs/`](docs/) | Conceptual reference docs behind the skills. |
| [`templates/`](templates/) | Starter vault files, schemas and page templates. |

## Safety principle

Automate **bookkeeping**, not belief.

The agent may maintain links, frontmatter, indexes, logs, drafts, MOCs, deduplication candidates and lint reports. Human review remains responsible for synthesis, acceptance of ambiguous claims and promotion from draft to reviewed/verified knowledge.

## Current status

Draft skills pack. The landscape around LLM-Wiki, wiki memory, OpenWiki and agent memory is moving quickly, so skills that answer current-state questions must browse and cite fresh sources rather than rely on bundled static claims.
