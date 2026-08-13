# resu-me — Context

A resume-building system meant to be reused across job applications, over time — not a
one-shot resume generator. Typst for rendering, `just` for the build workflow, and
Claude Code skills that run the interviews, start applications, and review them in the
voice of whoever would actually screen it.

## Layout

- `TODO.md` — **every open job-search task**, grouped by application or grant: things
  like "follow up with the referral," "wait on the recruiter reply," "resolve this open
  question before submitting." It is scoped to the search itself, not to developing this
  repo's tooling — that work is tracked separately in `backlog/` (see below). Check
  `TODO.md` at the start of a session, surface anything open, and clear items as they're
  resolved. Once a completed (`[x]`) task has been committed to git, delete it from the
  file the next time a new task is picked up — don't let finished items accumulate. Git
  history is the record; the file should only ever show live work.
  - **Job-search tasks live here and nowhere else.** Per-application next actions filed
    elsewhere (an `opportunity.md`, say) go invisible: `TODO.md` is what gets read at the
    start of a session, so anything that needs doing about the search belongs in this
    file, even when the reasoning behind it lives elsewhere.
- `backlog/` — task tracking for developing this repo's own tooling (the justfile,
  template, skills, a future CLI, etc.), managed by the Backlog.md CLI rather than edited
  by hand. See the Backlog.md Workflow instructions below. Keep the two systems separate:
  a bug in `just check` or a new skill is a Backlog task; "email the recruiter back" is a
  `TODO.md` line.
- `about_me.md` — the contact and identity fields that go on every resume and cover
  letter verbatim: name, credentials, location, email, phone, links. These are exactly
  the arguments `resume()` and `letter()` take in `template.typ`. Every application
  draws from here instead of typing them in per resume, and a resume `.typ` should never
  carry a bracketed placeholder in their place.
- `career-timeline.md` — your master, company-agnostic history: verified timeline, the
  load-bearing stories you tell about your work, current focus, side projects, and open
  questions that affect every resume (title conflicts, contact details, etc.). Read this
  before writing or editing any resume content.
- `job-search.md` — search parameters (location, comp target, role type), the role
  archetypes you're targeting with their search terms and anti-filters, the company
  pipeline, and a "needs manual search" list of boards that defeat automated fetching.
  Read it before opening a new application; graduate leads from its pipeline into
  `applications/`.
- `past_resumes/` — prior resumes kept for reference, not built by this repo's tooling.
  When a new one is added, diff it against `career-timeline.md` and fold in anything new.
- `applications/<YYYY-MM>-<company>/` — one directory per job application, dated by when
  work on it started (for ordering and future archiving). Each contains:
  - `opportunity.md` — **the facts about that opportunity**: posting link, comp, referral
    status, employer research, gaps, how your load-bearing stories should be framed for
    that company, and the decisions made with their reasons. Links back to
    `career-timeline.md` rather than duplicating it. **Nothing actionable** — tasks belong
    in `TODO.md`. Each file ends with a short "Open actions" pointer saying so. Its first
    line after the heading is a `**Status:**` line — see "Application lifecycle" below.
  - the resume source (`.typ`) and rendered (`.pdf`) for that application.
- `applications/completed/<YYYY-MM>-<company>/` — applications in a closed state, moved
  here whole. Same shape as above; the directory keeps its original date prefix, so the
  ordering survives the move. Nothing else changes: `just compile`/`check`/`review`
  resolve fragments in here too, and PDF provenance is by git blob hash rather than path,
  so a resume that resurfaces years later still traces back to its source after the move.
- `grants/<YYYY-MM>-<funder-program>/` — same shape as `applications/`, for grants rather
  than jobs: an `opportunity.md` holding the program's rules, deadline, and open
  questions, plus a resume `.typ`/`.pdf`. Same split as above — facts here, tasks in
  `TODO.md`. Dated by the deadline month. `just compile`/`check`/`watch`/`all` and the
  pre-commit hook cover this directory the same as `applications/`. Closed grants move to
  `grants/completed/`, on the same rule as applications; for a grant, "won" is awarded and
  "lost" is not funded.
- `template.typ` — shared Typst template. `resume()` is used by every resume: single
  column, no photo, no address, no logos (some ATS parsers break on multi-column
  layouts). `letter()` renders a cover letter in the same type and header treatment, for
  applications that want one as a PDF.
- `justfile` — `just install-fonts` (one-time, downloads Inter into `.fonts/`, gitignored)
  and `just compile <name>` / `just watch <name>` / `just all`, where `<name>` is an
  `applications/` directory name or fragment (e.g. `just compile acme`). `just compile`
  builds *every* document in the matched directory, so a resume and its cover letter can't
  drift apart; the other recipes act on the resume unless given a document type as a
  second argument (`just watch acme cover`, `just provenance acme cover`). `just sign
  <name>` builds a signed copy into the gitignored `.private/` — see "Signatures stay out
  of git" below. Also `just install-hooks` (one-time, wires up `hooks/pre-commit`, which
  rebuilds the PDF for any staged `.typ` change and stages it too), and `just check
  <name>` (flags section or entry headers stranded near a page bottom; the pre-commit
  hook also runs it on staged application resumes). Section headings and entry headers
  are `sticky` blocks in `template.typ`, so Typst keeps them with their content — `just
  check` is the backstop if a future template change breaks that.
