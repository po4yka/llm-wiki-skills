---
title: Supported claims fixture
type: concept
status: draft
created: 2026-07-06
updated: 2026-07-06
review_required: true
source_paths:
  - examples/minimal-vault/raw/sources/example-source.md
---

# Supported claims fixture

This fixture contains real claim and source anchors that should pass validation.

- A living LLM-Wiki should preserve raw sources. ^claim-20260706-101
  - Support: extracted
  - Source: `examples/minimal-vault/raw/sources/example-source.md` ^src-20260706-101

- Generated pages should not be marked verified without human review. ^claim-20260706-102
  - Support: extracted
  - Source: `examples/minimal-vault/raw/sources/example-source.md` ^src-20260706-102

## Code fence example

The validator should ignore anchors inside fenced examples:

```markdown
- This example reuses an ID without causing a duplicate. ^claim-20260706-101
  - Support: extracted
  - Source: `example.md` ^src-20260706-101
```
