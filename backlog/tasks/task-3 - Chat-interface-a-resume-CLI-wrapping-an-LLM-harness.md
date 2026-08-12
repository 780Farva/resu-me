---
id: TASK-3
title: 'Chat interface: a resume CLI wrapping an LLM harness'
status: To Do
assignee: []
created_date: '2026-08-12 21:44'
labels: []
dependencies: []
ordinal: 3000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Right now the project's AI-assisted workflows (the resume-review skill, and any future guided document-seeding) each depend on the user having Claude Code installed and knowing which skill or just recipe to invoke. Replace that with a single bundled CLI utility, named 'resume', that wraps its own chat/agent loop over an LLM: one entry point for every interactive workflow in the project, rather than a mix of just recipes, an editor, and a general-purpose coding agent. This is a meaningful build, not a one-shot addition — it gets broken into subtasks. This task tracks the overall goal and the decision it implies: the project no longer assumes the user has a separate AI coding CLI installed; 'resume' is self-contained.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A design note exists covering: what LLM backend(s) it targets, how credentials are supplied, and how the CLI is distributed/installed
- [ ] #2 'resume' launches a chat session from the project root with no other tools required
- [ ] #3 The existing just-based build workflow (compile/check/watch) remains usable standalone — the chat interface is an additional front end, not a replacement for the underlying build system
<!-- AC:END -->
