#import "tugraz-template.typ": tugraz_template

// Example usage that recreates the PDF exactly
#show: tugraz_template.with(
  // Basic information
  title: "An example of how to use this plugin.",
  author: "Stefan Danzl",
  author_titles: "BSc",
  
  // German title
  title_german: "German Thesis Title",
  
  // Academic details
  work_type: "Master's Thesis",
  work_type_german: "Masterarbeit",
  degree: "Master of Science", 
  degree_german: "Diplom-Ingenieur",
  degree_programme: "Master's degree programme: Computer Science",
  degree_programme_german: "Masterstudium: Computer Science",
  
  // University and supervision
  university: "Graz University of Technology",
  university_german: "Technische Universität Graz",
  institute: "Institute of Human-Centred Computing",
  institute_head: "Head of Institute",
  supervisor: "Supervisor",
  
  // Location and date
  location: "Home town",
  month: "month",
  year: "year",
  
  // Include options (matching PDF structure)
  include_german_title: true,
  include_german_affidavit: true,
  
  // Content sections
  abstract_content: [
    Was ist in Arbeit zu erwarten
  ],
  
  body_content: [
    = -AUFBAUKurzfassung Vorwort Inhaltsverzeichnis
    
    1. Einleitung
    2. Grundlagen
       a) Grundlegende Grundlagen  
    3. Versuchsaufbau und Messergebnisse
    4. Schlussfolgerungen Literaturverzeichnis Abbildungsverzeichnis Tabellenverzeichnis
    
    BK12 TSH22
    
    = Abstract
    
    Was ist in Arbeit zu erwarten
    
    = Vorwort
    
    Geschlechterdebatte, Danksagung
    
    = Inhaltsverzeichnis
    
    = Einleitung
    
    = Grundlagen
    
    == Verwendung
    
    === Markt
    
    === Marken
    
    == Bauweisen
    
    === 6 DoF Arm
    
    === Gantry
    
    === Delta
    
    == Antrieb
    
    === Elektrisch
    
    === Hydraulisch
    
    === Pneumatisch
    
    == Steuerung
    
    == Endeffektoren
    
    === Greifer
    
    Fingergreifer
    
    Klemmen
    
    === Montageplatten
    
    === Vakuumsauger
    
    === Schweißgeräte
    
    Punktschweißer
    
    MIG
    
    == Sicherheitsaspekte
    
    === Aufstellungsareale
    
    === Programmierung
    
    = Optimierungsmöglichkeiten
    
    == Bauform
    
    klassisches Vorgehen aus Maschinenbau + neue Algorithmen
    
    === Analytisch
    
    === FEM
    
    === FEA
    
    == Motion optimization
    
    === GA
    
    === Denavit-Hartenberg
    
    == Multiroboter Kooperation
    
    === Pick and Place
    
    === Zellenanwendungen
    
    = Schlussfolgerungen
    
    welche Bereiche sind in weiterer Recherche interessant?
    
    = Verzeichnisse
    
    == Literaturverzeichnis
    
    == Tabellenverzeichnis
    
    == Abbildungsverzeichnis
  ],
  
  appendix_content: [
    = Appendix
    
    Appendix content here...
  ]
)
