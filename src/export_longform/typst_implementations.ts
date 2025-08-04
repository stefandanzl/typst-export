// Typst implementations for display elements
// This file contains typst() method implementations that can be added to each node class

import { node, metadata_for_unroll, ExportPluginSettings } from "./interfaces";

// Typst method for DisplayMath class
export async function displayMathTypst(
	this: any,
	buffer: Buffer,
	buffer_offset: number,
	settings: ExportPluginSettings
): Promise<number> {
	let env_name = "equation";
	let content = this.content;
	
	if (this.label !== undefined) {
		// In Typst, equations are labeled differently
		content = `${content} <${this.label}>`;
	}
	
	if (this.explicit_env_name !== undefined) {
		// Handle different math environments
		if (["align", "align*"].includes(this.explicit_env_name)) {
			// Typst uses $ blocks for aligned equations
			buffer_offset += buffer.write("$ ", buffer_offset);
			buffer_offset += buffer.write(content, buffer_offset);
			buffer_offset += buffer.write(" $\n", buffer_offset);
		} else {
			// Default equation block
			buffer_offset += buffer.write("$ ", buffer_offset);
			buffer_offset += buffer.write(content, buffer_offset);
			buffer_offset += buffer.write(" $\n", buffer_offset);
		}
	} else {
		buffer_offset += buffer.write("$ ", buffer_offset);
		buffer_offset += buffer.write(content, buffer_offset);
		buffer_offset += buffer.write(" $\n", buffer_offset);
	}
	
	return buffer_offset;
}

// Typst method for DisplayCode class
export async function displayCodeTypst(
	this: any,
	buffer: Buffer,
	buffer_offset: number,
	settings: ExportPluginSettings
): Promise<number> {
	buffer_offset += buffer.write("```", buffer_offset);
	
	if (this.language) {
		buffer_offset += buffer.write(this.language, buffer_offset);
	}
	
	buffer_offset += buffer.write("\n", buffer_offset);
	buffer_offset += buffer.write(this.code, buffer_offset);
	buffer_offset += buffer.write("\n```\n", buffer_offset);
	
	// Add label if available
	if (this.label) {
		buffer_offset += buffer.write(` <${this.label}>`, buffer_offset);
	}
	
	// Add caption if available
	if (this.caption) {
		buffer_offset += buffer.write(`\n#figure(\n  caption: [${this.caption}],\n  `, buffer_offset);
		buffer_offset += buffer.write("```", buffer_offset);
		if (this.language) {
			buffer_offset += buffer.write(this.language, buffer_offset);
		}
		buffer_offset += buffer.write("\n", buffer_offset);
		buffer_offset += buffer.write(this.code, buffer_offset);
		buffer_offset += buffer.write("\n```\n)\n", buffer_offset);
	}
	
	return buffer_offset;
}

// Typst method for Quote class
export async function quoteTypst(
	this: any,
	buffer: Buffer,
	buffer_offset: number,
	settings: ExportPluginSettings
): Promise<number> {
	// In Typst, comments are written with //
	return buffer_offset + buffer.write("// " + this.content + "\n", buffer_offset);
}

// Typst method for NumberedList class
export async function numberedListTypst(
	this: any,
	buffer: Buffer,
	buffer_offset: number,
	settings: ExportPluginSettings
): Promise<number> {
	for (const item of this.content) {
		buffer_offset += buffer.write("+ ", buffer_offset);
		for (const element of item) {
			buffer_offset = await element.typst(buffer, buffer_offset, settings);
		}
	}
	buffer_offset += buffer.write("\n", buffer_offset);
	return buffer_offset;
}

// Typst method for UnorderedList class
export async function unorderedListTypst(
	this: any,
	buffer: Buffer,
	buffer_offset: number,
	settings: ExportPluginSettings
): Promise<number> {
	for (const item of this.content) {
		buffer_offset += buffer.write("- ", buffer_offset);
		for (const element of item) {
			buffer_offset = await element.typst(buffer, buffer_offset, settings);
		}
	}
	buffer_offset += buffer.write("\n", buffer_offset);
	return buffer_offset;
}

// Typst method for Comment class
export async function commentTypst(
	this: any,
	buffer: Buffer,
	buffer_offset: number,
	settings: ExportPluginSettings
): Promise<number> {
	return buffer_offset + buffer.write("// " + this.content + "\n", buffer_offset);
}
