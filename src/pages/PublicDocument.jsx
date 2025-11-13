import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDownload, FiEye, FiShare2, FiLock, FiCalendar, FiFileText, FiShield, FiCopy, FiCheck } from 'react-icons/fi';
import { QRCode } from 'react-qr-code';

import { useTheme } from '../context/ThemeContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import { formatDate, formatFileSize, copyToClipboard, getUserInitial } from '../utils/helpers';

const PublicDocument = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  
  const mockDocument = {
    id: documentId,
    title: 'Sample Passport Document',
    description: 'This is a sample passport document shared securely through SecureDocs platform. It demonstrates the public sharing feature.',
    category: 'government',
    documentType: 'passport',
    fileSize: 2048576,
    createdAt: new Date('2024-01-15'),
    shareEnabled: true,
    viewCount: 42,
    downloadUrl: '#', 
    sharedBy: {
      name: 'John Doe',
      email: 'john@example.com'
    }
  };

  useEffect(() => {
    
    const fetchDocument = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setDocument(mockDocument);
      setLoading(false);
    };

    fetchDocument();
  }, [documentId]);

  const handleCopyLink = async () => {
    const shareableUrl = window.location.href;
    const success = await copyToClipboard(shareableUrl);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownload = () => {
    
    alert('Download would start here in a real application');
  };

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

  const categoryIcons = {
    education: '🎓',
    healthcare: '🏥',
    government: '🆔',
    transportation: '🚗',
    others: '📄'
  };

  if (loading) {
    return <Loading text="Loading document..." fullscreen />;
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiLock className="text-red-600 dark:text-red-400 text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Document Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            The document you're looking for may have been deleted or the link has expired.
          </p>
          <Button onClick={() => navigate('/')}>
            Go Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiShield className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Secure Document Sharing
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            This document is securely shared via SecureDocs platform
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {}
          <motion.div
            className="lg:col-span-2"
            variants={itemVariants}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              {}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {document.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {document.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center">
                        <FiCalendar className="mr-1" />
                        {formatDate(document.createdAt, 'MMMM dd, yyyy')}
                      </span>
                      <span className="flex items-center">
                        <FiFileText className="mr-1" />
                        {formatFileSize(document.fileSize)}
                      </span>
                      <span className="flex items-center">
                        <FiEye className="mr-1" />
                        {document.viewCount} views
                      </span>
                    </div>
                  </div>
                  <div className="text-4xl">
                    {categoryIcons[document.category]}
                  </div>
                </div>
              </div>

              {}
              <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800">
                <div className="h-96 bg-white dark:bg-gray-900 rounded-lg shadow-inner flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-4">
                      {categoryIcons[document.category]}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      Document Preview
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                      Click "Download Document" to view the full document
                    </p>
                  </div>
                </div>
              </div>

              {}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={handleDownload}
                    className="flex-1 py-3"
                  >
                    <FiDownload className="mr-2" />
                    Download Document
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    className="py-3"
                  >
                    {copied ? (
                      <>
                        <FiCheck className="mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <FiCopy className="mr-2" />
                        Copy Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>

          {}
          <div className="space-y-6">
            {}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Share via QR Code
              </h3>
              <div className="bg-white p-4 rounded-lg">
                <QRCode
                  value={window.location.href}
                  size={200}
                  level="H"
                  includeMargin={true}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  className="mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-4 text-center">
                Scan this QR code to quickly access this document
              </p>
            </motion.div>

            {}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Document Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Type:</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {document.documentType.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Category:</span>
                  <span className="font-medium text-gray-900 dark:text-white capitalize">
                    {document.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">File Size:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatFileSize(document.fileSize)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shared:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {formatDate(document.createdAt, 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>
            </motion.div>

            {}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              variants={itemVariants}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Shared By
              </h3>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {getUserInitial(document.sharedBy.name, document.sharedBy.email)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {document.sharedBy.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {document.sharedBy.email}
                  </p>
                </div>
              </div>
            </motion.div>

            {}
            <motion.div
              className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800"
              variants={itemVariants}
            >
              <div className="flex items-start space-x-3">
                <FiShield className="text-primary-600 dark:text-primary-400 text-xl mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Security Notice
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    This document is securely shared via SecureDocs. Your access is logged and the document owner can monitor views and downloads.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {}
        <motion.div
          className="mt-12 text-center"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 mb-4">
            <FiShield className="text-primary-600 dark:text-primary-400" />
            <span>Powered by SecureDocs - Secure Document Management</span>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Create Your Free Account
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default PublicDocument;
