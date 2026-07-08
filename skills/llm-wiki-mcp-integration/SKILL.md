---
name: llm-wiki-mcp-integration
description: Design or review MCP/API integration for an LLM-Wiki. Use when the user wants agents such as Claude Code, Codex, Cursor, ChatGPT, VS Code, GitHub Copilot, LangGraph or other MCP clients to search, read, lint, rescan, propose, review or export wiki knowledge through MCP or a local/remote API.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse MCP and client docs before giving current protocol, client configuration, auth, SDK or extension-specific instructions.
metadata:
  author: po4yka
  version: "1.0.0"
  install_scope: self-contained
---

# LLM-Wiki MCP Integration

## Goal

Expose LLM-Wiki knowledge to agent clients through MCP or a local/remote API while keeping raw sources, retrieval filters, write permissions, review gates and audit logs explicit.

Use `references/docs/17-mcp-api-integration.md` as the reference playbook for the detailed MCP/API architecture, resource/tool contracts, auth/governance model, client compatibility, deployment patterns and testing checklist.

## When to use

- The user wants Claude Code, Codex, Cursor, ChatGPT, VS Code, GitHub Copilot, LangGraph or another MCP client to search, read, lint, rescan, propose, review or export wiki knowledge.
- A wiki maintainer needs to pick an exposure mode (local stdio, local HTTP, remote read-only, remote governed-write) and is unsure which permission defaults apply.
- Someone is designing MCP resources/tools/prompts or a REST/OpenAPI facade in front of the wiki and needs the contract shapes.
- A team wants to add write/proposal tools and needs the auth scopes, PR/review gate and audit-log requirements defined before granting access.
- Before recommending client-specific integration behavior, re-verify each client's current MCP support against its own docs rather than assuming parity across Claude Code, ChatGPT, Copilot and LangGraph.

## Inputs

- Target clients: Claude Code, Codex, Cursor, ChatGPT, VS Code, GitHub Copilot, LangGraph, OpenCode or other MCP-compatible tools.
- Current wiki layout and retrieval layer.
- Desired operations: search, read, graph traversal, lint, rescan, propose patch, approve review, export, reindex.
- Local-only, remote team, hosted product or enterprise deployment.
- Authentication, authorization and team permission requirements.
- Whether the wiki is git-backed, database-backed, desktop-local or hosted.
- Sensitivity/privacy requirements.

## Procedure

### 1. Choose exposure mode

| Mode | Use when | Default permissions |
| --- | --- | --- |
| local stdio MCP | Personal local-first wiki or editor integration. | Search/read/list only. |
| local HTTP MCP/API | Desktop app or local daemon. | Bind to `127.0.0.1`, token for sensitive operations. |
| local reviewed-write MCP | User wants agents to propose link/page fixes. | Draft patches only. |
| local API + MCP wrapper | Existing app already exposes HTTP API. | MCP calls narrow domain endpoints. |
| remote read-only MCP/API | Team, ChatGPT/company knowledge, GitHub Copilot cloud or autonomous clients. | Search/read/fetch/lint only. |
| remote governed-write MCP/API | Team or product integration. | Auth, tenancy, audit logs, PR/review gates and rate limits required. |

Start read-only unless the user explicitly needs writes and has a review model.

### 2. Model resources, tools and prompts

Resources should expose canonical wiki state:

```text
wiki://manifest
wiki://index
wiki://page/{space}/{slug}
wiki://page/{space}/{slug}/history
wiki://page/{space}/{slug}/lint
wiki://manifest/{source_id}
wiki://graph/neighbors/{space}/{slug}
wiki://review/unresolved
wiki://export/{job_id}
```

Read-only tools:

```text
search_wiki(query, filters, top_k, cursor)
read_page(space, slug)
read_source_manifest(source_id)
graph_neighborhood(node, depth)
list_unresolved_reviews(filters)
run_lint(scope)
explain_retrieval(query_id)
```

Proposal-write tools:

```text
draft_page_patch(path, patch, reason, sources)
propose_new_page(page_type, title, sources)
propose_link_fix(path, links)
propose_review_resolution(review_id, action)
create_pr_from_proposal(proposal_id)
```

Admin tools:

```text
rebuild_index(index_name)
rescan_sources(scope)
export_subset(profile)
approve_proposal(proposal_id)
publish_export(export_id)
```

Admin tools must be disabled by default.

Prompts:

```text
answer_from_wiki
ingest_source
triage_inbox
audit_claims
prepare_export
review_proposal
```

Prompts must preserve the instruction hierarchy and treat wiki/raw content as untrusted data.

### 3. Define response contracts

Every page resource should include:

```yaml
id: "wiki://page/research/example"
space: research
slug: example
title: ""
body_markdown: ""
summary: ""
tags: []
links_to: []
source_citations: []
provenance:
  generated_at: ""
  generated_by: human|agent|importer
  model: ""
revision:
  commit: ""
  parent_commit: ""
  signed: false
review:
  state: draft|reviewed|verified|stale|rejected|approved|published
  required_owners: []
  approvers: []
policy:
  sensitivity: public|internal|sensitive|regulated|unknown
  publication_state: private|internal|public|archived
  tenant_id: ""
```

Every search result should include:

```yaml
id: ""
title: ""
url: "wiki://page/..."
page_path: ""
heading_path: []
excerpt: ""
score: 0.0
retrieval_lane: lexical|dense|hybrid|rerank|graph
source_uris: []
review_state: ""
sensitivity: ""
support_level: extracted|inferred|ambiguous|synthesis|unsupported|conflicting
```

