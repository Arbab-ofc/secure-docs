import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const configFromEnv = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Fall back to the previous hard-coded config for local setups that haven't
// supplied environment variables yet.
const fallbackConfig = {
  apiKey: 'AIzaSyDQp1n5btJ4D4Q1xB3jClDWmgejxJL5M74',
  authDomain: 'document-share-a2f75.firebaseapp.com',
  projectId: 'document-share-a2f75',
  storageBucket: 'document-share-a2f75.appspot.com',
  messagingSenderId: '13608223294',
  appId: '1:13608223294:web:2699af927940f72371076f'
};

const firebaseConfig = Object.fromEntries(
  Object.entries(configFromEnv).map(([key, value]) => [key, value || fallbackConfig[key]])
);

if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
  throw new Error('Missing Firebase configuration. Please set the VITE_FIREBASE_* environment variables.');
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
