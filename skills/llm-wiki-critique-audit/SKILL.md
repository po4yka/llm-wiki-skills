---
name: llm-wiki-critique-audit
description: Produce an adversarial risk audit for an LLM-Wiki proposal, domain, vault, rollout, or product plan. Use when the user wants a failure-mode register, bad-fit decision, mitigation plan, residual-risk scorecard, or criticism-first stress test; route short adoption answers to llm-wiki-faq.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse and cite fresh sources for current benchmark, provider, tool or security claims.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki Critique Audit

## Goal

Stress-test LLM-Wiki adoption before or during implementation using a criticism-first risk register.

## When to use

Use when the user asks:

- "What are the arguments against LLM-Wiki?"
- "Where will this fail?"
- "Is this domain a bad fit?"
- "How do I avoid slop?"
- "Will this hurt my own understanding?"
- "Is this just RAG?"
- "Will token costs explode?"
- "Can this work for a team?"
- "What are the residual risks after mitigations?"

## Inputs

- A description of the audit target: a domain (research papers, trading notes, personal notes), an existing vault/docs folder, a proposed team rollout, an implementation (CLI, plugin, MCP/API server), or an operating loop (capture, triage, ingest, lint, refresh, publish).
- Any existing vault schema, `CLAUDE.md` contracts, or domain wiki structure for the target, so the domain fit screen and risk scorecard are grounded in real answers rather than assumptions.
- Scale and cost context: source count, corpus size, planned team size, and current token/time budget, needed to answer the domain fit screen and score the token-burn and scale-ceiling risk classes.
- Any mitigations or rollout plans already committed to, so Step 4 can separate genuine mitigations from residual risk instead of re-deriving them from scratch.
- The reference docs listed below when present in the repo; re-verify the risk scorecard against their current content rather than relying on memorized summaries.

## Required references

Read these when available:

- `references/docs/criticism-and-mitigations.md`
- `skills/llm-wiki-faq/references/criticism-pack.md`
- `references/docs/04-anti-slop-and-trust.md`
- `references/docs/08-evaluation-and-metrics.md`
- `references/docs/security/skill-supply-chain.md`
- `references/docs/20-ingestion-pipelines.md`

## Procedure

### 1. Identify the target

Classify the audit target:

| Target | Examples |
| --- | --- |
| domain | research papers, market research, repo docs, trading, personal notes |
| existing vault | Obsidian vault, docs folder, repo wiki |
| proposed rollout | team/company adoption, Confluence replacement, PR workflow |
| implementation | CLI, plugin, MCP/API server, retrieval stack |
| operating loop | capture, triage, ingest, lint, refresh, publish |

### 2. Run the domain fit screen

Ask or infer:

1. Does the wiki compress facts from many sources?
2. Is the goal retrieval or internalization?
3. Is there an anti-smoothing schema?
4. Is lint/reconciliation separate from ingest?
5. Is provenance at least source-level?
6. Is token/time cost measured against baseline?
7. Is ingestion treated as untrusted input?
8. Is there an output loop from day one?
9. Is there a human owner for truth and promotion?
10. Are permission scopes explicit?

If 3 or more answers are negative/unknown, recommend a reversible pilot rather than rollout.

### 3. Score the 17 criticism classes

Use:

| Risk | Severity | Mitigation status | Residual risk | Evidence |
| --- | --- | --- | --- | --- |

Assess:

1. consensus smoothing;
2. context poisoning;
3. iterative summary degradation;
4. generation effect / cognitive debt;
5. complexity beyond comprehension;
6. drift;
7. scale ceiling;
8. negative value on greppable corpus;
9. structured data in Markdown;
10. token burn;
11. "just RAG" / novelty objection;
12. second-order information hop;
13. obsolescence by long context/provider memory;
14. team governance and permission propagation;
15. prompt injection;
16. benchmark vacuum;
17. novelty decay / write-only archive.

### 4. Separate mitigations from residual risks

Do not present mitigations as full solutions. Use three buckets:

```text
solvable with schema/discipline
partially mitigated with residual risk
not solvable by tooling
```

Examples:

- Consensus smoothing: solvable only if the human writes strong epistemic rules.
- Generation effect: not solved by tooling for domains where internalization is the goal.
- Permission propagation on derived pages: not solved generally; use separated scopes.
- Benchmark vacuum: local metrics reduce uncertainty but do not create public proof.

### 5. Recommend operating controls

Map the audit to concrete controls:

| Risk | Control |
| --- | --- |
| smoothing | extraction/antagonist/friction/linking rules |
| poisoning | raw immutability, claim anchors, source refresh |
| cognitive debt | protected `## My synthesis`, manual promotion |
| drift | scheduled lint, reconciliation, `stale_after` |
| scale | staged retrieval and incremental lint |
| greppable negative value | baseline grep comparison |
| token burn | model tiering, content hashes, cost/query measurement |
| prompt injection | least-privilege ingest and untrusted-source handling |
| novelty decay | output loop and retrieval hit metrics |

### 6. Decide adoption stance

Use one of:

| Decision | Meaning |
| --- | --- |
| adopt | Risks are controlled and domain has clear compression/output value. |
| pilot | Risk/value is uncertain; run bounded pilot. |
| redesign | Core controls are missing but domain may be valuable. |
| avoid | Domain is greppable, ownerless, too sensitive or primarily about internalization. |
| split | Use LLM-Wiki for operational/reference layer, manual synthesis for understanding. |

## Output

```markdown
## Critique audit summary

## Adoption decision

## Domain fit screen

## 17-risk scorecard

## Top residual risks

## Mitigations to add before rollout

## What not to automate

## Pilot or rollout plan

## Next skills
```

## Safety gates

- Do not sell LLM-Wiki as universally good.
- Do not treat mitigations as eliminating residual risk.
- Do not recommend LLM-Wiki for tiny greppable corpora without measured value.
- Do not automate human synthesis where the user's goal is internalization.
- Do not recommend team rollout without owners, review gates and permission boundaries.
- Do not route sensitive or mixed-permission data into one derived wiki by default.
- Do not treat prompt instructions as a security boundary; discuss tool permissions.
