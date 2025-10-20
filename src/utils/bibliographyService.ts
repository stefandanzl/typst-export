import { App, Notice, normalizePath } from "obsidian";
import { ExportPluginSettings } from "../export_longform/interfaces";
import { BibliographyAPI, ExportPaths } from "./interfaces";
import { joinNormPath } from ".";

export class BibliographyService {
	constructor(private app: App, private settings: ExportPluginSettings) {}

	/**
	 * Check if bibliography plugin is available
	 */
	async checkBibliographyPluginAvailability(): Promise<boolean> {
		try {
			const bibPlugin = (this.app as any).plugins.plugins[
				"bibliography-manager"
			];
			if (bibPlugin?.api) {
				this.settings.bibliographyAPIStatus = "available";
				return true;
			} else {
				this.settings.bibliographyAPIStatus = "unavailable";
				return false;
			}
		} catch (error) {
			console.error(
				"Error checking bibliography plugin availability:",
				error
			);
			this.settings.bibliographyAPIStatus = "unavailable";
			return false;
		}
	}

	/**
	 * Generate bibliography via API - get content and write file ourselves
	 */
	async generateBibliographyViaAPI(
		sourcesFolder: string,
		outputPath: string,
		bibFileName: string
	): Promise<string> {
		try {
			const bibPlugin = (this.app as any).plugins.plugins[
				"bibliography-manager"
			] as { api: BibliographyAPI };

			if (!bibPlugin?.api) {
				throw new Error("Bibliography API not available");
			}

			// Get normalized paths
			const normalizedSources = normalizePath(sourcesFolder);
			const normalizedBibOutput = joinNormPath(outputPath, bibFileName);
			console.log("DEBUG - API call parameters:");
			console.log("  sourcesFolder:", normalizedSources);
			console.log("  bibOutputPath:", normalizedBibOutput);

			// Get bibliography content from API (not path like exportBibliographyToPath)
			const bibContent = await bibPlugin.api.exportBibliography(
				normalizedSources,
				bibFileName,
				""
			);

			// Write the content to the output file ourselves
			const adapter = this.app.vault.adapter as any;
			if (adapter.write) {
				await adapter.write(normalizedBibOutput, bibContent);
			} else {
				// Fallback for different adapter implementations
				await this.app.vault.create(normalizedBibOutput, bibContent);
			}

			console.log(
				`Generated bibliography via API: ${normalizedBibOutput}`
			);
			return normalizedBibOutput;
		} catch (error) {
			console.error("Failed to generate bibliography via API:", error);
			throw error;
		}
	}

	/**
	 * Get sources folder with frontmatter override
	 */
	private getSourcesFolder(frontmatterSources?: string): string {
		// Use frontmatter override if provided
		if (frontmatterSources && frontmatterSources.trim() !== "") {
			return normalizePath(frontmatterSources);
		}

		// Fall back to settings
		return this.settings.sources_folder;
	}

	/**
	 * Get bibliography filename with frontmatter override
	 */
	private getBibliographyFilename(frontmatter: {
		[key: string]: string;
	}): string {
		// Check for typst_bibfile override
		if ("typst_bibfile" in frontmatter) {
			const bibfile = frontmatter.typst_bibfile;
			if (bibfile && bibfile.trim() !== "") {
				return normalizePath(bibfile);
			}
		}

		// Fall back to settings
		return this.settings.bibliographyFilename;
	}

	/**
	 * Handle bibliography generation with simplified API-only logic
	 */
	async handleBibliographyGeneration(
		frontmatter: { [key: string]: string },
		exportPaths: ExportPaths
	): Promise<{ success: boolean; path?: string; error?: string }> {
		try {
			// If API is disabled, do nothing (user will handle via template folder)
			if (!this.settings.useBibliographyAPI) {
				return { success: true };
			}

			// Check API availability
			const isAvailable =
				await this.checkBibliographyPluginAvailability();
			if (!isAvailable) {
				throw new Error(
					"Bibliography Manager plugin not available. Please install the plugin to use automatic bibliography generation."
				);
			}

			// Get sources folder (with frontmatter override)
			const sourceFolder = this.getSourcesFolder(
				frontmatter.typst_sourcefolder
			);
			if (!sourceFolder) {
				throw new Error(
					"No sources folder specified. Please configure the sources folder in settings or provide 'typst_sourcefolder' in frontmatter."
				);
			}

			// Get bibliography filename (with frontmatter override)
			const bibFilename = this.getBibliographyFilename(frontmatter);

			if (bibFilename.trim() === "") {
				console.warn("No bibfile Name provided, skipping");
				return {
					success: false,
					error: "No bibfile Name provided in settings or frontmatter",
				};
			}

			const finalBibPath = exportPaths.bibFile.replace(
				/[^/]+$/,
				bibFilename
			);

			// Debug: Log paths before API call
			console.log("DEBUG - folderToUse:", sourceFolder);
			console.log("DEBUG - outputBibPath:", exportPaths.bibFile);
			console.log("DEBUG - bibFilename:", bibFilename);
			console.log("DEBUG - finalBibPath:", finalBibPath);

			// Generate bibliography via API
			const path = await this.generateBibliographyViaAPI(
				sourceFolder,
				exportPaths.outputFolderPath,
				bibFilename
			);

			return { success: true, path };
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			console.error("Bibliography generation failed:", errorMessage);

			// Don't crash the export, just log the error
			new Notice(`Bibliography generation failed: ${errorMessage}`, 5000);

			return { success: false, error: errorMessage };
		}
	}
}
