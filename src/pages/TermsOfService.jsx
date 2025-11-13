import React from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiShield, FiKey, FiAlertTriangle, FiGlobe } from 'react-icons/fi';

const sections = [
  {
    title: '1. Acceptance of Terms',
    icon: FiFileText,
    content: [
      'By creating an account or using SecureDocs you agree to these Terms of Service and our Privacy Policy.',
      'If you use SecureDocs on behalf of an organization you confirm you have authority to bind that organization to these terms.',
      'We may update these terms periodically; continued use of the platform means you accept the updated terms.'
    ]
  },
  {
    title: '2. User Responsibilities',
    icon: FiShield,
    content: [
      'You are responsible for the accuracy of the documents you upload and for maintaining the confidentiality of your login credentials.',
      'You must not upload content that violates laws, infringes on intellectual property rights, or contains malicious code.',
      'You agree to notify us immediately of any unauthorized use of your account.'
    ]
  },
  {
    title: '3. Document Sharing & Access',
    icon: FiKey,
    content: [
      'Documents remain private by default. Sharing features must be explicitly enabled by you.',
      'When you generate secure links or QR codes, you are responsible for how those links are distributed and used.',
      'We reserve the right to disable sharing of documents that violate these terms.'
    ]
  },
  {
    title: '4. Service Availability & Limitations',
    icon: FiGlobe,
    content: [
      'We strive for high uptime but do not guarantee uninterrupted access. Scheduled maintenance may temporarily affect availability.',
      'Certain features (e.g., large file uploads) may be subject to quotas or require upgraded plans in the future.',
      'We may suspend or terminate accounts that abuse the service or threaten platform security.'
    ]
  },
  {
    title: '5. Liability & Indemnification',
    icon: FiAlertTriangle,
    content: [
      'SecureDocs is provided “as is.” We are not liable for indirect damages arising from use of the platform.',
      'You agree to indemnify SecureDocs against claims arising from content you upload or distribute through the platform.',
      'In jurisdictions where limitations are not allowed, our liability is capped at the amount you paid (if any) for the service in the preceding 12 months.'
    ]
  }
];

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 mx-auto flex items-center justify-center shadow-lg">
            <FiFileText className="text-white text-2xl" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400 font-semibold">
              Terms of Service
            </p>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Understand Your Agreement
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              These Terms outline the rules, responsibilities, and limitations that apply when you use SecureDocs.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Effective date: December 2024</p>
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
                  {section.content.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-center space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-widest">Need Assistance?</p>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">We are here to help.</h3>
          <p className="text-gray-600 dark:text-gray-300">
            For questions about these terms or to report abuse, contact <a href="mailto:arbabprvt@gmail.com" className="text-primary-600 dark:text-primary-400 underline">legal@securedocs.app</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsOfService;
