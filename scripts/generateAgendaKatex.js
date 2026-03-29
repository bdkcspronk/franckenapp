function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function formatDate(d = new Date()) {
  return d.toLocaleDateString();
}

function splitPoints(pointsText) {
  if (!pointsText) return [];
  // Split by comma or newline, keep order
  return pointsText.split(/\r?\n|,/).map((p) => p.trim()).filter(Boolean);
}

export function generateAgendaHtml({ title = 'Agenda', pointsText = '', chairName = '', attendees = [] } = {}) {
  const date = formatDate(new Date());
  const points = splitPoints(pointsText);

  // Build two-column HTML summary using CSS columns
  const itemsHtml = points.map((p, i) => `<div class="point"><span class="num">${escapeHtml(String(i))}.</span> <span class="text">${escapeHtml(p)}</span></div>`).join('');

  const attendeesHtml = (attendees && attendees.length) ? `<div class="attendees"><strong>Attendees:</strong> ${escapeHtml(attendees.join(', '))}</div>` : '';

  const html = `<!doctype html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; color:#111; padding:24px; }
      .title { text-align:center; margin-bottom:8px; }
      .byline { text-align:center; margin-bottom:18px; color:#555 }
      .summary { column-count: 2; column-gap: 28px; margin-bottom:20px; }
      .point { break-inside: avoid; margin-bottom:6px; }
      .num { font-weight:600; margin-right:6px; }
      .attendees { margin-top:24px; font-size:0.95rem; color:#333 }
      .meta { display:flex; justify-content:space-between; margin-bottom:18px; }
      .meta .left { font-weight:600 }
    </style>
  </head>
  <body>
    <div class="title"><h1>${escapeHtml(title)}</h1></div>
    <div class="byline">${escapeHtml(date)} — made by: <em>${escapeHtml(chairName)}</em></div>
    <div class="summary">
      ${itemsHtml}
    </div>
    ${attendeesHtml}
  </body>
</html>`;

  return html;
}

export default { generateAgendaHtml };
