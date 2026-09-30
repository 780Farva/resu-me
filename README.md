<div align="center">
<img src=".github/banner.svg" width="560" alt="resu-me">
<!-- Banner traced into rectangles from ASCII art generated using https://patorjk.com/software/taag on Coder Mini. Thanks, https://github.com/patorjk -->
<br/>
<br/>
</div>

A resume-building system for life. It is a resume generator built as a small toolkit
around a Typst template, a `just`-based build workflow, and an AI-assisted review skill,
built to grow with you across your whole career: every application in this search, and
every job change after it.

## Why

Most resume tools optimize for producing one PDF. This repo is built around the fact that
a real search produces many: one company-agnostic source of truth for your career
history, and a resume per application that draws from it with different emphasis. The
tooling exists to keep those in sync — a correction made once propagates, instead of
living or dying in whichever resume you were editing when you found it.

## What this isn't for

**Resume spraying.** resu-me makes it cheaper to write a good, tailored application, not
to send more of them. Every application starts with an `opportunity.md` that asks why
this role, what the gaps are, and how your work should be framed for this particular
reader. If you'd skip those questions, the tool has nothing to offer you. A hundred
near-identical applications fired at every posting that matches a keyword waste the
screener's time and yours, and they don't work.

**AI slop.** Claude is here to interview you, keep your records straight, and read your
draft the way a skeptical screener would. It isn't here to write a resume you haven't
read or claims you can't back up. Everything on the page should trace back to something
you actually did, recorded in `career-timeline.md` in your own words, and you should be
able to talk through any line of it in an interview. The skills are built to ask rather
than invent: ratings in the skills inventory come only from you, and the review skill
flags overstatement instead of adding it. If a sentence reads like it could be on anyone's
resume, rewrite it until it could only be on yours.

## Getting started

**Fork this repo first.** Your fork is where your real data lives — `about_me.md`,
`career-timeline.md`, `job-search.md`, and every application, committed normally, the
way `template.typ`'s comment on committed PDFs already assumes. That's by design: a
career history worth keeping is worth having in git history too. It just means this repo
— the shared template — needs to stay free of anyone's personal data, so it's still
clean for the next person who forks it.

Using this tool looks like a conversation, not a form: you tell Claude Code your contact
details and work history and it drafts `about_me.md` and `career-timeline.md`; you
describe your search and it drafts `job-search.md`; then for each posting, you and
Claude draft an `opportunity.md` and a tailored resume together and compile it with
`just`. See [`GETTING_STARTED.md`](GETTING_STARTED.md) for the full walkthrough,
including the build commands.

## Layout

- `TODO.md` — open job-search tasks (follow-ups, replies to send, open questions to
  resolve), grouped by application or grant. Not for developing this repo's own tooling —
  see `backlog/` below for that.
- `backlog/` — task tracking for this repo's own tooling, managed via the Backlog.md CLI.
- `about_me.md` — the contact/identity fields every resume needs verbatim: name,
  location, email, phone, links (create this; see `AGENTS.md` for the exact shape).
- `career-timeline.md` — your master, company-agnostic career history (create this;
  see `AGENTS.md` for what belongs in it).
- `job-search.md` — search parameters and the company pipeline (create this too).
- `skills-inventory.csv` — every skill a resume can list, with where it was earned and
  your own dated competency ratings. See "The skills inventory" below.
- `applications/<YYYY-MM>-<company>/` — one directory per application: an
  `opportunity.md` of facts and decisions, plus the resume/cover-letter `.typ`/`.pdf`.
- `applications/completed/` — closed applications, same shape, moved whole.
- `grants/` — same pattern, for grant applications instead of jobs.
- `template.typ` — the shared Typst template (`resume()`, `letter()`, `signoff()`).
- `justfile` — the build workflow (see [`GETTING_STARTED.md`](GETTING_STARTED.md)).
- `.claude/skills/` — Claude Code skills that run the onboarding interviews, start new
  applications, and review one (`resume-review`) in the voice of whoever would actually
  screen it.

Full conventions — filename rules, the application status lifecycle, signature handling,
writing-style notes — live in `AGENTS.md`, which doubles as the project's own AI-agent
context file.

## The skills inventory

