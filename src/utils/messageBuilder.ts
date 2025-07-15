/**
 * Utility class for building export status messages
 */
export class ExportMessageBuilder {
	private messages: string[] = [];

	constructor(baseMessage: string = "SUCCESS!!\nExporting the current file:\n") {
		this.messages.push(baseMessage);
	}

	/**
	 * Add a message about preamble file handling
	 */
	addPreambleMessage(action: 'overwriting' | 'copying' | 'none' | 'not_found'): this {
		switch (action) {
			case 'overwriting':
				this.messages.push("- Overwriting the preamble file");
				break;
			case 'copying':
				this.messages.push("- Copying the preamble file");
				break;
			case 'none':
				this.messages.push("- Without overwriting the preamble file");
				break;
			case 'not_found':
				this.messages.push("- Without a preamble file (none found)");
				break;
		}
		return this;
	}

	/**
	 * Add a message about header file handling
	 */
	addHeaderMessage(action: 'overwriting' | 'creating' | 'none'): this {
		switch (action) {
			case 'overwriting':
				this.messages.push("- Overwriting the header file");
				break;
			case 'creating':
				this.messages.push("- Creating the header file");
				break;
			case 'none':
				this.messages.push("- Without overwriting the header file");
				break;
		}
		return this;
	}

	/**
	 * Add a message about bibliography file handling
	 */
	addBibMessage(action: 'copying' | 'none' | 'not_found'): this {
		switch (action) {
			case 'copying':
				this.messages.push("- Copying the bib file");
				break;
			case 'none':
				this.messages.push("- Without overwriting the bib file");
				break;
			case 'not_found':
				this.messages.push("- Without a bib file (none found)");
				break;
		}
		return this;
	}

	/**
	 * Add a message about template usage
	 */
	addTemplateMessage(usingTemplate: boolean): this {
		if (usingTemplate) {
			this.messages.push("- Using the specified template file");
		}
		return this;
	}

	/**
	 * Add a message about figure file handling
	 */
	addFiguresMessage(action: 'copying' | 'overwriting' | 'none', filename?: string): this {
		switch (action) {
			case 'copying':
				this.messages.push("- Copying figure files");
				break;
			case 'overwriting':
				if (filename) {
					this.messages.push(`- Overwriting figure file: ${filename}`);
				} else {
					this.messages.push("- Overwriting figure files");
				}
				break;
			case 'none':
				this.messages.push("- Without overwriting figure files");
				break;
		}
		return this;
	}

	/**
	 * Add a custom message
	 */
	addCustomMessage(message: string): this {
		this.messages.push(message);
		return this;
	}

	/**
	 * Build the final message with output location
	 */
	build(outputLocation: string, isExternal: boolean = false): string {
		const locationText = isExternal 
			? `To external folder: ${outputLocation}`
			: `To the vault folder inside the vault:\n${outputLocation}/`;
		
		return this.messages.join('\n') + '\n' + locationText;
	}

	/**
	 * Get the current message without location
	 */
	getCurrentMessage(): string {
		return this.messages.join('\n');
	}
}
