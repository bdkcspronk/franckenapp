function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatDate(d = new Date()) {
  return d.toLocaleDateString();
}

function splitPoints(pointsText) {
  if (!pointsText) return [];
  // Split by newline only so users can enter free-form text with returns.
  return pointsText.split(/\r?\n/).map((p) => p.trim()).filter(Boolean);
}

export function generateAgendaHtml({ title = 'Agenda', pointsText = '', chairName = '', attendees = [], date = null, location = '', preview = false, previewScale = null, committeeImage = null } = {}) {
  const dateVal = date ? formatDate(new Date(date)) : formatDate(new Date());
  const points = splitPoints(pointsText);

  // Helpers: determine list type from a token
  function tokenToType(token) {
    if (/^[0-9]+$/.test(token)) return '1';
    if (/^[ivxlcdm]+$/i.test(token)) {
      // choose uppercase type 'I' when token is uppercase, otherwise 'i'
      return token === token.toUpperCase() ? 'I' : 'i';
    }
    if (/^[a-z]$/.test(token)) return 'a';
    if (/^[A-Z]$/.test(token)) return 'A';
    return '1';
  }

  const segmentPattern = '(?:[0-9]+|[A-Za-z]|[IVXLCDMivxlcdm]+)';
  const tokensRegex = new RegExp('^\\s*(' + segmentPattern + '(?:\\.' + segmentPattern + ')*)[\\.\\)]?\\s+(.*)$');

  // Build a nested tree from lines using the token path when present.
  const root = { children: [] };
  let foundTokens = false;
  for (const line of points) {
    const m = line.match(tokensRegex);
    if (!m) {
      root.children.push({ text: line });
      continue;
    }
    foundTokens = true;
    const tokens = m[1].split('.');
    const content = m[2].trim();

    let node = root;
    for (const tok of tokens) {
      const last = node.children.length ? node.children[node.children.length - 1] : null;
      if (last && last.token === tok) {
        node = last;
      } else {
        const child = { token: tok, type: tokenToType(tok), children: [], text: null };
        node.children.push(child);
        node = child;
      }
    }
    node.text = content;
  }

  // If the user provided no explicit labels at all, add default numeric
  // sectioning (1., 2., 3., ...) for each top-level line so plain lists
  // become numbered agendas by default.
  if (!foundTokens && root.children && root.children.length) {
    root.children = root.children.map((n, idx) => {
      if (n && n.text && !n.token) {
        return { token: String(idx + 1), type: '1', children: [], text: n.text };
      }
      return n;
    });
  }

  function renderNodes(nodes, prefix = []) {
    let out = '';
    for (const n of nodes) {
      if (n.token) {
        const labelParts = [...prefix, n.token];
        const label = labelParts.join('.');
        out += `<div class="point"><span class="label">${escapeHtml(label)}.</span> ${n.text ? escapeHtml(n.text) : ''}</div>`;
        if (n.children && n.children.length) {
          out += `<div class="nested">${renderNodes(n.children, labelParts)}</div>`;
        }
      } else if (n.text) {
        out += `<div class="point">${escapeHtml(n.text)}</div>`;
      }
    }
    return out;
  }

  const itemsHtml = renderNodes(root.children);

  const attendeesHtml = (attendees && attendees.length) ? `<div class="attendees"><em>Attendees:</em> <em>${escapeHtml(attendees.join(', '))}</em></div>` : '';

  // Build a viewport meta tag. For interactive previews we allow an
  // initial-scale to be provided so the WebView can show the whole page
  // zoomed-out by default. For exported PDFs we keep the default 1.0.
  const metaViewport = preview && previewScale ?
    `width=device-width, initial-scale=${previewScale}, maximum-scale=10.0, user-scalable=yes` :
    `width=device-width, initial-scale=1.0, maximum-scale=10., user-scalable=yes`;

  const html = `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="${metaViewport}" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <style>
      @page { size: A4; margin: 10mm; }
      html, body { width: 210mm; min-height: 297mm; }
      body { margin:0; padding:10mm; box-sizing:border-box; font-family: 'Gill Sans MT Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111; overflow:auto; -webkit-overflow-scrolling: touch; touch-action: pan-y; position:relative; background-color: #ffffff; }
      .bg-image { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:70%; max-width:70%; opacity:0.2;  height:auto; }
      .content { position:relative; z-index:1; }
      .title { text-align:center; margin-bottom:8px; }
      .title-rule { border: none; border-top: 1px solid #d0d0d0; margin: 10px auto 16px; width: 100%; }
      .byline { text-align:center; margin-bottom:18px; color:#555 }
      .summary { column-count: 2; column-gap: 28px; margin-bottom:20px; }
      .point { break-inside: avoid-column; page-break-inside: avoid; margin-bottom:6px; }
      .point .label { font-weight:600; margin-right:8px; }
      .nested { margin-left: 1.25rem; }
      .attendees { margin-top:24px; font-size:0.95rem; color:#333 }
      .meta .left { font-weight:600 }
    </style>
  </head>
  <body>
    ${committeeImage ? `<img class="bg-image" src="${committeeImage}" alt="" style="background:transparent" />` : ''}
    <div class="content">
      <div class="title"><h1>${escapeHtml(title)}</h1></div>
      <hr class="title-rule" />
      <div class="byline">${escapeHtml(dateVal)}${location ? ' • ' + escapeHtml(location) : ''} — <em>made by: ${escapeHtml(chairName)}</em></div>
      <div class="summary">
        ${itemsHtml}
      </div>
      ${attendeesHtml}
    </div>
  </body>
</html>`;

  return html;
}

export default { generateAgendaHtml };

