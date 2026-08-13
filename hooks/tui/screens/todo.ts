// Standalone, checklist-formatted view of the whole TODO.md — the search-wide task list,
// as opposed to a single card's matching section in the detail screen. Items are
// editable in place: a cursor moves item-by-item (skipping headings), space/enter
// toggles checked, `a`/`e`/`d` add, edit, and delete — every mutation writes straight
// back to TODO.md via data.ts's line-level helpers, then reloads state from disk so the
// board and detail screens see the same change immediately.

import type { Canvas } from "../canvas.ts";
import {
  deleteItem,
  insertItem,
  saveTodoLines,
  setItemChecked,
  setItemText,
  type TodoItem,
  type TodoSection,
} from "../data.ts";
import { BOLD, COLOR, DIM, REVERSE } from "../theme.ts";
import type { State } from "../app.ts";
import type { ScreenResult } from "./board.ts";

interface LineSpec {
  text: string;
  style: string;
  entryIndex?: number;
}

interface Entry {
  section: TodoSection;
  item: TodoItem;
}

export interface TodoInputState {
  kind: "add" | "edit";
  buffer: string;
  section: TodoSection;
  item?: TodoItem;
}

function flatten(state: State): Entry[] {
  const entries: Entry[] = [];
  for (const section of state.sections) {
    for (const item of section.items) entries.push({ section, item });
  }
  return entries;
}

function handleInputKey(state: State, key: string): void {
  const input = state.todoInput;
  if (!input) return;
  if (key === "escape") {
    state.todoInput = null;
    state.message = "cancelled";
    return;
  }
  if (key === "enter") {
    const text = input.buffer.trim();
    if (!text) {
      state.todoInput = null;
      state.message = "empty — cancelled";
      return;
    }
    const next =
      input.kind === "add"
        ? insertItem(state.todoLines, input.section.insertLine, text)
        : setItemText(state.todoLines, input.item as TodoItem, text);
    saveTodoLines(state.root, next);
    state.message = input.kind === "add" ? "added" : "edited";
    state.todoInput = null;
    state.reload();
    return;
  }
  if (key === "backspace") {
    input.buffer = input.buffer.slice(0, -1);
    return;
  }
  if (key === "space") {
    input.buffer += " ";
    return;
  }
  if (key.length === 1) input.buffer += key;
}

export function handleKey(state: State, key: string): void {
  if (state.todoInput) {
    handleInputKey(state, key);
    return;
  }

  state.message = "";
  if (state.todoPendingDelete && key !== "d") state.todoPendingDelete = false;

  if (key === "q" || key === "escape" || key === "b" || key === "t") {
    state.mode = "board";
    return;
  }

  const entries = flatten(state);
  const entry = entries[state.todoCursor];

  if (key === "up" || key === "k") {
    if (entries.length) state.todoCursor = (state.todoCursor + entries.length - 1) % entries.length;
  } else if (key === "down" || key === "j") {
    if (entries.length) state.todoCursor = (state.todoCursor + 1) % entries.length;
  } else if (key === "pageup") {
    state.todoCursor = Math.max(0, state.todoCursor - 10);
  } else if (key === "pagedown") {
    state.todoCursor = Math.min(Math.max(0, entries.length - 1), state.todoCursor + 10);
  } else if (key === "space" || key === "enter") {
    if (!entry) return;
    const next = setItemChecked(state.todoLines, entry.item, !entry.item.checked);
    saveTodoLines(state.root, next);
    state.message = entry.item.checked ? "reopened" : "checked off";
    state.reload();
  } else if (key === "e") {
    if (!entry) return;
    state.todoInput = { kind: "edit", buffer: entry.item.text, section: entry.section, item: entry.item };
  } else if (key === "a") {
    const section = entry ? entry.section : state.sections[0];
    if (!section) {
      state.message = "no ## section in TODO.md to add under";
      return;
    }
    state.todoInput = { kind: "add", buffer: "", section };
  } else if (key === "d") {
    if (!entry) return;
    if (!state.todoPendingDelete) {
      state.todoPendingDelete = true;
      state.message = `press d again to delete "${entry.item.text}"`;
      return;
    }
    const next = deleteItem(state.todoLines, entry.item);
    saveTodoLines(state.root, next);
    state.todoPendingDelete = false;
    state.message = "deleted";
    state.reload();
    const remaining = flatten(state).length;
    state.todoCursor = remaining ? Math.min(state.todoCursor, remaining - 1) : 0;
  }
}

export function render(canvas: Canvas, state: State, bodyTop: number, bodyBottom: number, cols: number): ScreenResult {
  const entries = flatten(state);
  state.todoCursor = entries.length ? Math.min(state.todoCursor, entries.length - 1) : 0;

  const lines: LineSpec[] = [];
  if (!state.sections.length) {
    lines.push({ text: "TODO.md is empty — nothing open.", style: DIM });
  }
  let entryIndex = 0;
  let cursorLine = 0;
  for (const section of state.sections) {
    const marker = section.items.some((i) => !i.checked) ? "" : "  (clear)";
    lines.push({ text: `${section.heading}${marker}`, style: `${BOLD}${COLOR.accent}` });
    for (const item of section.items) {
      if (entryIndex === state.todoCursor) cursorLine = lines.length;
      const box = item.checked ? "☑" : "☐";
      lines.push({
        text: `  ${box} ${item.text}`,
        style: item.checked ? DIM : `${BOLD}${COLOR.won}`,
        entryIndex,
      });
      entryIndex++;
    }
    if (!section.items.length) {
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
  const inputRow = state.todoInput ? 1 : 0;
  const visible = Math.max(0, h - 2 - inputRow);

  if (entries.length) {
    if (cursorLine < state.scroll) state.scroll = cursorLine;
    else if (cursorLine >= state.scroll + visible) state.scroll = cursorLine - visible + 1;
  }
  state.scroll = Math.max(0, Math.min(state.scroll, Math.max(0, lines.length - visible)));

  for (let i = 0; i < visible; i++) {
    const ls = lines[state.scroll + i];
    if (!ls) continue;
    const y = bodyTop + 1 + i;
    const isCursor = ls.entryIndex === state.todoCursor && !state.todoInput;
    if (isCursor) canvas.fillRow(innerX, y, innerW, REVERSE);
    canvas.text(innerX, y, ls.text, isCursor ? REVERSE : ls.style, innerW);
  }

  if (state.todoInput) {
    const y = bodyTop + h - 2;
    const label = state.todoInput.kind === "add" ? "New item:" : "Edit item:";
    canvas.text(innerX, y, `${label} ${state.todoInput.buffer}█`, `${BOLD}${COLOR.accent}`, innerW);
  }

  return {
    title: "TODO.md",
    footerHints: state.todoInput
      ? [
          ["↵", "Save"],
          ["Esc", "Cancel"],
        ]
      : [
          ["↑↓", "Item"],
          ["Space", "Toggle"],
          ["a", "Add"],
          ["e", "Edit"],
          ["d", "Delete"],
          ["b", "Back"],
          ["q", "Quit board"],
        ],
  };
}