- **Build provenance.** Compiled PDFs carry `src`, `tpl`, and `rev` in their PDF
  metadata (Keywords and Subject) — never on the page, since a hex string in a resume
  footer is noise to a reader. `src` and `tpl` are `git hash-object` blob hashes of the
  exact bytes compiled, so a PDF that resurfaces months later traces back to its source
  with `git log --all --find-object=<hash>`, whether or not the tree was clean when it was
  built. `rev` is HEAD at build time, which for a pre-commit build is the *parent* of the
  commit the PDF lands in — treat `src` as authoritative. `just watch` deliberately leaves
  the metadata empty so a draft PDF reads as "not a build of record." Read it back with
  `just provenance <name>`, which also takes a path to any PDF (`hooks/show-provenance`
  does the parsing, in stdlib Python — no poppler or exiftool needed).

## Application lifecycle

Every `opportunity.md` under `applications/` and `grants/` carries a status line as its
first line after the heading, date-stamped so it can't rot into an undated "currently":

```
**Status:** submitted, 2026-08-07 (via referral; awaiting confirmation it was filed)
```

The state is one of these. Keep the vocabulary closed — a new state is a decision to
make deliberately, not a phrase to invent in passing.

| State | Meaning |
| --- | --- |
| `open` | Being worked on. Nothing sent yet, including stubs with no resume. |
| `submitted` | The application is in. Waiting on them. |
| `interviewing` | In a live hiring loop, or a grant under jury review. |
| `closed - won` | Offer accepted. For a grant, awarded. |
| `closed - lost` | Rejected. For a grant, not funded. |
| `closed - declined` | You withdrew, or turned down an offer. |
| `closed - lapsed` | Never heard back. |

`lapsed` exists because silence is the most common outcome and it isn't the same fact as
a rejection. Reading the search back years later, a role that never replied says
something about the posting; one that rejected you says something about the fit.

**On reaching any `closed - *` state, move the whole directory into
`applications/completed/`** (or `grants/completed/`), keeping its date prefix, and leave
the status line saying which closed state and when. The move is the only signal that
needs no interpretation: what's directly under `applications/` is what's still alive.

Submission is deliberately *not* a move. The most active phase of an application starts
after the PDF goes out — referral confirmation, interviews, follow-ups — and filing it
under `completed/` at that point would read as parked when it's actually hot.

## Conventions

- Filename: `<Your_Name>_Resume_<Company_name>.pdf`, and
  `<Your_Name>_Cover_Letter_<Company_name>.pdf` where one is needed. The `Resume` and
  `Cover_Letter` in those names are load-bearing: `just _resolve` picks a document out of
  a directory by matching them, so a file named some other way won't be found.
- **Cover letters.** Some applications want the letter pasted into a message field, some
  want an attachable PDF. For a pasted one, markdown in `cover-note.md` is enough. For a
  PDF, write a `.typ` importing `letter()` from `template.typ` (it shares the resume's
  fonts, header treatment and provenance stamping, so the pair looks like a pair) and keep
  the `.typ` as the text of record — a letter that exists in both markdown and Typst will
  drift, and the copy that gets sent should be the one that gets edited.
- **Signatures stay out of git.** `signoff()` always renders the typed name, and draws a
  signature image above it only when a `signature` input points at one. `just compile`,
  `just all` and the pre-commit hook never pass it, so **every committed PDF is
  unsigned**. `just sign <name>` builds the signed copy — the one to actually attach —
  from `.private/signature.png` into `.private/`, which is gitignored. Gitignoring the
  raster alone would achieve nothing, since the hook is what builds the committed PDF;
  keeping signed output out of the tree is the part that matters. A signature can't be
  rotated the way a phone number can, and a clean raster of one is the input to signing
  things you didn't sign. Wrap the closing paragraph and the `signoff()` call in
  `#block(breakable: false)[...]` so a signed build can't strand the signature alone on a
  page of its own.
- **Never use a bullet list for a single item.** A one-item list is a paragraph wearing a
  bullet, and it reads as a section someone trimmed and didn't finish. Where an entry has
  one thing to say, write it as body text with `#text(size: 10pt)[...]`, the same
  treatment the multi-bullet entries use for their intro paragraph. Bullets start at two.
- **Keep the first-person voice parallel across entries.** Entries that open "I built...",
  "I ran..." sitting alongside ones opening with a bare verb ("Migrated...", "Built...")
  is what reads wrong, not either form on its own. Implied-subject bullets *inside* an
  entry are fine; it's the opening line of each entry that should match its neighbours.
- Typst preferred for rendering.
- Two separate resumes per pair of applications is normal — different emphasis per
  company, not one resume trying to fit everything.
- Let resume content set its own page length — don't compress spacing to force a page
  count. `template.typ` is tuned for generous spacing already. Cut a bullet when it's
  weak, repetitive, or wrong for the reader — never because the page is full.
