// Shared resume template — clean, single-column, minimalist.
// Ashby-safe: no tables, no columns, no images, no logos.

#let ink = rgb("#1a1a1a")
#let muted = rgb("#5c5c5c")
#let accent = rgb("#0f4c5c") // muted deep teal — used sparingly for section labels
#let rule-color = rgb("#d8d8d8")

// Build provenance, stamped into PDF metadata (never shown on the page) so a PDF that
// comes back months later can be traced to the source that produced it. Populated by
// `just compile` and hooks/pre-commit via `--input`; empty on a bare `typst compile`.
//
// `src` and `tpl` are `git hash-object` blob hashes of the resume source and the
// template — the exact bytes compiled, regardless of whether the tree was clean. Find
// the commit later with `git log --all --find-object=<hash>`.
//
// `rev` is HEAD at build time. The pre-commit hook builds before the commit exists, so
// for a committed PDF this is the PARENT of the commit containing it. Use it as a rough
// locator; `src` is the authoritative identity.
//
// Read it back with `pdfinfo <file>.pdf` (Keywords and Subject).
#let _provenance() = {
  let get = k => sys.inputs.at(k, default: "")
  let parts = ()
  for k in ("src", "tpl", "rev") {
    let v = get(k)
    if v != "" { parts.push(k + ":" + v) }
  }
  parts
}

#let resume(
  name: "",
  credentials: "",
  title: "",
  location: "",
  email: "",
  phone: "",
  links: (),
  body,
) = {
  let prov = _provenance()
  set document(
    title: name,
    author: name,
    keywords: prov,
    description: if prov.len() > 0 [Built from #prov.join(" ")],
  )
  set page(
    width: 8.5in,
    height: 11in,
    margin: (x: 0.9in, top: 0.65in, bottom: 0.65in),
    footer: context align(center)[
      #text(size: 8.5pt, fill: muted)[#name #sym.dot.c #counter(page).display("1 of 1", both: true)]
    ],
  )
  set text(font: "Inter", size: 10pt, fill: ink, lang: "en")
  set par(justify: false, leading: 0.65em)

  // Header
  align(center)[
    #text(size: 23pt, weight: "bold", tracking: 0.2pt)[#name]
  ]
  v(3pt)
  align(center)[
    #text(size: 12pt, weight: "medium", fill: accent)[#title]
  ]
  // Credentials sit on their own line rather than trailing the title after a dot.
  // Joined, a long title and a long credentials list wrap at whatever word lands on
  // the margin, which splits one phrase across two lines and reads as a jumble.
  if credentials != "" {
    v(2pt)
    align(center)[
      #text(size: 10.5pt, weight: "medium", fill: accent)[#credentials]
    ]
  }
  v(6pt)
  align(center)[
    #text(size: 9.4pt, fill: muted)[
      #location
      #if email != "" [ #sym.dot.c #email ]
      #if phone != "" [ #sym.dot.c #phone ]
    ]
  ]
  if links.len() > 0 {
    v(3pt)
    align(center)[
      #text(size: 9.4pt, fill: muted)[
        #for (i, l) in links.enumerate() [
          #if i > 0 [ #sym.dot.c ]
          #link("https://" + l)[#l]
        ]
      ]
    ]
  }
  v(10pt)

  body
}

