# Quickstart: first LLM-Wiki in 10 minutes

> Goal: create a minimal raw/wiki/schema vault, ingest one source, ask one question and run one health check.

## 1. Install skills

```bash
npx skills add po4yka/llm-wiki-skills \
  --skill llm-wiki-orient \
  --skill llm-wiki-faq \
  --skill llm-wiki-setup \
  --skill wiki-triage \
  --skill wiki-ingest \
  --skill wiki-query \
  --skill wiki-lint \
  -a claude-code
```

## 2. Create a vault

```bash
mkdir my-llm-wiki
cd my-llm-wiki
mkdir -p raw/sources raw/assets inbox wiki/sources wiki/entities wiki/concepts wiki/queries wiki/synthesis _agent/reports _meta/schemas
printf '# Wiki index\n\n## Sources\n\n## Concepts\n' > wiki/index.md
printf '# Wiki log\n' > wiki/log.md
git init
```

Copy starter files from this repository when available:

```bash
cp templates/vault/AGENTS.md ./AGENTS.md
cp templates/vault/CLAUDE.md ./CLAUDE.md
cp templates/schemas/page.schema.json ./_meta/schemas/page.schema.json
```

## 3. Add one raw source

```bash
cat > raw/sources/example-source.md <<'EOF'
# Example source

A living wiki should preserve raw sources, create reviewable summaries and save useful answers back into durable pages.
EOF
```

## 4. Run the first agent loop

Ask the agent:

```text
Use wiki-ingest on raw/sources/example-source.md. Create a draft source page, update wiki/index.md and append wiki/log.md.
```

Then ask:

```text
Use wiki-query to answer: "What does this source imply for maintaining an LLM-Wiki?" Save the answer if it is reusable.
```

Then ask:

```text
Use wiki-lint and create a report in _agent/reports/.
```

## 5. Review the result

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

## 6. Next steps

- Existing docs: run `llm-wiki-doctor` then `llm-wiki-migration-planner`.
- Obsidian vault: run `llm-wiki-obsidian-hardening` before bulk edits.
- Team repo: run `llm-wiki-repo-docs` and prefer PR-based writes.
- Skeptical about value: run `llm-wiki-eval` after 20-50 sources and 10-20 real questions.
