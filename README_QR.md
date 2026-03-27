QR Code generation
------------------

We provide two helpers for QR generation:

- `scripts/generate-qr.js` — Node script to pre-generate an SVG QR from a member ID and a secret HMAC. Usage:

  SECRET=your_secret node scripts/generate-qr.js MEMBER_ID out.svg

  This script requires the `qrcode` npm package (`npm i qrcode`).

- `src/utils/qrPayload.js` — runtime helper (for the app) to compute the QR payload string from `memberId` and `secret` using `crypto-js` HMAC. Install with `yarn add crypto-js`.

Rendering in-app
----------------
For React Native (Expo) you can render SVG QR strings with `react-native-svg` and `react-native-qrcode-svg`.

Example (in a screen):

1. Install:

   yarn add react-native-svg react-native-qrcode-svg crypto-js

2. Use runtime payload and render:

```js
import QRCode from 'react-native-qrcode-svg';
import { makeQrPayload } from '../utils/qrPayload';

const payload = makeQrPayload(memberId, SECRET_FROM_SECURE_STORE);
<QRCode value={payload} size={240} />
```

Security note
-------------
Store the `secret` securely (not hard-coded). For local testing you can use an env file or `expo-constants`, but for production use a secure remote key or device secure storage.
