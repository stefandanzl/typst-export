#import "preamble.typ": *

// ========================================================================
// TU Graz CODIS Typst Template Main Function
// ========================================================================

#let tugraz-template(
  // Required parameters
  title: "Document Title",
  author: "Author Name",
  
  // Optional metadata
  title-german: "German Title",
  subject: "Subject",
  keywords: "keyword1, keyword2, keyword3",
  
  // Academic information
  work-title: "Master's Thesis",
  work-title-german: "Masterarbeit", 
  degree: "Master of Science",
  degree-german: "Diplom-Ingenieur",
  study: "Computer Science",
  
  // University details
  university: "Graz University of Technology",
  university-german: "Technische Universität Graz",
  institute: "Institute of Human-Centred Computing",
  institute-head: "Head of Institute",
  supervisor: "Supervisor Name",
  co-supervisors: none,
  evaluator: "Prof. Evaluator Name",
  
  // Personal information
  author-titles: "BSc",
  home-street: "Street Address",
  home-town: "City",
  home-postal: "Postal Code",
  submission-month: "Month",
  submission-year: "Year",
  
  // Layout options
  paper-size: "a4",
  language: "en",
  font-size: 12pt,
  line-spacing: 1.0,
  
  // Colors
  disposition-color: rgb(30, 103, 182),
  
  // Content
  abstract-content: [],
  body-content: [],
  appendix-content: [],
  bibliography-file: "bibliography.bib",
  
  // Page options
  include-german-title: true,
  include-declaration: true,
  include-abstract: true,
  include-toc: true,
  include-figures: true,
  include-tables: true,
) = {
  
  // Derived variables
  let author-with-titles = if author-titles != none {
    author + ", " + author-titles
  } else {
    author
  }
  
  let degree-programme = "Master's degree programme: " + study
  let degree-programme-german = "Masterstudium: " + study
  let submission-town = home-town
  
  // ========================================================================
  // Document Setup
  // ========================================================================
  
  set document(
    title: title,
    author: author,
    keywords: keywords.split(", "),
  )

  set page(
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

  set text(
    font: "Libertinus Serif",
    size: font-size,
    lang: language,
  )

  set par(
    justify: true,
    leading: line-spacing * 0.65em,
    first-line-indent: 2em,
  )

  set heading(
    numbering: "1.1.1.1.",
  )

  // Style headings with TU Graz colors
  show heading: it => {
    set text(fill: disposition-color, weight: "bold")
    it
    v(0.5em)
  }

  // ========================================================================
  // Helper Functions
  // ========================================================================

  // Function to create the TU Graz title page
  let tugraz-title-page() = {
    page(
      margin: (top: 1.5in, bottom: 1.5in, left: 1.5in, right: 1.5in),
      numbering: none,
    )[
      #set align(center)
      #set text(font: "Liberation Sans")
      
      // TU Graz Logo
      #image("TU_Graz.svg", width: 30mm)
      
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
      
      #if co-supervisors != none [
        #v(0.5fr)
        Co-supervisors
        #v(0.25fr)
        #co-supervisors
      ]
      
      #v(1fr)
      
      #institute \
      Head: #institute-head
      
      #v(3fr)
      
      #submission-town, #submission-month #submission-year
    ]
  }

  // Function to create German title page
  let tugraz-title-page-german() = {
    page(
      margin: (top: 1.5in, bottom: 1.5in, left: 1.5in, right: 1.5in),
      numbering: none,
    )[
      #set align(center)
      #set text(font: "Liberation Sans")
      
      // TU Graz Logo
      #image("TU_Graz.svg", width: 30mm)
      
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
      
      #if co-supervisors != none [
        #v(0.5fr)
        Mitbetreuer
        #v(0.25fr)
        #co-supervisors
      ]
      
      #v(1fr)
      
      #institute \
      Institutsleiter: #institute-head
      
      #v(3fr)
      
      #submission-town, #submission-month #submission-year
    ]
  }

  // Function to create declaration page
  let tugraz-declaration() = {
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

  // ========================================================================
  // Document Content Generation
  // ========================================================================

  // Title pages
  tugraz-title-page()
  
  if include-german-title {
    tugraz-title-page-german()
  }

  // Declaration
  if include-declaration {
    tugraz-declaration()
  }

  // Abstract
  if include-abstract and abstract-content != [] {
    page(numbering: none)[
      #heading(level: 1, numbering: none)[Abstract] <abstract>
      
      #abstract-content
    ]
    pagebreak()
  }

  // Table of Contents
  if include-toc {
    outline(
      title: [Table of Contents],
      depth: 3,
      indent: true,
    )
    pagebreak()
  }

  // List of Figures
  if include-figures {
    outline(
      title: [List of Figures],
      target: figure.where(kind: image),
    )
    pagebreak()
  }

  // List of Tables  
  if include-tables {
    outline(
      title: [List of Tables],
      target: figure.where(kind: table),
    )
    pagebreak()
  }

  // Reset page numbering for main content
  set page(numbering: "1")
  counter(page).update(1)

  // Main Content
  body-content

  // Bibliography
  if bibliography-file != none {
    pagebreak()
    bibliography(bibliography-file, title: "Bibliography", style: "institute-of-electrical-and-electronics-engineers")
  }

  // Appendix
  if appendix-content != [] {
    pagebreak()
    heading(level: 1, numbering: none)[Appendix]
    appendix-content
  }
}
