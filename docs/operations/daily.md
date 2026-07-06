# Daily LLM-Wiki operations

## Goal

Keep capture cheap and avoid turning the wiki into a write-only archive.

## Checklist

- [ ] Capture raw material into `inbox/` or `raw/` without filing decisions.
- [ ] Run quick `wiki-triage` for urgent items.
- [ ] File back any answer that is likely to be reused.
- [ ] Avoid promoting generated pages beyond `draft` without review.
- [ ] Check whether any open question blocks active work.

## Agent prompt

```text
Use wiki-triage on today's inbox items. Produce a report only. Do not delete or move files.
```
