'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { getProductSizes, createProductSize, updateProductSize, deleteProductSize } from '@/lib/client/api-admin';
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Loader2,
  Ruler,
  Check,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { ProductSize } from '@/types';

export default function SizesManagementPage() {
  const { token } = useAdminAuth();
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    width: '',
    height: '',
    unit: 'cm',
    sortOrder: 0,
    isActive: true
  });

  useEffect(() => {
    if (token) {
      loadSizes();
    }
  }, [token]);

  const loadSizes = async () => {
    try {
      setIsLoading(true);
      const data = await getProductSizes(token!);
      setSizes(data);
    } catch (error) {
      toast.error('Failed to load sizes');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredSizes = sizes.filter(size =>
    size.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    size.width.includes(searchTerm) ||
    size.height.includes(searchTerm)
  );

  const handleCreateSize = () => {
    setModalMode('create');
    setFormData({
      name: '',
      width: '',
      height: '',
      unit: 'cm',
      sortOrder: sizes.length,
      isActive: true
    });
    setShowModal(true);
  };

  const handleEditSize = (size: ProductSize) => {
    setModalMode('edit');
    setSelectedSize(size);
    setFormData({
      name: size.name,
      width: size.width,
      height: size.height,
      unit: size.unit,
      sortOrder: size.sortOrder,
      isActive: size.isActive
    });
    setShowModal(true);
    setActionMenuOpen(null);
  };

  const handleDeleteSize = async (size: ProductSize) => {
    if (!confirm(`Are you sure you want to delete ${size.name}?`)) return;

    try {
      setIsLoading(true);
      await deleteProductSize(token!, size.id);
      toast.success('Size deleted successfully');
      loadSizes();
      setActionMenuOpen(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete size');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      if (modalMode === 'create') {
        await createProductSize(token!, formData);
        toast.success('Size created successfully');
      } else if (modalMode === 'edit' && selectedSize) {
        await updateProductSize(token!, selectedSize.id, formData);
        toast.success('Size updated successfully');
      }

      setShowModal(false);
      loadSizes();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Product Sizes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage product size options
          </p>
        </div>
        <button
          onClick={handleCreateSize}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/30"
        >
          <Plus size={20} className="mr-2" />
          Add Size
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search sizes..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Sizes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))
        ) : filteredSizes.length > 0 ? (
          filteredSizes.map((size) => (
            <div
              key={size.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Ruler className="text-blue-500" size={20} />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {size.name}
                  </h3>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setActionMenuOpen(actionMenuOpen === size.id ? null : size.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <MoreVertical size={18} className="text-gray-500 dark:text-gray-400" />
                  </button>
                  {actionMenuOpen === size.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-10">
                      <button
                        onClick={() => handleEditSize(size)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                      >
                        <Edit2 size={16} className="mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSize(size)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {size.width} × {size.height} {size.unit}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    Order: {size.sortOrder}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    size.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {size.isActive ? <Check size={12} className="mr-1" /> : <X size={12} className="mr-1" />}
                    {size.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
            No sizes found
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {modalMode === 'create' ? 'Add New Size' : 'Edit Size'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g., 20×30 cm"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Width *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                    required
                    placeholder="20"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Height *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    required
                    placeholder="30"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Unit *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="cm">cm</option>
                    <option value="in">inch</option>
                    <option value="mm">mm</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Active
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : modalMode === 'create' ? 'Create' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
