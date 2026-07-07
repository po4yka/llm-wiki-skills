# LLM-Wiki skill system roadmap

> Status: draft
> Scope: product direction for this repository as an installable Agent Skills pack.

## Thesis

This repository is a distribution-ready skill system for coding agents that support LLM-Wiki users across the full lifecycle:

```text
learn -> answer objections -> choose -> diagnose -> plan -> set up -> migrate -> operate -> audit -> publish/archive -> evolve
```

The target user may be deciding whether LLM-Wiki is useful, asking for evidence, choosing a tool, migrating a messy document set, building a product, operating a team wiki, or turning accumulated wiki procedures into reusable Agent Skills.

## Distribution target

Use `vercel-labs/skills` / `skills.sh` style distribution:

```bash
npx skills add po4yka/llm-wiki-skills --list
npx skills add po4yka/llm-wiki-skills --skill '*' -a claude-code
npx skills add po4yka/llm-wiki-skills --skill llm-wiki-faq -a codex
npx skills use po4yka/llm-wiki-skills --skill llm-wiki-faq --agent claude-code
```

Each skill lives in `skills/<skill-name>/SKILL.md` and has valid Agent Skills frontmatter.

## Current skill families

The pack currently ships 49 skills, grouped as in `skills.sh.json`:

### 1. Learn and choose

- `llm-wiki-orient`
- `llm-wiki-faq`
- `llm-wiki-paf-adoption`
- `llm-wiki-news-radar`
- `llm-wiki-choose`

These skills explain the pattern, answer adoption objections with direct/adjacent/local evidence, map PAF Nexus/Cortex adoption, refresh the current landscape and help the user decide between ready-made and custom paths.

### 2. Technology landscape

- `llm-wiki-ecosystem-registry`
- `llm-wiki-implementation-deep-dive`
- `llm-wiki-retrieval-architect`
- `llm-wiki-ingestion-stack`
- `llm-wiki-mcp-integration`
- `llm-wiki-eval-tooling`

These skills map concrete implementations, implementation archetypes, retrieval stacks, ingestion tooling, MCP/API integration and evaluation/security tooling for LLM-Wiki systems.

### 3. Diagnosis, planning, provenance and evaluation

- `llm-wiki-doctor`
- `llm-wiki-migration-planner`
- `llm-wiki-eval`
- `llm-wiki-benchmark-suite`
- `llm-wiki-critique-audit`
- `llm-wiki-provenance`
- `llm-wiki-claim-anchors`
- `llm-wiki-conflict-resolver`

These skills turn messy existing material into a safe adoption plan, audit criticism risk and provide evidence that the wiki is trustworthy and useful.

### 4. Implementation and migration

- `llm-wiki-setup`
- `llm-wiki-design`
- `llm-wiki-refactor`
- `llm-wiki-local-first-stack`
- `llm-wiki-obsidian-hardening`
- `llm-wiki-repo-docs`
- `llm-wiki-github-action`

These skills help users set up local-first vaults, harden Obsidian, build repo documentation and add safe maintenance automation.

### 5. Capture and domain workflows

- `llm-wiki-company-flow-audit`
- `llm-wiki-capture-pipeline`
- `llm-wiki-channel-capture`
- `llm-wiki-interview`
- `llm-wiki-adr-memory`
- `llm-wiki-domain-pack`

These skills map company information flows and cover the capture and knowledge-shaping scenarios that make the wiki compound over time.

### 6. Operation and trust

- `wiki-triage`
- `wiki-ingest`
- `wiki-query`
- `wiki-lint`
- `llm-wiki-trust-audit`
- `llm-wiki-source-refresh`
- `llm-wiki-privacy-redactor`
- `llm-wiki-threat-model`
- `llm-wiki-security-review`
- `llm-wiki-model-policy`
- `llm-wiki-export-publish`
- `llm-wiki-archive`

These skills maintain day-to-day wiki health, data boundaries, threat modeling, source freshness, model policy, publication boundaries and long-term durability.

### 7. Skill and memory governance

- `llm-wiki-skill-doctor`
- `llm-wiki-skill-compiler`
- `llm-wiki-agent-memory-bridge`
- `llm-wiki-team-rollout`
- `llm-wiki-gitlab-operating-model`

These skills help teams and builders govern Agent Skills, instruction files, memory surfaces, organizational rollout and self-hosted GitLab operating models.

## Product hardening layer

The repository now includes the implementation-hardening items that turn the skill pack into a maintainable product:

- full PR validation through `npm run validate`;
- fixtures and examples under `examples/`;
- quickstart and skill router docs;
- claim-level provenance anchors and validation;
- skill smell validation;
- third-party skill supply-chain security docs;
- release/versioning policy and changelog;
- generated machine and human-readable skill catalogs;
- domain packs;
- per-agent adapter docs;
- living-wiki operations checklists;
- pilot benchmark materials;
- source-refresh workflow;
- privacy-redaction policy and preview script.

## Future candidates

Potential next additions:

| Item | Purpose |
|---|---|
| `llm-wiki-claim-diff` | Track how claim support changes across source refreshes. |
| `llm-wiki-taxonomy-migrator` | Safely migrate tags and page types across domain packs. |
| `llm-wiki-benchmark-reporter` | Turn pilot benchmark runs into charts and release-quality reports. |
| `llm-wiki-source-vendor` | Vendor critical external sources for long-term archival. |

## Product principles

1. Keep skills small and triggerable.
2. Put volatile facts behind browsing skills, not static docs.
3. Prefer Markdown, git and reviewable diffs.
4. Preserve raw sources.
5. Protect human synthesis.
6. Make trust controls visible before retrieval upgrades.
7. Support multiple coding agents through the Agent Skills format.
8. Validate skill metadata and groupings before release.
9. Separate direct evidence from adjacent evidence when making adoption claims.
10. Prefer examples, validators and fixtures before adding more broad skills.
