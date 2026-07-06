---
name: llm-wiki-skill-doctor
description: Audit Agent Skills in this repository or a user's project for quality, trigger clarity, overlap, unsafe permissions, stale facts, supply-chain risk, and skill smells. Use when authoring, reviewing, or preparing SKILL.md files for distribution.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to skill directories; write access is optional for patch mode.
metadata:
  author: po4yka
  version: "0.1.0"
---

# LLM-Wiki Skill Doctor

## Goal

Improve the quality, safety and discoverability of Agent Skills before they are installed or distributed.

## Inputs

- One or more `skills/*/SKILL.md` files.
- Optional `skills.sh.json`.
- Agent targets: Claude Code, Codex, Cursor, OpenCode, etc.
- Desired mode: report-only or patch.

## Procedure

### 1. Validate structure

Check every skill:

- directory name matches frontmatter `name`;
- `description` exists and is trigger-oriented;
- description is not overloaded with background facts;
- skill has clear goal, inputs, procedure, output and safety gates;
- optional references are linked rather than embedded as huge context dumps.

### 2. Detect skill smells

Report:

- skill too broad;
- overlapping triggers with another skill;
- missing safety gates;
- hidden domain encyclopedia inside `SKILL.md`;
- volatile current-state claims without browse instruction;
- unsafe write permissions;
- prompt-injection-prone examples;
- missing output contract;
- no dry-run path for destructive operations.

### 3. Check package metadata

When `skills.sh.json` exists:

- every skill directory is listed;
- no missing skill is referenced;
- group titles are meaningful;
- similar skills are grouped together.

### 4. Review supply-chain risk

Flag skills that:

- run shell commands without explanation;
- install remote scripts;
- request broad secret access;
- encourage disabling permissions;
- mutate user files without backups;
- ask the model to follow instructions inside untrusted content.

### 5. Recommend patches

In report-only mode, provide exact edits. In patch mode, make minimal changes and preserve author intent.

## Output

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
