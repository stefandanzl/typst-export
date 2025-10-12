import * as path from "path";
import { TFile, FileSystemAdapter, Vault, normalizePath } from "obsidian";
import { FileOperations } from "./fileOperations";
import { ExportMessageBuilder } from "./messageBuilder";
import { EXPORT_FILE_NAMES } from "./constants";
import {
	FileCopyConfig,
	FileOperationResult,
	ExportPaths,
	MediaFileProcessingResult,
} from "./interfaces";
import { ExportPluginSettings, parsed_longform } from "../export_longform";
import { get_header_tex } from "../export_longform/get_header_tex";

/**
 * Service for managing file operations during export
 */
export class FileManagementService {
	constructor(
		private vault: Vault,
		private vaultAdapter: FileSystemAdapter
	) {}

	/**
	 * Handles preamble file copying for external exports
	 */
	async handlePreambleFileExternal(
		preambleFile: TFile | undefined,
		preamblePath: string,
		messageBuilder: ExportMessageBuilder,
		replaceExisting: boolean = true
	): Promise<void> {
		if (!preambleFile) {
			messageBuilder.addPreambleMessage("not_found");
			return;
		}

		const preambleExists = await FileOperations.fileExists(
			this.vaultAdapter,
			preamblePath
		);

		if (preambleExists && !replaceExisting) {
			messageBuilder.addPreambleMessage("none");
			return;
		}

		await FileOperations.copyFileToExternal(
			this.vault,
			this.vaultAdapter,
			preambleFile,
			preamblePath
		);
		messageBuilder.addPreambleMessage(
			preambleExists ? "overwriting" : "copying"
		);
	}

	/**
	 * Handles preamble file copying for vault exports
	 */
	async handlePreambleFileVault(
		preambleFile: TFile | undefined,
		preamblePath: string,
		messageBuilder: ExportMessageBuilder,
		replaceExisting: boolean = true
	): Promise<void> {
		if (!preambleFile) {
			messageBuilder.addPreambleMessage("not_found");
			return;
		}

		const existingPreamble = this.vault.getFileByPath(preamblePath);

		if (existingPreamble && !replaceExisting) {
			messageBuilder.addPreambleMessage("none");
			return;
		}

		if (existingPreamble) {
			await this.vault.delete(existingPreamble);
			messageBuilder.addPreambleMessage("overwriting");
		} else {
			messageBuilder.addPreambleMessage("copying");
		}
		await this.vault.copy(preambleFile, preamblePath);
	}

	/**
	 * Handles header file creation for external exports
	 */
	/**
	 * Handles header file creation for external exports
	 */
	/**
	 * Handles header file creation for external exports
	 */
	async handleHeaderFileExternal(
		headerPath: string,
		messageBuilder: ExportMessageBuilder,
		exportFormat: "latex" | "typst" = "latex",
		replaceExisting: boolean = true
	): Promise<void> {
		// Skip header file creation for Typst exports - not needed
		if (exportFormat === "typst") {
			return;
		}

		const headerExists = await FileOperations.fileExists(
			this.vaultAdapter,
			headerPath
		);

		if (headerExists && !replaceExisting) {
			messageBuilder.addHeaderMessage("none");
			return;
		}

		await FileOperations.writeFile(
			this.vaultAdapter,
			headerPath,
			get_header_tex()
		);
		messageBuilder.addHeaderMessage(
			headerExists ? "overwriting" : "creating"
		);
	}

	/**
	 * Handles header file creation for vault exports
	 */
	/**
	 * Handles header file creation for vault exports
	 */
	/**
	 * Handles header file creation for vault exports
	 */
	async handleHeaderFileVault(
		headerPath: string,
		messageBuilder: ExportMessageBuilder,
		exportFormat: "latex" | "typst" = "latex",
		replaceExisting: boolean = true
	): Promise<void> {
		// Skip header file creation for Typst exports - not needed
		if (exportFormat === "typst") {
			return;
		}

		const headerFile = this.vault.getFileByPath(headerPath);

		if (headerFile && !replaceExisting) {
			messageBuilder.addHeaderMessage("none");
			return;
		}

		if (headerFile) {
			await this.vault.delete(headerFile);
			messageBuilder.addHeaderMessage("overwriting");
		} else {
			messageBuilder.addHeaderMessage("creating");
		}
		await this.vault.create(headerPath, get_header_tex());
	}

