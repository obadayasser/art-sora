'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Tag,
  Map,
  Star,
  Ruler,
  LogOut,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/admin/users', label: 'Users', icon: <Users size={20} /> },
  { href: '/admin/categories', label: 'Categories', icon: <Package size={20} /> },
  { href: '/admin/sizes', label: 'Sizes', icon: <Ruler size={20} /> },
  { href: '/admin/products', label: 'Products', icon: <Package size={20} /> },
  { href: '/admin/orders', label: 'Orders', icon: <ShoppingCart size={20} /> },
  { href: '/admin/discounts', label: 'Discount Codes', icon: <Tag size={20} /> },
  { href: '/admin/locations', label: 'Locations', icon: <Map size={20} /> },
  { href: '/admin/reviews', label: 'Reviews', icon: <Star size={20} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { admin, isAuthenticated, logout, isLoading, isInitialized } = useAdminAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and on resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  // Redirect to login if not authenticated - ONLY after initialization is complete
  useEffect(() => {
    
    
    // Don't redirect if not initialized yet
    if (!isInitialized) {
      
      return;
    }
    
    // If authenticated and on login page, redirect to dashboard
    if (isAuthenticated && pathname === '/admin/login') {
      
      router.replace('/admin');
      return;
    }
    
    // If not authenticated and not on login page, redirect to login
    if (!isAuthenticated && pathname !== '/admin/login') {
      
      router.replace('/admin/login');
      return;
    }
    
    
  }, [isAuthenticated, pathname, router, isInitialized]);

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <div className="w-8" />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
          ${isMobile ? 'w-72' : 'w-64'}
        `}
      >
        {/* Sidebar Header */}
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            {admin && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {admin.email}
              </p>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-3 rounded-lg transition-colors
                        ${isActive
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                      `}
                    >
                      <span className="mr-3">{item.icon}</span>
                      <span className="flex-1">{item.label}</span>
                      {isActive && <ChevronRight size={16} />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            {admin && (
              <div className="mb-4 px-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{admin.fullName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{admin.role.toLowerCase()}</p>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <LogOut size={20} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ease-in-out
          ${isMobile ? 'pt-16' : ''}
          lg:mr-0
        `}
      >
        <div className={`${isSidebarOpen && isMobile ? 'mr-0' : ''} lg:ml-64`}>
          {/* Desktop Header */}
          <div className="hidden lg:block bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {navItems.find(item => pathname === item.href)?.label || 'Admin Dashboard'}
            </h2>
          </div>

          {/* Page Content */}
          <div className="p-4 lg:p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
