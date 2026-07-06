# Claim-level provenance anchors

> Status: draft
> Scope: deterministic Markdown convention for claim-level provenance in LLM-Wiki pages.

## Thesis

Page-level provenance is useful but not enough for high-trust knowledge. Important claims need stable anchors that can be audited, refreshed and linked back to raw sources.

## Anchor format

Use deterministic anchors:

```markdown
- Claim text. ^claim-20260706-001
  - Support: extracted
  - Source: `raw/sources/example.md` ^src-20260706-001
```

Allowed support values:

```text
extracted | inferred | ambiguous | unsupported | conflicting
```

## Rules

1. Claim anchors start with `^claim-YYYYMMDD-NNN`.
2. Source anchors start with `^src-YYYYMMDD-NNN`.
3. Each claim anchor must be followed within three lines by a `Support:` line.
4. Anchors must be unique across the repository.
5. Do not fabricate anchors for sources the agent did not inspect.
6. Use `unsupported` instead of forcing weak evidence to fit a claim.

## Example

```markdown
- Good answers should be filed back into the wiki. ^claim-20260706-001
  - Support: extracted
  - Source: `raw/sources/llm-wiki-idea.md` ^src-20260706-001
```

## Review workflow

1. `llm-wiki-provenance` finds unsupported or high-impact claims.
2. `llm-wiki-claim-anchors` adds deterministic anchors.
3. `npm run validate:claim-anchors` checks uniqueness and support lines.
4. `llm-wiki-conflict-resolver` handles conflicting claims.

## Failure modes

- Anchors without source inspection create false trust.
- Generated summaries citing other generated summaries are not enough for verified claims.
- Claim IDs that are rewritten during refactors break audit history.
