import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiShield, FiArrowLeftCircle } from 'react-icons/fi';

import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { validateEmail } from '../utils/validators';

const ForgotPassword = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, type: 'spring', stiffness: 100 }
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Enter a valid email');
      return;
    }
    setError('');
    setIsSubmitting(true);
    const result = await resetPassword(email);
    if (result.success) {
      setStatus('Check your inbox for the reset link.');
    }
    setIsSubmitting(false);
  };

  if (isSubmitting) {
    return <Loading text="Sending reset link..." fullscreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <motion.div className="max-w-md w-full" variants={containerVariants} initial="hidden" animate="visible">
        <motion.div className="text-center mb-8" variants={containerVariants}>
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <FiShield className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reset password</h1>
          <p className="text-gray-600 dark:text-gray-400">Enter your email and we will send you a reset link.</p>
        </motion.div>

        <motion.div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700" variants={containerVariants}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={`w-full pl-10 pr-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                    error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
            </div>

            {status && <p className="text-sm text-green-600 dark:text-green-400">{status}</p>}

            <Button type="submit" className="w-full">Send reset link</Button>
          </form>

          <Link to="/login" className="mt-6 inline-flex items-center text-primary-600 dark:text-primary-400 font-semibold hover:underline">
            <FiArrowLeftCircle className="mr-2" />
            Back to login
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
