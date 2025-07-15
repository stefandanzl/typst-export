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
}
