<div align="center">
<pre>
▄▄▄▄▄▄▄    ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄ ▄▄▄  ▄▄▄       ▄▄▄      ▄▄▄  ▄▄▄▄▄▄▄ 
███▀▀███▄ ███▀▀▀▀▀ █████▀▀▀ ███  ███       ████▄  ▄████ ███▀▀▀▀▀ 
███▄▄███▀ ███▄▄     ▀████▄  ███  ███       ███▀████▀███ ███▄▄    
███▀▀██▄  ███         ▀████ ███▄▄███ ▀▀▀▀▀ ███  ▀▀  ███ ███      
███  ▀███ ▀███████ ███████▀ ▀██████▀       ███      ███ ▀███████ 
</pre>
<!-- ASCII art generated using https://patorjk.com/software/taag on Coder Mini. Thanks, https://github.com/patorjk -->
<br/>
</div>

A resume-building system for people applying to more than one job. It is a resume
generator built as a small toolkit around a Typst template, a `just`-based build workflow, and
an AI-assisted review skill, built to be reused across every application over the course
of a job search (and beyond).

## Why

Most resume tools optimize for producing one PDF. This repo is built around the fact that
a real search produces many: one company-agnostic source of truth for your career
history, and a resume per application that draws from it with different emphasis. The
tooling exists to keep those in sync — a correction made once propagates, instead of
living or dying in whichever resume you were editing when you found it.

## Getting started

Using this tool looks like a conversation, not a form: you tell Claude Code about your
work history and it drafts `career-timeline.md`; you describe your search and it drafts
`job-search.md`; then for each posting, you and Claude draft an `opportunity.md` and a
tailored resume together and compile it with `just`. See
[`GETTING_STARTED.md`](GETTING_STARTED.md) for the full walkthrough, including the build
commands.

## Layout

- `TODO.md` — open job-search tasks (follow-ups, replies to send, open questions to
  resolve), grouped by application or grant. Not for developing this repo's own tooling —
  see `backlog/` below for that.
- `backlog/` — task tracking for this repo's own tooling, managed via the Backlog.md CLI.
- `career-timeline.md` — your master, company-agnostic career history (create this;
  see `AGENTS.md` for what belongs in it).
- `job-search.md` — search parameters and the company pipeline (create this too).
- `applications/<YYYY-MM>-<company>/` — one directory per application: an
  `opportunity.md` of facts and decisions, plus the resume/cover-letter `.typ`/`.pdf`.
- `applications/completed/` — closed applications, same shape, moved whole.
- `grants/` — same pattern, for grant applications instead of jobs.
- `template.typ` — the shared Typst template (`resume()`, `letter()`, `signoff()`).
- `justfile` — the build workflow (see [`GETTING_STARTED.md`](GETTING_STARTED.md)).
- `.claude/skills/resume-review/` — a Claude Code skill that reviews an application in
  the voice of whoever would actually screen it, then interviews you through the
  findings.

Full conventions — filename rules, the application status lifecycle, signature handling,
writing-style notes — live in `AGENTS.md`, which doubles as the project's own AI-agent
context file.

## Requirements

- [Typst](https://typst.app/)
- [`just`](https://github.com/casey/just)
- Optionally, [Claude Code](https://claude.com/claude-code) for the review skill

## License

MIT — see `LICENSE`.
