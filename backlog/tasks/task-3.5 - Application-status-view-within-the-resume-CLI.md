---
id: TASK-3.5
title: Application status view within the resume CLI
status: To Do
assignee: []
created_date: '2026-08-12 21:45'
labels: []
dependencies:
  - TASK-3.1
parent_task_id: TASK-3
ordinal: 8000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
An earlier plan called for a standalone terminal UI for browsing applications/grants and their status, modeled on a kanban-style board. Fold that into the resume CLI instead of building it as a separate tool: a command (or chat-invokable action) that lists applications/grants with their status line (parsed from each opportunity document's Status line) and lets the user trigger the existing just recipes (compile/check/watch) against a selected entry. This keeps one entry point for the whole workflow rather than splitting it between a chat tool and a separate board UI.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A command lists all applications/grants with their current status, sorted or grouped sensibly
- [ ] #2 Selecting an entry can trigger compile/check/watch against it without leaving the CLI
<!-- AC:END -->
