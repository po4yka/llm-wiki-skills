# LLM-Wiki criticism pack

> Purpose: compact objection-handling reference for `llm-wiki-faq` and `llm-wiki-critique-audit`.

## Core stance

A strong LLM-Wiki answer should admit that the pattern has serious failure modes. The right claim is not “LLM-Wiki works.” The right claim is:

> LLM-Wiki can work when it compresses multi-source knowledge, preserves raw evidence, protects human synthesis, runs a living maintenance loop and proves value against a baseline.

## Top objections and honest answers

### 1. “It will smooth my thinking into generic summaries.”

Valid. Ungoverned compilation tends toward consensus summaries.

Mitigate with:

- extraction over summary;
- antagonist rule;
- friction point;
- mandatory linking;
- human-owned synthesis;
- adversarial compilation for high-value domains.

Residual risk: schema quality is human work and cannot be delegated away.

### 2. “It will become organized misinformation.”

Valid. A wrong wiki page can poison future answers.

Mitigate with:

- immutable `raw/`;
- source and claim-level provenance;
- `draft/reviewed/verified/stale/archived` lifecycle;
- lint and source refresh;
- git diff review;
- no generated page as sole evidence for another generated page.

Residual risk: mistakes can live between lint passes.

### 3. “The AI work replaces the thinking I should be doing.”

Valid for domains where the goal is internalization or original writing.

Mitigate by automating bookkeeping only:

```text
agent: links, frontmatter, MOCs, dedup, lint, extraction
human: My synthesis, interpretation, promotion, final claims
```

Residual risk: cognitive debt cannot be solved by tooling.

### 4. “It will drift and become stale.”

Valid. Drift is a normal production failure mode.

Mitigate with scheduled lint, separate reconciliation passes, `stale_after`, source refresh, orphan checks, link-density checks and review queues.

Residual risk: lint costs tokens and attention.

### 5. “It is worse than grep for code or small corpora.”

Often true. LLM-Wiki is not useful when one source file already answers the question.

Mitigate with the compression rule:

> Use LLM-Wiki when pages compress facts scattered across many sources.

For code, prefer architecture maps, ADRs, conventions and “how to change X” pages over one page per source file.

### 6. “Token costs will explode.”

Possible. Use content hashes, model tiering, incremental lint, local models for bulk operations and cost/query measurement.

Residual risk: long-run public cost data is sparse.

### 7. “This is just RAG.”

Partly. Retrieval is RAG-shaped. The difference is the write/maintenance loop: compiled pages, filed-back answers, lint, source refresh and human-readable git history.

Do not claim novelty is the main value. Claim measured workflow fit.

### 8. “The wiki is a second-order hop.”

Valid when exact source facts are cheap to read. Use direct raw/search for exact facts and reviewed wiki synthesis for multi-source questions.

### 9. “Big context windows or provider memory will make this obsolete.”

Maybe for some glue. The durable hedge is user-owned Markdown/raw/schema/git. Treat indexes, MCP servers and vector stores as replaceable.

### 10. “Teams will fail on governance and permissions.”

Valid. Team LLM-Wiki needs owners, PR/review gates, sensitivity inheritance and separated permission scopes. Derived permission propagation is not solved generally.

### 11. “Prompt injection can attack the ingest pipeline.”

Valid. Treat source content as untrusted data. Use least-privilege tools, staging, no direct raw mutation and review before promotion.

### 12. “There is no benchmark proof.”

Valid. Use local pilots and metrics. Do not present adjacent RAG/memory evidence as proof that a particular wiki will work.

### 13. “It is fun to build but becomes a write-only archive.”

Valid. The output loop must exist from day one: queries, digests, saved answers, retrieval hits and output beyond the vault.

## Domain fit quick screen

Recommend a pilot only when most answers are yes:

1. Does the domain require synthesis across many sources?
2. Is rediscovery expensive?
3. Will output use the wiki weekly?
4. Can raw evidence be preserved?
5. Can a human own synthesis and promotion?
6. Can lint/reconciliation run on a schedule?
7. Can sensitive data boundaries be defined?
8. Can cost/query be compared with a baseline?

If no to 1, 3 or 5, avoid or split the domain.

## Standard response pattern

```markdown
## Direct answer

Yes, that criticism is real.

## Where it applies

## Mitigation

## Honest residual risk

## What I would do for your case
```

## Useful routes

- Serious objections: `llm-wiki-critique-audit`.
- Slop/trust: `llm-wiki-trust-audit`, `llm-wiki-provenance`, `llm-wiki-claim-anchors`.
- Cost/value: `llm-wiki-eval`, `llm-wiki-benchmark-suite`.
- Security: `llm-wiki-threat-model`, `llm-wiki-security-review`.
- Team governance: `llm-wiki-team-rollout`, `llm-wiki-company-flow-audit`.