Every write proposal should include:

```yaml
proposal_id: ""
changed_paths: []
base_revision: ""
reason: ""
source_support: []
risk: low|medium|high
requires_human_review: true
required_owners: []
status: draft|opened-pr|approved|rejected|merged
```

### 4. Define auth and permission boundaries

Choose auth by deployment:

| Deployment | Auth pattern |
| --- | --- |
| personal local stdio | local user boundary plus sandboxed startup command. |
| local HTTP | localhost bind + token for sensitive operations. |
| internal remote | API key or OAuth 2.1, gateway rate limits, audit logs. |
| public/enterprise HTTP MCP | OAuth 2.1 or enterprise-managed auth when supported. |
| git-backed writes | GitHub App/service account with minimal repo permissions. |

Define scopes:

| Scope | Allows |
| --- | --- |
| `wiki:read` | Search/read allowed pages. |
| `wiki:lint` | Run/read lint reports. |
| `wiki:propose` | Create patch/page proposals only. |
| `wiki:review` | Review proposals. |
| `wiki:admin` | Reindex, rescan, export, publish, approve/merge. |

Do not pass upstream MCP/client tokens through to downstream APIs. Validate audience and scopes at the wiki boundary.

### 5. Design governance and writes

For team/shared knowledge, prefer:

```text
propose -> branch/patch artifact -> lint/eval/security checks -> CODEOWNERS review -> merge -> index refresh
```

Require:

- proposal tools create patches, not direct writes;
- `approve_proposal` checks owner/review status;
- protected branches and required checks for shared wiki repos;
- signed commits or attributable service-account commits where possible;
- source citations and proposal metadata preserved;
- pending/rejected content excluded from production retrieval.

### 6. Add REST/OpenAPI facade when useful

Use a REST facade for CI and non-MCP clients:

| Endpoint | MCP mapping |
| --- | --- |
| `GET /manifest` | `wiki://manifest` |
| `GET /search?q=` | `search_wiki` |
| `GET /pages/{space}/{slug}` | `wiki://page/{space}/{slug}` |
| `GET /pages/{space}/{slug}/history` | history resource |
| `GET /pages/{space}/{slug}/lint` | lint resource |
| `POST /proposals` | proposal tools |
| `PATCH /pages/{space}/{slug}` | patch-as-proposal |
| `POST /approvals/{proposal_id}` | `approve_proposal` |
| `POST /indexes/{name}/rebuild` | `rebuild_index` |
| `GET /exports/{id}` | export resource/task |

Use standard HTTP errors: `400`, `401`, `403`, `404`, `409`, `422`, `429`, `500`, `503`.

### 7. Review client compatibility

| Client/host | Recommended contract |
| --- | --- |
| Claude Code | Local stdio/local HTTP MCP; read/proposal tools for developer workflows. |
| Claude Messages API connector | Remote MCP with explicit allow/deny tool policy. |
| Codex CLI/IDE | stdio or Streamable HTTP; use tool approval modes and read/propose split. |
| Cursor/VS Code | MCP server plus prompts/resources. |
| GitHub Copilot cloud/repo MCP | Read-only, narrowly allowlisted tools; avoid assuming prompts/resources support. |
| ChatGPT/deep research/company knowledge | Read-only `search` + `fetch` compatibility surface with citation URLs. |
| LangChain/LangGraph | MCP adapters or Agent Server MCP endpoint; structured outputs. |
| GitHub Actions | Runner for lint/eval/export/proposal PRs, not the primary MCP host. |

### 8. Test the integration

Run:

- list resources/templates;
- read known page;
- search known query with filters;
- denied read of sensitive page;
- denied cross-tenant search;
- read source manifest without raw secret leakage;
- graph neighborhood bounded by depth/size;
- lint tool with bounded runtime;
- proposal-write creates patch only;
- direct write/delete is rejected;
- admin tools are unavailable by default;
- prompt-injection fixture in raw/wiki content cannot alter tool behavior;
- invalid path/URI template values are rejected;
- audit event emitted for sensitive read/proposal;
- rate limit returns structured error;
- export/publication blocked without redaction manifest.

### 9. Hand off for related concerns

- Retrieval/index design: `llm-wiki-retrieval-architect`.
- Security/threat model: `llm-wiki-security-review`.
- Model/data policy: `llm-wiki-model-policy`.
- Team governance: `llm-wiki-team-rollout`.
- Export/publishing: `llm-wiki-export-publish`.

## Output

```markdown
## MCP/API recommendation

## Client and exposure mode

## Resource model

## Tool and prompt surface

## Page/search/proposal contracts

## Auth and permission model

## Governance/write workflow

## REST/OpenAPI facade

## Client compatibility

## Audit and observability

## Security controls

## Test plan

## Risks and mitigations

## Next skill
```

## Safety gates

- Do not expose write tools before read-only tools are tested.
- Do not allow MCP tools to obey instructions embedded in wiki/raw content.
- Do not leak sensitive page contents through semantic search snippets.
- Do not recommend unauthenticated remote MCP servers.
- Do not bypass git/PR/review gates for team knowledge.
- Do not give cloud/autonomous clients broad tool access; start with allowlisted read-only tools.
- Do not make admin tools available by default.
- Do not present registry/server-card/extension support as universal across clients without checking current client compatibility.
