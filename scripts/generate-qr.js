#!/usr/bin/env node
// Purpose: CLI to generate QR payloads (SVG) for member IDs using configured secret.
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

  // Create timestamped signed payload.
  // If COMPACT=1/--compact or PACKED=1/--packed passed, emit alternative formats.
  const compactFlag = process.env.COMPACT === '1' || args.includes('--compact');
  const packedFlag = process.env.PACKED === '1' || args.includes('--packed');
  let payload;
  if (packedFlag) {
    // Packed numeric format: base64 of binary [4B id][4B ts][32B HMAC]
    const idNum = parseInt(String(memberId), 10);
    if (!Number.isFinite(idNum) || idNum < 0) {
      console.error('memberId must be a non-negative integer for packed format');
      process.exit(2);
    }
    const tsSec = Math.floor(Date.now() / 1000);
    const idHex = idNum.toString(16).padStart(8, '0');
    const tsHex = tsSec.toString(16).padStart(8, '0');
    const sigBuf = crypto.createHmac('sha256', secret).update(idHex + tsHex).digest();
    const packedHex = idHex + tsHex + sigBuf.toString('hex');
    payload = Buffer.from(packedHex, 'hex').toString('base64');
  } else if (compactFlag) {
    const ts36 = Math.floor(Date.now() / 1000).toString(36);
    const sigBuf = crypto.createHmac('sha256', secret).update(`${memberId}|${ts36}`).digest();
    const sigB64 = sigBuf.toString('base64');
    payload = `${memberId}|${ts36}|${sigB64}`;
  } else {
    // Legacy JSON base64 format
    const ts = new Date().toISOString();
    const sig = crypto.createHmac('sha256', secret).update(`${memberId}|${ts}`).digest('hex');
    const obj = { id: memberId, ts, sig };
    payload = Buffer.from(JSON.stringify(obj)).toString('base64');
  }

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
