# Typst Export

Write academic papers directly in Obsidian! Export an Obsidian note to a full-fledged Typst document, including embedded content, citations, cross-references, figures, tables, and more. All content visible in Obsidian will be included in the export!

## Features

This plugin supports:

-   **Embedded content**, including content from specific headers
-   **Typst environments** (theorem, lemma, proof, etc.)
-   **Seamless cross-references** using labels and `@` syntax
-   **Citations** with flexible syntax (wikilinks and Pandoc-style)
-   **Section structure** from Markdown headers
-   **Equation references** with custom labels
-   **Title and metadata** from YAML frontmatter
-   **Template-based exports** with customizable Typst templates
-   **Selection export** to clipboard
-   **Markdown to Typst conversion** for most Obsidian elements
-   **Tables** with optional captions and labels
-   **Figures/Images** with captions and labels (wikilink and standard markdown syntax)
-   **Hyperlinks** exported as `#link()` commands
-   **Frontmatter overrides** for template, template folder, and bibliography paths

This plugin works great with:

-   **Zotero Integration** or **Citations** plugin for bibliography management
-   **Extended MathJax** for LaTeX macros in both Obsidian and exports

## Purpose and Concept

Using a set of notes in a vault to produce a single polished document is typically challenging. This plugin enables a unified workflow from ideation to final product, all within Obsidian. Your paper can emerge organically from your graph of notes.

Create a **"longform" note** that structures your content primarily through embed links (transclusions). The longform note assembles content from across your vault into a linear document. When viewed in Obsidian, the paper should be readable from this note alone. Exporting extracts all relevant content and creates a single Typst output file.

**Example workflow:**

-   Create a theorem in its own note with `Statement` and `Proof` headers
-   In your longform note, embed the statement: `theorem::![[theorem_note#Statement]]`
-   Later, embed the proof: `proof::![[theorem_note#Proof]]`
-   Reference the theorem anywhere with: `[[theorem_note]]`
-   Export generates proper Typst environments and cross-references

The embedding structure can be recursive - as long as content is visible in Obsidian from the longform note, it will be included in the export.

## How to Use

### Export Commands

#### `Typst Export: Export current note in-vault`

Navigate to your longform note and run this command. The plugin creates a folder in your vault's output directory and writes all required files.

**Content structure:**

-   Export all content, OR
-   If an h1 header named `Body` exists, export only content under `Body`
-   Special sections: `Abstract` and `Appendix` h1 headers are handled appropriately
-   Additional sections can be configured in settings

**Files and paths:**

-   **Bibliography**: Specify path in settings or override per-note with `typst_bib` frontmatter key
-   **Template**: Specify in settings or override with `typst_template` frontmatter key
-   **Template folder**: Copy additional template files with `typst_template_folder` setting or frontmatter key
-   Templates should use `{{body}}` anchor (and optionally `{{abstract}}`, `{{appendix}}`)

**Frontmatter overrides** (optional, in main note only):

```yaml
---
typst_template: path/to/custom-template.typ
typst_template_folder: path/to/template-assets
typst_bib: path/to/custom-bibliography.bib
---
```

#### `Typst Export: Export current note externally`

Export to a location outside your vault. Choose the destination folder when prompted.

#### `Typst Export: Export selection to clipboard`

Select text in editing view, run command, and get Typst output on your clipboard. Note: Output may require additional packages to compile standalone.

### Settings

Settings are organized in workflow-chronological order:

1. **Output folder** - Where exports are saved (vault or external)
2. **Template file path** - Custom Typst template (uses default if empty)
3. **Typst post-command** - Shell command to run after export (e.g., compile Typst)
4. **Bibliography file path** - Path to `.bib` file
5. **Section template names** - Additional h1 headers to export as separate sections
6. **Replace existing files** - Overwrite files on re-export

**Advanced Parsing Options:**

-   **Prioritize lists over equations** - Helps with parsing conflicts
-   **Display environment names** - Show theorem/lemma titles in output

### Warnings and Diagnostics

**Heed the warnings!** They provide feedback on structural issues in your notes:

-   Missing cross-reference targets
-   Images without captions
-   Tables without captions
-   Empty frontmatter paths

Warnings appear as Notices (quick) and in the developer console (`Ctrl+Shift+I` / `Cmd+Option+I`).

## Supported Elements

### Headers

-   h1 headers → Typst sections
-   h2+ headers → Subsections of appropriate depth
-   If exporting under a `Body` h1 header, h2 becomes top-level sections

### Typst Environments

#### Embedded Environments (Recommended)

Create a note for your theorem with headers:

```markdown
# Statement

The statement of the theorem...

# Proof

The proof goes here...
```

In your longform note:

```markdown
theorem::![[theorem_note#Statement]]
```

Later for the proof:

```markdown
proof::![[theorem_note#Proof]]
```

**Supported environment types**: `theorem`, `lemma`, `corollary`, `definition`, `example`, `proof`, etc.

**Custom titles**: Use the display field:

```markdown
theorem::![[theorem_note#Statement|My Custom Theorem Title]]
```

**Fallbacks for titles**:

