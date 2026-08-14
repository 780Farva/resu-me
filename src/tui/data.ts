// Reads every opportunity.md's **Status:** line under applications/ and grants/, plus
// TODO.md, into the plain data the screens render. No terminal concerns here — kept
// separate so it can be (and is) exercised without a tty, via `src/board.ts --list`.

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const STATUS_RE =
  /\*\*Status:\*\*\s*(open|submitted|interviewing|closed - won|closed - lost|closed - declined|closed - lapsed)\s*,\s*(\d{4}-\d{2}-\d{2})\s*(?:\(([^)]*)\))?/;
const TITLE_RE = /^#\s+(.+?)\s*$/m;
const HEADING_RE = /^##\s+(.+?)\s*$/;
const TODO_ITEM_RE = /^\s*-\s*\[( |x|X)\]\s*(.+)$/;
const CHECKBOX_RE = /\[( |x|X)\]/;

export const COLUMN_ORDER = ["open", "submitted", "interviewing", "closed"] as const;
export type Column = (typeof COLUMN_ORDER)[number];

export const COLUMN_LABEL: Record<Column, string> = {
  open: "Open",
  submitted: "Submitted",
  interviewing: "Interviewing",
  closed: "Closed",
};

const CLOSED_TAG: Record<string, string> = {
  "closed - won": "WON",
  "closed - lost": "LOST",
  "closed - declined": "DECLINED",
  "closed - lapsed": "LAPSED",
};

export interface Opportunity {
  path: string;
  dirName: string;
  dirPath: string;
  kind: "job" | "grant";
  title: string;
  state: string;
  statusDate: string;
  note: string;
  body: string;
  todo?: TodoSection;
}

// A single `- [ ] ...` / `- [x] ...` line, plus any indented continuation lines that
// wrap it (like the shipped example item's second line) — `text` joins those in so
// editing sees the whole item, not just its first line. `lineIndex`/`continuationEnd`
// are positions in the whole file's line array, which is what makes in-place edits
// (toggle/edit/delete/insert, below) possible without re-deriving them from scratch.
export interface TodoItem {
  checked: boolean;
  text: string;
  lineIndex: number;
  continuationEnd: number;
}

export interface TodoSection {
  heading: string;
  headingLine: number;
  items: TodoItem[];
  // Where a newly added item's line should be spliced in: right after this section's
  // last item (and its continuation lines), or right after the heading if it has none.
  insertLine: number;
  lines: string[];
}

export function openItems(section: TodoSection): string[] {
  return section.items.filter((i) => !i.checked).map((i) => i.text);
}

export function doneItems(section: TodoSection): string[] {
  return section.items.filter((i) => i.checked).map((i) => i.text);
}

export function opportunityColumn(o: Opportunity): Column {
  return o.state.startsWith("closed") ? "closed" : (o.state as Column);
}

export function opportunityTag(o: Opportunity): string | undefined {
  return CLOSED_TAG[o.state];
}

export function repoRoot(): string {
  const proc = Bun.spawnSync(["git", "rev-parse", "--show-toplevel"]);
  return proc.stdout.toString().trim();
}

function parseOpportunity(path: string, kind: "job" | "grant"): Opportunity | null {
  const text = readFileSync(path, "utf8");
  const statusMatch = STATUS_RE.exec(text);
  if (!statusMatch) return null;
  const titleMatch = TITLE_RE.exec(text);
  const dirPath = dirname(path);
  return {
    path,
    dirName: basename(dirPath),
    dirPath,
    kind,
    title: titleMatch ? titleMatch[1] : basename(dirPath),
    state: statusMatch[1],
    statusDate: statusMatch[2],
    note: (statusMatch[3] ?? "").trim(),
    body: text,
  };
}

function discover(root: string): Opportunity[] {
  const opps: Opportunity[] = [];
  const bases: [Opportunity["kind"], string][] = [
    ["job", "applications"],
    ["grant", "grants"],
  ];
  for (const [kind, base] of bases) {
    for (const sub of [join(root, base), join(root, base, "completed")]) {
      if (!existsSync(sub) || !statSync(sub).isDirectory()) continue;
      for (const entry of readdirSync(sub).sort()) {
        const entryPath = join(sub, entry);
        if (!statSync(entryPath).isDirectory()) continue;
        const oppFile = join(entryPath, "opportunity.md");
        if (existsSync(oppFile) && statSync(oppFile).isFile()) {
          const opp = parseOpportunity(oppFile, kind);
          if (opp) opps.push(opp);
        }
      }
    }
  }
  return opps;
}

function todoPath(root: string): string {
  return join(root, "TODO.md");
}

