import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-semibold text-xs rounded-full px-2.5 py-1',
  {
    variants: {
      variant: {
        category: 'bg-black/8 text-scout-dark',
        'price-drop': 'bg-scout-sale-soft text-scout-sale rounded-none',
        'in-stock': 'bg-scout-green/10 text-scout-green',
        'out-of-stock': 'bg-scout-red/10 text-scout-red',
        trending: 'bg-scout-accent/10 text-scout-accent',
        new: 'bg-scout-blue/10 text-scout-blue',
        default: 'bg-scout-bg text-scout-muted border border-scout-border',
      },
    },
    defaultVariants: { variant: 'default' },
  }
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, variant, className }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
