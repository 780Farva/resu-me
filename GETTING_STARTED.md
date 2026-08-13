# Getting started

This tool isn't a form you fill in — it's a conversation with Claude Code that builds up
a company-agnostic record of your career, then draws a tailored resume out of it for each
job you apply to. This walks through that loop end to end. Full conventions (filenames,
the status lifecycle, signature handling, writing style) live in `AGENTS.md`; this file
is about the sequence of steps, not the rules within each one.

## 1. One-time setup

Run `just get-started`. It checks that Typst, `just`, and Claude Code are on your PATH,
offers to run `install-fonts` and `install-hooks` if they haven't been run yet, and then
launches straight into step 2, 3, or 4 below, whichever is still missing. From there,
steps 2 through 4 chain on their own — each one ends by offering to carry straight into
the next, so in practice you run `get-started` once and stay in one conversation through
onboarding. It's safe to re-run any time — later runs skip whatever's already done and
pick up wherever you left off.

To do it by hand instead:

```sh
just install-fonts   # downloads Inter into .fonts/ (gitignored)
just install-hooks    # wires up the pre-commit hook that rebuilds PDFs on commit
```

## 2. Build `about_me.md`

The contact and identity fields every resume and cover letter need verbatim — name,
credentials, location, email, phone, links. `just get-started` checks for this file
before anything else, because every resume needs it and it's the fastest to get right.

Run `just interview-about-me`. It's a short, direct exchange, not a long interview — you
have these answers memorized. Re-run it any time a phone number or link changes; with the
file already there, it asks what's changed instead of starting over. It also checks
committed resumes for placeholder contact info (a bracketed value like `[ADD PHONE]`) and
offers to fill them in once real values exist.

You can also write `about_me.md` by hand; see `AGENTS.md` for the exact fields. Once
it's done, the interview offers to carry straight into step 3 if `career-timeline.md`
doesn't exist yet.

## 3. Build `career-timeline.md`

