import { App, Notice, FileSystemAdapter, normalizePath } from "obsidian";
import { ExportPluginSettings } from "../export_longform/interfaces";

export interface BibliographyAPI {
	generateBibliography(config?: {
		sourcesFolder?: string;
		bibliographyFile?: string;
		includeFiles?: string[];
	}): Promise<string>;

	exportBibliographyToPath(config: {
		sourcesFolder?: string;
		outputPath: string;
		format?: 'bibtex' | 'csl-json';
	}): Promise<string>;
}

export class BibliographyService {
	constructor(private app: App, private settings: ExportPluginSettings) {}

	/**
	 * Check if bibliography plugin is available
	 */
	async checkBibliographyPluginAvailability(): Promise<boolean> {
		try {
			const bibPlugin = (this.app as any).plugins.plugins['bibliography-manager'];
			if (bibPlugin?.api) {
				this.settings.bibliographyAPIStatus = "available";
				return true;
			} else {
				this.settings.bibliographyAPIStatus = "unavailable";
				return false;
			}
		} catch (error) {
			console.error('Error checking bibliography plugin availability:', error);
			this.settings.bibliographyAPIStatus = "unavailable";
			return false;
		}
	}

	/**
	 * Generate bibliography from typst_bib frontmatter setting
	 */
	async generateBibliographyFromTypstBib(
		typstBib: string,
		outputPath: string
	): Promise<string | null> {
		if (!typstBib) {
			return null;
		}

		// If typst_bib ends with .bib, treat as file path
		if (typstBib.endsWith('.bib')) {
			return this.copyExistingBibFile(typstBib, outputPath);
		}

		// Otherwise, treat as directory and try to use API
		if (this.settings.useBibliographyAPI) {
			const isAvailable = await this.checkBibliographyPluginAvailability();
			if (isAvailable) {
				return this.generateBibliographyViaAPI(typstBib, outputPath);
			} else {
				throw new Error(`Bibliography Manager plugin not available. Cannot generate bibliography from directory: ${typstBib}`);
			}
		}

		// Directory specified but API is disabled
		throw new Error(`Cannot generate bibliography from directory '${typstBib}' because Bibliography API is disabled. Please enable the API or specify a .bib file path.`);
	}

	/**
	 * Copy existing .bib file to output path
	 */
	private async copyExistingBibFile(
		sourcePath: string,
		outputPath: string
	): Promise<string> {
		try {
			const sourceFile = this.app.vault.getFileByPath(normalizePath(sourcePath));
			if (!sourceFile) {
				throw new Error(`Bibliography file not found: ${sourcePath}`);
			}

			// Ensure output directory exists
			await this.ensureDirectoryExists(outputPath.substring(0, outputPath.lastIndexOf('/')));

			const content = await this.app.vault.read(sourceFile);
			await this.app.vault.adapter.write(outputPath, content);

			console.log(`Copied bibliography file from ${sourcePath} to ${outputPath}`);
			return outputPath;
		} catch (error) {
			console.error('Failed to copy bibliography file:', error);
			throw error;
		}
	}

	/**
	 * Generate bibliography via API
	 */
	private async generateBibliographyViaAPI(
		sourcesFolder: string,
		outputPath: string
	): Promise<string> {
		try {
			const bibPlugin = (this.app as any).plugins.plugins['bibliography-manager'] as { api: BibliographyAPI };

			if (!bibPlugin?.api) {
				throw new Error('Bibliography API not available');
			}

			const bibPath = await bibPlugin.api.exportBibliographyToPath({
				sourcesFolder: normalizePath(sourcesFolder),
				outputPath: normalizePath(outputPath)
			});

			console.log(`Generated bibliography via API: ${bibPath}`);
			return bibPath;
		} catch (error) {
			console.error('Failed to generate bibliography via API:', error);
			throw error;
		}
	}

	
	/**
	 * Ensure directory exists
	 */
	private async ensureDirectoryExists(dirPath: string): Promise<void> {
		if (!dirPath) return;

		const adapter = this.app.vault.adapter as FileSystemAdapter;
		if (!(await adapter.exists(dirPath))) {
			await adapter.mkdir(dirPath);
		}
	}

	/**
	 * Handle bibliography generation with proper error handling
	 */
	async handleBibliographyGeneration(
		typstBib: string | undefined,
		outputBibPath: string,
		fallbackSourcesFolder?: string
	): Promise<{ success: boolean; path?: string; error?: string }> {
		try {
			// If no typst_bib specified, try to use sources folder as fallback
			if (!typstBib && fallbackSourcesFolder) {
				if (this.settings.useBibliographyAPI) {
					const isAvailable = await this.checkBibliographyPluginAvailability();
					if (isAvailable) {
						const path = await this.generateBibliographyViaAPI(fallbackSourcesFolder, outputBibPath);
						return { success: true, path };
					} else {
						throw new Error(`Bibliography Manager plugin not available. Cannot generate bibliography from sources folder: ${fallbackSourcesFolder}`);
					}
				} else {
					throw new Error(`Cannot generate bibliography because no typst_bib specified and Bibliography API is disabled. Please enable the API or specify a .bib file path.`);
				}
			}

			// Handle typst_bib if specified
			if (typstBib) {
				const path = await this.generateBibliographyFromTypstBib(typstBib, outputBibPath);
				if (path) {
					return { success: true, path };
				}
			}

			// No bibliography generated, but that's okay
			return { success: true };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : String(error);
			console.error('Bibliography generation failed:', errorMessage);

			// Don't crash the export, just log the error
			new Notice(`Bibliography generation failed: ${errorMessage}`, 5000);

			return { success: false, error: errorMessage };
		}
	}
}