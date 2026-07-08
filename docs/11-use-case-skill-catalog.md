# Advanced LLM-Wiki use-case skill catalog

> Status: draft
> Scope: advanced use-case and hardening skills that extend the core LLM-Wiki lifecycle pack.
> Current as of: 2026-07-07

## Thesis

The core skills make an LLM-Wiki operate. The advanced use-case skills make it adoptable in messy real environments: existing vaults, teams, repositories, Obsidian, capture channels, trust gaps, publication, archival and skill governance.

The organizing lifecycle is:

```text
diagnose -> plan -> migrate -> operate -> prove trust -> publish/archive -> evolve skills
```

## The original 20 advanced skills

| # | Skill | Primary use-case |
| ---: | --- | --- |
| 1 | [`llm-wiki-doctor`](../skills/llm-wiki-doctor/SKILL.md) | Read-only diagnosis of an existing vault, docs folder or repo wiki. |
| 2 | [`llm-wiki-migration-planner`](../skills/llm-wiki-migration-planner/SKILL.md) | Dry-run migration plan before moving or editing files. |
| 3 | [`llm-wiki-provenance`](../skills/llm-wiki-provenance/SKILL.md) | Source-level and claim-level provenance repair. |
| 4 | [`llm-wiki-skill-doctor`](../skills/llm-wiki-skill-doctor/SKILL.md) | Quality and safety review for Agent Skills. |
| 5 | [`llm-wiki-skill-compiler`](../skills/llm-wiki-skill-compiler/SKILL.md) | Compile procedural wiki knowledge into installable skills. |
| 6 | [`llm-wiki-eval`](../skills/llm-wiki-eval/SKILL.md) | Measure whether the wiki is actually useful. |
| 7 | [`llm-wiki-obsidian-hardening`](../skills/llm-wiki-obsidian-hardening/SKILL.md) | Harden Obsidian vaults for safe agent edits. |
| 8 | [`llm-wiki-repo-docs`](../skills/llm-wiki-repo-docs/SKILL.md) | Build agent-readable repo documentation. |
| 9 | [`llm-wiki-github-action`](../skills/llm-wiki-github-action/SKILL.md) | Configure scheduled or PR-based wiki maintenance. |
| 10 | [`llm-wiki-security-review`](../skills/llm-wiki-security-review/SKILL.md) | Review data boundaries, skill supply chain and write permissions. |
| 11 | [`llm-wiki-local-first-stack`](../skills/llm-wiki-local-first-stack/SKILL.md) | Design local-first Markdown/git/search/model stacks. |
| 12 | [`llm-wiki-channel-capture`](../skills/llm-wiki-channel-capture/SKILL.md) | Add channel-specific capture from Telegram, email, PDFs, voice, GitHub, etc. |
| 13 | [`llm-wiki-interview`](../skills/llm-wiki-interview/SKILL.md) | Extract tacit knowledge through an agent-led interview. |
| 14 | [`llm-wiki-adr-memory`](../skills/llm-wiki-adr-memory/SKILL.md) | Recover and maintain decision provenance and ADR memory. |
| 15 | [`llm-wiki-domain-pack`](../skills/llm-wiki-domain-pack/SKILL.md) | Generate domain-specific templates, taxonomies and review gates. |
| 16 | [`llm-wiki-export-publish`](../skills/llm-wiki-export-publish/SKILL.md) | Publish safe subsets as docs, websites, handbooks or bundles. |
| 17 | [`llm-wiki-archive`](../skills/llm-wiki-archive/SKILL.md) | Prepare the wiki for 5-10+ year durability and archival. |
| 18 | [`llm-wiki-conflict-resolver`](../skills/llm-wiki-conflict-resolver/SKILL.md) | Mediate contradictory claims without auto-fixing truth. |
| 19 | [`llm-wiki-model-policy`](../skills/llm-wiki-model-policy/SKILL.md) | Define local/cloud model and data-use policy. |
| 20 | [`llm-wiki-agent-memory-bridge`](../skills/llm-wiki-agent-memory-bridge/SKILL.md) | Separate wiki knowledge from skills, instruction files and agent memory. |

## Product-hardening skills added after review

| Skill | Primary use-case |
| --- | --- |
| [`llm-wiki-benchmark-suite`](../skills/llm-wiki-benchmark-suite/SKILL.md) | Run practical local pilot benchmarks. |
| [`llm-wiki-claim-anchors`](../skills/llm-wiki-claim-anchors/SKILL.md) | Add deterministic claim-level provenance anchors. |
| [`llm-wiki-source-refresh`](../skills/llm-wiki-source-refresh/SKILL.md) | Refresh stale source-backed claims. |
| [`llm-wiki-privacy-redactor`](../skills/llm-wiki-privacy-redactor/SKILL.md) | Preview redactions before publishing or model-boundary use. |

## Entry-point routing

### User has existing material but no structure

Run:

```text
llm-wiki-doctor -> llm-wiki-migration-planner -> llm-wiki-refactor -> wiki-lint
```

### User worries about trust

Run:

```text
llm-wiki-trust-audit -> llm-wiki-provenance -> llm-wiki-claim-anchors -> llm-wiki-conflict-resolver -> llm-wiki-eval
```

### User uses Obsidian

Run:

```text
llm-wiki-obsidian-hardening -> llm-wiki-channel-capture -> wiki-triage -> wiki-ingest
```

### User has a codebase

Run:

```text
llm-wiki-repo-docs -> llm-wiki-github-action -> llm-wiki-adr-memory
```

### User is building a product

Run:

```text
llm-wiki-design -> llm-wiki-local-first-stack -> llm-wiki-model-policy -> llm-wiki-security-review
```

### User wants to distribute their own skills

Run:

```text
llm-wiki-skill-compiler -> llm-wiki-skill-doctor -> npm run validate
```

### User wants to publish or archive

Run:

```text
llm-wiki-source-refresh -> llm-wiki-privacy-redactor -> llm-wiki-export-publish -> llm-wiki-archive
```

## Design boundary

These skills should not become static encyclopedias of the LLM-Wiki ecosystem. Volatile facts belong in browsing flows such as `llm-wiki-news-radar`; procedural guidance belongs in `SKILL.md`; durable domain facts belong in the user's wiki.

## Safety boundary

The advanced skills keep the same core rule as the rest of the repository:

> Automate bookkeeping, not belief.

The system can diagnose, plan, restructure, cite, lint, package and publish. It should not silently decide that a generated claim is true.
