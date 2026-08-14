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

// opportunity.md is hand-wrapped prose (edited at a fixed column width), so a
// continuation line carries no marker of its own — it just isn't blank and doesn't
// start a new list item. Join those runs back into one logical paragraph/item before
// rewrapping to the pane's actual width, rather than rendering the source's hard
// breaks verbatim.
const LIST_MARKER = /^(\s*)([-*]|\d+\.)(\s+)/;

// Wraps `text` (a single logical line, source breaks already joined) to `width`
// columns. Continuation lines get `hangIndent` spaces so wrapped text lines up under
// the first line's content rather than under its list marker.
export function wrapText(text: string, width: number, hangIndent: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [""];
  const result: string[] = [];
  let current = words[0];
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const maxWidth = width - (result.length > 0 ? hangIndent : 0);
    if ((current.length + 1 + word.length) > Math.max(1, maxWidth)) {
      result.push(current);
      current = word;
    } else {
      current += ` ${word}`;
    }
  }
  result.push(current);
  return result.map((line, i) => (i === 0 ? line : " ".repeat(hangIndent) + line));
}

// Groups raw markdown body lines into logical items (paragraphs, or one per list
// entry) by joining continuation lines, then wraps each to `width`.
export function reflowBody(rawLines: string[], width: number): LineSpec[] {
  const out: LineSpec[] = [];
  let item: { text: string; hangIndent: number } | null = null;
  let skippingStatus = false;

  const flush = () => {
    if (!item) return;
    for (const line of wrapText(item.text, width, item.hangIndent)) out.push({ text: line, style: "" });
    item = null;
  };

  for (const raw of rawLines) {
    if (raw.startsWith("**Status:**")) {
      skippingStatus = true;
      continue;
    }
    if (raw.trim() === "") {
      skippingStatus = false;
      flush();
      out.push({ text: "", style: "" });
      continue;
    }
    if (skippingStatus) continue;
    if (raw.startsWith("## ")) {
      flush();
      out.push({ text: raw.slice(3).trim(), style: `${BOLD}${COLOR.accent}` });
      continue;
    }
    if (raw.startsWith("### ")) {
      flush();
      out.push({ text: raw.slice(4).trim(), style: BOLD });
      continue;
    }
    if (raw.trim().startsWith("|")) {
      // A markdown table row — each row is one on-screen line already, and joining
      // cells into prose would destroy the column structure. Pass it through as-is;
      // a row wider than the pane just clips like any other overlong line.
      flush();
      out.push({ text: raw, style: "" });
      continue;
    }
    const marker = raw.match(LIST_MARKER);
    if (marker) {
      flush();
      item = { text: raw.trim(), hangIndent: marker[1].length + marker[2].length + marker[3].length };
    } else if (item) {
      item.text += ` ${raw.trim()}`;
    } else {
      item = { text: raw.trim(), hangIndent: 0 };
    }
  }
  flush();
  return out;
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

  const innerX = 2;
  const innerW = cols - 4;

  const lines: LineSpec[] = [];
  const tag = opportunityTag(opp);
  lines.push({ text: `Status: ${opp.state}${tag ? `  [${tag}]` : ""}, ${opp.statusDate}`, style: BOLD });
  if (opp.note) {
    // The Status parenthetical is itself hand-wrapped prose in the source, so it can
    // carry embedded newlines (see STATUS_RE in data.ts) — join and rewrap rather than
    // rendering the raw source breaks as one unwrapped line.
    const noteText = opp.note.replace(/\s*\n\s*/g, " ");
    for (const l of wrapText(noteText, innerW - 2, 0)) lines.push({ text: `  ${l}`, style: DIM });
  }
  lines.push({ text: `Kind: ${opp.kind}   Path: ${opp.dirPath}`, style: DIM });
  lines.push({ text: "", style: "" });
  const bodyLines = opp.body
    .split("\n")
    .filter((raw) => !(raw.startsWith("# ") && raw.slice(2).trim() === opp.title));
  lines.push(...reflowBody(bodyLines, innerW));
  if (opp.todo) {
    const open = openItems(opp.todo);
    const done = doneItems(opp.todo);
    lines.push({ text: "", style: "" });
    lines.push({ text: `Open actions (TODO.md — ${opp.todo.heading})`, style: `${BOLD}${COLOR.accent}` });
    for (const item of open) for (const l of wrapText(`☐ ${item}`, innerW - 2, 2)) lines.push({ text: `  ${l}`, style: COLOR.won });
    for (const item of done) for (const l of wrapText(`☑ ${item}`, innerW - 2, 2)) lines.push({ text: `  ${l}`, style: DIM });
    if (!open.length && !done.length) {
      lines.push({ text: "  (section present, no checklist items)", style: DIM });
    }
  } else {
    lines.push({ text: "", style: "" });
    lines.push({ text: "No matching section in TODO.md.", style: DIM });
  }

  const h = Math.max(0, bodyBottom - bodyTop);
  canvas.box(0, bodyTop, cols, h, COLOR.borderActive, opp.title, BOLD);
  const visible = Math.max(0, h - 2);
  state.scroll = Math.max(0, Math.min(state.scroll, Math.max(0, lines.length - visible)));
  for (let i = 0; i < visible; i++) {
    const ls = lines[state.scroll + i];
    if (ls) canvas.text(innerX, bodyTop + 1 + i, ls.text, ls.style, innerW);
  }
  return { title: opp.title, footerHints };
}
