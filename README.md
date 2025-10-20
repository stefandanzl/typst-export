# Typst Export Plugin for Obsidian

Write academic papers directly in Obsidian! Export an Obsidian note to a full-fledged Typst document, including embedded content, citations, cross-references, figures, tables, and more. All content visible in Obsidian will be included in the export.

## Features

-   **Seamless Academic Writing**: Write papers directly in Obsidian with real-time preview
-   **Smart Citation Support**: Multiple citation formats with automatic bibliography generation
-   **Cross-References**: Reference figures, tables, equations throughout your document
-   **Template System**: Flexible Typst templates with placeholder substitution
-   **Bibliography Integration**: Automatic bibliography generation via Bibliography Manager plugin
-   **Image & Media Support**: Automatic image copying and caption handling
-   **Mathematical Equations**: Full math support with automatic numbering
-   **Table Processing**: Smart table extraction with caption support

## Typst Template System

The plugin supports flexible Typst templates with placeholder substitution. All content from your document is made available to templates through placeholders.

### Template Variables

#### Document Metadata Variables

These variables are extracted from your main note's frontmatter you are calling the command <!TODO:Command name!> from:

| Variable                         | Source                 | Example                    |
| -------------------------------- | ---------------------- | -------------------------- |
| `{{title}}`                      | frontmatter `title`    | "A Comprehensive Study"    |
| `{{author}}`                     | frontmatter `author`   | "John Doe"                 |
| `{{date}}`                       | frontmatter `date`     | "2024-01-01"               |
| `{{abstract}}`                   | frontmatter `abstract` | Your abstract text         |
| `{{keywords}}`                   | frontmatter `keywords` | "typst, academic, writing" |
| **Any custom frontmatter field** | Your frontmatter       | `{{custom_field}}`         |

#### Content Section Variables

Variables generated from your document structure:

| Variable           | Content                  | Notes                                            |
| ------------------ | ------------------------ | ------------------------------------------------ |
| `{{body}}`         | Main document content    | Excludes abstract, appendix, and custom sections |
| `{{abstract}}`     | Abstract section content | From `# Abstract` heading or frontmatter         |
| `{{appendix}}`     | Appendix section content | From `# Appendix` heading                        |
| `{{bibliography}}` | Bibliography filename    | Path to generated bibliography file              |

#### Custom Section Variables

Any heading in your document becomes available as a template variable:

-   `{{introduction}}` → Content from `# Introduction` heading
-   `{{methodology}}` → Content from `# Methodology` heading
-   `{{results}}` → Content from `# Results` heading
-   `{{conclusion}}` → Content from `# Conclusion` heading
-   **And any other heading** you create

### Template Syntax

#### Typst Templates (`{{placeholder}}`)

Use `{{placeholder}}` syntax for Typst templates:

### Creating Custom Templates

1. Create a `.typ` file in your template folder
2. Use `{{placeholder}}` for any content you want to inject
3. Include all standard Typst imports and setup
4. Save and select in settings

#### Example Custom Template

```typst
#set document(
  title: "{{title}}",
  author: "{{author}}",
  date: datetime.today()
)

#set page(
  paper: "us-letter",
  margin: 1in,
  header: align(right + horizon)[{{title}}],
  footer: align(center + horizon)[#text(10pt)[Page #counter(page).display()]]
)

// Main content with custom sections
{{body}}

{{introduction}}  // Custom section
{{methodology}}   // Custom section
{{results}}       // Custom section

// Bibliography
#pagebreak()
#bibliography("{{bibliography}}", title: "References")
```

---

## Citation and Reference System

This plugin allows you to keep your academic sources as regular markdown files in your vault, where you can store notes, highlights, and annotations about each source. To use these markdown files as bibliographic sources in your papers, they must have a `citekey` frontmatter value - this citekey gets written into the resulting `.typ` file when exporting to Typst, enabling proper bibliography compilation.
For a successful compilation with the cli application `typst`, a bibliography file is required (See later chapter). Your sources' citekey values must then be identical to the citekeys that are appearing in your bibliography file in order to successfully compile to `pdf` or `html`.

### Best Methods for Citations (Ordered by Ease of Use)

#### 1. File Link Citations - Best for Obsidian Workflow

```markdown
[[Research Paper 2024.md]] # Direct link to source note
[[Age of Everything.md]] # Rendered as link in reading/editing mode
```

**Benefits:**

-   Renders as clickable links in Obsidian
-   Easy to navigate between your paper and sources
-   Automatically creates citation in Typst export

