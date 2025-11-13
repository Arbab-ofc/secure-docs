import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

const AnimatedBackground = ({ children, variant = 'default' }) => {
  const { isDark } = useTheme();
  const [particles, setParticles] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Generate random particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      const particleCount = variant === 'minimal' ? 5 : 15;

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 10,
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 5,
          opacity: Math.random() * 0.5 + 0.1
        });
      }

      setParticles(newParticles);
    };

    generateParticles();

    const handleResize = () => {
      generateParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [variant]);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getBackgroundGradient = () => {
    if (variant === 'hero') {
      return isDark
        ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20'
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';
    }

    if (variant === 'minimal') {
      return isDark
        ? 'bg-gray-900'
        : 'bg-white';
    }

    return isDark
      ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'
      : 'bg-gradient-to-br from-primary-50 via-white to-secondary-50';
  };

  const particleColors = {
    primary: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)',
    secondary: isDark ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)',
    accent: isDark ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.05)'
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${getBackgroundGradient()} transition-colors duration-300`}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      {/* Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              background: [particleColors.primary, particleColors.secondary, particleColors.accent][particle.id % 3],
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              opacity: particle.opacity
            }}
            animate={{
              x: [
                0,
                Math.sin(particle.id) * 30,
                Math.cos(particle.id) * 30,
                0
              ],
              y: [
                0,
                Math.cos(particle.id) * 30,
                Math.sin(particle.id) * 30,
                0
              ],
              scale: [1, 1.2, 0.8, 1]
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeInOut'
            }}
            exit={{
              opacity: 0,
              scale: 0
            }}
          />
        ))}
      </AnimatePresence>

      {/* Mouse follower gradient */}
      <motion.div
        className="pointer-events-none absolute w-64 h-64 rounded-full opacity-20"
        style={{
          background: isDark
            ? 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
          left: mousePosition.x - 12.5,
          top: mousePosition.y - 12.5
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 10,
          mass: 0.1
        }}
      />

      {/* Floating geometric shapes */}
      {variant === 'hero' && (
        <>
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 border-2 border-primary-500/10 rounded-lg"
            animate={{
              rotate: [0, 45, 90, 135, 180, 225, 270, 315, 360],
              scale: [1, 1.1, 1, 0.9, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear'
            }}
          />

          <motion.div
            className="absolute bottom-20 right-10 w-24 h-24 border-2 border-secondary-500/10 rounded-full"
            animate={{
              rotate: [360, 315, 270, 225, 180, 135, 90, 45, 0],
              scale: [0.9, 1, 1.1, 1, 0.9]
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear'
            }}
          />

          <motion.div
            className="absolute top-1/2 right-20 w-16 h-16 border-2 border-accent-500/10 transform rotate-45"
            animate={{
              y: [0, -20, 0, 20, 0],
              rotate: [45, 135, 225, 315, 405]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </>
      )}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />
    </div>
  );
};

export default AnimatedBackground;