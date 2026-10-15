# nazmulhasan202.github.io

Personal website for Nazmul Hasan. Plain static HTML, CSS and vanilla JavaScript.
No frameworks, no build step, no dependencies.

## Files

| File | Purpose |
|---|---|
| `index.html` | Landing page: positioning, stats, four deep-dive work cards, experience, education with expandable coursework, filterable skills, certifications, honors, contact |
| `publications.html` | All six peer-reviewed papers with key results, links and one-click citation copy |
| `projects.html` | Fuller project catalog: research, self-driven and earlier work |
| `style.css` | All styling. Design tokens live in the `:root` block at the top |
| `site.js` | Scroll-spy nav, skills filter, copy-to-clipboard, back-to-top, print handling |
| `.nojekyll` | Tells GitHub Pages to serve the files as-is rather than running Jekyll |
| `.gitignore` | Keeps the local preview file out of the repo |

`_preview.html` is a generated single-file copy with the CSS and JS inlined, used
only for previewing the page inside Claude. It is gitignored and is not part of
the site. Regenerate it after edits if you want another preview.

## Interactive features

Everything degrades gracefully. With JavaScript disabled the page is still
complete and readable, and the disclosures still open, since they use the native
`<details>` element rather than scripted show/hide.

- **Coursework disclosures.** Each degree has a collapsed panel. The PhD opens a
  table of all 17 graded courses with grades; the B.Sc. opens the full
  term-by-term record with per-term GPAs and the BUET grading scale.
- **Work card disclosures.** Each headline project has a "how it was built"
  panel so a reader can stay at summary level or go deep, their choice.
- **Skills filter.** Typing highlights matching skills and dims groups with no
  match, with a live count announced to screen readers.
- **Citation copy.** Each publication copies a formatted citation to the
  clipboard, with a fallback for browsers that block the clipboard API.
- **Scroll-spy navigation.** The sticky header highlights the section in view.
- **Print stylesheet.** Printing or saving to PDF expands every disclosure first,
  hides the navigation and interactive controls, and avoids breaking sections
  across pages.
- **Deep links.** Linking to an anchor inside a collapsed panel opens it.

## Publishing to GitHub Pages

This repository is `nazmulhasan202/nazmulhasan202.github.io`, which GitHub serves at
https://nazmulhasan202.github.io. It deploys from branch `master`, folder `/ (root)`
(Settings, then Pages). The `.nojekyll` file makes GitHub serve the files as plain
HTML instead of running Jekyll.

To publish a change, commit and push to `master` (GitHub Desktop, or
`git add . && git commit -m "..." && git push`). The site updates within a minute or two.

The site replaced an unmodified copy of the academicpages Jekyll template. That
template remains in this repository's commit history.

## Editing

Colors, spacing and the text measure are CSS custom properties in `:root` at the
top of `style.css`. Changing `--accent` restyles every link, section marker,
metric and tag at once. `--measure` controls the reading width of body text and
`--page` the overall column.

## Still to add

- A photograph for the landing page
- Figures or screenshots for the four headline projects, especially the Western
  Digital planner dashboard and the QCRE defect detection output
- A resume PDF to link from the landing page
- Nothing outstanding on content; see the list above for images and the resume PDF
