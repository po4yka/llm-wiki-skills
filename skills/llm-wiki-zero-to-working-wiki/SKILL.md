---
name: llm-wiki-zero-to-working-wiki
description: Create a first useful LLM-Wiki from zero. Use when the user wants a zero-to-working-wiki walkthrough, first vault, first source ingest, first reusable query, first lint report, or a visible demo loop before a larger rollout; route full workflow installs to llm-wiki-setup.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires filesystem access for local setup; keep writes reviewable and git-visible.
metadata:
  author: po4yka
  version: "0.2.0"
  install_scope: self-contained
---

# Zero to Working Wiki

## Goal

Get from an empty folder to a working, reviewable LLM-Wiki loop in one small session.

## When to use

Use this skill when the user wants:

- a first local LLM-Wiki vault;
- a product demo that shows value before a migration;
- one raw source turned into a draft wiki page;
- one reusable answer saved back into the wiki;
- one lint report that creates a maintenance queue.

## Inputs

- Target folder.
- Agent target: Claude Code, Codex, Cursor, OpenCode or another compatible agent.
- Write mode: direct local writes, dry-run patch, or PR-based.
- Privacy constraints.
- Optional first source text or file path.

## Procedure

### 1. Preflight

Check:

- the target folder exists or can be created;
- git is initialized or the user accepts initializing it;
- no sensitive source should leave the machine;
- writes are reviewable through `git diff`;
- the user wants a tiny first loop, not a bulk migration.

If the user has an existing vault or repository, keep this run scoped to one source and one question.

### 2. Create the minimal vault shape

Create only missing directories:

```text
raw/sources/
raw/assets/
inbox/
wiki/sources/
wiki/entities/
wiki/concepts/
wiki/queries/
wiki/synthesis/
_agent/reports/
_meta/schemas/
```

Create minimal instruction and navigation files if absent, starting from the bundled starters:

- `AGENTS.md` from `references/templates/vault/AGENTS.md`;
- `CLAUDE.md` from `references/templates/vault/CLAUDE.md` when the user uses Claude Code;
- `wiki/index.md` from `references/templates/wiki/index.md`;
- `wiki/log.md` from `references/templates/wiki/log.md`.

Whatever the starting point, the instruction files must state:

- do not edit `raw/` files;
- generated pages start as `status: draft`;
- human synthesis sections are protected;
- durable changes update `wiki/index.md` and `wiki/log.md`;
- bulk writes require approval.

### 3. Add one source

If the user did not provide a source, create a small sample source under `raw/sources/example-source.md`:

```markdown
# Example source

A living LLM-Wiki preserves raw sources, creates reviewable summaries, saves useful answers back into durable pages and runs periodic lint checks.
```

Do not overwrite an existing source with the same name.

### 4. Run first ingest

Create a draft source page under `wiki/sources/` with:

- frontmatter;
- source path;
- extracted claims;
- entities and concepts;
- ambiguities and caveats;
- links created;
- review-required status.

Update `wiki/index.md` and append `wiki/log.md`.

### 5. Run first query

Answer one question from the wiki:

```text
What maintenance loop does this source recommend?
```

If the answer is reusable, save it as a draft page under `wiki/queries/`. If not, explain why it was not saved.

### 6. Run first lint report

Create a report at `_agent/reports/YYYY-MM-DD-first-lint.md` with:

- summary;
- broken links;
- orphan pages;
- provenance gaps;
- stale pages;
- contradictions;
- suggested patches;
- next action.

Do not silently change truth-bearing pages while linting.

### 7. Show the product result

End by showing:

- files created or changed;
- what a human can now read without an agent;
- what remains draft or review-required;
- the next useful skill to run.

## Output

```markdown
## Zero-to-working-wiki summary

## Files created or changed

## First source

## First reusable answer

## First lint queue

## Review-required items

## Next action
```

## Safety gates

- Do not start a bulk migration in this skill.
- Do not mark generated pages `verified`.
- Do not overwrite existing instruction, index, log or source files without showing a diff plan.
- Do not ingest private material into cloud tools without explicit approval.
- If the first source contains time-sensitive claims, mark them `re-verify` instead of treating them as current.
- Do not edit protected human synthesis sections.
