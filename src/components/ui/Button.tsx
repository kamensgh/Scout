'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'bg-scout-dark text-white hover:bg-scout-dark/90 focus-visible:ring-scout-dark',
        secondary: 'bg-white text-scout-dark border border-scout-border hover:bg-scout-bg focus-visible:ring-scout-dark',
        ghost: 'text-scout-dark hover:bg-black/5 focus-visible:ring-scout-dark',
        danger: 'bg-scout-red text-white hover:bg-scout-red/90 focus-visible:ring-scout-red',
        accent: 'bg-scout-accent text-white hover:bg-scout-accent/90 focus-visible:ring-scout-accent',
        outline: 'border border-scout-dark text-scout-dark hover:bg-scout-dark hover:text-white focus-visible:ring-scout-dark',
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-lg',
        md: 'h-10 px-4 text-sm rounded-xl',
        lg: 'h-12 px-6 text-base rounded-xl',
        xl: 'h-14 px-8 text-base rounded-2xl',
        icon: 'h-10 w-10 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonProps };
