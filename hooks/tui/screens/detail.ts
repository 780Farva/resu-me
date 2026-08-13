// Drill-in for a single card: the full opportunity.md, plus any TODO.md section
// matching its title so open next-actions surface right next to the status.

import type { Canvas } from "../canvas.ts";
import { doneItems, openItems, opportunityTag } from "../data.ts";
import { BOLD, COLOR, DIM } from "../theme.ts";
import type { State } from "../app.ts";
import type { ScreenResult } from "./board.ts";

interface LineSpec {
  text: string;
  style: string;
}

export function handleKey(state: State, key: string): void {
  if (key === "q" || key === "escape" || key === "b") state.mode = "board";
  else if (key === "up" || key === "k") state.scroll = Math.max(0, state.scroll - 1);
  else if (key === "down" || key === "j") state.scroll += 1;
  else if (key === "pagedown") state.scroll += 10;
  else if (key === "pageup") state.scroll = Math.max(0, state.scroll - 10);
  else if (key === "c") state.compileSelected();
  else if (key === "p") state.copyLinkSelected("resume");
  else if (key === "P") state.copyLinkSelected("cover");
}

export function render(canvas: Canvas, state: State, bodyTop: number, bodyBottom: number, cols: number): ScreenResult {
  const opp = state.selected();
  const footerHints: [string, string][] = [
    ["↑↓", "Scroll"],
    ["PgUp/PgDn", "Page"],
    ["c", "Compile"],
    ["p", "Copy PDF link"],
    ["P", "Copy cover link"],
    ["b", "Back"],
    ["q", "Quit board"],
  ];
  if (!opp) {
    state.mode = "board";
    return { title: "Application Board", footerHints: [] };
  }

  const lines: LineSpec[] = [];
  const tag = opportunityTag(opp);
  lines.push({ text: `Status: ${opp.state}${tag ? `  [${tag}]` : ""}, ${opp.statusDate}`, style: BOLD });
  if (opp.note) lines.push({ text: `  ${opp.note}`, style: DIM });
  lines.push({ text: `Kind: ${opp.kind}   Path: ${opp.dirPath}`, style: DIM });
  lines.push({ text: "", style: "" });
  for (const raw of opp.body.split("\n")) {
    if (raw.startsWith("**Status:**")) continue;
    if (raw.startsWith("# ") && raw.slice(2).trim() === opp.title) continue;
    if (raw.startsWith("## ")) lines.push({ text: raw.slice(3).trim(), style: `${BOLD}${COLOR.accent}` });
    else if (raw.startsWith("### ")) lines.push({ text: raw.slice(4).trim(), style: BOLD });
    else lines.push({ text: raw, style: "" });
  }
  if (opp.todo) {
    const open = openItems(opp.todo);
    const done = doneItems(opp.todo);
    lines.push({ text: "", style: "" });
    lines.push({ text: `Open actions (TODO.md — ${opp.todo.heading})`, style: `${BOLD}${COLOR.accent}` });
    for (const item of open) lines.push({ text: `  ☐ ${item}`, style: COLOR.won });
    for (const item of done) lines.push({ text: `  ☑ ${item}`, style: DIM });
    if (!open.length && !done.length) {
      lines.push({ text: "  (section present, no checklist items)", style: DIM });
    }
  } else {
    lines.push({ text: "", style: "" });
    lines.push({ text: "No matching section in TODO.md.", style: DIM });
  }

  const h = Math.max(0, bodyBottom - bodyTop);
  canvas.box(0, bodyTop, cols, h, COLOR.borderActive, opp.title, BOLD);
  const innerX = 2;
  const innerW = cols - 4;
  const visible = Math.max(0, h - 2);
  state.scroll = Math.max(0, Math.min(state.scroll, Math.max(0, lines.length - visible)));
  for (let i = 0; i < visible; i++) {
    const ls = lines[state.scroll + i];
    if (ls) canvas.text(innerX, bodyTop + 1 + i, ls.text, ls.style, innerW);
  }
  return { title: opp.title, footerHints };
}
