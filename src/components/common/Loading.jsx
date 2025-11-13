import React from 'react';
import { motion } from 'framer-motion';
import { FiLoader } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const Loading = ({
  size = 'md',
  text = 'Loading...',
  fullscreen = false,
  showText = true,
  variant = 'spinner'
}) => {
  const { isDark } = useTheme();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const loadingContainer = fullscreen
    ? 'fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center py-12';

  if (variant === 'dots') {
    return (
      <div className={loadingContainer}>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-3 h-3 bg-primary-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.7, 1, 0.7]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />
            ))}
          </div>
          {showText && (
            <motion.p
              className={`${textSizes[size]} text-gray-600 dark:text-gray-400`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {text}
            </motion.p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={loadingContainer}>
        <div className="flex flex-col items-center space-y-4">
          <motion.div
            className={`${sizeClasses[size]} bg-primary-500 rounded-full`}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          {showText && (
            <motion.p
              className={`${textSizes[size]} text-gray-600 dark:text-gray-400`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {text}
            </motion.p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={loadingContainer}>
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          className={`${sizeClasses[size]} text-primary-500`}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <FiLoader className="w-full h-full" />
        </motion.div>
        {showText && (
          <motion.p
            className={`${textSizes[size]} text-gray-600 dark:text-gray-400`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    </div>
  );
};

// Specialized loading components
export const PageLoading = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
    <Loading size="xl" text="Loading SecureDocs..." variant="pulse" />
  </div>
);

export const ButtonLoading = ({ size = 'sm' }) => (
  <Loading size={size} showText={false} variant="spinner" />
);

export const CardLoading = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
  </div>
);

export const TableLoading = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    ))}
  </div>
);

export const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
  </div>
);

export default Loading;