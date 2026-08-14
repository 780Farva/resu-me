// A cell-grid frame buffer: every screen draws into one of these, then it's flushed to
// the terminal in a single write. Cell-level styling (rather than building each line as
// one styled string) is what lets box-drawing borders join cleanly and lets a single
// line mix styles — a card's title in one color and its [WON]/[LOST] tag in another —
// without hand-tracking ANSI escape lengths against visible width.

import { BOX, RESET } from "./theme.ts";

interface Cell {
  ch: string;
  style: string;
}

export class Canvas {
  readonly width: number;
  readonly height: number;
  private cells: Cell[][];

  constructor(width: number, height: number) {
    this.width = Math.max(0, width);
    this.height = Math.max(0, height);
    this.cells = Array.from({ length: this.height }, () =>
      Array.from({ length: this.width }, () => ({ ch: " ", style: "" })),
    );
  }

  set(x: number, y: number, ch: string, style = ""): void {
    if (y < 0 || y >= this.height || x < 0 || x >= this.width) return;
    this.cells[y][x] = { ch, style };
  }

  // Writes `str` left-to-right from (x, y), clipped to the canvas and to `maxWidth` if
  // given — with an ellipsis when the text was actually cut off, never when it just
  // happens to end at the boundary.
  text(x: number, y: number, str: string, style = "", maxWidth?: number): void {
    const limit = maxWidth === undefined ? str.length : Math.min(str.length, maxWidth);
    const truncated = maxWidth !== undefined && str.length > maxWidth;
    const shown = truncated && limit > 0 ? `${str.slice(0, Math.max(0, limit - 1))}…` : str.slice(0, limit);
    for (let i = 0; i < shown.length; i++) this.set(x + i, y, shown[i], style);
  }

  // Fills [x, x+w) on row y with `style`, e.g. an inverse-video highlight behind a
  // selected card that's shorter than the panel's inner width.
  fillRow(x: number, y: number, w: number, style: string): void {
    for (let i = 0; i < w; i++) {
      const existing = this.cells[y]?.[x + i];
      this.set(x + i, y, existing ? existing.ch : " ", style);
    }
  }

  hline(x: number, y: number, len: number, ch: string, style = ""): void {
    for (let i = 0; i < len; i++) this.set(x + i, y, ch, style);
  }

  vline(x: number, y: number, len: number, ch: string, style = ""): void {
    for (let i = 0; i < len; i++) this.set(x, y + i, ch, style);
  }

  box(x: number, y: number, w: number, h: number, style: string, title?: string, titleStyle?: string): void {
    if (w < 2 || h < 2) return;
    this.set(x, y, BOX.tl, style);
    this.set(x + w - 1, y, BOX.tr, style);
    this.set(x, y + h - 1, BOX.bl, style);
    this.set(x + w - 1, y + h - 1, BOX.br, style);
    this.hline(x + 1, y, w - 2, BOX.h, style);
    this.hline(x + 1, y + h - 1, w - 2, BOX.h, style);
    this.vline(x, y + 1, h - 2, BOX.v, style);
    this.vline(x + w - 1, y + 1, h - 2, BOX.v, style);
    if (title && w > 4) this.text(x + 2, y, ` ${title} `, titleStyle ?? style, w - 4);
  }

  render(): string {
    const lines: string[] = [];
    for (let y = 0; y < this.height; y++) {
      let line = "";
      let current: string | null = null;
      for (let x = 0; x < this.width; x++) {
        const cell = this.cells[y][x];
        if (cell.style !== current) {
          line += RESET;
          if (cell.style) line += cell.style;
          current = cell.style;
        }
        line += cell.ch;
      }
      line += RESET;
      lines.push(line);
    }
    return lines.join("\r\n");
  }
}

// ---------------------------------------------------------------------------
// Raw-mode terminal control + key decoding
// ---------------------------------------------------------------------------

const KEY_MAP: Record<string, string> = {
  "\x1b[A": "up",
  "\x1b[B": "down",
  "\x1b[C": "right",
  "\x1b[D": "left",
  "\r": "enter",
  "\n": "enter",
  " ": "space",
  "\x1b": "escape",
  "\x03": "quit",
  "\x1b[5~": "pageup",
  "\x1b[6~": "pagedown",
  "\x7f": "backspace",
  "\x08": "backspace",
};

export function decodeKey(data: string): string {
  if (KEY_MAP[data]) return KEY_MAP[data];
  if (data.length === 1) return data;
  return "";
}

export function terminalSize(): { cols: number; rows: number } {
  return { cols: process.stdout.columns || 80, rows: process.stdout.rows || 24 };
}
