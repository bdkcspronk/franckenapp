import React, { createContext, useContext, useEffect, useState } from 'react';
import appConfig from '../config/appConfig';

let firebaseInitialized = false;
let auth = null;
let firebaseSignOut = null;

const AuthContext = createContext({ user: null, signOut: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (appConfig.useMock) {
      // Provide a default mock user for fast local testing.
      // Keep this lightweight so Expo Go doesn't require Firebase config.
      setUser({ uid: 'u1', email: 'alice@example.com', displayName: 'Alice' });
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
        const { default: api } = await import('../services/api');
        const m = await api.getMember(email);
        if (m) {
          setUser({ uid: m.id, email: m.email, displayName: m.displayName });
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

  return <AuthContext.Provider value={{ user, signOut, signIn }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
