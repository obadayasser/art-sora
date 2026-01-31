'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { getOrders, getOrderById, updateOrderStatus, deleteOrder } from '@/lib/client/api-admin';
import {
  Search,
  Filter,
  Eye,
  Loader2,
  CheckCircle,
  Clock,
  Truck,
  Package,
  XCircle,
  RefreshCw,
  DollarSign,
  MapPin,
  User,
  Mail,
  Phone,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Order, ProductStatus } from '@/types';

export default function OrdersManagementPage() {
  const { token } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState<ProductStatus>('PENDING');
  const [statusNotes, setStatusNotes] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusOptions: ProductStatus[] = [
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED'
  ];

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    PROCESSING: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    SHIPPED: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    REFUNDED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  };

  const statusIcons = {
    PENDING: Clock,
    CONFIRMED: CheckCircle,
    PROCESSING: Package,
    SHIPPED: Truck,
    DELIVERED: CheckCircle,
    CANCELLED: XCircle,
    REFUNDED: RefreshCw
  };

  useEffect(() => {
    if (token) {
      loadOrders();
    }
  }, [token, currentPage, selectedStatus]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const response = await getOrders(token!, currentPage, 20, selectedStatus || undefined);
      setOrders(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrderDetails = async (orderId: number) => {
    try {
      setIsLoading(true);
      const order = await getOrderById(token!, orderId);
      setSelectedOrder(order);
      setShowViewModal(true);
    } catch (error) {
      toast.error('Failed to load order details');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    loadOrderDetails(order.id);
  };

  const handleUpdateStatus = () => {
    setNewStatus(selectedOrder?.status || 'PENDING');
    setStatusNotes('');
    setShowUpdateStatusModal(true);
  };

  const confirmUpdateStatus = async () => {
    if (!selectedOrder) return;

    try {
      setIsUpdatingStatus(true);
      const updated = await updateOrderStatus(token!, selectedOrder.id, newStatus, statusNotes);
      setSelectedOrder(updated);
      toast.success('Order status updated successfully');
      setShowUpdateStatusModal(false);
      loadOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const confirmDeleteOrder = async () => {
    if (!selectedOrder) return;

    try {
      setIsDeleting(true);
      await deleteOrder(token!, selectedOrder.id);
      toast.success('Order deleted successfully');
      setShowDeleteModal(false);
      setShowViewModal(false);
      loadOrders();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete order');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage customer orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none bg-white dark:bg-gray-700"
          >
            <option value="">All Status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin text-blue-600 mx-auto" size={32} />
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            #{order.orderNumber}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {order.items.length} items
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.customerName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <Mail size={12} className="mr-1" />
                            {order.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          <StatusIcon size={12} className="mr-1" />
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">
                          ${order.totalAmount}
                        </div>
                        {order.discountCode && (
                          <div className="text-xs text-green-600 dark:text-green-400">
                            Code: {order.discountCode}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                          >
                            <Eye size={18} className="text-gray-500 dark:text-gray-400" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order)}
                            className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                            title="Delete order"
                          >
                            <XCircle size={18} className="text-red-500 dark:text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={currentPage === pagination.totalPages}
            className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* View Order Modal */}
      {showViewModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Order #{selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  {(() => {
                    const StatusIcon = statusIcons[selectedOrder.status];
                    return <StatusIcon className={statusColors[selectedOrder.status].split(' ')[1]} size={24} />;
                  })()}
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                    <p className={`font-semibold ${statusColors[selectedOrder.status].split(' ')[1]} capitalize`}>
                      {selectedOrder.status.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleUpdateStatus}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Update Status
                </button>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <User size={20} className="mr-2" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Name</p>
                    <p className="font-medium text-gray-900 dark:text-white">{selectedOrder.customerName}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
                    <p className="font-medium text-gray-900 dark:text-white flex items-center">
                      <Mail size={16} className="mr-2" />
                      {selectedOrder.customerEmail}
                    </p>
                  </div>
                  {selectedOrder.customerPhone && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                      <p className="font-medium text-gray-900 dark:text-white flex items-center">
                        <Phone size={16} className="mr-2" />
                        {selectedOrder.customerPhone}
                      </p>
                    </div>
                  )}
                  {selectedOrder.shippingAddress && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg md:col-span-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Shipping Address</p>
                      <p className="font-medium text-gray-900 dark:text-white flex items-start">
                        <MapPin size={16} className="mr-2 mt-1" />
                        <span>
                          {selectedOrder.shippingAddress.fullName}<br />
                          {selectedOrder.shippingAddress.address}<br />
                          {selectedOrder.shippingAddress.governorate}, {selectedOrder.shippingAddress.country}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <Package size={20} className="mr-2" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {item.productNameAr}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.productNameEn}
                          </p>
                          {item.sizeName && (
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              Size: {item.sizeName}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900 dark:text-white">
                            ${(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ${item.unitPrice} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      {item.customizationPrice && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-sm text-green-600 dark:text-green-400">
                            + Customization: ${item.customizationPrice}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <DollarSign size={20} className="mr-2" />
                  Order Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">${selectedOrder.subtotal}</span>
                  </div>
                  {parseFloat(selectedOrder.discountAmount) > 0 && (
                    <div className="flex justify-between text-green-600 dark:text-green-400">
                      <span>Discount</span>
                      <span className="font-medium">-${selectedOrder.discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="font-medium text-gray-900 dark:text-white">${selectedOrder.shippingCost}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">${selectedOrder.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Notes</h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <p className="font-medium">Created</p>
                  <p>{new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="font-medium">Last Updated</p>
                  <p>{new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Status Modal */}
      {showUpdateStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Update Order Status
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ProductStatus)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                >
                  {statusOptions.map((status) => {
                    const StatusIcon = statusIcons[status];
                    return (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={3}
                  placeholder="Add any notes about this status update..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowUpdateStatusModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmUpdateStatus}
                  disabled={isUpdatingStatus}

                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {/* Delete Order Modal */}
                  {showDeleteModal && selectedOrder && (
                    <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                            Delete Order
                          </h2>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-sm text-red-800 dark:text-red-200 font-medium mb-2">
                              Are you sure you want to delete this order?
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-400">
                              Order #{selectedOrder.orderNumber}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-400">
                              Customer: {selectedOrder.customerName}
                            </p>
                            <p className="text-xs text-red-600 dark:text-red-400">
                              Total: ${selectedOrder.totalAmount}
                            </p>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            This action cannot be undone. The order will be permanently deleted.
                          </p>
                          <div className="flex gap-3 pt-4">
                            <button
                              onClick={() => setShowDeleteModal(false)}
                              disabled={isDeleting}
                              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={confirmDeleteOrder}
                              disabled={isDeleting}
                              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isDeleting ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Delete Order'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {isUpdatingStatus ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
