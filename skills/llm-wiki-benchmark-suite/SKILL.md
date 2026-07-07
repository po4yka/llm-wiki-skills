---
name: llm-wiki-benchmark-suite
description: Execute legacy bounded pilot benchmark requests by routing them to llm-wiki-eval. Use only for compatibility when the user or installed workflow explicitly names llm-wiki-benchmark-suite.
license: MIT
compatibility: Designed for Agent Skills-compatible coding agents. Deprecated compatibility alias; use llm-wiki-eval for new work.
metadata:
  author: po4yka
  version: "0.1.1"
  install_scope: self-contained
  deprecated: true
  replaced_by: llm-wiki-eval
---

# LLM-Wiki Benchmark Suite

## Goal

Preserve compatibility for users who installed or invoked `llm-wiki-benchmark-suite` before pilot benchmarking was consolidated into `llm-wiki-eval`.

## Procedure

Use `llm-wiki-eval` for all new benchmark work. In that skill, run pilot benchmark mode when the user asks for a small task set, baseline pass, with-wiki pass, scoring rubric, or continue/pause/redesign decision.

If `references/benchmarks/pilot-questions.md` or `references/benchmarks/scoring-rubric.md` are available in this compatibility install, treat them as legacy copies of the references now shipped by `llm-wiki-eval`.

## Output

State that `llm-wiki-benchmark-suite` is deprecated and continue with the `llm-wiki-eval` pilot benchmark output format.

## Safety gates

- Do not introduce new behavior here; update `llm-wiki-eval` instead.
- Do not remove this compatibility alias before a major release.
