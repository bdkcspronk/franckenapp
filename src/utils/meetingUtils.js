import { makeHtml, exportPdfFromHtml, embedLocalFontsInHtml, getEmbeddedFontCss, exportTexFromString, getAssetDataUri } from '../../scripts/katexUtils';
import { generateAgendaHtml, addDefaultNumbering, generateAgendaTex } from '../../scripts/generateAgendaKatex';
// use the default committee image asset directly
const defaultCommitteeModule = require('../../assets/committees/default.png');

// Build HTML for an agenda. If `katexInput` is provided, it's treated as raw
// KaTeX/html input and passed to `makeHtml`. The returned HTML will have
// local fonts embedded via `embedLocalFontsInHtml`.
export async function buildAgendaHtml(data = {}, options = {}) {
  const { title = '', pointsText = '', chairName = '', attendees = [], date = '', location = '', katexInput = '' } = data;
  const preview = !!options.preview;
  const previewScale = options.previewScale || 1;

  // Try to resolve a committee image asset (prefer committee-specific, fall back to default)
  let committeeImageDataUri = null;
  try {
    if (defaultCommitteeModule) committeeImageDataUri = await getAssetDataUri(defaultCommitteeModule);
  } catch (e) {
    // ignore image embedding errors
  }

  const rawHtml = (katexInput && katexInput.trim())
    ? makeHtml(katexInput, { preview, previewScale })
    : generateAgendaHtml({ title, pointsText, chairName, attendees, date, location, preview, previewScale, committeeImage: committeeImageDataUri });

  // embed fonts (converts local assets to base64 and injects @font-face rules)
  const html = await embedLocalFontsInHtml(rawHtml);
  return html;
}

export async function exportAgendaPdf(data = {}, filename) {
  const html = await buildAgendaHtml(data, { preview: false });
  return exportPdfFromHtml(html, filename);
}

export async function buildAgendaTex(data = {}) {
  const { title = '', pointsText = '', chairName = '', attendees = [], date = '', location = '', katexInput = '' } = data;
  // For now the TeX generator ignores katexInput and builds from structured agenda data
  const committeeName = data.committeeName || data.committee || '';
  const tex = generateAgendaTex({ title, pointsText, chairName, attendees, date, location, committeeName });
  return tex;
}

export async function exportAgendaTex(data = {}, filename) {
  const tex = await buildAgendaTex(data);
  return exportTexFromString(tex, filename);
}

export { getEmbeddedFontCss };

export function ensureNumberedPoints(pointsText) {
  return addDefaultNumbering(pointsText);
}

export default {
  buildAgendaHtml,
  exportAgendaPdf,
  buildAgendaTex,
  exportAgendaTex,
  getEmbeddedFontCss,
  ensureNumberedPoints,
};
