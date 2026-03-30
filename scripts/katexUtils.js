import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { Asset } from 'expo-asset';
import { File, Directory, Paths } from 'expo-file-system';

let katexLib = null;
try {
  // optional dependency: if installed, use it to render KaTeX to HTML on-device
  // npm install katex
  // eslint-disable-next-line global-require
  katexLib = require('katex');
} catch (e) {
  katexLib = null;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function makeHtml(tex, { preview = false, previewScale = null } = {}) {
  const src = tex || '';
  const cssLink = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">';
  // baseStyle sets the desired font-family and page size for printing; actual
  // @font-face rules are injected into the final HTML by `embedLocalFontsInHtml`.
  const baseStyle = `<style>
    @page { size: A4; margin: 20mm; }
    html, body { width: 210mm; min-height: 297mm; }
    body { margin:0; padding:20mm; box-sizing:border-box; font-family: 'Gill Sans MT Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111 }
    .katex { font-size: 20px; }
  </style>`;

  if (katexLib && typeof katexLib.renderToString === 'function') {
    let html = escapeHtml(String(src)).replace(/\n/g, '<br>');
    html = html.replace(/\$\$([\s\S]+?)\$\$/g, function(_, expr) {
      try { return katexLib.renderToString(expr, { displayMode: true, throwOnError: false }); } catch (e) { return '<pre>' + escapeHtml(expr) + '</pre>'; }
    });
    html = html.replace(/\$([^$]+?)\$/g, function(_, expr) {
      try { return katexLib.renderToString(expr, { displayMode: false, throwOnError: false }); } catch (e) { return '<code>' + escapeHtml(expr) + '</code>'; }
    });

    const meta = preview && previewScale ?
      `width=device-width, initial-scale=${previewScale}, maximum-scale=5.0, user-scalable=yes` :
      `width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes`;
    return `<!doctype html><html><head><meta name="viewport" content="${meta}" />${cssLink}${baseStyle}</head><body><div id="content">${html}</div></body></html>`;
  }

  const meta = preview && previewScale ?
    `width=device-width, initial-scale=${previewScale}, maximum-scale=5.0, user-scalable=yes` :
    `width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes`;

  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="${meta}" />
    ${cssLink}
    ${baseStyle}
  </head>
  <body>
    <div id="content"></div>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
    <script>
      try {
        const src = ${JSON.stringify(src)};
        function escapeHtml(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
        let html = escapeHtml(String(src)).replace(/\n/g, '<br>');
        html = html.replace(/\$\$([\s\S]+?)\$\$/g, function(_, expr) { try { return katex.renderToString(expr, {displayMode:true, throwOnError:false}); } catch (e) { return '<pre>'+escapeHtml(expr)+'</pre>'; } });
        html = html.replace(/\$([^$]+?)\$/g, function(_, expr) { try { return katex.renderToString(expr, {displayMode:false, throwOnError:false}); } catch (e) { return '<code>'+escapeHtml(expr)+'</code>'; } });
        document.getElementById('content').innerHTML = html;
      } catch (e) { document.getElementById('content').innerText = 'Render error: '+e.message }
    </script>
  </body>
</html>`;
}

async function _readAssetBase64(moduleId) {
  try {
    const asset = Asset.fromModule(moduleId);
    // ensure asset is downloaded / available locally
    try { await asset.downloadAsync(); } catch (e) { /* already available or download not needed */ }
    const uri = asset.localUri || asset.uri;
    if (!uri) return null;
    try {
      const f = new File(uri);
      if (typeof f.base64 === 'function') {
        return await f.base64();
      }
    } catch (e) {
      // fallthrough to null
    }
    return null;
  } catch (e) {
    return null;
  }
}

export async function embedLocalFontsInHtml(html) {
  try {
    const fontCss = await getEmbeddedFontCss();
    if (!fontCss) return html;
    if (html.indexOf('</head>') !== -1) {
      return html.replace('</head>', `${fontCss}\n</head>`);
    }
    return fontCss + html;
  } catch (e) {
    return html;
  }
}

let _cachedFontCss = null;
export async function getEmbeddedFontCss() {
  try {
    if (_cachedFontCss) return _cachedFontCss;
    const bookModule = require('../assets/fonts/GillSansMTPro-Book.otf');
    const italicModule = require('../assets/fonts/GillSansMTPro-BookItalic.otf');
    const boldModule = require('../assets/fonts/GillSansMTPro-Bold.otf');
    const [bookB64, italicB64, boldB64] = await Promise.all([
      _readAssetBase64(bookModule),
      _readAssetBase64(italicModule),
      _readAssetBase64(boldModule),
    ]);
    if (!bookB64) return null;
    const fontCss = `<style>
      @font-face{font-family:'Gill Sans MT Pro'; src: url(data:font/otf;base64,${bookB64}) format('opentype'); font-weight:400; font-style:normal; font-display:swap;}
      ${italicB64 ? `@font-face{font-family:'Gill Sans MT Pro'; src: url(data:font/otf;base64,${italicB64}) format('opentype'); font-weight:400; font-style:italic; font-display:swap;}` : ''}
      ${boldB64 ? `@font-face{font-family:'Gill Sans MT Pro'; src: url(data:font/otf;base64,${boldB64}) format('opentype'); font-weight:700; font-style:normal; font-display:swap;}` : ''}
    </style>`;
    _cachedFontCss = fontCss;
    return fontCss;
  } catch (e) {
    return null;
  }
}

export async function exportPdfFromText(tex, filename) {
  const html = makeHtml(tex);
  return exportPdfFromHtml(html, filename);
}

export async function exportPdfFromHtml(html, filename) {
  // If katexLib is available, pre-render any math in the HTML string so PDF contains rendered math.
  let out = html;
  if (katexLib && typeof katexLib.renderToString === 'function') {
    out = out.replace(/\$\$([\s\S]+?)\$\$/g, function(_, expr) {
      try { return katexLib.renderToString(expr, { displayMode: true, throwOnError: false }); } catch (e) { return '<pre>' + escapeHtml(expr) + '</pre>'; }
    });
    out = out.replace(/\$([^$]+?)\$/g, function(_, expr) {
      try { return katexLib.renderToString(expr, { displayMode: false, throwOnError: false }); } catch (e) { return '<code>' + escapeHtml(expr) + '</code>'; }
    });
  }

  const { uri } = await Print.printToFileAsync({ html: out });
  if (!uri) return null;

  // If a filename was provided, move the generated file into cache with the desired name
  if (filename) {
    try {
      const safeName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;
      const generated = new File(uri);
      const destFile = new File(Paths.cache, safeName);
      try { if (destFile.exists) destFile.delete(); } catch (e) {}
      try {
        // prefer moving the generated file into place
        generated.move(destFile);
      } catch (e) {
        try { generated.copy(destFile); } catch (e2) {
          // fallback to sharing original uri
          await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
          return uri;
        }
      }
      await Sharing.shareAsync(destFile.uri, { mimeType: 'application/pdf' });
      return destFile.uri;
    } catch (e) {
      // fallback to sharing original uri
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
      return uri;
    }
  }

  await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
  return uri;
}

export async function exportPngFromRef(ref) {
  if (!ref || !ref.current) throw new Error('No ref provided for PNG export');
  const uri = await captureRef(ref.current, { format: 'png', quality: 0.9 });
  if (uri) await Sharing.shareAsync(uri);
  return uri;
}

export async function exportTexFromString(tex, filename) {
  try {
    const name = filename || `agenda-${Date.now()}.tex`;
    const destFile = new File(Paths.cache, name);
    try { if (destFile.exists) destFile.delete(); } catch (e) {}
    // write accepts string or bytes; write may be synchronous — awaiting a
    // non-promise is safe here.
    destFile.write(tex);
    if (destFile.uri) {
      await Sharing.shareAsync(destFile.uri, { mimeType: 'text/x-tex' });
    }
    return destFile.uri;
  } catch (e) {
    throw e;
  }
}

// Return a data URI (base64) for an asset module (e.g. require('../assets/...'))
export async function getAssetDataUri(moduleId) {
  try {
    const b64 = await _readAssetBase64(moduleId);
    if (!b64) return null;
    // Assume PNG for committee images; adjust if you add JPG support later.
    return `data:image/png;base64,${b64}`;
  } catch (e) {
    return null;
  }
}

export default { makeHtml, exportPdfFromText, exportPngFromRef, exportTexFromString };
