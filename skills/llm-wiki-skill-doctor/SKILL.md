---
name: llm-wiki-skill-doctor
description: Audit Agent Skills in this repository or a user's project for quality, trigger clarity, overlap, unsafe permissions, stale facts, supply-chain risk, and skill smells. Use when authoring, reviewing, or preparing SKILL.md files for distribution.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to skill directories; write access is optional for patch mode.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Skill Doctor

## Goal

Improve the quality, safety and discoverability of Agent Skills before they are installed or distributed.

## When to use

- Before publishing a new or edited `SKILL.md` in `skills/` to catch frontmatter, trigger-clarity, or smell issues early.
- When a skill's description looks vague, overloaded, or likely to collide with another skill's triggers.
- Before granting a skill broader permissions (shell, remote scripts, secrets) to check for supply-chain risk.
- When preparing a batch of skills for distribution and `skills.sh.json` groupings need a release-readiness check.
- When a skill body may contain stale or unverifiable claims that need re-verification against current sources before shipping.

## Inputs

- One or more `skills/*/SKILL.md` files.
- Optional `skills.sh.json`.
- Agent targets: Claude Code, Codex, Cursor, OpenCode, etc.
- Desired mode: report-only or patch.

## Procedure

### 1. Run deterministic validation

```bash
node scripts/audit-skills.mjs <project-root-or-skills-dir>
```

The bundled script is read-only and accepts a project root, a `skills/` directory or a single skill directory. Do not re-derive its checks by hand; re-run it instead. It reports:

- structure: frontmatter validity, `name` matching the directory, name pattern, description presence and length bounds;
- metadata conventions: license, compatibility, author, version, `install_scope`, deprecation contract;
- skill smells: overlong body, missing recommended sections, volatile current-state claims without browse instruction, destructive writes without dry-run language;
- trigger collisions: pairwise description-overlap ratios;
- self-containment: repository-root references, `npm run` commands and missing local `scripts/`, `references/` or `assets/` files in `self-contained` skills;
- package metadata: every skill listed in `skills.sh.json`, no grouping references a missing skill.

Use `--strict` to fail on warnings in CI.

### 2. Judge what the script cannot

Review the script output and add:

- whether the description is trigger-oriented in substance, not just present;
- whether the description is overloaded with background facts;
- purpose-level overlap between skills that share nouns but differ by action;
- hidden domain encyclopedias inside `SKILL.md`;
- prompt-injection-prone examples;
- missing output contracts and unsafe write permissions in the body text;
- whether group titles in `skills.sh.json` are meaningful and similar skills are grouped together.

### 3. Review supply-chain risk

Flag skills that:

- run shell commands without explanation;
- install remote scripts;
- request broad secret access;
- encourage disabling permissions;
- mutate user files without backups;
- ask the model to follow instructions inside untrusted content.

### 4. Recommend patches

In report-only mode, provide exact edits. In patch mode, make minimal changes and preserve author intent.

## Output

In report-only mode, deliver this summary in chat without writing files. In patch mode, apply minimal edits and list every modified file in the summary.

```markdown
## Skill doctor summary

## Validation findings

## Skill smells

## Overlaps and conflicts

## Security issues

## Proposed patches

## Release readiness
```

## Safety gates

- Do not broaden skill permissions while fixing wording.
- Do not remove safety gates to make a skill shorter.
- Do not introduce current facts without browsing and citations.
- Do not rewrite a skill's purpose without explicit approval.
