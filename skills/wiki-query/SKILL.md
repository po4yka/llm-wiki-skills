# wiki-query

Use this skill when the user asks a question that should be answered from an existing LLM-Wiki vault.

## Goal

Answer from the compiled wiki first, verify against sources when needed, and save reusable answers back into the wiki.

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

Identify:

- what kind of answer is needed;
- what time sensitivity exists;
- whether source verification is required;
- whether the answer should be saved.

Do not ask a clarifying question if the best effort is obvious.

### 2. Start with the map

Read `wiki/index.md` first. Identify candidate pages.

### 3. Search the wiki

Use exact search for:

- user terms;
- synonyms;
- entity names;
- wikilink targets;
- frontmatter types and tags.

Prefer focused reads over loading many full files.

### 4. Build an evidence set

For each important claim, classify support:

```text
source-backed | wiki-backed | inferred | missing | conflicting
```

Use raw sources when the claim is high-impact or the wiki page is stale.

### 5. Answer clearly

The answer should distinguish:

- what the wiki says;
- what is directly sourced;
- what is inferred;
- what remains uncertain;
- what should be checked next.

### 6. File back reusable output

If the answer is durable, create a page:

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

## Answer style

Prefer:

- concise thesis first;
- evidence grouped by theme;
- explicit uncertainty;
- links to relevant wiki pages;
- action-oriented next step when appropriate.

Avoid:

- pretending the wiki knows more than it does;
- citing generated pages as if they were raw sources;
- burying uncertainty at the end;
- producing a long answer that is not filed back when useful.

## Quality checklist

- [ ] `index.md` inspected.
- [ ] Relevant pages searched.
- [ ] Important claims classified by support level.
- [ ] Stale or high-impact claims verified against raw sources when needed.
- [ ] Uncertainty stated.
- [ ] Reusable answer saved or explicitly not saved.
