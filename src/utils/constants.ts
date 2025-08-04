/**
 * Constants and configuration values for the Latex Exporter plugin
 */

// File names and paths
export const EXPORT_FILE_NAMES = {
	LATEX: {
		OUTPUT_FILENAME: "mainmd.tex",
		PREAMBLE: "preamble.sty",
		HEADER: "header.tex",
		BIBLIOGRAPHY: "bibliography.bib",
		ATTACHMENTS_FOLDER: "Attachments"
	},
	TYPST: {
		OUTPUT_FILENAME: "mainmd.typ",
		PREAMBLE: "preamble.typ",
		HEADER: "header.typ",
		BIBLIOGRAPHY: "bibliography.bib",
		ATTACHMENTS_FOLDER: "Attachments"
	}
} as const;

// Helper function to get file names based on export format
export function getExportFileNames(format: "latex" | "typst") {
	return EXPORT_FILE_NAMES[format.toUpperCase() as keyof typeof EXPORT_FILE_NAMES];
}

// Buffer and performance settings
export const PERFORMANCE_CONSTANTS = {
	RENDER_BUFFER_SIZE: 10_000_000, // 10MB buffer for rendering
	MAX_FILE_SIZE_WARNING: 5_000_000 // 5MB file size warning threshold
} as const;

// Default folder paths
export const DEFAULT_PATHS = {
	ROOT_FOLDER: "/",
	VAULT_ROOT: "/"
} as const;

// Export messages
export const EXPORT_MESSAGES = {
	SUCCESS_BASE: "SUCCESS!!\nExporting the current file:\n",
	SUCCESS_EXTERNAL_BASE: "SUCCESS!!\nExporting to external folder:\n",
	CANCELLED: "External export cancelled",
	NO_FILE: "No active file found.",
	FOLDER_NOT_FOUND: "Output folder path not found, defaulting to the root of the vault.",
	CLIPBOARD_SUCCESS: "Latex content copied to clipboard",
	FOLDER_PICKER_ERROR: "Failed to open folder picker",
	TEMPLATE_FOLDER_SUCCESS: "Template folder copied successfully",
	TEMPLATE_FOLDER_ERROR: "Template folder not found or couldn't be copied"
} as const;

// Modal and UI messages
export const UI_MESSAGES = {
	OVERWRITE_CONFIRM: "It seems there is a previously exported file. Overwrite it?",
	EXTERNAL_OVERWRITE_CONFIRM: "It seems there is a previously exported file in the external folder. Overwrite it?",
	REMEMBER_CHOICE: "Remember my choice:",
	OK_BUTTON: "OK",
	CANCEL_BUTTON: "Cancel"
} as const;

// File actions for message building
export type FileAction = 'overwriting' | 'copying' | 'creating' | 'none' | 'not_found';

// Export types
export type ExportType = 'internal' | 'external' | 'selection';

// Electron dialog configuration
export const DIALOG_CONFIG = {
	PROPERTIES: ["openDirectory"] as const
} as const;
