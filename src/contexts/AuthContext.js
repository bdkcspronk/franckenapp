// Purpose: Provide authentication state and helper functions to the app.
import React, { createContext, useContext, useEffect, useState } from 'react';
import appConfig from '../config/appConfig';
import * as api from '../services/api';

const AuthContext = createContext({ user: null, signOut: () => {} });

// Firebase is only loaded outside mock mode
const firebase = () => require('../firebase').getFirebase();
const firebaseAuth = () => require('firebase/auth');

const LOGIN_ERRORS = {
  'auth/invalid-credential': 'Wrong email address or password.',
  'auth/invalid-email': 'That is not a valid email address.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'No internet connection.',
};

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
      return undefined;
    }

    // Also restores the login from the previous session
    return firebaseAuth().onAuthStateChanged(firebase().auth, async (u) => {
      if (!u) return setUser(null);
      try {
        setUser(await api.getMember(u.uid));
      } catch (e) {
        console.warn('Failed to load profile', e);
        setUser({ uid: u.uid, email: u.email });
      }
    });
  }, []);

  function signOut() {
    if (appConfig.useMock) {
      setUser(null);
      return Promise.resolve();
    }
    return firebaseAuth().signOut(firebase().auth);
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
      const cred = await firebaseAuth().signInWithEmailAndPassword(firebase().auth, email.trim(), password);
      const profile = await api.getMember(cred.user.uid);
      setUser(profile);
      return { ok: true, user: profile };
    } catch (e) {
      return { ok: false, message: LOGIN_ERRORS[e.code] || e.message };
    }
  }

  async function updateProfile(updates) {
    // Prevent clients from changing immutable fields like studentNumber
    const safeUpdates = { ...updates };
    if (safeUpdates.hasOwnProperty('studentNumber')) delete safeUpdates.studentNumber;

    try {
      const idOrEmail = user && (user.uid || user.email);
      if (!idOrEmail) return { ok: false, message: 'No authenticated user' };
      const res = await api.updateMember(idOrEmail, safeUpdates);
      if (res && res.member) {
        setUser((prev) => ({ ...prev, ...res.member }));
        return { ok: true, user: res.member };
      }
      return { ok: false, message: res && res.message ? res.message : 'Update failed' };
    } catch (e) {
      return { ok: false, message: e.message };
    }
  }

  return <AuthContext.Provider value={{ user, signOut, signIn, updateProfile }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