#### 2. Alias Citations - Clean Display with Links

```markdown
[[Research Paper 2024.md|@smith2024]] # Shows as "[@smith2024]" in "Live Preview" mode but links to file
[[Long Paper Title.md|@short2024]] # Clean citation with full link access
```

**Benefits:**

-   Short, clean citation display in reading/editing mode
-   Still links to the full source note
-   Aliases make citations more readable

### Source Note Setup

For both methods above, your source notes need this frontmatter:

```yaml
---
title: "Full Paper Title"
citekey: "smith2024" # Required - used in Typst compilation
aliases: ["@smith2024"] # Optional - for alias citations
year: 2024
author: "Smith, John"
---
```

-   `citekey`: **Required** - This gets embedded in the Typst .typ file for bibliography compilation
-   `aliases`: Optional - Only needed if you want to use alias citation format

### Bibliography Compilation

The citekeys in your Typst file need a corresponding bibliography file for PDF compilation:

-   **BibTeX format**: `.bib` files (most common)
-   **Hayagriva format**: `.yaml` files (modern Typst format)

The plugin can automatically generate these files if set up in Bibliography Manager API (see [Bibliography Setup](#bibliography-setup)).

### Chapter References

If you're including parts of your own work:

```markdown
# Importing content

![[methodology.md]] # Imports full content of methodology.md

# Referencing chapters without citekeys

[[methodology.md#Data Collection]] # Links to "Data Collection" section
[[results.md#Statistical Analysis]] # Links to specific analysis section
```

### External Source Management

If you use external reference managers (Zotero, Mendeley, etc.):

```markdown
@smith2024 # Simple citation
[@smith2024] # Parenthetical citation
[@smith2024, p. 42] # With page locator
```

**Important:** You must have a bibliography file (.bib or .yaml) that contains the `smith2024` entry.

### Advanced Citation Features (Enhanced Use)

For more control over citation formatting, you can use prefix and suffix text. While syntactically not as clean, these features allow for page numbers and specific citation styles:

```markdown
See @smith2024 for details # Prefix: "See "
[@smith2024, p. 42] # Suffix: ", p. 42"
According to @johnson2023, the results show # Prefix: "According to "
The method [@zhang2024, Algorithm 1] proves # Suffix: ", Algorithm 1"
```

**Multiple Citations:**

```markdown
@smith2024; @jones2023; @chen2024 # Multiple sources in one citation
```

### Label References vs Citations

**Be careful:** The `@` symbol is used for both citations AND labels.

#### Citations (Bibliography)

```markdown
@smith2024 # Links to bibliography entry
[@chen2024, p. 45] # Citation with page number
```

#### Labels (Cross-references)

```markdown
![[graph.png|Results]]<@fig:results> # Figure label

# Analysis {#sec:analysis} # Section label

$$E=mc^2$${#eq:einstein} # Equation label
```

#### Using Labels

```markdown
As shown in @fig:results, the analysis demonstrates...
See @sec:analysis for detailed methodology.
Equation @eq:einstein shows the relationship.
```

### Label Rules

-   Labels can be any text you choose: `@fig:arch`, `@table1`, `@results_diagram`
-   **Critical**: No two labels can be identical in your document
-   Labels work for: figures, tables, equations, sections
-   Labels create cross-references within your document (not bibliography entries)

### Complete Example

```markdown
---
title: "Neural Network Research"
author: "Jane Doe"
citekey: "doe2024" # If this is a source for other papers
---

# Introduction

Our approach builds on previous work [[Zhang et al., 2023.md|@zhang2023]].

# Methods

![[architecture.png|Network architecture]]<@fig:arch>

The architecture (@fig:arch) extends the model proposed by @liu2022.

The training equation is:

$$\text{loss} = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2$${#eq:loss}

Using equation @eq:loss, we can optimize the network parameters.

For implementation details, see [[implementation.md#Training Section]].

The results [@wang2024, Table 3] confirm our hypothesis.
```

### Setting Up Citations

1. **Create source files** in your vault (e.g., `sources/Smith 2024.md`)
2. **Add citekey to frontmatter**:
    ```yaml
    ---
    aliases: ["@smith2024"]
    title: "Smith et al. 2024"
    year: 2024
    ---
    ```
3. **Use in content**: `[@smith2024]`

### Citation Examples

```markdown
# Methods

We used established methods for neural networks [@smith2024; @jones2023].

Recent advances [@chen2024, p. 142] show significant improvements:

> This is a direct quote from the source [@williams2023].

For more details, see the comprehensive study [[Smith 2024]].
```

---

## Bibliography Setup

The plugin integrates with the [Bibliography Manager](https://obsidian.md/plugins?id=bibliography-manager) plugin for automatic bibliography generation.

### Benefits of Bibliography Manager Integration

-   **Automatic Citation Processing**: Supports .bib, .yaml, .json source formats
-   **Format Flexibility**: Export to BibTeX, CSL-JSON, or Hayagriva formats
-   **Source Organization**: Centralized source management in your vault
-   **Real-time Updates**: Bibliography updates automatically when sources change
-   **Cross-format Support**: Works with Zotero, Mendeley, and other reference managers
-   **Duplicate Detection**: Automatic duplicate citation handling
-   **Citation Style Support**: Multiple citation styles via CSL

### Installation and Setup

1. **Install Bibliography Manager** from Obsidian's community plugins
2. **Configure Source Files**:
    ```yaml
    // In Bibliography Manager settings
    sources_folder: "Sources"  // Folder containing your source files
    ```
3. **Enable API Integration**:
    ```yaml
    // In Typst Export settings
    useBibliographyAPI: true
    sources_folder: "Sources"    // Must match Bibliography Manager
    bibliographyFilename: "references.bib"  // Output filename
    ```

### Configuration Settings

#### General Settings

| Setting                  | Description                          | Default                   |
| ------------------------ | ------------------------------------ | ------------------------- |
| **Template Settings**    |                                      |                           |
| `typst_template_folder`  | Folder containing your templates     | `/templates`              |
| `typst_template_path`    | Default template to use              | `main.typ`                |
| **Main Export Settings** |                                      |                           |
| `base_output_folder`     | Default export directory             | `/`                       |
| `replace_existing_files` | Overwrite files without confirmation | `true`                    |
| `last_external_folder`   | Last external export location        |                           |
| `typst_post_command`     | Command to run after export          | `typst compile $filepath` |

#### Bibliography Settings

| Setting                   | Description                              | Default              |
| ------------------------- | ---------------------------------------- | -------------------- |
| **Bibliography Settings** |                                          |                      |
| `useBibliographyAPI`      | Enable automatic bibliography generation | `true`               |
| `sources_folder`          | Folder containing source files           | `"Sources"`          |
| `bibliographyFilename`    | Output bibliography filename             | `"bibliography.bib"` |

### Frontmatter Overrides

You can override any bibliography setting per document using frontmatter:

| Frontmatter Field    | Overrides                      | Example                 |
| -------------------- | ------------------------------ | ----------------------- |
| `typst_sourcefolder` | `sources_folder` setting       | `"Sources/Paper1"`      |
| `typst_bibfile`      | `bibliographyFilename` setting | `"references-ieee.bib"` |

#### Example Document with Overrides

```markdown
---
title: "Neural Networks in Modern Computing"
author: "Jane Doe"
typst_sourcefolder: "Sources/ML-Paper"
typst_bibfile: "ml-references.bib"
---

# Introduction

Neural networks have revolutionized computing [@zhang2024; @patel2023].

Recent advances in deep learning [@zhang2024, Algorithm 1] demonstrate...
```

This document will:

-   Use sources from `Sources/ML-Paper` instead of the default `Sources`
-   Generate bibliography as `ml-references.bib` instead of `bibliography.bib`

### Manual Bibliography Mode

If you prefer not to use the Bibliography Manager API:

1. **Set `useBibliographyAPI` to `false`** in settings
2. **Place your bibliography file** in your template folder
3. **Use `{{bibliography}}`** in your template to reference it

Template folder structure:

```
templates/
├── main.typ
├── bibliography.bib  ← Your manual bibliography
└── figures/
```

---

## Content Syntax Guide

### Images & Figures

| Feature                 | Syntax                           | Reference  | Notes                    |
| ----------------------- | -------------------------------- | ---------- | ------------------------ |
| **Basic Image**         | `![[image.png]]`                 | None       | Simple image insertion   |
| **Image with Caption**  | `![[image.png\|Caption text]]`   | None       | Adds caption below image |
| **Image with Label**    | `![[image.png\|Caption]]<@fig1>` | `@fig1`    | Referenceable figure     |
| **Markdown Image**      | `![Caption](path/to/img.png)`    | None       | Standard markdown        |
| **Markdown with Label** | `![Caption](img.png)<@diagram>`  | `@diagram` | Referenceable figure     |

**Example Usage:**

```markdown
# Results

![[network-architecture.png\|Neural network architecture]]<@fig:arch>

As shown in @fig:arch, the architecture consists of multiple layers.

![[training-results.png\|Training accuracy over epochs]]<@fig:results>
```

### Tables

| Feature                   | Syntax                               | Reference | Notes               |
| ------------------------- | ------------------------------------ | --------- | ------------------- |
| **Basic Table**           | Standard markdown table              | None      | Simple table        |
| **Table with Caption**    | Table + newline + `Caption text`     | None      | Adds caption        |
| **Table with Label**      | Table + newline + `Caption<@table1>` | `@table1` | Referenceable table |
| **Label without Caption** | Table + newline + `<@table1>`        | `@table1` | Label only          |

**Example:**

```
# Experimental Results

| Model              | Accuracy | Parameters |
| ------------------ | -------- | ---------- |
| ResNet50           | 94.2%    | 25.6M      |
| EfficientNet       | 96.5%    | 5.3M       |
| Vision Transformer | 95.8%    | 86.7M      |
Performance comparison of different models <@table:results>     <--- Notice no empty line between!

As shown in @table:results, EfficientNet achieved the highest accuracy.
```

### Mathematical Equations

| Feature               | Syntax                                     | Reference      | Notes                      |
| --------------------- | ------------------------------------------ | -------------- | -------------------------- |
| **Inline Math**       | `$E=mc^2$`                                 | None           | Within text                |
| **Display Math**      | `$$E=mc^2$$`                               | None           | Displayed on new line      |
| **Labeled Equation**  | `$$E=mc^2$${#eq:einstein}`                 | `@eq:einstein` | Referenceable equation     |
| **Align Environment** | `$$\begin{align}...\end{align}$${#eq:sys}` | `@eq:sys-1`    | Multiple labeled equations |

**Example:**

```markdown
# Theory

The energy-mass relationship is given by:
$$E=mc^2$${#eq:energy}

According to @eq:energy, energy is proportional to mass.

For systems of equations:

$$
\begin{align}
x + y &= 10 \tag{1}\\
x - y &= 2  \tag{2}
\end{align}$${#eq:system}

Solving @eq:system gives x = 6 and y = 4.
$$
```

### Cross-References

Reference any labeled element using the syntax:

-   `@fig:label` for figures
-   `@table:label` for tables
-   `@eq:label` for equations
-   `@sec:label` for sections

**Example:**

```markdown
See @fig:arch for the network architecture, @table:results for performance metrics, and @eq:energy for the theoretical foundation.
```

---

## Advanced Configuration

### Section Templates

Configure custom section names in settings:

```json
{
	"sectionTemplateNames": [
		"abstract",
		"methodology",
		"results",
		"discussion",
		"conclusion"
	]
}
```

These become available as template variables: `{{abstract}}`, `{{methodology}}`, etc.

### Post-Export Commands

Set automatic commands to run after export:

```json
{
	"typst_post_command": "typst compile $filepath --pdf"
}
```

Available variables:

-   `$filepath`: Path to exported file
-   `$folder`: Export folder path
-   `$filename`: Export filename without extension

### File Replacement Behavior

Control whether existing files are overwritten:

```json
{
	"replace_existing_files": true
}
```

When `false`, the plugin will prompt for confirmation before overwriting files.

---

## Troubleshooting

### Common Issues

#### Bibliography Not Generated

-   **Check**: Bibliography Manager plugin is installed and enabled
-   **Check**: `useBibliographyAPI` is `true` in settings
-   **Check**: `sources_folder` matches between both plugins
-   **Check**: API status shows "available" in settings

#### Template Variables Not Working

-   **Check**: Variable names in template match frontmatter
-   **Check**: No typos in placeholder names (`{{variable}}`)
-   **Check**: Template file is saved with `.typ` extension

#### Citations Not Processing

-   **Check**: Source files have proper `aliases` in frontmatter
-   **Check**: Citation syntax is correct (`[@citekey]`)
-   **Check**: Source files are in the correct folder

#### Images Not Copying

-   **Check**: Image paths are correct
-   **Check**: Template folder includes image files
-   **Check**: `replace_existing_files` allows overwriting

---

## Acknowledgments

-   [Obsidian](https://obsidian.md/) for the amazing note-taking platform
-   [Typst](https://typst.app/) for the modern typesetting system
-   [Bibliography Manager](https://github.com/valentine195/obsidian-bibliography-manager) plugin for citation processing
-   All contributors and users who help improve this plugin
