// Tests the pure parsing/mutation logic in data.ts against plain strings, no filesystem
// or tty involved — see the testing-methodology note in the resu-me-developer skill for
// why this module specifically: it edits the real TODO.md in place, so a silent
// regression here corrupts live data rather than just rendering wrong.

import { describe, expect, test } from "bun:test";
import {
  deleteItem,
  insertItem,
  matchTodo,
  openItems,
  doneItems,
  opportunityColumn,
  opportunityTag,
  parseOpportunityText,
  parseTodoSections,
  setItemChecked,
  setItemText,
  type Opportunity,
  type TodoSection,
} from "./data.ts";

describe("parseOpportunityText", () => {
  const kind = "job" as const;

  test("extracts status, date, title, and note", () => {
    const text = "# Acme Corp\n\n**Status:** interviewing, 2026-07-02 (onsite loop scheduled)\n";
    const opp = parseOpportunityText(text, "/root/applications/2026-06-acme/opportunity.md", kind);
    expect(opp?.title).toBe("Acme Corp");
    expect(opp?.state).toBe("interviewing");
    expect(opp?.statusDate).toBe("2026-07-02");
    expect(opp?.note).toBe("onsite loop scheduled");
    expect(opp?.dirName).toBe("2026-06-acme");
  });

  test("returns null when there's no **Status:** line at all", () => {
    expect(parseOpportunityText("# Acme Corp\n\nNo status here.\n", "/x/opportunity.md", kind)).toBeNull();
  });

  test("rejects a status word outside the closed vocabulary", () => {
    // "pending" isn't one of AGENTS.md's states — this must not silently match as some
    // truncated alternative.
    const text = "**Status:** pending, 2026-07-02\n";
    expect(parseOpportunityText(text, "/x/opportunity.md", kind)).toBeNull();
  });

  test("note is optional and defaults to an empty string", () => {
    const opp = parseOpportunityText("**Status:** open, 2026-01-01\n", "/x/opportunity.md", kind);
    expect(opp?.note).toBe("");
  });

  test("falls back to the directory name when there's no # title line", () => {
    const opp = parseOpportunityText("**Status:** open, 2026-01-01\n", "/root/applications/2026-01-acme/opportunity.md", kind);
    expect(opp?.title).toBe("2026-01-acme");
  });

  test("matches every state in the closed vocabulary, including multi-word closed states", () => {
    for (const state of ["open", "submitted", "interviewing", "closed - won", "closed - lost", "closed - declined", "closed - lapsed"]) {
      const opp = parseOpportunityText(`**Status:** ${state}, 2026-01-01\n`, "/x/opportunity.md", kind);
      expect(opp?.state).toBe(state);
    }
  });
});

describe("opportunityColumn / opportunityTag", () => {
  function opp(state: string): Opportunity {
    return { path: "", dirName: "", dirPath: "", kind: "job", title: "", state, statusDate: "", note: "", body: "" };
  }

  test("closed - * states all collapse into the closed column", () => {
    for (const state of ["closed - won", "closed - lost", "closed - declined", "closed - lapsed"]) {
      expect(opportunityColumn(opp(state))).toBe("closed");
    }
  });

  test("non-closed states map to their own column", () => {
    expect(opportunityColumn(opp("open"))).toBe("open");
    expect(opportunityColumn(opp("submitted"))).toBe("submitted");
    expect(opportunityColumn(opp("interviewing"))).toBe("interviewing");
  });

  test("tag is only set for closed states, and reflects which one", () => {
    expect(opportunityTag(opp("open"))).toBeUndefined();
    expect(opportunityTag(opp("closed - won"))).toBe("WON");
    expect(opportunityTag(opp("closed - lapsed"))).toBe("LAPSED");
  });
});

describe("parseTodoSections", () => {
  test("parses a checked and unchecked item under one heading", () => {
    const sections = parseTodoSections(["## Acme", "- [ ] follow up", "- [x] send resume"]);
    expect(sections).toHaveLength(1);
    expect(sections[0].heading).toBe("Acme");
    expect(sections[0].items.map((i) => [i.text, i.checked])).toEqual([
      ["follow up", false],
      ["send resume", true],
    ]);
  });

  test("accepts a capital X as checked", () => {
    const sections = parseTodoSections(["## Acme", "- [X] done"]);
    expect(sections[0].items[0].checked).toBe(true);
  });

  test("lines before the first heading are ignored, not attributed to a phantom section", () => {
    const sections = parseTodoSections(["some preamble", "- [ ] orphan item", "## Acme", "- [ ] real item"]);
    expect(sections).toHaveLength(1);
    expect(sections[0].items).toHaveLength(1);
    expect(sections[0].items[0].text).toBe("real item");
  });

  test("a section with no items still appears, with an empty items list", () => {
    const sections = parseTodoSections(["## Acme", "", "## Globex", "- [ ] item"]);
    expect(sections).toHaveLength(2);
    expect(sections[0].items).toHaveLength(0);
  });

  test("joins indented continuation lines into the item's text", () => {
    const sections = parseTodoSections([
      "## Acme",
      "- [ ] first line",
      "  second line wraps here",
      "- [ ] next item",
    ]);
    expect(sections[0].items[0].text).toBe("first line second line wraps here");
    expect(sections[0].items[1].text).toBe("next item");
  });

  test("a second heading ends the previous section's continuation scan", () => {
    const sections = parseTodoSections(["## Acme", "- [ ] item", "## Globex", "- [ ] other"]);
    expect(sections[0].items[0].text).toBe("item");
    expect(sections[1].items[0].text).toBe("other");
  });

  test("insertLine lands after the last item (and its continuation), not at the heading", () => {
    const lines = ["## Acme", "- [ ] first", "  continued", "- [ ] second"];
    const sections = parseTodoSections(lines);
    expect(sections[0].insertLine).toBe(lines.length);
  });

  test("insertLine is right after the heading when the section has no items yet", () => {
    const sections = parseTodoSections(["## Acme", "", "## Globex"]);
    expect(sections[0].insertLine).toBe(1);
  });
});

