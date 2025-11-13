import React from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiMonitor } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

const ThemeToggle = ({ className = '', size = 'md' }) => {
  const { theme, setTheme, isDark, isLight, isSystem } = useTheme();

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <div className={`relative ${className}`}>
      <div className={`flex items-center bg-gray-100 dark:bg-gray-800 rounded-full p-1 ${sizeClasses[size]}`}>
        {/* Animated background */}
        <motion.div
          className="absolute bg-white dark:bg-gray-700 rounded-full shadow-md"
          style={{
            width: theme === 'system' ? '33.33%' : theme === 'light' ? '50%' : '50%',
            left: theme === 'system' ? '0%' : theme === 'light' ? (isDark ? '33.33%' : '0%') : (isDark ? '66.67%' : '50%'),
            top: '4px',
            bottom: '4px'
          }}
          layout
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
        />

        {/* System theme button */}
        <button
          onClick={() => handleThemeChange('system')}
          className={`relative z-10 w-1/3 h-full flex items-center justify-center rounded-full transition-colors ${
            theme === 'system'
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
          title="Use system theme"
        >
          <FiMonitor className={iconSizes[size]} />
        </button>

        {/* Light theme button */}
        <button
          onClick={() => handleThemeChange('light')}
          className={`relative z-10 w-1/3 h-full flex items-center justify-center rounded-full transition-colors ${
            theme === 'light' || (theme === 'system' && !isDark)
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
          title="Light theme"
        >
          <FiSun className={iconSizes[size]} />
        </button>

        {/* Dark theme button */}
        <button
          onClick={() => handleThemeChange('dark')}
          className={`relative z-10 w-1/3 h-full flex items-center justify-center rounded-full transition-colors ${
            theme === 'dark' || (theme === 'system' && isDark)
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
          }`}
          title="Dark theme"
        >
          <FiMoon className={iconSizes[size]} />
        </button>
      </div>

      {/* Theme label */}
      <div className="mt-2 text-center">
        <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
          {theme === 'system' ? 'System' : theme}
        </span>
      </div>
    </div>
  );
};

// Simple toggle version for header
export const SimpleThemeToggle = ({ className = '' }) => {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${className}`}
      aria-label="Toggle theme"
    >
      <motion.div
        key={isDark ? 'moon' : 'sun'}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 180, opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? <FiMoon className="text-lg" /> : <FiSun className="text-lg" />}
      </motion.div>
    </button>
  );
};

export default ThemeToggle;