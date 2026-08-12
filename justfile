font_path := ".fonts"
inter_url := "https://github.com/rsms/inter/releases/latest/download/Inter-4.1.zip"
signature := ".private/signature.png"

# Bare `just` would otherwise run the first recipe in the file — make that a help
# screen instead of a surprise font download.
[private]
default: help

# Print a getting-started hint and the full recipe list.
help:
    @echo "New here? Start with GETTING_STARTED.md, or run:"
    @echo "  just install-fonts && just install-hooks   # one-time setup"
    @echo "  just review <company-fragment>              # review an application in Claude Code"
    @echo
    @just --list

# Download the Inter font family (static TTFs) into .fonts/ — run once before compiling
[group('setup')]
install-fonts:
    mkdir -p {{font_path}}
    curl -sL {{inter_url}} -o /tmp/inter.zip
    unzip -o -j /tmp/inter.zip "extras/ttf/Inter-Regular.ttf" "extras/ttf/Inter-Medium.ttf" "extras/ttf/Inter-SemiBold.ttf" "extras/ttf/Inter-Bold.ttf" "extras/ttf/Inter-Italic.ttf" -d {{font_path}}
    rm /tmp/inter.zip

# Resolve an applications/ or grants/ subdirectory name (or fragment) to one .typ file.
# Searches the completed/ subdirectories too, so a closed application still compiles and
# reviews by the same fragment it always did — see the status states in AGENTS.md.
#
# A directory can hold more than one document (a resume and a cover letter), so the match
# is scoped by document type rather than taking "the only .typ in there". Defaults to the
# resume, which is what every other recipe wants: `just _resolve acme cover` for the letter.
_resolve name doc="resume":
    #!/usr/bin/env bash
    set -euo pipefail
    shopt -s nullglob
    case "{{doc}}" in
        resume) pattern='*Resume*' ;;
        cover)  pattern='*Cover_Letter*' ;;
        *) echo "Unknown document type '{{doc}}' — want 'resume' or 'cover'" >&2; exit 1 ;;
    esac
    matches=(
        applications/*{{name}}*/$pattern.typ applications/completed/*{{name}}*/$pattern.typ
        grants/*{{name}}*/$pattern.typ grants/completed/*{{name}}*/$pattern.typ
    )
    if [ "${#matches[@]}" -eq 0 ]; then
        echo "No {{doc}} matching '{{name}}' under applications/ or grants/" >&2
        exit 1
    fi
    if [ "${#matches[@]}" -gt 1 ]; then
        echo "Ambiguous match for '{{name}}':" >&2
        printf '  %s\n' "${matches[@]}" >&2
        exit 1
    fi
    echo "${matches[0]}"

# Emit the --input flags stamping build provenance into the PDF metadata.
# src/tpl are git blob hashes of the exact bytes compiled, so they identify the source
# whether or not the tree was clean. rev is HEAD, which for a pre-commit build is the
# parent of the commit the PDF lands in. See the comment in template.typ.
_stamp file:
    #!/usr/bin/env bash
    set -euo pipefail
    src="$(git hash-object "{{file}}" 2>/dev/null || echo unknown)"
    tpl="$(git hash-object template.typ 2>/dev/null || echo unknown)"
    rev="$(git rev-parse --short HEAD 2>/dev/null || echo unknown)"
    echo "--input src=${src:0:12} --input tpl=${tpl:0:12} --input rev=$rev"

