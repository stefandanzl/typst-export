#import "tugraz-template1.typ": tugraz-template

// Example usage that recreates the PDF exactly
#show: tugraz-template.with(
  // Basic information
  title: "An example of how to use this plugin.",
  author: "Stefan Danzl",
  author-titles: "BSc",
  
  // German title
  title-german: "German Thesis Title",
  
  // Academic details
  work-type: "Master's Thesis",
  work-type-german: "Masterarbeit",
  degree: "Master of Science", 
  degree-german: "Diplom-Ingenieur",
  degree-programme: "Master's degree programme: Computer Science",
  degree-programme-german: "Masterstudium: Computer Science",
  
  // University and supervision
  university: "Graz University of Technology",
  university-german: "Technische Universität Graz",
  institute: "Institute of Human-Centred Computing",
  institute-head: "Head of Institute",
  supervisor: "Supervisor",
  
  // Location and date
  location: "Home town",
  month: "month",
  year: "year",
  
  // Include options (matching PDF structure)
  include-german-title: true,
  include-german-affidavit: true,
  
  // Content sections
  abstract-content: [
    Was ist in Arbeit zu erwarten
  ],
  
  body-content: [
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
  
  appendix-content: [
    = Appendix
    
    Appendix content here...
  ]
)
