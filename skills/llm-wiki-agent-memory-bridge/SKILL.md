---
name: llm-wiki-agent-memory-bridge
description: Decide what belongs in LLM-Wiki versus agent memory, AGENTS.md, CLAUDE.md, Auto Memory, Codex project memory, or other runtime memories. Use when instruction files are bloated, domain facts live in agent memory, or the user wants clean memory boundaries.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to project instructions and wiki files; write access is optional for migration patches.
metadata:
  author: po4yka
  version: "0.1.0"
  install_scope: self-contained
---

# LLM-Wiki Agent Memory Bridge

## Goal

Separate durable domain knowledge from runtime/project memory so agents load the right context at the right time.

## Inputs

- `AGENTS.md`, `CLAUDE.md`, project memory files, agent settings.
- Existing wiki/vault.
- Target agents: Claude Code, Codex, Cursor, OpenCode, etc.
- Desired mode: audit, plan, or apply.

## Procedure

### 1. Inventory memory surfaces

Find:

- instruction files;
- agent memory files;
- skills;
- wiki pages;
- query logs;
- project docs;
- hidden or generated memory directories.

### 2. Classify memory items

Use this routing:

| Content | Best home |
|---|---|
| stable procedures | Agent Skill |
| project conventions | `AGENTS.md` or `CLAUDE.md` pointer |
| domain facts | LLM-Wiki page with provenance |
| source-backed claims | `wiki/sources`, `wiki/concepts`, `wiki/entities` |
| user preferences | agent/user memory, not public wiki |
| temporary task state | current session or task log |
| sensitive facts | restricted wiki or local-only memory |

### 3. Detect bloat and drift

Flag:

- giant instruction files full of domain knowledge;
- skills containing volatile facts;
- agent memory duplicating wiki pages;
- wiki pages containing procedural prompts;
- missing pointers from instruction files to wiki index.

### 4. Propose moves

Create a migration table:

```markdown
| Item | Current location | Proposed home | Reason | Risk |
|---|---|---|---|---|
```

### 5. Apply safe pointer pattern

Keep instruction files short. Replace long domain dumps with pointers such as:

```markdown
For domain knowledge, read `wiki/index.md` first and then relevant linked pages.
```

## Output

```markdown
## Memory boundary summary

## Memory surfaces found

## Misplaced content

## Proposed moves

## Instruction-file pointer updates

## Risks
```

## Safety gates

- Do not move user preferences into a shared wiki without approval.
- Do not delete memory content during migration; archive or link it.
- Do not hide domain facts in skills.
- Do not leave instruction files without pointers to the wiki.
