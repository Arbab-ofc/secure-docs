import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFileText,
  FiUpload,
  FiShare2,
  FiFolder,
  FiClock,
  FiShield,
  FiTrendingUp,
  FiPlus,
  FiSearch,
  FiFilter,
  FiDownload,
  FiEye,
  FiEdit,
  FiTrash2,
  FiAlertCircle
} from 'react-icons/fi';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import DocumentUpload from '../components/documents/DocumentUpload';
import DocumentCard from '../components/documents/DocumentCard';
import DocumentShare from '../components/documents/DocumentShare';
import documentService from '../services/documentService';
import cloudinaryService from '../services/cloudinaryService';
import { formatDate, formatFileSize, generateShareableUrl, copyToClipboard } from '../utils/helpers';
import { toast } from 'react-hot-toast';

const Dashboard = () => {
  const { user, userProfile } = useAuth();
  const { isDark } = useTheme();

  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    sharedDocuments: 0,
    totalViews: 0,
    totalStorage: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Load documents and stats
  useEffect(() => {
    if (user) {
      loadDocuments();
      loadStats();
    }
  }, [user]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const result = await documentService.getUserDocuments(user.uid);

      if (result.success) {
        setDocuments(result.documents);
      } else {
        toast.error('Failed to load documents');
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Error loading documents');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const result = await documentService.getUserDocumentStats(user.uid);

      if (result.success) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleUpload = async (uploadData) => {
    try {
      setUploading(true);

      // Upload files to Cloudinary first
      const uploadResults = [];
      for (const file of uploadData.files) {
        const category = uploadData.category || 'others';
        const folder = cloudinaryService.getFolderPath(category);

        const result = await cloudinaryService.uploadFile(file, {
          folder,
          category: uploadData.documentType,
          description: uploadData.description
        });

        if (result.success) {
          uploadResults.push(result);
        } else {
          throw new Error(result.error);
        }
      }

      // Save document metadata to Firestore (use first uploaded file for now)
      if (uploadResults.length > 0) {
        const uploadResult = uploadResults[0];

        const documentData = {
          title: uploadData.title,
          description: uploadData.description,
          category: uploadData.category,
          documentType: uploadData.documentType,
          cloudinaryUrl: uploadResult.url,
          cloudinaryPublicId: uploadResult.publicId,
          fileSize: uploadResult.size,
          mimeType: uploadResult.fileType,
          tags: [uploadData.category, uploadData.documentType]
        };

        const saveResult = await documentService.uploadDocument(user.uid, documentData);

        if (saveResult.success) {
          toast.success('Document uploaded successfully!');
          setShowUploadModal(false);
          await loadDocuments();
          await loadStats();
        } else {
          throw new Error(saveResult.error);
        }
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleShare = async (document) => {
    setSelectedDocument(document);
    setShowShareModal(true);
  };

  const handleShareUpdate = async (updatedDocument) => {
    try {
      const result = await documentService.updateDocumentSharing(
        updatedDocument.id,
        user.uid,
        {
          shareEnabled: updatedDocument.shareEnabled,
          publicShareUrl: updatedDocument.publicShareUrl,
          qrCodeData: updatedDocument.qrCodeData,
          shareExpiry: updatedDocument.shareExpiry
        }
      );

      if (result.success) {
        toast.success(`Sharing ${updatedDocument.shareEnabled ? 'enabled' : 'disabled'}`);
        setShowShareModal(false);
        await loadDocuments();
      } else {
        toast.error('Failed to update sharing settings');
      }
    } catch (error) {
      console.error('Share update error:', error);
      toast.error('Error updating sharing settings');
    }
  };

  const handleCopyLink = async (document) => {
    const shareableUrl = generateShareableUrl(document.id);
    return await copyToClipboard(shareableUrl);
  };

  const handleDelete = async (document) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const result = await documentService.deleteDocument(document.id, user.uid);

      if (result.success) {
        toast.success('Document deleted successfully');
        await loadDocuments();
        await loadStats();
      } else {
        toast.error('Failed to delete document');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting document');
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = searchTerm === '' ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

  if (!user) {
    return <Loading fullscreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
        {/* Welcome Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {userProfile?.displayName || user.email?.split('@')[0]}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Manage and share your important documents securely
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Documents
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalDocuments}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <FiFileText className="text-blue-600 dark:text-blue-400 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Shared Documents
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.sharedDocuments}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <FiShare2 className="text-green-600 dark:text-green-400 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Total Views
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalViews}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <FiEye className="text-purple-600 dark:text-purple-400 text-xl" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Storage Used
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatFileSize(stats.totalStorage)}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <FiFolder className="text-orange-600 dark:text-orange-400 text-xl" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="education">Education</option>
                <option value="healthcare">Healthcare</option>
                <option value="government">Government IDs</option>
                <option value="transportation">Transportation</option>
                <option value="others">Others</option>
              </select>
            </div>

            <Button
              onClick={() => setShowUploadModal(true)}
              className="shrink-0"
            >
              <FiPlus className="mr-2" />
              Upload Document
            </Button>
          </div>
        </motion.div>

        {/* Documents Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loading size="lg" text="Loading documents..." />
          </div>
        ) : (
          <>
            {filteredDocuments.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredDocuments.map((document) => (
                  <DocumentCard
                    key={document.id}
                    document={document}
                    onShare={handleShare}
                    onView={(doc) => window.open(doc.cloudinaryUrl, '_blank')}
                    onDownload={(doc) => {
                      const link = document.createElement('a');
                      link.href = doc.cloudinaryUrl;
                      link.download = doc.title;
                      link.click();
                    }}
                    onEdit={(doc) => {
                      // TODO: Implement edit functionality
                      toast.info('Edit functionality coming soon!');
                    }}
                    onDelete={handleDelete}
                    onCopyLink={handleCopyLink}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiFileText className="text-gray-400 text-2xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'No documents found'
                    : 'No documents yet'
                  }
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {searchTerm || selectedCategory !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Upload your first document to get started'
                  }
                </p>
                <Button onClick={() => setShowUploadModal(true)}>
                  <FiUpload className="mr-2" />
                  Upload Document
                </Button>
              </motion.div>
            )}
          </>
        )}

        {/* Modals */}
        <AnimatePresence>
          {showUploadModal && (
            <DocumentUpload
              onUpload={handleUpload}
              onClose={() => setShowUploadModal(false)}
              isUploading={uploading}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showShareModal && selectedDocument && (
            <DocumentShare
              document={selectedDocument}
              onShare={handleShareUpdate}
              onClose={() => setShowShareModal(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Dashboard;
