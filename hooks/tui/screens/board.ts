// The status board — the app's first screen. One bordered panel per state, so at a
// glance you can see what operational state each application/grant is in.

import type { Canvas } from "../canvas.ts";
import { COLUMN_LABEL, COLUMN_ORDER, opportunityTag, openItems } from "../data.ts";
import { BOLD, COLOR, DIM, REVERSE } from "../theme.ts";
import type { State } from "../app.ts";
import type { Column } from "../data.ts";

const COLUMN_FG: Record<Column, string> = {
  open: COLOR.open,
  submitted: COLOR.submitted,
  interviewing: COLOR.interviewing,
  closed: COLOR.closed,
};

const TAG_FG: Record<string, string> = {
  WON: COLOR.won,
  LOST: COLOR.lost,
  DECLINED: COLOR.declined,
  LAPSED: COLOR.lapsed,
};

export function handleKey(state: State, key: string): boolean {
  state.message = "";
  if (key === "q" || key === "escape") return false;
  if (key === "left" || key === "h") {
    state.col = (state.col + COLUMN_ORDER.length - 1) % COLUMN_ORDER.length;
  } else if (key === "right" || key === "l") {
    state.col = (state.col + 1) % COLUMN_ORDER.length;
  } else if (key === "up" || key === "k") {
    const col = COLUMN_ORDER[state.col];
    const n = state.oppsIn(col).length;
    if (n) state.row[col] = (state.row[col] + n - 1) % n;
  } else if (key === "down" || key === "j") {
    const col = COLUMN_ORDER[state.col];
    const n = state.oppsIn(col).length;
    if (n) state.row[col] = (state.row[col] + 1) % n;
  } else if (key === "enter" || key === "space") {
    if (state.selected()) {
      state.mode = "detail";
      state.scroll = 0;
    }
  } else if (key === "t") {
    state.mode = "todo";
    state.scroll = 0;
  } else if (key === "r") {
    state.reload();
    state.message = "reloaded";
  } else if (key === "c") {
    state.compileSelected();
  }
  return true;
}

function drawColumnPanel(
  canvas: Canvas,
  state: State,
  col: Column,
  index: number,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  const items = state.oppsIn(col);
  const active = index === state.col;
  const borderStyle = active ? COLOR.borderActive : COLOR.border;
  canvas.box(x, y, w, h, borderStyle, `${COLUMN_LABEL[col]} · ${items.length}`, `${BOLD}${COLUMN_FG[col]}`);
  if (w < 6 || h < 3) return;

  const innerX = x + 2;
  const innerW = w - 4;
  const bottom = y + h - 2;
  let cy = y + 1;
  const selIdx = items.length ? Math.min(state.row[col], items.length - 1) : -1;

  for (let idx = 0; idx < items.length && cy <= bottom; idx++) {
    const opp = items[idx];
    const selected = active && idx === selIdx;
    const tag = opportunityTag(opp);
    const flag = opp.todo && openItems(opp.todo).length ? "! " : "  ";
    const line1 = `${flag}${opp.title}${tag ? ` [${tag}]` : ""}`;
    const line2 = `   ${opp.statusDate} · ${opp.kind}`;
    const style1 = selected ? REVERSE : tag ? `${BOLD}${TAG_FG[tag]}` : BOLD;
    const style2 = selected ? REVERSE : DIM;

    if (selected) canvas.fillRow(innerX, cy, innerW, REVERSE);
    canvas.text(innerX, cy, line1, style1, innerW);
    cy += 1;
    if (cy > bottom) break;

    if (selected) canvas.fillRow(innerX, cy, innerW, REVERSE);
    canvas.text(innerX, cy, line2, style2, innerW);
    cy += 2; // blank spacer row between cards
  }
}

export interface ScreenResult {
  title: string;
  footerHints: [string, string][];
}

export function render(canvas: Canvas, state: State, bodyTop: number, bodyBottom: number, cols: number): ScreenResult {
  const n = COLUMN_ORDER.length;
  const gap = 1;
  const panelH = Math.max(0, bodyBottom - bodyTop);
  const baseW = Math.floor((cols - gap * (n - 1)) / n);
  let x = 0;
  for (let i = 0; i < n; i++) {
    const w = i < n - 1 ? baseW : cols - x;
    drawColumnPanel(canvas, state, COLUMN_ORDER[i], i, x, bodyTop, w, panelH);
    x += w + gap;
  }
  return {
    title: "Application Board",
    footerHints: [
      ["↑↓", "Card"],
      ["←→", "Column"],
      ["↵", "Details"],
      ["c", "Compile"],
      ["t", "Todo"],
      ["r", "Reload"],
      ["q", "Quit"],
    ],
  };
}
