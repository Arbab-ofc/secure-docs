import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStorageItem, setStorageItem, clearCorruptedStorage } from '../utils/helpers';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  
  useEffect(() => {
    setMounted(true);

    
    clearCorruptedStorage();

    
    const storedTheme = getStorageItem('theme', 'system');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    const initialTheme = storedTheme === 'system' ? systemTheme : storedTheme;
    setTheme(initialTheme);
    applyTheme(initialTheme);

    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (getStorageItem('theme', 'system') === 'system') {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  
  const applyTheme = (themeValue) => {
    const root = document.documentElement;

    if (themeValue === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    setStorageItem('theme', newTheme);
  };

  
  const setThemeMode = (themeMode) => {
    let newTheme;

    if (themeMode === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      newTheme = systemTheme;
    } else {
      newTheme = themeMode;
    }

    setTheme(newTheme);
    applyTheme(newTheme);
    setStorageItem('theme', themeMode);
  };

  
  const getThemeMode = () => {
    return getStorageItem('theme', 'system');
  };

  
  const themeColors = {
    light: {
      primary: '#0ea5e9',
      secondary: '#6366f1',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1e293b',
      textSecondary: '#64748b',
      border: '#e2e8f0',
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
      info: '#3b82f6'
    },
    dark: {
      primary: '#38bdf8',
      secondary: '#818cf8',
      background: '#0f172a',
      surface: '#1e293b',
      text: '#f1f5f9',
      textSecondary: '#94a3b8',
      border: '#334155',
      error: '#f87171',
      warning: '#fbbf24',
      success: '#34d399',
      info: '#60a5fa'
    }
  };

  const currentColors = themeColors[theme];

  
  const isDark = theme === 'dark';

  
  const getThemedClass = (lightClass, darkClass) => {
    return isDark ? darkClass : lightClass;
  };

  const getThemedValue = (lightValue, darkValue) => {
    return isDark ? darkValue : lightValue;
  };

  const value = {
    theme,
    setTheme: setThemeMode,
    toggleTheme,
    getThemeMode,
    isDark,
    isLight: theme === 'light',
    isSystem: getThemeMode() === 'system',
    colors: currentColors,
    themeColors,
    getThemedClass,
    getThemedValue,
    mounted
  };

  
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;