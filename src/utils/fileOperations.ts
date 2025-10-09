import * as fs from "fs";
import * as path from "path";
import { TFile, FileSystemAdapter } from "obsidian";
import { getExportFileNames } from "./constants";

/**
 * Utility class for common file operations used in export functionality
 */
export class FileOperations {
	/**
	 * Ensures a directory exists, creating it if necessary
	 */
	static ensureDirectoryExists(dirPath: string): void {
		if (!fs.existsSync(dirPath)) {
			fs.mkdirSync(dirPath, { recursive: true });
		}
	}

	/**
	 * Copies a file from Obsidian vault to external filesystem
	 */
	static copyFileToExternal(
		vaultAdapter: FileSystemAdapter,
		sourceFile: TFile,
		destinationPath: string
	): void {
		const sourcePath = vaultAdapter.getFullPath(sourceFile.path);
		fs.copyFileSync(sourcePath, destinationPath);
	}

	/**
	 * Checks if a file exists at the given path
	 */
	static fileExists(filePath: string): boolean {
		return fs.existsSync(filePath);
	}

	/**
	 * Writes content to a file
	 */
	static writeFile(filePath: string, content: string): void {
		fs.writeFileSync(filePath, content);
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
	static createExportPaths(baseFolderPath: string, activeFile: TFile, exportFormat: "typst" = "typst") {
		const outputFolderName = this.generateSafeFilename(activeFile.basename);
		const outputFolderPath = path.join(baseFolderPath, outputFolderName);
		const fileNames = getExportFileNames(exportFormat);
		const outputFileName = fileNames.OUTPUT_FILENAME;
		const outputFilePath = path.join(outputFolderPath, outputFileName);

		return {
			outputFolderPath,
			outputFileName,
			outputFilePath,
			headerPath: path.join(outputFolderPath, fileNames.HEADER),
			preamblePath: path.join(outputFolderPath, fileNames.PREAMBLE),
			bibPath: path.join(outputFolderPath, fileNames.BIBLIOGRAPHY),
			attachmentsPath: path.join(outputFolderPath, fileNames.ATTACHMENTS_FOLDER)
		};
	}

	/**
	 * Copies a directory from Obsidian vault to external filesystem recursively
	 * Copies the contents of the source directory to the destination directory
	 */
	static copyDirectoryToExternal(
		vaultAdapter: FileSystemAdapter,
		sourceDir: string,
		destinationDir: string
	): void {
		const sourcePath = vaultAdapter.getFullPath(sourceDir);
		
		if (!fs.existsSync(sourcePath)) {
			return; // Source doesn't exist, nothing to copy
		}

		// Ensure destination directory exists
		this.ensureDirectoryExists(destinationDir);

		// Copy the directory contents recursively
		this.copyDirectoryRecursive(sourcePath, destinationDir);
	}

	/**
	 * Helper method for recursive directory copying (external)
	 */
	private static copyDirectoryRecursive(sourceDir: string, destDir: string): void {
	const items = fs.readdirSync(sourceDir, { withFileTypes: true });

	for (const item of items) {
		const sourceItemPath = path.join(sourceDir, item.name);
		const destItemPath = path.join(destDir, item.name);

		if (item.isDirectory()) {
			this.ensureDirectoryExists(destItemPath);
			this.copyDirectoryRecursive(sourceItemPath, destItemPath);
		} else if (item.isFile()) {
			try {
				// First, ensure the destination directory exists
				this.ensureDirectoryExists(path.dirname(destItemPath));
				
				// Force overwrite by deleting existing file first
				if (fs.existsSync(destItemPath)) {
					try {
						fs.unlinkSync(destItemPath);
					} catch (unlinkError) {
						console.warn(`Failed to delete existing file ${destItemPath}, trying to overwrite:`, unlinkError);
					}
				}
				
				// Copy the file (this should overwrite if file still exists)
				fs.copyFileSync(sourceItemPath, destItemPath);
			} catch (error: any) {
				if (error.code === 'EEXIST') {
					console.warn(`File exists error for ${destItemPath}, trying alternative copy method`);
					// Alternative: read and write the file manually
					try {
						const fileContent = fs.readFileSync(sourceItemPath);
						fs.writeFileSync(destItemPath, fileContent);
					} catch (fallbackError) {
						console.error(`All copy attempts failed for ${destItemPath}:`, fallbackError);
						throw new Error(`Failed to copy ${sourceItemPath} to ${destItemPath}: ${fallbackError}`);
					}
				} else {
					console.error(`Copy error for ${destItemPath}:`, error);
					throw error;
				}
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
		await this.copyDirectoryContentsWithinVault(vault, sourceFolder, destinationDir);
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
			await this.copyDirectoryContentsWithinVault(vault, item, destItemPath);
		} else {
			// It's a file, copy it
			try {
				const existingFile = vault.getFileByPath(destItemPath);
				if (existingFile) {
					// Always overwrite - delete first
					await vault.delete(existingFile);
					console.log(`Deleted existing file: ${destItemPath}`);
				}
				await vault.copy(item, destItemPath);
				console.log(`Copied file: ${item.path} -> ${destItemPath}`);
			} catch (copyError) {
				console.error(`Failed to copy file ${item.path} to ${destItemPath}:`, copyError);
				// Try alternative approach: read content and create new file
				try {
					const content = await vault.read(item);
					if (vault.getFileByPath(destItemPath)) {
						await vault.delete(vault.getFileByPath(destItemPath));
					}
					await vault.create(destItemPath, content);
					console.log(`Alternative copy successful: ${destItemPath}`);
				} catch (alternativeError) {
					console.error(`All copy methods failed for ${destItemPath}:`, alternativeError);
					throw new Error(`Failed to copy ${item.path}: ${alternativeError}`);
				}
			}
		}
	}
}
}
