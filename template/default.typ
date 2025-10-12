#set document(title: "{{title}}", author: "{{author}}")
#set page(
  paper: "a4",
  margin: (top: 2.5cm, bottom: 2.5cm, left: 2.5cm, right: 2.5cm),
  numbering: "1",
  number-align: center,
)

#set text(
  font: ("Times New Roman", "Liberation Serif"),
  size: 12pt,
  lang: "en",
)

#set par(justify: true, first-line-indent: 2em)
#set heading(numbering: "1.1.1.1.")

// Title Page
#align(center)[
  #v(2fr)

  #text(20pt, weight: "bold")[{{title}}]

  #v(1fr)

  #text(14pt)[{{author}}]

  #v(2fr)

  #datetime.today().display("[month repr:long] [day], [year]")

  #v(2fr)
]

#pagebreak()

// Abstract
#if "{{abstract}}".len() > 0 [
  #heading(level: 1, numbering: none)[Abstract]
  {{abstract}}
  #pagebreak()
]

// Table of Contents
#outline(title: [Table of Contents], depth: 3, indent: auto)
#pagebreak()

// List of Figures (if any figures exist)
#outline(title: [List of Figures], target: figure.where(kind: image))

// List of Tables (if any tables exist)
#outline(title: [List of Tables], target: figure.where(kind: table))

#pagebreak()

// Main Content
{{body}}

// Custom Sections
{{customSections}}

// Bibliography
#pagebreak()
#bibliography("bibliography.bib", title: "Bibliography", style: "ieee")

// Appendix
#if "{{appendix}}".len() > 0 [
  #pagebreak()
  #heading(level: 1, numbering: none)[Appendix]
  {{appendix}}
]
