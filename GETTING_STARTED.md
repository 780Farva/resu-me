# Getting started

This tool isn't a form you fill in — it's a conversation with Claude Code that builds up
a company-agnostic record of your career, then draws a tailored resume out of it for each
job you apply to. This walks through that loop end to end. Full conventions (filenames,
the status lifecycle, signature handling, writing style) live in `AGENTS.md`; this file
is about the sequence of steps, not the rules within each one.

## 1. One-time setup

```sh
just install-fonts   # downloads Inter into .fonts/ (gitignored)
just install-hooks    # wires up the pre-commit hook that rebuilds PDFs on commit
```

## 2. Build `career-timeline.md`

This is the source of truth every resume draws from — your verified timeline, the
load-bearing stories you tell about your work, your current focus, and open questions
that affect every resume (title conflicts, contact details, and so on). It doesn't exist
until you make it.

The fast way to start it: run `just interview-career`. It opens Claude Code primed to
interview you about your work history, role by role, and draft `career-timeline.md` from
the answers as you go. If you have old resumes lying around, drop them into
`past_resumes/` first — the interview checks there and uses them to skip ground it can
already infer, or run `just ingest-resumes` on its own afterward to diff later additions
against what's already written and fold in anything missing.

Re-run `just interview-career` any time; with the file already there, it reads it back
and asks what's changed instead of starting over.

You can also write `career-timeline.md` by hand; see `AGENTS.md` for the shape it should
take.

## 3. Build `job-search.md`

Your search parameters: location, comp target, role type, the role archetypes you're
targeting with their search terms and anti-filters, the company pipeline, and a "needs
manual search" list for boards that defeat automated fetching. Run `just
interview-search` for the same kind of guided interview, first-time or as an update — or
write the file directly.

## 4. Start an application

When you find a posting worth applying to, run `just new-application <company>`. Claude
will ask for whatever it needs (the posting link or pasted text, comp, referral status)
and then follow the checklist in `AGENTS.md`:

1. Create `applications/<YYYY-MM>-<company>/`.
2. Write `opportunity.md` — the facts about that opportunity and how your stories from
   `career-timeline.md` should be framed for this employer. It links back to
   `career-timeline.md` rather than repeating it, and starts with a `**Status:** open,
   <date>` line.
3. Write the resume `.typ`, importing `../../template.typ`.
4. Run `just compile <company-fragment>` to render it.

You can do each step yourself too, but letting Claude draft the first pass from
`career-timeline.md` and the posting is the normal path.

## 5. Review and refine

Run `just review <fragment>` to get a critique in the voice of whoever would actually
screen this application. It interviews you through the findings and folds the agreed
changes back into `opportunity.md` and the resume source. Iterate until it holds up.

## 6. Track it through to a decision

Log any open task about the search itself — a follow-up to send, a reply you're waiting
on — in `TODO.md`; that's the one file checked at the start of every session, so nothing
sits invisible in an `opportunity.md`. As the application moves — submitted,
interviewing, offer, rejection, silence — update its status line. `AGENTS.md` defines the
full set of states; reaching any `closed - *` state means moving the whole directory into
`applications/completed/`.

## 7. Repeat

Steps 4–6 repeat for every opportunity you pursue. `career-timeline.md` keeps growing as
new stories come up — a project that finishes, a number you can finally cite — so later
applications draw from a richer record than your first one did.

Grants follow the identical loop under `grants/` instead of `applications/`, dated by
deadline month instead of start date.

## Build command reference

Recipes are grouped (`setup`, `build`, `claude`) — run `just` or `just help` any time for
a getting-started hint and the full list with descriptions.

| Command | What it does |
| --- | --- |
| `just compile <fragment>` | Build every document in a matching `applications/` (or `grants/`) directory. |
| `just watch <fragment>` | Rebuild on save. |
| `just check <fragment>` | Flag section/entry headers stranded at a page bottom. |
| `just sign <fragment>` | Build a signed copy into the gitignored `.private/` — the one to actually send. |
| `just provenance <fragment>` | Read back the `src`/`tpl`/`rev` build metadata embedded in a compiled PDF. |
| `just all` | Compile every application and grant in the repo. |
| `just interview-career` | Interview you and draft/update `career-timeline.md`. |
| `just interview-search` | Interview you and draft/update `job-search.md`. |
| `just ingest-resumes` | Fold anything in `past_resumes/` into `career-timeline.md`. |
| `just new-application <company>` | Kick off a new application for `<company>`. |
| `just review <fragment>` | Open Claude Code with the resume-review skill. |

The `interview-*`, `ingest-resumes`, `new-application`, and `review` recipes all open an
interactive Claude Code session and accept the same `model`/`mode` overrides, e.g. `just
review acme sonnet` or `just interview-career opus plan`.

`<fragment>` matches an `applications/<date>-<company>/` (or `grants/...`) directory by
substring, so `just compile acme` finds `applications/2026-01-acme/`. Most recipes act on
the resume by default; pass a document type as a second argument for the cover letter
(`just watch acme cover`).
