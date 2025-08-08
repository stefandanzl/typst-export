#import "preamble.typ": *

#let tugraz-template(
  title: "Document Title",
  author: "Author Name", 
  title-german: "German Title",
  abstract-content: [],
  body-content: [],
  appendix-content: [],
  ..args
) = {
  
// Document setup using variables
set document(title: title, author: author)
set page(paper: "a4", margin: 1.5in, numbering: "1", number-align: center)
set text(font: "Libertinus Serif", size: 12pt, lang: "en")
set par(justify: true, leading: 0.65em, first-line-indent: 2em)
set heading(numbering: "1.1.1.1.")
show heading: it => { set text(fill: rgb(30, 103, 182), weight: "bold"); it; v(0.5em) }

// Title pages with variables
page(margin: 1.5in, numbering: none)[
  #set align(center)
  #set text(font: "Liberation Sans")
  #image("TU_Graz.svg", width: 30mm)
  #v(3fr)
  #text(size: 14pt)[#author]
  #v(3fr) 
  #text(size: 18pt, weight: "bold")[#title]
  #v(3fr)
  #text(size: 14pt, weight: "bold")[Master's Thesis]
  #v(6fr)
  Graz, 2024
]

// German title page
page(margin: 1.5in, numbering: none)[
  #set align(center)
  #set text(font: "Liberation Sans")
  #image("TU_Graz.svg", width: 30mm)
  #v(3fr)
  #text(size: 14pt)[#author]
  #v(3fr)
  #text(size: 18pt, weight: "bold")[#title-german]
  #v(3fr)
  #text(size: 14pt, weight: "bold")[Masterarbeit]
  #v(6fr)
  Graz, 2024
]

// Declaration
page(numbering: none)[
  #heading(level: 1, numbering: none)[STATUTORY DECLARATION]
  #v(2em)
  I declare that I have authored this thesis independently...
  #v(4em)
  #grid(columns: (1fr, 1fr), gutter: 2em, "", align(center)[#line(length: 4cm) \ #author \ Graz, 2024])
]

// Abstract
if abstract-content != [] {
  page(numbering: none)[
    #heading(level: 1, numbering: none)[Abstract]
    #abstract-content
  ]
  pagebreak()
}

// TOC
outline(title: [Table of Contents], depth: 3, indent: true)
pagebreak()

// Reset numbering
set page(numbering: "1")
counter(page).update(1)

// Main content
body-content

// Appendix
if appendix-content != [] {
  pagebreak()
  heading(level: 1, numbering: none)[Appendix]
  appendix-content
}

}
