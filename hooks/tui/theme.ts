// Shared terminal styling: ANSI control sequences, a small 256-color accent palette, and
// the box-drawing glyphs the panel-based screens use. One place for these so every
// screen reads as the same app instead of a pile of ad-hoc escape codes.

export const ESC = "\x1b";
export const ALT_SCREEN_ON = `${ESC}[?1049h`;
export const ALT_SCREEN_OFF = `${ESC}[?1049l`;
export const CURSOR_HIDE = `${ESC}[?25l`;
export const CURSOR_SHOW = `${ESC}[?25h`;
export const HOME = `${ESC}[H`;

export const RESET = `${ESC}[0m`;
export const BOLD = `${ESC}[1m`;
export const DIM = `${ESC}[2m`;
export const UNDERLINE = `${ESC}[4m`;
export const REVERSE = `${ESC}[7m`;

const fg = (n: number) => `${ESC}[38;5;${n}m`;

// A small designed palette (256-color) rather than the basic 16 ANSI colors, so the
// board reads as one consistent accent set instead of whatever a terminal's default
// red/green/yellow happen to look like.
export const COLOR = {
  accent: fg(75), // active column / focus
  open: fg(45), // cyan
  submitted: fg(221), // gold
  interviewing: fg(176), // violet
  closed: fg(250), // light gray
  won: fg(78), // green
  lost: fg(203), // red
  declined: fg(214), // orange
  lapsed: fg(103), // muted blue-gray
  border: fg(238), // dim panel border
  borderActive: fg(75),
  muted: fg(244),
  text: fg(253),
};

export const BOX = {
  tl: "┌",
  tr: "┐",
  bl: "└",
  br: "┘",
  h: "─",
  v: "│",
};
