---
name: llm-wiki-conflict-resolver
description: Help resolve contradictions found by wiki-lint, provenance checks, or user review. Use when LLM-Wiki pages disagree about facts, recommendations, tool status, decisions, definitions, or stale claims and the agent should mediate rather than auto-fix truth.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to conflicting pages and sources; write access is optional after human approval.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Conflict Resolver

## Goal

Turn contradictions into explicit review decisions without silently rewriting truth.

## When to use

- `wiki-lint` reports two or more pages making contradictory claims about the same fact.
- A provenance check finds a claim whose cited source no longer supports it.
- A human reviewer flags disagreement between a decision note and a concept page.
- Two pages define the same term differently (terminology drift) or appear to duplicate the same concept.
- A claim looks stale (tool status, recommendation, or decision that may have changed) and needs a review decision rather than a silent edit.

## Inputs

- Conflicting pages or lint report.
- Supporting source pages and raw sources.
- Desired mode: analyze, propose resolution, or apply approved patch.

## Procedure

### 1. Define conflict set

Group conflicting claims by topic. For each claim, record:

- page path;
- claim text;
- status;
- source support;
- update date;
- confidence/review state;
- whether it is extracted, inferred, ambiguous or synthesis.

### 2. Classify conflict type

Use:

| Type | Meaning |
| --- | --- |
| stale | One claim was true but is now outdated. |
| scope mismatch | Claims are true under different conditions. |
| source disagreement | Sources genuinely disagree. |
| inference error | A page inferred too much. |
| terminology drift | Same term used differently. |
| duplicate concept | Two pages should be merged or separated. |

### 3. Present evidence

Show concise evidence and provenance for each side. Do not use generated summaries as the only evidence for high-impact conflicts.

### 4. Propose resolution options

Possible actions:

- mark one page stale;
- split by scope;
- add caveat;
- demote claim to ambiguous;
- merge duplicate pages;
- create a decision note;
- request external source verification.

### 5. Apply only approved changes

In apply mode, patch only the approved resolution and append to `wiki/log.md`.

## Output

```markdown
## Conflict summary

## Claims in conflict

## Evidence

## Conflict type

## Resolution options

## Recommended review decision

## Approved patches
```

## Safety gates

- Do not auto-resolve truth conflicts.
- Do not delete minority or outdated claims without preserving history.
- Do not present inference as extracted fact.
- Do not mark resolved conflicts verified without human approval.
- Re-verify a claim against current sources (not just the conflicting page's own text) before recommending which side of a stale or source-disagreement conflict to keep.
