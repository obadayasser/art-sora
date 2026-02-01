'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { getDashboardStats, getOrders } from '@/lib/client/api-admin';
import {
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import type { Order } from '@/types';

export default function AdminDashboardPage() {
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
        getOrders(token!, 1, 5)
      ]);

      setStats({
        ...dashboardStats,
        recentOrders: ordersData.data
      });
    } catch (error) {
    
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'blue',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'green',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue}`,
      icon: DollarSign,
      color: 'purple',
      trend: '+23%',
      trendUp: true
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'orange',
      trend: '-5%',
      trendUp: false
    }
  ];

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'text-blue-600 dark:text-blue-400'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      icon: 'text-green-600 dark:text-green-400'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      icon: 'text-purple-600 dark:text-purple-400'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      icon: 'text-orange-600 dark:text-orange-400'
    }
  };

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    PROCESSING: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    SHIPPED: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    REFUNDED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">Welcome Back! 👋</h1>
        <p className="text-blue-100">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const colors = colorClasses[stat.color as keyof typeof colorClasses];
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className={`${colors.bg} p-3 rounded-lg`}>
                  <Icon className={colors.icon} size={24} />
                </div>
                <div className={`flex items-center text-sm ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                  <span className="ml-1">{stat.trend}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Orders
            </h2>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View All
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{order.orderNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {order.customerEmail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      ${order.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          statusColors[order.status as keyof typeof statusColors]
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No orders yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <Package size={32} />
            <TrendingUp size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-1">Add New Product</h3>
          <p className="text-blue-100 text-sm">
            Create and list a new product in your store
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <Users size={32} />
            <TrendingUp size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-1">Add New User</h3>
          <p className="text-green-100 text-sm">
            Create a new admin or staff account
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <ShoppingCart size={32} />
            <TrendingUp size={24} />
          </div>
          <h3 className="text-lg font-semibold mb-1">View Orders</h3>
          <p className="text-purple-100 text-sm">
            Manage and track all customer orders
          </p>
        </div>
      </div>
    </div>
  );
}
