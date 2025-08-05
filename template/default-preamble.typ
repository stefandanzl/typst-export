// ========================================================================
// Default Typst Preamble for Obsidian LaTeX Exporter
// ========================================================================
//
// This file contains common styling and utility functions for academic documents
// You can customize this file to match your preferred styling
//

// ========================================================================
// Colors and Typography
// ========================================================================

#let primary-color = rgb(0, 102, 204)  // Blue
#let secondary-color = rgb(128, 128, 128)  // Gray
#let accent-color = rgb(204, 0, 0)  // Red

// Font shortcuts
#let sans(body) = text(font: "Liberation Sans", body)
#let serif(body) = text(font: "Linux Libertine", body)
#let mono(body) = text(font: "Liberation Mono", body)

// ========================================================================
// Academic Environment Functions
// ========================================================================

// Counters for academic environments
#let theorem-counter = counter("theorem")
#let lemma-counter = counter("lemma")
#let definition-counter = counter("definition")
#let example-counter = counter("example")
#let remark-counter = counter("remark")

// Generic theorem-like environment
#let theorem-env(title: "Theorem", counter: theorem-counter, color: primary-color, body) = {
  counter.step()
  block(
    fill: color.lighten(95%),
    stroke: (left: 3pt + color),
    inset: (left: 12pt, rest: 8pt),
    radius: (left: 0pt, rest: 4pt),
    width: 100%,
    [
      *#title #counter.display()* #h(0.5em) #body
    ]
  )
}

// Specific academic environments
#let theorem(body) = theorem-env(title: "Theorem", counter: theorem-counter, body)
#let lemma(body) = theorem-env(title: "Lemma", counter: lemma-counter, body)
#let definition(body) = theorem-env(title: "Definition", counter: definition-counter, color: primary-color, body)
#let example(body) = theorem-env(title: "Example", counter: example-counter, color: secondary-color, body)
#let remark(body) = theorem-env(title: "Remark", counter: remark-counter, color: secondary-color, body)

// Proof environment
#let proof(body) = [
  *Proof.* #body #h(1fr) $square$
]

// ========================================================================
// Enhanced Figures and Tables
// ========================================================================

// Enhanced figure with consistent styling
#let enhanced-figure(content, caption: none, label: none, width: auto) = {
  figure(
    content,
    caption: caption,
    kind: image,
  )
}

// Enhanced table with header styling
#let enhanced-table(content, caption: none, columns: auto, stroke: 0.5pt) = {
  figure(
    table(
      columns: columns,
      stroke: stroke,
      fill: (x, y) => if y == 0 { primary-color.lighten(90%) },
      ..content
    ),
    caption: caption,
    kind: table,
  )
}

// ========================================================================
// Code Blocks
// ========================================================================

#let code-block(content, language: none, caption: none) = {
  block(
    fill: rgb("#f8f8f8"),
    stroke: 1pt + rgb("#e0e0e0"),
    inset: 8pt,
    radius: 4pt,
    width: 100%,
    [
      #if language != none [
        #text(size: 0.8em, fill: secondary-color, weight: "bold")[#language]
        #line(length: 100%, stroke: 0.5pt + secondary-color)
      ]
      #mono(content)
    ]
  )
  
  if caption != none {
    v(0.5em)
    text(size: 0.9em, style: "italic")[Code: #caption]
  }
}

// ========================================================================
// Utility Functions
// ========================================================================

// Acronyms in small caps
#let acronym(text) = smallcaps(text)

// Colored emphasis
#let emph-color(body) = text(fill: primary-color, style: "italic", body)
#let strong-color(body) = text(fill: primary-color, weight: "bold", body)

// URL styling
#let url-style(url) = link(url)[#text(fill: primary-color, font: "Liberation Mono")[#url]]

// Equation environments
#let numbered-equation(content, label: none) = {
  math.equation(block: true, numbering: "(1)", content)
}

#let unnumbered-equation(content) = {
  math.equation(block: true, numbering: none, content)
}
