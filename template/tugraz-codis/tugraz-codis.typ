#import "template/preamble.typ": *

// ========================================================================
// Document Configuration Variables
// ========================================================================

// Paper and layout settings
#let paper-size = "a4"
#let language = "en"  // "en" or "de"
#let font-size = 12pt
#let line-spacing = 1.0

// Author and document metadata
#let author = "$author$"
#let author-with-titles = author + ", BSc"  // include existing academic titles
#let title = "$title$"
#let title-german = "German Thesis Title"
#let subject = "SUBJECT"
#let keywords = "KEYWORDS"

// Work type and degree information
#let work-title = "Master's Thesis"
#let work-title-german = "Masterarbeit"
#let degree = "Master of Science"
#let degree-german = "Diplom-Ingenieur"
#let study = "Computer Science"
#let degree-programme = "Master's degree programme: " + study
#let degree-programme-german = "Masterstudium: " + study

// University and institute information
#let university = "Graz University of Technology"
#let university-german = "Technische Universität Graz"
#let institute = "Institute of Human-Centred Computing"
#let institute-head = "Head of Institute"
#let supervisor = "Supervisor"
#let co-supervisors = "Co-supervisor 1, Co-supervisor 2"
#let evaluator = "Prof. Some Genius"

// Personal information
#let home-street = "Street"
#let home-town = "Home town"
#let home-postal = "post"
#let submission-month = "month"
#let submission-year = "year"
#let submission-town = home-town

// Colors and styling
#let disposition-color = rgb(30, 103, 182)  // TU Graz blue
#let black-color = rgb(0, 0, 0)

// ========================================================================
// Document Setup
// ========================================================================

#set document(
  title: title,
  author: author,
  keywords: keywords.split(", "),
)

#set page(
  paper: paper-size,
  margin: (
    top: 1.5in,
    bottom: 1.5in,
    left: 1.5in,
    right: 1.5in,
  ),
  numbering: "1",
  number-align: center,
)

#set text(
  font: "Linux Libertine",
  size: font-size,
  lang: language,
)

#set par(
  justify: true,
  leading: line-spacing * 0.65em,
  first-line-indent: 2em,
)

#set heading(
  numbering: "1.1.1.1.",
)

// Style headings with TU Graz colors
#show heading: it => {
  set text(fill: disposition-color, weight: "bold")
  it
  v(0.5em)
}

// ========================================================================
// Custom Functions and Environments
// ========================================================================

// Function to create the TU Graz title page
#let tugraz-title-page() = {
  page(
    margin: (top: 1.5in, bottom: 1.5in, left: 1.5in, right: 1.5in),
    numbering: none,
  )[
    #set align(center)
    #set text(font: "Liberation Sans")
    
    // TU Graz Logo
    #image("figures/TU_Graz.svg", width: 30mm)
    
    #v(3fr)
    
    // Author with titles
    #text(size: 14pt)[#author-with-titles]
    
    #v(3fr)
    
    // Main title
    #text(size: 18pt, weight: "bold")[#title]
    
    #v(3fr)
    
    // Work type
    #text(size: 14pt, weight: "bold")[#work-title]
    
    #v(1fr)
    
    to achieve the university degree of
    
    #v(0.5fr)
    
    #degree
    
    #v(0.5fr)
    
    #degree-programme
    
    #v(3fr)
    
    submitted to
    
    #v(1fr)
    
    #text(size: 14pt, weight: "bold")[#university]
    
    #v(3fr)
    
    Supervisor
    
    #v(0.5fr)
    
    #supervisor
    
    #v(1fr)
    
    #institute \
    Head: #institute-head
    
    #v(3fr)
    
    #submission-town, #submission-month #submission-year
  ]
}

// Function to create German title page
#let tugraz-title-page-german() = {
  page(
    margin: (top: 1.5in, bottom: 1.5in, left: 1.5in, right: 1.5in),
    numbering: none,
  )[
    #set align(center)
    #set text(font: "Liberation Sans")
    
    // TU Graz Logo
    #image("figures/TU_Graz.svg", width: 30mm)
    
    #v(3fr)
    
    // Author with titles
    #text(size: 14pt)[#author-with-titles]
    
    #v(3fr)
    
    // German title
    #text(size: 18pt, weight: "bold")[#title-german]
    
    #v(3fr)
    
    // Work type in German
    #text(size: 14pt, weight: "bold")[#work-title-german]
    
    #v(1fr)
    
    zur Erlangung des akademischen Grades
    
    #v(0.5fr)
    
    #degree-german
    
    #v(0.5fr)
    
    #degree-programme-german
    
    #v(3fr)
    
    eingereicht an der
    
    #v(1fr)
    
    #text(size: 14pt, weight: "bold")[#university-german]
    
    #v(3fr)
    
    Betreuer
    
    #v(0.5fr)
    
    #supervisor
    
    #v(1fr)
    
    #institute \
    Institutsleiter: #institute-head
    
    #v(3fr)
    
    #submission-town, #submission-month #submission-year
  ]
}

// Function to create declaration page
#let tugraz-declaration() = {
  page(numbering: none)[
    #heading(level: 1, numbering: none)[STATUTORY DECLARATION]
    
    #v(2em)
    
    I declare that I have authored this thesis independently, that I have not used other than the declared sources/resources, and that I have explicitly indicated all material which has been quoted either literally or by content from the sources used. The text document uploaded to TUGRAZonline is identical to the present doctoral thesis.
    
    #v(4em)
    
    #grid(
      columns: (1fr, 1fr),
      gutter: 2em,
      "",
      align(center)[
        #line(length: 4cm) \
        #author \
        #submission-town, #submission-month #submission-year
      ]
    )
  ]
}

// Custom theorem environments
#let theorem = counter("theorem")
#let lemma = counter("lemma") 
#let definition = counter("definition")
#let example = counter("example")
#let remark = counter("remark")

#let theorem-box(title: "Theorem", counter: theorem, body) = {
  counter.step()
  block(
    fill: rgb("#f0f0f0"),
    inset: 8pt,
    radius: 4pt,
    width: 100%,
    [
      *#title #counter.display()* #body
    ]
  )
}

// ========================================================================
// Document Content
// ========================================================================

// Title pages
#tugraz-title-page()
#tugraz-title-page-german()

// Declaration
#tugraz-declaration()

// Abstract
#page(numbering: none)[
  #heading(level: 1, numbering: none)[Abstract] <abstract>
  
  $abstract$
]

#pagebreak()

// Table of Contents
#outline(
  title: [Table of Contents],
  depth: 3,
  indent: true,
)

#pagebreak()

// List of Figures
#outline(
  title: [List of Figures],
  target: figure.where(kind: image),
)

#pagebreak()

// List of Tables  
#outline(
  title: [List of Tables],
  target: figure.where(kind: table),
)

#pagebreak()

// Reset page numbering for main content
#set page(numbering: "1")
#counter(page).update(1)

// Main Content
$body$

// Bibliography
#pagebreak()
#bibliography("bibliography.bib", title: "Bibliography", style: "institute-of-electrical-and-electronics-engineers")

// Appendix
#pagebreak()
#heading(level: 1, numbering: none)[Appendix]
$appendix$
