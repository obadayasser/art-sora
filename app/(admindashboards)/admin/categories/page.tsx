'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/lib/client/api-admin';
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Package,
  Loader2,
  GripVertical,
  Check,
  X,
  Languages
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Category } from '@/types';

export default function CategoriesManagementPage() {
  const { token } = useAdminAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    slug: '',
    descriptionAr: '',
    descriptionEn: '',
    sortOrder: 0,
/*     isActive: true, */
    metaTitle: '',
    metaDescription: ''
  });

  useEffect(() => {
    if (token) {
      loadCategories();
    }
  }, [token]);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getCategories(token!);
      setCategories(data.sort((a, b) => a.sortOrder - b.sortOrder));
    } catch (error) {
      toast.error('Failed to load categories');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = categories.filter(category =>
    category.nameAr.includes(searchTerm) ||
    category.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = () => {
    setModalMode('create');
    setFormData({
      nameAr: '',
      nameEn: '',
      slug: '',
      descriptionAr: '',
      descriptionEn: '',
      sortOrder: categories.length,
    /*   isActive: true, */
      metaTitle: '',
      metaDescription: ''
    });
    setShowModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setFormData({
      nameAr: category.nameAr,
      nameEn: category.nameEn,
      slug: category.slug,
      descriptionAr: category.descriptionAr || '',
      descriptionEn: category.descriptionEn || '',
      sortOrder: category.sortOrder,
  /*    isActive: category.isActive, */
      metaTitle: '',
      metaDescription: ''
    });
    setShowModal(true);
    setActionMenuOpen(null);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
    setActionMenuOpen(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      if (modalMode === 'create') {
        await createCategory(token!, formData);
        toast.success('Category created successfully');
      } else if (modalMode === 'edit' && selectedCategory) {
        await updateCategory(token!, selectedCategory.id, formData);
        toast.success('Category updated successfully');
      }

      setShowModal(false);
      loadCategories();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;

    try {
      setIsLoading(true);
      await deleteCategory(token!, selectedCategory.id);
      toast.success('Category deleted successfully');
      setShowDeleteModal(false);
      loadCategories();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (nameEn: string) => {
    return nameEn
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameEnChange = (value: string) => {
    const slug = generateSlug(value);
    setFormData(prev => ({ ...prev, nameEn: value, slug }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage product categories
          </p>
        </div>
        <button
          onClick={handleCreateCategory}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/30"
        >
          <Plus size={20} className="mr-2" />
          Add Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          ))
        ) : filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Package className="text-white" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {category.nameAr}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {category.nameEn}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setActionMenuOpen(actionMenuOpen === category.id ? null : category.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <MoreVertical size={18} className="text-gray-500 dark:text-gray-400" />
                  </button>
                  {actionMenuOpen === category.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-10">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                      >
                        <Edit2 size={16} className="mr-2" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category)}
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
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Languages size={14} className="mr-2" />
                  Slug: {category.slug}
                </div>
                {category.descriptionAr && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {category.descriptionAr}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  category.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {category.isActive ? <Check size={12} className="mr-1" /> : <X size={12} className="mr-1" />}
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Sort: {category.sortOrder}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
            No categories found
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {modalMode === 'create' ? 'Add New Category' : 'Edit Category'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name (Arabic) *
                  </label>
                  <input
                    type="text"
                    value={formData.nameAr}
                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name (English) *
                  </label>
                  <input
                    type="text"
                    value={formData.nameEn}
                    onChange={(e) => handleNameEnChange(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (Arabic)
                  </label>
                  <textarea
                    value={formData.descriptionAr}
                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description (English)
                  </label>
                  <textarea
                    value={formData.descriptionEn}
                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })}
                    min={0}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
             {/*    <div className="flex items-center pt-6">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Meta Description
                  </label>
                  <input
                    type="text"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-red-600 dark:text-red-400" size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Delete Category
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete <strong>{selectedCategory?.nameAr}</strong>? This action cannot be undone.
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
