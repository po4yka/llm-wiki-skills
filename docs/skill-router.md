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

Need a failure-mode register, residual-risk scorecard, mitigation plan, or bad-fit decision?
  -> llm-wiki-critique-audit

Asking whether LLM-Wiki maps to PAF Nexus/Cortex, which Nexus to start with, or how to build company-level shared context?
  -> llm-wiki-paf-adoption

Asking where company/team information lives, what can be automated, how to sync Confluence/Jira/docs changes, how fragile review is, or whether the cost is worth it?
  -> llm-wiki-company-flow-audit

Non-developer, browser-first or Confluence-style adoption concern?
  -> llm-wiki-faq

Need a concise adoption answer about PR/MR friction, branch sync, token growth, human-readable docs, slop risk or sensitive data?
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

Need cross-channel capture architecture, an inbox/raw topology, metadata contract or triage handoff?
  -> llm-wiki-capture-pipeline

Need a named capture connector or channel runbook (Telegram, email, Slack, voice notes)?
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
Need to investigate unsupported claims, missing sources or wrong support labels?
  -> llm-wiki-provenance

Need deterministic claim/source IDs or anchor validation after evidence is known?
  -> llm-wiki-claim-anchors

Need to recover why decisions were made (ADRs, decision memory)?
  -> llm-wiki-adr-memory

Contradictions?
  -> llm-wiki-conflict-resolver

Need an adversarial failure-mode audit with residual-risk scoring and mitigation planning?
  -> llm-wiki-critique-audit

Need anti-slop controls audited in an existing vault?
  -> llm-wiki-trust-audit

Need to prove humans can find answers without agents?
  -> llm-wiki-human-first-design

Need to define or interpret LLM-Wiki quality/usefulness metrics?
  -> llm-wiki-eval

Need to run a bounded pilot benchmark with baseline and with-wiki passes?
  -> llm-wiki-benchmark-suite

Need to choose eval frameworks, dataset formats, scorecards or CI gates?
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
Is an existing setup safe enough, or are current data boundaries unclear?
  -> llm-wiki-security-review

Need a new structured threat model (STRIDE/LINDDUN, data-flow diagram, trust boundaries, attack surface, risk matrix)?
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

## Route inventory

<!-- generated:route-inventory:start -->
<!-- Generated by `npm run catalog:generate`. Do not edit this block by hand. -->

