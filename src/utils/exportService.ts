import { TFile, App, Notice, FileSystemAdapter } from "obsidian";
import { FileOperations } from "./fileOperations";
import { FileManagementService } from "./fileManagementService";
import { ExportMessageBuilder } from "./messageBuilder";
import { EXPORT_MESSAGES, getExportFileNames } from "./constants";
import { ExportConfig, ExportResult, ExportPaths } from "./interfaces";
import { 
	ExportPluginSettings, 
	parse_longform, 
	write_with_template, 
	parsed_longform 
} from "../export_longform";
import { DEFAULT_LATEX_TEMPLATE, DEFAULT_TYPST_TEMPLATE } from "../export_longform/interfaces";

/**
 * Service for handling export operations
 */
export class ExportService {
	private fileManager: FileManagementService;

	constructor(private app: App) {
		this.fileManager = new FileManagementService(
			this.app.vault,
			this.app.vault.adapter as FileSystemAdapter
		);
	}

	/**
	 * Exports a file to an external folder
	 */
	async exportToExternalFolder(config: ExportConfig): Promise<ExportResult> {
		try {
			const { activeFile, settings, outputPath } = config;
			
			if (!outputPath) {
				return {
					success: false,
					message: "No output path provided",
					error: new Error("Output path is required for external export")
				};
			}

			const exportPaths = FileOperations.createExportPaths(outputPath, activeFile, settings.export_format);

			// Parse the content
			const parsedContents = await parse_longform(
				this.app.vault.cachedRead.bind(this.app.vault),
				this.findFile.bind(this),
				activeFile,
				settings
			);

			// Create output folder
			FileOperations.ensureDirectoryExists(exportPaths.outputFolderPath);

			// Build export message
			const messageBuilder = new ExportMessageBuilder(EXPORT_MESSAGES.SUCCESS_EXTERNAL_BASE);

			// 1. Handle template folder first (foundation)
			// Use appropriate template folder based on export format
			const templateFolder = settings.export_format === "typst" 
				? settings.typst_template_folder 
				: settings.template_folder;
			
			await this.fileManager.handleTemplateFolderExternal(
				templateFolder,
				exportPaths.outputFolderPath,
				messageBuilder
			);

			// 2. Handle media files
			await this.fileManager.handleMediaFilesExternal(
				parsedContents.media_files,
				exportPaths.attachmentsPath,
				messageBuilder
			);

			// 3. Handle supporting files (can override template defaults)
			await this.handleSupportingFilesExternal(parsedContents, exportPaths, settings, messageBuilder);

			// 4. Write the main output file (mainmd.tex) last
			await this.writeMainOutputFileExternal(parsedContents, exportPaths, settings);

			// Update settings with last external folder
			settings.last_external_folder = outputPath;

			const finalMessage = messageBuilder.build(exportPaths.outputFolderPath, true);
			new Notice(finalMessage);

			return {
				success: true,
				message: finalMessage,
				outputPath: exportPaths.outputFilePath
			};

		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			return {
				success: false,
				message: `Export failed: ${errorMessage}`,
				error: error instanceof Error ? error : new Error(errorMessage)
			};
		}
	}

