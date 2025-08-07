# TU Graz Typst Template (Recreated from PDF)

This template recreates the exact layout and styling from the TU Graz thesis PDF.

## Files

- `tugraz_template.typ` - Main template function
- `TU_Graz.svg` - University logo (copied from original)
- `example.typ` - Example usage that replicates the PDF content
- `README.md` - This file

## Usage

```typst
#import "tugraz_template.typ": tugraz_template

#show: tugraz_template.with(
  title: "Your Thesis Title",
  author: "Your Name", 
  author_titles: "BSc",
  title-german: "German Title",
  // ... other parameters
  
  body-content: [
    = Chapter 1
    Your content here...
  ]
)
```

## Key Features

- Exact replication of PDF layout and spacing
- English and German title pages
- English and German affidavit pages
- Front matter with Roman numerals (Abstract, TOC, Lists)
- Main content with Arabic numerals
- Proper chapter and section styling
- Variable-based approach for customization

## Parameters

All major elements are customizable through function parameters:
- Basic info: `title`, `author`, `author_titles`
- Academic details: `degree`, `work-type`, etc.
- University info: `supervisor`, `institute`, etc.
- Content: `abstract-content`, `body-content`, `appendix-content`
- Options: `include-german-title`, `include-german-affidavit`
