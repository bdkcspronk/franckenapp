import React, { createContext, useContext, useEffect, useState } from 'react';
import appConfig from '../config/appConfig';
import * as api from '../services/api';

let firebaseInitialized = false;
let auth = null;
let firebaseSignOut = null;

const AuthContext = createContext({ user: null, signOut: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (appConfig.useMock) {
      // Load default mock user from the single mock DB file to avoid duplication.
      try {
        const members = require('../mocks/members.json');
        const defaultMember = Array.isArray(members) && (members.find((m) => m.email === 'alice@example.com') || members[0]);
        if (defaultMember) {
          // keep all fields from the mock member and ensure `uid` is available (code expects `user.uid`)
          setUser({ ...defaultMember, uid: defaultMember.id || defaultMember.uid || defaultMember.email || 'u1' });
        } else {
          setUser({ uid: 'u1', email: 'alice@example.com', displayName: 'Alice Wonder' });
        }
      } catch (e) {
        // fallback if loading fails
        setUser({ uid: 'u1', email: 'alice@example.com', displayName: 'Alice Wonder' });
      }
      return;
    }

    // Lazy-load Firebase only when not in mock mode.
    async function initFirebase() {
      if (!firebaseInitialized) {
        const { initializeApp } = await import('firebase/app');
        const { getAuth, onAuthStateChanged, signOut } = await import('firebase/auth');
        const firebaseConfig = (await import('../firebase/config')).default;
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        firebaseSignOut = signOut;
        firebaseInitialized = true;

        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        return () => unsub();
      }
    }

    initFirebase();
  }, []);

  function signOut() {
    if (appConfig.useMock) {
      setUser(null);
      return Promise.resolve();
    }
    if (firebaseSignOut && auth) return firebaseSignOut(auth);
    return Promise.resolve();
  }

  async function signIn(email, password) {
    if (appConfig.useMock) {
      try {
        const m = await api.getMember(email);
        if (m) {
          // keep full member fields and ensure uid exists
          setUser({ ...m, uid: m.id || m.uid || m.email });
          return { ok: true, user: m };
        }
        return { ok: false, message: 'User not found' };
      } catch (e) {
        return { ok: false, message: e.message };
      }
    }

    try {
      if (!firebaseInitialized) {
        const { initializeApp } = await import('firebase/app');
        const { getAuth, onAuthStateChanged, signOut } = await import('firebase/auth');
        const firebaseConfig = (await import('../firebase/config')).default;
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        firebaseSignOut = signOut;
        firebaseInitialized = true;

        const unsub = onAuthStateChanged(auth, (u) => setUser(u));
        if (unsub) unsub();
      }
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const cred = await signInWithEmailAndPassword(auth, email, password);
      setUser(cred.user);
      return { ok: true, user: cred.user };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  }

  async function updateProfile(updates) {
    // Prevent clients from changing immutable fields like studentNumber
    const safeUpdates = { ...updates };
    if (safeUpdates.hasOwnProperty('studentNumber')) delete safeUpdates.studentNumber;

    if (appConfig.useMock) {
      try {
        const idOrEmail = (user && (user.uid || user.email));
        if (!idOrEmail) return { ok: false, message: 'No authenticated user' };
        const res = await api.updateMember(idOrEmail, safeUpdates);
        if (res && res.ok && res.member) {
          setUser((prev) => ({ ...prev, ...res.member }));
          return { ok: true, user: res.member };
        }
        // fallback if implementation returns member directly
        if (res && res.member) {
          setUser((prev) => ({ ...prev, ...res.member }));
          return { ok: true, user: res.member };
        }
        return { ok: false, message: res && res.message ? res.message : 'Update failed' };
      } catch (e) {
        return { ok: false, message: e.message };
      }
    }

    try {
      const { updateProfile } = await import('firebase/auth');
      if (auth && auth.currentUser) {
        // firebase updateProfile supports only displayName and photoURL; pass safeUpdates to be cautious
        await updateProfile(auth.currentUser, safeUpdates);
        setUser(auth.currentUser);
        return { ok: true, user: auth.currentUser };
      }
      return { ok: false, message: 'No firebase user' };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  }

  return <AuthContext.Provider value={{ user, signOut, signIn, updateProfile }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
