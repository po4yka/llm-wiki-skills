# Contributing

Thanks for improving `llm-wiki-skills`. This repository is an Agent Skills distribution pack, so contributions are evaluated as both documentation and operational instructions for coding agents.

## Quick start

```bash
npm run validate
npm run catalog:generate
```

The canonical validation entrypoint is:

```bash
npm run validate
```

It checks skill metadata, manifest/README consistency, local Markdown links, agent-safety boundaries, skill-smell warnings, claim anchors and examples.

## Repository layout

| Path | Purpose |
|---|---|
| `skills/` | Installable Agent Skills. |
| `skills.sh.json` | Skills grouping metadata for discovery. |
| `docs/` | Conceptual and operational documentation. |
| `templates/` | Starter vault files, schemas and report/page templates. |
| `domain-packs/` | Domain-specific pack descriptions and overlays. |
| `examples/` | Small fixtures for validation and onboarding. |
| `benchmarks/` | Pilot benchmark questions and scoring rubric. |
| `scripts/` | Deterministic validation and generation helpers. |

## Adding or changing a skill

Every skill must live at:

```text
skills/<skill-name>/SKILL.md
```

Required frontmatter:

```yaml
---
name: <skill-name>
description: <trigger-oriented description>
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents.
metadata:
  author: po4yka
  version: "0.1.0"
---
```

Rules:

1. `name` must match the parent directory.
2. Use lowercase hyphenated names.
3. Keep `description` focused on user intent and trigger conditions.
4. Keep `SKILL.md` procedural; move long background material to `references/`.
5. Include explicit safety gates.
6. Use report-only, dry-run, proposal or PR-based defaults for risky writes.
7. Current ecosystem claims must instruct the agent to browse and cite fresh sources.
8. Add the skill to `skills.sh.json` and the README catalog.
9. Run `npm run catalog:generate` if skill metadata changes.

## Adding or changing domain packs

Domain packs must not extend the core `type` enum. Use `domain_type` and `domain_pack` instead.

Each pack should include:

```text
domain-packs/<pack>/
  pack.md
  schema.overlay.json
```

Run:

```bash
npm run validate:domain-packs
```

## Documentation changes

- Keep conceptual claims honest and scoped.
- Mark volatile landscape claims as `verify-before-use` unless checked in the same change.
- Preserve Obsidian-style `[[wikilinks]]` in templates.
- Keep docs and generated catalogs in sync.

## Security and safety changes

Before merging changes that affect agent behavior, write access, publishing, model/provider boundaries, MCP/API exposure, or release packaging, check `SECURITY.md` and `docs/security/skill-supply-chain.md`.

## Pull request expectations

A good PR should include:

- clear problem statement;
- focused scope;
- updated docs or templates if behavior changes;
- updated `skills.sh.json` and README when skills change;
- examples or fixtures when possible;
- `npm run validate` result or explanation if not run.

## Release notes

When a change affects installed behavior, skill metadata or release artifacts, update `CHANGELOG.md` or explain why it is not needed.
