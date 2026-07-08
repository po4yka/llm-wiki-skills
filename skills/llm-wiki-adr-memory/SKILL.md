---
name: llm-wiki-adr-memory
description: Recover and maintain decision provenance in an LLM-Wiki. Use when the user asks why a technical/product decision was made, wants ADRs generated or connected, or needs PRs, issues, discussions, commits, and docs distilled into decision memory.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires repository/docs access; GitHub connector access is optional for issues and PRs.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki ADR Memory

## Goal

Make architectural and product decisions traceable, searchable and durable.

## When to use

- Someone asks why a technical or product decision was made and no clear record exists.
- A PR, issue, or discussion thread contains decision rationale that should be distilled into a durable ADR.
- An existing ADR needs to be linked into the wiki or checked against newer commits/docs for stale assumptions.
- A subsystem lacks decision provenance and the user wants it recovered from history before further changes land.

## Inputs

- Existing ADRs, docs, PRs, issues, discussions or commit history.
- Target decision or subsystem.
- Desired mode: recover, create draft ADR, update wiki, or answer a question.

## Procedure

### 1. Identify decision scope

Clarify:

- decision title;
- affected system/domain;
- approximate time window;
- stakeholders if known;
- current pain point.

### 2. Gather evidence

Search:

- ADR files;
- PR descriptions and review threads;
- issues and discussions;
- commit messages;
- architecture docs;
- wiki pages;
- meeting notes if available.

### 3. Build decision timeline

Extract:

- context;
- options considered;
- constraints;
- trade-offs;
- final decision;
- consequences;
- assumptions that may now be stale.

### 4. Create or update decision page

Recommended structure:

```markdown
# Decision: <title>

## Status

## Context

## Options considered

## Decision

## Consequences

## Evidence

## Stale assumptions

## Follow-ups
```

Use `status: draft` unless an owner approves.

### 5. Link into wiki

Connect decision pages to concepts, entities, repo docs and relevant source pages. Add to `wiki/index.md` if important.

## Output

```markdown
## Decision memory summary

## Evidence reviewed

## Timeline

## Draft ADR or wiki page

## Unresolved questions

## Recommended owners
```

## Safety gates

- Do not invent rationale when evidence is missing.
- Do not treat inferred motivation as extracted fact.
- Do not rewrite official ADRs without review.
- Do not expose private discussion excerpts unnecessarily.
