# Quickstart: first LLM-Wiki in 10 minutes

> Goal: create a minimal raw/wiki/schema vault, ingest one source, ask one question and run one health check.

## Choose a starter lane

| Lane | Use when | Core skills |
| --- | --- | --- |
| Solo local wiki | You want a Markdown/git or Obsidian-adjacent vault. | `llm-wiki-setup`, `wiki-ingest`, `wiki-query`, `wiki-lint` |
| Repo docs | You want coding agents to understand a codebase. | `llm-wiki-repo-docs`, `wiki-query`, `wiki-lint` |
| Team pilot | You need ownership, review queues and evidence before rollout. | `llm-wiki-team-rollout`, `llm-wiki-eval`, `llm-wiki-security-review` |

The steps below implement the solo local wiki lane. For a no-install preview, read `examples/demo-vault/README.md`.

## 1. Create the starter vault

```bash
npx llm-wiki-starter init my-llm-wiki
```

The command:

- creates the raw/wiki vault structure;
- initializes git when the directory is not already in a repository;
- applies the ready external agent preset with instructions and a safe sample source;
- adds preview-first redaction and a fail-closed public export profile;
- installs the nine `external-starter` skills;
- checks the resulting structure.

Existing files are preserved. If `package.json` exists, the starter adds the missing `external:build` script and stops instead of replacing a conflicting script. If agent detection is wrong, add `--agent codex`, `--agent claude-code`, `--agent cursor` or `--agent opencode`.

## 2. Run the first agent loop

Open `my-llm-wiki` in the agent and use one prompt:

```text
Use llm-wiki-zero-to-working-wiki with the existing raw/sources/example-source.md. Complete the first ingest, save one reusable query answer, run wiki-lint and show me the git diff and review-required items.
```

## 3. Review the result

Check:

```bash
git diff
```

A successful first run should produce:

- a source page under `wiki/sources/`;
- an updated `wiki/index.md`;
- an appended `wiki/log.md`;
- a saved query page or an explicit reason not to save;
- a lint report with clear review items.

## 4. Next steps

- Existing docs: run `llm-wiki-doctor` then `llm-wiki-migration-planner`.
- Obsidian vault: run `llm-wiki-obsidian-hardening` before bulk edits.
- Team repo: run `llm-wiki-repo-docs` and prefer PR-based writes.
- Skeptical about value: run `llm-wiki-eval` after 20-50 sources and 10-20 real questions.

## Maintenance ritual

Keep the loop small:

| Cadence | Ask the agent | Review |
| --- | --- | --- |
| After adding sources | "Use wiki-triage, then wiki-ingest on new inbox/raw material." | Draft pages, index and log changes. |
| Weekly | "Use wiki-lint and write a report in `_agent/reports/`." | Stale pages, missing sources, contradictions and orphan pages. |
| Monthly | "Use llm-wiki-eval on the last 10-20 real questions." | Whether the wiki still beats baseline search/chat. |
