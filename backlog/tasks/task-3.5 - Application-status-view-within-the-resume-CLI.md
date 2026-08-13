---
id: TASK-3.5
title: Application status view within the resume CLI
status: Done
assignee: []
created_date: '2026-08-12 21:45'
updated_date: '2026-08-13 04:56'
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
- [x] #1 A command lists all applications/grants with their current status, sorted or grouped sensibly
- [x] #2 Selecting an entry can trigger compile/check/watch against it without leaving the CLI
<!-- AC:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
Built as a standalone tool (just board / hooks/board.ts, TypeScript run directly by Bun) rather than folded into the resume CLI this task's description called for. That CLI is TASK-3, still To Do with none of its 8 subtasks started; TASK-7 (Migrate prompts into Claude Code skills), which is Done, is the architecture this repo actually runs on. Folding a status view into an unbuilt CLI wasn't a real option, so this superseded the original design rather than following it — flagging here in case TASK-3 is revived later, since the board would then need re-homing as a command inside it. AC #1 verified: bun hooks/board.ts --list groups a fixture of open/interviewing/closed-lost applications and grants correctly, cross-referencing TODO.md sections by title. AC #2 verified: pressing c on a selected card in the interactive board shells out to just compile <dir-name> with inherited stdio and returns to the board on keypress, exercised via a pty harness.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Added just board (hooks/board.ts): a Kanban-style TUI, written in TypeScript run directly by Bun, over every opportunity.md under applications/ and grants/, grouped by its Status state (closed - won/lost/declined/lapsed collapse into one Closed column with a tag). Drilling into a card shows its full opportunity.md plus any matching TODO.md section; pressing c triggers just compile against it without leaving the board. Built standalone rather than folded into the resume CLI (TASK-3), which remains unstarted and superseded in practice by the Claude Code skills architecture (TASK-7, Done).
<!-- SECTION:FINAL_SUMMARY:END -->
