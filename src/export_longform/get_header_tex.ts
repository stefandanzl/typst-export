export function get_header_tex() {
	return `\\usepackage{amsmath}
\\usepackage{amsthm}
\\usepackage{biblatex}
\\usepackage{graphicx}

\\usepackage{cleveref}

\\usepackage{listings}
\\usepackage{xcolor}
\\lstset{
    basicstyle=\\ttfamily,
    breaklines=true,
    showstringspaces=false,
    commentstyle=\\color{gray},
    keywordstyle=\\color{blue},
    stringstyle=\\color{red}
}

\\theoremstyle{plain}
\\newtheorem{theorem}{Theorem}[section]
\\newtheorem{corollary}{Corollary}[section]
\\newtheorem{lemma}{Lemma}[section]
\\newtheorem{proposition}{Proposition}[section]

\\theoremstyle{definition}
\\newtheorem{definition}{Definition}[section]
\\newtheorem{example}{Example}

\\theoremstyle{remark}
\\newtheorem{remark}{Remark}[section]
\\newtheorem{fact}[remark]{Fact}
`;
}

// \\usepackage{hyperref}
