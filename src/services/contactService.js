import { db } from '../config/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const contactCollection = collection(db, 'contacts');

export const submitContactMessage = async (formData, user) => {
  try {
    const docRef = await addDoc(contactCollection, {
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      userId: user?.uid || null,
      createdAt: serverTimestamp()
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving contact message:', error);
    return { success: false, error: error.message };
  }
};

export default {
  submitContactMessage
};
