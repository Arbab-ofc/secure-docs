import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiMail, FiRefreshCw, FiCheckCircle } from 'react-icons/fi';

import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const VerifyEmail = () => {
  const { user, loading, sendVerificationEmail, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!loading && user?.emailVerified) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <Loading fullscreen />;
  }

  if (!user) {
    return null;
  }

  const handleResend = async () => {
    setResending(true);
    try {
      await sendVerificationEmail();
      toast.success('Verification email sent. Please check your inbox.');
    } catch (error) {
      console.error('Resend verification failed:', error);
      toast.error('Unable to send verification email right now.');
    } finally {
      setResending(false);
    }
  };

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const updatedUser = await refreshUser();
      if (updatedUser?.emailVerified) {
        toast.success('Email verified!');
        navigate('/dashboard');
      } else {
        toast.error('Still waiting for verification. Please try again in a moment.');
      }
    } catch (error) {
      console.error('Verification check failed:', error);
      toast.error('Could not refresh status. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-10 shadow-xl text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mx-auto w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-3xl">
            <FiMail />
          </div>
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400 font-semibold">Verify your email</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Check your inbox</h1>
            <p className="text-gray-600 dark:text-gray-300">We sent a verification link to <span className="font-semibold">{user.email}</span>. Click the link in that email to activate your account.</p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 text-left space-y-3">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">What happens next?</p>
            <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
              <li>Open the verification email in your inbox or spam folder.</li>
              <li>Click the “Verify email” button in the message.</li>
              <li>Return to this page and confirm once the link is clicked.</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3">
            <Button
              variant="outline"
              onClick={handleResend}
              loading={resending}
            >
              <FiRefreshCw className="mr-2" />
              Resend email
            </Button>
            <Button
              onClick={handleCheckStatus}
              loading={checking}
            >
              <FiCheckCircle className="mr-2" />
              I verified my email
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyEmail;
