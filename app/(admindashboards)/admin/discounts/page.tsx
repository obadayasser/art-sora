'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { getDiscountCodes, createDiscountCode, updateDiscountCode, deleteDiscountCode, getCategories, getProducts } from '@/lib/client/api-admin';
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Tag,
  Loader2,
  Percent,
  DollarSign,
  Calendar,
  Check,
  X,
  Package,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { DiscountCode, Category, Product } from '@/types';

export default function DiscountsManagementPage() {
  const { token } = useAdminAuth();
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedDiscount, setSelectedDiscount] = useState<DiscountCode | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    code: '',
    descriptionAr: '',
    descriptionEn: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED_AMOUNT',
    discountValue: '',
    minOrderAmount: '0',
    maxDiscountAmount: '0',
    usageLimit: 100,
    usageLimitPerDevice: 1,
    validFrom: '',
    validUntil: '',
    appliesToProducts: true,
    appliesToShipping: false,
    productIds: [] as number[],
    categoryIds: [] as number[],
  /*   isActive: true */
  });

  useEffect(() => {
    if (token) {
      loadDiscounts();
      loadCategories();
      loadProducts();
    }
  }, [token]);

  const loadDiscounts = async () => {
    try {
      setIsLoading(true);
      const data = await getDiscountCodes(token!);
      setDiscounts(data);
    } catch (error) {
      toast.error('Failed to load discount codes');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await getCategories(token!);
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await getProducts(token!, 1, 100);
      setProducts(data.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    }
  };
  

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredDiscounts = discounts.filter(discount =>
    discount.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discount.descriptionAr.includes(searchTerm) ||
    discount.descriptionEn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateDiscount = () => {
    setModalMode('create');
    setFormData({
      code: '',
      descriptionAr: '',
      descriptionEn: '',
      discountType: 'PERCENTAGE',
      discountValue: '',
      minOrderAmount: '0',
      maxDiscountAmount: '0',
      usageLimit: 100,
      usageLimitPerDevice: 1,
      validFrom: '',
      validUntil: '',
      appliesToProducts: true,
      appliesToShipping: false,
      productIds: [],
      categoryIds: []/* ,
      isActive: true */
    });
    setShowModal(true);
  };

  const handleEditDiscount = (discount: DiscountCode) => {
    setModalMode('edit');
    setSelectedDiscount(discount);
    setFormData({
      code: discount.code,
      descriptionAr: discount.descriptionAr,
      descriptionEn: discount.descriptionEn,
      discountType: discount.discountType,
      discountValue: discount.discountValue,
      minOrderAmount: discount.minOrderAmount,
      maxDiscountAmount: discount.maxDiscountAmount,
      usageLimit: discount.usageLimit,
      usageLimitPerDevice: discount.usageLimitPerDevice,
      validFrom: discount.validFrom.split('T')[0],
      validUntil: discount.validUntil.split('T')[0],
      appliesToProducts: discount.appliesToProducts,
      appliesToShipping: discount.appliesToShipping,
      productIds: discount.productIds,
      categoryIds: discount.categoryIds,
    /*   isActive: discount.isActive */
    });
    setShowModal(true);
    setActionMenuOpen(null);
  };

  const handleDeleteDiscount = (discount: DiscountCode) => {
    setSelectedDiscount(discount);
    setShowDeleteModal(true);
    setActionMenuOpen(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const submitData = {
        ...formData,
        validFrom: new Date(formData.validFrom).toISOString(),
        validUntil: new Date(formData.validUntil).toISOString()
      };

      if (modalMode === 'create') {
        await createDiscountCode(token!, submitData);
        toast.success('Discount code created successfully');
      } else if (modalMode === 'edit' && selectedDiscount) {
        await updateDiscountCode(token!, selectedDiscount.id, submitData);
        toast.success('Discount code updated successfully');
      }

      setShowModal(false);
      loadDiscounts();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedDiscount) return;

    try {
      setIsLoading(true);
      await deleteDiscountCode(token!, selectedDiscount.id);
      toast.success('Discount code deleted successfully');
      setShowDeleteModal(false);
      loadDiscounts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete discount code');
    } finally {
      setIsLoading(false);
    }
  };

  const isExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Discount Codes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage promotional codes and offers
          </p>
        </div>
        <button
          onClick={handleCreateDiscount}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/30"
        >
          <Plus size={20} className="mr-2" />
          Add Discount Code
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search discount codes..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Discount Codes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))
        ) : filteredDiscounts.length > 0 ? (
          filteredDiscounts.map((discount) => (
            <div
              key={discount.id}
              className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all ${
                isExpired(discount.validUntil) ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    {discount.discountType === 'PERCENTAGE' ? (
                      <Percent className="text-white" size={24} />
                    ) : (
                      <DollarSign className="text-white" size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {discount.code}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {discount.descriptionAr}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setActionMenuOpen(actionMenuOpen === discount.id ? null : discount.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <MoreVertical size={18} className="text-gray-500 dark:text-gray-400" />
                  </button>
                  {actionMenuOpen === discount.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-10">
                      <button
                        onClick={() => handleEditDiscount(discount)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                      >
                        <Edit2 size={16} className="mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDiscount(discount)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Discount</span>
                  <span className="text-lg font-bold text-green-600 dark:text-green-400">
                    {discount.discountType === 'PERCENTAGE'
                      ? `${discount.discountValue}%`
                      : `$${discount.discountValue}`
                    }
                  </span>
                </div>
                {parseFloat(discount.minOrderAmount) > 0 && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Min order: ${discount.minOrderAmount}
                  </div>
                )}
                {parseFloat(discount.maxDiscountAmount) > 0 && (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Max discount: ${discount.maxDiscountAmount}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Calendar size={14} className="mr-1" />
                  Until {new Date(discount.validUntil).toLocaleDateString()}
                </div>
              </div>

              <div className="space-y-2 mb-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Tag size={14} className="mr-1" />
                  Usage: {discount.usageLimit - (discount.usageLimitPerDevice || 0)} / {discount.usageLimit}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  {discount.appliesToProducts && <Package size={14} className="mr-1" />}
                  {discount.appliesToShipping && <Layers size={14} className="mr-1" />}
                  {discount.appliesToProducts && 'Products'}
                  {discount.appliesToProducts && discount.appliesToShipping && ' + '}
                  {discount.appliesToShipping && 'Shipping'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  discount.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {discount.isActive ? <Check size={12} className="mr-1" /> : <X size={12} className="mr-1" />}
                  {discount.isActive ? 'Active' : 'Inactive'}
                </span>
                {isExpired(discount.validUntil) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                    Expired
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
            No discount codes found
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {modalMode === 'create' ? 'Add New Discount Code' : 'Edit Discount Code'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Code *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required
                  placeholder="SUMMER20"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Arabic)
                  </label>
                  <input
                    type="text"
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (English)
                  </label>
                  <input
                    type="text"
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT' })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="PERCENTAGE">Percentage</option>
                    <option value="FIXED_AMOUNT">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Discount Value *
                  </label>
                  <div className="relative">
                    {formData.discountType === 'PERCENTAGE' ? (
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    ) : (
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    )}
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.discountValue}
                      onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                      required
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Min Order Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.minOrderAmount}
                      onChange={(e) => setFormData({ ...formData, minOrderAmount: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Discount Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => setFormData({ ...formData, maxDiscountAmount: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Usage Limit Per Device
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimitPerDevice}
                    onChange={(e) => setFormData({ ...formData, usageLimitPerDevice: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valid From *
                  </label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valid Until *
                  </label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Applies To
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.appliesToProducts}
                      onChange={(e) => setFormData({ ...formData, appliesToProducts: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Products</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.appliesToShipping}
                      onChange={(e) => setFormData({ ...formData, appliesToShipping: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Shipping</span>
                  </label>
                </div>
              </div>

              {formData.appliesToProducts && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Products (Optional)
                  </label>
                  <select
                    multiple
                    value={formData.productIds.map(String)}
                    onChange={(e) => {
                      const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                      setFormData({ ...formData, productIds: selected });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white h-32"
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.nameEn} - ${product.basePrice}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Hold Ctrl/Cmd to select multiple products. Leave empty to apply to all products.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Categories (Optional)
                </label>
                <select
                  multiple
                  value={formData.categoryIds.map(String)}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                    setFormData({ ...formData, categoryIds: selected });
                  }}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white h-32"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nameEn}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Hold Ctrl/Cmd to select multiple categories. Leave empty to apply to all categories.
                </p>
              </div>
{/* 
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
              </div> */}

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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600 dark:text-red-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Delete Discount Code
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete <strong>{selectedDiscount?.code}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
