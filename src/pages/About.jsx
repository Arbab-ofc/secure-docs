import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShield, FiTarget, FiUsers, FiAward, FiMail, FiGithub, FiLinkedin } from 'react-icons/fi';

import { useTheme } from '../context/ThemeContext';
import Button from '../components/common/Button';
import { getUserInitial } from '../utils/helpers';

const About = () => {
  const { isDark } = useTheme();

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

  const teamMembers = [
    {
      name: 'Arbab Arshad',
      role: 'Creator & Developer',
      description: 'Full-stack developer passionate about creating secure and user-friendly applications.',
      github: 'https://github.com/Arbab-ofc',
      linkedin: 'https://www.linkedin.com/in/arbab-ofc/',
      email: 'mailto:arbabprvt@gmail.com'
    }
  ];

  const values = [
    {
      icon: FiShield,
      title: 'Security First',
      description: 'We prioritize the security and privacy of your documents above everything else.'
    },
    {
      icon: FiTarget,
      title: 'User Focused',
      description: 'Our platform is designed with simplicity and ease of use in mind.'
    },
    {
      icon: FiUsers,
      title: 'Family Sharing',
      description: 'Enable secure sharing of important documents with trusted family members.'
    },
    {
      icon: FiAward,
      title: 'Professional Quality',
      description: 'Enterprise-grade security and features in a consumer-friendly package.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            About SecureDocs
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We are dedicated to providing a secure, reliable, and user-friendly platform for managing your important documents.
            Founded on the principles of security, privacy, and simplicity.
          </p>
        </motion.div>

        {}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={itemVariants}>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              To provide individuals and families with a secure, intuitive platform for storing and sharing their important documents. We believe that managing your personal documents should be simple, secure, and accessible to everyone.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Whether it's government IDs, educational certificates, medical records, or any other important documents, SecureDocs ensures they are protected with bank-level security while remaining easily shareable with your trusted family members.
            </p>
            <Link to="/register">
              <Button size="lg">
                Get Started Today
              </Button>
            </Link>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8"
            variants={itemVariants}
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">10M+</div>
                <div className="text-gray-600 dark:text-gray-300">Documents Secured</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">50K+</div>
                <div className="text-gray-600 dark:text-gray-300">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">99.9%</div>
                <div className="text-gray-600 dark:text-gray-300">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">24/7</div>
                <div className="text-gray-600 dark:text-gray-300">Support</div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {}
        <section className="mb-16">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {}
        <section className="mb-16">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Meet the Creator
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              The person behind SecureDocs
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">
                    {getUserInitial(member.name, member.email)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {member.description}
                </p>
                <div className="flex items-center justify-center space-x-3">
                  <a
                    href={member.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FiGithub className="text-gray-700 dark:text-gray-300" />
                  </a>
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FiLinkedin className="text-gray-700 dark:text-gray-300" />
                  </a>
                  <a
                    href={member.email}
                    className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <FiMail className="text-gray-700 dark:text-gray-300" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {}
        <motion.div
          className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 md:p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Secure Your Documents?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust SecureDocs with their important documents. Get started with our free plan today.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100">
              Get Started Free
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