# Compile an application by directory name (or fragment), e.g. `just compile acme`.
# Builds every document in that directory, so an application with a cover letter alongside
# its resume ships both PDFs from one command and they can't drift apart.
[group('build')]
[doc("Compile a resume/cover letter by directory name or fragment, e.g. `just compile acme`")]
compile name:
    #!/usr/bin/env bash
    set -euo pipefail
    dir="$(dirname "$(just _resolve {{name}})")"
    for f in "$dir"/*.typ; do
        typst compile --root . --font-path {{font_path}} $(just _stamp "$f") "$f"
    done

# Build a signed copy of a document — the one to actually attach to an application.
# Defaults to the cover letter, since that's the thing that gets signed. Output goes to
# .private/, which is gitignored, and the signature PNG lives there too. Deliberately NOT
# part of `just compile`, `just all`, or the pre-commit hook: those build the PDFs that get
# committed, and a signature raster embedded in a committed PDF is in git history for good.
[group('build')]
[doc("Build a signed copy into the gitignored .private/ — the one to actually attach")]
sign name doc="cover":
    #!/usr/bin/env bash
    set -euo pipefail
    if [ ! -f "{{signature}}" ]; then
        echo "No signature image at {{signature}}" >&2
        echo "Put the PNG there and it stays out of git (.private/ is ignored)." >&2
        exit 1
    fi
    file="$(just _resolve {{name}} {{doc}})"
    mkdir -p .private
    out=".private/$(basename "${file%.typ}").pdf"
    typst compile --root . --font-path {{font_path}} $(just _stamp "$file") \
        --input signature={{signature}} "$file" "$out"
    echo "signed: $out  (gitignored — attach this one)"

# Check a compiled resume for headers stranded at page bottoms.
# Takes the same optional document type as _resolve; a cover letter has no headers to
# strand, so checking one passes trivially.
[group('build')]
[doc("Flag section/entry headers stranded at a page bottom")]
check name doc="resume":
    #!/usr/bin/env bash
    set -euo pipefail
    file="$(just _resolve {{name}} {{doc}})"
    hooks/check-layout "$file" && echo "no awkward page breaks in $file"

# Show the build provenance stamped into a PDF. Takes a name fragment like `just
# compile` does, or a path to any PDF (e.g. one that came back from a recruiter).
[group('build')]
[doc("Read back the src/tpl/rev build metadata stamped into a compiled PDF")]
provenance target doc="resume":
    #!/usr/bin/env bash
    set -euo pipefail
    if [ -f "{{target}}" ]; then
        pdf="{{target}}"
    else
        typ="$(just _resolve {{target}} {{doc}})"
        pdf="${typ%.typ}.pdf"
    fi
    hooks/show-provenance "$pdf"

# Watch and recompile on save, by directory name (or fragment).
# Deliberately unstamped: a stamp computed once at startup would go stale on the first
# save, and a draft PDF with no provenance correctly reads as "not a build of record".
# The pre-commit hook stamps it properly on the way in.
# `just watch acme cover` watches the cover letter instead of the resume.
[group('build')]
[doc("Rebuild a resume/cover letter on save, by directory name or fragment")]
watch name doc="resume":
    #!/usr/bin/env bash
    set -euo pipefail
    file="$(just _resolve {{name}} {{doc}})"
    typst watch --root . --font-path {{font_path}} "$file"

# Compile every resume under applications/ and grants/, closed ones included
[group('build')]
all:
    #!/usr/bin/env bash
    set -euo pipefail
    shopt -s nullglob
    for f in applications/*/*.typ applications/completed/*/*.typ grants/*/*.typ grants/completed/*/*.typ; do
        typst compile --root . --font-path {{font_path}} $(just _stamp "$f") "$f"
    done

# Opens an interactive session primed with the /resume-review skill pointed at that
# directory, so the review lands and you carry straight on into the interview it starts.
# Defaults to opus in auto permission mode. Override either positionally:
# `just review acme sonnet` or `just review acme opus plan`. Other modes claude accepts
# are acceptEdits, bypassPermissions, manual, dontAsk and plan.
# Review an application in Claude Code, e.g. `just review acme` or `just review acme sonnet`
[group('claude')]
[doc("Open Claude Code with the resume-review skill pointed at an application")]
review name model="opus" mode="auto":
    #!/usr/bin/env bash
    set -euo pipefail
    # Two statements, not one nested substitution: `dir="$(dirname "$(just _resolve ...)")"`
    # hides a resolver failure, because set -e only sees dirname's exit status. A bad
    # fragment would then resolve to "." and start a review of the whole repo.
    typ="$(just _resolve {{name}})"
    dir="$(dirname "$typ")"
    exec claude --model {{model}} --permission-mode {{mode}} "/resume-review $dir"

# One-time setup: point git at the tracked hooks/ dir so pre-commit rebuilds changed PDFs
[group('setup')]
install-hooks:
    git config core.hooksPath hooks
