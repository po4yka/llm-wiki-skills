# Expected conflict resolution contract

## Conflict summary

The resolver should identify that Claim A and Claim B disagree about retrieval defaults.

## Expected classification

The conflict should be classified as one of:

```text
scope mismatch | unsupported overgeneralization | terminology drift
```

## Expected resolution options

- Keep `index.md` + exact search as the default for small vaults.
- Mark vector database as an upgrade path after measured retrieval failure.
- Add a caveat that large or semantic-heavy corpora may need hybrid retrieval.

## Safety expectation

Do not auto-delete either claim. Propose a review decision and preserve history.
