// TU Graz Master Thesis Template

// === PAGE SETTINGS ===
#set page(
  paper: "a4",
  margin: (top: 3cm, bottom: 2.5cm, x: 3cm)
)

#set text(font: "Times New Roman", size: 11pt)

// === LOGO + TITLE PAGE ===
#let title_page(author, german_title, english_title, degree, program, institute, supervisor, location, date) = {
  align(center)[
    // TU Graz Logo
    #image("TU_Graz.svg", width: 6cm)
    #v(2cm)

    // Author
    text(size: 12pt, weight: "bold")[#author]
    #v(1cm)

    // English Title
    text(size: 14pt, weight: "bold")[#english_title]
    #v(0.5cm)
    text(size: 11pt)[Master’s Thesis \
    to achieve the university degree of]
    text(size: 12pt, weight: "bold")[#degree]
    text(size: 11pt)[Master’s degree programme: #program]
    #v(1cm)
    text(size: 11pt)[submitted to]
    text(size: 12pt, weight: "bold")[Graz University of Technology]
    #v(1cm)

    // Supervisor & Institute
    text(size: 11pt)[Supervisor] \
    text(size: 11pt)[#supervisor]
    text(size: 11pt)[#institute]
    text(size: 11pt)[Head: Head of Institute]
    #v(2cm)
    text(size: 11pt)[#location, #date]

    #pagebreak()

    // German title page
    text(size: 12pt, weight: "bold")[#author]
    #v(1cm)
    text(size: 14pt, weight: "bold")[#german_title]
    #v(0.5cm)
    text(size: 11pt)[Masterarbeit \
    zur Erlangung des akademischen Grades eines]
    text(size: 12pt, weight: "bold")[Diplom-Ingenieur]
    text(size: 11pt)[Masterstudium: #program]
    #v(1cm)
    text(size: 11pt)[eingereicht an der]
    text(size: 12pt, weight: "bold")[Technische Universität Graz]
    #v(1cm)
    text(size: 11pt)[Betreuer] \
    text(size: 11pt)[#supervisor]
    text(size: 11pt)[#institute]
    text(size: 11pt)[Vorstand: Head of Institute]
    #v(2cm)
    text(size: 11pt)[#location, #date]
    #pagebreak()
  ]
}

// === DECLARATION SECTION ===
#let declaration_page() = {
  heading(level: 1)[Affidavit]
  set align(justify)
  [
    I declare that I have authored this thesis independently, that I have not used
    other than the declared sources/resources, and that I have explicitly indicated all
    material which has been quoted either literally or by content from the sources used.
    The text document uploaded to tugrazonline is identical to the present master‘s thesis.
  ]
  v(2cm)
  [Date \hfill Signature]

  pagebreak()

  heading(level: 1)[Eidesstattliche Erklärung]
  set align(justify)
  [
    Ich erkläre an Eides statt, dass ich die vorliegende Arbeit selbstständig verfasst,
    andere als die angegebenen Quellen/Hilfsmittel nicht benutzt, und die den benutzten
    Quellen wörtlich und inhaltlich entnommenen Stellen als solche kenntlich gemacht
    habe. Das in tugrazonline hochgeladene Textdokument ist mit der vorliegenden
    Masterarbeit identisch.
  ]
  v(2cm)
  [Datum \hfill Unterschrift]

  pagebreak()
}

// === SAMPLE CONTENT ===
#title_page(
  "Stefan Danzl, BSc",
  "German Thesis Title",
  "An example of how to use this plugin.",
  "Master of Science",
  "Computer Science",
  "Institute of Human-Centred Computing",
  "Supervisor",
  "Home town",
  "August 2025"
)

#show: declaration_page

= Abstract

Was ist in Arbeit zu erwarten

= Vorwort

Danksagung, Kontext, Motivation

= Inhaltsverzeichnis

#table-of-contents(title: [Inhaltsverzeichnis])

= Einleitung

Hier beginnt deine Einleitung...

= Schlussfolgerungen

Was kann man weiter erforschen?

