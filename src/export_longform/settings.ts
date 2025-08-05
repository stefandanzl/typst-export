import {
	App,
	normalizePath,
	Setting,
	SettingTab,
	PluginSettingTab,
} from "obsidian";
import ExportPaperPlugin from "../main";

export class LatexExportSettingTab extends PluginSettingTab {
	plugin: ExportPaperPlugin;

	constructor(app: App, plugin: ExportPaperPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();
		
		// Export format selection (at the top)
		new Setting(containerEl)
			.setName("Export format")
			.setDesc("Choose between LaTeX and Typst output formats")
			.addDropdown((dropdown) =>
				dropdown
					.addOption("latex", "LaTeX")
					.addOption("typst", "Typst")
					.setValue(this.plugin.settings.export_format)
					.onChange(async (value: "latex" | "typst") => {
						this.plugin.settings.export_format = value;
						await this.plugin.saveSettings();
						// Refresh the display to show/hide format-specific settings
						this.display();
					})
			);

		// General Settings
		containerEl.createEl('h3', { text: 'General Settings' });
		
		new Setting(containerEl)
			.setName("Output folder")
			.setDesc(
				"Vault relative path of an existing folder in your vault. Exports will be written within that folder."
			)
			.addText((text) =>
				text
					.setPlaceholder("path/to/output_folder/")
					.setValue(this.plugin.settings.base_output_folder)
					.onChange(async (value) => {
						const match = /^(?:\/|\/?(.*?)\/?)$/.exec(value);
						if (match) {
							if (match[1] === undefined) {
								value = "/";
							} else {
								value = match[1];
							}
						}
						this.plugin.settings.base_output_folder =
							normalizePath(value);
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Template folder")
			.setDesc(
				"Relative vault path to a folder containing additional template files (e.g., style files, images, etc.). The entire folder contents will be copied to the export directory."
			)
			.addText((text) =>
				text
					.setPlaceholder("path/to/template_folder/")
					.setValue(this.plugin.settings.template_folder)
					.onChange(async (value) => {
						this.plugin.settings.template_folder =
							normalizePath(value);
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Header names for template sections")
			.setDesc(
				"Add the names of the sections that should be included in the template. The default is 'body, abstract, appendix'. Don't add body to the list, as it is always included in the template."
			)
			.addText((text) =>
				text
					.setPlaceholder("abstract,appendix")
					.setValue(
						this.plugin.settings.sectionTemplateNames.join(",")
					)
					.onChange(async (value) => {
						this.plugin.settings.sectionTemplateNames = value
							.split(",")
							.map((s) => s.trim());
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Document structure type")
			.setDesc(
				"Whether to export the document headers as LaTeX for an article (false) or a book (true)."
			)
			.addToggle((value) =>
				value
					.setValue(
						this.plugin.settings.documentStructureType === "book"
					)
					.onChange(async (value) => {
						if (value) {
							this.plugin.settings.documentStructureType = "book";
						} else {
							this.plugin.settings.documentStructureType =
								"article";
						}
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Prioritize lists over equations")
			.setDesc(
				"Whether to include display equations in lists, or stop the list and have the equation outside of the list."
			)
			.addToggle((cb) =>
				cb
					.setValue(this.plugin.settings.prioritize_lists)
					.onChange(async (value) => {
						this.plugin.settings.prioritize_lists = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Display environment names")
			.setDesc(
				"Set display attribute of the wikilink as the visible name of the environment in latex. If no display value is found, the value of the yaml entry 'env_title' will be used. If that is not found, use the file name if 'Default environment title to file names' is set. Setting any such field to an empty string specifies the absence of a title."
			)
			.addToggle((cb) =>
				cb
					.setValue(this.plugin.settings.display_env_titles)
					.onChange(async (value) => {
						this.plugin.settings.display_env_titles = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Default environment title to file name")
			.setDesc(
				"Use file names (without the file extension) as a default environment name."
			)
			.addToggle((cb) =>
				cb
					.setValue(
						this.plugin.settings.default_env_name_to_file_name
					)
					.onChange(async (value) => {
						this.plugin.settings.default_env_name_to_file_name =
							value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Last external folder")
			.setDesc(
				"The last used external folder for exports. Updated automatically when exporting externally."
			)
			.addText((text) =>
				text
					.setPlaceholder(
						"Last used external folder (e.g., /home/user/latex)"
					)
					.setValue(this.plugin.settings.last_external_folder)
					.onChange(async (value) => {
						this.plugin.settings.last_external_folder =
							normalizePath(value);
						await this.plugin.saveSettings();
					})
			);

		// LaTeX-specific settings
		containerEl.createEl('h3', { text: 'LaTeX Settings' });

		new Setting(containerEl)
			.setName("LaTeX template file")
			.setDesc(
				"Relative vault path to a LaTeX template file. Only set this if you would like to export with a template (you don't need to.)"
			)
			.addText((text) =>
				text
					.setPlaceholder("path/to/template_file.tex")
					.setValue(this.plugin.settings.template_path)
					.onChange(async (value) => {
						if (value === "") {
							value = "/";
						}
						this.plugin.settings.template_path =
							normalizePath(value);
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("LaTeX preamble file")
			.setDesc(
				"Vault relative path to a preamble.sty file in your vault. It will be included in the export. Example: 'preamble.sty' or 'styles/my-preamble.sty'. Leave empty if you don't have a preamble file."
			)
			.addText((text) =>
				text
					.setPlaceholder("path/to/preamble_file.sty")
					.setValue(this.plugin.settings.preamble_file)
					.onChange(async (value) => {
						// Don't normalize empty string to "/"
						this.plugin.settings.preamble_file = value.trim() === "" ? "" : normalizePath(value);
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Bibliography file")
			.setDesc(
				"Vault relative path to a bibliography file in your vault. Example: 'bibliography.bib' or 'refs/my-references.bib'. Leave empty if you don't have a bibliography file."
			)
			.addText((text) =>
			text
				.setPlaceholder("path/to/bib_file.bib")
				.setValue(this.plugin.settings.bib_file)
				.onChange(async (value) => {
					// Don't normalize empty string to "/"
					this.plugin.settings.bib_file = value.trim() === "" ? "" : normalizePath(value);
					await this.plugin.saveSettings();
				})
		);

		new Setting(containerEl)
			.setName("Default cite command")
			.setDesc("Default LaTeX citation command (e.g., cite, textcite, parencite)")
			.addText((txt) =>
				txt
					.setValue(this.plugin.settings.default_citation_command)
					.onChange(async (value) => {
						this.plugin.settings.default_citation_command = value;
						await this.plugin.saveSettings();
					})
			);

		// Typst-specific settings
		containerEl.createEl('h3', { text: 'Typst Settings' });

		new Setting(containerEl)
			.setName("Typst template file")
			.setDesc(
				"Relative vault path to a Typst template file. Only set this if you would like to export with a custom Typst template."
			)
			.addText((text) =>
				text
					.setPlaceholder("path/to/template_file.typ")
					.setValue(this.plugin.settings.typst_template_path)
					.onChange(async (value) => {
						this.plugin.settings.typst_template_path =
							normalizePath(value || "");
						await this.plugin.saveSettings();
					})
			);
			
		new Setting(containerEl)
			.setName("Typst preamble file")
			.setDesc(
				"Vault relative path to a Typst preamble file in your vault. It will be imported in the export. Example: 'preamble.typ' or 'styles/my-preamble.typ'. Leave empty if you don't have a preamble file."
			)
			.addText((text) =>
				text
					.setPlaceholder("path/to/preamble_file.typ")
					.setValue(this.plugin.settings.typst_preamble_file)
					.onChange(async (value) => {
						this.plugin.settings.typst_preamble_file = value.trim() === "" ? "" : normalizePath(value);
						await this.plugin.saveSettings();
					})
			);
	}
}
