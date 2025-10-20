import { TFile, Notice } from "obsidian";
import { Header } from "./headers";

export interface node {
	unroll(
		data: metadata_for_unroll,
		settings: ExportPluginSettings
	): Promise<node[]>;
	typst(
		buffer: Buffer,
		buffer_offset: number,
		settings: ExportPluginSettings
	): Promise<number>;
}

export interface ExportPluginSettings {
	mySetting: string;
	base_output_folder: string;
	sectionTemplateNames: string[];
	bib_file: string;
	prioritize_lists: boolean;
	display_env_titles: boolean;
	default_env_name_to_file_name: boolean;
	last_external_folder: string;
	// Typst support
	typst_template_path: string;
	typst_template_folder: string;
	typst_post_command: string;
	// File replacement behavior
	replace_existing_files: boolean;
	// Source management
	sources_folder: string;
	// Bibliography settings
	bibliographyFilename: string;
	autoGenerateCitekeys: boolean;
	// Bibliography API settings
	useBibliographyAPI: boolean;
	bibliographyAPIStatus: "unknown" | "available" | "unavailable";
}

export const DEFAULT_SETTINGS: ExportPluginSettings = {
	mySetting: "default",
	base_output_folder: "/",
	sectionTemplateNames: ["abstract", "appendix"],
	bib_file: "",
	prioritize_lists: false, // Whether to parse lists or equations first. Lists first allows lists containing display equations, but yields bugs because lines within an equation can easily start with '-'.
	display_env_titles: true,
	default_env_name_to_file_name: false,
	last_external_folder: "",
	// Typst support
	typst_template_path: "",
	typst_template_folder: "",
	typst_post_command: "typst compile $filepath",
	// File replacement behavior
	replace_existing_files: true,
	// Source management
	sources_folder: "Sources",
	// Bibliography settings
	bibliographyFilename: "bibliography.bib",
	autoGenerateCitekeys: true,
	// Bibliography API settings
	useBibliographyAPI: true,
	bibliographyAPIStatus: "unknown",
};

export const DEFAULT_TYPST_TEMPLATE = `
#set document(title: "{{title}}", author: "{{author}}")
#set page(
  paper: "a4",
  margin: (top: 2.5cm, bottom: 2.5cm, left: 2.5cm, right: 2.5cm),
  numbering: "1",
  number-align: center,
)

#set text(
  font: ("Times New Roman", "Liberation Serif"),
  size: 12pt,
  lang: "en",
)

#set par(justify: true, first-line-indent: 2em)
#set heading(numbering: "1.1.1.1.")

// Title Page
#align(center)[
  #v(2fr)
  
  #text(20pt, weight: "bold")[{{title}}]
  
  #v(1fr)
  
  #text(14pt)[{{author}}]
  
  #v(2fr)
  
  #datetime.today().display("[month repr:long] [day], [year]")
  
  #v(2fr)
]

#pagebreak()

// Abstract
#if "{{abstract}}".len() > 0 [
  #heading(level: 1, numbering: none)[Abstract]
  {{abstract}}
  #pagebreak()
]

// Table of Contents
#outline(title: [Table of Contents], depth: 3, indent: auto)
#pagebreak()

// List of Figures (if any figures exist)
#outline(title: [List of Figures], target: figure.where(kind: image))

// List of Tables (if any tables exist)  
#outline(title: [List of Tables], target: figure.where(kind: table))

#pagebreak()

// Main Content
{{body}}

// Custom Sections
{{customSections}}

// Bibliography
#pagebreak()
#bibliography("{{bibliography}}", title: "Bibliography", style: "ieee")

// Appendix
#if "{{appendix}}".len() > 0 [
  #pagebreak()
  #heading(level: 1, numbering: none)[Appendix]
  {{appendix}}
]
`;

export type parsed_note = {
	yaml: { [key: string]: string };
	body: node[];
};

export type note_cache = { [key: string]: parsed_note };

export type metadata_for_unroll = {
	in_thm_env: boolean;
	depth: number;
	env_hash_list: string[];
	parsed_file_bundle: note_cache; // use the path of the files as keys.
	ambient_header_level: number; // What header level are we currently in? The header level of consideration here is the global one.
	headers_level_offset: number; // By how much the header levels written in the md file must be adjusted because of embed considerations.
	explicit_env_index: number;
	longform_file: TFile;
	current_file: TFile;
	read_tfile: (file: TFile) => Promise<string>;
	find_file: (address: string) => TFile | undefined;
	header_stack: Header[];
	media_files: TFile[];
	bib_keys: string[];
	labels: Set<string>; // Track all created labels (tables, figures, equations, etc.)
};

export function init_data(
	longform_file: TFile,
	read_tfile: (file: TFile) => Promise<string>,
	find_file: (address: string) => TFile | undefined
): metadata_for_unroll {
	return {
		in_thm_env: false,
		depth: 0,
		env_hash_list: [] as string[],
		parsed_file_bundle: {} as note_cache,
		ambient_header_level: 0,
		headers_level_offset: 0,
		explicit_env_index: 1,
		longform_file: longform_file,
		current_file: longform_file,
		read_tfile: read_tfile,
		find_file: find_file,
		header_stack: [], // file-local stack of headers.
		media_files: [],
		bib_keys: [],
		labels: new Set<string>(), // Initialize empty label tracking set
	} as metadata_for_unroll;
}

/**
 * Register a label in the global label set. Warns if duplicate is detected but doesn't crash.
 * @param data - The metadata context containing the labels set
 * @param label - The label to register
 * @param nodeType - Type of node creating the label (for error messages)
 * @returns true if registered successfully, false if duplicate
 */
export function register_label(
	data: metadata_for_unroll,
	label: string,
	nodeType: string
): boolean {
	if (data.labels.has(label)) {
		const warning =
			`WARNING: Duplicate label "${label}" found in ${nodeType}.\n` +
			`This label was already used elsewhere in the document.\n` +
			`In file: ${data.current_file.path}\n` +
			`Labels must be unique for cross-referencing to work correctly.`;
		console.error(warning);
		new Notice(warning, 8000);
		// Don't use notice_and_warn here to avoid circular dependency
		return false;
	}
	data.labels.add(label);
	return true;
}

export function address_is_image_file(address: string) {
	if (
		/\.(?:jpeg|svg|pdf|png|jpg|gif|svg|pdf|tiff|excalidraw?)$/.exec(address)
	) {
		return true;
	}
	return false;
}

export async function unroll_array(
	data: metadata_for_unroll,
	content_array: node[],
	settings: ExportPluginSettings
) {
	const new_children: node[] = [];
	for (const elt of content_array) {
		new_children.push(...(await elt.unroll(data, settings)));
	}
	return new_children;
}
