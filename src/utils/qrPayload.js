// Utilities to create and decode a timestamped, signed QR payload.
// Payload format (base64-encoded JSON): { id, ts, sig }
// where `sig` = HMAC-SHA256(id + '|' + ts, secret) as hex.
// This file runs in-app (React Native / Expo) and uses `crypto-js`.
// Install: `npm install crypto-js`

// Purpose: Encode/decode member QR payloads; provides compact and packed payload utilities.
import HmacSHA256 from 'crypto-js/hmac-sha256';
import Hex from 'crypto-js/enc-hex';
import Utf8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';

// Legacy JSON base64 format (kept for compatibility)
export function makeQrPayload(memberId, secret, now = null) {
  const ts = now ? new Date(now).toISOString() : new Date().toISOString();
  const sig = HmacSHA256(`${memberId}|${ts}`, secret).toString(Hex);
  const obj = { id: memberId, ts, sig };
  const json = JSON.stringify(obj);
  const wordArray = Utf8.parse(json);
  const b64 = Base64.stringify(wordArray);
  return b64;
}

export function decodeQrPayload(payloadB64, secret, ttlSeconds = 300) {
  try {
    const wordArray = Base64.parse(payloadB64);
    const json = Utf8.stringify(wordArray);
    const obj = JSON.parse(json);
    if (!obj.id || !obj.ts || !obj.sig) return { ok: false, reason: 'invalid_format' };
    const expected = HmacSHA256(`${obj.id}|${obj.ts}`, secret).toString(Hex);
    const sigMatches = expected === obj.sig;

    // TTL check (optional)
    let withinTtl = true;
    let age = null;
    try {
      const tsMs = Date.parse(obj.ts);
      age = Date.now() - tsMs;
      if (ttlSeconds != null) withinTtl = age <= ttlSeconds * 1000;
    } catch (e) {
      withinTtl = false;
    }

    const valid = sigMatches && withinTtl;
    return { ok: true, valid, id: obj.id, ts: obj.ts, age, withinTtl, sigMatches };
  } catch (e) {
    return { ok: false, reason: 'parse_error' };
  }
}

// Compact format: "id|ts36|sigBase64"
// - ts36 is seconds since epoch in base36 (short)
// - sig is raw HMAC-SHA256 bytes encoded as base64 (shorter than hex)
export function makeCompactQrPayload(memberId, secret, now = null) {
  const tsMs = now ? Date.parse(now) : Date.now();
  const ts36 = Math.floor(tsMs / 1000).toString(36);
  const sigWord = HmacSHA256(`${memberId}|${ts36}`, secret);
  const sigB64 = Base64.stringify(sigWord);
  return `${memberId}|${ts36}|${sigB64}`;
}

export function decodeCompactQrPayload(payload, secret, ttlSeconds = 300) {
  try {
    const parts = payload.split('|');
    if (parts.length !== 3) return { ok: false, reason: 'invalid_format' };
    const [id, ts36, sigB64] = parts;
    const tsMs = parseInt(ts36, 36) * 1000;
    if (!id || Number.isNaN(tsMs) || !sigB64) return { ok: false, reason: 'invalid_format' };

    const expected = Base64.stringify(HmacSHA256(`${id}|${ts36}`, secret));
    const sigMatches = expected === sigB64;

    let withinTtl = true;
    let age = null;
    try {
      age = Date.now() - tsMs;
      if (ttlSeconds != null) withinTtl = age <= ttlSeconds * 1000;
    } catch (e) {
      withinTtl = false;
    }

    const valid = sigMatches && withinTtl;
    return { ok: true, valid, id, ts: new Date(tsMs).toISOString(), age, withinTtl, sigMatches };
  } catch (e) {
    return { ok: false, reason: 'parse_error' };
  }
}

// Packed numeric format (very compact): binary fields encoded as base64
// Layout (hex representation): [4 bytes memberId][4 bytes tsSeconds][N bytes truncated HMAC]
// Example: id and ts are fixed 4-byte big-endian integers. HMAC-SHA256 computed over idHex+tsHex
// and truncated to `sigBytes` bytes. The final payload is base64 of the binary data.
export function makePackedNumericPayload(memberId, secret, now = null, sigBytes = 32) {
  const idNum = typeof memberId === 'number' ? memberId : parseInt(String(memberId), 10);
  if (!Number.isFinite(idNum) || idNum < 0) throw new Error('memberId must be a non-negative integer');
  const tsMs = now ? Date.parse(now) : Date.now();
  const tsSec = Math.floor(tsMs / 1000);

  const idHex = idNum.toString(16).padStart(8, '0');
  const tsHex = tsSec.toString(16).padStart(8, '0');

  const fullSigHex = HmacSHA256(idHex + tsHex, secret).toString(Hex);
  // Ensure sigBytes in range
  const maxSigBytes = fullSigHex.length / 2;
  const useSigBytes = Math.min(Math.max(1, sigBytes), maxSigBytes);
  const sigTruncHex = fullSigHex.slice(0, useSigBytes * 2);

  const packedHex = idHex + tsHex + sigTruncHex;
  const packedWordArray = Hex.parse(packedHex);
  const b64 = Base64.stringify(packedWordArray);
  return b64;
}

export function decodePackedNumericPayload(payloadB64, secret, sigBytes = 32, ttlSeconds = 300) {
  try {
    const wa = Base64.parse(payloadB64);
    const hex = wa.toString(Hex);
    if (hex.length < 16 + sigBytes * 2) return { ok: false, reason: 'invalid_format' };
    const idHex = hex.slice(0, 8);
    const tsHex = hex.slice(8, 16);
    const sigHex = hex.slice(16);

    const id = parseInt(idHex, 16);
    const tsMs = parseInt(tsHex, 16) * 1000;
    if (Number.isNaN(id) || Number.isNaN(tsMs)) return { ok: false, reason: 'invalid_format' };

    const expectedFull = HmacSHA256(idHex + tsHex, secret).toString(Hex);
    const expectedTrunc = expectedFull.slice(0, sigHex.length);
    const sigMatches = expectedTrunc === sigHex;

    let withinTtl = true;
    let age = null;
    try {
      age = Date.now() - tsMs;
      if (ttlSeconds != null) withinTtl = age <= ttlSeconds * 1000;
    } catch (e) {
      withinTtl = false;
    }

    return { ok: true, valid: sigMatches && withinTtl, id, ts: new Date(tsMs).toISOString(), age, withinTtl, sigMatches };
  } catch (e) {
    return { ok: false, reason: 'parse_error' };
  }
}
