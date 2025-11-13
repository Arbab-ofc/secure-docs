import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';


export function cn(...inputs) {
  return twMerge(clsx(inputs));
}


export const formatDate = (date, formatString = 'PPP') => {
  if (!date) return 'N/A';

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return format(dateObj, formatString);
  } catch (error) {
    console.error('Date formatting error:', error);
    return 'Invalid Date';
  }
};


export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};


export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};


export const generateId = (prefix = '') => {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate shareable URL
export const generateShareableUrl = (documentId, baseUrl = window.location.origin) => {
  return `${baseUrl}/shared/${documentId}`;
};

// Copy to clipboard utility
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};


export const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(downloadUrl);
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    return false;
  }
};


export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};


export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};


export const searchDocuments = (documents, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return documents;
  }

  const term = searchTerm.toLowerCase().trim();

  return documents.filter(doc => {
    return (
      doc.title?.toLowerCase().includes(term) ||
      doc.description?.toLowerCase().includes(term) ||
      doc.category?.toLowerCase().includes(term) ||
      doc.documentType?.toLowerCase().includes(term) ||
      doc.tags?.some(tag => tag.toLowerCase().includes(term))
    );
  });
};

// Sort utility
export const sortDocuments = (documents, sortBy, sortOrder = 'asc') => {
  const sorted = [...documents].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = aValue?.toDate ? aValue.toDate() : new Date(aValue);
      bValue = bValue?.toDate ? bValue.toDate() : new Date(bValue);
    }

    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue?.toLowerCase() || '';
    }

    // Compare values
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};


export const filterDocuments = (documents, filters) => {
  return documents.filter(doc => {
    
    if (filters.category && filters.category !== 'all') {
      if (doc.category !== filters.category) return false;
    }

    
    if (filters.dateFrom) {
      const docDate = doc.createdAt?.toDate ? doc.createdAt.toDate() : new Date(doc.createdAt);
      if (docDate < new Date(filters.dateFrom)) return false;
    }

    if (filters.dateTo) {
      const docDate = doc.createdAt?.toDate ? doc.createdAt.toDate() : new Date(doc.createdAt);
      if (docDate > new Date(filters.dateTo)) return false;
    }

    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = `${doc.title} ${doc.description} ${doc.documentType}`.toLowerCase();
      if (!searchableText.includes(searchTerm)) return false;
    }

    return true;
  });
};


export const getUserInitial = (name, email) => {
  const source = name?.trim() || email?.trim();
  return source ? source.charAt(0).toUpperCase() : '?';
};


export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && value.trim() === '')) {
    return `${fieldName} is required`;
  }
  return null;
};

// Error handler utility
export const handleApiError = (error) => {
  console.error('API Error:', error);

  if (error.code) {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'User not found. Please check your email.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'Email already registered. Please use a different email.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
  }

  return error.message || 'An unexpected error occurred.';
};


export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;

    
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error writing to localStorage:', error);
    return false;
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};


export const clearCorruptedStorage = () => {
  try {
    const keysToClean = ['theme'];
    keysToClean.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          JSON.parse(item); 
        } catch {
          
          localStorage.removeItem(key);
          console.log(`Cleared corrupted localStorage item: ${key}`);
        }
      }
    });
  } catch (error) {
    console.error('Error clearing corrupted storage:', error);
  }
};

export default {
  cn,
  formatDate,
  formatFileSize,
  formatDuration,
  generateId,
  generateShareableUrl,
  copyToClipboard,
  downloadFile,
  debounce,
  throttle,
  searchDocuments,
  sortDocuments,
  filterDocuments,
  validateRequired,
  handleApiError,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  getUserInitial
};