| Skill | Primary intents | Risk | Web | Mode | Next |
|---|---|---|---|---|---|
| [`llm-wiki-adr-memory`](../skills/llm-wiki-adr-memory/SKILL.md) | why was this decided; decision provenance; generate adrs; decision memory | medium | no | propose-adrs-first | llm-wiki-repo-docs, llm-wiki-provenance |
| [`llm-wiki-agent-memory-bridge`](../skills/llm-wiki-agent-memory-bridge/SKILL.md) | wiki versus agent memory; agents.md boundary; bloated instruction files; memory boundaries | low | no | recommendation | llm-wiki-repo-docs, llm-wiki-refactor |
| [`llm-wiki-archive`](../skills/llm-wiki-archive/SKILL.md) | long-term archive; archive manifest; durability in 5-10 years; export opaque stores | medium | no | archive-plan-first |  |
| [`llm-wiki-benchmark-suite`](../skills/llm-wiki-benchmark-suite/SKILL.md) | pilot benchmark; run baseline pass; run with wiki pass; score pilot tasks; continue pause redesign decision | low | no | report-only | llm-wiki-eval-tooling, llm-wiki-human-first-design, llm-wiki-critique-audit |
| [`llm-wiki-capture-pipeline`](../skills/llm-wiki-capture-pipeline/SKILL.md) | capture pipeline architecture; cross channel topology; inbox raw flow; capture metadata contract; dedupe boundary; triage handoff | low | no | design-proposal | llm-wiki-channel-capture, wiki-triage |
| [`llm-wiki-channel-capture`](../skills/llm-wiki-channel-capture/SKILL.md) | telegram connector; email connector; voice note connector; slack export runbook; specific channel connector; channel api setup | low | yes | connector-design-proposal | wiki-triage, llm-wiki-ingestion-stack |
| [`llm-wiki-choose`](../skills/llm-wiki-choose/SKILL.md) | choose tool; ready-made vs custom; openwiki vs obsidian; build or buy | none | yes | recommendation | llm-wiki-setup, llm-wiki-design, llm-wiki-doctor, llm-wiki-human-first-design, llm-wiki-critique-audit |
| [`llm-wiki-claim-anchors`](../skills/llm-wiki-claim-anchors/SKILL.md) | claim anchors; stable claim ids; source anchor ids; format support labels; validate claim anchors | medium | no | patch-after-evidence | llm-wiki-conflict-resolver |
| [`llm-wiki-company-flow-audit`](../skills/llm-wiki-company-flow-audit/SKILL.md) | map information flows; connector registry; confluence jira sync; automation candidates; maintenance cost versus benefit | none | no | report-only | llm-wiki-team-rollout, llm-wiki-ingestion-stack, llm-wiki-security-review |
| [`llm-wiki-conflict-resolver`](../skills/llm-wiki-conflict-resolver/SKILL.md) | contradictions; conflicting claims; resolve lint findings | medium | no | resolution-options | llm-wiki-source-refresh |
| [`llm-wiki-critique-audit`](../skills/llm-wiki-critique-audit/SKILL.md) | risk report; what could go wrong; bad fit assessment; adversarial critique; failure mode register; residual risk scorecard; mitigation plan | none | no | report-only | llm-wiki-human-first-design, llm-wiki-eval, llm-wiki-trust-audit, llm-wiki-provenance, llm-wiki-security-review |
| [`llm-wiki-design`](../skills/llm-wiki-design/SKILL.md) | design custom implementation; build my own system; data model design; mvp architecture | none | no | architecture-proposal | llm-wiki-setup, llm-wiki-retrieval-architect, llm-wiki-implementation-deep-dive |
| [`llm-wiki-doctor`](../skills/llm-wiki-doctor/SKILL.md) | diagnose vault; what is wrong; existing docs; read-only audit | none | no | report-only | llm-wiki-migration-planner, llm-wiki-human-first-design, llm-wiki-provenance, llm-wiki-trust-audit, llm-wiki-critique-audit |
| [`llm-wiki-domain-pack`](../skills/llm-wiki-domain-pack/SKILL.md) | domain templates; domain taxonomy; domain_type mapping; second brain pack; team onboarding pack | medium | no | propose-pack-first | llm-wiki-setup, wiki-ingest |
| [`llm-wiki-ecosystem-registry`](../skills/llm-wiki-ecosystem-registry/SKILL.md) | ecosystem registry; what projects exist; compare ready-made implementations; missing technologies | low | yes | report-with-citations | llm-wiki-implementation-deep-dive, llm-wiki-choose |
| [`llm-wiki-eval`](../skills/llm-wiki-eval/SKILL.md) | define measurement; evaluate usefulness; quality metrics; retrieval hit rate; maintenance health; interpret eval results | low | no | report-only | llm-wiki-benchmark-suite, llm-wiki-eval-tooling, llm-wiki-human-first-design, llm-wiki-critique-audit |
| [`llm-wiki-eval-tooling`](../skills/llm-wiki-eval-tooling/SKILL.md) | eval tools; ragas promptfoo deepeval; ci eval gates; choose scorecard; eval framework selection | none | yes | recommendation-with-citations | llm-wiki-benchmark-suite |
| [`llm-wiki-export-publish`](../skills/llm-wiki-export-publish/SKILL.md) | publish wiki; export docs; public subset; handbook | medium | no | publish-plan-first | llm-wiki-archive |
| [`llm-wiki-faq`](../skills/llm-wiki-faq/SKILL.md) | why needed; benefits; evidence summary; proof question; obsidian required; living wiki; answer objection; stakeholder faq; concise rebuttal | none | no | answer | llm-wiki-human-first-design, llm-wiki-critique-audit, llm-wiki-choose, llm-wiki-eval, llm-wiki-trust-audit |
| [`llm-wiki-github-action`](../skills/llm-wiki-github-action/SKILL.md) | github action; scheduled lint reports; pr-based doc updates; ci wiki maintenance | medium | no | propose-workflow-first | wiki-lint, llm-wiki-security-review |
| [`llm-wiki-gitlab-operating-model`](../skills/llm-wiki-gitlab-operating-model/SKILL.md) | gitlab self-managed; air-gapped rollout; merge request operating model; gitlab ci wiki | none | no | plan-only | llm-wiki-team-rollout, llm-wiki-security-review |
| [`llm-wiki-human-first-design`](../skills/llm-wiki-human-first-design/SKILL.md) | human first wiki; agent disappears; human can find without agent; avoid generated document dump; confluence mess; human readable documentation; page contract; navigation maps; agent generated markdown dump; human findability | none | no | design-and-audit | llm-wiki-critique-audit, llm-wiki-trust-audit, llm-wiki-eval, llm-wiki-benchmark-suite, llm-wiki-team-rollout |
| [`llm-wiki-implementation-deep-dive`](../skills/llm-wiki-implementation-deep-dive/SKILL.md) | implementation deep dive; architecture comparison; production readiness; what to copy from openwiki | none | yes | answer-with-citations | llm-wiki-design, llm-wiki-choose |
| [`llm-wiki-ingestion-stack`](../skills/llm-wiki-ingestion-stack/SKILL.md) | ingestion stack; document conversion; pdf to markdown; ocr pipeline; incremental source sync | none | yes | recommendation | wiki-ingest, llm-wiki-security-review |
| [`llm-wiki-interview`](../skills/llm-wiki-interview/SKILL.md) | knowledge interview; extract tacit knowledge; open questions backlog; undocumented decisions | medium | no | draft-pages-for-review | wiki-ingest, llm-wiki-provenance |
| [`llm-wiki-local-first-stack`](../skills/llm-wiki-local-first-stack/SKILL.md) | local-first stack; offline wiki; local embeddings; avoid cloud lock-in | none | yes | recommendation | llm-wiki-setup, llm-wiki-obsidian-hardening, llm-wiki-retrieval-architect |
| [`llm-wiki-mcp-integration`](../skills/llm-wiki-mcp-integration/SKILL.md) | mcp integration; wiki api access; connect agents to wiki; mcp server design | none | no | design-review | llm-wiki-security-review, llm-wiki-threat-model |
| [`llm-wiki-migration-planner`](../skills/llm-wiki-migration-planner/SKILL.md) | migration plan; dry-run refactor; move docs later | none | no | plan-only | llm-wiki-refactor, llm-wiki-human-first-design, llm-wiki-obsidian-hardening |
| [`llm-wiki-model-policy`](../skills/llm-wiki-model-policy/SKILL.md) | model policy; which models allowed; keep data local; provider data use; model provenance frontmatter | low | yes | policy-proposal | llm-wiki-privacy-redactor, llm-wiki-security-review |
| [`llm-wiki-news-radar`](../skills/llm-wiki-news-radar/SKILL.md) | latest news; fresh releases; recent papers; ecosystem changes | none | yes | answer-with-citations | llm-wiki-ecosystem-registry, llm-wiki-choose |
| [`llm-wiki-obsidian-hardening`](../skills/llm-wiki-obsidian-hardening/SKILL.md) | harden obsidian vault; agent-safe obsidian; protect wikilinks; vault sync safety | medium | no | plan-before-apply | wiki-lint, llm-wiki-trust-audit |
| [`llm-wiki-orient`](../skills/llm-wiki-orient/SKILL.md) | what is llm-wiki; explain pattern; compare with rag; solution landscape | none | no | answer | llm-wiki-faq, llm-wiki-human-first-design, llm-wiki-news-radar, llm-wiki-choose |
| [`llm-wiki-paf-adoption`](../skills/llm-wiki-paf-adoption/SKILL.md) | paf nexus; cortex workflow; company-level nexus; which nexus first; measure decision impact | none | no | answer | llm-wiki-company-flow-audit, llm-wiki-team-rollout |
| [`llm-wiki-privacy-redactor`](../skills/llm-wiki-privacy-redactor/SKILL.md) | redact sensitive content; pii scan; remove secrets before export; private tags | medium | no | preview-and-plan-first | llm-wiki-export-publish, llm-wiki-security-review |
| [`llm-wiki-provenance`](../skills/llm-wiki-provenance/SKILL.md) | missing sources; provenance gaps; unsupported claims; repair evidence links; investigate support labels | medium | no | report-or-patch | llm-wiki-claim-anchors, llm-wiki-conflict-resolver |
| [`llm-wiki-refactor`](../skills/llm-wiki-refactor/SKILL.md) | refactor docs; organize vault; apply migration; frontmatter normalization | high | no | dry-run-first | wiki-lint, llm-wiki-provenance |
| [`llm-wiki-repo-docs`](../skills/llm-wiki-repo-docs/SKILL.md) | repo docs wiki; agent-readable codebase docs; architecture map; module pages; agents.md pointers | medium | no | propose-structure-first | llm-wiki-github-action, llm-wiki-adr-memory, wiki-lint |
| [`llm-wiki-retrieval-architect`](../skills/llm-wiki-retrieval-architect/SKILL.md) | retrieval design; hybrid search; vector database choice; graphrag architecture; wiki does not fit in context | none | yes | recommendation | llm-wiki-local-first-stack, llm-wiki-mcp-integration, llm-wiki-eval |
| [`llm-wiki-security-review`](../skills/llm-wiki-security-review/SKILL.md) | security review; is my setup safe; existing configuration safety; data boundary review; mcp exposure review; skill safety review | none | no | report-only | llm-wiki-model-policy, llm-wiki-privacy-redactor |
| [`llm-wiki-setup`](../skills/llm-wiki-setup/SKILL.md) | set up wiki; install workflow; bootstrap vault; configure agent skills; connect coding agent | medium | no | plan-then-scaffold | llm-wiki-domain-pack, llm-wiki-obsidian-hardening, wiki-ingest |
| [`llm-wiki-skill-compiler`](../skills/llm-wiki-skill-compiler/SKILL.md) | wiki to skill; compile procedure; generate skill | medium | no | propose-first | llm-wiki-skill-doctor |
| [`llm-wiki-skill-doctor`](../skills/llm-wiki-skill-doctor/SKILL.md) | review skill; skill smells; unsafe skill; quality audit | none | no | report-only |  |
| [`llm-wiki-source-refresh`](../skills/llm-wiki-source-refresh/SKILL.md) | stale sources; refresh current claims; dead links; current as of | medium | yes | report-or-propose-patch | llm-wiki-provenance, llm-wiki-conflict-resolver |
| [`llm-wiki-team-rollout`](../skills/llm-wiki-team-rollout/SKILL.md) | team rollout; adoption plan; ownership and review gates; pr-based agent writes; bus factor | none | no | plan-only | llm-wiki-company-flow-audit, llm-wiki-gitlab-operating-model, llm-wiki-github-action, llm-wiki-security-review |
| [`llm-wiki-threat-model`](../skills/llm-wiki-threat-model/SKILL.md) | threat model; stride analysis; linddun analysis; data flow diagram; attack surface mapping; trust boundaries; risk matrix; security architecture controls | none | no | report-only | llm-wiki-security-review, llm-wiki-trust-audit |
| [`llm-wiki-trust-audit`](../skills/llm-wiki-trust-audit/SKILL.md) | trust audit; can the wiki be trusted; anti-slop controls; unsafe agent write permissions; prompt-injection exposure | none | no | report-only | llm-wiki-provenance, llm-wiki-critique-audit, wiki-lint |
| [`wiki-ingest`](../skills/wiki-ingest/SKILL.md) | ingest source; add pdf; add article; create source page | medium | no | analyze-before-write | wiki-query, wiki-lint, llm-wiki-provenance |
| [`wiki-lint`](../skills/wiki-lint/SKILL.md) | lint wiki; broken links; orphan pages; stale claims; review queue | low | no | report-only | llm-wiki-human-first-design, llm-wiki-provenance, llm-wiki-conflict-resolver, llm-wiki-critique-audit |
| [`wiki-query`](../skills/wiki-query/SKILL.md) | answer from wiki; research answer; save reusable answer | low | no | answer-and-offer-file-back | llm-wiki-human-first-design, llm-wiki-eval, wiki-lint |
| [`wiki-triage`](../skills/wiki-triage/SKILL.md) | triage inbox; sort captures; keep defer drop; duplicate review | low | no | report-only | wiki-ingest, llm-wiki-channel-capture |

Default entrypoints: `llm-wiki-orient`, `llm-wiki-faq`, `llm-wiki-human-first-design`, `llm-wiki-choose`, `llm-wiki-doctor`.

<!-- generated:route-inventory:end -->

## Skill authoring
