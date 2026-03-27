#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const promoDir = path.join(root, 'assets', 'promo');
const outFile = path.join(root, 'src', 'utils', 'promoAssets.js');

function toPosix(p) {
  return p.split(path.sep).join('/');
}

function build() {
  if (!fs.existsSync(promoDir)) {
    console.error('promo directory not found:', promoDir);
    process.exit(1);
  }

  const files = fs.readdirSync(promoDir).filter((f) => /\.pdf$/i.test(f));
  const mapping = Object.create(null);

  files.forEach((file) => {
    const name = path.basename(file, path.extname(file));
    const parts = name.split('_').map((p) => p.trim()).filter(Boolean);
    // relative path from output file to asset
    let rel = path.relative(path.dirname(outFile), path.join(promoDir, file));
    rel = toPosix(rel);
    if (!rel.startsWith('.')) rel = './' + rel;

    parts.forEach((id) => {
      mapping[id] = mapping[id] || new Set();
      mapping[id].add(rel);
    });
  });

  const ids = Object.keys(mapping).sort();

  const header = `// GENERATED FILE - DO NOT EDIT\n// Run scripts/generate-promo-assets.js to regenerate.\n\n`;
  let body = '';
  body += 'const promos = {' + '\n';
  ids.forEach((id) => {
    const arr = Array.from(mapping[id]);
    const reqs = arr.map((r) => `require('${r}')`).join(', ');
    body += `  '${id}': [ ${reqs} ],\n`;
  });
  body += '};\n\n';

  body += `export function getPromosForEventId(id) { return promos[id] || []; }\n`;
  body += `export default getPromosForEventId;\n`;

  const out = header + body;
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, out, 'utf8');
  console.log('Wrote', outFile);
}

build();
