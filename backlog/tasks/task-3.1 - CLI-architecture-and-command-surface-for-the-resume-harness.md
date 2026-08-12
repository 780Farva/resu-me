---
id: TASK-3.1
title: CLI architecture and command surface for the resume harness
status: To Do
assignee: []
created_date: '2026-08-12 21:45'
updated_date: '2026-08-12 21:53'
labels: []
dependencies: []
parent_task_id: TASK-3
ordinal: 4000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Decide and document the shape of the 'resume' CLI before building the interview flows on top of it: language/runtime (Node/Bun, matching the rest of the project's planned direction), how a chat turn maps to tool calls against the filesystem (reading/writing career-history and search-parameters documents, invoking just recipes), how a session is started, resumed, or exited, and — the significant design question — an LLM provider abstraction that isn't locked to one vendor. The harness needs to be 'bring your own backend': a user should be able to run it against an Anthropic API key, an existing Anthropic subscription (OAuth-style login rather than a key), an OpenAI API key or subscription, or a local Ollama instance, chosen at setup and stored in project or user config rather than hardcoded. Produce this as a short design doc, not code, so the interview-flow subtasks have a stable foundation to build against.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Design doc specifies how the harness reads/writes project files and shells out to just
- [ ] #2 Design doc names the runtime and core dependencies
- [ ] #3 Design doc defines a provider interface covering at minimum: Anthropic API key, Anthropic subscription auth, OpenAI API key or subscription, and local Ollama, with a documented path to add more
- [ ] #4 Design doc specifies where/how the chosen backend and its credentials are configured and stored per user, not per project, so credentials don't end up committed
<!-- AC:END -->
