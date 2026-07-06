# LLM-Wiki Skills

Portable Agent Skills for coding agents that help users understand, choose, build, migrate, operate, evaluate and govern **LLM-Wiki** systems.

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
  --skill llm-wiki-faq \
  --skill llm-wiki-choose \
  --skill llm-wiki-setup \
  -a claude-code -a codex
```

Use one skill without installing it:

```bash
npx skills use po4yka/llm-wiki-skills --skill llm-wiki-faq --agent claude-code
```

## What this pack covers

The repository contains a full lifecycle skill system for LLM-Wiki adoption:

```text
learn -> answer objections -> choose -> diagnose -> plan -> set up -> migrate -> operate -> audit -> publish/archive -> evolve
```

It includes skills for:

- explaining the pattern and evidence behind it;
- choosing ready-made versus custom solutions;
- setting up local-first, repo-docs, Obsidian, MCP/API, retrieval, ingestion or team workflows;
- migrating existing document sets into `raw/` and `wiki/` structure;
- running triage, ingest, query and lint operations;
- benchmarking pilot value and evaluating whether the wiki is useful;
- auditing provenance, claim anchors, trust, security and model/data policy;
- refreshing stale sources, redacting private content, publishing and archiving;
- compiling reusable wiki procedures into installable Agent Skills.

## Skill groups

### Learn and choose

| Skill | Use when |
|---|---|
| [`llm-wiki-orient`](skills/llm-wiki-orient/SKILL.md) | The user is new to LLM-Wiki and wants the pattern, trade-offs and solution landscape explained. |
| [`llm-wiki-faq`](skills/llm-wiki-faq/SKILL.md) | The user asks why LLM-Wiki is needed, what benefits it gives, what evidence exists, how to keep it alive, or whether Obsidian is required. |
| [`llm-wiki-news-radar`](skills/llm-wiki-news-radar/SKILL.md) | The user asks for fresh news, projects, papers, releases or ecosystem changes. |
| [`llm-wiki-ecosystem-registry`](skills/llm-wiki-ecosystem-registry/SKILL.md) | The user wants a current registry or comparison of LLM-Wiki implementations and adjacent frameworks. |
| [`llm-wiki-choose`](skills/llm-wiki-choose/SKILL.md) | The user needs help deciding whether to adopt a ready-made solution or build their own. |

### Diagnose, plan and evaluate

| Skill | Use when |
|---|---|
| [`llm-wiki-doctor`](skills/llm-wiki-doctor/SKILL.md) | An existing vault/docs folder needs read-only diagnosis before changes. |
| [`llm-wiki-migration-planner`](skills/llm-wiki-migration-planner/SKILL.md) | The user wants a dry-run migration plan before moving files. |
| [`llm-wiki-eval`](skills/llm-wiki-eval/SKILL.md) | The user wants to measure whether the wiki actually helps. |
| [`llm-wiki-eval-tooling`](skills/llm-wiki-eval-tooling/SKILL.md) | Evaluation goals need concrete tools, metrics, baselines or CI gates. |
| [`llm-wiki-benchmark-suite`](skills/llm-wiki-benchmark-suite/SKILL.md) | The user wants a practical with-wiki versus without-wiki pilot benchmark. |
| [`llm-wiki-provenance`](skills/llm-wiki-provenance/SKILL.md) | Claims need source-level or claim-level provenance. |
| [`llm-wiki-claim-anchors`](skills/llm-wiki-claim-anchors/SKILL.md) | Important claims need deterministic anchors and support labels. |
| [`llm-wiki-conflict-resolver`](skills/llm-wiki-conflict-resolver/SKILL.md) | Lint or review found contradictory wiki claims. |

### Implement and migrate

| Skill | Use when |
|---|---|
| [`llm-wiki-setup`](skills/llm-wiki-setup/SKILL.md) | The user chose a target setup and wants installation, config, hooks, templates or git workflow help. |
| [`llm-wiki-design`](skills/llm-wiki-design/SKILL.md) | The user wants to design or build a custom LLM-Wiki product, plugin, CLI or agent workflow. |
| [`llm-wiki-refactor`](skills/llm-wiki-refactor/SKILL.md) | Existing documents, notes, docs folders or vaults should be reorganized into LLM-Wiki structure. |
| [`llm-wiki-ingestion-stack`](skills/llm-wiki-ingestion-stack/SKILL.md) | The user needs a source-preserving conversion/OCR/ETL ingestion stack. |
| [`llm-wiki-retrieval-architect`](skills/llm-wiki-retrieval-architect/SKILL.md) | Search, hybrid retrieval, vector DB or GraphRAG architecture needs design. |
| [`llm-wiki-mcp-integration`](skills/llm-wiki-mcp-integration/SKILL.md) | The wiki should be exposed to agents through MCP or a local API. |
| [`llm-wiki-local-first-stack`](skills/llm-wiki-local-first-stack/SKILL.md) | The user wants Markdown/git/Obsidian/local search/local model architecture. |
| [`llm-wiki-obsidian-hardening`](skills/llm-wiki-obsidian-hardening/SKILL.md) | An Obsidian vault needs agent-safe wikilink, attachment, frontmatter and sync rules. |
| [`llm-wiki-repo-docs`](skills/llm-wiki-repo-docs/SKILL.md) | A codebase needs OpenWiki-style agent-readable repository documentation. |
| [`llm-wiki-github-action`](skills/llm-wiki-github-action/SKILL.md) | The user wants scheduled lint, validation, or PR-based maintenance. |

### Capture and domain workflows

| Skill | Use when |
|---|---|
| [`llm-wiki-capture-pipeline`](skills/llm-wiki-capture-pipeline/SKILL.md) | The user wants a general inbox/capture pipeline. |
| [`llm-wiki-channel-capture`](skills/llm-wiki-channel-capture/SKILL.md) | A specific channel such as Telegram, email, browser clips, voice, PDFs, GitHub or Slack needs capture rules. |
| [`llm-wiki-interview`](skills/llm-wiki-interview/SKILL.md) | Tacit knowledge should be extracted through an agent-led interview. |
| [`llm-wiki-adr-memory`](skills/llm-wiki-adr-memory/SKILL.md) | The user wants to recover or maintain decision provenance and ADR memory. |
| [`llm-wiki-domain-pack`](skills/llm-wiki-domain-pack/SKILL.md) | A domain-specific taxonomy, templates and review policy are needed. |

### Operate and trust

| Skill | Use when |
|---|---|
| [`wiki-triage`](skills/wiki-triage/SKILL.md) | Inbox material needs sorting before full ingest. |
| [`wiki-ingest`](skills/wiki-ingest/SKILL.md) | Trusted raw sources should become source/entity/concept/synthesis pages. |
| [`wiki-query`](skills/wiki-query/SKILL.md) | A question should be answered from the compiled wiki and useful answers saved back. |
| [`wiki-lint`](skills/wiki-lint/SKILL.md) | The wiki needs structural health checks, stale-claim detection and review queues. |
| [`llm-wiki-trust-audit`](skills/llm-wiki-trust-audit/SKILL.md) | The user wants an anti-slop, provenance, confidence and human-synthesis audit. |
| [`llm-wiki-source-refresh`](skills/llm-wiki-source-refresh/SKILL.md) | Stale or current-state source-backed claims need refresh reports. |
| [`llm-wiki-privacy-redactor`](skills/llm-wiki-privacy-redactor/SKILL.md) | Private content needs preview redaction before export or model-boundary use. |
| [`llm-wiki-security-review`](skills/llm-wiki-security-review/SKILL.md) | Skills, capture pipelines, vault access or write permissions need security review. |
| [`llm-wiki-model-policy`](skills/llm-wiki-model-policy/SKILL.md) | The user needs local/cloud model and data-use policy. |
| [`llm-wiki-export-publish`](skills/llm-wiki-export-publish/SKILL.md) | A public or internal subset of the wiki should be exported or published. |
| [`llm-wiki-archive`](skills/llm-wiki-archive/SKILL.md) | The wiki needs long-term durability and archive manifests. |

### Skill and memory governance

| Skill | Use when |
|---|---|
| [`llm-wiki-skill-doctor`](skills/llm-wiki-skill-doctor/SKILL.md) | Agent Skills need quality, trigger, overlap or safety review. |
| [`llm-wiki-skill-compiler`](skills/llm-wiki-skill-compiler/SKILL.md) | Procedural wiki knowledge should become installable Agent Skills. |
| [`llm-wiki-agent-memory-bridge`](skills/llm-wiki-agent-memory-bridge/SKILL.md) | The user needs boundaries between wiki, skills, instruction files and agent memory. |
| [`llm-wiki-team-rollout`](skills/llm-wiki-team-rollout/SKILL.md) | A team wants onboarding, ownership, PR review, permissions and knowledge-maintenance workflows. |

## Repository contents

| Path | Purpose |
|---|---|
| [`skills/`](skills/) | Installable Agent Skills. Each folder has a `SKILL.md` with valid Agent Skills frontmatter. |
| [`skills.sh.json`](skills.sh.json) | Directory grouping metadata for skills.sh-style discovery. |
| [`docs/`](docs/) | Conceptual reference docs behind the skills, including [`docs/12-evidence-and-faq.md`](docs/12-evidence-and-faq.md). |
| [`templates/`](templates/) | Starter vault files, schemas and page/report templates. |
| [`examples/`](examples/) | Small fixtures for first-run and validation scenarios. |
| [`domain-packs/`](domain-packs/) | Domain-specific starter taxonomies and workflows. |
| [`benchmarks/`](benchmarks/) | Pilot questions and scoring rubric for local evaluation. |

## Safety principle

Automate **bookkeeping**, not belief.

The agent may maintain links, frontmatter, indexes, logs, drafts, MOCs, deduplication candidates and lint reports. Human review remains responsible for synthesis, acceptance of ambiguous claims and promotion from draft to reviewed/verified knowledge.

## Freshness and evidence policy

Skills that answer current ecosystem questions should use fresh sources. Skills that argue for adoption should distinguish direct LLM-Wiki evidence, adjacent evidence from RAG/memory/context-engineering work, and the user's own pilot metrics.
