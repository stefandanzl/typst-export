import * as path from "path";
import { TFile, FileSystemAdapter, Vault } from "obsidian";
import { FileOperations } from "./fileOperations";
import { ExportMessageBuilder } from "./messageBuilder";
import { EXPORT_FILE_NAMES } from "./constants";
import { 
	FileCopyConfig, 
	FileOperationResult, 
	ExportPaths, 
	MediaFileProcessingResult 
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
		messageBuilder: ExportMessageBuilder
	): Promise<void> {
		if (!preambleFile) {
			messageBuilder.addPreambleMessage('not_found');
			return;
		}

		const preambleExists = FileOperations.fileExists(preamblePath);
		
		// Always overwrite for simpler user experience
		FileOperations.copyFileToExternal(this.vaultAdapter, preambleFile, preamblePath);
		messageBuilder.addPreambleMessage(preambleExists ? 'overwriting' : 'copying');
	}

	/**
	 * Handles preamble file copying for vault exports
	 */
	async handlePreambleFileVault(
		preambleFile: TFile | undefined,
		preamblePath: string,
		messageBuilder: ExportMessageBuilder
	): Promise<void> {
		if (!preambleFile) {
			messageBuilder.addPreambleMessage('not_found');
			return;
		}

		const existingPreamble = this.vault.getFileByPath(preamblePath);
		
		// Always overwrite for simpler user experience
		if (existingPreamble) {
			await this.vault.delete(existingPreamble);
			messageBuilder.addPreambleMessage('overwriting');
		} else {
			messageBuilder.addPreambleMessage('copying');
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
		exportFormat: "latex" | "typst" = "latex"
	): Promise<void> {
		// Skip header file creation for Typst exports - not needed
		if (exportFormat === "typst") {
			return;
		}
		
		const headerExists = FileOperations.fileExists(headerPath);
		
		// Always overwrite for simpler user experience
		FileOperations.writeFile(headerPath, get_header_tex());
		messageBuilder.addHeaderMessage(headerExists ? 'overwriting' : 'creating');
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
		exportFormat: "latex" | "typst" = "latex"
	): Promise<void> {
		// Skip header file creation for Typst exports - not needed
		if (exportFormat === "typst") {
			return;
		}
		
		const headerFile = this.vault.getFileByPath(headerPath);
		
		// Always overwrite for simpler user experience
		if (headerFile) {
			await this.vault.delete(headerFile);
			messageBuilder.addHeaderMessage('overwriting');
		} else {
			messageBuilder.addHeaderMessage('creating');
		}
		await this.vault.create(headerPath, get_header_tex());
	}

	/**
	 * Handles bibliography file copying for external exports
	 */
	async handleBibFileExternal(
		bibFile: TFile | undefined,
		bibPath: string,
		messageBuilder: ExportMessageBuilder
	): Promise<void> {
		if (!bibFile) {
			messageBuilder.addBibMessage('not_found');
			return;
		}

		const bibExists = FileOperations.fileExists(bibPath);
		
		if (!bibExists) {
			FileOperations.copyFileToExternal(this.vaultAdapter, bibFile, bibPath);
			messageBuilder.addBibMessage('copying');
		} else {
			messageBuilder.addBibMessage('none');
		}
	}

	/**
	 * Handles bibliography file copying for vault exports
	 */
	async handleBibFileVault(
		bibFile: TFile | undefined,
		bibPath: string,
		messageBuilder: ExportMessageBuilder
	): Promise<void> {
		if (!bibFile) {
			messageBuilder.addBibMessage('not_found');
			return;
		}

		const existingBib = this.vault.getFileByPath(bibPath);
		
		if (!existingBib) {
			await this.vault.copy(bibFile, bibPath);
			messageBuilder.addBibMessage('copying');
		} else {
			messageBuilder.addBibMessage('none');
		}
	}

	/**
	 * Handles media files for external exports
	 */
	async handleMediaFilesExternal(
		mediaFiles: TFile[],
		attachmentsPath: string,
		messageBuilder: ExportMessageBuilder
	): Promise<MediaFileProcessingResult> {
		if (mediaFiles.length === 0) {
			return { copiedFiles: 0, overwrittenFiles: 0, skippedFiles: 0, errors: [] };
		}

		FileOperations.ensureDirectoryExists(attachmentsPath);
		
		let copiedFiles = 0;
		let overwrittenFiles = 0;
		const errors: Error[] = [];
		let messageAdded = false;

		for (const mediaFile of mediaFiles) {
			try {
				const destinationPath = path.join(attachmentsPath, mediaFile.name);
				const fileExists = FileOperations.fileExists(destinationPath);

				// Always overwrite for simpler user experience
				FileOperations.copyFileToExternal(this.vaultAdapter, mediaFile, destinationPath);
				
				if (fileExists) {
					overwrittenFiles++;
				} else {
					copiedFiles++;
				}
			} catch (error) {
				errors.push(error instanceof Error ? error : new Error(String(error)));
			}
		}

		// Add a single message about figure files
		if (overwrittenFiles > 0 && copiedFiles > 0) {
			messageBuilder.addFiguresMessage('copying'); // Mixed case, just say copying
		} else if (overwrittenFiles > 0) {
			messageBuilder.addFiguresMessage('overwriting');
		} else if (copiedFiles > 0) {
			messageBuilder.addFiguresMessage('copying');
		}

		return { copiedFiles, overwrittenFiles, skippedFiles: 0, errors };
	}

	/**
	 * Handles media files for vault exports
	 */
	async handleMediaFilesVault(
		mediaFiles: TFile[],
		attachmentsPath: string,
		messageBuilder: ExportMessageBuilder
	): Promise<MediaFileProcessingResult> {
		if (mediaFiles.length === 0) {
			return { copiedFiles: 0, overwrittenFiles: 0, skippedFiles: 0, errors: [] };
		}

		await this.vault.createFolder(attachmentsPath).catch(() => {});
		
		let copiedFiles = 0;
		let overwrittenFiles = 0;
		const errors: Error[] = [];

		for (const mediaFile of mediaFiles) {
			try {
				const destinationPath = path.join(attachmentsPath, mediaFile.name);
				const existingFile = this.vault.getFileByPath(destinationPath);

				// Always overwrite for simpler user experience
				if (existingFile) {
					await this.vault.delete(existingFile);
					overwrittenFiles++;
				} else {
					copiedFiles++;
				}
				await this.vault.copy(mediaFile, destinationPath);
			} catch (error) {
				errors.push(error instanceof Error ? error : new Error(String(error)));
			}
		}

		// Add a single message about figure files
		if (overwrittenFiles > 0 && copiedFiles > 0) {
			messageBuilder.addFiguresMessage('copying'); // Mixed case, just say copying
		} else if (overwrittenFiles > 0) {
			messageBuilder.addFiguresMessage('overwriting');
		} else if (copiedFiles > 0) {
			messageBuilder.addFiguresMessage('copying');
		}

		return { copiedFiles, overwrittenFiles, skippedFiles: 0, errors };
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
			FileOperations.copyDirectoryToExternal(
				this.vaultAdapter,
				templateFolderPath,
				outputFolderPath
			);
			messageBuilder.addCustomMessage("- Template folder copied successfully (files overwritten as needed)");
		} catch (error) {
			console.error("Failed to copy template folder:", error);
			// Provide more specific error information
			const errorMessage = error instanceof Error ? error.message : String(error);
			if (errorMessage.includes('EEXIST')) {
				messageBuilder.addCustomMessage("- Template folder: retrying with forced overwrite...");
				// Try again with a more aggressive approach - this should now work with our improved copy method
				try {
					FileOperations.copyDirectoryToExternal(
						this.vaultAdapter,
						templateFolderPath,
						outputFolderPath
					);
					messageBuilder.addCustomMessage("- Template folder copied successfully on retry");
				} catch (retryError) {
					messageBuilder.addCustomMessage("- Template folder: failed to copy some files (check file permissions)");
					throw new Error(`Failed to copy template folder: ${retryError}`);
				}
			} else if (errorMessage.includes('ENOENT')) {
				messageBuilder.addCustomMessage("- Template folder not found at specified path");
				throw new Error(`Template folder not found: ${templateFolderPath}`);
			} else {
				messageBuilder.addCustomMessage("- Template folder copy failed with unexpected error");
				throw error;
			}
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
			messageBuilder.addCustomMessage("- Template folder copied successfully (files overwritten as needed)");
		} catch (error) {
			console.error("Failed to copy template folder:", error);
			// Provide more specific error information  
			if (error instanceof Error && error.message.includes('EEXIST')) {
				messageBuilder.addCustomMessage("- Template folder: some files couldn't be overwritten (check permissions)");
			} else {
				messageBuilder.addCustomMessage("- Template folder not found or couldn't be copied");
			}
		}
	}
}
