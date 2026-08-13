// Scrollable image preview: an ANSI-art render (chafa/viu/timg) of a resume/cover
// letter's first page, parsed into per-cell styles so it can live inside the canvas like
// any other screen — scrolled with the same up/down/page keys as the opportunity detail
// view, rather than dumped straight to the terminal where the next redraw erases it.

import type { Canvas } from "../canvas.ts";
import { BOLD, COLOR } from "../theme.ts";
import type { State } from "../app.ts";
import type { ScreenResult } from "./board.ts";

interface Cell {
  ch: string;
  style: string;
}

// Parses one line of ANSI output into (char, style) cells. Every `ESC[...m` SGR sequence
// folds into the running style — concatenated rather than replaced, since a later code for
// the same attribute (fg/bg) simply overrides the earlier one when replayed, the same way
// a real terminal reads a run of SGR codes — and a reset (`ESC[0m`/`ESC[m`) clears it.
// Non-SGR CSI sequences (cursor show/hide, etc.) are dropped: we're placing the content
// into the canvas ourselves, not letting the viewer control the cursor.
export function ansiLineToCells(line: string): Cell[] {
  const cells: Cell[] = [];
  let style = "";
  let i = 0;
  while (i < line.length) {
    if (line.charCodeAt(i) === 0x1b && line[i + 1] === "[") {
      let j = i + 2;
      while (j < line.length && !/[a-zA-Z]/.test(line[j])) j++;
      if (line[j] === "m") {
        const params = line.slice(i + 2, j);
        style = params === "" || params === "0" ? "" : style + line.slice(i, j + 1);
      }
      i = j + 1;
      continue;
    }
    const cp = line.codePointAt(i)!;
    const ch = String.fromCodePoint(cp);
    cells.push({ ch, style });
    i += ch.length;
  }
  return cells;
}

export function handleKey(state: State, key: string): void {
  if (key === "q" || key === "escape" || key === "b" || key === "p" || key === "P") {
    state.mode = "detail";
    state.scroll = 0;
    state.previewLines = [];
  } else if (key === "up" || key === "k") state.scroll = Math.max(0, state.scroll - 1);
  else if (key === "down" || key === "j") state.scroll += 1;
  else if (key === "pagedown") state.scroll += 10;
  else if (key === "pageup") state.scroll = Math.max(0, state.scroll - 10);
}

export function render(canvas: Canvas, state: State, bodyTop: number, bodyBottom: number, cols: number): ScreenResult {
  const footerHints: [string, string][] = [
    ["↑↓", "Scroll"],
    ["PgUp/PgDn", "Page"],
    ["b", "Back"],
    ["q", "Quit board"],
  ];
  const h = Math.max(0, bodyBottom - bodyTop);
  canvas.box(0, bodyTop, cols, h, COLOR.borderActive, state.previewTitle, BOLD);
  const innerX = 2;
  const innerY = bodyTop + 1;
  const innerRight = cols - 2;
  const visible = Math.max(0, h - 2);
  const lines = state.previewLines;
  state.scroll = Math.max(0, Math.min(state.scroll, Math.max(0, lines.length - visible)));
  for (let row = 0; row < visible; row++) {
    const line = lines[state.scroll + row];
    if (line === undefined) continue;
    const cells = ansiLineToCells(line);
    for (let x = 0; x < cells.length && innerX + x < innerRight; x++) {
      canvas.set(innerX + x, innerY + row, cells[x].ch, cells[x].style);
    }
  }
  return { title: state.previewTitle, footerHints };
}