// If the provided plain-text points do not contain any explicit numbering/token
// labels, return a new text where each non-empty line is prefixed with a
// numeric label ("1. ", "2. ", ...). If tokens are already present the
// original text is returned unchanged.
export function addDefaultNumbering(pointsText) {
  if (!pointsText) return pointsText;
  const lines = pointsText.split(/\r?\n/).map((p) => p.trim()).filter(Boolean);
  if (!lines.length) return pointsText;

  const segmentPattern = '(?:[0-9]+|[A-Za-z]|[IVXLCDMivxlcdm]+)';
  const tokensRegex = new RegExp('^\\s*(' + segmentPattern + '(?:\\.' + segmentPattern + ')*)[\\.\\)]?\\s+');

  // If any line already matches the token pattern, don't modify.
  for (const line of lines) {
    if (tokensRegex.test(line)) return pointsText;
  }

  // Otherwise prefix numeric labels
  return lines.map((l, i) => `${i + 1}. ${l}`).join('\n');
}

// Generate a simple LaTeX representation of the agenda. This keeps the
// same token-parsing logic as the HTML generator and produces a .tex
// document suitable for compilation with pdfLaTeX/xelatex/lualatex.
export function generateAgendaTex({ title = 'Agenda', pointsText = '', chairName = '', attendees = [], date = null, location = '', committeeName = '' } = {}) {
  const dateVal = date ? formatDate(new Date(date)) : formatDate(new Date());
  const points = splitPoints(pointsText);

  const segmentPattern = '(?:[0-9]+|[A-Za-z]|[IVXLCDMivxlcdm]+)';
  const tokensRegex = new RegExp('^\\s*(' + segmentPattern + '(?:\\.' + segmentPattern + ')*)[\\.\\)]?\\s+(.*)$');

  // Build the same nested tree as the HTML generator
  const root = { children: [] };
  let foundTokens = false;
  for (const line of points) {
    const m = line.match(tokensRegex);
    if (!m) {
      root.children.push({ text: line });
      continue;
    }
    foundTokens = true;
    const tokens = m[1].split('.');
    const content = m[2].trim();
    let node = root;
    for (const tok of tokens) {
      const last = node.children.length ? node.children[node.children.length - 1] : null;
      if (last && last.token === tok) {
        node = last;
      } else {
        const child = { token: tok, children: [], text: null };
        node.children.push(child);
        node = child;
      }
    }
    node.text = content;
  }

  // If no explicit tokens were provided, use enumerate environments
  if (!foundTokens && root.children && root.children.length) {
    // wrap plain lines into nodes so the rendering code can use enumerate
    root.children = root.children.map((n, idx) => {
      if (n && n.text && !n.token) {
        return { token: String(idx + 1), children: [], text: n.text };
      }
      return n;
    });
  }

  function escapeLaTeX(s) {
    if (s == null) return '';
    return String(s)
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/&/g, '\\&')
      .replace(/%/g, '\\%')
      .replace(/\$/g, '\\$')
      .replace(/#/g, '\\#')
      .replace(/_/g, '\\_')
      .replace(/[{}]/g, function(m) { return '\\' + m; })
      .replace(/\^/g, '\\^{}')
      .replace(/~/g, '\\~{}')
      .replace(/</g, '\\textless{}')
      .replace(/>/g, '\\textgreater{}');
  }

  function renderEnum(nodes, level = 1) {
    let out = '';
    out += '\\begin{enumerate}\n';
    for (const n of nodes) {
      out += `\\item ${escapeLaTeX(n.text || '')}\\n`;
      if (n.children && n.children.length) {
        out += renderEnum(n.children, level + 1);
      }
    }
    out += '\\end{enumerate}\n';
    return out;
  }

  function renderLabeled(nodes) {
    let out = '';
    out += '\\begin{description}\n';
    for (const n of nodes) {
      const label = n.token ? escapeLaTeX(n.token) : '';
      out += `\\item[${label}.] ${escapeLaTeX(n.text || '')}\\n`;
      if (n.children && n.children.length) {
        out += renderLabeled(n.children);
      }
    }
    out += '\\end{description}\n';
    return out;
  }

  const preamble = [
    '\\documentclass[12pt,a4paper]{article}',
    "\\usepackage[utf8]{inputenc}",
    "\\usepackage{lmodern}",
    "\\usepackage{amsmath,amssymb}",
    "\\usepackage{graphicx}",
    "\\usepackage{enumitem}",
    "\\usepackage[margin=20mm]{geometry}",
    "\\setlist[enumerate,1]{label=\\arabic*.}",
    "\\setlist[enumerate,2]{label=\\alph*.}",
    "\\setlist[enumerate,3]{label=\\roman*.}",
    '\\begin{document}'
  ].join('\n');

  const titleBlock = `\\begin{center}\\LARGE ${escapeLaTeX(title)}\\end{center}\\vspace{0.5em}\\hrule\\vspace{1em}`;

  // Always use default.png for the committee image
  const imageBlock = `\\IfFileExists{default.png}{\\begin{center}\\includegraphics[width=0.7\\linewidth]{default.png}\\end{center}}{}\\vspace{1em}`;
  const byline = `\\textit{${escapeLaTeX(dateVal)}${location ? ' \\textbullet{} ' + escapeLaTeX(location) : ''} \\textemdash{} made by: \\textit{${escapeLaTeX(chairName)}}}`;

  const body = (!foundTokens) ? renderEnum(root.children) : renderLabeled(root.children);

  const attendeesLine = (attendees && attendees.length) ? `\\vspace{1em}\\textit{Attendees: ${escapeLaTeX(attendees.join(', '))}}\\n` : '';

  const ending = '\\end{document}';

  return [preamble, titleBlock, imageBlock, '\\vspace{0.5em}', byline, '\\vspace{1em}', body, attendeesLine, ending].join('\\n\\n');
}
