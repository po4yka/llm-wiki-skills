---
name: llm-wiki-skill-compiler
description: Compile procedural knowledge from an LLM-Wiki into installable Agent Skills. Use when wiki pages, runbooks, checklists, recurring workflows, troubleshooting notes, or query answers should become SKILL.md files with evidence links and validation.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to the wiki and write access to a skills repository for apply mode.
metadata:
  author: po4yka
  version: "0.1.0"
  install_scope: self-contained
---

# LLM-Wiki Skill Compiler

## Goal

Turn reusable procedural knowledge from the wiki into small, triggerable Agent Skills without moving domain knowledge into hidden prompts.

## Inputs

- Candidate wiki pages or folders.
- Existing `skills/` directory.
- `skills.sh.json` if present.
- Target agent(s).
- Desired mode: propose-only or write skill files.

## Procedure

### 1. Find procedural candidates

Search for pages containing:

- step-by-step workflows;
- repeated troubleshooting routines;
- runbooks;
- checklists;
- project conventions;
- saved query answers that are reused;
- scripts or command sequences.

### 2. Separate procedure from knowledge

Keep in the skill:

- trigger conditions;
- required inputs;
- deterministic procedure;
- output contract;
- safety gates.

Keep in the wiki or references:

- domain facts;
- long examples;
- historical background;
- volatile current-state claims;
- source excerpts.

### 3. Design skill boundary

For each candidate, propose:

```markdown
| Candidate | Skill name | Trigger | Inputs | Risks | Evidence pages |
|---|---|---|---|---|---|
```

Use one skill per coherent user intent. Do not create one giant skill.

### 4. Generate `SKILL.md`

Create valid frontmatter:

```yaml
---
name: example-skill
description: Trigger-rich description.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents.
metadata:
  author: po4yka
  version: "0.1.0"
---
```

Add links back to source wiki pages in a `## Source knowledge` section when useful.

### 5. Update package metadata

If writing files, update `skills.sh.json` and run or recommend validation.

## Output

```markdown
## Candidate skills

## Generated skills

## Source knowledge used

## Validation status

## Review required
```

## Safety gates

- Do not compile private or sensitive wiki content into distributable skills without approval.
- Do not embed large volatile knowledge dumps in `SKILL.md`.
- Do not create a skill from a weak or unreviewed page without marking it draft.
- Do not overwrite existing skills without diff review.
