// TU Graz Master's Thesis Template
// Refactored with base templates for title pages and affidavits


// Base template for title page
#let title-page(
  author: "",
  title: "",
  degree-type: "", // "Master's Thesis" vs "Masterarbeit"
  degree-text: "", // "to achieve..." vs "zur Erlangung..."
  degree-name: "", // "Master of Science" vs "Diplom-Ingenieur"
  degree-program: "", // "Master's degree programme:" vs "Masterstudium:"
  submit-text: "", // "submitted to" vs "eingereicht an der"
  university: "", // "Graz University of Technology" vs "Technische Universität Graz"
  supervisor: "",
  supervisor-label: "", // "Supervisor" vs "Betreuer"
  institute: "",
  institute-head: "",
  head-label: "", // "Head:" vs "Vorstand:"
  location: "",
  date: "",
  lang: "en",
  size-small: "13pt",
) = {
  page(
    header: none,
    footer: none,
    numbering: none,
  )[
    #set text(
      lang: lang,
      font: "Arial",
      size: 11pt,
    )
    #align(center)[
      #v(1fr)

      // Logo
      #image(
        read(
          "TU_Graz.svg",
          encoding: none,
        ),
        format: "svg",
        width: 4cm,
      )

      #v(2cm)

      #text(size: 14pt)[#author]

      #v(1.5cm)

      #text(size: 18pt, weight: "bold")[#title]

      #v(3cm)

      #text(size: 16pt, weight: "bold")[#degree-type]
      #linebreak()
      #text(size: 13pt)[#degree-text]
      #linebreak()
      #text(size: 14pt, weight: "bold")[#degree-name]
      #linebreak()
      #text(size: 13pt)[#degree-program]

      #v(2cm)

      #text(size: 14pt)[#submit-text]

      //#v(0.5cm)

      #text(size: 16pt, weight: "bold")[#university]

      #v(2cm)

      #text(size: 14pt)[
        #supervisor-label #linebreak()
        #supervisor
      ]

      #v(1cm)

      #text(size: 12pt)[
        #institute #linebreak()
        #head-label #institute-head
      ]

      #v(1fr)

      #text(size: 12pt)[#location, #date]
    ]
  ]
}

// Base template for affidavit page
#let affidavit-page(
  title: "",
  content: "",
  date-label: "",
  signature-label: "",
  lang: "en",
) = {
  page(
    numbering: "i",
    header: none,
  )[
    #set text(lang: lang)
    #align(center)[
      #text(size: 18pt, weight: "bold")[#title]
    ]

    #v(3cm)

    #content

    #v(3cm)

    #grid(
      columns: (1fr, 1fr),
      rows: 5pt,
      column-gutter: 2cm,
      //gutter: 10pt,
      line(length: 40%), line(length: 80%),
      date-label, signature-label,
    )
  ]
}

