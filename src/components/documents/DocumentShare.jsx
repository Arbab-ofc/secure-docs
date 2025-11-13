import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShare2,
  FiX,
  FiCopy,
  FiCheck,
  FiGrid,
  FiLink,
  FiMail,
  FiUsers,
  FiCalendar,
  FiEye,
  FiDownload,
  FiShield,
  FiClock,
  FiTrash2,
  FiExternalLink
} from 'react-icons/fi';
import { QRCode } from 'react-qr-code';

import Button from '../common/Button';
import { formatDate, generateShareableUrl, copyToClipboard } from '../../utils/helpers';

const DocumentShare = ({
  document,
  onShare,
  onClose,
  loading = false
}) => {
  const [shareEnabled, setShareEnabled] = useState(document?.shareEnabled || false);
  const [shareExpiry, setShareExpiry] = useState('');
  const [copied, setCopied] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [shareLink, setShareLink] = useState('');

  const qrCodeRef = useRef(null);

  React.useEffect(() => {
    if (shareEnabled && document?.id) {
      setShareLink(generateShareableUrl(document.id));
    } else {
      setShareLink('');
    }
  }, [shareEnabled, document?.id]);

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareLink);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleDownloadQR = () => {
    if (qrCodeRef.current) {
      const svg = qrCodeRef.current.querySelector('svg');
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = 256;
        canvas.height = 256;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 256, 256);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${document.title}-qr-code.png`;
          a.click();
          URL.revokeObjectURL(url);
        });
      };

      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!shareEnabled) {
      
      onShare({
        ...document,
        shareEnabled: false,
        shareExpiry: null,
        publicShareUrl: null,
        qrCodeData: null
      });
    } else {
      
      onShare({
        ...document,
        shareEnabled: true,
        shareExpiry: shareExpiry ? new Date(shareExpiry) : null,
        publicShareUrl: shareLink,
        qrCodeData: shareLink
      });
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

  const expiryOptions = [
    { value: '', label: 'Never expires' },
    { value: '1', label: '1 hour' },
    { value: '24', label: '1 day' },
    { value: '168', label: '1 week' },
    { value: '720', label: '1 month' }
  ];

  const getExpiryDate = (hours) => {
    if (!hours) return null;
    const date = new Date();
    date.setHours(date.getHours() + parseInt(hours));
    return date;
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        variants={containerVariants}
      >
        {}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                <FiShare2 className="text-primary-600 dark:text-primary-400 text-lg" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Share Document
              </h2>
            </div>
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
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-white mb-1 truncate">
              {document?.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {document?.description || 'No description'}
            </p>
          </div>

          {}
          <div>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={shareEnabled}
                onChange={(e) => setShareEnabled(e.target.checked)}
                className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                disabled={loading}
              />
              <div>
                <span className="font-medium text-gray-900 dark:text-white">
                  Enable public sharing
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Anyone with the link can view this document
                </p>
              </div>
            </label>
          </div>

          {}
          <AnimatePresence>
            {shareEnabled && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                {}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Share Link
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCopyLink}
                      disabled={!shareLink}
                    >
                      {copied ? (
                        <>
                          <FiCheck className="text-green-500" />
                        </>
                      ) : (
                        <>
                          <FiCopy />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                {}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Link Expiry
                  </label>
                  <select
                    value={shareExpiry}
                    onChange={(e) => setShareExpiry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {expiryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {shareExpiry && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Expires: {formatDate(getExpiryDate(shareExpiry), 'PPpp')}
                    </p>
                  )}
                </div>

                {}
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowQRCode(!showQRCode)}
                    className="w-full"
                  >
                    <FiGrid className="mr-2" />
                    {showQRCode ? 'Hide' : 'Show'} QR Code
                  </Button>
                </div>

                {}
                <AnimatePresence>
                  {showQRCode && (
                    <motion.div
                      className="text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="bg-white p-4 rounded-lg inline-block">
                        <div ref={qrCodeRef}>
                          <QRCode
                            value={shareLink}
                            size={200}
                            level="H"
                            bgColor="#ffffff"
                            fgColor="#000000"
                          />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                        Scan this QR code to access the document
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleDownloadQR}
                        className="mt-2"
                      >
                        <FiDownload className="mr-1" />
                        Download QR Code
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FiEye className="text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900 dark:text-blue-100">
                        Share Statistics
                      </h4>
                      <div className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
                        <p>Total Views: {document?.viewCount || 0}</p>
                        <p>Shared: {document?.createdAt ? formatDate(document.createdAt, 'PPP') : 'Not yet shared'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <FiShield className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                        Security Notice
                      </h4>
                      <p className="mt-1 text-sm text-yellow-800 dark:text-yellow-200">
                        Anyone with this link can view the document. Share only with trusted individuals.
                        You can disable sharing at any time.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={loading}
            >
              {shareEnabled ? 'Enable Sharing' : 'Disable Sharing'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default DocumentShare;