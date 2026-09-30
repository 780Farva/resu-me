---
id: TASK-21
title: Show the skills inventory in the board TUI
status: To Do
assignee: []
created_date: '2026-09-28 16:54'
updated_date: '2026-09-28 17:16'
labels: []
dependencies:
  - TASK-20
ordinal: 29000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Once skills-inventory.csv exists (TASK-20), make it browsable from just board, the same way TODO.md is: a skills screen alongside the board, detail, and todo screens in src/tui/. The point is to see at a glance what the inventory holds, how each skill is rated today, and how ratings have moved over time, without opening the CSV. Follows the extension point described in the resu-me-developer skill: a render/handleKey pair under src/tui/screens/, wired into app.ts's mode dispatch, with parsing kept in tui/data.ts.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 A key from the board opens a skills screen listing every skill grouped by category, each with its current rating (the row with the latest assessed_on) or an unrated marker
- [ ] #2 Selecting a skill shows its rating history in date order, plus earned_through, source, and notes
- [ ] #3 CSV parsing lives in tui/data.ts and handles quoted fields containing commas, quotes, and newlines, with tests in tests/tui/data.test.ts
- [ ] #4 A missing or empty skills-inventory.csv shows an empty state rather than an error
- [ ] #5 src/board.ts --list includes the inventory as plain text when stdout isn't a tty
- [ ] #6 The resu-me-developer skill's TUI notes describe the new screen
- [ ] #7 Within each category, skills that share a group are shown under their umbrella skill, and the view can collapse a group to just the umbrella
<!-- AC:END -->
