---
name: llm-wiki-channel-capture
description: Design legacy named channel capture requests by routing them to llm-wiki-capture-pipeline. Use only for compatibility when the user or installed workflow explicitly names llm-wiki-channel-capture.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Deprecated compatibility alias; use llm-wiki-capture-pipeline for new work.
metadata:
  author: po4yka
  version: "0.1.1"
  install_scope: self-contained
  deprecated: true
  replaced_by: llm-wiki-capture-pipeline
---

# LLM-Wiki Channel Capture

## Goal

Preserve compatibility for users who installed or invoked `llm-wiki-channel-capture` before named-channel connector runbooks were consolidated into `llm-wiki-capture-pipeline`.

## Procedure

Use `llm-wiki-capture-pipeline` for all new capture work. In that skill, run named-channel mode when the user names Telegram, email, browser clips, Readwise/Omnivore, voice notes, PDFs, GitHub, Slack, Discord, Teams, meetings, auth scopes, rate limits, attachment rules or API setup.

## Output

State that `llm-wiki-channel-capture` is deprecated and continue with the `llm-wiki-capture-pipeline` named-channel runbook output.

## Safety gates

- Do not introduce new behavior here; update `llm-wiki-capture-pipeline` instead.
- Do not remove this compatibility alias before a major release.
