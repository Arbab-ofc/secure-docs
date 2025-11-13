import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUpload,
  FiX,
  FiFile,
  FiImage,
  FiFileText,
  FiCheck,
  FiAlertCircle,
  FiFolder
} from 'react-icons/fi';

import { documentCategories, documentTypes, validateFile } from '../../utils/validators';
import { formatDate, formatFileSize } from '../../utils/helpers';
import Button from '../common/Button';

const DocumentUpload = ({ onUpload, onClose, isUploading = false }) => {
  const [files, setFiles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('education');
  const [selectedType, setSelectedType] = useState('marksheet');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleFileSelect = (selectedFiles) => {
    const newFiles = [];
    const newErrors = {};

    Array.from(selectedFiles).forEach(file => {
      const validation = validateFile(file, 'documents');

      if (validation.isValid) {
        
        const isDuplicate = files.some(f => f.name === file.name && f.size === file.size);
        if (!isDuplicate) {
          newFiles.push({
            file,
            id: Math.random().toString(36).substr(2, 9),
            preview: null
          });
        }
      } else {
        newErrors[file.name] = validation.errors[0];
      }
    });

    setFiles(prev => [...prev, ...newFiles]);
    setErrors(prev => ({ ...prev, ...newErrors }));

    
    if (!title && newFiles.length > 0) {
      const fileName = newFiles[0].file.name.replace(/\.[^/.]+$/, '');
      setTitle(fileName);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (files.length === 0) {
      newErrors.files = 'Please select at least one file';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const uploadData = {
        files: files.map(f => f.file),
        title: title.trim(),
        description: description.trim(),
        category: selectedCategory,
        documentType: selectedType
      };

      onUpload(uploadData);
    }
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <FiImage className="text-green-500" />;
    } else if (file.type === 'application/pdf') {
      return <FiFileText className="text-red-500" />;
    } else {
      return <FiFile className="text-blue-500" />;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        variants={containerVariants}
      >
        {}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Upload Documents
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <FiX className="text-xl" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Files
            </label>

            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                dragActive
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 dark:hover:border-primary-400'
              } ${errors.files ? 'border-red-500' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                className="hidden"
              />

              <div className="space-y-4">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto">
                  <FiUpload className="text-primary-600 dark:text-primary-400 text-2xl" />
                </div>

                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Drag & drop files here
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    or click to browse
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Choose Files
                </Button>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Supported formats: PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                </p>
              </div>
            </div>

            {errors.files && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
                <FiAlertCircle className="mr-1" />
                {errors.files}
              </p>
            )}
          </div>

          {}
          {files.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Selected Files ({files.length})
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {files.map((fileObj) => (
                  <div
                    key={fileObj.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      {getFileIcon(fileObj.file)}
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {fileObj.file.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatFileSize(fileObj.file.size)} • {fileObj.file.type}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(fileObj.id)}
                      className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FiX className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setSelectedType(documentTypes[e.target.value][0].value);
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {documentCategories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Document Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {documentTypes[selectedCategory].map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter document title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title}
              </p>
            )}
          </div>

          {}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Add a brief description..."
            />
          </div>

          {}
          {Object.keys(errors).length > 0 && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">
                Please fix the errors above to continue.
              </p>
            </div>
          )}

          {}
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isUploading}
              disabled={files.length === 0 || !title.trim()}
            >
              {isUploading ? 'Uploading...' : 'Upload Documents'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DocumentUpload;