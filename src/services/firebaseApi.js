// Placeholder for real Firebase-backed API. Implement using Firebase SDK.
export async function fetchEvents() {
  throw new Error('Not implemented: fetchEvents (firebaseApi)');
}
export async function fetchNews() {
  throw new Error('Not implemented: fetchNews (firebaseApi)');
}
export async function getMember(uid) {
  throw new Error('Not implemented: getMember (firebaseApi)');
}
export async function signUpForEvent(eventId, memberId) {
  throw new Error('Not implemented: signUpForEvent (firebaseApi)');
}
export async function getWalletBalance(memberId) {
  throw new Error('Not implemented: getWalletBalance (firebaseApi)');
}

export async function getMemberSignups(memberId) {
  throw new Error('Not implemented: getMemberSignups (firebaseApi)');
}
export async function cancelSignUp(eventId, memberId) {
  throw new Error('Not implemented: cancelSignUp (firebaseApi)');
}
export async function topUp(memberId, amount) {
  throw new Error('Not implemented: topUp (firebaseApi)');
}

// --- Book marketplace (not implemented for firebase) ---
export async function getAvailableBooks() {
  throw new Error('Not implemented: getAvailableBooks (firebaseApi)');
}
export async function getMyBooks(memberId) {
  throw new Error('Not implemented: getMyBooks (firebaseApi)');
}
export async function createBookListing(memberId, payload) {
  throw new Error('Not implemented: createBookListing (firebaseApi)');
}
export async function buyBook(bookId, buyerId) {
  throw new Error('Not implemented: buyBook (firebaseApi)');
}

export default {
  fetchEvents,
  fetchNews,
  getMember,
  signUpForEvent,
  getWalletBalance,
  getMemberSignups,
  cancelSignUp,
  topUp
  , getAvailableBooks, getMyBooks, createBookListing, buyBook
};
