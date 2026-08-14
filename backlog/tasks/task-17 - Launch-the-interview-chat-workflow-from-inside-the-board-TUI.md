---
id: TASK-17
title: Launch the interview/chat workflow from inside the board TUI
status: To Do
assignee: []
created_date: '2026-08-13 16:47'
updated_date: '2026-08-14 00:19'
labels: []
dependencies:
  - TASK-3.5
ordinal: 25000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The board (src/tui/, TASK-3.5) shows every opportunity's status but currently only triggers just compile/check/watch against an existing .typ — there's no way to start a missing one without leaving the TUI. First-class chat support means: when a selected card has no resume .typ yet, the board offers to launch the interactive workflow (continuing the new-application checklist in CLAUDE.md, pulling from about_me.md/career-timeline.md/opportunity.md the same way the skill does today) right there, and returns to the board with the new file picked up on exit. Two architectures were discussed and remain an open decision for this task to resolve: (1) suspend the raw-mode TUI and exec the claude CLI with inherited stdio, same pattern src/tui/app.ts's State.compileSelected already uses for just compile — reuses the existing new-application skill verbatim, the user's already-authenticated Claude Code session, and adds zero new runtime dependencies, at the cost of a screen-suspend flash rather than an in-panel feel; (2) embed an agent loop directly in the board using earendil-works/pi (pi-agent-core + pi-ai + pi-tui, https://github.com/earendil-works/pi) for a true in-panel chat screen with differential rendering, at the cost of the board's first real runtime dependency, separate LLM credentials from the Claude Code session already running, and no way to reuse the existing Claude Code skills (Pi has its own separate tool/extension format) without reimplementing that workflow logic a second time. Leans toward (1) as the better fit for this repo specifically, since the skills are the actual asset the workflow depends on, but recording both since this is the first-class-chat decision point. Related: TASK-3 (a from-scratch self-contained 'resume' CLI wrapping its own LLM harness) covers similar ground at a much larger scope and remains unstarted; TASK-3.5's implementation notes flag that hooks/board.ts (since renamed to src/board.ts) superseded part of TASK-3's original design and would need re-homing if TASK-3 is ever revived — this task extends the board as it exists today rather than waiting on that.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Board detects whether the selected opportunity has a compiled-from resume .typ (reusing the existing *Resume*.typ matching logic from justfile's _resolve)
- [ ] #2 When missing, the board offers a key to start the workflow instead of showing a compile error
- [ ] #3 Triggering it runs the real new-application checklist for that opportunity (via whichever architecture this task settles on) and the board reloads to reflect the new file(s) on return
- [ ] #4 A short design note in the task records which of the two architectures (exec claude CLI vs. embed Pi) was chosen and why
<!-- AC:END -->
