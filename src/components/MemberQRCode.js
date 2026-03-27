// Purpose: Render a member QR code used for identification and payments.
import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { makePackedNumericPayload } from '../utils/qrPayload';

// Testing-only default secret — do NOT use in production
const DEFAULT_SECRET = 'FRANCKEN1984';

export default function MemberQRCode({ memberId, secret = DEFAULT_SECRET, size = 220, now = null }) {
  if (!memberId) return null;
  // Use packed numeric payload for smallest QR size. Use full HMAC (lossless integrity).
  const payload = makePackedNumericPayload(memberId, secret, now, 32);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <QRCode value={payload} size={size} />
    </View>
  );
}