describe("matchTodo", () => {
  function opp(title: string): Opportunity {
    return { path: "", dirName: "", dirPath: "", kind: "job", title, state: "open", statusDate: "", note: "", body: "" };
  }
  function section(heading: string): TodoSection {
    return { heading, headingLine: 0, items: [], insertLine: 1, lines: [] };
  }

  test("matches case-insensitively when the title starts with the heading", () => {
    expect(matchTodo(opp("Acme Corp"), [section("acme corp")])?.heading).toBe("acme corp");
  });

  test("matches when the title merely contains the heading", () => {
    expect(matchTodo(opp("Senior Engineer — Acme"), [section("Acme")])?.heading).toBe("Acme");
  });

  test("strips trailing dots from the heading before comparing", () => {
    expect(matchTodo(opp("Acme Corp"), [section("Acme Corp...")])?.heading).toBe("Acme Corp...");
  });

  test("returns undefined when nothing matches", () => {
    expect(matchTodo(opp("Acme Corp"), [section("Globex")])).toBeUndefined();
  });

  test("skips a section with a blank heading rather than matching everything", () => {
    expect(matchTodo(opp("Acme Corp"), [section("")])).toBeUndefined();
  });

  test("returns the first matching section when more than one would match", () => {
    expect(matchTodo(opp("Acme Corp"), [section("Acme"), section("Acme Corp")])?.heading).toBe("Acme");
  });
});

describe("TODO.md line mutators", () => {
  function item(overrides: Partial<{ checked: boolean; text: string; lineIndex: number; continuationEnd: number }> = {}) {
    return { checked: false, text: "follow up", lineIndex: 1, continuationEnd: 2, ...overrides };
  }

  test("setItemChecked flips only the target line's checkbox", () => {
    const lines = ["## Acme", "- [ ] follow up", "- [ ] other"];
    const out = setItemChecked(lines, item(), true);
    expect(out[1]).toBe("- [x] follow up");
    expect(out[2]).toBe("- [ ] other");
    expect(lines[1]).toBe("- [ ] follow up"); // original untouched
  });

  test("setItemChecked can uncheck an already-checked item", () => {
    const out = setItemChecked(["## Acme", "- [x] follow up"], item({ checked: true }), false);
    expect(out[1]).toBe("- [ ] follow up");
  });

  test("setItemText preserves the existing checkbox state", () => {
    const out = setItemText(["## Acme", "- [x] old text"], item({ checked: true }), "new text");
    expect(out[1]).toBe("- [x] new text");
  });

  test("setItemText collapses continuation lines into the single edited line", () => {
    const lines = ["## Acme", "- [ ] old first line", "  old continuation", "- [ ] next item"];
    const out = setItemText(lines, item({ continuationEnd: 3 }), "replacement");
    expect(out).toEqual(["## Acme", "- [ ] replacement", "- [ ] next item"]);
  });

  test("deleteItem removes the item and its continuation lines, nothing else", () => {
    const lines = ["## Acme", "- [ ] doomed", "  continuation", "- [ ] survivor"];
    const out = deleteItem(lines, item({ continuationEnd: 3 }));
    expect(out).toEqual(["## Acme", "- [ ] survivor"]);
  });

  test("deleteItem on the last item in the file leaves a clean, shorter array", () => {
    const lines = ["## Acme", "- [ ] only item"];
    expect(deleteItem(lines, item({ continuationEnd: 2 }))).toEqual(["## Acme"]);
  });

  test("insertItem splices a new unchecked item at the given line", () => {
    const out = insertItem(["## Acme", "- [ ] existing"], 2, "new task");
    expect(out).toEqual(["## Acme", "- [ ] existing", "- [ ] new task"]);
  });

  test("insertItem into an empty section lands right after the heading", () => {
    expect(insertItem(["## Acme"], 1, "first task")).toEqual(["## Acme", "- [ ] first task"]);
  });
});

describe("openItems / doneItems", () => {
  test("split a section's items by checked state, preserving order", () => {
    const section: TodoSection = {
      heading: "Acme",
      headingLine: 0,
      insertLine: 4,
      lines: [],
      items: [
        { checked: false, text: "a", lineIndex: 1, continuationEnd: 2 },
        { checked: true, text: "b", lineIndex: 2, continuationEnd: 3 },
        { checked: false, text: "c", lineIndex: 3, continuationEnd: 4 },
      ],
    };
    expect(openItems(section)).toEqual(["a", "c"]);
    expect(doneItems(section)).toEqual(["b"]);
  });
});
