// The app shell: shared chrome (title bar, footer), the terminal event loop, and the
// State every screen reads and mutates. Screens are pure-ish render(canvas, state, ...)
// + handleKey(state, key) pairs registered below — the status board is the first one;
// more screens plug in here the same way.

import {
  ALT_SCREEN_OFF,
  ALT_SCREEN_ON,
  BOLD,
  COLOR,
  CURSOR_HIDE,
  CURSOR_SHOW,
  DIM,
  HOME,
  REVERSE,
} from "./theme.ts";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { Canvas, decodeKey, terminalSize } from "./canvas.ts";
import {
  type Column,
  COLUMN_ORDER,
  type Opportunity,
  type TodoSection,
  load,
  opportunityColumn,
} from "./data.ts";
import * as boardScreen from "./screens/board.ts";
import * as detailScreen from "./screens/detail.ts";
import * as todoScreen from "./screens/todo.ts";
import type { ScreenResult } from "./screens/board.ts";
import type { TodoInputState } from "./screens/todo.ts";

export type Mode = "board" | "detail" | "todo";

export class State {
  opps: Opportunity[] = [];
  sections: TodoSection[] = [];
  col = 0;
  row: Record<Column, number> = { open: 0, submitted: 0, interviewing: 0, closed: 0 };
  // Inner content width of each column panel, recorded during the board screen's last
  // render — boardScreen reads it back to decide whether the selected card's title
  // needs to marquee, without redoing the layout math itself.
  colInnerW: number[] = [];
  mode: Mode = "board";
  scroll = 0;
  message = "";
  paused = false;
  todoLines: string[] = [];
  todoCursor = 0;
  todoInput: TodoInputState | null = null;
  todoPendingDelete = false;

  constructor(public root: string) {
    this.reload();
  }

  reload(): void {
    const { opps, sections, todoLines } = load(this.root);
    this.opps = opps;
    this.sections = sections;
    this.todoLines = todoLines;
  }

  oppsIn(col: Column): Opportunity[] {
    return this.opps.filter((o) => opportunityColumn(o) === col);
  }

  selected(): Opportunity | undefined {
    const col = COLUMN_ORDER[this.col];
    const items = this.oppsIn(col);
    if (!items.length) return undefined;
    return items[Math.min(this.row[col], items.length - 1)];
  }

  // Shells out to `just compile` on the selected entry with inherited stdio, then
  // leaves the output on screen (via `paused`) until the next keypress instead of
  // racing to redraw over it.
  compileSelected(): void {
    const opp = this.selected();
    if (!opp) return;
    const proc = Bun.spawnSync(["just", "compile", opp.dirName], {
      cwd: this.root,
      stdout: "inherit",
      stderr: "inherit",
    });
    const outcome = proc.success
      ? `compiled ${opp.dirName}`
      : `compile failed (exit ${proc.exitCode}): ${opp.dirName}`;
    process.stdout.write(`\r\n${DIM}${outcome} — press any key to return to the board\x1b[0m\r\n`);
    this.message = outcome;
    this.paused = true;
  }

  // Copies a `file://` link to the selected document's compiled PDF to the system
  // clipboard, so it opens properly (real fonts, no character-cell resampling) in
  // whatever browser or PDF viewer is at hand instead of being squashed into a terminal.
  // Resolves the .typ via `just _resolve` (the same fragment-matching every other
  // recipe uses) and derives the PDF path from it rather than compiling on the spot —
  // `c` (compile) is the dedicated key for that, and this key just points at whatever
  // was last built.
  copyLinkSelected(doc: "resume" | "cover"): void {
    const opp = this.selected();
    if (!opp) return;
    const label = doc === "resume" ? "resume" : "cover letter";
    const resolve = Bun.spawnSync(["just", "_resolve", opp.dirName, doc], {
      cwd: this.root,
      stdout: "pipe",
      stderr: "pipe",
    });
    if (!resolve.success) {
      const lastLine = resolve.stderr.toString().trim().split("\n").pop() ?? "";
      this.message = lastLine || `no ${label} for ${opp.dirName}`;
      return;
    }
    const typPath = resolve.stdout.toString().trim();
    const pdfPath = join(this.root, typPath.replace(/\.typ$/, ".pdf"));
    if (!existsSync(pdfPath)) {
      this.message = `no compiled PDF yet for the ${label} — press c to compile ${opp.dirName}`;
      return;
    }
    const url = fileUrlFor(pdfPath);
    this.message = copyToClipboard(url)
      ? `copied ${label} link: ${opp.dirName}`
      : `no clipboard tool found — copy this link: ${url}`;
  }
}

