---
id: TASK-16
title: Preview a compiled resume as an image in the board TUI
status: Done
assignee: []
created_date: '2026-08-13 16:42'
updated_date: '2026-08-13 16:51'
labels: []
dependencies: []
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The board's detail screen (hooks/tui/screens/detail.ts) currently shows opportunity.md text plus a 'c' key that shells out to just compile with inherited stdio, leaving the terminal to show typst's own output. There's no way to actually see the rendered resume/cover letter without opening the PDF outside the terminal. Add a preview: compile the selected document to PNG (typst compile --format png, one page or the first page) and render it inline in the TUI via a terminal image viewer — chafa (ANSI-art, works in any terminal) as the baseline, with viu/kitty icat/timg preferred when the terminal's graphics protocol supports them, since those give actual pixel output instead of ANSI art. This is the terminal-native alternative to a full editor/viewer bundle (blackInkhaven was considered and rejected as overkill for single-page resumes, see conversation) — just a look at the compiled output without leaving the board.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Selecting a card with a compiled resume and pressing a preview key renders the current PDF as an image inline in the terminal, without leaving the board
- [x] #2 Falls back sensibly (chafa ANSI-art, or a clear message) when no supported image viewer is on PATH or the terminal doesn't support inline graphics
- [x] #3 Works for both applications and grants, and for both resume and cover-letter documents when both exist
- [x] #4 If no PDF exists yet for the selected document, the preview key shows a clear message instead of erroring
<!-- AC:END -->
