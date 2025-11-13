import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHome, FiSearch, FiRefreshCw } from 'react-icons/fi';

import { useTheme } from '../context/ThemeContext';
import Button from '../components/common/Button';

const ErrorPage = () => {
  const { isDark } = useTheme();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4 pt-16 md:pt-20">
      <motion.div
        className="max-w-2xl w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
            404
          </div>
        </motion.div>

        {}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            The link might be broken, or the page may have been removed.
          </p>
        </motion.div>

        {}
        <motion.div
          className="mb-8"
          variants={itemVariants}
        >
          <div className="w-64 h-64 mx-auto bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <motion.div
                className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, repeatType: 'reverse' }}
              >
                <FiSearch className="text-white text-3xl" />
              </motion.div>
              <p className="text-gray-600 dark:text-gray-300">
                Searching for the page...
              </p>
            </div>
          </div>
        </motion.div>

        {}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <Link to="/">
            <Button size="lg" className="px-8 py-4">
              <FiHome className="mr-2" />
              Go Home
            </Button>
          </Link>

          <Button
            variant="outline"
            size="lg"
            className="px-8 py-4"
            onClick={() => window.history.back()}
          >
            <FiRefreshCw className="mr-2" />
            Go Back
          </Button>
        </motion.div>

        {}
        <motion.div
          className="mt-12"
          variants={itemVariants}
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            You might be looking for:
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Login
            </Link>
          </div>
        </motion.div>

        {}
        <motion.div
          className="mt-12"
          variants={itemVariants}
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            If you believe this is an error, please{' '}
            <Link to="/contact" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 underline">
              contact our support team
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