- PDFs are committed (they're the shippable deliverable); `.fonts/` is not (installed via
  `just install-fonts`).
- **Shipped placeholder content is named `*.example`.** The one file in the repo that
  isn't real data — `applications/2026-01-example-co/opportunity.md.example` — carries
  the suffix so it reads unmistakably as scaffolding, not a live opportunity, and so
  nothing that scans `applications/*/opportunity.md` picks it up by accident. Its
  sibling `.typ`/`.pdf` files keep their normal names on purpose: `just
  compile`/`check`/`review` are meant to have something to run against out of the box.
  `just get-started` offers to delete the whole example-co directory, and clear the
  matching `TODO.md` section, once `about_me.md`, `career-timeline.md`, and
  `job-search.md` all exist for real — so the placeholder doesn't linger once it's
  served its purpose.

## Writing style

Plain, first-person, declarative. State what happened; let the fact carry the weight.
Prefer understatement to drama, concrete nouns and numbers over abstractions, and plain
words over buzzwords ("dynamic," "spearheaded," "leveraged," "passionate about
innovation"). Avoid bolded-aphorism bullet openers, tacked-on reflection clauses that
explain the lesson learned, heavy em-dash use as a sentence-joining crutch, and invented
achievements or vague superlatives not traceable to `career-timeline.md`. Adapt this
section to your own voice — it's a starting point, not a fixed rule set.

## Conversational style

`Writing style` above governs resume prose. This governs how you talk to the person
during an interview, review, or any other skill in this file — a different thing, and
worth getting right, since a chatty interview is worse than no interview.

- **Don't narrate the mechanism.** "I grepped the `.typ` files for placeholders," "I
  recorded the missing phone as a deliberate omission rather than a blank," "Placeholder
  check: ..." — none of that is for the user. State the outcome in plain terms ("no
  placeholders found; two fields still open") and move on. If the reasoning behind a
  choice actually matters to the user, say the reasoning, not the mechanism that produced
  it.
- **Don't hand back a decision that isn't one.** When the next step is the obvious next
  step — the next skill in the onboarding chain, the next item on a checklist — take it.
  Say briefly what you're doing and go, rather than stopping to ask "want me to
  continue?" Reserve actual questions for things that need a real decision or a piece of
  information only the user has.
- Keep responses proportionate to what's being asked. A short answer to a short
  question; length only when the content earns it.

## Claude Code skills

`.claude/skills/` holds the skills that drive the main loop. Each is invokable as a
slash command (`/interview-career`), through the matching `just` recipe (`just
interview-career`), or picked up on its own by Claude Code in an ad-hoc conversation
when it matches what's being asked for — a user describing a posting doesn't have to
know `/new-application` exists for it to fire.

- `interview-about-me` — build or update `about_me.md`.
- `interview-career` — build or update `career-timeline.md`.
- `interview-search` — build or update `job-search.md`.
- `ingest-resumes` — fold `past_resumes/` into `career-timeline.md`.
- `new-application` — start a new application, following the checklist below.

The first three chain: each one ends by checking whether the next onboarding file is
still missing and, if so, offering to continue straight into it — by **invoking that
skill**, not paraphrasing it from memory, since the whole point of a skill is the
specifics in its instructions (checking `past_resumes/` first, the exact fields to ask
for) that a paraphrase would drift from. `interview-about-me` invokes `interview-career`,
that invokes `interview-search`, which finishes by offering to clean up the shipped
example application (see the `.example` convention above) and invoking `new-application`
for a first real one. `just get-started` is the entry point into the chain, not a
separate mechanism; running any one of these skills directly picks up wherever the chain
would have left off.
- `resume-review` — review an application in the persona of the person who would
  actually screen it, then interview you through the findings and fold them back into
  the source documents. Use it rather than reviewing ad hoc.

## New application checklist

1. Create `applications/<YYYY-MM>-<company>/`.
2. Write `opportunity.md` for the role (status line, posting, comp, referral, gaps,
   framing) — check `career-timeline.md`'s open questions for anything that needs
   resolving before this application ships.
3. Write the resume `.typ` importing `../../template.typ`, with `resume.with(...)`'s
   contact fields filled in from `about_me.md`. Never leave a bracketed placeholder in a
   committed `.typ` — ask for the missing value instead.
4. `just compile <company-fragment>`.

<!-- BACKLOG.MD GUIDELINES START -->
<CRITICAL_INSTRUCTION>

## Backlog.md Workflow

This project uses Backlog.md for task and project management.

**For every user request in this project, run `backlog instructions overview` before answering or taking action.**

Use the overview to decide whether to search, read, create, or update Backlog tasks.

Use the detailed guides when needed:
- `backlog instructions task-creation` for creating or splitting tasks
- `backlog instructions task-execution` for planning and implementation workflow
- `backlog instructions task-finalization` for completion and handoff

Use `backlog <command> --help` before running unfamiliar commands. Help shows options, fields, and examples.

Do not edit Backlog task, draft, document, decision, or milestone markdown files directly. Use the `backlog` CLI so metadata, relationships, and history stay consistent.

</CRITICAL_INSTRUCTION>
<!-- BACKLOG.MD GUIDELINES END -->
