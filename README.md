<div align="center">
<pre>
▄▄▄▄▄▄▄    ▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄ ▄▄▄  ▄▄▄       ▄▄▄      ▄▄▄  ▄▄▄▄▄▄▄ 
███▀▀███▄ ███▀▀▀▀▀ █████▀▀▀ ███  ███       ████▄  ▄████ ███▀▀▀▀▀ 
███▄▄███▀ ███▄▄     ▀████▄  ███  ███       ███▀████▀███ ███▄▄    
███▀▀██▄  ███         ▀████ ███▄▄███ ▀▀▀▀▀ ███  ▀▀  ███ ███      
███  ▀███ ▀███████ ███████▀ ▀██████▀       ███      ███ ▀███████ 
</pre>
<!-- ASCII art generated using https://patorjk.com/software/taag on Coder Mini. Thanks, https://github.com/patorjk -->
<br/><br/>
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

## Quickstart

```sh
just install-fonts        # one-time: downloads Inter into .fonts/ (gitignored)
just install-hooks         # one-time: wires up the pre-commit hook

just compile <fragment>    # build every document in a matching applications/ directory
just watch <fragment>      # rebuild on save
just check <fragment>      # flag section/entry headers stranded at a page bottom
just review <fragment>     # open Claude Code with the resume-review skill
```

`<fragment>` matches an `applications/<date>-<company>/` (or `grants/...`) directory by
substring, so `just compile acme` finds `applications/2026-01-acme/`.

## Layout

- `career-timeline.md` — your master, company-agnostic career history (create this;
  see `CLAUDE.md` for what belongs in it).
- `job-search.md` — search parameters and the company pipeline (create this too).
- `applications/<YYYY-MM>-<company>/` — one directory per application: an
  `opportunity.md` of facts and decisions, plus the resume/cover-letter `.typ`/`.pdf`.
- `applications/completed/` — closed applications, same shape, moved whole.
- `grants/` — same pattern, for grant applications instead of jobs.
- `template.typ` — the shared Typst template (`resume()`, `letter()`, `signoff()`).
- `justfile` — the build workflow (see Quickstart above).
- `.claude/skills/resume-review/` — a Claude Code skill that reviews an application in
  the voice of whoever would actually screen it, then interviews you through the
  findings.

Full conventions — filename rules, the application status lifecycle, signature handling,
writing-style notes — live in `CLAUDE.md`, which doubles as the project's own AI-agent
context file.

## Requirements

- [Typst](https://typst.app/)
- [`just`](https://github.com/casey/just)
- Optionally, [Claude Code](https://claude.com/claude-code) for the review skill

## License

MIT — see `LICENSE`.
