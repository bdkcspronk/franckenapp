// Purpose: App configuration flags used to select mock vs real services.
// The app uses the association's Firebase project when .env has its config (see .env.example).
// Set EXPO_PUBLIC_USE_MOCK=true in .env to use the offline/mock DB for local testing instead.
export default {
  useMock: process.env.EXPO_PUBLIC_USE_MOCK === 'true' || !process.env.EXPO_PUBLIC_FIREBASE_API_KEY
};

// Optional: base URL to host committee images (raw file access). If set,
// the app will try to fetch images from `${committeeAssetsBaseUrl}/assets/committees/<Name>.png`.
// Example: 'https://raw.githubusercontent.com/youruser/yourrepo/main'
export const committeeAssetsBaseUrl = '';
