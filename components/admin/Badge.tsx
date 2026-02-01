'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  dot?: boolean;
  pulse?: boolean;
}

const variantClasses = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  error: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  cyan: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
};

const dotColors = {
  default: 'bg-gray-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  purple: 'bg-purple-500',
  cyan: 'bg-cyan-500',
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  icon: Icon,
  dot = false,
  pulse = false
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          {pulse && (
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${dotColors[variant]} opacity-75`} />
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`} />
        </span>
      )}
      {Icon && <Icon size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />}
      {children}
    </span>
  );
}

// Status-specific badges
export function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { variant: BadgeProps['variant']; pulse?: boolean }> = {
    PENDING: { variant: 'warning', pulse: true },
    CONFIRMED: { variant: 'info' },
    PROCESSING: { variant: 'purple', pulse: true },
    SHIPPED: { variant: 'cyan' },
    DELIVERED: { variant: 'success' },
    CANCELLED: { variant: 'error' },
    REFUNDED: { variant: 'default' },
    ACTIVE: { variant: 'success', pulse: true },
    INACTIVE: { variant: 'default' },
  };

  const config = statusConfig[status] || { variant: 'default' as const };

  return (
    <Badge variant={config.variant} dot pulse={config.pulse}>
      {status}
    </Badge>
  );
}
