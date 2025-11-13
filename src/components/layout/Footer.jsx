import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiMail,
  FiGithub,
  FiLinkedin,
  FiTwitter,
  FiShield,
  FiPhone,
  FiMapPin,
  FiClock,
  FiArrowUp
} from 'react-icons/fi';

import { useTheme } from '../../context/ThemeContext';

const Footer = () => {
  const { isDark } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const footerSections = [
    {
      title: 'Product',
      items: [
        { name: 'Features', path: '/product#features' },
        { name: 'Security', path: '/product#security' },
        { name: 'Pricing', path: '/product#pricing' },
        { name: 'FAQ', path: '/product#faq' }
      ]
    },
    {
      title: 'Company',
      items: [
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' }
      ]
    }
  ];

  const socialLinks = [
    {
      name: 'GitHub',
      icon: FiGithub,
      href: 'https://github.com/Arbab-ofc',
      color: 'hover:text-gray-900 dark:hover:text-white'
    },
    {
      name: 'LinkedIn',
      icon: FiLinkedin,
      href: 'https://www.linkedin.com/in/arbab-ofc/',
      color: 'hover:text-blue-600 dark:hover:text-blue-400'
    },
    {
      name: 'Twitter',
      icon: FiTwitter,
      href: 'https://twitter.com/arbab_ofc',
      color: 'hover:text-blue-400'
    },
    {
      name: 'Email',
      icon: FiMail,
      href: 'mailto:arbabprvt@gmail.com',
      color: 'hover:text-red-600 dark:hover:text-red-400'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const contactInfo = [
    {
      label: 'Email',
      value: 'arbabprvt@gmail.com',
      href: 'mailto:arbabprvt@gmail.com',
      icon: FiMail
    },
    {
      label: 'Phone',
      value: '+91 73670 84034',
      href: 'tel:+917367084034',
      icon: FiPhone
    },
    {
      label: 'Location',
      value: 'Patna, India',
      icon: FiMapPin
    },
    {
      label: 'Support',
      value: 'Mon - Fri · 9am - 6pm IST',
      icon: FiClock
    }
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <footer className="bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <div className="py-10 sm:py-14 space-y-8">
          {}
          <motion.div
            className="bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow-md rounded-3xl p-6 sm:p-8 border border-gray-200/80 dark:border-gray-800"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-wide font-semibold text-primary-600 dark:text-primary-400">
                  Ready when you are
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Protect your documents with SecureDocs
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-3xl">
                  Simple onboarding, dedicated support, and granular sharing controls built for families and professionals.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link
                  to="/register"
                  className="inline-flex justify-center items-center rounded-full bg-primary-600 text-white px-6 py-3 text-sm font-semibold shadow-lg shadow-primary-600/30 hover:bg-primary-700 transition"
                >
                  Create free vault
                </Link>
                <Link
                  to="/product#pricing"
                  className="inline-flex justify-center items-center rounded-full border border-gray-300 dark:border-gray-700 px-6 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  View pricing
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {}
            <motion.div
              className="bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 dark:border-gray-800 h-full"
              variants={itemVariants}
            >
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <FiShield className="text-white text-xl" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                  SecureDocs
                </span>
              </Link>

              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                A secure and professional platform for storing and sharing your important government documents with family members.
              </p>

              {}
              <div className="flex flex-wrap items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-2 rounded-lg bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 ${social.color} transition-colors`}
                      aria-label={social.name}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="text-lg" />
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {}
            <motion.div
              className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4"
              variants={itemVariants}
            >
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-2xl p-5 border border-gray-200 dark:border-gray-800 h-full sm:col-span-2">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-3">
                  Explore SecureDocs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {footerSections.map((section) => (
                    <div key={section.title}>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-2">
                        {section.title}
                      </p>
                      <ul className="space-y-2.5">
                        {section.items.map((item) => (
                          <li key={item.name} className="group">
                            <Link
                              to={item.path}
                              className="flex items-center justify-between text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm font-medium"
                            >
                              <span>{item.name}</span>
                              <FiArrowUp className="text-xs transform rotate-45 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {}
              <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-2xl p-5 border border-gray-200 dark:border-gray-800 col-span-1 sm:col-span-2">
                <h3 className="text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-widest mb-3">
                  Get in touch
                </h3>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
                  {contactInfo.map((info) => {
                    const Icon = info.icon;
                    const Wrapper = info.href ? 'a' : 'div';
                    const wrapperProps = info.href
                      ? {
                          href: info.href,
                          target: info.href.startsWith('http') ? '_blank' : undefined,
                          rel: info.href.startsWith('http') ? 'noopener noreferrer' : undefined
                        }
                      : {};

                    return (
                      <Wrapper
                        key={info.label}
                        className="group flex flex-col gap-1 rounded-xl border border-gray-200 dark:border-gray-800 p-3 hover:border-primary-500 dark:hover:border-primary-400 transition-colors"
                        {...wrapperProps}
                      >
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                          <Icon className="text-base text-primary-500" />
                          {info.label}
                        </div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {info.value}
                        </p>
                      </Wrapper>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {}
        <div className="py-6 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col gap-5">
            {}
            <motion.div
              className="flex flex-col gap-2 text-center sm:text-left sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="space-y-1">
                <span className="block font-semibold text-gray-900 dark:text-gray-100">© 2024 SecureDocs</span>
                <span className="block">All rights reserved.</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 font-medium">
                <span className="text-gray-500 dark:text-gray-400">Crafted by</span>
                <a
                  href="https://github.com/Arbab-ofc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  Arbab Arshad
                </a>
              </div>
            </motion.div>

            {}
            <motion.div
              className="grid grid-cols-1 gap-3 sm:grid-cols-3"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link
                to="/privacy"
                className="flex items-center justify-between rounded-2xl border border-gray-200 dark:border-gray-800 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
              >
                Privacy Policy
                <FiArrowUp className="text-xs rotate-45" />
              </Link>
              <Link
                to="/terms"
                className="flex items-center justify-between rounded-2xl border border-gray-200 dark:border-gray-800 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
              >
                Terms of Use
                <FiArrowUp className="text-xs rotate-45" />
              </Link>
              <motion.button
                onClick={scrollToTop}
                className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-gray-800 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                aria-label="Back to top"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                <FiArrowUp className="text-base" />
                Back to top
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {}
      <div className="h-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500" />
    </footer>
  );
};

export default Footer;
