import { TFile, App, Notice, FileSystemAdapter, normalizePath } from "obsidian";
import { FileOperations } from "./fileOperations";
import { FileManagementService } from "./fileManagementService";
import { ExportMessageBuilder } from "./messageBuilder";
import { EXPORT_MESSAGES, getExportFileNames } from "./constants";
import { ExportConfig, ExportResult, ExportPaths } from "./interfaces";
import {
	ExportPluginSettings,
	parse_longform,
	write_with_template,
	parsed_longform,
} from "../export_longform";
import { DEFAULT_TYPST_TEMPLATE } from "../export_longform/interfaces";
import { joinNormPath } from ".";
import { BibliographyService } from "./bibliographyService";
import { promisify } from "util";

// Use require for child_process in Obsidian environment
const { exec } = require("child_process");
/**
 * Service for handling export operations
 */
export class ExportService {
	private fileManager: FileManagementService;
	private bibliographyService: BibliographyService;

	constructor(private app: App, private settings: ExportPluginSettings) {
		this.fileManager = new FileManagementService(
			this.app.vault,
			this.app.vault.adapter as FileSystemAdapter
		);
		this.bibliographyService = new BibliographyService(
			this.app,
			this.settings
		);
	}

	/**
	 * Resolve template file path from frontmatter or settings
	 */
	private resolveTemplatePath(
		frontmatter: { [key: string]: string },
		settings: ExportPluginSettings
	): string {
		// Check frontmatter first (main file only)
		if ("typst_template" in frontmatter) {
			const path = frontmatter.typst_template;

			if (path === "" || path === null || path === undefined) {
				new Notice("⚠️ Template file path in frontmatter is empty");
				return "";
			}

			const normalizedPath = normalizePath(path);
			const file = this.app.vault.getFileByPath(normalizedPath);
			if (!file) {
				new Notice(
					`⚠️ Template file not found: ${normalizedPath} (from frontmatter)`
				);
				return "";
			}

			return normalizedPath;
		}

		// Fall back to settings
		if (
			settings.typst_template_path &&
			settings.typst_template_path !== ""
		) {
			const file = this.app.vault.getFileByPath(
				settings.typst_template_path
			);
			if (!file) {
				new Notice(
					`⚠️ Template file not found: ${settings.typst_template_path} (from settings)`
				);
				return "";
			}
			return settings.typst_template_path;
		}

		// No template specified - use default
		return "";
	}

	/**
	 * Resolve template folder path from frontmatter or settings
	 */
	private resolveTemplateFolderPath(
		frontmatter: { [key: string]: string },
		settings: ExportPluginSettings
	): string {
		// Check frontmatter first
		if ("typst_template_folder" in frontmatter) {
			const path = frontmatter.typst_template_folder;

			if (path === "" || path === null || path === undefined) {
				new Notice("⚠️ Template folder path in frontmatter is empty");
				return "";
			}

			return normalizePath(path);
		}

		// Fall back to settings
		return settings.typst_template_folder || "";
	}