This is the source of truth every resume draws from — your verified timeline, the
load-bearing stories you tell about your work, your current focus, and open questions
that affect every resume (title conflicts, dates you're unsure of, and so on). It doesn't
exist until you make it.

The fast way to start it: run `just interview-career`. It opens Claude Code primed to
interview you about your work history, role by role, and draft `career-timeline.md` from
the answers as you go. If you have old resumes lying around, drop them into
`past_resumes/` first — the interview checks there and uses them to skip ground it can
already infer, or run `just ingest-resumes` on its own afterward to diff later additions
against what's already written and fold in anything missing.

Re-run `just interview-career` any time; with the file already there, it reads it back
and asks what's changed instead of starting over.

You can also write `career-timeline.md` by hand; see `AGENTS.md` for the shape it should
take. Once it's done, the interview offers to carry straight into step 4 if
`job-search.md` doesn't exist yet.

## 4. Build `job-search.md`

Your search parameters: location, comp target, role type, the role archetypes you're
targeting with their search terms and anti-filters, the company pipeline, and a "needs
manual search" list for boards that defeat automated fetching. Run `just
interview-search` for the same kind of guided interview, first-time or as an update — or
write the file directly.

Once `about_me.md`, `career-timeline.md`, and `job-search.md` all exist, this is the
last onboarding step — the interview checks whether the shipped example application
(`applications/2026-01-example-co/`) is still around and offers to clean it up, then
offers to carry straight into step 5 if you name a company.

## 5. Start an application

When you find a posting worth applying to, run `just new-application <company>`. Claude
will ask for whatever it needs (the posting link or pasted text, comp, referral status)
and then follow the checklist in `AGENTS.md`:

1. Create `applications/<YYYY-MM>-<company>/`.
2. Write `opportunity.md` — the facts about that opportunity and how your stories from
   `career-timeline.md` should be framed for this employer. It links back to
   `career-timeline.md` rather than repeating it, and starts with a `**Status:** open,
   <date>` line.
3. Write the resume `.typ`, importing `../../template.typ`, with its contact fields
   filled in from `about_me.md` — never a placeholder.
4. Run `just compile <company-fragment>` to render it.

You can do each step yourself too, but letting Claude draft the first pass from
`about_me.md`, `career-timeline.md`, and the posting is the normal path.

## 6. Review and refine

Run `just review <fragment>` to get a critique in the voice of whoever would actually
screen this application. It interviews you through the findings and folds the agreed
changes back into `opportunity.md` and the resume source. Iterate until it holds up.

## 7. Track it through to a decision

Log any open task about the search itself — a follow-up to send, a reply you're waiting
on — in `TODO.md`; that's the one file checked at the start of every session, so nothing
sits invisible in an `opportunity.md`. As the application moves — submitted,
interviewing, offer, rejection, silence — update its status line. `AGENTS.md` defines the
full set of states; reaching any `closed - *` state means moving the whole directory into
`applications/completed/`.

## 8. Repeat

Steps 5–7 repeat for every opportunity you pursue. `career-timeline.md` keeps growing as
new stories come up — a project that finishes, a number you can finally cite — so later
applications draw from a richer record than your first one did.

Grants follow the identical loop under `grants/` instead of `applications/`, dated by
deadline month instead of start date.

## Build command reference

Recipes are grouped (`setup`, `build`, `claude`, `view`) — run `just` or `just help` any
time for a getting-started hint and the full list with descriptions.

| Command | What it does |
| --- | --- |
| `just get-started` | Check requirements, offer one-time setup, and launch the next interaction. |
| `just compile <fragment>` | Build every document in a matching `applications/` (or `grants/`) directory. |
| `just watch <fragment>` | Rebuild on save. |
| `just check <fragment>` | Flag section/entry headers stranded at a page bottom. |
| `just sign <fragment>` | Build a signed copy into the gitignored `.private/` — the one to actually send. |
| `just provenance <fragment>` | Read back the `src`/`tpl`/`rev` build metadata embedded in a compiled PDF. |
| `just all` | Compile every application and grant in the repo. |
| `just board` | Open a Kanban-style terminal board of every application/grant, by status. |
| `just interview-about-me` | Interview you and draft/update `about_me.md`. |
| `just interview-career` | Interview you and draft/update `career-timeline.md`. |
| `just interview-search` | Interview you and draft/update `job-search.md`. |
| `just ingest-resumes` | Fold anything in `past_resumes/` into `career-timeline.md`. |
| `just new-application <company>` | Kick off a new application for `<company>`. |
| `just review <fragment>` | Open Claude Code with the resume-review skill. |

## The application board

`just board` opens a full-screen terminal view of every `applications/` and `grants/`
opportunity, grouped into columns by its `**Status:**` state: Open, Submitted,
Interviewing, and Closed (won/lost/declined/lapsed shown as a tag on the card, since a
column each wouldn't fit). Use `←`/`→` to move between columns, `↑`/`↓` to move within
one, and `Enter` to drill into a card — its full `opportunity.md` plus any `TODO.md`
section matching its title. A card marked `!` has open items waiting in `TODO.md`.
Press `t` from the board for a standalone, checklist-formatted view of the whole
`TODO.md`; `b` or `Esc` goes back, `q` quits. `just board --list` (or running it with
stdout piped anywhere) prints the same data as plain text instead of the interactive
view, for scripting or a terminal that can't do curses.

Each of those opens an interactive Claude Code session running the matching skill under
`.claude/skills/` (e.g. `interview-career`, `new-application`, `resume-review`) and
accepts the same `model`/`mode` overrides, e.g. `just review acme sonnet` or `just
interview-career opus plan`. The skills also fire on their own in an ad-hoc conversation
when what you're asking for matches one — the `just` recipes are a shortcut, not the only
way in.

`<fragment>` matches an `applications/<date>-<company>/` (or `grants/...`) directory by
substring, so `just compile acme` finds `applications/2026-01-acme/`. Most recipes act on
the resume by default; pass a document type as a second argument for the cover letter
(`just watch acme cover`).