	/**
	 * Handles bibliography file copying for external exports
	 */
	async handleBibFileExternal(
		bibFile: TFile | undefined,
		bibPath: string,
		messageBuilder: ExportMessageBuilder,
		replaceExisting: boolean = true
	): Promise<void> {
		if (!bibFile) {
			messageBuilder.addBibMessage("not_found");
			return;
		}

		const bibExists = await FileOperations.fileExists(
			this.vaultAdapter,
			bibPath
		);

		if (bibExists && !replaceExisting) {
			messageBuilder.addBibMessage("none");
			return;
		}

		// Note: No need to explicitly delete the file since copyFileToExternal will overwrite it

		await FileOperations.copyFileToExternal(
			this.vault,
			this.vaultAdapter,
			bibFile,
			bibPath
		);
		messageBuilder.addBibMessage("copying");
	}

	/**
	 * Handles bibliography file copying for vault exports
	 */
	async handleBibFileVault(
		bibFile: TFile | undefined,
		bibPath: string,
		messageBuilder: ExportMessageBuilder,
		replaceExisting: boolean = true
	): Promise<void> {
		if (!bibFile) {
			messageBuilder.addBibMessage("not_found");
			return;
		}

		const existingBib = this.vault.getFileByPath(normalizePath(bibPath));

		if (existingBib && !replaceExisting) {
			messageBuilder.addBibMessage("none");
			return;
		}

		if (!existingBib) {
			await this.vault.copy(bibFile, bibPath);
			messageBuilder.addBibMessage("copying");
		} else {
			// Replace existing file
			await this.vault.delete(existingBib);
			await this.vault.copy(bibFile, bibPath);
			messageBuilder.addBibMessage("copying"); // Use 'copying' since 'overwriting' is not available
		}
	}

	/**
	 * Handles media files for external exports
	 */
	async handleMediaFilesExternal(
		mediaFiles: TFile[],
		attachmentsPath: string,
		messageBuilder: ExportMessageBuilder,
		replaceExisting: boolean = true
	): Promise<MediaFileProcessingResult> {
		if (mediaFiles.length === 0) {
			return {
				copiedFiles: 0,
				overwrittenFiles: 0,
				skippedFiles: 0,
				errors: [],
			};
		}

		await FileOperations.ensureDirectoryExists(
			this.vaultAdapter,
			attachmentsPath
		);

		let copiedFiles = 0;
		let overwrittenFiles = 0;
		let skippedFiles = 0;
		const errors: Error[] = [];

		for (const mediaFile of mediaFiles) {
			try {
				const destinationPath = path.join(
					attachmentsPath,
					mediaFile.name
				);
				const fileExists = await FileOperations.fileExists(
					this.vaultAdapter,
					destinationPath
				);

				if (fileExists && !replaceExisting) {
					skippedFiles++;
					continue;
				}

				await FileOperations.copyFileToExternal(
					this.vault,
					this.vaultAdapter,
					mediaFile,
					destinationPath
				);

				if (fileExists) {
					overwrittenFiles++;
				} else {
					copiedFiles++;
				}
			} catch (error) {
				errors.push(
					error instanceof Error ? error : new Error(String(error))
				);
			}
		}

		// Add a single message about figure files
		if (overwrittenFiles > 0 && copiedFiles > 0) {
			messageBuilder.addFiguresMessage("copying"); // Mixed case, just say copying
		} else if (overwrittenFiles > 0) {
			messageBuilder.addFiguresMessage("overwriting");
		} else if (copiedFiles > 0) {
			messageBuilder.addFiguresMessage("copying");
		}

		return { copiedFiles, overwrittenFiles, skippedFiles, errors };
	}

