import * as path from "path";
import {
	TFile,
	FileSystemAdapter,
	Vault,
	TFolder,
	TAbstractFile,
	normalizePath,
} from "obsidian";
import { getExportFileNames } from "./constants";
import { joinNormPath } from ".";

/**
 * Utility class for common file operations used in export functionality
 */
export class FileOperations {
	/**
	 * Ensures a directory exists, creating it if necessary
	 */
	static async ensureDirectoryExists(
		vaultAdapter: FileSystemAdapter,
		dirPath: string
	): Promise<void> {
		const normalizedPath = path.normalize(dirPath).replace(/\\/g, "/");
		const parts = normalizedPath
			.split("/")
			.filter((part) => part.length > 0);

		let currentPath = "";
		for (const part of parts) {
			currentPath = currentPath ? `${currentPath}/${part}` : part;
			const fullPath = vaultAdapter.getFullPath(currentPath);

			// Check if directory exists using FileSystemAdapter
			try {
				const stat = await vaultAdapter.stat(fullPath);
				if (stat && stat.type === "file") {
					throw new Error(`Path exists but is a file: ${fullPath}`);
				}
			} catch (error) {
				// Directory doesn't exist, create it
				try {
					await vaultAdapter.mkdir(fullPath);
				} catch (mkdirError) {
					// Ignore error if directory already exists (race condition)
					try {
						await vaultAdapter.stat(fullPath);
					} catch (statError) {
						throw mkdirError;
					}
				}
			}
		}
	}

	/**
	 * Copies a file from Obsidian vault to external filesystem
	 */
	static async copyFileToExternal(
		vault: Vault,
		vaultAdapter: FileSystemAdapter,
		sourceFile: TFile,
		destinationPath: string
	): Promise<void> {
		// Read the file content using Vault API
		const content = await vault.read(sourceFile);

		// Ensure the destination directory exists
		const destDir = path.dirname(destinationPath);
		await this.ensureDirectoryExists(vaultAdapter, destDir);

		// Write the content to the destination using FileSystemAdapter
		const destFullPath = vaultAdapter.getFullPath(destinationPath);
		await vaultAdapter.write(destFullPath, content);
	}

	/**
	 * Checks if a file exists at the given path
	 */
	static async fileExists(
		vaultAdapter: FileSystemAdapter,
		filePath: string
	): Promise<boolean> {
		try {
			const fullPath = vaultAdapter.getFullPath(normalizePath(filePath));
			await vaultAdapter.stat(fullPath);
			return true;
		} catch (error) {
			return false;
		}
	}

	/**
	 * Writes content to a file
	 */
	static async writeFile(
		vaultAdapter: FileSystemAdapter,
		filePath: string,
		content: string
	): Promise<void> {
		const fullPath = vaultAdapter.getFullPath(filePath);

		// Ensure the directory exists
		const dirPath = path.dirname(filePath);
		await this.ensureDirectoryExists(vaultAdapter, dirPath);
		console.debug("writing .typ file:");
		// Write the file
		await vaultAdapter.write(fullPath, content);
	}

	/**
	 * Generates safe filename by replacing spaces with underscores
	 */
	static generateSafeFilename(filename: string): string {
		return filename.replace(/ /g, "_");
	}

