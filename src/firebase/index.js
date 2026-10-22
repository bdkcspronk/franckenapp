// Purpose: Initialize Firebase once, on first use (mock mode never loads it).
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from './config';

let instance = null;

// On phones the login is kept in AsyncStorage, so members stay logged in after closing the app
function createAuth(app) {
  if (Platform.OS === 'web' || !firebaseAuth.getReactNativePersistence) return firebaseAuth.getAuth(app);
  return firebaseAuth.initializeAuth(app, { persistence: firebaseAuth.getReactNativePersistence(AsyncStorage) });
}

export function getFirebase() {
  if (!instance) {
    const app = initializeApp(firebaseConfig);
    instance = { app, auth: createAuth(app), db: getFirestore(app) };
  }
  return instance;
}
