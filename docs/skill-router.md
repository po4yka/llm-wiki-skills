# Skill router

> Goal: choose the first useful skill without reading the whole catalog.

## Machine-readable router

The human guide below is mirrored by [`../skill-router.json`](../skill-router.json). Agents and tooling should prefer the JSON file when they need structured routing metadata such as:

- user intents;
- dependencies;
- recommended next skills;
- write risk;
- web requirement;
- default mode.

Validate it with:

```bash
npm run validate:router
```

## Start here

```text
New to LLM-Wiki?
  -> llm-wiki-orient

Asking why this matters or whether there is evidence?
  -> llm-wiki-faq

Asking for serious arguments against LLM-Wiki, what can fail, or whether a domain is a bad fit?
  -> llm-wiki-critique-audit

Asking whether LLM-Wiki maps to PAF Nexus/Cortex, which Nexus to start with, or how to build company-level shared context?
  -> llm-wiki-paf-adoption

Asking where company/team information lives, what can be automated, how to sync Confluence/Jira/docs changes, how fragile review is, or whether the cost is worth it?
  -> llm-wiki-company-flow-audit

Non-developer, browser-first or Confluence-style adoption concern?
  -> llm-wiki-faq

Worried about PR/MR friction, branch sync, token growth, human-readable docs, LLM slop or sensitive data?
  -> llm-wiki-faq

Asking where to start, when not to use it, who owns/reviews it, cost, ROI, migration risk, replacing Confluence/RAG, vendor lock-in or multi-agent use?
  -> llm-wiki-faq

Need current tools/news/releases?
  -> llm-wiki-news-radar

Need to choose ready-made vs custom?
  -> llm-wiki-choose
```

## Existing material

```text
Have an existing vault/docs folder?
  -> llm-wiki-doctor

Need a plan but no file changes yet?
  -> llm-wiki-migration-planner

Approved to restructure files?
  -> llm-wiki-refactor
```

## Setup target

```text
Need a local-first stack?
  -> llm-wiki-local-first-stack

Already use Obsidian?
  -> llm-wiki-obsidian-hardening

Working on a codebase?
  -> llm-wiki-repo-docs

Need GitHub maintenance automation?
  -> llm-wiki-github-action

Need browser-first capture or team contribution without git friction?
  -> llm-wiki-team-rollout

Need PAF-style Market/Product/Growth Nexus schema or Cortex workflow?
  -> llm-wiki-paf-adoption

Need a connector/source registry plan for Confluence, Jira, Slack, Teams, Drive, GitHub or meetings?
  -> llm-wiki-company-flow-audit
```

## Daily operation

```text
Messy inbox?
  -> wiki-triage

Trusted raw source?
  -> wiki-ingest

Question from the wiki?
  -> wiki-query

Health check?
  -> wiki-lint
```

## Trust and evidence

```text
Unsupported claims?
  -> llm-wiki-provenance

Contradictions?
  -> llm-wiki-conflict-resolver

Worried about slop, context poisoning, consensus smoothing, cognitive debt, drift or write-only archive risk?
  -> llm-wiki-critique-audit

Need anti-slop controls audited in an existing vault?
  -> llm-wiki-trust-audit

Need to prove value?
  -> llm-wiki-eval

Need a with-wiki vs without-wiki adoption benchmark?
  -> llm-wiki-benchmark-suite

Need to prove a Nexus affects company decisions?
  -> llm-wiki-paf-adoption

Need to weigh maintenance effort against benefit across information flows?
  -> llm-wiki-company-flow-audit

Worried the wiki will not fit in context?
  -> llm-wiki-retrieval-architect
```

## Governance

```text
Security and data boundaries?
  -> llm-wiki-security-review

Sensitive data, PII, customer data or secrets in sources?
  -> llm-wiki-privacy-redactor

Model/provider policy?
  -> llm-wiki-model-policy

Permissions, multi-agent access or AGENTS.md/wiki boundary?
  -> llm-wiki-agent-memory-bridge

Team rollout, ownership or review gates?
  -> llm-wiki-team-rollout

Product Engineer / Product Ops ownership of Nexus/Cortex?
  -> llm-wiki-paf-adoption

Source access boundaries, connector permissions or confidential source routing?
  -> llm-wiki-company-flow-audit
```

## Publishing and long-term use

```text
Publish safe subset?
  -> llm-wiki-export-publish

Archive for long-term durability or avoid vendor lock-in?
  -> llm-wiki-archive

Refresh stale sources or source-link rot?
  -> llm-wiki-source-refresh

Redact private content?
  -> llm-wiki-privacy-redactor
```

## Skill authoring

```text
Turn wiki procedure into a skill?
  -> llm-wiki-skill-compiler

Review skills for quality and safety?
  -> llm-wiki-skill-doctor
```
