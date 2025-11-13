import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

const buttonVariants = {
  primary: 'bg-primary-600 hover:bg-primary-700 text-white border-primary-600',
  secondary: 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600',
  outline: 'bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 text-primary-600 dark:text-primary-400 border-primary-300 dark:border-primary-600',
  ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border-transparent',
  danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600',
  success: 'bg-green-600 hover:bg-green-700 text-white border-green-600'
};

const sizeVariants = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
};

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  fullWidth = false,
  rounded = 'lg',
  className,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const baseClasses = cn(
    'inline-flex items-center justify-center font-medium transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'border',
    buttonVariants[variant],
    sizeVariants[size],
    {
      'w-full': fullWidth,
      'rounded-sm': rounded === 'sm',
      'rounded-md': rounded === 'md',
      'rounded-lg': rounded === 'lg',
      'rounded-xl': rounded === 'xl',
      'rounded-full': rounded === 'full'
    },
    className
  );

  const motionProps = {
    whileHover: !disabled && !loading ? { scale: 1.02 } : {},
    whileTap: !disabled && !loading ? { scale: 0.98 } : {},
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  };

  const renderIcon = () => {
    if (!Icon) return null;

    const iconSize = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6'
    }[size];

    return (
      <Icon className={cn('shrink-0', iconSize, {
        'mr-2': iconPosition === 'left',
        'ml-2': iconPosition === 'right'
      })} />
    );
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={cn(
              'w-4 h-4 border-2 border-current border-t-transparent rounded-full',
              {
                'mr-2': iconPosition === 'left' || !iconPosition,
                'ml-2': iconPosition === 'right'
              }
            )}
          />
          {children}
        </>
      ) : (
        <>
          {iconPosition === 'left' && renderIcon()}
          {children}
          {iconPosition === 'right' && renderIcon()}
        </>
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export const IconButton = React.forwardRef(({
  icon: Icon,
  size = 'md',
  variant = 'ghost',
  tooltip,
  ...props
}, ref) => {
  const sizeClasses = {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
    xl: 'p-4'
  };

  const iconSize = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  }[size];

  const button = (
    <Button
      ref={ref}
      variant={variant}
      className={cn('p-0', sizeClasses[size])}
      {...props}
    >
      {Icon && <Icon className={iconSize} />}
    </Button>
  );

  if (tooltip) {
    return (
      <div className="relative group">
        {button}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 dark:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          {tooltip}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
        </div>
      </div>
    );
  }

  return button;
});

IconButton.displayName = 'IconButton';

export const LinkButton = React.forwardRef(({
  href,
  external = false,
  ...props
}, ref) => {
  const linkProps = external
    ? { target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <motion.a
      href={href}
      ref={ref}
      {...linkProps}
      {...props}
      as={Button}
    />
  );
});

LinkButton.displayName = 'LinkButton';

export default Button;