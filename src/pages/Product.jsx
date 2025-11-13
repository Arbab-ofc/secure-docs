import React from 'react';
import { motion } from 'framer-motion';
import {
  FiLock,
  FiShield,
  FiCloud,
  FiShare2,
  FiUsers,
  FiSmartphone,
  FiCheckCircle,
  FiDatabase
} from 'react-icons/fi';

import Button from '../components/common/Button';
import { Link, useNavigate } from 'react-router-dom';

const features = [
  {
    icon: FiLock,
    title: 'Bank-Level Encryption',
    description: 'AES-256 encryption in transit and at rest keeps every document protected.'
  },
  {
    icon: FiShare2,
    title: 'Smart Sharing',
    description: 'Generate expiring links and QR codes with granular control over viewer access.'
  },
  {
    icon: FiCloud,
    title: 'Cloud Backup',
    description: 'Redundant cloud storage and automated backups prevent accidental loss.'
  },
  {
    icon: FiSmartphone,
    title: 'Any Device',
    description: 'Fully responsive experience so you can manage documents from desktop or mobile.'
  },
  {
    icon: FiUsers,
    title: 'Family Workspaces',
    description: 'Organize documents into categories and share them with trusted family members.'
  },
  {
    icon: FiCheckCircle,
    title: 'Audit Trails',
    description: 'Track uploads, shares, and downloads for complete visibility.'
  }
];

const securityControls = [
  {
    title: 'Zero-trust Access',
    description: 'Every request is validated against Firebase Auth and Firestore security rules.'
  },
  {
    title: 'Document Sanitization',
    description: 'Uploads are validated and stored via Cloudinary with secure presets.'
  },
  {
    title: 'Activity Monitoring',
    description: 'Real-time logging of shares and downloads to detect abnormal behavior.'
  },
  {
    title: 'Compliance Ready',
    description: 'Data residency and retention options support personal/governmental compliance needs.'
  }
];

const pricingPlan = {
  name: 'Free Forever',
  price: '$0',
  description: 'Full SecureDocs experience with generous limits while we are in public beta.',
  features: [
    'Unlimited uploads during beta',
    'Secure sharing links & QR codes',
    'Cloud backups + audit history',
    'Community support via email'
  ]
};

const faqs = [
  {
    question: 'What file types do you support?',
    answer: 'SecureDocs accepts PDFs, images, and Office documents up to 10MB per file. Larger tiers unlock bigger limits.'
  },
  {
    question: 'Can I revoke a shared document?',
    answer: 'Yes. Disable sharing from the dashboard to immediately invalidate public links and QR codes.'
  },
  {
    question: 'Where is my data stored?',
    answer: 'Documents live in Cloudinary and metadata in Firestore, both hosted on secure Google Cloud data centers.'
  },
  {
    question: 'Do you offer custom branding?',
    answer: 'Custom theming and white-label support are available on Enterprise plans.'
  }
];

const SectionHeader = ({ label, title, subtitle }) => (
  <motion.div
    className="text-center space-y-3"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4 }}
  >
    <p className="text-sm uppercase tracking-widest text-primary-600 dark:text-primary-400 font-semibold">
      {label}
    </p>
    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h2>
    {subtitle && (
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
        {subtitle}
      </p>
    )}
  </motion.div>
);

const Product = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
          {}
          <motion.section
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center px-4 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-sm font-medium">
              SecureDocs Platform Overview
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Everything you need to secure and share documents
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Explore the features, security controls, transparent pricing, and answers to common questions—all in one place.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#features">
                <Button size="lg">Explore Features</Button>
              </a>
              <a
                href="#pricing"
                className="inline-flex items-center px-5 py-3 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                View Pricing
              </a>
            </div>
          </motion.section>

          {}
          <section id="features" className="space-y-12">
            <SectionHeader
              label="Features"
              title="Built for modern document management"
              subtitle="Designed for families, professionals, and organizations that need speed without compromising on security."
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
                      <Icon className="text-xl" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {}
          <section id="security" className="space-y-12">
            <SectionHeader
              label="Security"
              title="Enterprise-grade protection"
              subtitle="Security is built into every layer—from authentication to storage." />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {securityControls.map((control, index) => (
                <motion.div
                  key={control.title}
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary-50 dark:bg-secondary-900/30 text-secondary-600 dark:text-secondary-400 flex items-center justify-center">
                      <FiShield />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{control.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{control.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {}
          <section id="pricing" className="space-y-12">
            <SectionHeader
              label="Pricing"
              title="Flexible plans for every stage"
              subtitle="We are currently operating with a single, generous free tier while we learn from early users." />

            <motion.div
              className="max-w-2xl mx-auto bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-3xl p-8 space-y-6 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-white/80">{pricingPlan.name}</p>
                <p className="text-4xl font-extrabold">{pricingPlan.price}</p>
                <p className="text-white/80">{pricingPlan.description}</p>
              </div>
              <ul className="space-y-3">
                {pricingPlan.features.map((item) => (
                  <li key={item} className="flex items-start space-x-2">
                    <FiCheckCircle className="text-white mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3">
                <Link to="/register" className="flex-1">
                  <Button className="w-full">Get Started</Button>
                </Link>
                <a
                  href="#faq"
                  className="flex-1 inline-flex items-center justify-center rounded-2xl border border-white/40 px-4 py-3 text-sm font-medium hover:bg-white/10"
                >
                  Read FAQ
                </a>
              </div>
            </motion.div>
          </section>

          {}
          <section id="faq" className="space-y-12">
            <SectionHeader
              label="FAQ"
              title="Answers at a glance"
              subtitle="Still curious? These are the top questions we get from new users." />

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.details
                  key={faq.question}
                  className="group border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <summary className="flex items-center justify-between cursor-pointer text-lg font-semibold text-gray-900 dark:text-white">
                    {faq.question}
                    <FiDatabase className="text-primary-500 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="mt-3 text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </motion.details>
              ))}
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-widest text-orange-600 dark:text-orange-400 font-semibold">Need more info?</p>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">Talk to us about custom workflows.</h3>
                <p className="text-gray-600 dark:text-gray-300">Email support@securedocs.app and we will respond within 24 hours.</p>
              </div>
              <Button onClick={() => navigate('/contact')}>
                Contact Sales
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Product;