// Main thesis template function
#let thesis(
  // English content
  title-en: "Title of the Thesis",
  author: "Author Name, BSc",
  supervisor: "Supervisor Name",
  institute: "Institute Name",
  institute-head: "Head of Institute",
  location: "Location",
  date: "Month Year",
  // German content
  title-de: "German Title",
  degree-de: "Diplom-Ingenieur",
  degree-program-de: "Computer Science",
  // Abstracts
  abstract-en: "Abstract content in English",
  abstract-de: "Abstract content in German (Kurzfassung)",
  // Main content
  body,
) = {
  // Document setup
  set document(
    title: title-en,
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
    //font: "Times New Roman",
    size: 12pt,
    lang: "en",
  )

  set par(
    justify: true,
    leading: 0.65em,
  )

  // English Title Page
  title-page(
    author: author,
    title: title-en,
    degree-type: "Master's Thesis",
    degree-text: "to achieve the university degree of",
    degree-name: "Master of Science",
    degree-program: "Master's degree programme: Computer Science",
    submit-text: "submitted to",
    university: "Graz University of Technology",
    supervisor: supervisor,
    supervisor-label: "Supervisor",
    institute: institute,
    institute-head: institute-head,
    head-label: "Head: ",
    location: location,
    date: date,
    lang: "en",
  )

  // Blank page
  page(numbering: none)[]

  // German Title Page
  title-page(
    author: author,
    title: title-de,
    degree-type: "Masterarbeit",
    degree-text: "zur Erlangung des akademischen Grades eines",
    degree-name: degree-de,
    degree-program: "Masterstudium: " + degree-program-de,
    submit-text: "eingereicht an der",
    university: "Technische Universität Graz",
    supervisor: supervisor,
    supervisor-label: "Betreuer",
    institute: institute,
    institute-head: institute-head,
    head-label: "Vorstand: ",
    location: location,
    date: date,
    lang: "de",
  )

  // Blank pages
  page(numbering: none)[]

  counter(page).update(1)
  set page(numbering: "i")

  // English Affidavit
  affidavit-page(
    title: "Affidavit",
    content: [I declare that I have authored this thesis independently, that I have not used other than the declared sources/resources, and that I have explicitly indicated all material which has been quoted either literally or by content from the sources used. The text document uploaded to tugrazonline is identical to the present master's thesis.],
    date-label: "Date",
    signature-label: "Signature",
    lang: "en",
  )


  // Blank page
  // page()[]

  // German Affidavit
  affidavit-page(
    title: "Eidesstattliche Erklärung",
    content: [Ich erkläre an Eides statt, dass ich die vorliegende Arbeit selbstständig verfasst, andere als die angegebenen Quellen/Hilfsmittel nicht benutzt, und die den benutzten Quellen wörtlich und inhaltlich entnommenen Stellen als solche kenntlich gemacht habe. Das in tugrazonline hochgeladene Textdokument ist mit der vorliegenden Masterarbeit identisch.],
    date-label: "Datum",
    signature-label: "Unterschrift",
    lang: "de",
  )

  // Blank page
  // page()[]


  if abstract-en != none {
    // Abstract
    page()[
      #align(center)[
        #text(size: 16pt, weight: "bold")[Abstract]
      ]

      #v(1cm)

      #abstract-en
    ]

    // Blank page
    // page()[]
  }

  if abstract-de != none {
    // German Abstract (Kurzfassung)
    page()[
      #set text(lang: "de")
      #align(center)[
        #text(size: 16pt, weight: "bold")[Kurzfassung]
      ]

      #v(1cm)

      #abstract-de
    ]

    // Blank page
    page()[]
  }

  set cite(style: "alphanumeric")
  // Table of Contents
  set heading(supplement: "Abschnitt")
  page()[
    #align(center)[
      #text(size: 16pt, weight: "bold")[Inhaltsverzeichnis]
    ]

    #v(1cm)

    #outline(
      title: none,
      indent: auto,
      depth: 3,
    )
  ]

  show figure.where(kind: image): set figure(supplement: "Abbildung")
  show figure.where(kind: table): set figure(supplement: "Tabelle")
  // Blank page
  // page()[]


  // Main content starts here with Arabic numbering
  set page(numbering: "1")
  counter(page).update(1)

  // Set up headers for main content
  set page(
    header: context {
      let page-num = counter(page).get().first()
      if page-num > 0 {
        let current-page = here().page()
        let headings = query(heading.where(level: 1))

        let page-headings = headings.filter(h => h.location().page() <= current-page)

        if page-headings.len() > 0 [
          #align(center)[#page-headings.last().body]
        ] else [
          // Fallback if no headings found
          //#align(center)[Document Title]
        ]
        line(length: 100%, stroke: 0.5pt)
      }
    },
  )

  // Chapter formatting
  set heading(numbering: "1.1")

  show heading.where(level: 1): it => {
    pagebreak(weak: true)
    v(2cm)
    text(size: 25pt, weight: "bold")[
      #counter(heading).display() #it.body
    ]
    v(1cm)
  }

  show heading.where(level: 2): it => {
    v(1cm)
    text(size: 18pt, weight: "bold")[
      #counter(heading).display() #it.body
    ]
    v(0.5cm)
  }

  show heading.where(level: 3): it => {
    v(0.8cm)
    text(size: 16pt, weight: "bold")[
      #counter(heading).display() #it.body
    ]
    v(0.3cm)
  }

  // Main body content
  body


  set page(
    header: none,
  )
  [
    = Verzeichnisse
    == Quellenverzeichnis
  ]
  bibliography(
    "bibliography.bib",
    title: none,
    full: false,
    // style: "chicago-notes",
  )


  // List of Figures
  page()[
    // #align(center)[
    //   #text(size: 16pt, weight: "bold")[Abbildungsverzeichnis]
    // ]

    // #v(1cm)
    == Abbildungsverzeichnis
    #outline(
      title: none,
      target: figure.where(kind: image),
    )
  ]

  // Blank page
  // page()[]

  // List of Tables
  page()[
    // #align(center)[
    //   #text(size: 16pt, weight: "bold")[Tabellenverzeichnis]
    // ]

    // #v(1cm)
    == Tabellenverzeichnis
    #outline(
      title: none,
      target: figure.where(kind: table),
    )
  ]

  // Blank page
  // page()[]


  let appendix = [{{appendix}}]

  if appendix != none {
    // Appendix
    pagebreak()


    set heading(numbering: "A.1")
    counter(heading).update(0)

    // show heading.where(level: 1): it => {
    //   pagebreak(weak: true)
    //   v(2cm)
    //   text(size: 20pt, weight: "bold")[
    //     #counter(heading).display() #it.body
    //   ]
    //   v(1cm)
    // }
    [= Appendix]
    appendix
  }
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
  abstract-en: "{{abstract-en}}",
  abstract-de: "{{abstract-de}}",
)[
  // Main thesis content
  {{body}}

]



