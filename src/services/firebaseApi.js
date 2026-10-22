// Purpose: Firebase-backed API, using the same Firestore data as the website (professor-francken-node).
// The structure is documented in that repo's docs/database.md; what the app may read and write is decided
// by its firestore.rules. Every function acts as the logged in member: ids passed in by screens are ignored.
import {
  collection,
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { getFirebase } from '../firebase';

// Errors with a message that can be shown to the member as-is
class UserError extends Error {}

const NOT_AVAILABLE = 'This is not available in the app yet.';

const toDate = (value) => (value && typeof value.toDate === 'function' ? value.toDate() : value ? new Date(value) : null);

const pad = (n) => String(n).padStart(2, '0');
const day = (date) => (date ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` : '');

// Same as Member.fullname on the website; firestore.rules checks sign ups against it
export const fullname = (m) => [m.firstName, m.namePrefix, m.surname].filter(Boolean).join(' ');

function result(promise) {
  return promise.catch((e) => {
    if (e instanceof UserError) return { ok: false, message: e.message };
    console.warn(e);
    if (e.code === 'permission-denied') return { ok: false, message: 'You are not allowed to do this.' };
    return { ok: false, message: 'Something went wrong. Please try again.' };
  });
}

// ─── Mapping to the shapes the screens use ───────────────────────────────────
// Events are passed to screens as navigation params, so dates are ISO strings (navigation state must be plain data)
const iso = (date) => (date ? date.toISOString() : null);

function toEvent(snap) {
  const a = snap.data();
  const start = toDate(a.startDate);
  const settings = a.signUpSettings ? { ...a.signUpSettings, deadlineAt: iso(toDate(a.signUpSettings.deadlineAt)) } : null;
  return {
    id: snap.id,
    slug: a.slug,
    title: a.name,
    date: day(start),
    start: iso(start),
    end: iso(toDate(a.endDate)),
    location: a.location,
    summary: a.summary,
    description: a.sourceContent || a.summary || '',
    signUpSettings: settings,
    signUpCount: a.signUpCount || 0,
  };
}

function toNews(snap) {
  const n = snap.data();
  return { id: snap.id, title: n.title, body: n.sourceContent || n.excerpt || '', date: day(toDate(n.publishedAt)), author: n.authorName };
}

// ─── The logged in member ────────────────────────────────────────────────────
async function currentMember() {
  const { auth, db } = getFirebase();
  if (!auth.currentUser) throw new UserError('Please log in first.');
  const account = await getDoc(doc(db, 'accounts', auth.currentUser.uid));
  const memberId = account.exists() ? account.data().memberId : null;
  if (!memberId) throw new UserError('Your login is not linked to a member yet. Please contact the board.');
  const member = await getDoc(doc(db, 'members', memberId));
  return { id: memberId, ...member.data(), roles: account.data().roles || [] };
}

// The profile the screens show as `user`: account + member + personal details
export async function getMember(uid) {
  const { auth, db } = getFirebase();
  const base = { uid, email: auth.currentUser?.email || null };
  const account = await getDoc(doc(db, 'accounts', uid));
  const memberId = account.exists() ? account.data().memberId : null;
  if (!memberId) return { ...base, displayName: null, memberId: null };

  const [member, details] = await Promise.all([
    getDoc(doc(db, 'members', memberId)),
    getDoc(doc(db, 'members', memberId, 'private', 'details')),
  ]);
  const m = member.data() || {};
  const d = details.exists() ? details.data() : {};
  return {
    ...base,
    memberId,
    memberNumber: m.memberNumber,
    displayName: fullname(m),
    study: { name: m.study, startYear: m.enrollmentYear },
    studentNumber: d.studentNumber,
    birthday: d.birthdate,
    phone: d.phoneMobile,
    iban: d.iban,
    directDebitMandate: d.directDebitMandate,
    address: d.address,
    postalCode: d.postalCode,
    city: d.city,
    country: d.country,
    roles: account.data().roles || [],
  };
}

// Only the fields members may change themselves (firestore.rules enforces the same list)
const EDITABLE = { address: 'address', postalCode: 'postalCode', city: 'city', country: 'country', phone: 'phoneMobile', iban: 'iban' };

export function updateMember(memberIdIgnored, changes) {
  return result(
    (async () => {
      const { db } = getFirebase();
      const me = await currentMember();
      const fields = {};
      Object.entries(changes).forEach(([key, value]) => {
        if (EDITABLE[key]) fields[EDITABLE[key]] = value === '' ? null : value;
      });
      if (fields.iban) fields.iban = fields.iban.replace(/\s+/g, '').toUpperCase();
      await setDoc(doc(db, 'members', me.id, 'private', 'details'), { ...fields, updatedAt: serverTimestamp() }, { merge: true });
      return { ok: true, member: changes };
    })(),
  );
}

// ─── News and activities ─────────────────────────────────────────────────────
export async function fetchNews() {
  const { db } = getFirebase();
  const snap = await getDocs(
    query(collection(db, 'news'), where('publishedAt', '<=', new Date()), orderBy('publishedAt', 'desc'), limit(30)),
  );
  return snap.docs.map(toNews);
}

// Activities that haven't ended yet, soonest first
export async function fetchEvents() {
  const { db } = getFirebase();
  const snap = await getDocs(query(collection(db, 'activities'), where('endDate', '>', new Date())));
  return snap.docs.map(toEvent).sort((a, b) => a.start.localeCompare(b.start));
}

// ─── Sign ups ────────────────────────────────────────────────────────────────
// A sign up and the activity's signUpCount always change in one transaction, like SignUp.js on the website.
export function signUpForEvent(eventId) {
  return result(
    (async () => {
      const { db } = getFirebase();
      const me = await currentMember();
      const activityRef = doc(db, 'activities', eventId);
      const signUpRef = doc(activityRef, 'signups', me.id);
      await runTransaction(db, async (tx) => {
        const activity = await tx.get(activityRef);
        const existing = await tx.get(signUpRef);
        if (!activity.exists()) throw new UserError('This activity no longer exists.');
        if (existing.exists()) throw new UserError('You are already signed up.');
        const { signUpSettings: settings, signUpCount = 0 } = activity.data();
        if (!settings) throw new UserError('You can\'t sign up for this activity.');
        if (toDate(settings.deadlineAt) < new Date()) throw new UserError('The sign up deadline has passed.');
        if (settings.maxSignUps != null && signUpCount + 1 > settings.maxSignUps) throw new UserError('This activity is full.');

        tx.set(signUpRef, {
          activityId: eventId,
          memberId: me.id,
          memberName: fullname(me),
          plusOnes: 0,
          dietaryWishes: '',
          hasDriversLicense: false,
          notes: '',
          discount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        tx.update(activityRef, { signUpCount: signUpCount + 1 });
      });
      return { ok: true };
    })(),
  );
}

export function cancelSignUp(eventId) {
  return result(
    (async () => {
      const { db } = getFirebase();
      const me = await currentMember();
      const activityRef = doc(db, 'activities', eventId);
      const signUpRef = doc(activityRef, 'signups', me.id);
      await runTransaction(db, async (tx) => {
        const activity = await tx.get(activityRef);
        const signUp = await tx.get(signUpRef);
        if (!signUp.exists()) throw new UserError('You are not signed up.');
        tx.delete(signUpRef);
        tx.update(activityRef, { signUpCount: (activity.data().signUpCount || 0) - (1 + (signUp.data().plusOnes || 0)) });
      });
      return { ok: true };
    })(),
  );
}

// The member's sign ups, newest activity first: [{ id, eventId, event }]
export async function getMemberSignups() {
  const { db } = getFirebase();
  const me = await currentMember();
  const snap = await getDocs(query(collectionGroup(db, 'signups'), where('memberId', '==', me.id)));
  const items = await Promise.all(
    snap.docs.map(async (s) => {
      const activity = await getDoc(doc(db, 'activities', s.data().activityId));
      return activity.exists() ? { id: activity.id, eventId: activity.id, event: toEvent(activity) } : null;
    }),
  );
  return items.filter(Boolean).sort((a, b) => b.event.start.localeCompare(a.event.start));
}

// ─── Not on the website yet (wallet, book sales) ─────────────────────────────
// Money must never be changed from the phone; these need Cloud Functions first (see functions/README.md).
export async function getWalletBalance() {
  return null;
}
export async function topUp() {
  return { ok: false, message: NOT_AVAILABLE };
}
export async function getAvailableBooks() {
  return [];
}
export async function getMyBooks() {
  return [];
}
export async function createBookListing() {
  return { ok: false, message: NOT_AVAILABLE };
}
export async function buyBook() {
  return { ok: false, message: NOT_AVAILABLE };
}

export default {
  fetchEvents,
  fetchNews,
  getMember,
  updateMember,
  signUpForEvent,
  getWalletBalance,
  getMemberSignups,
  cancelSignUp,
  topUp,
  getAvailableBooks,
  getMyBooks,
  createBookListing,
  buyBook,
};
