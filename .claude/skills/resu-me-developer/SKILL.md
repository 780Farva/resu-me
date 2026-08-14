---
name: resu-me-developer
description: Use when developing resu-me's own tooling — the justfile, template.typ, hooks/, src/, or the skills themselves — not when interviewing about career/job-search content or working on a specific application/grant. Covers the Backlog.md task-tracking workflow, how the justfile's recipes resolve documents and stamp build provenance, and template.typ's structural conventions.
---

# Developing resu-me itself

This is a different job from the skills that build resumes. "Add a just recipe," "fix
`_resolve`," "the sticky blocks broke," "add a new skill" — this one. "Start an
application for Acme," "update my career timeline," "email the recruiter back" — one of
the product skills instead; this file has nothing they need.

## Backlog.md workflow

This project uses Backlog.md for task and project management.

**For every request that falls under this skill, run `backlog instructions overview`
before answering or taking action.**

Use the overview to decide whether to search, read, create, or update Backlog tasks.

Use the detailed guides when needed:
- `backlog instructions task-creation` for creating or splitting tasks
- `backlog instructions task-execution` for planning and implementation workflow
- `backlog instructions task-finalization` for completion and handoff

Use `backlog <command> --help` before running unfamiliar commands. Help shows options,
fields, and examples.

Do not edit Backlog task, draft, document, decision, or milestone markdown files
directly. Use the `backlog` CLI so metadata, relationships, and history stay consistent.

