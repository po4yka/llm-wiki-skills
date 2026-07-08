---
name: llm-wiki-interview
description: Extract tacit knowledge into an LLM-Wiki through an agent-led interview. Use when the wiki has open questions, weak areas, onboarding gaps, undocumented decisions, or the user wants voice/text answers turned into draft pages without pretending they are sourced facts.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to the wiki; optional write access for draft pages and interview reports.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Interview

## Goal

Use targeted questions to capture a person's tacit knowledge into draft, reviewable wiki pages.

## When to use

- The wiki has open questions, sparse concept pages, or pages marked `review_required`.
- Onboarding gaps keep producing the same repeated questions from new contributors.
- A decision page is missing its rationale, history, or trade-offs.
- The user hands over a voice-note or transcript that should become draft wiki pages.
- A lint report or contradiction check surfaces a gap only a person can fill in.

## Inputs

- `wiki/index.md`, `wiki/log.md`, open questions and lint reports.
- Target domain or project.
- Interview mode: plan questions, conduct interview, or file answers.
- Optional transcript or voice-note text.

## Procedure

### 1. Find weak areas

Look for:

- open questions;
- sparse concept pages;
- onboarding gaps;
- contradictions;
- pages marked `review_required`;
- repeated user questions;
- decision pages missing rationale.

Search `wiki/index.md` and `wiki/log.md` for prior interview answers before drafting new questions, so the interview does not re-ask what is already captured.

### 2. Prepare focused questions

Ask 5-10 questions at a time. Prefer questions that extract:

- constraints;
- history;
- rationale;
- exceptions;
- gotchas;
- examples;
- terminology;
- decision trade-offs.

### 3. Capture answers as draft knowledge

Store interview-derived knowledge as:

- `type: query` for Q&A;
- `type: synthesis` for human interpretation;
- `type: concept` or `entity` only when the answer clearly belongs there.

Mark:

```yaml
status: draft
review_required: true
claim_mix:
  extracted: 0.0
  inferred: 0.0
  ambiguous: 0.0
```

Use `interview` or `human-memory` source tags. Do not treat interview answers as external facts.

### 4. Separate human synthesis

Preserve answers under human-owned sections when they represent the person's interpretation.

### 5. Update navigation

Add important pages to `wiki/index.md` and append to `wiki/log.md` if writing files.

## Output

```markdown
## Interview plan

## Questions

## Captured answers

## Draft pages created or proposed

## Claims needing external sources

## Follow-up questions
```

## Safety gates

- Do not present interview answers as source-verified facts.
- Do not pressure the user with too many questions at once.
- Do not overwrite existing human synthesis.
- Do not publish private answers without approval.
