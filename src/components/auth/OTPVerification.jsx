import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiArrowLeft, FiRefreshCw, FiCheckCircle, FiXCircle } from 'react-icons/fi';

import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Loading from '../common/Loading';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, success, error

  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  const email = location.state?.email || 'your email address';

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && verificationStatus === 'pending') {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setIsExpired(true);
    }
  }, [timeLeft, verificationStatus]);

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle input change
  const handleChange = (index, value) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 1);

    const newOtp = [...otp];
    newOtp[index] = numericValue;
    setOtp(newOtp);

    // Auto focus next input
    if (numericValue && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  // Handle key press
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);

    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs[5].current?.focus();
    }
  };

  // Verify OTP
  const handleVerify = async (e) => {
    e.preventDefault();

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      // Here you would normally call your OTP verification API
      // For demo purposes, we'll simulate the verification
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate successful verification
      setVerificationStatus('success');

      // Navigate to dashboard after success
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);

    } catch (error) {
      setError('Invalid OTP. Please try again.');
      setVerificationStatus('error');
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setIsResending(true);
    setError('');

    try {
      // Here you would normally call your resend OTP API
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Reset timer and OTP
      setTimeLeft(300);
      setOtp(['', '', '', '', '', '']);
      setIsExpired(false);
      setVerificationStatus('pending');

      // Focus first input
      inputRefs[0].current?.focus();

    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        type: 'spring',
        stiffness: 100
      }
    }
  };

  if (isVerifying && verificationStatus === 'pending') {
    return <Loading text="Verifying OTP..." fullscreen />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <motion.div
        className="max-w-md w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Back button */}
        <motion.button
          onClick={() => navigate('/login')}
          className="mb-6 flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          variants={itemVariants}
        >
          <FiArrowLeft className="mr-2" />
          Back to login
        </motion.button>

        {/* Verification card */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
          variants={itemVariants}
        >
          {/* Status icon */}
          <div className="text-center mb-6">
            <AnimatePresence mode="wait">
              {verificationStatus === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center"
                >
                  <FiCheckCircle className="text-green-600 dark:text-green-400 text-2xl" />
                </motion.div>
              ) : verificationStatus === 'error' ? (
                <motion.div
                  key="error"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"
                >
                  <FiXCircle className="text-red-600 dark:text-red-400 text-2xl" />
                </motion.div>
              ) : (
                <motion.div
                  key="pending"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center"
                >
                  <FiMail className="text-primary-600 dark:text-primary-400 text-2xl" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Title and description */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {verificationStatus === 'success' ? 'Email Verified!' : 'Verify Your Email'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {verificationStatus === 'success'
                ? 'Your email has been successfully verified.'
                : `We've sent a 6-digit verification code to ${email}`
              }
            </p>
          </div>

          <AnimatePresence mode="wait">
            {verificationStatus === 'pending' ? (
              <motion.form
                key="form"
                onSubmit={handleVerify}
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* OTP input fields */}
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={inputRefs[index]}
                      type="text"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      className={`w-12 h-12 text-center text-lg font-semibold border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                        error
                          ? 'border-red-500 dark:border-red-400'
                          : isExpired
                          ? 'border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700'
                          : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white'
                      }`}
                      maxLength={1}
                      disabled={isExpired || isVerifying}
                      autoFocus={index === 0}
                    />
                  ))}
                </div>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-sm text-red-600 dark:text-red-400"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Timer */}
                {!isExpired && (
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Code expires in: <span className="font-medium text-primary-600 dark:text-primary-400">{formatTime(timeLeft)}</span>
                    </p>
                  </div>
                )}

                {/* Expired message */}
                {isExpired && (
                  <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      The verification code has expired. Please request a new one.
                    </p>
                  </div>
                )}

                {/* Verify button */}
                <Button
                  type="submit"
                  fullWidth
                  disabled={isExpired || isVerifying || otp.join('').length !== 6}
                  loading={isVerifying}
                  className="py-3"
                >
                  Verify Email
                </Button>

                {/* Resend OTP */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending || !isExpired}
                    className={`text-sm flex items-center justify-center mx-auto space-x-2 ${
                      isExpired && !isResending
                        ? 'text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <FiRefreshCw className={isResending ? 'animate-spin' : ''} />
                    <span>{isResending ? 'Sending...' : 'Resend Code'}</span>
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="status"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                {verificationStatus === 'success' ? (
                  <p className="text-green-600 dark:text-green-400 mb-4">
                    Redirecting you to your dashboard...
                  </p>
                ) : (
                  <div>
                    <p className="text-red-600 dark:text-red-400 mb-4">
                      Verification failed. The code may have expired or is invalid.
                    </p>
                    <Button
                      onClick={() => {
                        setOtp(['', '', '', '', '', '']);
                        setVerificationStatus('pending');
                        setIsExpired(false);
                        setTimeLeft(300);
                        setError('');
                      }}
                      variant="outline"
                      className="py-3"
                    >
                      Try Again
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Help text */}
        <motion.p
          className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400"
          variants={itemVariants}
        >
          Didn't receive the email? Check your spam folder or{' '}
          <button
            onClick={handleResend}
            disabled={isResending || !isExpired}
            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 disabled:text-gray-400"
          >
            request a new code
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default OTPVerification;