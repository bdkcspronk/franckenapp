// Utilities to create and decode a timestamped, signed QR payload.
// Payload format (base64-encoded JSON): { id, ts, sig }
// where `sig` = HMAC-SHA256(id + '|' + ts, secret) as hex.
// This file runs in-app (React Native / Expo) and uses `crypto-js`.
// Install: `npm install crypto-js`

import HmacSHA256 from 'crypto-js/hmac-sha256';
import Hex from 'crypto-js/enc-hex';
import Utf8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';

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
