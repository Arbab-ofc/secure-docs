import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';

import { db } from '../config/firebase';

const usersCollection = collection(db, 'users');
const contactsCollection = collection(db, 'contacts');

export const fetchAllUsers = async () => {
  const q = query(usersCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      uid: data.uid || docSnap.id,
      ...data
    };
  });
};

export const fetchContactMessages = async () => {
  const q = query(contactsCollection, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
};

export const updateUserRole = async (uid, role) => {
  await updateDoc(doc(db, 'users', uid), {
    role,
    updatedAt: serverTimestamp()
  });
};

export default {
  fetchAllUsers,
  fetchContactMessages,
  updateUserRole
};
