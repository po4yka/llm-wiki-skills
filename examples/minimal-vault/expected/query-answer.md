# Expected query answer contract

## Answer

A good answer should state that a living LLM-Wiki needs:

- preserved raw sources;
- reviewable summaries;
- file-back of reusable answers;
- periodic lint checks;
- separation between extracted claims and inferred synthesis.

## Evidence used

- `raw/sources/example-source.md`

## File-back expectation

If saved, the answer should become a draft page under `wiki/queries/` with:

```yaml
type: query
status: draft
review_required: true
```

## Safety expectation

The answer should not claim that generated pages are verified.
