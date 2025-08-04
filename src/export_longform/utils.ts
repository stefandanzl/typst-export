import { TFile, Notice } from "obsidian";

export function notice_and_warn(message: string) {
	message = "Warning:\n" + message;
	new Notice(message);
	console.warn(message);
}
export function escape_latex(input: string) {
	// Step 1: Apply normal escaping to everything
	let result = input
		.replace(/\\/g, "\\textbackslash")
		.replace(/\{/g, "\\{")
		.replace(/\}/g, "\\}")
		.replace(/%/g, "\\%")
		.replace(/&/g, "\\&")
		.replace(/#/g, "\\#")
		.replace(/\$/g, "\\$")
		.replace(/_/g, "\\_")
		.replace(/\^/g, "\\^{}")
		.replace(/</g, "$<$")
		.replace(/>/g, "$>$")
		.replace(/\|/g, "$|$")
		.replace(/∞/g, "$\\infty$")
		.replace(/±/g, "$\\pm$")
		.replace(/×/g, "$\\times$")
		.replace(/÷/g, "$\\div$")
		.replace(/≠/g, "$\\neq$")
		.replace(/≤/g, "$\\leq$")
		.replace(/≥/g, "$\\geq$")
		.replace(/≈/g, "$\\approx$")
		.replace(/√/g, "$\\sqrt{}$")
		.replace(/∑/g, "$\\sum$")
		.replace(/∏/g, "$\\prod$")
		.replace(/∫/g, "$\\int$")
		.replace(/α/g, "$\\alpha$")
		.replace(/β/g, "$\\beta$")
		.replace(/γ/g, "$\\gamma$")
		.replace(/δ/g, "$\\delta$")
		.replace(/ε/g, "$\\epsilon$")
		.replace(/θ/g, "$\\theta$")
		.replace(/λ/g, "$\\lambda$")
		.replace(/μ/g, "$\\mu$")
		.replace(/π/g, "$\\pi$")
		.replace(/σ/g, "$\\sigma$")
		.replace(/φ/g, "$\\phi$")
		.replace(/ω/g, "$\\omega$")
		.replace(/€/g, "\\euro{}")
		.replace(/£/g, "\\pounds{}")
		.replace(/¥/g, "\\yen{}")
		.replace(/¢/g, "\\cent{}")
		.replace(/©/g, "\\copyright{}")
		.replace(/®/g, "\\textregistered{}")
		.replace(/™/g, "\\texttrademark{}")
		.replace(/…/g, "\\ldots{}")
		.replace(/—/g, "---")
		.replace(/–/g, "--")
		.replace(/†/g, "\\dagger{}")
		.replace(/‡/g, "\\ddagger{}")
		.replace(/¶/g, "\\P{}")
		.replace(/§/g, "\\S{}")
		.replace(/•/g, "\\textbullet{}")
		.replace(/✓/g, "\\checkmark{}")
		.replace(/→/g, "$\\rightarrow$")
		.replace(/←/g, "$\\leftarrow$")
		.replace(/↑/g, "$\\uparrow$")
		.replace(/↓/g, "$\\downarrow$")
		.replace(/↔/g, "$\\leftrightarrow$")
		.replace(/⇒/g, "$\\Rightarrow$")
		.replace(/⇐/g, "$\\Leftarrow$")
		.replace(/⇔/g, "$\\Leftrightarrow$")
		.replace(/∀/g, "$\\forall$")
		.replace(/∃/g, "$\\exists$")
		.replace(/∅/g, "$\\emptyset$")
		.replace(/∈/g, "$\\in$")
		.replace(/∉/g, "$\\notin$")
		.replace(/⊂/g, "$\\subset$")
		.replace(/⊃/g, "$\\supset$")
		.replace(/⊆/g, "$\\subseteq$")
		.replace(/⊇/g, "$\\supseteq$")
		.replace(/∩/g, "$\\cap$")
		.replace(/∪/g, "$\\cup$")
		.replace(/∆/g, "$\\Delta$")
		.replace(/∇/g, "$\\nabla$")
		.replace(/∂/g, "$\\partial$")
		.replace(/ℕ/g, "$\\mathbb{N}$")
		.replace(/ℤ/g, "$\\mathbb{Z}$")
		.replace(/ℚ/g, "$\\mathbb{Q}$")
		.replace(/ℝ/g, "$\\mathbb{R}$")
		.replace(/ℂ/g, "$\\mathbb{C}$")
		.replace(/°/g, "$^{\\circ}$")
		.replace(/‰/g, "\\perthousand{}")
		.replace(/‽/g, "\\textinterrobang{}")
		.replace(/"/g, "``")
		.replace(/"/g, "''")
		.replace(/'/g, "`")
		.replace(/'/g, "'");

	// Step 2: Un-escape allowed LaTeX commands
	result = result
		.replace(/\\textbackslashpagebreak/g, "\\pagebreak")
		.replace(/\\textbackslashnewpage/g, "\\newpage")
		.replace(/\\textbackslashclearpage/g, "\\clearpage")
		.replace(/\\textbackslashtextbf/g, "\\textbf")
		.replace(/\\textbackslashtextit/g, "\\textit")
		.replace(/\\textbackslashemph/g, "\\emph")
		.replace(/\\textbackslashunderline/g, "\\underline")
		.replace(/\\textbackslashtexttt/g, "\\texttt")
		.replace(/\\textbackslashtextsf/g, "\\textsf")
		.replace(/\\textbackslashtextsc/g, "\\textsc")
		.replace(/\\textbackslashfootnote/g, "\\footnote")
		.replace(/\\textbackslashcite/g, "\\cite")
		.replace(/\\textbackslashref/g, "\\ref")
		.replace(/\\textbackslashlabel/g, "\\label")
		.replace(/\\textbackslash\\textbackslash/g, "\\\\")
		.replace(/\\textbackslash,/g, "\\,")
		.replace(/\\textbackslash;/g, "\\;")
		.replace(/\\textbackslash:/g, "\\:")
		.replace(/\\textbackslash!/g, "\\!")
		.replace(/\\textbackslashldots/g, "\\ldots")
		.replace(/\\textbackslashcdots/g, "\\cdots");

	return result;
}

export function find_image_file(
	find_file: (address: string) => TFile | undefined,
	address: string
): TFile | undefined {
	const matchExcalidraw = /^.*\.excalidraw$/.exec(address);
	if (matchExcalidraw !== null) {
		address = matchExcalidraw[0] + ".png";
	}
	return find_file(address);
}

export function strip_newlines(thestring: string): string {
	const result = /^(?:(?:\s*?)\n)*(.*?)(?:\n(?:\s*?))?$/s.exec(thestring);
	if (result === null) {
		throw new Error("result is undefined");
	}
	return result[1];
}


export function escape_typst(input: string): string {
	// Typst has different escape rules than LaTeX
	let result = input
		// Basic escaping for Typst special characters
		.replace(/\\/g, "\\\\")  // Backslash needs escaping
		.replace(/#/g, "\\#")    // Hash needs escaping in content
		.replace(/\$/g, "\\$")   // Dollar needs escaping outside math
		.replace(/`/g, "\\`")    // Backtick for raw strings
		.replace(/\</g, "\\<")   // Less than
		.replace(/\>/g, "\\>")   // Greater than
		.replace(/\[/g, "\\[")   // Square brackets for markup
		.replace(/\]/g, "\\]")
		.replace(/_/g, "\\_")    // Underscore for subscript
		.replace(/\^/g, "\\^")   // Caret for superscript
		.replace(/\*/g, "\\*")   // Asterisk for emphasis
		.replace(/=/g, "\\=")    // Equals for headings
		// Convert Unicode symbols to Typst equivalents
		.replace(/∞/g, "$infinity$")
		.replace(/±/g, "$plus.minus$")
		.replace(/×/g, "$times$")
		.replace(/÷/g, "$div$")
		.replace(/≠/g, "$!=$")
		.replace(/≤/g, "$<=$")
		.replace(/≥/g, "$>=$")
		.replace(/≈/g, "$approx$")
		.replace(/√/g, "$sqrt()$")
		.replace(/∑/g, "$sum$")
		.replace(/∏/g, "$product$")
		.replace(/∫/g, "$integral$")
		.replace(/α/g, "$alpha$")
		.replace(/β/g, "$beta$")
		.replace(/γ/g, "$gamma$")
		.replace(/δ/g, "$delta$")
		.replace(/ε/g, "$epsilon$")
		.replace(/θ/g, "$theta$")
		.replace(/λ/g, "$lambda$")
		.replace(/μ/g, "$mu$")
		.replace(/π/g, "$pi$")
		.replace(/σ/g, "$sigma$")
		.replace(/φ/g, "$phi$")
		.replace(/ω/g, "$omega$")
		.replace(/€/g, "€")  // Typst handles Unicode better
		.replace(/£/g, "£")
		.replace(/¥/g, "¥")
		.replace(/¢/g, "¢")
		.replace(/©/g, "©")
		.replace(/®/g, "®")
		.replace(/™/g, "™")
		.replace(/…/g, "...")
		.replace(/—/g, "---")
		.replace(/–/g, "--")
		.replace(/→/g, "$arrow.r$")
		.replace(/←/g, "$arrow.l$")
		.replace(/↑/g, "$arrow.t$")
		.replace(/↓/g, "$arrow.b$")
		.replace(/↔/g, "$arrow.l.r$")
		.replace(/⇒/g, "$arrow.double.r$")
		.replace(/⇐/g, "$arrow.double.l$")
		.replace(/⇔/g, "$arrow.double.l.r$")
		.replace(/∀/g, "$forall$")
		.replace(/∃/g, "$exists$")
		.replace(/∅/g, "$emptyset$")
		.replace(/∈/g, "$in$")
		.replace(/∉/g, "$in.not$")
		.replace(/⊂/g, "$subset$")
		.replace(/⊃/g, "$supset$")
		.replace(/⊆/g, "$subset.eq$")
		.replace(/⊇/g, "$supset.eq$")
		.replace(/∩/g, "$sect$")
		.replace(/∪/g, "$union$")
		.replace(/∆/g, "$Delta$")
		.replace(/∇/g, "$nabla$")
		.replace(/∂/g, "$diff$")
		.replace(/ℕ/g, "$NN$")
		.replace(/ℤ/g, "$ZZ$")
		.replace(/ℚ/g, "$QQ$")
		.replace(/ℝ/g, "$RR$")
		.replace(/ℂ/g, "$CC$")
		.replace(/°/g, "$degree$")
		// Handle quotes - Typst is more flexible with quotes
		.replace(/"/g, '"')
		.replace(/"/g, '"')
		.replace(/'/g, "'")
		.replace(/'/g, "'");

	return result;
}