// Cover letter, for applications that want the letter as an attachable PDF rather than
// pasted into a message field. Shares the resume's fonts, colours and header treatment on
// purpose, so the two PDFs read as a pair when they land in the same inbox. No probes are
// emitted here: a letter has no section or entry headers, so `just check` finds nothing to
// check and passes trivially.
#let letter(
  name: "",
  credentials: "",
  location: "",
  email: "",
  phone: "",
  date: "",
  recipient: none,
  body,
) = {
  let prov = _provenance()
  set document(
    title: name + " — cover letter",
    author: name,
    keywords: prov,
    description: if prov.len() > 0 [Built from #prov.join(" ")],
  )
  set page(
    width: 8.5in,
    height: 11in,
    margin: (x: 0.9in, top: 0.65in, bottom: 0.65in),
    footer: context align(center)[
      #text(size: 8.5pt, fill: muted)[#name #sym.dot.c #counter(page).display("1 of 1", both: true)]
    ],
  )
  set text(font: "Inter", size: 10pt, fill: ink, lang: "en")
  // Paragraph spacing does the work a letter's blank lines would; no first-line indent.
  set par(justify: false, leading: 0.65em, spacing: 11pt)

  align(center)[
    #text(size: 23pt, weight: "bold", tracking: 0.2pt)[#name]
  ]
  v(6pt)
  align(center)[
    #text(size: 9.4pt, fill: muted)[
      #location
      #if email != "" [ #sym.dot.c #email ]
      #if phone != "" [ #sym.dot.c #phone ]
      #if credentials != "" [ #sym.dot.c #credentials ]
    ]
  ]
  v(9pt)
  line(length: 100%, stroke: 0.5pt + rule-color)
  v(14pt)

  if date != "" {
    text(size: 9.6pt, fill: muted)[#date]
    v(10pt)
  }
  if recipient != none {
    recipient
    v(10pt)
  }

  body
}

// Sign-off at the end of a letter. The typed name is always rendered — it's what makes the
// signature extractable as text, and it's all a recruiter needs.
//
// A signature image is drawn above it only when a `signature` input names one, which is how
// the existence check stays in bash: Typst has no way to test whether a file is there, and
// `image()` on a missing path is a hard error that would break every clone without it.
// `just compile` and the pre-commit hook never pass it, so **committed PDFs are unsigned**
// — otherwise gitignoring the raster would accomplish nothing, since the hook is what
// builds the PDF that gets committed. `just sign <name>` passes it and writes to the
// gitignored `.private/`. That build is the one to attach to an application.
// Wrap the closing paragraph and this call in `#block(breakable: false)[...]` in the letter
// source, so a signed build can't put a lone signature on a second page.
#let signoff(name) = {
  let sig = sys.inputs.at("signature", default: "")
  v(6pt)
  if sig != "" {
    block(image(sig, height: 26pt))
    v(1pt)
  }
  name
}

// Invisible probe read by `just check` (typst query) to catch headers left
// stranded near a page bottom despite the sticky blocks below.
#let _probe(kind, label) = context [
  #metadata((kind: kind, label: label, page: here().position().page, y: here().position().y.pt()))<layout-probe>
]

#let section(title) = {
  v(14pt)
  // sticky: never leave the heading behind at the bottom of a page
  block(sticky: true)[
    #_probe("section", title)
    #text(size: 10pt, weight: "bold", fill: accent, tracking: 1.2pt)[#upper(title)]
    #v(-6pt)
    #line(length: 100%, stroke: 0.5pt + rule-color)
  ]
  v(8pt)
}

#let entry(role: "", org: "", dates: "", body) = {
  // sticky: keep the role/company/dates line with the body that follows
  block(sticky: true)[
    #_probe("entry", role)
    #grid(
      columns: (1fr, auto),
      align(left)[
        #text(weight: "semibold", size: 10.6pt)[#role]
        #if org != "" [#text(fill: muted)[ — #org]]
      ],
      align(right)[#text(size: 9.2pt, fill: muted, style: "italic")[#dates]],
    )
  ]
  v(4pt)
  body
  v(11pt)
}

#let bullets(items) = {
  set list(marker: text(fill: muted)[▸], indent: 2pt, body-indent: 6pt, spacing: 6pt)
  for it in items [- #it]
}

#let skill-line(label, value) = {
  block(spacing: 6pt)[
    #text(weight: "semibold", size: 9.6pt)[#label] #text(size: 9.6pt)[#value]
  ]
}

#let project(name, year, desc, url: none) = {
  block(spacing: 7pt)[
    #text(weight: "semibold", size: 10pt)[
      #if url != none [#link(url)[#name]] else [#name]
    ] #if year != "" [#text(fill: muted, size: 9.2pt)[(#year)] ]— #text(size: 9.8pt)[#desc]
  ]
}
