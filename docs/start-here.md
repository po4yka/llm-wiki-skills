# LLM-Wiki Agent — start here

You do not need to configure skills, folders, or Git. The starter does this for you.

## 1. Install

Open a terminal and run:

```bash
npx llm-wiki-starter init my-wiki
```

Then open the new `my-wiki` folder in your coding agent.

## 2. Add your documents

Put the documents that you want to use in `inbox/`. Do not add passwords, private keys, or other secrets.

## 3. Ask the agent

```text
Process my inbox
```

The agent sorts the new material, preserves the original files, and creates draft wiki pages with links to their sources.

## 4. Open the wiki

Open `wiki/index.md` to browse the result. New pages stay in draft until you review them.

## Ready-to-use prompts

### Add a source

Put the new file in `inbox/`, then say:

```text
Process the new files in my inbox. Show me the pages you created or changed.
```

### Ask the wiki

```text
Answer this question from my wiki: <your question>. Cite the source pages and tell me what is uncertain.
```

### Check quality

```text
Check my wiki for broken links, missing sources, contradictions, stale pages, and unsupported claims. Show me what needs review.
```

### Update knowledge

Put the new version of a source in `inbox/`, then say:

```text
Process this update. Keep the old source unchanged, update affected draft pages, and show me what changed.
```

### Export a safe public version

Move only approved pages to `wiki/public/`, then run:

```bash
npm run external:build
```

The command writes the public copy to `dist/`. If it finds sensitive content or an unapproved page, it stops and writes details to `dist/redaction-report.json`. It does not publish or upload files.

For CLI options and the technical workflow, see [Quickstart: first LLM-Wiki in 10 minutes](quickstart.md).
