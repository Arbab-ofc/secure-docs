import React from 'react';
import { motion } from 'framer-motion';
import { FiShield, FiLock, FiDatabase, FiUsers, FiRefreshCw } from 'react-icons/fi';

const sections = [
  {
    title: 'Information We Collect',
    icon: FiDatabase,
    items: [
      'Account details such as name, email, and profile information provided during registration.',
      'Documents and metadata uploaded through the platform (e.g., titles, categories, tags).',
      'Usage data like login timestamps, device type, and anonymized analytics to improve the service.'
    ]
  },
  {
    title: 'How We Use Information',
    icon: FiRefreshCw,
    items: [
      'Deliver core features including secure document storage, sharing, and notifications.',
      'Maintain platform security, detect abuse, and comply with legal obligations.',
      'Improve the product by analyzing anonymized usage trends and user feedback.'
    ]
  },
  {
    title: 'Data Sharing & Disclosure',
    icon: FiUsers,
    items: [
      'We do not sell personal data. Documents are only shared when you explicitly enable sharing.',
      'Service providers (e.g., Firebase, Cloudinary) process data under strict confidentiality agreements.',
      'We may disclose information if required by law or to protect the safety of our users.'
    ]
  },
  {
    title: 'Security & Retention',
    icon: FiLock,
    items: [
      'Documents are encrypted in transit and at rest using the security capabilities of our hosting partners.',
      'Access is restricted to authenticated sessions and role-based permissions.',
      'Data is retained while your account is active; you can delete documents or request account removal at any time.'
    ]
  }
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 mx-auto flex items-center justify-center shadow-lg">
            <FiShield className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400 font-semibold">
              Privacy Policy
            </p>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Your Security, Our Priority
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              This policy explains what data SecureDocs collects, how it is used, and the safeguards in place to protect your privacy.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: December 2024</p>
          </div>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                    <Icon className="text-xl" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{section.title}</h2>
                </div>
                <ul className="list-disc list-inside space-y-3 text-gray-700 dark:text-gray-300">
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-8 text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Questions about your data?
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Contact us anytime at <a href="mailto:arbabprvt@gmail.com" className="text-primary-600 dark:text-primary-400 underline">support@securedocs.app</a> to request data access, corrections, or deletion.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
