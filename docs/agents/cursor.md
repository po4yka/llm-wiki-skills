# Cursor adapter

## Install

```bash
npx skills add po4yka/llm-wiki-skills --skill llm-wiki-repo-docs --skill wiki-query -a cursor
```

## Recommended use

Use Cursor when the LLM-Wiki is close to code editing:

- repository documentation;
- module maps;
- coding-agent context;
- ADR memory;
- small project-local wiki pages.

## Instruction pattern

Keep Cursor rules focused on project conventions and point to `wiki/index.md` for domain knowledge.

## Safety notes

- Do not duplicate large domain knowledge in editor rules.
- Do not convert wiki pages into hidden prompt context.
- Use `llm-wiki-agent-memory-bridge` if instruction files become bloated.
