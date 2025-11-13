// Email validation regex
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation
export const passwordRegex = {
  minLength: /.{8,}/,
  hasUpperCase: /[A-Z]/,
  hasLowerCase: /[a-z]/,
  hasNumbers: /\d/,
  hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/
};

// Aadhaar number validation (12 digits)
export const aadhaarRegex = /^\d{12}$/;

// Phone number validation (Indian format)
export const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;

// File validation
const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
const docTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

export const allowedFileTypes = {
  images: imageTypes,
  documents: [...docTypes, ...imageTypes], // dashboard allows PDFs, docs, and images
  all: [...docTypes, ...imageTypes]
};

export const maxFileSize = 10 * 1024 * 1024; // 10MB

// Document categories
export const documentCategories = [
  { value: 'education', label: 'Education', icon: '🎓' },
  { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
  { value: 'government', label: 'Government IDs', icon: '🆔' },
  { value: 'transportation', label: 'Transportation', icon: '🚗' },
  { value: 'others', label: 'Others', icon: '📄' }
];

// Category icons mapping
export const categoryIcons = {
  education: '🎓',
  healthcare: '🏥',
  government: '🆔',
  transportation: '🚗',
  others: '📄'
};

// Document types
export const documentTypes = {
  education: [
    { value: 'marksheet', label: 'Mark Sheet' },
    { value: 'certificate', label: 'Certificate' },
    { value: 'degree', label: 'Degree' },
    { value: 'diploma', label: 'Diploma' }
  ],
  healthcare: [
    { value: 'medical_record', label: 'Medical Record' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'prescription', label: 'Prescription' },
    { value: 'test_report', label: 'Test Report' }
  ],
  government: [
    { value: 'pan', label: 'PAN Card' },
    { value: 'aadhaar', label: 'Aadhaar Card' },
    { value: 'passport', label: 'Passport' },
    { value: 'driving_license', label: 'Driving License' },
    { value: 'voter_id', label: 'Voter ID' }
  ],
  transportation: [
    { value: 'railway_pass', label: 'Railway Pass' },
    { value: 'vehicle_document', label: 'Vehicle Document' },
    { value: 'insurance', label: 'Vehicle Insurance' },
    { value: 'registration', label: 'Vehicle Registration' }
  ],
  others: [
    { value: 'other', label: 'Other Document' }
  ]
};

// Validation functions
export const validateEmail = (email) => {
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const errors = [];

  if (!passwordRegex.minLength.test(password)) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!passwordRegex.hasUpperCase.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!passwordRegex.hasLowerCase.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!passwordRegex.hasNumbers.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!passwordRegex.hasSpecialChar.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateAadhaar = (aadhaar) => {
  return aadhaarRegex.test(aadhaar.replace(/\s/g, ''));
};

export const validatePhone = (phone) => {
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateFile = (file, category = 'documents') => {
  const errors = [];

  if (!file) {
    errors.push('No file selected');
    return { isValid: false, errors };
  }

  // Check file type
  const allowedTypes = allowedFileTypes[category] || allowedFileTypes.all;
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }

  // Check file size
  if (file.size > maxFileSize) {
    errors.push('File size must be less than 10MB');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitize functions
export const sanitizeInput = (input) => {
  return input.trim().replace(/[<>]/g, '');
};

export const sanitizeFileName = (fileName) => {
  return fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
};

export default {
  emailRegex,
  passwordRegex,
  aadhaarRegex,
  phoneRegex,
  allowedFileTypes,
  maxFileSize,
  documentCategories,
  documentTypes,
  validateEmail,
  validatePassword,
  validateAadhaar,
  validatePhone,
  validateFile,
  sanitizeInput,
  sanitizeFileName
};
