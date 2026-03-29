import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';

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

export function makeHtml(tex) {
  const src = tex || '';
  const cssLink = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">';
  const baseStyle = '<style>body{font-family: -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, \'Helvetica Neue\', Arial; padding:20px; color:#111} .katex { font-size: 20px; }</style>';

  if (katexLib && typeof katexLib.renderToString === 'function') {
    let html = escapeHtml(String(src)).replace(/\n/g, '<br>');
    html = html.replace(/\$\$([\s\S]+?)\$\$/g, function(_, expr) {
      try { return katexLib.renderToString(expr, { displayMode: true, throwOnError: false }); } catch (e) { return '<pre>' + escapeHtml(expr) + '</pre>'; }
    });
    html = html.replace(/\$([^$]+?)\$/g, function(_, expr) {
      try { return katexLib.renderToString(expr, { displayMode: false, throwOnError: false }); } catch (e) { return '<code>' + escapeHtml(expr) + '</code>'; }
    });

    return `<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0" />${cssLink}${baseStyle}</head><body><div id="content">${html}</div></body></html>`;
  }

  return `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
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

export async function exportPdfFromText(tex) {
  const html = makeHtml(tex);
  const { uri } = await Print.printToFileAsync({ html });
  if (uri) {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
  }
  return uri;
}

export async function exportPdfFromHtml(html) {
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
  if (uri) {
    await Sharing.shareAsync(uri, { mimeType: 'application/pdf' });
  }
  return uri;
}

export async function exportPngFromRef(ref) {
  if (!ref || !ref.current) throw new Error('No ref provided for PNG export');
  const uri = await captureRef(ref.current, { format: 'png', quality: 0.9 });
  if (uri) await Sharing.shareAsync(uri);
  return uri;
}

export default { makeHtml, exportPdfFromText, exportPngFromRef };
