---
name: llm-wiki-mcp-integration
description: Design or review MCP/API integration for an LLM-Wiki. Use when the user wants agents such as Claude Code, Codex, Cursor, ChatGPT or VS Code to search, read, lint, rescan or propose wiki updates through MCP or a local API.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Browse MCP and client docs before giving current client configuration or SDK-specific instructions.
metadata:
  author: po4yka
  version: "0.1.0"
---

# LLM-Wiki MCP Integration

## Goal

Expose LLM-Wiki knowledge to agent clients through MCP or a local API while keeping raw sources, write permissions, review gates and audit logs explicit.

## Inputs

- Target clients: Claude Code, Codex, Cursor, ChatGPT, VS Code, OpenCode or other MCP-compatible tools.
- Current wiki layout and retrieval layer.
- Desired operations: search, read, graph traversal, lint, rescan, propose patch, approve review.
- Local-only versus remote access.
- Authentication and team permission requirements.

## Procedure

### 1. Choose exposure mode

| Mode | Use when | Default permissions |
|---|---|---|
| local read-only MCP | Personal local-first wiki or first integration. | Search/read/list only. |
| local reviewed-write MCP | User wants agents to propose link/page fixes. | Draft patches only. |
| local API + MCP wrapper | Existing app already exposes HTTP API. | MCP calls narrow API endpoints. |
| remote MCP/API | Team or product integration. | Auth, tenancy, audit logs and rate limits required. |

Start read-only unless the user explicitly needs writes.

### 2. Model resources, tools and prompts

Resources:

```text
wiki://index
wiki://page/{path}
wiki://log
wiki://manifest/{source_id}
wiki://lint/latest
wiki://review/unresolved
```

Read-only tools:

```text
search_wiki(query, filters)
read_page(path)
read_source_manifest(source_id)
graph_neighborhood(node, depth)
list_unresolved_reviews()
run_lint(scope)
```

Reviewed-write tools:

```text
draft_page_patch(path, patch, reason)
propose_new_page(page_type, title, sources)
propose_link_fix(path, links)
propose_review_resolution(review_id, action)
```

Admin tools:

```text
rescan_sources(scope)
rebuild_index(index_name)
export_subset(profile)
```

Admin tools must be disabled by default.

### 3. Define permission boundaries

At minimum:

- bind local services to `127.0.0.1`;
- use token auth for HTTP APIs;
- avoid unauthenticated remote servers;
- separate read tools from write/proposal tools;
- prohibit raw source deletion or mutation;
- keep human sections protected;
- log every tool call that reads sensitive data or proposes a write;
- enforce sensitivity/access filters before retrieval.

### 4. Define response contracts

Every search/read response should include:

```yaml
page_path: ""
source_paths: []
support_level: source-backed|wiki-backed|inferred|missing|conflicting
status: draft|reviewed|verified|stale
sensitivity: public|internal|sensitive|regulated|unknown
updated_at: YYYY-MM-DD
```

Every write proposal should include:

```yaml
proposal_id: ""
changed_paths: []
reason: ""
source_support: []
risk: low|medium|high
requires_human_review: true
```

### 5. Test the integration

Run:

- search for known page;
- read page with provenance;
- filtered search excluding sensitive content;
- graph neighborhood on a known node;
- unresolved review list;
- lint command;
- rejected direct write;
- accepted patch proposal;
- prompt-injection fixture from an untrusted source.

## Output

```markdown
## MCP/API recommendation

## Client and exposure mode

## Resources/tools/prompts

## Permission model

## Response contracts

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
