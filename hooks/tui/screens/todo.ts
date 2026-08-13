// Standalone, checklist-formatted view of the whole TODO.md — the search-wide task list,
// as opposed to a single card's matching section in the detail screen.

import type { Canvas } from "../canvas.ts";
import { doneItems, openItems } from "../data.ts";
import { BOLD, COLOR, DIM } from "../theme.ts";
import type { State } from "../app.ts";
import type { ScreenResult } from "./board.ts";

interface LineSpec {
  text: string;
  style: string;
}

export function handleKey(state: State, key: string): void {
  if (key === "q" || key === "escape" || key === "b" || key === "t") state.mode = "board";
  else if (key === "up" || key === "k") state.scroll = Math.max(0, state.scroll - 1);
  else if (key === "down" || key === "j") state.scroll += 1;
  else if (key === "pagedown") state.scroll += 10;
  else if (key === "pageup") state.scroll = Math.max(0, state.scroll - 10);
}

export function render(canvas: Canvas, state: State, bodyTop: number, bodyBottom: number, cols: number): ScreenResult {
  const lines: LineSpec[] = [];
  if (!state.sections.length) {
    lines.push({ text: "TODO.md is empty — nothing open.", style: DIM });
  }
  for (const section of state.sections) {
    const open = openItems(section);
    const done = doneItems(section);
    const marker = open.length ? "" : "  (clear)";
    lines.push({ text: `${section.heading}${marker}`, style: `${BOLD}${COLOR.accent}` });
    for (const item of open) lines.push({ text: `  ☐ ${item}`, style: `${BOLD}${COLOR.won}` });
    for (const item of done) lines.push({ text: `  ☑ ${item}`, style: DIM });
    if (!open.length && !done.length) {
      for (const raw of section.lines) {
        if (raw.trim()) lines.push({ text: `  ${raw.trim()}`, style: "" });
      }
    }
    lines.push({ text: "", style: "" });
  }

  const h = Math.max(0, bodyBottom - bodyTop);
  canvas.box(0, bodyTop, cols, h, COLOR.borderActive, "TODO.md", BOLD);
  const innerX = 2;
  const innerW = cols - 4;
  const visible = Math.max(0, h - 2);
  state.scroll = Math.max(0, Math.min(state.scroll, Math.max(0, lines.length - visible)));
  for (let i = 0; i < visible; i++) {
    const ls = lines[state.scroll + i];
    if (ls) canvas.text(innerX, bodyTop + 1 + i, ls.text, ls.style, innerW);
  }
  return {
    title: "TODO.md",
    footerHints: [
      ["↑↓", "Scroll"],
      ["PgUp/PgDn", "Page"],
      ["b", "Back"],
      ["q", "Quit board"],
    ],
  };
}
