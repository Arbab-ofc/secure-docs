import React from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiShield, FiMail, FiClock, FiEdit, FiFileText } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { formatDate, getUserInitial } from '../utils/helpers';
import ChangePasswordCard from '../components/profile/ChangePasswordCard';

const Profile = () => {
  const { user, userProfile, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <Loading fullscreen />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 space-y-8">
        <motion.div
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center space-x-4">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt="Profile avatar"
                  className="w-20 h-20 rounded-2xl object-cover border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold">
                  {getUserInitial(userProfile?.displayName, user.email)}
                </div>
              )}
              <div>
                <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-1">Account</p>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {userProfile?.displayName || user.email}
                </h1>
                <p className="text-gray-600 dark:text-gray-300">SecureDocs Member</p>
              </div>
            </div>

            <Button onClick={() => navigate('/profile/edit')}>
              <FiEdit className="mr-2" />
              Update Profile
            </Button>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Email</p>
              <p className="text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                <FiMail />
                <span>{user.email}</span>
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Member since</p>
              <p className="text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                <FiClock />
                <span>{formatDate(user.metadata?.creationTime)}</span>
              </p>
            </div>
            {userProfile?.aadhaarNumber && (
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Aadhaar Number</p>
                <p className="text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                  <FiShield />
                  <span>{userProfile.aadhaarNumber}</span>
                </p>
              </div>
            )}
            {userProfile?.phone && (
              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Phone</p>
                <p className="text-gray-900 dark:text-white font-medium flex items-center space-x-2">
                  <FiUser />
                  <span>{userProfile.phone}</span>
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Document Activity</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Quick stats from your uploads</p>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              <FiFileText className="mr-2" />
              Go to Dashboard
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Role</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{userProfile?.role || 'user'}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">Status</p>
              <p className="text-2xl font-semibold text-green-600">Active</p>
            </div>
          </div>
        </motion.div>

        <ChangePasswordCard />
      </div>
    </div>
  );
};

export default Profile;