	/**
	 * Get typst_bib setting from frontmatter or settings
	 */
	private getTypstBibSetting(
		frontmatter: { [key: string]: string },
		settings: ExportPluginSettings
	): string | null {
		// Check typst_bib setting from frontmatter first
		if ("typst_bib" in frontmatter) {
			const typstBib = frontmatter.typst_bib;
			if (typstBib && typstBib !== "" && typstBib !== null) {
				return normalizePath(typstBib);
			}
		}

		// Fall back to settings for traditional .bib file
		if (settings.bib_file && settings.bib_file !== "") {
			return settings.bib_file;
		}

		// Fall back to sources folder
		if (settings.sources_folder && settings.sources_folder !== "") {
			return settings.sources_folder;
		}

		return null;
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
					error: new Error(
						"Output path is required for external export"
					),
				};
			}

			const exportPaths = FileOperations.createExportPaths(
				outputPath,
				activeFile,
				"typst"
			);

			// Parse the content
			const parsedContents = await parse_longform(
				this.app.vault.cachedRead.bind(this.app.vault),
				this.findFile.bind(this),
				activeFile,
				settings
			);

			// Create output folder
			await FileOperations.ensureDirectoryExists(
				this.app.vault.adapter as FileSystemAdapter,
				exportPaths.outputFolderPath
			);

			// Build export message
			const messageBuilder = new ExportMessageBuilder(
				EXPORT_MESSAGES.SUCCESS_EXTERNAL_BASE
			);

			// 1. Handle template folder first (foundation)
			const templateFolderPath = this.resolveTemplateFolderPath(
				parsedContents.yaml,
				settings
			);
			await this.fileManager.handleTemplateFolderExternal(
				templateFolderPath,
				exportPaths.outputFolderPath,
				messageBuilder
			);

			// 2. Handle media files
			await this.fileManager.handleMediaFilesExternal(
				parsedContents.media_files,
				exportPaths.attachmentsPath,
				messageBuilder
			);

			// 3. Handle bibliography
			await this.handleBibliographyExternal(
				parsedContents.yaml,
				exportPaths,
				settings,
				messageBuilder
			);

			// 4. Write the main output file (mainmd.tex) last
			const templateFilePath = this.resolveTemplatePath(
				parsedContents.yaml,
				settings
			);
			await this.writeMainOutputFileExternal(
				parsedContents,
				exportPaths,
				settings,
				templateFilePath
			);

			// 5. Execute post-conversion command if specified
			await this.executePostCommand(exportPaths.outputFilePath, settings);

			// Update settings with last external folder
			settings.last_external_folder = outputPath;

			const finalMessage = messageBuilder.build(
				exportPaths.outputFolderPath,
				true
			);
			new Notice(finalMessage);

			return {
				success: true,
				message: finalMessage,
				outputPath: exportPaths.outputFilePath,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return {
				success: false,
				message: `Export failed: ${errorMessage}`,
				error: error instanceof Error ? error : new Error(errorMessage),
			};
		}
	}

	/**
	 * Exports a file to the vault
	 */
	async exportToVault(config: ExportConfig): Promise<ExportResult> {
		try {
			const { activeFile, settings } = config;

			const outputFolder = settings.base_output_folder;
			const exportPaths = this.createVaultExportPaths(
				outputFolder,
				activeFile,
				settings
			);

			// Parse the content
			const parsedContents = await parse_longform(
				this.app.vault.cachedRead.bind(this.app.vault),
				this.findFile.bind(this),
				activeFile,
				settings
			);

			// Create output folder if it doesn't exist
			const existingFolder = this.app.vault.getAbstractFileByPath(
				exportPaths.outputFolderPath
			);
			if (!existingFolder) {
				await this.app.vault
					.createFolder(exportPaths.outputFolderPath)
					.catch((error) => {
						// Ignore EEXIST errors - folder already exists
						if (!error.message?.includes("Folder already exists")) {
							console.error(
								"Failed to create output folder:",
								error
							);
						}
					});
			}

			// Build export message
			const messageBuilder = new ExportMessageBuilder(
				EXPORT_MESSAGES.SUCCESS_BASE
			);

			// 1. Handle template folder first (foundation)
			const templateFolderPath = this.resolveTemplateFolderPath(
				parsedContents.yaml,
				settings
			);
			await this.fileManager.handleTemplateFolderVault(
				templateFolderPath,
				exportPaths.outputFolderPath,
				messageBuilder
			);

			// 2. Handle media files
			await this.fileManager.handleMediaFilesVault(
				parsedContents.media_files,
				exportPaths.attachmentsPath,
				messageBuilder,
				settings.replace_existing_files
			);

			// 3. Handle bibliography
			await this.handleBibliographyVault(
				parsedContents.yaml,
				exportPaths,
				settings,
				messageBuilder
			);

			// 4. Check if output file exists and handle accordingly
			let outputFile = this.app.vault.getFileByPath(
				normalizePath(exportPaths.outputFilePath)
			);
			if (!outputFile) {
				outputFile = await this.app.vault.create(
					exportPaths.outputFilePath,
					""
				);
			} else if (settings.replace_existing_files) {
				// Overwrite existing file
				await this.app.vault.delete(outputFile);
				outputFile = await this.app.vault.create(
					exportPaths.outputFilePath,
					""
				);
			} else {
				// Keep existing file, skip writing
				new Notice(
					`Output file already exists and replace_existing_files is disabled. Skipping: ${exportPaths.outputFilePath}`
				);
				return {
					success: true,
					message: `Export skipped - file exists: ${exportPaths.outputFilePath}`,
					outputPath: exportPaths.outputFilePath,
				};
			}
			// 5. Write the main output file (mainmd.tex) last
			const templateFilePath = this.resolveTemplatePath(
				parsedContents.yaml,
				settings
			);
			await this.writeMainOutputFileVault(
				parsedContents,
				outputFile,
				settings,
				templateFilePath
			);

			// 6. Execute post-conversion command if specified (convert vault path to absolute)
			const vaultAdapter = this.app.vault.adapter as any;
			const absolutePath = vaultAdapter.getFullPath
				? vaultAdapter.getFullPath(exportPaths.outputFilePath)
				: exportPaths.outputFilePath;
			await this.executePostCommand(absolutePath, settings);

			const finalMessage = messageBuilder.build(
				exportPaths.outputFolderPath,
				false
			);
			new Notice(finalMessage);

			return {
				success: true,
				message: finalMessage,
				outputPath: exportPaths.outputFilePath,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return {
				success: false,
				message: `Export failed: ${errorMessage}`,
				error: error instanceof Error ? error : new Error(errorMessage),
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
				message: EXPORT_MESSAGES.CLIPBOARD_SUCCESS,
			};
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			return {
				success: false,
				message: `Selection export failed: ${errorMessage}`,
				error: error instanceof Error ? error : new Error(errorMessage),
			};
		}
	}

	/**
	 * Handles bibliography for external export
	 */
	private async handleBibliographyExternal(
		frontmatter: { [key: string]: string },
		exportPaths: ExportPaths,
		settings: ExportPluginSettings,
		messageBuilder: ExportMessageBuilder
	): Promise<void> {
		// Handle header file first
		await this.fileManager.handleHeaderFileExternal(
			exportPaths.headerPath,
			messageBuilder,
			"typst",
			settings.replace_existing_files
		);

		// Handle bibliography using the new service
		const typstBib = this.getTypstBibSetting(frontmatter, settings);
		const result =
			await this.bibliographyService.handleBibliographyGeneration(
				typstBib || undefined,
				exportPaths.bibPath,
				settings.sources_folder
			);

		if (result.success && result.path) {
			// console.log(`Bibliography handled: ${result.path}`);
		} else if (result.error) {
			console.warn(`Bibliography generation failed: ${result.error}`);
			// Don't fail the entire export, just continue without bibliography
		}
	}

	/**
	 * Handles bibliography for vault export
	 */
	private async handleBibliographyVault(
		frontmatter: { [key: string]: string },
		exportPaths: ExportPaths,
		settings: ExportPluginSettings,
		messageBuilder: ExportMessageBuilder
	): Promise<void> {
		// Handle header file first
		await this.fileManager.handleHeaderFileVault(
			exportPaths.headerPath,
			messageBuilder,
			"typst",
			settings.replace_existing_files
		);

		// Handle bibliography using the new service
		const typstBib = this.getTypstBibSetting(frontmatter, settings);
		const result =
			await this.bibliographyService.handleBibliographyGeneration(
				typstBib || undefined,
				exportPaths.bibPath,
				settings.sources_folder
			);

		if (result.success && result.path) {
			// console.log(`Bibliography handled: ${result.path}`);
		} else if (result.error) {
			console.warn(`Bibliography generation failed: ${result.error}`);
			// Don't fail the entire export, just continue without bibliography
		}
	}

	/**
	 * Writes the main output file for external export
	 */
	private async writeMainOutputFileExternal(
		parsedContents: parsed_longform,
		exportPaths: ExportPaths,
		settings: ExportPluginSettings,
		templateFilePath: string
	): Promise<void> {
		// Check if file exists and respect replace_existing_files setting
		if (
			!settings.replace_existing_files &&
			(await FileOperations.fileExists(
				this.app.vault.adapter as FileSystemAdapter,
				exportPaths.outputFilePath
			))
		) {
			console.log(
				`Output file already exists and replace_existing_files is disabled. Skipping: ${exportPaths.outputFilePath}`
			);
			return;
		}

		const templateFile = templateFilePath
			? this.app.vault.getFileByPath(templateFilePath)
			: undefined;
		let templateContent = DEFAULT_TYPST_TEMPLATE;

		if (templateFile) {
			templateContent = await this.app.vault.read(templateFile);
		}

		await write_with_template(
			templateContent,
			parsedContents,
			settings.sectionTemplateNames,
			{ path: exportPaths.outputFilePath } as TFile,
			async (_file, content) =>
				FileOperations.writeFile(
					this.app.vault.adapter as FileSystemAdapter,
					exportPaths.outputFilePath,
					content
				)
		);
	}

	/**
	 * Writes the main output file for vault export
	 */
	private async writeMainOutputFileVault(
		parsedContents: parsed_longform,
		outputFile: TFile,
		settings: ExportPluginSettings,
		templateFilePath: string
	): Promise<void> {
		const templateFile = templateFilePath
			? this.app.vault.getFileByPath(templateFilePath)
			: undefined;
		let templateContent = DEFAULT_TYPST_TEMPLATE;

		if (templateFile) {
			templateContent = await this.app.vault.read(templateFile);
		}

		await write_with_template(
			templateContent,
			parsedContents,
			settings.sectionTemplateNames,
			outputFile,
			this.app.vault.modify.bind(this.app.vault)
		);
	}

	/**
	 * Determines the output folder for vault export
	 */
	private determineOutputFolder(
		activeFile: TFile,
		settings: ExportPluginSettings
	) {
		// Implementation for determining output folder
		// This would contain the logic from the original method
		if (settings.base_output_folder === "") {
			settings.base_output_folder = "/";
		}

		// return this.app.vault.getFolderByPath(settings.base_output_folder) || this.app.vault.getRoot();
		return settings.base_output_folder;
	}

	/**
	 * Creates export paths for vault export
	 */
	private createVaultExportPaths(
		outputFolder: any,
		activeFile: TFile,
		settings: ExportPluginSettings
	): ExportPaths {
		const outputFolderName = FileOperations.generateSafeFilename(
			activeFile.basename
		);
		const outputFolderPath = joinNormPath(outputFolder, outputFolderName);
		const fileNames = getExportFileNames("typst");

		return {
			outputFolderPath,
			outputFileName: fileNames.OUTPUT_FILENAME,
			outputFilePath: joinNormPath(
				outputFolderPath,
				fileNames.OUTPUT_FILENAME
			),
			headerPath: joinNormPath(outputFolderPath, fileNames.HEADER),
			preamblePath: joinNormPath(outputFolderPath, fileNames.PREAMBLE),
			bibPath: joinNormPath(outputFolderPath, fileNames.BIBLIOGRAPHY),
			attachmentsPath: joinNormPath(
				outputFolderPath,
				fileNames.ATTACHMENTS_FOLDER
			),
		};
	}

	/**
	 * Helper method to find files (extracted from main class)
	 */
	private findFile(address: string): TFile | undefined {
		return (
			this.app.metadataCache.getFirstLinkpathDest(address, "/") ||
			undefined
		);
	}

	/**
	 * Joins sections for clipboard export
	 */
	private joinSections(parsedContents: parsed_longform): string {
		// This would implement the section joining logic
		return Object.values(parsedContents.sections).join("\n\n");
	}

	/**
	 * Execute post-conversion command if specified
	 */
	private async executePostCommand(
		outputFilePath: string,
		settings: ExportPluginSettings
	): Promise<void> {
		const command = settings.typst_post_command;
		// console.log(command);
		console.log(outputFilePath);

		if (!command || command.trim() === "") {
			return; // No command specified
		}

		try {
			// Replace the placeholder with the actual output file path
			// console.log(`Original command: ${command}`);
			// console.log(`Output file path: ${outputFilePath}`);

			const finalCommand = command.replace(/\$filepath/g, outputFilePath);

			// console.log(`Final command after replacement: ${finalCommand}`);

			const execPromise = promisify(exec);

			// Execute the command
			const { stdout, stderr } = await execPromise(finalCommand);

			if (stdout) {
				console.log("Command output:", stdout);
			}
			if (stderr) {
				console.warn("Command stderr:", stderr);
			}

			new Notice(`Post-conversion command executed successfully`);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			console.error("Post-conversion command failed:", errorMessage);
			// console.error("Command was:", command);
			// console.error("Output file path was:", outputFilePath);
			new Notice(`Post-conversion command failed: ${errorMessage}`, 8000);
		}
	}
}
