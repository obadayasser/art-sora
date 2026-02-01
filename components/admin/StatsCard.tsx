'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan';
  onClick?: () => void;
  loading?: boolean;
}

const colorClasses = {
  blue: {
    bg: 'from-blue-500 to-blue-600',
    light: 'bg-blue-50 dark:bg-blue-900/20',
    icon: 'text-blue-600 dark:text-blue-400',
    trend: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
  },
  green: {
    bg: 'from-green-500 to-green-600',
    light: 'bg-green-50 dark:bg-green-900/20',
    icon: 'text-green-600 dark:text-green-400',
    trend: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
  },
  purple: {
    bg: 'from-purple-500 to-purple-600',
    light: 'bg-purple-50 dark:bg-purple-900/20',
    icon: 'text-purple-600 dark:text-purple-400',
    trend: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
  },
  orange: {
    bg: 'from-orange-500 to-orange-600',
    light: 'bg-orange-50 dark:bg-orange-900/20',
    icon: 'text-orange-600 dark:text-orange-400',
    trend: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
  },
  red: {
    bg: 'from-red-500 to-red-600',
    light: 'bg-red-50 dark:bg-red-900/20',
    icon: 'text-red-600 dark:text-red-400',
    trend: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
  },
  cyan: {
    bg: 'from-cyan-500 to-cyan-600',
    light: 'bg-cyan-50 dark:bg-cyan-900/20',
    icon: 'text-cyan-600 dark:text-cyan-400',
    trend: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300'
  }
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  color = 'blue',
  onClick,
  loading = false
}: StatsCardProps) {
  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 ${onClick ? 'cursor-pointer' : ''}`}
    >
      {/* Gradient Background */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.bg} opacity-5 rounded-full -mr-16 -mt-16`} />

      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <div className={`${colors.light} p-3 rounded-xl`}>
            <Icon className={colors.icon} size={24} />
          </div>

          {/* Trend Badge */}
          {trend && (
            <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.trend}`}>
              {trend.isPositive ? (
                <TrendingUp size={14} />
              ) : (
                <TrendingDown size={14} />
              )}
              <span>{trend.value}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {title}
          </h3>
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            <motion.p
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-3xl font-bold text-gray-900 dark:text-white"
            >
              {value}
            </motion.p>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      {onClick && (
        <motion.div
          className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ color: `var(--color-${color}-500)` }}
        />
      )}
    </motion.div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  );
}
