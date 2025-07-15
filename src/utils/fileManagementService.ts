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
		overwritePreamble: boolean,
		messageBuilder: ExportMessageBuilder
	): Promise<void> {
		if (!preambleFile) {
			messageBuilder.addPreambleMessage('not_found');
			return;
		}

		const preambleExists = FileOperations.fileExists(preamblePath);
		
		if (overwritePreamble && preambleExists) {
			FileOperations.copyFileToExternal(this.vaultAdapter, preambleFile, preamblePath);
			messageBuilder.addPreambleMessage('overwriting');
		} else if (!preambleExists) {
			FileOperations.copyFileToExternal(this.vaultAdapter, preambleFile, preamblePath);
			messageBuilder.addPreambleMessage('copying');
		} else {
			messageBuilder.addPreambleMessage('none');
		}
	}

	/**
	 * Handles preamble file copying for vault exports
	 */
	async handlePreambleFileVault(
		preambleFile: TFile | undefined,
		preamblePath: string,
		overwritePreamble: boolean,
		messageBuilder: ExportMessageBuilder
	): Promise<void> {
		if (!preambleFile) {
			messageBuilder.addPreambleMessage('not_found');
			return;
		}

		const existingPreamble = this.vault.getFileByPath(preamblePath);
		
		if (overwritePreamble && existingPreamble) {
			await this.vault.delete(existingPreamble);
			await this.vault.copy(preambleFile, preamblePath);
			messageBuilder.addPreambleMessage('overwriting');
		} else if (!existingPreamble) {
			await this.vault.copy(preambleFile, preamblePath);
			messageBuilder.addPreambleMessage('copying');
		} else {
			messageBuilder.addPreambleMessage('none');
		}
	}

	/**
	 * Handles header file creation for external exports
	 */
	async handleHeaderFileExternal(
		headerPath: string,
		overwriteHeader: boolean,
		messageBuilder: ExportMessageBuilder
	): Promise<void> {
		const headerExists = FileOperations.fileExists(headerPath);
		
		if (overwriteHeader && headerExists) {
			FileOperations.writeFile(headerPath, get_header_tex());
			messageBuilder.addHeaderMessage('overwriting');
		} else if (!headerExists) {
			FileOperations.writeFile(headerPath, get_header_tex());
			messageBuilder.addHeaderMessage('creating');
		} else {
			messageBuilder.addHeaderMessage('none');
		}
	}

	/**
	 * Handles header file creation for vault exports
	 */
	async handleHeaderFileVault(
		headerPath: string,
		overwriteHeader: boolean,
		messageBuilder: ExportMessageBuilder
	): Promise<void> {
		const headerFile = this.vault.getFileByPath(headerPath);
		
		if (overwriteHeader || !headerFile) {
			if (headerFile) {
				await this.vault.delete(headerFile);
				messageBuilder.addHeaderMessage('overwriting');
			} else {
				messageBuilder.addHeaderMessage('creating');
			}
			await this.vault.create(headerPath, get_header_tex());
		} else {
			messageBuilder.addHeaderMessage('none');
		}
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
		overwriteFigures: boolean,
		messageBuilder: ExportMessageBuilder
	): Promise<MediaFileProcessingResult> {
		if (mediaFiles.length === 0) {
			return { copiedFiles: 0, overwrittenFiles: 0, skippedFiles: 0, errors: [] };
		}

		FileOperations.ensureDirectoryExists(attachmentsPath);
		
		let copiedFiles = 0;
		let overwrittenFiles = 0;
		let skippedFiles = 0;
		const errors: Error[] = [];
		let copyingMessageAdded = false;
		let skippingMessageAdded = false;

		for (const mediaFile of mediaFiles) {
			try {
				const destinationPath = path.join(attachmentsPath, mediaFile.name);
				const fileExists = FileOperations.fileExists(destinationPath);

				if (overwriteFigures && fileExists) {
					FileOperations.copyFileToExternal(this.vaultAdapter, mediaFile, destinationPath);
					messageBuilder.addFiguresMessage('overwriting', mediaFile.name);
					overwrittenFiles++;
				} else if (!fileExists) {
					FileOperations.copyFileToExternal(this.vaultAdapter, mediaFile, destinationPath);
					if (!copyingMessageAdded) {
						messageBuilder.addFiguresMessage('copying');
						copyingMessageAdded = true;
					}
					copiedFiles++;
				} else {
					if (!skippingMessageAdded) {
						messageBuilder.addFiguresMessage('none');
						skippingMessageAdded = true;
					}
					skippedFiles++;
				}
			} catch (error) {
				errors.push(error instanceof Error ? error : new Error(String(error)));
			}
		}

		return { copiedFiles, overwrittenFiles, skippedFiles, errors };
	}

	/**
	 * Handles media files for vault exports
	 */
	async handleMediaFilesVault(
		mediaFiles: TFile[],
		attachmentsPath: string,
		overwriteFigures: boolean,
		messageBuilder: ExportMessageBuilder
	): Promise<MediaFileProcessingResult> {
		if (mediaFiles.length === 0) {
			return { copiedFiles: 0, overwrittenFiles: 0, skippedFiles: 0, errors: [] };
		}

		await this.vault.createFolder(attachmentsPath).catch(() => {});
		
		let copiedFiles = 0;
		let overwrittenFiles = 0;
		let skippedFiles = 0;
		const errors: Error[] = [];
		let copyingMessageAdded = false;
		let skippingMessageAdded = false;

		for (const mediaFile of mediaFiles) {
			try {
				const destinationPath = path.join(attachmentsPath, mediaFile.name);
				const existingFile = this.vault.getFileByPath(destinationPath);

				if (overwriteFigures && existingFile) {
					await this.vault.delete(existingFile);
					await this.vault.copy(mediaFile, destinationPath);
					messageBuilder.addFiguresMessage('overwriting', mediaFile.name);
					overwrittenFiles++;
				} else if (!existingFile) {
					await this.vault.copy(mediaFile, destinationPath);
					if (!copyingMessageAdded) {
						messageBuilder.addFiguresMessage('copying');
						copyingMessageAdded = true;
					}
					copiedFiles++;
				} else {
					if (!skippingMessageAdded) {
						messageBuilder.addFiguresMessage('none');
						skippingMessageAdded = true;
					}
					skippedFiles++;
				}
			} catch (error) {
				errors.push(error instanceof Error ? error : new Error(String(error)));
			}
		}

		return { copiedFiles, overwrittenFiles, skippedFiles, errors };
	}
}
