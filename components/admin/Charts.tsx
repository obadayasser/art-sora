'use client';

import { motion } from 'framer-motion';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  title?: string;
  height?: number;
}

export function BarChart({ data, title, height = 300 }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {title}
        </h3>
      )}
      <div style={{ height }} className="flex items-end justify-between gap-2">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              className={`w-full rounded-t-lg ${item.color || 'bg-gradient-to-t from-purple-500 to-purple-600'}`}
              style={{ minHeight: '4px' }}
            >
              <div className="h-full flex items-start justify-center pt-2">
                <span className="text-xs font-semibold text-white">
                  {item.value}
                </span>
              </div>
            </motion.div>
            <span className="text-xs text-gray-600 dark:text-gray-400 text-center">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface LineChartProps {
  data: { label: string; value: number }[];
  title?: string;
  height?: number;
  color?: string;
}

export function LineChart({ data, title, height = 300, color = '#8b5cf6' }: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue || 1;

  const width = 100;
  const chartHeight = 80;

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = chartHeight - ((item.value - minValue) / range) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,${chartHeight} ${points} ${width},${chartHeight}`;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {title}
        </h3>
      )}
      <div style={{ height }}>
        <svg viewBox={`0 0 ${width} ${chartHeight}`} className="w-full h-full">
          {/* Area gradient */}
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area */}
          <motion.polygon
            points={areaPoints}
            fill="url(#areaGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Line */}
          <motion.polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          />

          {/* Points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = chartHeight - ((item.value - minValue) / range) * chartHeight;
            return (
              <motion.circle
                key={index}
                cx={x}
                cy={y}
                r="2"
                fill={color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              />
            );
          })}
        </svg>
      </div>
      {/* Labels */}
      <div className="flex justify-between mt-4">
        {data.map((item, index) => (
          <span key={index} className="text-xs text-gray-600 dark:text-gray-400">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

interface DonutChartProps {
  data: { label: string; value: number; color: string }[];
  title?: string;
  size?: number;
}

export function DonutChart({ data, title, size = 200 }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const strokeWidth = 20;
  const radius = (size / 2) - strokeWidth;
  const circumference = 2 * Math.PI * radius;

  let currentAngle = -90;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {title}
        </h3>
      )}
      <div className="flex items-center gap-6">
        <svg width={size} height={size} className="transform -rotate-90">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const angle = currentAngle;
            currentAngle += (percentage / 100) * 360;

            return (
              <motion.circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={0}
                transform={`rotate(${angle} ${size / 2} ${size / 2})`}
                initial={{ strokeDasharray: `0 ${circumference}` }}
                animate={{ strokeDasharray }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              />
            );
          })}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius - strokeWidth}
            fill="transparent"
          />
        </svg>

        {/* Legend */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {item.label}: <span className="font-semibold text-gray-900 dark:text-white">{item.value}</span>
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface StatsGridProps {
  stats: Array<{
    label: string;
    value: string | number;
    change?: {
      value: string;
      isPositive: boolean;
    };
    icon?: React.ReactNode;
  }>;
  columns?: 2 | 3 | 4;
}

export function StatsGrid({ stats, columns = 4 }: StatsGridProps) {
  const gridClasses = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-4`}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start justify-between mb-3">
            {stat.icon && (
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                {stat.icon}
              </div>
            )}
            {stat.change && (
              <span className={`text-xs font-semibold ${stat.change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change.value}
              </span>
            )}
          </div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {stat.label}
          </h4>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {stat.value}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
