import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { makeQrPayload } from '../utils/qrPayload';

// Testing-only default secret — do NOT use in production
const DEFAULT_SECRET = 'FRANCKEN1984';

export default function MemberQRCode({ memberId, secret = DEFAULT_SECRET, size = 220, now = null }) {
  if (!memberId) return null;
  const payload = makeQrPayload(memberId, secret, now);

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <QRCode value={payload} size={size} />
    </View>
  );
}
