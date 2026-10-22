Francken Mobile App
===================

The Francken mobile app (Expo + Firebase). It uses the same Firebase project and data as the website,
[professor-francken-node](https://github.com/bdkcspronk/professor-francken-node): members log in with
their website account, and activities, news and sign ups are shared.

Setup
-----

1. Install dependencies:

   npm install

2. Copy `.env.example` to `.env` and fill in the Firebase web config (Firebase console > Project
   settings > General > Your apps). Without it, or with `EXPO_PUBLIC_USE_MOCK=true`, the app uses the
   offline mock data in `src/mocks`.

3. Start Expo:

   npx expo start

Data and security
-----------------

- `src/services/firebaseApi.js` reads and writes Firestore directly from the phone. The data structure
  is described in the website's `docs/database.md`.
- What the app may do is decided by `firestore.rules` **in the website repository** (see its
  `docs/auth-and-security.md`). A new feature that stores data needs a rule there first; without one,
  Firestore refuses.
- Anything involving money (wallet, top ups, book sales) must go through Cloud Functions, never be
  written by the app itself. Those screens show "not available" in Firebase mode until that exists.