	/**
	 * Handles media files for vault exports
	 */
	async handleMediaFilesVault(
		mediaFiles: TFile[],
		attachmentsPath: string,
		messageBuilder: ExportMessageBuilder,
		replaceExisting: boolean = true
	): Promise<MediaFileProcessingResult> {
		if (mediaFiles.length === 0) {
			return {
				copiedFiles: 0,
				overwrittenFiles: 0,
				skippedFiles: 0,
				errors: [],
			};
		}

		await this.vault.createFolder(attachmentsPath).catch(() => {});

		let copiedFiles = 0;
		let overwrittenFiles = 0;
		let skippedFiles = 0;
		const errors: Error[] = [];

		for (const mediaFile of mediaFiles) {
			try {
				const destinationPath = path.join(
					attachmentsPath,
					mediaFile.name
				);
				const existingFile = this.vault.getFileByPath(destinationPath);

				if (existingFile && !replaceExisting) {
					skippedFiles++;
					continue;
				}

				if (existingFile) {
					await this.vault.delete(existingFile);
					overwrittenFiles++;
				} else {
					copiedFiles++;
				}
				await this.vault.copy(mediaFile, destinationPath);
			} catch (error) {
				errors.push(
					error instanceof Error ? error : new Error(String(error))
				);
			}
		}

		// Add a single message about figure files
		if (overwrittenFiles > 0 && copiedFiles > 0) {
			messageBuilder.addFiguresMessage("copying"); // Mixed case, just say copying
		} else if (overwrittenFiles > 0) {
			messageBuilder.addFiguresMessage("overwriting");
		} else if (copiedFiles > 0) {
			messageBuilder.addFiguresMessage("copying");
		}

		return { copiedFiles, overwrittenFiles, skippedFiles, errors };
	}

	/**
	 * Handles template folder copying for external exports
	 */
	async handleTemplateFolderExternal(
		templateFolderPath: string,
		outputFolderPath: string,
		messageBuilder: ExportMessageBuilder
	): Promise<void> {
		if (!templateFolderPath || templateFolderPath.trim() === "") {
			return; // No template folder specified
		}

		try {
			await FileOperations.copyDirectoryToExternal(
				this.vault,
				this.vaultAdapter,
				templateFolderPath,
				outputFolderPath
			);
			messageBuilder.addCustomMessage(
				"- Template folder copied successfully (files overwritten as needed)"
			);
		} catch (error) {
			console.error("Failed to copy template folder:", error);
			// Provide more specific error information
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			messageBuilder.addCustomMessage(
				"- Template folder: failed to copy some files (check file permissions)"
			);
			throw new Error(`Failed to copy template folder: ${errorMessage}`);
		}
	}

	/**
	 * Handles template folder copying for vault exports
	 */
	async handleTemplateFolderVault(
		templateFolderPath: string,
		outputFolderPath: string,
		messageBuilder: ExportMessageBuilder
	): Promise<void> {
		if (!templateFolderPath || templateFolderPath.trim() === "") {
			return; // No template folder specified
		}

		try {
			await FileOperations.copyDirectoryWithinVault(
				this.vault,
				templateFolderPath,
				outputFolderPath
			);
			messageBuilder.addCustomMessage(
				"- Template folder copied successfully (files overwritten as needed)"
			);
		} catch (error) {
			console.error("Failed to copy template folder:", error);
			// Provide more specific error information
			if (error instanceof Error && error.message.includes("EEXIST")) {
				messageBuilder.addCustomMessage(
					"- Template folder: some files couldn't be overwritten (check permissions)"
				);
			} else {
				messageBuilder.addCustomMessage(
					"- Template folder not found or couldn't be copied"
				);
			}
		}
	}
}
