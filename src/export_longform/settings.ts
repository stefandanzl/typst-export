import {
	App,
	normalizePath,
	Notice,
	Setting,
	SettingTab,
	PluginSettingTab,
} from "obsidian";
import ExportPaperPlugin from "../main";

export class TypstExportSettingTab extends PluginSettingTab {
	plugin: ExportPaperPlugin;

	constructor(app: App, plugin: ExportPaperPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		// Order: 6, 2, 3, 4, 1, 7, 8, 5
		// Then Advanced Parsing Options section

		// 6. Header names for template sections
		new Setting(containerEl)
			.setName("Header names for template sections")
			.setDesc(
				"Add the names of the sections that should be included in the template. The default values are 'abstract' and 'appendix'. Don't add 'body' to the list, as it is always included in the template. Values can then be referenced in template files for example as {{abstract}}."
			);

		// Display existing section names with remove buttons
		this.plugin.settings.sectionTemplateNames.forEach(
			(sectionName, index) => {
				new Setting(containerEl)
					.setClass("section-template-item")
					.setName(sectionName)
					.addButton((button) =>
						button
							.setButtonText("Remove")
							.setWarning()
							.onClick(async () => {
								this.plugin.settings.sectionTemplateNames.splice(
									index,
									1
								);
								await this.plugin.saveSettings();
								this.display(); // Refresh the display
							})
					);
			}
		);

		// Add new section name
		new Setting(containerEl)
			.setClass("section-template-add")
			.addText((text) =>
				text.setPlaceholder("Enter section name").onChange((value) => {
					text.inputEl.dataset.value = value;
				})
			)
			.addButton((button) =>
				button
					.setButtonText("Add")
					.setCta()
					.onClick(async () => {
						const input = containerEl.querySelector(
							".section-template-add input"
						) as HTMLInputElement;
						const value = input?.dataset.value?.trim();
						if (value && value !== "") {
							if (
								!this.plugin.settings.sectionTemplateNames.includes(
									value
								)
							) {
								this.plugin.settings.sectionTemplateNames.push(
									value
								);
								await this.plugin.saveSettings();
								this.display(); // Refresh the display
							} else {
								new Notice(`Section "${value}" already exists`);
							}
						}
					})
			);

		// 2. Typst template file
		new Setting(containerEl)
			.setName("Typst template file")
			.setDesc(
				"Relative vault path to a Typst template file. Can be overridden per-document with frontmatter key 'typst_template'."
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

		// 3. Typst template folder
		new Setting(containerEl)
			.setName("Typst template folder")
			.setDesc(
				"Relative vault path to a folder containing Typst template files (e.g., .typ files, images, etc.). The entire folder contents will be copied to the export directory. Can be overridden with frontmatter key 'typst_template_folder'."
			)
			.addText((text) =>
				text
					.setPlaceholder("path/to/typst_template_folder/")
					.setValue(this.plugin.settings.typst_template_folder)
					.onChange(async (value) => {
						this.plugin.settings.typst_template_folder =
							normalizePath(value);
						await this.plugin.saveSettings();
					})
			);

		// 4. Sources folder
		new Setting(containerEl)
			.setName("Sources folder")
			.setDesc(
				"Default vault relative path for storing source markdown files. Example: 'Sources' or 'References/Sources'. Can be overridden with frontmatter key 'typst_bib'."
			)
			.addText((text) =>
				text
					.setPlaceholder("Sources")
					.setValue(this.plugin.settings.sources_folder)
					.onChange(async (value) => {
						this.plugin.settings.sources_folder =
							value.trim() === "" ? "Sources" : normalizePath(value);
						await this.plugin.saveSettings();
					})
			);

		// 5. Bibliography file
		new Setting(containerEl)
			.setName("Bibliography file")
			.setDesc(
				"Vault relative path to a bibliography file. Example: 'bibliography.bib' or 'refs/my-references.bib'. Can be overridden with frontmatter key 'typst_bib'."
			)
			.addText((text) =>
				text
					.setPlaceholder("path/to/bib_file.bib")
					.setValue(this.plugin.settings.bib_file)
					.onChange(async (value) => {
						this.plugin.settings.bib_file =
							value.trim() === "" ? "" : normalizePath(value);
						await this.plugin.saveSettings();
					})
			);

		// 1. Output folder
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
						this.plugin.settings.base_output_folder = value;
						console.log("Base output folder set to:", value);
						await this.plugin.saveSettings();
					})
			);

		// 7. Replace existing files
		new Setting(containerEl)
			.setName("Replace existing files")
			.setDesc(
				"Whether to replace already existing files during export. If disabled, existing files will be preserved and not overwritten."
			)
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.replace_existing_files)
					.onChange(async (value) => {
						this.plugin.settings.replace_existing_files = value;
						await this.plugin.saveSettings();
					})
			);

		// 8. Last external folder
		new Setting(containerEl)
			.setName("Last external folder")
			.setDesc(
				"The last used external folder for exports. Updated automatically when exporting externally."
			)
			.addText((text) =>
				text
					.setPlaceholder(
						"Last used external folder (e.g., /home/user/typst)"
					)
					.setValue(this.plugin.settings.last_external_folder)
					.onChange(async (value) => {
						this.plugin.settings.last_external_folder =
							normalizePath(value);
						await this.plugin.saveSettings();
					})
			);

		// 5. Typst post-conversion command
		new Setting(containerEl)
			.setName("Typst post-conversion command")
			.setDesc(
				"Command to run after converting to Typst. Use $filepath as placeholder for the absolute path to the generated .typ file. Example: 'typst compile $filepath'"
			)
			.addText((text) =>
				text
					.setPlaceholder("typst compile $filepath")
					.setValue(this.plugin.settings.typst_post_command)
					.onChange(async (value) => {
						this.plugin.settings.typst_post_command = value;
						await this.plugin.saveSettings();
					})
			)
			.addButton((button) =>
				button
					.setButtonText("Test")
					.setTooltip(
						"Test the command (replaces $filepath with a sample path)"
					)
					.onClick(async () => {
						await this.testPostCommand(
							this.plugin.settings.typst_post_command
						);
					})
			);

		// Advanced Parsing Options
		containerEl.createEl("h3", { text: "Advanced Parsing Options" });

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
				"Set display attribute of the wikilink as the visible name of the environment. If no display value is found, the value of the frontmatter entry 'typst_title' will be used. If that is not found, use the file name if 'Default environment title to file name' is set. Setting any such field to an empty string specifies the absence of a title."
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
	}

	/**
	 * Test a post-conversion command with a placeholder file
	 */
	private async testPostCommand(command: string): Promise<void> {
		if (!command || command.trim() === "") {
			new Notice("No command specified to test");
			return;
		}

		try {
			// Create a temporary test file path
			const testFileName = "mainmd.typ";
			const testFilePath = `C:\\temp\\test_project\\${testFileName}`;

			// Replace the placeholder with the test file path
			const testCommand = command.replace(/\$filepath/g, testFilePath);

			// Show the command that would be executed
			new Notice(`Test command: ${testCommand}`, 8000);

			// Also log to console for debugging
			console.log("Original command:", command);
			console.log("Test file path:", testFilePath);
			console.log("Final test command:", testCommand);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : String(error);
			new Notice(`Command test failed: ${errorMessage}`);
			console.error("Command test error:", error);
		}
	}
}