`skills-inventory.csv` is the one place your skills are recorded, so that each resume's
skills section is chosen from a list you trust rather than retyped from memory. Without
it, skills drift: one resume says Modbus and another forgets it, and a skill picked up
from an old resume can spread to new ones with nothing behind it.

It's a CSV so tools can read it as data (sorting, filtering, charting, and eventually
the board TUI). One row is one skill, with these columns:

| Column | What goes in it |
| --- | --- |
| `skill` | The skill's name, as it would appear on a resume. |
| `category` | A broad bucket: Domain, Operations, Languages, Product & Business, and so on. |
| `group` | Optional. An umbrella skill this one belongs to, which has its own row. Grafana and Loki belong to Observability. |
| `competency` | Your own rating, 1–5. Blank until you've rated it. |
| `assessed_on` | The date of that rating. |
| `earned_through` | Where you earned or used the skill: roles, projects, years. |
| `source` | Where the evidence lives, usually a section of `career-timeline.md`. |
| `notes` | Anything else: caveats, your own words about it, wording to avoid. |

**The rating scale:** 1 aware (you've touched it), 2 working (you use it with reference
material), 3 proficient (you use it independently in production), 4 strong (the go-to
person on a team, handling the hard cases), 5 expert (you could teach it or design
systems around it). Ratings are always yours. Nothing in resu-me guesses one for you.

**Ratings keep their history.** When a rating changes, add a new row for the same skill
with a later date, and leave the old one as it is. The latest row is your current
rating, and the earlier rows show how the skill has grown.

**Three levels, so resumes can choose their detail.** A skill has a broad `category`
and, optionally, a `group`. An engineering resume might list Grafana, Prometheus, and
Loki individually. A product resume might list just Observability. Both are drawing on
the same rows.

**Using it:**

- The file ships with only its header row, so the columns are fixed before anything is
  written into it. `just interview-skills` fills it in the first time. It reads your career timeline and
  any old resumes, walks through what it found one category at a time, asks for your
  ratings, and offers a short interview to find skills you've stopped noticing. Re-run it
  any time to add skills or re-rate them.
- `just ingest-resumes` adds any skills from newly added old resumes as unrated rows.
- `just new-application` picks each resume's skills from the inventory. A skill that
  isn't in it gets a row, with where you earned it, before it goes on the page.
- `just review` flags any skill on a resume that has no row, or only weak evidence
  behind it.
- It's fine to record a skill sparsely and fill in the evidence later. A row with an empty
  `earned_through` is a note to come back to, but don't put it on a resume until it has
  one.
- You can edit the CSV directly in any spreadsheet app. Keep the header row, and change a
  rating by adding a row rather than overwriting.

## Make the template your own

`template.typ` is a deliberately plain starting point: single column, no photo, no
logos, so every ATS can parse it. It's also what everyone who forks this repo starts
with. Before you send your first application, take an hour to make a template that's
yours. A screener who reads a stack of resumes notices the ones that all look alike.

- Copy it to `template-<yourname>.typ` at the repo root and change what you like: type,
  colour, spacing, how headings and entries are set. Keep every function `template.typ`
  exports (`resume()`, `letter()`, `section()`, `entry()`, and the rest) with the same
  arguments, so the skills and your existing applications keep working with it.
- Opt in per document by changing its import to `../../template-<yourname>.typ`.
  Documents that still import `template.typ` are left alone.
- The pre-commit hook treats your template like `template.typ`. It won't try to compile
  it on its own, and when you change it, it rebuilds only the documents that import it.
  Applications you've already sent on another template stay exactly as they were sent.
- Build provenance (`just provenance`) records a hash of whichever template a document
  imports, so an old PDF still traces back to the exact template it was built with.
- Keep ATS-friendliness in mind: stay single column, keep the text selectable, and run
  `just check` after layout changes. If you add a font, add it to `.fonts/` the same way
  `just install-fonts` does, so a rebuild years from now renders the same.

## Requirements

- [Typst](https://typst.app/)
- [`just`](https://github.com/casey/just)
- [Claude Code](https://claude.com/claude-code) for the interviews and review skills —
  optional if you're writing every file by hand, but that's not the intended path

## License

MIT — see `LICENSE`.
