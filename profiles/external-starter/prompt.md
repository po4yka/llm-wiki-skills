# External starter bootstrap prompt

Copy the text below into an Agent Skills-compatible coding agent.

```text
Set up the supported LLM-Wiki external starter profile in the current project.

1. Inspect the current directory, repository instructions, and git status. Preserve all existing work.
2. Detect your Agent Skills target ID. Use `claude-code`, `codex`, `cursor`, or `opencode` when applicable. If you cannot identify a supported target, ask me one focused question before installation.
3. Explain that the next command installs nine project-scoped skills from `po4yka/llm-wiki-skills`. Then replace `<agent-id>` and run:

   npx skills add po4yka/llm-wiki-skills \
     --skill llm-wiki-zero-to-working-wiki \
     --skill llm-wiki-setup \
     --skill wiki-triage \
     --skill wiki-ingest \
     --skill wiki-query \
     --skill wiki-lint \
     --skill llm-wiki-privacy-redactor \
     --skill llm-wiki-export-publish \
     --skill llm-wiki-security-review \
     --copy -y -a <agent-id>

4. Read the installed `llm-wiki-zero-to-working-wiki` and `llm-wiki-setup` instructions before you change project files. Treat skill installation as complete. Do not install more skills or the full pack unless I ask.
5. Configure the smallest working local-first LLM-Wiki in this project. Reuse existing files and structure. Do not overwrite instruction files, raw sources, or human-written wiki content.
6. If there is no usable source, create the small sample source defined by `llm-wiki-zero-to-working-wiki`. Run one ingest, one reusable query, and one lint report. Keep generated wiki pages as drafts.
7. Do not send private content to cloud services. Do not publish anything. Prepare redaction, security review, and export skills for later use only.
8. Finish with the installed skill names, changed files, checks run and observed results, review-required items, and the next prompt I should use.
```
