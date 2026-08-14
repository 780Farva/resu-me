---
id: TASK-16
title: Copy a compiled resume's PDF link to the clipboard from the board TUI
status: Done
assignee: []
created_date: '2026-08-13 16:42'
updated_date: '2026-08-14 00:19'
labels: []
dependencies: []
ordinal: 24000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
The board's detail screen (src/tui/screens/detail.ts) currently shows opportunity.md text plus a 'c' key that shells out to just compile with inherited stdio, leaving the terminal to show typst's own output. There's no way to actually see the rendered resume/cover letter without opening the PDF outside the terminal. Tried rendering it inline as ANSI-art (chafa/viu/kitty icat/timg, parsed into scrollable canvas cells) but the character-cell resolution was unsatisfying even with a denser chafa symbol set and higher render PPI — a text terminal is fundamentally a bad medium for viewing a resume. Settled on a lighter touch: a preview key copies a file:// link to the selected document's already-compiled PDF onto the system clipboard (clip.exe under WSL, else xclip/xsel/wl-copy/pbcopy), so it opens properly — real fonts, real resolution — in whatever browser or PDF viewer is at hand, without leaving the board.
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [x] #1 Selecting a card with a compiled resume and pressing a preview key copies a file:// link to its PDF onto the system clipboard, without leaving the board
- [x] #2 Falls back sensibly (a clear message naming a clipboard tool to install, or the raw link to copy by hand) when no supported clipboard tool is on PATH
- [x] #3 Works for both applications and grants, and for both resume and cover-letter documents when both exist
- [x] #4 If no PDF has been compiled yet for the selected document, the preview key shows a clear message (pointing at the compile key) instead of erroring
<!-- AC:END -->
