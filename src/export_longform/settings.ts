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
		new Setting(containerEl)
			.setName("Template file")
			.setDesc(
				"Relative vault path to a template file. Only set this if you would like to export with a template (you don't need to.)"
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
			.setName("Math preamble file")
			.setDesc(
				"Vault relative path to a preamble.sty file in your vault. It will be included in the export."
			)
			.addText((text) =>
				text
					.setPlaceholder("path/to/preamble_file")
					.setValue(this.plugin.settings.preamble_file)
					.onChange(async (value) => {
						this.plugin.settings.preamble_file =
							normalizePath(value);
						await this.plugin.saveSettings();
					})
			);
		new Setting(containerEl).setName("Bib file").addText((text) =>
			text
				.setPlaceholder("path/to/bib_file")
				.setValue(this.plugin.settings.bib_file)
				.onChange(async (value) => {
					this.plugin.settings.bib_file = normalizePath(value);
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
		// Note: All files are now automatically overwritten during export for a simpler user experience
		new Setting(containerEl)
			.setName("Default cite command")
			.addText((txt) =>
				txt
					.setValue(this.plugin.settings.default_citation_command)
					.onChange(async (value) => {
						this.plugin.settings.default_citation_command = value;
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
	}
}
