// Reads every opportunity.md's **Status:** line under applications/ and grants/, plus
// TODO.md, into the plain data the screens render. No terminal concerns here — kept
// separate so it can be (and is) exercised without a tty, via `hooks/board.ts --list`.

import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const STATUS_RE =
  /\*\*Status:\*\*\s*(open|submitted|interviewing|closed - won|closed - lost|closed - declined|closed - lapsed)\s*,\s*(\d{4}-\d{2}-\d{2})\s*(?:\(([^)]*)\))?/;
const TITLE_RE = /^#\s+(.+?)\s*$/m;
const TODO_ITEM_RE = /^\s*-\s*\[( |x|X)\]\s*(.+)$/;

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

export interface TodoSection {
  heading: string;
  lines: string[];
}

export function openItems(section: TodoSection): string[] {
  const items: string[] = [];
  for (const line of section.lines) {
    const m = TODO_ITEM_RE.exec(line);
    if (m && m[1] === " ") items.push(m[2].trim());
  }
  return items;
}

export function doneItems(section: TodoSection): string[] {
  const items: string[] = [];
  for (const line of section.lines) {
    const m = TODO_ITEM_RE.exec(line);
    if (m && m[1].toLowerCase() === "x") items.push(m[2].trim());
  }
  return items;
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

function parseTodo(path: string): TodoSection[] {
  if (!existsSync(path)) return [];
  const sections: TodoSection[] = [];
  let current: TodoSection | null = null;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    if (line.startsWith("## ")) {
      current = { heading: line.slice(3).trim(), lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(line);
    }
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

export function load(root: string): { opps: Opportunity[]; sections: TodoSection[] } {
  const opps = discover(root);
  const sections = parseTodo(join(root, "TODO.md"));
  for (const opp of opps) opp.todo = matchTodo(opp, sections);
  opps.sort((a, b) => {
    const ka = `${a.statusDate} ${a.dirName}`;
    const kb = `${b.statusDate} ${b.dirName}`;
    return ka < kb ? 1 : ka > kb ? -1 : 0;
  });
  return { opps, sections };
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
