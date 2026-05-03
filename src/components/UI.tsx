import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cn } from '../lib/utils';

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'white';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-dark text-white hover:bg-dark/90',
    outline: 'bg-transparent border border-dark/10 text-dark hover:bg-dark/5',
    ghost: 'bg-transparent text-primary hover:bg-primary/5',
    gold: 'bg-accent text-dark hover:bg-accent/90',
    white: 'bg-white text-primary hover:bg-white/90',
  };

  const sizes = {
    sm: 'px-6 py-3 text-[11px] tracking-widest font-bold',
    md: 'px-8 py-4 text-[13px] tracking-widest font-bold',
    lg: 'px-10 py-5 text-[15px] tracking-widest font-bold',
  };

  return (
    <motion.button
      whileHover={{ y: -2, transition: { duration: 0.15, ease: 'easeOut' } }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 rounded-none uppercase',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export const Container = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn('max-w-7xl mx-auto px-10 md:px-16', className)}>
    {children}
  </div>
);

export const Section = ({ 
  children, 
  id, 
  className, 
  dark = false,
  noPadding = false
}: { 
  children: ReactNode; 
  id?: string; 
  className?: string; 
  dark?: boolean;
  noPadding?: boolean;
}) => (
  <section 
    id={id} 
    className={cn(
      noPadding ? '' : 'py-20 md:py-24', 
      dark ? 'bg-dark text-white' : 'bg-white text-dark',
      'border-b border-black/5',
      className
    )}
  >
    {children}
  </section>
);