1. Display field of the wikilink
2. `typst_title` frontmatter in the embedded note
3. Filename (if enabled in settings)

**References**: Use wikilinks: `[[theorem_note]]` or `[[theorem_note#Statement]]`

#### Previously Published Results

Add to the note's frontmatter:

```yaml
---
typst_source: "@bibKey"
typst_published_name: "Proposition 3.1"
---
```

Wikilinks to this note become citations: `@bibKey[Proposition 3.1]`

#### Explicit Environments

Write directly in your note:

```markdown
lemma::
The following is always true.
$$\prod > \sum$$
::lemma{#my-lemma}
```

Label format: `{#lem-...}`, `{#thm-...}`, etc.

### Math

**Inline**: `$inline_math$`
**Display**: `$$display_math$$`

Display equations export to Typst equation blocks.

### Labeled Equations

```markdown
$$E = mc^2$${#eq-einstein}
```

Reference: `@eq-einstein`

**Align environments:**

```markdown
$$
\begin{align}
x &= y \\
a &= b
\end{align}
$$

{#eq-system}
```

Reference lines: `@eq-system-1`, `@eq-system-2`

### Tables

**Basic syntax:**

```markdown
| Header1 | Header2 |
| ------- | ------- |
| Cell1   | Cell2   |
```

**With caption and label:**

```markdown
| Header1 | Header2 |
| ------- | ------- |
| Cell1   | Cell2   |

{!Table caption text}{#my-table}
```

Reference: `@my-table`

**Notes:**

-   Caption `{!...}` is optional (warning shown if missing)
-   Label `{#...}` is optional (auto-generated if missing)

### Figures and Images

#### Wikilink syntax:

```markdown
![[folder/subfolder/image.png|Caption text]]
```

**With custom label:**

```markdown
![[image.png|Caption text]]{#my-diagram}
```

#### Standard markdown syntax:

```markdown
![Caption text](image.png)
```

**With custom label:**

```markdown
![Caption text](image.png){#fig-custom}
```

**Auto-generated labels:**

-   Uses only filename (not path): `![[folder1/folder2/image.png]]` → label: `fig-image.png`
-   Reference: `@fig-image.png`

**Notes:**

-   Images copied to `Attachments/` folder in export
-   Warning shown if caption missing
-   Supports all common image formats

#### Excalidraw Support

1. Enable "Auto-export PNG" in Excalidraw settings
2. Ensure PNG exports to your Attachments folder
3. Embed the `.excalidraw` file: `![[drawing.excalidraw|Caption]]`

### Citations

#### Wikilink Citations

Works with Zotero Integration or Citations plugin:

```markdown
[[@bibkey]]
```

**With locator:**

```markdown
[[@bibkey]][p. 42]
@bibkey[Theorem 3.1]
```

**Multiple citations:**

```markdown
[[@first]][[@second]]
```

Outputs: Single cite command with multiple keys

#### Pandoc-style Citations

```markdown
@smith2021 → #cite(<smith2021>)
[@smith2021] → #cite(<smith2021>)
[@smith2021, p. 14] → #cite(<smith2021>)[p. 14]
[@smith2021; @jones2020] → #cite(<smith2021>, <jones2020>)
```

### Lists

-   Ordered and unordered lists supported
-   Nested lists supported
-   Leave blank line to end list

### Hyperlinks

```markdown
[Link text](https://example.com)
```

Exports as: `#link("https://example.com")[Link text]`

### Code

-   Inline code: `` `code` ``
-   Display code blocks with syntax highlighting

### Comments

-   Obsidian comments `%%...%%` excluded from export
-   Markdown quotes can be converted to comments (optional setting)

## Label Reference System

All labels now use **hyphens** instead of colons for compatibility with Typst's `@` syntax.

### Label Prefixes

-   Figures: `fig-` (e.g., `@fig-diagram`)
-   Tables: `tbl-` (e.g., `@tbl-results`)
-   Locations/Sections: `loc-` (e.g., `@loc-introduction`)
-   Equations: `eq-` (e.g., `@eq-einstein`)
-   Theorems: `thm-`, `lem-`, `def-`, etc.

### Custom Labels

Always take priority over auto-generated labels:

```markdown
![[image.png|Caption]]{#custom-label} → @custom-label
![Caption](img.png){#my-fig} → @my-fig
{!Table caption}{#results} → @results
```

### Auto-generated Labels

When no custom label is provided:

-   Images: `fig-filename.png` (path stripped)
-   Tables: Generated from caption or content
-   Locations: Based on header text and file name

## Known Limitations

-   Nested unordered lists have limited support (indent-blind)
-   Equations starting with `-` or `+` may conflict with list parsing (avoid spaces after `-`/`+`)

## Future Improvements

Let me know through GitHub issues if any enhancements are of interest!

## Support

If you find this plugin helpful, consider supporting development:

## Related Projects

-   **Obsidian Pandoc Plugin** - General-purpose document export
-   **Obsidian Enhancing Export** - Alternative export solution
-   **Copy as LaTeX** - Selection export without embedded content support

---

**Note**: This plugin was originally a LaTeX exporter but has been completely rewritten to focus exclusively on Typst export.