`backlog/` tracks work on this repo's own tooling only — a bug in `just check` or a new
skill is a Backlog task. Job-search tasks ("follow up with the referral," "wait on the
recruiter reply") belong in `TODO.md` instead, read by the product skills; the two
systems stay separate.

## How the justfile works

- `_resolve name doc="resume"` finds one `.typ` file under `applications/` or `grants/`
  (including their `completed/` subdirectories) matching a name fragment and a document
  type (`resume` → `*Resume*.typ`, `cover` → `*Cover_Letter*.typ`). Every recipe that
  takes a name fragment goes through this, so a directory holding both a resume and a
  cover letter never gets the wrong one by accident. Zero or multiple matches is a hard
  error, not a guess.
- `_stamp file` emits the `--input src=... tpl=... rev=...` flags that
  `compile`/`sign`/`all` pass to `typst compile`. `src`/`tpl` are `git hash-object` blob
  hashes of the exact bytes compiled (the resume source and `template.typ`), so a PDF
  that resurfaces months later traces back to its source with `git log --all
  --find-object=<hash>`, regardless of whether the tree was clean at build time. `rev` is
  `HEAD`, which for a pre-commit build is the *parent* of the commit the PDF lands in —
  treat `src` as authoritative. `watch` deliberately skips stamping, so a draft PDF reads
  as "not a build of record."
- Read stamped metadata back with `just provenance <name>` (`hooks/show-provenance`
  parses PDF Keywords/Subject in stdlib Python — no poppler or exiftool needed). It also
  takes a bare path, for a PDF that came back from somewhere else.
- Section headings and entry headers are `sticky` blocks in `template.typ`, so Typst
  keeps them with their content. `just check` (`hooks/check-layout`) is the backstop if a
  future template change breaks that — it flags a header stranded at a page bottom.
- `just install-hooks` points `core.hooksPath` at the tracked `hooks/` dir;
  `hooks/pre-commit` rebuilds the PDF for any staged `.typ` change (and runs `check` on
  staged application resumes) so a committed PDF never drifts from its source.
- Recipes are grouped with `[group('setup'|'build'|'claude'|'view')]` attributes for
  `just --list`. A multi-line comment above a recipe only shows its *last* line in
  `--list` — use an explicit `[doc("...")]` attribute for the summary when a recipe's
  explanatory comment needs more than one line.
- `just board` runs `src/board.ts`, a small TUI *app* run directly by Bun — no
  `package.json`-driven install step, no compiled output, no dependencies beyond Bun's
  own APIs and Node's `fs`/`path` builtins. It lives under `src/`, separate from
  `hooks/`'s git-hook scripts, since it isn't a git hook at all. The app shell lives in
  `src/tui/` since the board is meant to be the first of several screens, not a one-off
  script:
  - `tui/theme.ts` — ANSI control sequences, the 256-color accent palette, box-drawing
    glyphs. One place for style so new screens read as the same app.
  - `tui/canvas.ts` — the `Canvas` cell-grid frame buffer every screen draws into
    (`box`/`text`/`hline`/`vline`/`fillRow`), plus raw-mode key decoding. Cell-level
    styling (not building each line as one styled string) is what lets box-drawing
    borders join cleanly and lets a single line mix styles — a card title in one color,
    its `[WON]`/`[LOST]` tag in another — without hand-tracking ANSI escape lengths
    against visible width. `render()` run-length-encodes consecutive same-style cells so
    a full-screen redraw every keypress stays cheap.
  - `tui/data.ts` — parsing (`STATUS_RE`/`TITLE_RE`/`parseTodo`), kept free of terminal
    concerns so it can be exercised without a tty; `src/board.ts --list` prints the
    same data as plain text, and is also what the script falls back to automatically
    when stdout isn't a tty.
  - `tui/app.ts` — the `State` every screen reads/mutates, shared chrome (header
    breadcrumb, footer keybinding chips), and the terminal event loop. Add a new screen
    by giving it a `render(canvas, state, bodyTop, bodyBottom, cols)` /
    `handleKey(state, key)` pair under `tui/screens/` and wiring it into `app.ts`'s
    mode dispatch — that's the extension point, not a rewrite of the loop.
  - `tui/screens/board.ts` — the status board (the first screen): one bordered panel per
    `**Status:**` state AGENTS.md defines, `closed - won/lost/declined/lapsed` collapsed
    into one `Closed` panel with the substate as a colored card tag, since four more
    panels wouldn't fit a terminal width. Cards flag open `TODO.md` items by matching a
    `##` heading against the opportunity's title (substring match, case-insensitive) —
    same convention the product skills already use for grouping `TODO.md` by
    company/program name. `c` on a selected card shells out to `just compile <dir-name>`
    with inherited stdio, then waits for a keypress before redrawing (`State.paused`) —
    satisfies TASK-3.5's "trigger the existing just recipes ... without leaving the CLI"
    without the async stdin-vs-`fs.readSync` conflicts a blocking "press any key" prompt
    would otherwise risk.
  - `tui/screens/detail.ts` / `tui/screens/todo.ts` — a card's full `opportunity.md` (plus
    its matching `TODO.md` section) and a standalone `TODO.md` view, respectively.
  - This is Bun/Node, not curses — there's no double-buffering primitive to lean on, so
    every `draw()` rebuilds the whole `Canvas` and writes it in one `process.stdout.write`
    call. Don't add incremental/partial redraws without a reason; a full-frame write per
    keypress is simple and, since Bun writes are cheap relative to how rarely a person
    presses keys, has never been the bottleneck in testing here.
  - Style cues are deliberately *not* pixel-matched to Backlog.md's own `backlog board` —
    that's a compiled blessed-based binary that needs a live terminal answering DA/DSR
    capability queries to render at all, so it can't be inspected headless. What's here
    (bordered panels, an accent color for the focused column, a chip-style keybinding
    footer) is the general "terminal Kanban" idiom Backlog.md is also an instance of, not
    a verified match to its exact rendering.
  - `tsconfig.json` (strict mode) plus `bun-types`/`@types/node` as devDependencies give
    `just board-check` (`bun install && bunx tsc --noEmit`) a real type-check. This is
    dev-time only — `just board` itself runs the source straight through Bun with no
    install step regardless, and `node_modules/`/`bun.lock` stay gitignored.
  - `just board-test` (`bun test`) runs `tui/data.test.ts`. Scoped deliberately to
    `tui/data.ts` — pure parsing/mutation functions with no tty or process dependency,
    and the one place a silent regression corrupts real data (`setItemChecked`/
    `setItemText`/`deleteItem`/`insertItem` write back to the user's actual `TODO.md`).
    `tui/canvas.ts`/`tui/screens/*` (rendering) and `tui/app.ts` (spawns processes,
    owns terminal state) are intentionally untested — low signal for the mocking cost.
    `.github/workflows/ci.yml` runs both `board-check` and `board-test` on push/PR.
  - TASK-3.5's description called for folding this view into a future `resume` CLI
    (TASK-3) rather than a standalone tool. TASK-3 and its subtasks are still "To Do" and
    unstarted; TASK-7 ("Migrate prompts into Claude Code skills"), which is Done, is the
    architecture this repo actually runs on today. `src/board.ts` was built standalone,
    superseding TASK-3.5's original design on that basis — see the task's comment log for
    the reasoning before reviving TASK-3.

## template.typ conventions

`resume()` is single-column, no photo, no address, no logos — some ATS parsers break on
multi-column layouts, so this isn't just a style choice. `letter()` shares its fonts,
header treatment, and provenance stamping so a resume/cover-letter pair reads as a pair.
Both take the same contact-field shape (`name`, `credentials`, `location`, `email`,
`phone`, and `resume()` alone also takes `links`) — this is the shape `about_me.md` and
the `new-application` skill fill in from, so changing these argument names is a breaking
change for every skill that references them.

`signoff()` always renders the typed name; it only draws a signature image when a
`signature` input is passed, which `compile`/`all`/the pre-commit hook never do — every
committed PDF is unsigned by construction, not by convention someone could forget.
