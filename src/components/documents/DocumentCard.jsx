import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiFileText,
  FiShare2,
  FiEye,
  FiDownload,
  FiEdit,
  FiTrash2,
  FiMoreVertical,
  FiCalendar,
  FiFolder,
  FiClock,
  FiUsers,
  FiExternalLink,
  FiCopy
} from 'react-icons/fi';

import Button from '../common/Button';
import { formatDate, formatFileSize, copyToClipboard } from '../../utils/helpers';
import { categoryIcons } from '../../utils/validators';

const DocumentCard = ({
  document,
  onShare,
  onView,
  onDownload,
  onEdit,
  onDelete,
  onCopyLink,
  loading = false
}) => {
  const [showActions, setShowActions] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (onCopyLink) {
      const success = await onCopyLink(document);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    },
    hover: {
      scale: 1.02,
      y: -4,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10
      }
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      education: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      healthcare: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      government: 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
      transportation: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
      others: 'from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800'
    };
    return colors[category] || colors.others;
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
    >
      {}
      <div className={`h-32 bg-gradient-to-br ${getCategoryColor(document.category)} flex items-center justify-center relative`}>
        {document.thumbnailUrl ? (
          <img
            src={document.thumbnailUrl}
            alt={document.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-center">
            <div className="text-4xl mb-2">
              {categoryIcons[document.category]}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-300 uppercase tracking-wider font-medium">
              {document.documentType?.replace('_', ' ')}
            </p>
          </div>
        )}

        {}
        {document.shareEnabled && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <FiShare2 className="mr-1" />
              Shared
            </span>
          </div>
        )}
      </div>

      {}
      <div className="p-4">
        {}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 truncate" title={document.title}>
          {document.title}
        </h3>

        {}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
          {document.description || 'No description available'}
        </p>

        {}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
          <div className="flex items-center space-x-3">
            <span className="flex items-center">
              <FiFolder className="mr-1" />
              {formatFileSize(document.fileSize)}
            </span>
            <span className="flex items-center">
              <FiCalendar className="mr-1" />
              {formatDate(document.createdAt, 'MMM dd')}
            </span>
          </div>
          {document.shareEnabled && (
            <span className="flex items-center">
              <FiEye className="mr-1" />
              {document.viewCount || 0}
            </span>
          )}
        </div>

        {}
        <div className="space-y-2">
          {}
          <div className="grid grid-cols-2 gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView && onView(document)}
              className="w-full"
            >
              <FiEye className="mr-1" />
              View
            </Button>

            {document.shareEnabled ? (
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyLink}
                className="w-full"
              >
                {copied ? (
                  <>
                    ✓ Copied
                  </>
                ) : (
                  <>
                    <FiCopy className="mr-1" />
                    Copy Link
                  </>
                )}
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onShare && onShare(document)}
                className="w-full"
              >
                <FiShare2 className="mr-1" />
                Share
              </Button>
            )}
          </div>

          {}
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDownload && onDownload(document)}
                className="p-2"
                tooltip="Download"
              >
                <FiDownload className="text-sm" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit && onEdit(document)}
                className="p-2"
                tooltip="Edit"
              >
                <FiEdit className="text-sm" />
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete && onDelete(document)}
                className="p-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                tooltip="Delete"
              >
                <FiTrash2 className="text-sm" />
              </Button>
            </div>

            {document.shareEnabled && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => window.open(`/shared/${document.id}`, '_blank')}
                className="p-2"
                tooltip="Open Public Link"
              >
                <FiExternalLink className="text-sm" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {}
      {loading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center rounded-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      )}
    </motion.div>
  );
};

export default DocumentCard;