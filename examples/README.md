# Examples and fixtures

These examples are small fixtures for validating the LLM-Wiki Skills pack and for showing users what a healthy workflow looks like.

| Fixture | Purpose |
| --- | --- |
| `demo-vault/` | Product walkthrough for seeing the first useful loop before installing skills. |
| `minimal-vault/` | End-to-end raw/wiki/schema starter with expected ingest/query/lint contracts. |
| `provenance-gaps/` | Unsupported claims for provenance repair and expected provenance report contract. |
| `claim-anchors/` | Valid claim/source anchors plus fenced-code duplicate examples that should be ignored. |
| `contradiction-case/` | Conflicting claims and expected conflict-resolution contract. |
| `repo-docs-project/` | Codebase documentation scenario and expected repo-docs plan contract. |
| `redaction-case/` | Synthetic sensitive-looking content for redaction preview behavior. |

Use these fixtures with:

```bash
npm run check:examples
npm run validate:claim-anchors
npm run redact:preview -- examples/redaction-case
```

The `expected/` files are not generated outputs. They are semantic contracts for what a successful agent run should include.

They are intentionally small and should not be treated as benchmark results.
