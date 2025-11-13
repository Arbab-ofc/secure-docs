import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { updateUserProfile } from '../services/profileService';
import cloudinaryService from '../services/cloudinaryService';

const ProfileEdit = () => {
  const { user, userProfile, loading, refreshUserProfile } = useAuth();
  const navigate = useNavigate();

  const [formState, setFormState] = useState({
    displayName: '',
    phone: '',
    aadhaarNumber: '',
    bio: ''
  });
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPublicId, setAvatarPublicId] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userProfile) {
      setFormState({
        displayName: userProfile.displayName || '',
        phone: userProfile.phone || '',
        aadhaarNumber: userProfile.aadhaarNumber || '',
        bio: userProfile.bio || ''
      });
      setAvatarUrl(userProfile.photoURL || '');
      setAvatarPublicId(userProfile.cloudinaryPublicId || '');
    }
  }, [userProfile]);

  if (loading) {
    return <Loading fullscreen />;
  }

  if (!user) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    setAvatarError('');
    setAvatarUploading(true);

    try {
      const upload = await cloudinaryService.uploadFile(file, {
        folder: 'avatars',
        resourceType: 'image'
      });

      if (upload.success) {
        setAvatarUrl(upload.url);
        setAvatarPublicId(upload.publicId || '');
        toast.success('Avatar updated');
      } else {
        setAvatarError(upload.error || 'Failed to upload avatar.');
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
      setAvatarError('Failed to upload avatar. Please try again.');
    } finally {
      setAvatarUploading(false);
    }
  };

  const clearAvatar = () => {
    setAvatarUrl('');
    setAvatarPublicId('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateUserProfile(user.uid, {
        ...formState,
        photoURL: avatarUrl || null,
        cloudinaryPublicId: avatarPublicId || null
      });
      await refreshUserProfile();
      toast.success('Profile updated successfully');
      navigate('/profile');
    } catch (error) {
      console.error('Profile update failed:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <motion.div
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-8">
            <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400 font-semibold">Profile</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Update your details</h1>
            <p className="text-gray-600 dark:text-gray-400">Keep your information current so we can personalize your experience.</p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 mb-10">
            <div className="relative w-28 h-28">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile avatar"
                  className="w-28 h-28 rounded-2xl object-cover border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-3xl font-bold">
                  {formState.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </div>
              )}
              {avatarUploading && (
                <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center text-white text-sm">
                  Uploading...
                </div>
              )}
            </div>
            <div className="mt-4 sm:mt-0 space-y-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
              >
                Change photo
              </Button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={clearAvatar}
                  className="text-sm text-red-500 hover:underline"
                  disabled={avatarUploading}
                >
                  Remove photo
                </button>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, or WEBP up to 5MB.</p>
              {avatarError && (
                <p className="text-sm text-red-500">{avatarError}</p>
              )}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
              <input
                type="text"
                name="displayName"
                value={formState.displayName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formState.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Aadhaar Number</label>
                <input
                  type="text"
                  name="aadhaarNumber"
                  value={formState.aadhaarNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bio / Notes</label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Tell us anything helpful about how you use SecureDocs"
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => navigate('/profile')} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" loading={saving}>
                Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileEdit;
