// ========================================================================
// Typst Template Example for Obsidian LaTeX Exporter
// ========================================================================
//
// This is an example template showing how to use Typst with the exporter.
// Copy this file to your vault and modify as needed.
//
// For TU Graz users: Use tugraz-codis/tugraz-codis.typ instead
//

#import "preamble.typ": *

// ========================================================================
// Document Configuration
// ========================================================================

#set document(title: "$title$", author: "$author$")
#set page(
  paper: "a4",
  margin: (top: 2.5cm, bottom: 2.5cm, left: 2.5cm, right: 2.5cm),
  numbering: "1",
  number-align: center,
)

#set text(
  font: "Linux Libertine",
  size: 12pt,
  lang: "en",
)

#set par(justify: true, first-line-indent: 2em)
#set heading(numbering: "1.1.1.1.")

// Customize heading appearance
#show heading: it => {
  set text(fill: rgb(0, 102, 204))  // Blue headings
  it
  v(0.5em)
}

// ========================================================================
// Title Page
// ========================================================================

#align(center)[
  #v(2fr)
  
  // Main title
  #text(24pt, weight: "bold")[$title$]
  
  #v(1fr)
  
  // Subtitle (if needed)
  // #text(16pt)[$subtitle$]
  // #v(0.5fr)
  
  // Author
  #text(16pt)[$author$]
  
  #v(1fr)
  
  // Institution (customize as needed)
  #text(14pt)[
    Your Institution \
    Department/Faculty \
    Academic Year 2024/2025
  ]
  
  #v(1fr)
  
  // Date
  #datetime.today().display("[month repr:long] [day], [year]")
  
  #v(2fr)
]

#pagebreak()

// ========================================================================
// Front Matter
// ========================================================================

// Abstract (if provided)
#if "$abstract$".len() > 0 [
  #heading(level: 1, numbering: none)[Abstract]
  $abstract$
  #pagebreak()
]

// Table of Contents
#outline(title: [Table of Contents], depth: 3, indent: true)
#pagebreak()

// List of Figures (will only appear if you have figures)
#outline(title: [List of Figures], target: figure.where(kind: image))

// List of Tables (will only appear if you have tables)
#outline(title: [List of Tables], target: figure.where(kind: table))

#pagebreak()

// ========================================================================
// Main Content
// ========================================================================

// Your main document content goes here
// This placeholder will be replaced with your Obsidian note content
$body$

// ========================================================================
// Custom Sections (from your note headers)
// ========================================================================

// Additional sections like "Conclusion", "Future Work", etc.
$customSections$

// ========================================================================
// Bibliography
// ========================================================================

#pagebreak()
#bibliography("bibliography.bib", title: "References", style: "ieee")

// ========================================================================
// Appendices
// ========================================================================

#if "$appendix$".len() > 0 [
  #pagebreak()
  #heading(level: 1, numbering: none)[Appendix]
  $appendix$
]

// ========================================================================
// Usage Notes
// ========================================================================

/*
USAGE INSTRUCTIONS:

1. Copy this file to your Obsidian vault
2. Set the "Typst template file" path in the plugin settings to point to this file
3. Create a preamble.typ file with your custom functions (see template/default-preamble.typ)
4. Export your notes using the "Typst" format

MATH EXAMPLES:
- Inline math: $E = mc^2$
- Display math: $$ \sum_{i=1}^n x_i = 0 $$

FIGURE EXAMPLES:
- Images: ![[image.png|Caption text]]
- Use the enhanced-figure() function from preamble for more control

TABLE EXAMPLES:
- Standard markdown tables work
- Use enhanced-table() function for custom styling

THEOREM ENVIRONMENTS:
- Use the functions from preamble.typ: theorem(), lemma(), definition(), etc.

CROSS-REFERENCES:
- Use @label syntax for citations
- Use <label> syntax to create labels, @label to reference them

CUSTOMIZATION:
- Modify colors, fonts, and spacing in the configuration section above
- Add custom functions to your preamble.typ file
- Adjust page layout, margins, and numbering as needed
*/
