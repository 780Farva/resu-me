---
name: resu-me-developer
description: Use when developing resu-me's own tooling — the justfile, template.typ, hooks/, or the skills themselves — not when interviewing about career/job-search content or working on a specific application/grant. Covers the Backlog.md task-tracking workflow, how the justfile's recipes resolve documents and stamp build provenance, and template.typ's structural conventions.
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
- `just board` (`hooks/board`) is a stdlib-only Python/curses TUI: a Kanban board over
  every `opportunity.md` under `applications/` and `grants/` (their `completed/`
  subdirectories included), columned by the `**Status:**` states AGENTS.md defines —
  `closed - won/lost/declined/lapsed` collapse into one `Closed` column with the substate
  shown as a card tag, since four more columns wouldn't fit a terminal width. Parsing
  (`STATUS_RE`/`TITLE_RE`/`parse_todo`) is kept separate from the curses drawing code so
  it can be exercised without a tty; `hooks/board --list` prints the same data as plain
  text, and is also what the script falls back to automatically when stdout isn't a tty.
  Cards flag when they have open items by matching a `TODO.md` `##` heading against the
  opportunity's title (substring match, case-insensitive) — same convention the product
  skills already use of grouping `TODO.md` sections by company/program name. Add new
  columns or matching logic here, not in a product skill; this view only reads files the
  skills already maintain, it doesn't change what any of them write.

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
