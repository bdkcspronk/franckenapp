import events from '../mocks/events.json';
import news from '../mocks/news.json';
import members from '../mocks/members.json';

// Simple in-memory mock DB. Suitable for local testing without Firebase.
const state = {
  events: JSON.parse(JSON.stringify(events)),
  news: JSON.parse(JSON.stringify(news)),
  members: JSON.parse(JSON.stringify(members)),
  signups: []
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
  m.balance = Number((m.balance + amount).toFixed(2));
  return { ok: true, balance: m.balance };
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
};
