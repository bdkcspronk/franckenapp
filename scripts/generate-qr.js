#!/usr/bin/env node
// Node script to generate an SVG QR code for a member ID + HMAC secret.
// Usage:
//   SECRET=some_secret node scripts/generate-qr.js MEMBER_ID [output.svg]

const crypto = require('crypto');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.error('Usage: SECRET=your_secret node scripts/generate-qr.js MEMBER_ID [output.svg]');
    process.exit(2);
  }

  const memberId = args[0];
  const outFile = args[1] || `qr-${memberId}.svg`;
  const secret = process.env.SECRET;
  if (!secret) {
    console.error('Please set SECRET environment variable. Example: SECRET=mysecret');
    process.exit(2);
  }

  // Create timestamped signed payload and base64-encode JSON { id, ts, sig }
  const ts = new Date().toISOString();
  const sig = crypto.createHmac('sha256', secret).update(`${memberId}|${ts}`).digest('hex');
  const obj = { id: memberId, ts, sig };
  const payload = Buffer.from(JSON.stringify(obj)).toString('base64');

  try {
    const svg = await qrcode.toString(payload, { type: 'svg', margin: 1, width: 300 });
    const outPath = path.resolve(process.cwd(), outFile);
    fs.writeFileSync(outPath, svg, 'utf8');
    console.log('Wrote QR SVG to', outPath);
  } catch (err) {
    console.error('Failed to generate QR', err);
    process.exit(1);
  }
}

main();
