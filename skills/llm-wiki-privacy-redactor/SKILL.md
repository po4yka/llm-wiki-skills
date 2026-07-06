---
name: llm-wiki-privacy-redactor
description: Preview and plan redaction of private or sensitive content before publishing, exporting, or sending LLM-Wiki context to external models. Use for emails, tokens, internal URLs, phone numbers, private tags, and sensitive page metadata.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Requires read access to target files; write access is optional and should use preview-first mode.
metadata:
  author: po4yka
  version: "0.1.0"
---

# LLM-Wiki Privacy Redactor

## Goal

Prevent private content from leaking through public exports, model-boundary payloads or shared reports.

## Inputs

- Target pages, folders or export bundle.
- Redaction policy file if present.
- Desired mode: preview-only or approved patch.
- Publication or model-boundary target.

## Procedure

### 1. Load policy

Read `docs/security/redaction-policy.md` and `templates/redaction-policy.yml` when available.

### 2. Classify content

Flag:

- email addresses;
- phone numbers;
- internal URLs;
- secret-like strings;
- private tags;
- pages with `privacy: sensitive`;
- raw sources marked internal/sensitive;
- unreviewed generated claims in publishable output.

### 3. Preview redactions

Run or recommend:

```bash
npm run redact:preview -- <path>
```

Show redaction candidates without modifying files.

### 4. Propose replacements

Use stable placeholders:

```text
[REDACTED_EMAIL]
[REDACTED_INTERNAL_URL]
[REDACTED_SECRET]
[REDACTED_PHONE]
```

### 5. Apply only after approval

Apply changes only to an export copy unless the user explicitly asks to patch the source wiki.

## Output

```markdown
## Redaction summary

## Files inspected

## Findings by category

## Proposed redactions

## Export safety decision

## Review required
```

## Safety gates

- Do not print sensitive findings verbatim in final reports.
- Do not mutate source wiki files by default.
- Do not send sensitive content to external models without explicit approval.
- Do not treat redaction as proof that publication is safe.
