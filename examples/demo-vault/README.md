# Demo vault walkthrough

Use this demo when you want to see the product shape before installing skills.

It reuses `examples/minimal-vault/` as a tiny LLM-Wiki:

| Step | File to inspect | What it proves |
| --- | --- | --- |
| Raw source | `../minimal-vault/raw/sources/example-source.md` | Raw evidence stays preserved. |
| Wiki map | `../minimal-vault/wiki/index.md` | The wiki has human-readable navigation. |
| Ingest contract | `../minimal-vault/expected/ingest-summary.md` | Generated pages stay draft and reviewable. |
| Query contract | `../minimal-vault/expected/query-answer.md` | Reusable answers can be saved back without pretending to be verified. |
| Lint contract | `../minimal-vault/expected/lint-report.md` | Maintenance produces review queues, not silent truth rewrites. |

## Try it locally

```bash
cp -R examples/minimal-vault /tmp/llm-wiki-demo
cd /tmp/llm-wiki-demo
git init
```

Then ask your agent:

```text
Use wiki-ingest on raw/sources/example-source.md. Create draft wiki pages, update wiki/index.md and append wiki/log.md.
```

Follow with:

```text
Use wiki-query to answer: "What maintenance loop does this source recommend?" Save the answer only if it is reusable.
```

Finish with:

```text
Use wiki-lint and write a report under _agent/reports/.
```

The expected files show what a good result must include. They are contracts, not benchmark scores.
