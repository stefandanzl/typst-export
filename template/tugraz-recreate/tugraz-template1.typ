// ========================================================================
// TU Graz Typst Template - Recreated from PDF
// ========================================================================

#let tugraz-template(
  // Required parameters
  title: "Document Title",
  author: "Author Name",
  
  // Academic details
  author-titles: "BSc",
  work-type: "Master's Thesis", 
  work-type-german: "Masterarbeit",
  degree: "Master of Science",
  degree-german: "Diplom-Ingenieur",
  degree-programme: "Master's degree programme: Computer Science",
  degree-programme-german: "Masterstudium: Computer Science",
  
  // German versions
  title-german: "German Title",
  
  // University information
  university: "Graz University of Technology",
  university-german: "Technische Universität Graz",
  institute: "Institute of Human-Centred Computing",
  institute-head: "Head of Institute",
  supervisor: "Supervisor",
  
  // Location and date
  location: "Home town",
  month: "month",
  year: "year",
  
  // Content sections
  abstract-content: [],
  body-content: [],
  appendix-content: [],
  
  // Options
  include-german-title: true,
  include-german-affidavit: true,
  
) = {

  // ========================================================================
  // Document Setup
  // ========================================================================
  
  set document(
    title: title,
    author: author,
  )

  set page(
    paper: "a4",
    margin: (
      top: 2.5cm,
      bottom: 2.5cm,
      left: 2.5cm,
      right: 2.5cm,
    ),
  )

  set text(
    font: "Linux Libertine",
    size: 11pt,
    lang: "en",
  )

  set par(
    justify: true,
    leading: 0.65em,
  )

  // ========================================================================
  // Helper Functions
  // ========================================================================

  // Function for the English title page
  let english-title-page() = {
    page(
      margin: (top: 2.5cm, bottom: 2.5cm, left: 2.5cm, right: 2.5cm),
      numbering: none,
    )[
      #set align(center)
      #set text(font: "Arial")
      
      // Logo centered at top
      #v(1.5cm)
      #image("TU_Graz.svg", width: 4cm)
      
      #v(3cm)
      
      // Author with titles
      #text(size: 14pt)[#author, #author-titles]
      
      #v(2.5cm)
      
      // Main title (larger, bold)
      #text(size: 18pt, weight: "bold")[#title]
      
      #v(3cm)
      
      // Work type
      #text(size: 14pt, weight: "bold")[#work-type]
      
      #v(1cm)
      
      to achieve the university degree of
      
      #v(0.5cm)
      
      #text(weight: "bold")[#degree]
      
      #v(0.5cm)
      
      #degree-programme
      
      #v(2cm)
      
      submitted to
      
      #v(1cm)
      
      #text(size: 14pt, weight: "bold")[#university]
      
      #v(2cm)
      
      Supervisor \
      #supervisor
      
      #v(1cm)
      
      #institute \
      Head: #institute-head
      
      #v(1fr)
      
      #location, #month #year
    ]
  }

  // Function for the German title page
  let german-title-page() = {
    page(
      margin: (top: 2.5cm, bottom: 2.5cm, left: 2.5cm, right: 2.5cm),
      numbering: none,
    )[
      #set align(center)
      #set text(font: "Arial")
      
      // Logo centered at top
      #v(1.5cm)
      #image("TU_Graz.svg", width: 4cm)
      
      #v(3cm)
      
      // Author with titles
      #text(size: 14pt)[#author, #author-titles]
      
      #v(2.5cm)
      
      // German title (larger, bold)
      #text(size: 18pt, weight: "bold")[#title-german]
      
      #v(3cm)
      
      // Work type in German
      #text(size: 14pt, weight: "bold")[#work-type-german]
      
      #v(1cm)
      
      zur Erlangung des akademischen Grades eines
      
      #v(0.5cm)
      
      #text(weight: "bold")[#degree-german]
      
      #v(0.5cm)
      
      #degree-programme-german
      
      #v(2cm)
      
      eingereicht an der
      
      #v(1cm)
      
      #text(size: 14pt, weight: "bold")[#university-german]
      
      #v(2cm)
      
      Betreuer \
      #supervisor
      
      #v(1cm)
      
      #institute \
      Vorstand: #institute-head
      
      #v(1fr)
      
      #location, #month #year
    ]
  }

  // English Affidavit page
  let english-affidavit() = {
    page(
      numbering: none,
    )[
      #set text(font: "Linux Libertine")
      
      #v(2cm)
      
      #align(center)[
        #text(size: 16pt, weight: "bold")[Affidavit]
      ]
      
      #v(2cm)
      
      I declare that I have authored this thesis independently, that I have not used other than the declared sources/resources, and that I have explicitly indicated all material which has been quoted either literally or by content from the sources used. The text document uploaded to tugrazonline is identical to the present master's thesis.
      
      #v(4cm)
      
      #grid(
        columns: (1fr, 1fr),
        column-gutter: 2cm,
        "",
        align(center)[
          #line(length: 4cm) \
          Date #h(3cm) Signature
        ]
      )
      
      #v(1fr)
      
      #align(right)[
        #counter(page).display("vi")
      ]
    ]
  }

  // German Affidavit page
  let german-affidavit() = {
    page(
      numbering: none,
    )[
      #set text(font: "Linux Libertine")
      
      #v(2cm)
      
      #align(center)[
        #text(size: 16pt, weight: "bold")[Eidesstattliche Erklärung]
      ]
      
      #v(2cm)
      
      Ich erkläre an Eides statt, dass ich die vorliegende Arbeit selbstständig verfasst, andere als die angegebenen Quellen/Hilfsmittel nicht benutzt, und die den benutzten Quellen wörtlich und inhaltlich entnommenen Stellen als solche kenntlich gemacht habe. Das in tugrazonline hochgeladene Textdokument ist mit der vorliegenden Masterarbeit identisch.
      
      #v(4cm)
      
      #grid(
        columns: (1fr, 1fr),
        column-gutter: 2cm,
        "",
        align(center)[
          #line(length: 4cm) \
          Datum #h(3cm) Unterschrift
        ]
      )
      
      #v(1fr)
      
      #align(right)[
        #counter(page).display("viii")
      ]
    ]
  }

  // ========================================================================
  // Document Generation
  // ========================================================================

  // Title pages
  english-title-page()
  
  if include-german-title {
    german-title-page()
  }

  // Blank pages to match PDF structure
  page(numbering: none)[]
  page(numbering: none)[]

  // Affidavit pages
  english-affidavit()
  
  if include-german-affidavit {
    page(numbering: none)[]
    german-affidavit()
  }

  // Blank page
  page(numbering: none)[]

  // Front matter with Roman numerals
  set page(numbering: "i")
  counter(page).update(10)

  // Abstract
  if abstract-content != [] {
    page[
      #align(center)[
        #text(size: 16pt, weight: "bold")[Abstract]
      ]
      
      #v(2cm)
      
      #abstract-content
      
      #v(1fr)
      
      #align(right)[
        #counter(page).display()
      ]
    ]
    
    // Blank page
    page[]
  }

  // Table of Contents
  page[
    #align(center)[
      #text(size: 16pt, weight: "bold")[Contents]
    ]
    
    #v(2cm)
    
    #outline(
      depth: 3,
      indent: auto,
    )
    
    #v(1fr)
    
    #align(right)[
      #counter(page).display()
    ]
  ]
  
  // Blank page
  page[]

  // List of Figures
  page[
    #align(center)[
      #text(size: 16pt, weight: "bold")[List of Figures]
    ]
    
    #v(2cm)
    
    #outline(
      target: figure.where(kind: image),
    )
    
    #v(1fr)
    
    #align(right)[
      #counter(page).display()
    ]
  ]
  
  // Blank page
  page[]

  // List of Tables
  page[
    #align(center)[
      #text(size: 16pt, weight: "bold")[List of Tables]
    ]
    
    #v(2cm)
    
    #outline(
      target: figure.where(kind: table),
    )
    
    #v(1fr)
    
    #align(right)[
      #counter(page).display()
    ]
  ]
  
  // Blank page
  page[]

  // Main content - switch to Arabic numerals
  set page(numbering: "1")
  counter(page).update(1)

  // Chapter numbering and styling
  set heading(numbering: "1.1.1.1")
  show heading.where(level: 1): it => {
    pagebreak(weak: true)
    v(1cm)
    text(size: 18pt, weight: "bold")[#it]
    v(1cm)
  }

  show heading.where(level: 2): it => {
    v(0.5cm)
    text(size: 14pt, weight: "bold")[#it]
    v(0.3cm)
  }

  // Main content
  body-content

  // Appendix
  if appendix-content != [] {
    pagebreak()
    
    // Reset heading numbering for appendix
    set heading(numbering: none)
    
    heading(level: 1)[Appendix]
    
    appendix-content
  }
}
