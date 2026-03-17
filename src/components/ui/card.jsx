import React from 'react';
import { cn } from './button';

export const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/60 dark:bg-zinc-900/60 p-6 backdrop-blur-xl shadow-xl shadow-zinc-200/20 dark:shadow-black/40',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';
