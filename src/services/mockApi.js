import events from '../mocks/events.json';
import news from '../mocks/news.json';
import members from '../mocks/members.json';

// Simple in-memory mock DB. Suitable for local testing without Firebase.
const state = {
  events: JSON.parse(JSON.stringify(events)),
  news: JSON.parse(JSON.stringify(news)),
  members: JSON.parse(JSON.stringify(members)),
  signups: [],
  // simple book marketplace
  books: [
    { id: 'bk1', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest, Stein', price: 2500, description: 'Good condition, 3rd edition', sellerId: '1101', createdAt: new Date().toISOString(), sold: false },
    { id: 'bk2', title: 'React Native in Action', author: 'Nader Dabit', price: 1500, description: 'Light wear, includes notes', sellerId: '1102', createdAt: new Date().toISOString(), sold: false }
  ]
};

export async function fetchEvents() {
  // emulate async network call
  return new Promise((res) => setTimeout(() => res(state.events), 150));
}

export async function fetchNews() {
  return new Promise((res) => setTimeout(() => res(state.news), 120));
}

export async function getMember(uidOrEmail) {
  const m = state.members.find((x) => x.id === uidOrEmail || x.email === uidOrEmail);
  return new Promise((res) => setTimeout(() => res(m || null), 80));
}

export async function signUpForEvent(eventId, memberId) {
  const already = state.signups.find((s) => s.eventId === eventId && s.memberId === memberId);
  if (already) return { ok: false, message: 'Already signed up' };
  const signup = { id: String(state.signups.length + 1), eventId, memberId, createdAt: new Date().toISOString() };
  state.signups.push(signup);
  return { ok: true, signup };
}

export async function getWalletBalance(memberId) {
  const m = state.members.find((x) => x.id === memberId);
  return m ? m.balance : 0;
}

export async function getMemberSignups(memberId) {
  // return signups enriched with event info
  const my = state.signups.filter((s) => s.memberId === memberId);
  const items = my.map((s) => {
    const ev = state.events.find((e) => e.id === s.eventId) || { id: s.eventId, title: 'Unknown event' };
    return { ...s, event: ev };
  });
  return new Promise((res) => setTimeout(() => res(items), 100));
}

export async function cancelSignUp(eventId, memberId) {
  // remove any matching signup
  const idx = state.signups.findIndex((s) => s.eventId === eventId && s.memberId === memberId);
  if (idx === -1) return { ok: false, message: 'Not signed up' };
  const [removed] = state.signups.splice(idx, 1);
  return new Promise((res) => setTimeout(() => res({ ok: true, removed }), 120));
}

export async function topUp(memberId, amount) {
  const m = state.members.find((x) => x.id === memberId);
  if (!m) return { ok: false };
  // amounts are in cents (integers). Add directly and return new cents balance.
  m.balance = (typeof m.balance === 'number' ? m.balance : 0) + (typeof amount === 'number' ? amount : 0);
  return { ok: true, balance: m.balance };
}

export async function updateMember(memberId, changes) {
  const idx = state.members.findIndex((x) => x.id === memberId || x.email === memberId);
  if (idx === -1) return { ok: false, message: 'Member not found' };
  const m = state.members[idx];
  // Do not allow changing immutable fields like `studentNumber` from the client.
  const safe = { ...changes };
  if (safe.hasOwnProperty('studentNumber')) delete safe.studentNumber;
  // apply remaining changes shallowly
  Object.assign(m, safe);
  return new Promise((res) => setTimeout(() => res({ ok: true, member: m }), 120));
}

// --- Book marketplace ---
export async function getAvailableBooks() {
  const items = state.books.filter((b) => !b.sold).map((b) => ({
    ...b,
    seller: state.members.find((m) => m.id === b.sellerId) || null,
  }));
  return new Promise((res) => setTimeout(() => res(items), 120));
}

export async function getMyBooks(memberId) {
  const items = state.books.filter((b) => b.sellerId === memberId).map((b) => ({ ...b }));
  return new Promise((res) => setTimeout(() => res(items), 120));
}

export async function createBookListing(memberId, { title, author, description, price }) {
  // price expected in cents
  const id = `bk${state.books.length + 1}`;
  const book = { id, title, author, description: description || '', price: typeof price === 'number' ? price : Math.round(Number(price) || 0), sellerId: memberId, createdAt: new Date().toISOString(), sold: false };
  state.books.push(book);
  return new Promise((res) => setTimeout(() => res({ ok: true, book }), 120));
}

export async function buyBook(bookId, buyerId) {
  const idx = state.books.findIndex((b) => b.id === bookId);
  if (idx === -1) return { ok: false, message: 'Book not found' };
  const book = state.books[idx];
  if (book.sold) return { ok: false, message: 'Book already sold' };
  if (book.sellerId === buyerId) return { ok: false, message: 'Cannot buy your own book' };
  const buyer = state.members.find((m) => m.id === buyerId || m.email === buyerId);
  const seller = state.members.find((m) => m.id === book.sellerId);
  if (!buyer) return { ok: false, message: 'Buyer not found' };
  if (!seller) return { ok: false, message: 'Seller not found' };
  const price = typeof book.price === 'number' ? book.price : 0;
  const buyerBalance = typeof buyer.balance === 'number' ? buyer.balance : 0;
  if (buyerBalance < price) return { ok: false, message: 'Insufficient funds' };
  buyer.balance = buyerBalance - price;
  seller.balance = (typeof seller.balance === 'number' ? seller.balance : 0) + price;
  book.sold = true;
  book.buyerId = buyerId;
  book.soldAt = new Date().toISOString();
  return new Promise((res) => setTimeout(() => res({ ok: true, book, buyerBalance: buyer.balance, sellerBalance: seller.balance }), 150));
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
  , updateMember
};