	/**
	 * Exports a file to the vault
	 */
	async exportToVault(config: ExportConfig): Promise<ExportResult> {
		try {
			const { activeFile, settings } = config;

			// Determine output folder
			const outputFolder = this.determineOutputFolder(activeFile, settings);
			const exportPaths = this.createVaultExportPaths(outputFolder, activeFile, settings);

			// Parse the content
			const parsedContents = await parse_longform(
				this.app.vault.cachedRead.bind(this.app.vault),
				this.findFile.bind(this),
				activeFile,
				settings
			);

			// Create output folder
			await this.app.vault.createFolder(exportPaths.outputFolderPath).catch(() => {});

			// Build export message
			const messageBuilder = new ExportMessageBuilder(EXPORT_MESSAGES.SUCCESS_BASE);

			// 1. Handle template folder first (foundation)
			// Use appropriate template folder based on export format
			const templateFolder = settings.export_format === "typst" 
				? settings.typst_template_folder 
				: settings.template_folder;
			
			await this.fileManager.handleTemplateFolderVault(
				templateFolder,
				exportPaths.outputFolderPath,
				messageBuilder
			);

			// 2. Handle media files
			await this.fileManager.handleMediaFilesVault(
				parsedContents.media_files,
				exportPaths.attachmentsPath,
				messageBuilder
			);

			// 3. Handle supporting files (can override template defaults)
			await this.handleSupportingFilesVault(parsedContents, exportPaths, settings, messageBuilder);

			// 4. Check if output file exists and handle accordingly
			let outputFile = this.app.vault.getFileByPath(exportPaths.outputFilePath);
			if (!outputFile) {
				outputFile = await this.app.vault.create(exportPaths.outputFilePath, "");
			} else {
				// Always overwrite for simpler user experience
				await this.app.vault.delete(outputFile);
				outputFile = await this.app.vault.create(exportPaths.outputFilePath, "");
			}

			// 5. Write the main output file (mainmd.tex) last
			await this.writeMainOutputFileVault(parsedContents, outputFile, settings);

			const finalMessage = messageBuilder.build(exportPaths.outputFolderPath, false);
			new Notice(finalMessage);

			return {
				success: true,
				message: finalMessage,
				outputPath: exportPaths.outputFilePath
			};

		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			return {
				success: false,
				message: `Export failed: ${errorMessage}`,
				error: error instanceof Error ? error : new Error(errorMessage)
			};
		}
	}

	/**
	 * Exports a selection to clipboard
	 */
	async exportSelectionToClipboard(
		activeFile: TFile,
		selection: string,
		settings: ExportPluginSettings
	): Promise<ExportResult> {
		try {
			const parsedContents = await parse_longform(
				this.app.vault.cachedRead.bind(this.app.vault),
				this.findFile.bind(this),
				activeFile,
				settings,
				selection
			);

			const content = this.joinSections(parsedContents);
			await navigator.clipboard.writeText(content);
			
			new Notice(EXPORT_MESSAGES.CLIPBOARD_SUCCESS);

			return {
				success: true,
				message: EXPORT_MESSAGES.CLIPBOARD_SUCCESS
			};

		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			return {
				success: false,
				message: `Selection export failed: ${errorMessage}`,
				error: error instanceof Error ? error : new Error(errorMessage)
			};
		}
	}

	/**
	 * Handles supporting files for external export
	 */
	/**
	 * Handles supporting files for external export
	 */
	private async handleSupportingFilesExternal(
		parsedContents: parsed_longform,
		exportPaths: ExportPaths,
		settings: ExportPluginSettings,
		messageBuilder: ExportMessageBuilder
	): Promise<void> {
		// Handle preamble file
		const preambleFile = this.app.vault.getFileByPath(settings.preamble_file);
		await this.fileManager.handlePreambleFileExternal(
			preambleFile || undefined,
			exportPaths.preamblePath,
			messageBuilder
		);

		// Handle header file with format-specific content
		await this.fileManager.handleHeaderFileExternal(
			exportPaths.headerPath,
			messageBuilder,
			settings.export_format
		);

		// Handle bibliography file
		const bibFile = this.app.vault.getFileByPath(settings.bib_file);
		await this.fileManager.handleBibFileExternal(
			bibFile || undefined,
			exportPaths.bibPath,
			messageBuilder
		);
	}

	/**
	 * Handles supporting files for vault export
	 */
	/**
	 * Handles supporting files for vault export
	 */
	private async handleSupportingFilesVault(
		parsedContents: parsed_longform,
		exportPaths: ExportPaths,
		settings: ExportPluginSettings,
		messageBuilder: ExportMessageBuilder
	): Promise<void> {
		// Handle preamble file
		const preambleFile = this.app.vault.getFileByPath(settings.preamble_file);
		await this.fileManager.handlePreambleFileVault(
			preambleFile || undefined,
			exportPaths.preamblePath,
			messageBuilder
		);

		// Handle header file with format-specific content
		await this.fileManager.handleHeaderFileVault(
			exportPaths.headerPath,
			messageBuilder,
			settings.export_format
		);

		// Handle bibliography file
		const bibFile = this.app.vault.getFileByPath(settings.bib_file);
		await this.fileManager.handleBibFileVault(
			bibFile || undefined,
			exportPaths.bibPath,
			messageBuilder
		);
	}