// A plain `file:///home/...` link is unreachable from a Windows browser — clip.exe puts
// it on the Windows clipboard, but the browser resolving it runs outside the WSL
// filesystem entirely. WSL_DISTRO_NAME is set by WSL for every process, so its presence
// is the signal to route the path through the \\wsl.localhost\<Distro>\... share instead,
// which Windows mounts back onto this same filesystem. The five slashes before the host
// look like a typo but aren't — that's the form Windows browsers actually resolve for a
// UNC path (`file://wsl.localhost/...`, with the standard two-slash authority, 404s).
function fileUrlFor(absPath: string): string {
  const distro = process.env.WSL_DISTRO_NAME;
  if (distro) return `file://///wsl.localhost/${distro}${absPath}`;
  return `file://${absPath}`;
}

// Tries, in order, the clipboard tool available on this platform: clip.exe under WSL
// (where xclip/xsel/wl-copy aren't installed but Windows' own clipboard is one exec
// away), then the native Linux and macOS tools.
function copyToClipboard(text: string): boolean {
  const candidates: [string, string[]][] = [
    ["clip.exe", []],
    ["wl-copy", []],
    ["xclip", ["-selection", "clipboard"]],
    ["xsel", ["--clipboard", "--input"]],
    ["pbcopy", []],
  ];
  for (const [cmd, args] of candidates) {
    if (!Bun.spawnSync(["which", cmd]).success) continue;
    if (Bun.spawnSync([cmd, ...args], { stdin: Buffer.from(text) }).success) return true;
  }
  return false;
}

function drawHeader(canvas: Canvas, cols: number, title: string): void {
  const brand = "resu-me";
  canvas.text(1, 0, brand, `${BOLD}${COLOR.accent}`);
  canvas.text(1 + brand.length + 1, 0, "›", COLOR.muted);
  canvas.text(1 + brand.length + 3, 0, title, BOLD);
  canvas.hline(0, 1, cols, "─", COLOR.border);
}

function drawFooter(canvas: Canvas, cols: number, rows: number, hints: [string, string][], message: string): void {
  const y = rows - 1;
  let x = 1;
  if (message) {
    canvas.text(x, y, message, COLOR.accent);
    x += message.length + 3;
  }
  for (const [key, label] of hints) {
    if (x + key.length + label.length + 4 > cols) break;
    canvas.text(x, y, ` ${key} `, REVERSE);
    x += key.length + 2;
    canvas.text(x, y, ` ${label} `, DIM);
    x += label.length + 3;
  }
}

function draw(state: State): void {
  const { cols, rows } = terminalSize();
  const canvas = new Canvas(cols, rows);
  const bodyTop = 2;
  const bodyBottom = rows - 1;

  let result: ScreenResult;
  if (state.mode === "board") result = boardScreen.render(canvas, state, bodyTop, bodyBottom, cols);
  else if (state.mode === "detail") result = detailScreen.render(canvas, state, bodyTop, bodyBottom, cols);
  else result = todoScreen.render(canvas, state, bodyTop, bodyBottom, cols);

  drawHeader(canvas, cols, result.title);
  drawFooter(canvas, cols, rows, result.footerHints, state.message);
  process.stdout.write(HOME + canvas.render());
}

function handleKey(state: State, key: string): boolean {
  if (state.mode === "board") return boardScreen.handleKey(state, key);
  if (state.mode === "detail") detailScreen.handleKey(state, key);
  else todoScreen.handleKey(state, key);
  return true;
}

export function runInteractive(root: string): void {
  const state = new State(root);

  function shutdown(): void {
    clearInterval(marqueeTimer);
    process.stdout.write(CURSOR_SHOW + ALT_SCREEN_OFF);
    process.stdin.setRawMode?.(false);
    process.stdin.pause();
    process.exit(0);
  }

  process.stdout.write(ALT_SCREEN_ON + CURSOR_HIDE);
  process.stdin.setRawMode?.(true);
  process.stdin.resume();
  process.stdin.setEncoding("utf8");

  // Redraws on a timer, but only while a selected title actually needs to scroll — most
  // of the time nothing is overflowing and this is a no-op check, not a wasted redraw.
  const marqueeTimer = setInterval(() => {
    if (!state.paused && state.mode === "board" && boardScreen.selectedTitleOverflows(state)) {
      draw(state);
    }
  }, 200);

  process.stdout.on("resize", () => {
    if (!state.paused) draw(state);
  });

  process.stdin.on("data", (data: string) => {
    if (state.paused) {
      state.paused = false;
      draw(state);
      return;
    }
    const key = decodeKey(data);
    if (!key) return;
    if (key === "quit") {
      shutdown();
      return;
    }
    const cont = handleKey(state, key);
    if (!cont) {
      shutdown();
      return;
    }
    if (!state.paused) draw(state);
  });

  draw(state);
}
