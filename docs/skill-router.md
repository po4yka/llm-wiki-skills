# Skill router

> Goal: choose the first useful skill without reading the whole catalog.

## Machine-readable router

The decision tree below and [`../skill-router.json`](../skill-router.json) cover the same set of skills: every skill in `skills/` has an entry in both. The JSON file is the authoritative machine-readable router; agents and tooling should prefer it when they need structured routing metadata such as:

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

Arguing that LLM-Wiki must not be an agent-generated dump, or asking whether humans can find information without agents?
  -> llm-wiki-human-first-design

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

Need a registry of implementations and adjacent frameworks?
  -> llm-wiki-ecosystem-registry

Need an architecture-depth comparison of concrete implementations?
  -> llm-wiki-implementation-deep-dive

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
Chosen a workflow and ready to install and configure it?
  -> llm-wiki-setup

Building a custom implementation, CLI, plugin or product?
  -> llm-wiki-design

Need a local-first stack?
  -> llm-wiki-local-first-stack

Already use Obsidian?
  -> llm-wiki-obsidian-hardening

Working on a codebase?
  -> llm-wiki-repo-docs

Need domain-specific templates, taxonomies and review gates?
  -> llm-wiki-domain-pack

Need GitHub maintenance automation?
  -> llm-wiki-github-action

Need browser-first or low-friction capture into an inbox?
  -> llm-wiki-capture-pipeline

Need channel-specific capture (Telegram, email, Slack, voice notes)?
  -> llm-wiki-channel-capture

Need a document-conversion and ingestion stack (PDF, Office, audio, OCR)?
  -> llm-wiki-ingestion-stack

Need agents to reach the wiki over MCP or an API?
  -> llm-wiki-mcp-integration

Need human-first page contracts, decision maps, protected synthesis or agent-disappears acceptance tests?
  -> llm-wiki-human-first-design

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

Tacit knowledge, onboarding gaps or open questions to extract by interview?
  -> llm-wiki-interview

Health check?
  -> wiki-lint
```

## Trust and evidence

```text
Unsupported claims?
  -> llm-wiki-provenance

Need claim-level anchors with stable claim IDs?
  -> llm-wiki-claim-anchors

Need to recover why decisions were made (ADRs, decision memory)?
  -> llm-wiki-adr-memory

Contradictions?
  -> llm-wiki-conflict-resolver

Worried about slop, context poisoning, consensus smoothing, cognitive debt, drift or write-only archive risk?
  -> llm-wiki-critique-audit

Need anti-slop controls audited in an existing vault?
  -> llm-wiki-trust-audit

Need to prove humans can find answers without agents?
  -> llm-wiki-human-first-design

Need to prove value?
  -> llm-wiki-eval

Need a with-wiki vs without-wiki adoption benchmark?
  -> llm-wiki-benchmark-suite

Need concrete eval tools, datasets, scorecards or CI gates?
  -> llm-wiki-eval-tooling

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

Need a structured threat model (STRIDE, trust boundaries, risk matrix)?
  -> llm-wiki-threat-model

Sensitive data, PII, customer data or secrets in sources?
  -> llm-wiki-privacy-redactor

Model/provider policy?
  -> llm-wiki-model-policy

Permissions, multi-agent access or AGENTS.md/wiki boundary?
  -> llm-wiki-agent-memory-bridge

Team rollout, ownership or review gates?
  -> llm-wiki-team-rollout

Rolling out on self-hosted GitLab or an internal enterprise contour?
  -> llm-wiki-gitlab-operating-model

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
