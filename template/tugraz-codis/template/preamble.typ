// ========================================================================
// TU Graz CODIS Typst Template - Preamble
// ========================================================================
// 
// Converted from LaTeX template by Karl Voit and Stefan Kroboth
// This file contains common styling and utility functions
//

// ========================================================================
// Typography and Styling Functions
// ========================================================================

// TU Graz corporate colors
#let tugraz-blue = rgb(30, 103, 182)
#let tugraz-black = rgb(0, 0, 0)
#let tugraz-gray = rgb(128, 128, 128)

// Custom text styles
#let tugraz-sans(body) = text(font: "Liberation Sans", body)
#let tugraz-serif(body) = text(font: "Linux Libertine", body)
#let tugraz-mono(body) = text(font: "Liberation Mono", body)

// ========================================================================
// Academic Environment Functions
// ========================================================================

// Counter for academic environments
#let theorem-counter = counter("theorem")
#let lemma-counter = counter("lemma")
#let corollary-counter = counter("corollary")
#let proposition-counter = counter("proposition")
#let definition-counter = counter("definition")
#let example-counter = counter("example")
#let remark-counter = counter("remark")

// Generic academic environment function
#let academic-env(
  title: "Environment",
  counter: theorem-counter,
  color: tugraz-blue,
  body
) = {
  counter.step()
  block(
    fill: color.lighten(90%),
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
#let theorem(body) = academic-env(title: "Theorem", counter: theorem-counter, body)
#let lemma(body) = academic-env(title: "Lemma", counter: lemma-counter, body)
#let corollary(body) = academic-env(title: "Corollary", counter: corollary-counter, body)
#let proposition(body) = academic-env(title: "Proposition", counter: proposition-counter, body)
#let definition(body) = academic-env(title: "Definition", counter: definition-counter, color: tugraz-blue, body)
#let example(body) = academic-env(title: "Example", counter: example-counter, color: tugraz-gray, body)
#let remark(body) = academic-env(title: "Remark", counter: remark-counter, color: tugraz-gray, body)

// Proof environment
#let proof(body) = [
  *Proof.* #body #h(1fr) $square$
]

// ========================================================================
// Figure and Caption Functions
// ========================================================================

// Enhanced figure function with TU Graz styling
#let tugraz-figure(
  content,
  caption: none,
  label: none,
  width: auto,
  placement: none
) = {
  figure(
    content,
    caption: caption,
    placement: placement,
    kind: image,
  ) <label>
}

// Enhanced table function
#let tugraz-table(
  content,
  caption: none,
  label: none,
  columns: auto,
  stroke: 0.5pt,
) = {
  figure(
    table(
      columns: columns,
      stroke: stroke,
      fill: (x, y) => if y == 0 { tugraz-blue.lighten(90%) },
      ..content
    ),
    caption: caption,
    kind: table,
  )
}

// ========================================================================
// Code Listings with Syntax Highlighting
// ========================================================================

#let code-block(
  content,
  language: none,
  caption: none,
  label: none,
  line-numbers: false
) = {
  let code-content = if line-numbers {
    // Simple line numbering implementation
    let lines = content.split("\n")
    let numbered-lines = ()
    for (i, line) in lines.enumerate() {
      numbered-lines.push([#text(fill: tugraz-gray, size: 0.8em)[#(i + 1)] #h(1em) #line])
    }
    numbered-lines.join([\ ])
  } else {
    content
  }
  
  block(
    fill: rgb("#f8f8f8"),
    stroke: 1pt + rgb("#e8e8e8"),
    inset: 8pt,
    radius: 4pt,
    width: 100%,
    [
      #if language != none [
        #text(size: 0.8em, fill: tugraz-gray, weight: "bold")[#language]
        #line(length: 100%, stroke: 0.5pt + tugraz-gray)
      ]
      #tugraz-mono(code-content)
    ]
  )
  
  if caption != none {
    [*Code #counter(figure).display():* #caption <label>]
    counter(figure).step()
  }
}

// ========================================================================
// Citation and Reference Helpers
// ========================================================================

// Enhanced citation function that works with the bibliography
#let cite-enhanced(key, supplement: none, form: "normal") = {
  if supplement != none {
    cite(key, supplement: supplement, form: form)
  } else {
    cite(key, form: form)
  }
}

// Cross-reference helper
#let ref-enhanced(label, supplement: none) = {
  if supplement != none {
    ref(label, supplement: supplement)
  } else {
    ref(label)
  }
}

// ========================================================================
// Page Layout Helpers
// ========================================================================

// Chapter start page function
#let chapter-page(title, numbering: true) = {
  pagebreak()
  if numbering {
    heading(level: 1)[#title]
  } else {
    heading(level: 1, numbering: none)[#title]
  }
}

// Section break with optional page break
#let section-break(page-break: false) = {
  if page-break {
    pagebreak()
  } else {
    v(2em)
  }
}

// ========================================================================
// Utility Functions
// ========================================================================

// Acronym styling
#let acronym(text) = smallcaps(text)

// Emphasis variants
#let tugraz-emph(body) = text(fill: tugraz-blue, style: "italic", body)
#let tugraz-strong(body) = text(fill: tugraz-blue, weight: "bold", body)

// URL styling
#let tugraz-url(url) = link(url)[#text(fill: tugraz-blue, font: "Liberation Mono")[#url]]

// Math environments for complex equations
#let equation-block(content, label: none, numbered: true) = {
  if numbered {
    math.equation(block: true, numbering: "(1)", content) <label>
  } else {
    math.equation(block: true, numbering: none, content)
  }
}

// Aligned equations
#let align-block(content, label: none) = {
  math.equation(block: true, numbering: "(1)", 
    align(content)
  ) <label>
}
