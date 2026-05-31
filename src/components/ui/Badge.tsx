import React, { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'badge',
          {
            'bg-[rgba(255,255,255,0.1)] text-white': variant === 'default',
            'badge-success': variant === 'success',
            'badge-warning': variant === 'warning',
            'badge-danger': variant === 'danger',
            'badge-info': variant === 'info',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Badge.displayName = 'Badge';