export function loadTodoLines(root: string): string[] {
  const path = todoPath(root);
  if (!existsSync(path)) return [];
  return readFileSync(path, "utf8").split("\n");
}

export function saveTodoLines(root: string, lines: string[]): void {
  writeFileSync(todoPath(root), lines.join("\n"));
}

// A continuation line wraps the item above it: indented, non-blank, and not itself a
// heading or a new item line.
function isContinuationLine(line: string): boolean {
  return line.trim().length > 0 && /^\s/.test(line) && !TODO_ITEM_RE.test(line) && !HEADING_RE.test(line);
}

function parseTodoSections(lines: string[]): TodoSection[] {
  const sections: TodoSection[] = [];
  let current: TodoSection | null = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const heading = HEADING_RE.exec(line);
    if (heading) {
      current = { heading: heading[1], headingLine: i, items: [], insertLine: i + 1, lines: [] };
      sections.push(current);
      continue;
    }
    if (!current) continue;
    current.lines.push(line);
    const item = TODO_ITEM_RE.exec(line);
    if (!item) continue;
    let end = i + 1;
    const continuation: string[] = [];
    while (end < lines.length && isContinuationLine(lines[end])) {
      continuation.push(lines[end].trim());
      end++;
    }
    const text = continuation.length ? `${item[2].trim()} ${continuation.join(" ")}` : item[2].trim();
    current.items.push({ checked: item[1].toLowerCase() === "x", text, lineIndex: i, continuationEnd: end });
    current.insertLine = end;
    i = end - 1;
  }
  return sections;
}

function matchTodo(opp: Opportunity, sections: TodoSection[]): TodoSection | undefined {
  const title = opp.title.toLowerCase();
  for (const section of sections) {
    const heading = section.heading.replace(/\.+$/, "").trim().toLowerCase();
    if (!heading) continue;
    if (title.includes(heading) || title.startsWith(heading)) return section;
  }
  return undefined;
}

export function load(root: string): { opps: Opportunity[]; sections: TodoSection[]; todoLines: string[] } {
  const opps = discover(root);
  const todoLines = loadTodoLines(root);
  const sections = parseTodoSections(todoLines);
  for (const opp of opps) opp.todo = matchTodo(opp, sections);
  opps.sort((a, b) => {
    const ka = `${a.statusDate} ${a.dirName}`;
    const kb = `${b.statusDate} ${b.dirName}`;
    return ka < kb ? 1 : ka > kb ? -1 : 0;
  });
  return { opps, sections, todoLines };
}

// Mutators below are pure: each takes the current TODO.md lines and returns a new
// array, so the caller (todo screen) writes it out with saveTodoLines and reloads
// state rather than juggling in-place edits against stale item positions.

export function setItemChecked(lines: string[], item: TodoItem, checked: boolean): string[] {
  const out = lines.slice();
  out[item.lineIndex] = out[item.lineIndex].replace(CHECKBOX_RE, checked ? "[x]" : "[ ]");
  return out;
}

// Collapses any continuation lines into the single edited line — editing an item you
// typed a full replacement for is expected to leave one clean line, not a stale wrap.
export function setItemText(lines: string[], item: TodoItem, text: string): string[] {
  const out = lines.slice();
  const prefixMatch = /^(\s*-\s*\[[ xX]\]\s*)/.exec(out[item.lineIndex]);
  const prefix = prefixMatch ? prefixMatch[1] : "- [ ] ";
  out.splice(item.lineIndex, item.continuationEnd - item.lineIndex, `${prefix}${text}`);
  return out;
}

export function deleteItem(lines: string[], item: TodoItem): string[] {
  const out = lines.slice();
  out.splice(item.lineIndex, item.continuationEnd - item.lineIndex);
  return out;
}

export function insertItem(lines: string[], insertLine: number, text: string): string[] {
  const out = lines.slice();
  out.splice(insertLine, 0, `- [ ] ${text}`);
  return out;
}

export function printPlain(opps: Opportunity[]): void {
  for (const col of COLUMN_ORDER) {
    const colOpps = opps.filter((o) => opportunityColumn(o) === col);
    console.log(`== ${COLUMN_LABEL[col]} (${colOpps.length}) ==`);
    if (!colOpps.length) console.log("  (none)");
    for (const o of colOpps) {
      const tag = opportunityTag(o) ? ` [${opportunityTag(o)}]` : "";
      const flag = o.todo && openItems(o.todo).length ? " !" : "";
      console.log(`  - ${o.title}${tag}  (${o.kind}, ${o.statusDate})${flag}`);
      if (o.note) console.log(`      ${o.note}`);
    }
    console.log("");
  }
}