	/**
	 * Creates standard export paths for a given base folder and file
	 */
	static createExportPaths(
		baseFolderPath: string,
		activeFile: TFile,
		exportFormat: "typst" = "typst"
	) {
		const outputFolderName = this.generateSafeFilename(activeFile.basename);
		const outputFolderPath = joinNormPath(baseFolderPath, outputFolderName);

		const fileNames = getExportFileNames(exportFormat);
		const outputFileName = fileNames.OUTPUT_FILENAME;
		const outputFilePath = joinNormPath(outputFolderPath, outputFileName);

		return {
			outputFolderPath,
			outputFileName,
			outputFilePath,
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
	 * Copies a directory from Obsidian vault to external filesystem recursively
	 * Copies the contents of the source directory to the destination directory
	 */
	static async copyDirectoryToExternal(
		vault: Vault,
		vaultAdapter: FileSystemAdapter,
		sourceDir: string,
		destinationDir: string
	): Promise<void> {
		const sourcePath = vaultAdapter.getFullPath(sourceDir);

		try {
			await vaultAdapter.stat(sourcePath);
		} catch (error) {
			return; // Source doesn't exist, nothing to copy
		}

		// Ensure destination directory exists
		await this.ensureDirectoryExists(vaultAdapter, destinationDir);

		// Copy the directory contents recursively
		await this.copyDirectoryRecursive(
			vault,
			vaultAdapter,
			sourcePath,
			destinationDir
		);
	}

	/**
	 * Helper method for recursive directory copying (external)
	 */
	private static async copyDirectoryRecursive(
		vault: Vault,
		vaultAdapter: FileSystemAdapter,
		sourceDir: string,
		destDir: string
	): Promise<void> {
		// Get the normalized source directory path relative to vault
		const vaultPath = vaultAdapter.getBasePath();
		const relativeSourceDir = path.relative(vaultPath, sourceDir);
		const sourceAbstractFolder =
			vault.getAbstractFileByPath(relativeSourceDir);

		if (
			!sourceAbstractFolder ||
			!(sourceAbstractFolder instanceof TFolder)
		) {
			return; // Source doesn't exist or is not a folder
		}

		for (const item of sourceAbstractFolder.children) {
			const destItemPath = path.join(destDir, item.name);

			if (item instanceof TFolder) {
				// It's a directory, recursively copy
				await this.ensureDirectoryExists(vaultAdapter, destItemPath);
				const sourceItemPath = path.join(sourceDir, item.name);
				await this.copyDirectoryRecursive(
					vault,
					vaultAdapter,
					sourceItemPath,
					destItemPath
				);
			} else if (item instanceof TFile) {
				// It's a file, copy it
				try {
					// Ensure the destination directory exists
					await this.ensureDirectoryExists(
						vaultAdapter,
						path.dirname(destItemPath)
					);

					// Read the file content using Vault API
					const content = await vault.read(item);

					// Write the content to the destination using FileSystemAdapter
					const destFullPath = vaultAdapter.getFullPath(destItemPath);
					await vaultAdapter.write(destFullPath, content);
				} catch (error: any) {
					console.error(`Copy error for ${destItemPath}:`, error);
					throw new Error(
						`Failed to copy ${item.path} to ${destItemPath}: ${error.message}`
					);
				}
			}
		}
	}

	/**
	 * Copies a directory within the vault recursively
	 * Copies the contents of the source directory to the destination directory
	 */
	static async copyDirectoryWithinVault(
		vault: any,
		sourceDir: string,
		destinationDir: string
	): Promise<void> {
		const sourceFolder = vault.getAbstractFileByPath(sourceDir);

		if (!sourceFolder || !sourceFolder.children) {
			return; // Source doesn't exist or is not a folder
		}

		// Ensure destination directory exists
		await vault.createFolder(destinationDir).catch(() => {});

		// Copy all items from source to destination
		await this.copyDirectoryContentsWithinVault(
			vault,
			sourceFolder,
			destinationDir
		);
	}

	/**
	 * Helper method for copying directory contents within vault
	 */
	private static async copyDirectoryContentsWithinVault(
		vault: any,
		sourceFolder: any,
		destinationPath: string
	): Promise<void> {
		for (const item of sourceFolder.children) {
			// Use forward slashes for Obsidian paths, even on Windows
			const destItemPath = destinationPath + "/" + item.name;

			if (item.children) {
				// It's a directory, recursively copy
				await vault.createFolder(destItemPath).catch(() => {});
				await this.copyDirectoryContentsWithinVault(
					vault,
					item,
					destItemPath
				);
			} else {
				// It's a file, copy it
				try {
					const existingFile = vault.getFileByPath(destItemPath);
					if (existingFile) {
						// Always overwrite - delete first
						await vault.delete(existingFile);
						// console.log(`Deleted existing file: ${destItemPath}`);
					}
					await vault.copy(item, destItemPath);
					// console.log(`Copied file: ${item.path} -> ${destItemPath}`);
				} catch (copyError) {
					console.error(
						`Failed to copy file ${item.path} to ${destItemPath}:`,
						copyError
					);
					// Try alternative approach: read content and create new file
					try {
						const content = await vault.read(item);
						if (vault.getFileByPath(destItemPath)) {
							await vault.delete(
								vault.getFileByPath(destItemPath)
							);
						}
						await vault.create(destItemPath, content);
						console.log(
							`Alternative copy successful: ${destItemPath}`
						);
					} catch (alternativeError) {
						console.error(
							`All copy methods failed for ${destItemPath}:`,
							alternativeError
						);
						throw new Error(
							`Failed to copy ${item.path}: ${alternativeError}`
						);
					}
				}
			}
		}
	}
}
