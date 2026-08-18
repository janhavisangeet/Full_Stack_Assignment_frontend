'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  disabled,
  className,
  style,
  ...props
}: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontFamily: 'inherit',
    fontWeight: 500,
    borderRadius: 6,
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.15s ease',
    whiteSpace: 'nowrap',
    opacity: disabled || loading ? 0.6 : 1,
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { fontSize: 12, padding: '5px 10px' },
    md: { fontSize: 13, padding: '7px 14px' },
    lg: { fontSize: 14, padding: '10px 20px' },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--accent)',
      color: 'var(--accent-foreground)',
    },
    secondary: {
      background: 'var(--card)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
    },
    danger: {
      background: '#fef2f2',
      color: '#dc2626',
      border: '1px solid #fecaca',
    },
  };

  return (
    <button
      disabled={disabled || loading}
      style={{ ...baseStyle, ...sizeStyles[size], ...variantStyles[variant], ...style }}
      className={cn('focus-ring', className)}
      {...props}
    >
      {loading && (
        <span
          style={{
            width: size === 'sm' ? 12 : 14,
            height: size === 'sm' ? 12 : 14,
            border: '2px solid currentColor',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 0.7s linear infinite',
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </button>
  );
}
