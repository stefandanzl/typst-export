// TU Graz Master's Thesis Template
// Based on the provided PDF structure

#let thesis(
  // English title page
  title-en: "Title of the Thesis",
  author: "Author Name, BSc",
  supervisor: "Supervisor Name",
  institute: "Institute Name",
  institute-head: "Head of Institute",
  location: "Location",
  date: "Month Year",
  
  // German title page  
  title-de: "German Title",
  degree-de: "Diplom-Ingenieur",
  degree-program-de: "Computer Science",
  
  // Document metadata
  abstract-en: "Abstract content in English",
  abstract-de: "Abstract content in German (Kurzfassung)",
  
  // Main content
  body
) = {
  
  // Document setup
  set document(
    title: title-en,
    author: author
  )
  
  set page(
    paper: "a4",
    margin: (
      top: 2.5cm,
      bottom: 2.5cm,
      left: 2.5cm,
      right: 2.5cm
    )
  )
  
  set text(
    font: "Times New Roman",
    size: 12pt,
    lang: "en"
  )
  
  set par(
    justify: true,
    leading: 0.65em
  )
  
  // Helper function for TU Graz logo placeholder
  let tu-logo = rect(
    width: 3cm,
    height: 2cm,
    fill: red.lighten(60%),
    stroke: red
  )[
    #align(center + horizon)[
      #text(fill: white, weight: "bold")[TU Graz Logo]
    ]
  ]
  
  // English Title Page
  page(
    header: none,
    footer: none,
    numbering: none
  )[
    #align(center)[
      #v(1fr)
      
      // Logo placeholder
      #tu-logo
      
      #v(2cm)
      
      #text(size: 14pt)[#author]
      
      #v(2cm)
      
      #text(size: 18pt, weight: "bold")[#title-en]
      
      #v(3cm)
      
      #text(size: 16pt, weight: "bold")[Master's Thesis]
      #linebreak()
      #text(size: 14pt)[to achieve the university degree of]
      #linebreak()
      #text(size: 14pt, weight: "bold")[Master of Science]
      #linebreak()
      #text(size: 14pt)[Master's degree programme: Computer Science]
      
      #v(2cm)
      
      #text(size: 14pt)[submitted to]
      
      #v(0.5cm)
      
      #text(size: 16pt, weight: "bold")[Graz University of Technology]
      
      #v(2cm)
      
      #text(size: 14pt)[
        #supervisor #linebreak()
        Supervisor
      ]
      
      #v(1cm)
      
      #text(size: 12pt)[
        #institute #linebreak()
        Head: #institute-head
      ]
      
      #v(1fr)
      
      #text(size: 12pt)[#location, #date]
    ]
  ]
  
  // Blank page
  page(numbering: none)[]
  
  // German Title Page
  page(
    header: none,
    footer: none,
    numbering: none
  )[
    #set text(lang: "de")
    #align(center)[
      #v(1fr)
      
      // Logo placeholder
      #tu-logo
      
      #v(2cm)
      
      #text(size: 14pt)[#author]
      
      #v(2cm)
      
      #text(size: 18pt, weight: "bold")[#title-de]
      
      #v(3cm)
      
      #text(size: 16pt, weight: "bold")[Masterarbeit]
      #linebreak()
      #text(size: 14pt)[zur Erlangung des akademischen Grades eines]
      #linebreak()
      #text(size: 14pt, weight: "bold")[#degree-de]
      #linebreak()
      #text(size: 14pt)[Masterstudium: #degree-program-de]
      
      #v(2cm)
      
      #text(size: 14pt)[eingereicht an der]
      
      #v(0.5cm)
      
      #text(size: 16pt, weight: "bold")[Technische Universität Graz]
      
      #v(2cm)
      
      #text(size: 14pt)[
        Betreuer #linebreak()
        #supervisor
      ]
      
      #v(1cm)
      
      #text(size: 12pt)[
        #institute #linebreak()
        Vorstand: #institute-head
      ]
      
      #v(1fr)
      
      #text(size: 12pt)[#location, #date]
    ]
  ]
  
  // Blank pages
  page(numbering: none)[]
  page(numbering: none)[]
  
  // Affidavit (English)
  page(
    numbering: "i",
    header: none
  )[
    #align(center)[
      #text(size: 16pt, weight: "bold")[Affidavit]
    ]
    
    #v(2cm)
    
    I declare that I have authored this thesis independently, that I have not used other than the declared sources/resources, and that I have explicitly indicated all material which has been quoted either literally or by content from the sources used. The text document uploaded to tugrazonline is identical to the present master's thesis.
    
    #v(4cm)
    
    #grid(
      columns: (1fr, 1fr),
      column-gutter: 2cm,
      [Date], [Signature]
    )
    
    
  ]
  
  // Blank page
  page(numbering: "i")[]
  
  // Affidavit (German)
  page(numbering: "i")[
    #set text(lang: "de")
    #align(center)[
      #text(size: 16pt, weight: "bold")[Eidesstattliche Erklärung]
    ]
    
    #v(2cm)
    
    Ich erkläre an Eides statt, dass ich die vorliegende Arbeit selbstständig verfasst, andere als die angegebenen Quellen/Hilfsmittel nicht benutzt, und die den benutzten Quellen wörtlich und inhaltlich entnommenen Stellen als solche kenntlich gemacht habe. Das in tugrazonline hochgeladene Textdokument ist mit der vorliegenden Masterarbeit identisch.
    
    #v(4cm)
    
    #grid(
      columns: (1fr, 1fr),
      column-gutter: 2cm,
      [Datum], [Unterschrift]
    )
  ]
  
  // Blank page
  page(numbering: "i")[]
  
  // Abstract
  page(numbering: "i")[
    #align(center)[
      #text(size: 16pt, weight: "bold")[Abstract]
    ]
    
    #v(1cm)
    
    #abstract-en
  ]
  
  // Blank page
  page(numbering: "i")[]
  
  // German Abstract (Kurzfassung)
  page(numbering: "i")[
    #set text(lang: "de")
    #align(center)[
      #text(size: 16pt, weight: "bold")[Kurzfassung]
    ]
    
    #v(1cm)
    
    #abstract-de
  ]
  
  // Blank page
  page(numbering: "i")[]
  
  // Table of Contents
  page(numbering: "i")[
    #align(center)[
      #text(size: 16pt, weight: "bold")[Contents]
    ]
    
    #v(1cm)
    
    #outline(
      title: none,
      indent: auto,
      depth: 3
    )
  ]
  
  // Blank page
  page(numbering: "i")[]
  
  // List of Figures
  page(numbering: "i")[
    #align(center)[
      #text(size: 16pt, weight: "bold")[List of Figures]
    ]
    
    #v(1cm)
    
    #outline(
      title: none,
      target: figure.where(kind: image)
    )
  ]
  
  // Blank page
  page(numbering: "i")[]
  
  // List of Tables
  page(numbering: "i")[
    #align(center)[
      #text(size: 16pt, weight: "bold")[List of Tables]
    ]
    
    #v(1cm)
    
    #outline(
      title: none,
      target: figure.where(kind: table)
    )
  ]
  
  // Blank page
  page(numbering: "i")[]
  
  // Main content starts here with Arabic numbering
  set page(numbering: "1")
  counter(page).update(1)
  
  // Set up headers for main content
  set page(
    header: context {
      let page-num = counter(page).get().first()
      if page-num > 0 [
        #line(length: 100%, stroke: 0.5pt)
      ]
    }
  )
  
  // Chapter formatting
  set heading(numbering: "1.1")
  
  show heading.where(level: 1): it => {
    pagebreak(weak: true)
    v(2cm)
    text(size: 18pt, weight: "bold")[
      #counter(heading).display() #it.body
    ]
    v(1cm)
  }
  
  show heading.where(level: 2): it => {
    v(1cm)
    text(size: 16pt, weight: "bold")[
      #counter(heading).display() #it.body
    ]
    v(0.5cm)
  }
  
  show heading.where(level: 3): it => {
    v(0.8cm)
    text(size: 14pt, weight: "bold")[
      #counter(heading).display() #it.body
    ]
    v(0.3cm)
  }
  
  // Main body content
  body
  
  // Bibliography
  pagebreak()
  
  // Appendix
  show heading.where(level: 1): it => {
    pagebreak(weak: true)
    v(2cm)
    text(size: 18pt, weight: "bold")[
      #it.body
    ]
    v(1cm)
  }
  
  counter(heading).update(0)
  
  [
    = Appendix
    
    == Appendix A
    
    Additional content goes here.
  ]
}

// Example usage:
#thesis(
  title-en: "An Example of How to Use This Plugin",
  title-de: "German Thesis Title",
  author: "Stefan Danzl, BSc",
  supervisor: "Supervisor Name",
  institute: "Institute of Human-Centred Computing",
  institute-head: "Head of Institute",
  location: "Graz",
  date: "January 2024",
  abstract-en: "This is the abstract in English describing what the thesis contains and its main contributions.",
  abstract-de: "Dies ist die deutsche Zusammenfassung, die beschreibt, was in der Arbeit zu erwarten ist."
)[
  // Main thesis content
  = Introduction
  
  This is the introduction chapter of the thesis.
  
  = Literature Review
  
  This chapter covers the relevant literature and background.
  
  == Subsection
  
  This is a subsection within the literature review.
  
  === Sub-subsection
  
  This is a sub-subsection.
  
  = Methodology
  
  This chapter describes the methodology used in the research.
  
  = Results
  
  This chapter presents the results of the research.
  
  = Discussion
  
  This chapter discusses the implications of the results.
  
  = Conclusion
  
  This chapter concludes the thesis and suggests future work.
]