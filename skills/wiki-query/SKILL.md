---
name: wiki-query
description: Answer questions from an existing LLM-Wiki vault and save reusable answers back into the wiki. Use when the user asks for research, synthesis, comparison, decision support, or recall from a raw/wiki/schema knowledge base.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to a Markdown LLM-Wiki vault; write access is optional for saving reusable query pages.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# Wiki Query

## Goal

Answer from the compiled wiki first, verify against raw sources when needed, and save reusable answers back into the wiki.

## When to use

- The user asks a question answerable from the existing vault.
- Research, synthesis, comparison or decision support should reuse wiki knowledge.
- A reusable answer should be filed back into the wiki.

A filled question-to-answer example ships in `assets/worked-example.md`.

## Inputs

- User question.
- `wiki/index.md`.
- Relevant wiki pages.
- Raw sources when verification is required.
- Optional output format: memo, table, checklist, PRD, slides outline, report.

## Write permissions

Allowed:

- read all wiki files;
- read raw sources when needed;
- create `wiki/queries/*` for reusable answers;
- create draft `wiki/synthesis/*` only when requested or clearly useful;
- append to `wiki/log.md` when saving an answer.

Not allowed unless explicitly requested:

- rewrite existing source/entity/concept pages;
- mark claims verified;
- edit protected human-owned sections;
- delete or archive pages.

## Procedure

### 1. Clarify the question internally

Identify the answer type, time sensitivity, verification needs and whether the answer should be saved. Do not ask a clarifying question when the best effort is obvious.

### 2. Start with the map

Read `wiki/index.md` first and identify candidate pages.

### 3. Search the wiki

Use exact search for user terms, synonyms, entity names, wikilink targets, frontmatter types and tags. Prefer focused reads over loading many full files.

### 4. Build an evidence set

For each important claim, classify support:

```text
extracted | inferred | ambiguous | synthesis | unsupported | conflicting
```

Use raw sources when the claim is high-impact, current, legal/financial/medical/security-relevant, or the wiki page is stale.

### 5. Answer clearly

Distinguish:

- what the wiki says;
- what is directly sourced;
- what is inferred;
- what remains uncertain;
- what should be checked next.

### 6. File back reusable output

If the answer is durable, create:

```text
wiki/queries/YYYY-MM-DD-question-slug.md
```

Suggested structure:

```markdown
---
type: query
status: draft
created: YYYY-MM-DD
source_paths: []
review_required: true
---

# Question

## Answer

## Evidence used

## Inferences

## Open questions

## Pages to update
```

Append to `wiki/log.md` if a page is saved.

## Output

A direct answer to the user's question: a concise thesis, evidence grouped by theme and labeled `extracted | inferred | ambiguous | synthesis | unsupported | conflicting`, explicit uncertainty, and links to the wiki pages used. When the answer is durable, the same content is also filed as `wiki/queries/YYYY-MM-DD-question-slug.md` (using the structure above) with a matching entry appended to `wiki/log.md`.

## Answer style

Prefer a concise thesis first, evidence grouped by theme, explicit uncertainty, links to relevant wiki pages and one action-oriented next step when appropriate.

Avoid pretending the wiki knows more than it does, citing generated pages as if they were raw sources, or leaving reusable answers in chat only.

## Safety gates

- Default write scope is limited to new `wiki/queries/*` files and, when clearly useful or requested, draft `wiki/synthesis/*` pages.
- Never rewrite, delete, or archive an existing source/entity/concept page, and never mark a claim verified, without an explicit user request and review.
- Leave protected human-owned sections untouched.
- Every saved query page carries `review_required: true` in its frontmatter, and destructive edits to existing pages require explicit request and review before they happen.