	/**
	 * Writes the main output file for external export
	 */
	/**
	 * Writes the main output file for external export
	 */
	/**
	 * Writes the main output file for external export
	 */
	private async writeMainOutputFileExternal(
		parsedContents: parsed_longform,
		exportPaths: ExportPaths,
		settings: ExportPluginSettings
	): Promise<void> {
		const templatePath = settings.export_format === "typst" ? settings.typst_template_path : settings.template_path;
		const templateFile = this.app.vault.getFileByPath(templatePath);
		let templateContent = settings.export_format === "typst" ? DEFAULT_TYPST_TEMPLATE : DEFAULT_LATEX_TEMPLATE;
		
		if (templateFile) {
			templateContent = await this.app.vault.read(templateFile);
		}

		// Get the correct preamble file based on export format
		const preamblePath = settings.export_format === "typst" ? "" : settings.preamble_file;
		const preambleFile = preamblePath ? this.app.vault.getFileByPath(preamblePath) || undefined : undefined;

		await write_with_template(
			templateContent,
			parsedContents,
			settings.sectionTemplateNames,
			{ path: exportPaths.outputFilePath } as TFile,
			async (_file, content) => FileOperations.writeFile(exportPaths.outputFilePath, content),
			preambleFile,
			preambleFile ? this.app.vault.read.bind(this.app.vault) : undefined
		);
	}

	/**
	 * Writes the main output file for vault export
	 */
	/**
	 * Writes the main output file for vault export
	 */
	/**
	 * Writes the main output file for vault export
	 */
	/**
	 * Writes the main output file for vault export
	 */
	private async writeMainOutputFileVault(
		parsedContents: parsed_longform,
		outputFile: TFile,
		settings: ExportPluginSettings
	): Promise<void> {
		const templatePath = settings.export_format === "typst" ? settings.typst_template_path : settings.template_path;
		const templateFile = this.app.vault.getFileByPath(templatePath);
		let templateContent = settings.export_format === "typst" ? DEFAULT_TYPST_TEMPLATE : DEFAULT_LATEX_TEMPLATE;
		
		if (templateFile) {
			templateContent = await this.app.vault.read(templateFile);
		}

		// Get the correct preamble file based on export format
		const preamblePath = settings.export_format === "typst" ? "" : settings.preamble_file;
		const preambleFile = preamblePath ? this.app.vault.getFileByPath(preamblePath) || undefined : undefined;

		await write_with_template(
			templateContent,
			parsedContents,
			settings.sectionTemplateNames,
			outputFile,
			this.app.vault.modify.bind(this.app.vault),
			preambleFile,
			preambleFile ? this.app.vault.read.bind(this.app.vault) : undefined
		);
	}

	/**
	 * Determines the output folder for vault export
	 */
	private determineOutputFolder(activeFile: TFile, settings: ExportPluginSettings) {
		// Implementation for determining output folder
		// This would contain the logic from the original method
		if (settings.base_output_folder === "") {
			settings.base_output_folder = "/";
		}
		
		return this.app.vault.getFolderByPath(settings.base_output_folder) || this.app.vault.getRoot();
	}

	/**
	 * Creates export paths for vault export
	 */
	private createVaultExportPaths(outputFolder: any, activeFile: TFile, settings: ExportPluginSettings): ExportPaths {
		const outputFolderName = FileOperations.generateSafeFilename(activeFile.basename);
		const outputFolderPath = `${outputFolder.path}/${outputFolderName}`.replace(/^\/+/, "");
		const fileNames = getExportFileNames(settings.export_format);
		
		return {
			outputFolderPath,
			outputFileName: fileNames.OUTPUT_FILENAME,
			outputFilePath: `${outputFolderPath}/${fileNames.OUTPUT_FILENAME}`,
			headerPath: `${outputFolderPath}/${fileNames.HEADER}`,
			preamblePath: `${outputFolderPath}/${fileNames.PREAMBLE}`,
			bibPath: `${outputFolderPath}/${fileNames.BIBLIOGRAPHY}`,
			attachmentsPath: `${outputFolderPath}/${fileNames.ATTACHMENTS_FOLDER}`
		};
	}

	/**
	 * Helper method to find files (extracted from main class)
	 */
	private findFile(address: string): TFile | undefined {
		return this.app.metadataCache.getFirstLinkpathDest(address, "/") || undefined;
	}

	/**
	 * Joins sections for clipboard export
	 */
	private joinSections(parsedContents: parsed_longform): string {
		// This would implement the section joining logic
		return Object.values(parsedContents.sections).join('\n\n');
	}
}
