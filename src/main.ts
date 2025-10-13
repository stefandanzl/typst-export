import {
	App,
	Editor,
	Notice,
	MarkdownView,
	MarkdownFileInfo,
	Plugin,
	TFile,
} from "obsidian";
import { TypstExportSettingTab } from "./export_longform/settings";
import {
	ExportService,
	EXPORT_MESSAGES,
	DIALOG_CONFIG,
	ExportConfig,
	ExternalExportDialogResult,
} from "./utils";
import { SourceImportModal, SourceData } from "./utils/sourceManager";
import { SourceService } from "./utils/sourceService";
import { ExportPluginSettings, DEFAULT_SETTINGS } from "./export_longform";
import { getBibliographyCommands } from "./utils/bibliographyCommands";

// Use require for Electron compatibility in Obsidian
const { remote } = require("electron");

// Define type for Electron dialog return value
interface OpenDialogReturnValue {
	canceled: boolean;
	filePaths: string[];
}

/**
 * Main plugin class for Typst export functionality
 * Refactored to use service classes and better separation of concerns
 */
export default class ExportPaperPlugin extends Plugin {
	settings: ExportPluginSettings;
	private exportService: ExportService;
	private sourceService: SourceService;

	async onload(): Promise<void> {
		await this.loadSettings();

		// Note: CSS can be loaded later if needed - not critical for functionality

		// Initialize services
		this.exportService = new ExportService(this.app, this.settings);
		this.sourceService = new SourceService(this.app);

		// Register commands
		this.registerCommands();

		// Add settings tab
		this.addSettingTab(new TypstExportSettingTab(this.app, this));
	}

	onunload(): void {
		// Cleanup if needed
	}

	/**
	 * Register all plugin commands
	 */
	private registerCommands(): void {
		// Source import command
		this.addCommand({
			id: "import-source",
			name: "Import source (DOI, ISBN, URL, BibTeX)",
			editorCheckCallback: (checking: boolean) => {
				const activeFile = this.app.workspace.getActiveFile();
				if (!(activeFile instanceof TFile)) {
					return false;
				}

				if (checking) {
					return true;
				}

				this.handleSourceImport(activeFile);
				return true;
			},
		});

		// In-vault export command
		this.addCommand({
			id: "export-paper",
			name: "Export current note in-vault",
			checkCallback: (checking: boolean) => {
				const activeFile = this.app.workspace.getActiveFile();
				if (!(activeFile instanceof TFile)) {
					return false;
				}

				if (checking) {
					return true;
				}

				this.handleVaultExport(activeFile);
				return true;
			},
		});

		// External export command
		this.addCommand({
			id: "export-paper-external",
			name: "Export current note to external folder",
			checkCallback: (checking: boolean) => {
				const activeFile = this.app.workspace.getActiveFile();
				if (!(activeFile instanceof TFile)) {
					return false;
				}

				if (checking) {
					return true;
				}

				this.handleExternalExport(activeFile);
				return true;
			},
		});

		// Selection export command
		this.addCommand({
			id: "selection-export-paper",
			name: "Export selection to clipboard",
			editorCheckCallback: (
				checking: boolean,
				editor: Editor,
				ctx: MarkdownView | MarkdownFileInfo
			): boolean | void => {
				if (checking) {
					return editor.somethingSelected();
				}

				const activeFile = ctx.file;
				if (!activeFile) {
					new Notice(EXPORT_MESSAGES.NO_FILE);
					return;
				}

				const selection = editor.getSelection();
				this.handleSelectionExport(activeFile, selection);
			},
		});

		// Add bibliography commands
		const bibliographyCommands = getBibliographyCommands(this.app);
		bibliographyCommands.forEach(command => {
			this.addCommand(command);
		});
	}

	/**
	 * Handle source import with modal and file creation
	 */
	private async handleSourceImport(activeFile: TFile): Promise<void> {
		try {
			// Get the sources folder for this file
			const sourcesFolder = await this.sourceService.getSourcesFolder(activeFile, this.settings.sources_folder);

			// Open import modal
			const modal = new SourceImportModal(this.app, this, async (sourceData: SourceData) => {
				await this.sourceService.createSourceFile(sourceData, sourcesFolder);
			});

			modal.open();
		} catch (error) {
			console.error("Failed to handle source import:", error);
			new Notice("Failed to import source. Check console for details.");
		}
	}

	/**
	 * Handle vault export with proper error handling and user feedback
	 */
	private async handleVaultExport(activeFile: TFile): Promise<void> {
		try {
			const config: ExportConfig = {
				activeFile,
				settings: this.settings,
			};

			const result = await this.exportService.exportToVault(config);
			// console.log(result);
			if (!result.success) {
				new Notice(result.message);
				if (result.error) {
					console.error("Vault export error:", result.error);
				}
			}
		} catch (error) {
			console.error("Failed to handle vault export:", error);
			new Notice("Failed to export to vault. Check console for details.");
		}
	}

	/**
	 * Handle external export with folder picker and proper error handling
	 */
	private async handleExternalExport(activeFile: TFile): Promise<void> {
		try {
			const dialogResult = await this.showFolderPicker();

			if (dialogResult.cancelled || !dialogResult.selectedPath) {
				new Notice(EXPORT_MESSAGES.CANCELLED);
				return;
			}

			const config: ExportConfig = {
				activeFile,
				settings: this.settings,
				outputPath: dialogResult.selectedPath,
			};

			const result = await this.exportService.exportToExternalFolder(
				config
			);

			if (!result.success) {
				new Notice(result.message);
				if (result.error) {
					console.error("External export error:", result.error);
				}
			} else {
				// Update last external folder on success
				this.settings.last_external_folder = dialogResult.selectedPath;
				await this.saveSettings();
			}
		} catch (error) {
			console.error("Failed to handle external export:", error);
			new Notice(EXPORT_MESSAGES.FOLDER_PICKER_ERROR);
		}
	}

	/**
	 * Handle selection export to clipboard
	 */
	private async handleSelectionExport(
		activeFile: TFile,
		selection: string
	): Promise<void> {
		try {
			const result = await this.exportService.exportSelectionToClipboard(
				activeFile,
				selection,
				this.settings
			);

			if (!result.success) {
				new Notice(result.message);
				if (result.error) {
					console.error("Selection export error:", result.error);
				}
			}
		} catch (error) {
			console.error("Failed to handle selection export:", error);
			new Notice(
				"Failed to export selection. Check console for details."
			);
		}
	}

	/**
	 * Show folder picker dialog for external export
	 */
	private async showFolderPicker(): Promise<ExternalExportDialogResult> {
		try {
			const result: OpenDialogReturnValue =
				await remote.dialog.showOpenDialog({
					properties: DIALOG_CONFIG.PROPERTIES,
				});

			return {
				cancelled: result.canceled,
				selectedPath: result.canceled ? undefined : result.filePaths[0],
			};
		} catch (error) {
			console.error("Error opening folder picker:", error);
			throw new Error("Failed to open folder picker");
		}
	}

	/**
	 * Load plugin settings with defaults
	 */
	async loadSettings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	/**
	 * Save plugin settings
	 */
	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}
}
