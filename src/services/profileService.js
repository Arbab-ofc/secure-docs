import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { auth, db } from '../config/firebase';

export const updateUserProfile = async (uid, data) => {
  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, {
    ...data,
    updatedAt: serverTimestamp()
  });

  if (auth.currentUser && data.displayName) {
    await updateProfile(auth.currentUser, { displayName: data.displayName });
  }

  return true;
};

export default {
  updateUserProfile
};
