'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { getDashboardStats, getOrders } from '@/lib/client/api-admin';
import {
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Clock,
  Eye,
  TrendingUp,
  Star,
  AlertCircle
} from 'lucide-react';
import { StatsCard, StatsCardSkeleton } from '@/components/admin/StatsCard';
import { StatusBadge } from '@/components/admin/Badge';
import { DataTable, Column, Action } from '@/components/admin/DataTable';
import { BarChart, LineChart, DonutChart } from '@/components/admin/Charts';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { Order } from '@/types';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { token } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: '0',
    totalProducts: 0,
    pendingOrders: 0,
    recentOrders: [] as Order[]
  });

  useEffect(() => {
    if (token) {
      loadDashboardData();
    }
  }, [token]);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [dashboardStats, ordersData] = await Promise.all([
        getDashboardStats(token!),
        getOrders(token!, 1, 10)
      ]);

      setStats({
        ...dashboardStats,
        recentOrders: ordersData.data
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sample data for charts
  const salesByWeek = [
    { label: 'Mon', value: 1200 },
    { label: 'Tue', value: 1900 },
    { label: 'Wed', value: 1500 },
    { label: 'Thu', value: 2200 },
    { label: 'Fri', value: 2800 },
    { label: 'Sat', value: 3200 },
    { label: 'Sun', value: 2600 }
  ];

  const ordersByCategory = [
    { label: 'Pending', value: stats.pendingOrders || 5, color: '#f59e0b' },
    { label: 'Processing', value: Math.floor((stats.totalOrders || 20) * 0.3), color: '#8b5cf6' },
    { label: 'Delivered', value: Math.floor((stats.totalOrders || 20) * 0.5), color: '#10b981' },
    { label: 'Cancelled', value: Math.floor((stats.totalOrders || 20) * 0.1), color: '#ef4444' }
  ];

  const topProducts = [
    { label: 'Product A', value: 450, color: 'bg-gradient-to-t from-blue-500 to-blue-600' },
    { label: 'Product B', value: 380, color: 'bg-gradient-to-t from-purple-500 to-purple-600' },
    { label: 'Product C', value: 320, color: 'bg-gradient-to-t from-green-500 to-green-600' },
    { label: 'Product D', value: 280, color: 'bg-gradient-to-t from-orange-500 to-orange-600' },
    { label: 'Product E', value: 210, color: 'bg-gradient-to-t from-pink-500 to-pink-600' }
  ];

  // DataTable columns
  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      header: 'Order ID',
      render: (order) => <span className="font-mono text-purple-600">#{order.orderNumber}</span>,
      sortable: true
    },
    {
      key: 'customerEmail',
      header: 'Customer',
      render: (order) => (
        <div>
          <div className="font-medium">{order.customerName || 'N/A'}</div>
          <div className="text-xs text-gray-500">{order.customerEmail}</div>
        </div>
      ),
      sortable: true
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      render: (order) => (
        <span className="font-semibold text-green-600">
          ${parseFloat(order.totalAmount).toLocaleString()}
        </span>
      ),
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      render: (order) => <StatusBadge status={order.status} />,
      sortable: true
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (order) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {new Date(order.createdAt).toLocaleDateString()}
        </span>
      ),
      sortable: true
    }
  ];

  // DataTable actions
  const actions: Action<Order>[] = [
    {
      label: 'View Details',
      icon: <Eye size={16} />,
      onClick: (order) => router.push(`/admin/orders`)
    }
  ];

  if (isLoading) {
    return <LoadingSpinner size="lg" text="Loading dashboard..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 text-white shadow-2xl"
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Welcome Back! 👋</h1>
          <p className="text-white/90 text-lg">
            Here's what's happening with your store today.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24" />
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend={{ value: '+12%', isPositive: true }}
          color="blue"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingCart}
          trend={{ value: '+8%', isPositive: true }}
          color="green"
          onClick={() => router.push('/admin/orders')}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${parseFloat(stats.totalRevenue).toLocaleString()}`}
          icon={DollarSign}
          trend={{ value: '+23%', isPositive: true }}
          color="purple"
        />
        <StatsCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={Clock}
          trend={{ value: '-5%', isPositive: false }}
          color="orange"
          onClick={() => router.push('/admin/orders')}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          data={salesByWeek}
          title="Sales This Week"
          height={250}
          color="#8b5cf6"
        />
        <DonutChart
          data={ordersByCategory}
          title="Orders by Status"
          size={200}
        />
      </div>

      {/* Top Products Chart */}
      <BarChart
        data={topProducts}
        title="Top Selling Products"
        height={250}
      />

      {/* Recent Orders Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Recent Orders
          </h2>
          <button
            onClick={() => router.push('/admin/orders')}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
          >
            View All
          </button>
        </div>
        <DataTable
          data={stats.recentOrders}
          columns={columns}
          actions={actions}
          searchable
          searchPlaceholder="Search orders..."
          emptyMessage="No recent orders found"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/admin/products')}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <Package size={32} />
              <TrendingUp size={24} className="opacity-75" />
            </div>
            <h3 className="text-xl font-bold mb-2">Add New Product</h3>
            <p className="text-blue-100">
              Create and list a new product in your store
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/admin/users')}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <Users size={32} />
              <TrendingUp size={24} className="opacity-75" />
            </div>
            <h3 className="text-xl font-bold mb-2">Manage Users</h3>
            <p className="text-green-100">
              View and manage admin and staff accounts
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/admin/reviews')}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-4">
              <Star size={32} />
              <TrendingUp size={24} className="opacity-75" />
            </div>
            <h3 className="text-xl font-bold mb-2">Manage Reviews</h3>
            <p className="text-purple-100">
              Approve and respond to customer reviews
            </p>
          </motion.div>
        </div>
      </div>

      {/* Alerts/Notifications */}
      {stats.pendingOrders > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="text-orange-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="font-semibold text-orange-900 dark:text-orange-200">
                You have {stats.pendingOrders} pending order{stats.pendingOrders !== 1 ? 's' : ''}
              </h4>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                These orders need your attention. Click here to review and process them.
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/orders')}
              className="ml-auto px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
            >
              View Orders
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
