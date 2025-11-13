import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import { motion } from 'framer-motion';

import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { validatePassword } from '../../utils/validators';

const ChangePasswordCard = () => {
  const { changePassword } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showFields, setShowFields] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleVisibility = (field) => {
    setShowFields((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    setStatus('');
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const { isValid, errors: passwordErrors } = validatePassword(formData.newPassword);
      if (!isValid) {
        newErrors.newPassword = passwordErrors[0];
      }
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = 'New password must be different';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    const result = await changePassword(formData.currentPassword, formData.newPassword);
    if (result.success) {
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setStatus('Password updated successfully.');
    }
    setLoading(false);
  };

  const renderField = (id, label) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiLock className="text-gray-400" />
        </div>
        <input
          type={showFields[id] ? 'text' : 'password'}
          id={id}
          name={id}
          value={formData[id]}
          onChange={handleChange}
          className={`w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
            errors[id]
              ? 'border-red-500 dark:border-red-400'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
          placeholder="••••••••"
        />
        <button
          type="button"
          onClick={() => toggleVisibility(id)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          {showFields[id] ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>
      {errors[id] && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors[id]}</p>}
    </div>
  );

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-300 flex items-center justify-center">
          <FiShield className="text-2xl" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Change password</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Use a strong password to keep your vault safe.</p>
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        {renderField('currentPassword', 'Current Password')}
        {renderField('newPassword', 'New Password')}
        {renderField('confirmPassword', 'Confirm New Password')}

        {status && <p className="text-sm text-green-600 dark:text-green-400">{status}</p>}

        <Button type="submit" loading={loading} className="w-full">
          Update password
        </Button>
      </form>
    </motion.div>
  );
};

export default ChangePasswordCard;
