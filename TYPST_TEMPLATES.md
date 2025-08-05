# Typst Templates for Obsidian LaTeX Exporter

This document explains how to use the Typst export functionality and templates.

## Quick Start

1. **Enable Typst Export**: In the plugin settings, change "Export format" from "LaTeX" to "Typst"
2. **Choose a Template**: Use the default template or copy one of the provided templates to your vault
3. **Export**: Use any of the export commands - your notes will be converted to `.typ` files

## Available Templates

### 1. Default Template (`template/default.typ`)
- Simple, clean academic template
- Suitable for papers, reports, and theses
- Includes title page, table of contents, and bibliography
- Copy to your vault and customize as needed

### 2. TU Graz CODIS Template (`template/tugraz-codis/tugraz-codis.typ`)
- Official TU Graz Corporate Design template
- Includes university logos and proper formatting
- German and English title pages
- Statutory declaration page
- Perfect for TU Graz theses and reports

### 3. Built-in Template
- Basic template used when no custom template is specified
- Good starting point for simple documents

## Setting Up Templates

### Option 1: Use Built-in Template
1. Leave "Typst template file" empty in settings
2. The plugin will use the built-in template

### Option 2: Use Custom Template
1. Copy `template/default.typ` or `template/tugraz-codis/tugraz-codis.typ` to your vault
2. In plugin settings, set "Typst template file" to the path of your copied template
3. Optionally copy the corresponding `preamble.typ` file for enhanced functionality

## Template Structure

All templates use placeholders that are replaced with your content:
- `$title$` - Document title from YAML frontmatter
- `$author$` - Author from YAML frontmatter  
- `$abstract$` - Content from a top-level "Abstract" section
- `$body$` - Main document content
- `$appendix$` - Content from a top-level "Appendix" section

## Enhanced Features

### Academic Environments
When using a preamble file, you get access to:
- `theorem()` - Numbered theorem boxes
- `lemma()` - Numbered lemma boxes  
- `definition()` - Numbered definition boxes
- `example()` - Numbered example boxes
- `remark()` - Numbered remark boxes
- `proof()` - Proof environment with QED symbol

### Code Blocks
- Syntax highlighting support
- Language labels
- Optional captions
- Clean formatting

### Figures and Tables
- Automatic numbering
- Caption support
- Cross-referencing
- Consistent styling

## File Extensions and Naming

When exporting to Typst:
- Main file: `mainmd.typ` (instead of `mainmd.tex`)
- Preamble: `preamble.typ` (instead of `preamble.sty`)
- Header: `header.typ` (instead of `header.tex`)
- Bibliography: `bibliography.bib` (same as LaTeX)

## Converting from LaTeX

If you have existing LaTeX templates, here are the main differences:

| LaTeX | Typst |
|-------|-------|
| `\section{Title}` | `= Title` or `#heading[Title]` |
| `\textbf{bold}` | `*bold*` |
| `\textit{italic}` | `_italic_` |
| `\cite{key}` | `@key` |
| `\ref{label}` | `@label` |
| `\label{name}` | `<name>` |
| `\begin{theorem}...\end{theorem}` | `#theorem[...]` |
| `$$math$$` | `$ math $` |
| `\includegraphics{file}` | `#image("file")` |

## TU Graz Specific Features

The TU Graz template includes:
- Official TU Graz logo placement
- Correct corporate design colors
- German and English title pages
- Statutory declaration
- Institute and supervisor information
- Proper academic formatting

## Troubleshooting

### Template Not Found
- Ensure the template path in settings is correct
- Use forward slashes (`/`) even on Windows
- Check that the file exists in your vault

### Missing Preamble
- If using enhanced features, ensure `preamble.typ` exists
- Copy from `template/default-preamble.typ` or the TU Graz version

### Compilation Errors
- Check that Typst syntax is correct
- Ensure all required files (bibliography, images) exist
- Verify template placeholders are not malformed

## Advanced Customization

### Colors and Fonts
Modify the template configuration section:
```typst
#let primary-color = rgb(0, 102, 204)  // Your color
#set text(font: "Your Font", size: 12pt)
```

### Page Layout
```typst
#set page(
  paper: "a4",
  margin: (top: 2cm, bottom: 2cm, left: 2cm, right: 2cm),
)
```

### Custom Environments
Add to your preamble:
```typst
#let custom-env(body) = block(
  fill: rgb("#f0f0f0"),
  inset: 8pt,
  radius: 4pt,
  [*Custom:* #body]
)
```

## Further Resources

- [Typst Documentation](https://typst.app/docs/)
- [Typst Examples](https://github.com/typst/typst)
- [Academic Templates](https://github.com/typst/templates)

For questions or issues, refer to the main plugin documentation or GitHub repository.
