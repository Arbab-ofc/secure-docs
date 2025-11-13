import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  reload,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { handleApiError } from '../utils/helpers';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const ownerEmails = ['arbabprvt@gmail.com'];

  const isOwnerEmail = (email) => {
    if (!email) return false;
    return ownerEmails.includes(email.toLowerCase());
  };

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User: ${user.email}` : 'No user');

      setUser(user);

      if (user) {
        await fetchUserProfile(user.uid, user.email);
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  
  const fetchUserProfile = async (uid, email) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        let profileData = userDoc.data();
        const shouldBeOwner = isOwnerEmail(email || profileData.email);

        if (shouldBeOwner && profileData.role !== 'owner') {
          await updateDoc(doc(db, 'users', uid), {
            role: 'owner',
            updatedAt: serverTimestamp()
          });
          profileData = {
            ...profileData,
            role: 'owner'
          };
        }

        setUserProfile(profileData);
        console.log('User profile loaded:', profileData.email);
      } else {
        console.log('No user profile found in Firestore');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  
  const createUserProfile = async (user, additionalData = {}) => {
    try {
      const userProfileData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || additionalData.fullName || '',
        photoURL: user.photoURL || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        emailVerified: user.emailVerified || false,
        provider: additionalData.provider || 'email',
        isActive: true,
        role: isOwnerEmail(user.email) ? 'owner' : 'user',
        documentCount: 0,
        storageUsed: 0,
        ...additionalData
      };

      await setDoc(doc(db, 'users', user.uid), userProfileData);
      setUserProfile(userProfileData);
      console.log('User profile created:', userProfileData.email);
      return userProfileData;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };

  
  const register = async (userData) => {
    try {
      const { email, password, fullName } = userData;

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: fullName });

      await createUserProfile(user, {
        fullName,
        aadhaarNumber: userData.aadhaarNumber,
        provider: 'email'
      });

      try {
        await sendEmailVerification(user);
        toast.success('Verification email sent! Please check your inbox.');
      } catch (verificationError) {
        console.error('Error sending verification email:', verificationError);
        toast.error('Account created but verification email failed to send. Please resend from the verification page.');
      }

      toast.success('Account created successfully!');
      return { success: true, user };
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  
  const login = async (email, password, rememberMe = false) => {
    try {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful for:', email);

      toast.success('Login successful!');
      return { success: true, user: userCredential.user };
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  
  
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      toast.success('Logged out successfully');
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
    }
  };

  
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    if (!auth.currentUser?.email) {
      return { success: false, error: 'No authenticated user' };
    }

    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      toast.success('Password updated successfully');
      return { success: true };
    } catch (error) {
      const errorMessage = handleApiError(error);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const sendVerificationEmail = async () => {
    if (!auth.currentUser) {
      throw new Error('No authenticated user');
    }
    await sendEmailVerification(auth.currentUser);
  };

  const refreshUser = async () => {
    if (!auth.currentUser) {
      return null;
    }

    await reload(auth.currentUser);
    const refreshedUser = auth.currentUser;
    setUser({ ...refreshedUser });

    if (refreshedUser.emailVerified && userProfile && !userProfile.emailVerified) {
      try {
        await updateDoc(doc(db, 'users', refreshedUser.uid), {
          emailVerified: true,
          updatedAt: serverTimestamp()
        });
        setUserProfile(prev => prev ? { ...prev, emailVerified: true } : prev);
      } catch (error) {
        console.error('Failed to update user profile verification status:', error);
      }
    }

    return refreshedUser;
  };

  const refreshUserProfile = async () => {
    if (!auth.currentUser) return null;
    return await fetchUserProfile(auth.currentUser.uid, auth.currentUser.email);
  };

  
  const isAdmin = () => {
    return ['admin', 'owner'].includes(userProfile?.role);
  };

  const role = userProfile?.role || 'user';
  const hasAdminAccess = role === 'admin' || role === 'owner';
  const isOwnerRole = role === 'owner';

  const value = {
    user,
    userProfile,
    loading,
    register,
    login,
    logout,
    resetPassword,
    changePassword,
    sendVerificationEmail,
    refreshUser,
    refreshUserProfile,
    isAdmin,
    isAuthenticated: !!user,
    hasAdminAccess,
    isOwner: isOwnerRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
