// ========================================================================
// TU Graz Typst Template - Recreated from PDF
// ========================================================================

#let default-config = (
  title: "Document Title",
  author: "Author Name",
  author_titles: "BSc",
  work_type: "Master's Thesis", 
  work_type_german: "Masterarbeit",
  degree: "Master of Science",
  degree_german: "Diplom-Ingenieur",
  degree_programme: "Master's degree programme: Computer Science",
  degree_programme_german: "Masterstudium: Computer Science",
  title_german: "German Title",
  university

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
  let english_title_page() = {
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
      #text(size: 14pt)[#author, #author_titles]
      
      #v(2.5cm)
      
      // Main title (larger, bold)
      #text(size: 18pt, weight: "bold")[#title]
      
      #v(3cm)
      
      // Work type
      #text(size: 14pt, weight: "bold")[#work_type]
      
      #v(1cm)
      
      to achieve the university degree of
      
      #v(0.5cm)
      
      #text(weight: "bold")[#degree]
      
      #v(0.5cm)
      
      #degree_programme
      
      #v(2cm)
      
      submitted to
      
      #v(1cm)
      
      #text(size: 14pt, weight: "bold")[#university]
      
      #v(2cm)
      
      Supervisor \
      #supervisor
      
      #v(1cm)
      
      #institute \
      Head: #institute_head
      
      #v(1fr)
      
      #location, #month #year
    ]
  }

  // Function for the German title page
  let german_title_page() = {
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
      #text(size: 14pt)[#author, #author_titles]
      
      #v(2.5cm)
      
      // German title (larger, bold)
      #text(size: 18pt, weight: "bold")[#title_german]
      
      #v(3cm)
      
      // Work type in German
      #text(size: 14pt, weight: "bold")[#work_type_german]
      
      #v(1cm)
      
      zur Erlangung des akademischen Grades eines
      
      #v(0.5cm)
      
      #text(weight: "bold")[#degree_german]
      
      #v(0.5cm)
      
      #degree_programme-german
      
      #v(2cm)
      
      eingereicht an der
      
      #v(1cm)
      
      #text(size: 14pt, weight: "bold")[#university_german]
      
      #v(2cm)
      
      Betreuer \
      #supervisor
      
      #v(1cm)
      
      #institute \
      Vorstand: #institute_head
      
      #v(1fr)
      
      #location, #month #year
    ]
  }

  // English Affidavit page
  let english_affidavit() = {
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
  let german_affidavit() = {
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
  english_title_page()
  
  if include_german_title {
    german_title_page()
  }

  // Blank pages to match PDF structure
  page(numbering: none)[]
  page(numbering: none)[]

  // Affidavit pages
  english_affidavit()
  
  if include-german_affidavit {
    page(numbering: none)[]
    german_affidavit()
  }

  // Blank page
  page(numbering: none)[]

  // Front matter with Roman numerals
  set page(numbering: "i")
  counter(page).update(10)

  // Abstract
  if abstract_content != [] {
    page[
      #align(center)[
        #text(size: 16pt, weight: "bold")[Abstract]
      ]
      
      #v(2cm)
      
      #abstract_content
      
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
  body_content

  // Appendix
  if appendix_content != [] {
    pagebreak()
    
    // Reset heading numbering for appendix
    set heading(numbering: none)
    
    heading(level: 1)[Appendix]
    
    appendix_content
  }
}
