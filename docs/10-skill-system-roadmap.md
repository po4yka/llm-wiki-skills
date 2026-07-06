# LLM-Wiki skill system roadmap

> Status: draft
> Scope: product direction for this repository as an installable Agent Skills pack.

## Thesis

This repository is a distribution-ready skill system for coding agents that support LLM-Wiki users across the full lifecycle:

```text
learn -> choose -> set up -> migrate -> operate -> audit -> evolve
```

The target user is not only someone who already has a vault. The target user may be deciding whether LLM-Wiki is useful, choosing a tool, migrating a messy document set, building a product, operating a team wiki, or turning accumulated wiki procedures into reusable Agent Skills.

## Distribution target

Use `vercel-labs/skills` / `skills.sh` style distribution:

```bash
npx skills add po4yka/llm-wiki-skills --list
npx skills add po4yka/llm-wiki-skills --skill '*' -a claude-code
npx skills add po4yka/llm-wiki-skills --skill llm-wiki-choose -a codex
npx skills use po4yka/llm-wiki-skills --skill llm-wiki-orient --agent claude-code
```

Each skill lives in `skills/<skill-name>/SKILL.md` and has valid Agent Skills frontmatter.

## Current skill families

### 1. Orientation and education

- `llm-wiki-orient`
- `llm-wiki-news-radar`
- `llm-wiki-choose`

These skills explain the pattern, refresh the current landscape and help the user decide between ready-made and custom paths.

### 2. Diagnosis, planning and evaluation

- `llm-wiki-doctor`
- `llm-wiki-migration-planner`
- `llm-wiki-eval`
- `llm-wiki-provenance`
- `llm-wiki-conflict-resolver`

These skills turn messy existing material into a safe adoption plan and provide evidence that the wiki is trustworthy and useful.

### 3. Implementation and migration

- `llm-wiki-setup`
- `llm-wiki-design`
- `llm-wiki-refactor`
- `llm-wiki-local-first-stack`
- `llm-wiki-obsidian-hardening`
- `llm-wiki-repo-docs`
- `llm-wiki-github-action`

These skills help users set up local-first vaults, harden Obsidian, build repo documentation and add safe maintenance automation.

### 4. Capture and domain workflows

- `llm-wiki-capture-pipeline`
- `llm-wiki-channel-capture`
- `llm-wiki-interview`
- `llm-wiki-adr-memory`
- `llm-wiki-domain-pack`

These skills cover the capture and knowledge-shaping scenarios that make the wiki compound over time.

### 5. Operation and trust

- `wiki-triage`
- `wiki-ingest`
- `wiki-query`
- `wiki-lint`
- `llm-wiki-trust-audit`
- `llm-wiki-security-review`
- `llm-wiki-model-policy`
- `llm-wiki-export-publish`
- `llm-wiki-archive`

These skills maintain day-to-day wiki health, data boundaries, model policy, publication boundaries and long-term durability.

### 6. Skill and memory governance

- `llm-wiki-skill-doctor`
- `llm-wiki-skill-compiler`
- `llm-wiki-agent-memory-bridge`
- `llm-wiki-team-rollout`

These skills help teams and builders govern Agent Skills, instruction files, memory surfaces and organizational rollout.

## Advanced use-case catalog

The 20 advanced use-case skills are cataloged in [`11-use-case-skill-catalog.md`](11-use-case-skill-catalog.md). That document is the main routing reference for diagnosis, provenance, evaluation, Obsidian hardening, repo docs, scheduled maintenance, security review, local-first design, channel capture, interviews, ADR memory, domain packs, publishing, archival, conflict resolution, model policy and agent-memory boundaries.

## Future candidates

Potential next additions:

| Skill | Purpose |
|---|---|
| `llm-wiki-claim-anchors` | Implement deterministic Markdown anchor conventions for claim-level provenance. |
| `llm-wiki-benchmark-suite` | Run repeatable with-wiki/without-wiki benchmark tasks. |
| `llm-wiki-release-notes` | Generate release notes from wiki changes and repo history. |
| `llm-wiki-privacy-redactor` | Redact public exports and model-boundary payloads. |
| `llm-wiki-source-refresh` | Re-check stale external sources and open refresh PRs. |

## Product principles

1. Keep skills small and triggerable.
2. Put volatile facts behind browsing skills, not static docs.
3. Prefer Markdown, git and reviewable diffs.
4. Preserve raw sources.
5. Protect human synthesis.
6. Make trust controls visible before retrieval upgrades.
7. Support multiple coding agents through the Agent Skills format.
8. Validate skill metadata and groupings before release.
