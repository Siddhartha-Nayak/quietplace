import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center rounded-2xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-brand-500 text-white hover:bg-brand-600 shadow-sm shadow-brand-500/20': variant === 'primary',
          'bg-white/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50 hover:bg-zinc-100 dark:hover:bg-zinc-700': variant === 'secondary',
          'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300': variant === 'ghost',
          'h-9 px-4 text-sm': size === 'sm',
          'h-11 px-6 text-base': size === 'md',
          'h-14 px-8 text-lg rounded-3xl': size === 'lg',
          'h-11 w-11': size === 'icon',
        },
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});
Button.displayName = 'Button';
