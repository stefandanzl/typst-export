import * as path from "path";
import * as fs from "fs";
import { TFile, FileSystemAdapter } from "obsidian";

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
	static createExportPaths(baseFolderPath: string, activeFile: TFile) {
		const outputFolderName = this.generateSafeFilename(activeFile.basename);
		const outputFolderPath = path.join(baseFolderPath, outputFolderName);
		const outputFileName = `${activeFile.basename}_output.tex`;
		const outputFilePath = path.join(outputFolderPath, outputFileName);

		return {
			outputFolderPath,
			outputFileName,
			outputFilePath,
			headerPath: path.join(outputFolderPath, "header.tex"),
			preamblePath: path.join(outputFolderPath, "preamble.sty"),
			bibPath: path.join(outputFolderPath, "bibliography.bib"),
			attachmentsPath: path.join(outputFolderPath, "Attachments")
		};
	}

	/**
	 * Copies a directory from Obsidian vault to external filesystem recursively
	 * The source directory will be created inside the destination directory
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

		// Get the folder name from the source path
		const folderName = path.basename(sourceDir);
		const targetPath = path.join(destinationDir, folderName);

		// Ensure target directory exists
		this.ensureDirectoryExists(targetPath);

		// Copy the directory recursively
		this.copyDirectoryRecursive(sourcePath, targetPath);
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
				fs.copyFileSync(sourceItemPath, destItemPath);
			}
		}
	}

	/**
	 * Copies a directory within the vault recursively
	 * The source directory will be created inside the destination directory
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

		// Get the folder name from the source path
		const folderName = path.basename(sourceDir);
		const targetPath = path.join(destinationDir, folderName);

		// Ensure target directory exists
		await vault.createFolder(targetPath).catch(() => {});

		// Copy all items from source to target
		await this.copyDirectoryContentsWithinVault(vault, sourceFolder, targetPath);
	}

	/**
	 * Helper method for copying directory contents within vault
	 */
	private static async copyDirectoryContentsWithinVault(
		vault: any,
		sourceFolder: any,
		targetPath: string
	): Promise<void> {
		for (const item of sourceFolder.children) {
			const destItemPath = path.join(targetPath, item.name);

			if (item.children) {
				// It's a directory, recursively copy
				await vault.createFolder(destItemPath).catch(() => {});
				await this.copyDirectoryContentsWithinVault(vault, item, destItemPath);
			} else {
				// It's a file, copy it
				const existingFile = vault.getFileByPath(destItemPath);
				if (existingFile) {
					// Always overwrite
					await vault.delete(existingFile);
				}
				await vault.copy(item, destItemPath);
			}
		}
	}
}
