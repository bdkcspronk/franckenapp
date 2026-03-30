// Toggle this to `true` to use the offline/mock DB for local testing.
// Purpose: App configuration flags used to select mock vs real services.
export default {
  useMock: true
};

// Optional: base URL to host committee images (raw file access). If set,
// the app will try to fetch images from `${committeeAssetsBaseUrl}/assets/committees/<Name>.png`.
// Example: 'https://raw.githubusercontent.com/youruser/yourrepo/main'
export const committeeAssetsBaseUrl = '';
