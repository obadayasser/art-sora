'use client';

import React, { useEffect, useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  uploadProductImage,
  deleteProductImage,
  getProductVariants,
  createProductVariant,
  updateProductVariant,
  deleteProductVariant,
  getProductSizes
} from '@/lib/client/api-admin';
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Package,
  Loader2,
  Image as ImageIcon,
  Check,
  X,
  DollarSign,
  Archive,
  Star,
  Upload,
  Eye,
  Languages
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { Product, Category, ProductImage } from '@/types';

export default function ProductsManagementPage() {
  const { token } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionMenuOpen, setActionMenuOpen] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const [formData, setFormData] = useState({
    sku: '',
    nameAr: '',
    nameEn: '',
    slug: '',
    descriptionAr: '',
    descriptionEn: '',
    productTypeId: 1,
    categoryId: 0,
    basePrice: '',
    salePrice: '',
    allowsCustomization: false,
    customizationPrice: '',
    stockQuantity: 0,
    isUnlimitedStock: false,
/*     isActive: true,
    isFeatured: false, */
    metaTitle: '',
    metaDescription: ''
  });

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [variantMode, setVariantMode] = useState<'create' | 'edit'>('create');
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [sizes, setSizes] = useState<any[]>([]);
  const [productVariants, setProductVariants] = useState<any[]>([]);
  const [showProductVariantsSection, setShowProductVariantsSection] = useState(false);

  useEffect(() => {
    if (token) {
      loadProducts();
      loadCategories();
      loadSizes();
    }
  }, [token, currentPage]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await getProducts(token!, currentPage, 20);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Failed to load products');
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

  const loadSizes = async () => {
    try {
      const data = await getProductSizes(token!);
      setSizes(data);
    } catch (error) {
      console.error('Failed to load sizes:', error);
    }
  };

  const loadVariants = async (productId: number) => {
    try {
      const data = await getProductVariants(token!, productId);
      setVariants(data);
    } catch (error) {
      console.error('Failed to load variants:', error);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.nameAr.includes(searchTerm) ||
    product.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateProduct = () => {
    setModalMode('create');
    setFormData({
      sku: '',
      nameAr: '',
      nameEn: '',
      slug: '',
      descriptionAr: '',
      descriptionEn: '',
      productTypeId: 1,
      categoryId: categories.length > 0 ? categories[0].id : 0,
      basePrice: '',
      salePrice: '',
      allowsCustomization: false,
      customizationPrice: '',
      stockQuantity: 0,
      isUnlimitedStock: false,
      /* isActive: true,
      isFeatured: false, */
      metaTitle: '',
      metaDescription: ''
    });
    setSelectedImages([]);
    setProductVariants([]);
    setShowProductVariantsSection(false);
    setShowModal(true);
  };

  const handleEditProduct = async (product: Product) => {
    setModalMode('edit');
    setSelectedProduct(product);
    setFormData({
      sku: product.sku,
      nameAr: product.nameAr,
      nameEn: product.nameEn,
      slug: product.slug,
      descriptionAr: product.descriptionAr || '',
      descriptionEn: product.descriptionEn || '',
      productTypeId: 1,
      categoryId: product.categoryId,
      basePrice: product.basePrice,
      salePrice: product.salePrice || '',
      allowsCustomization: false,
      customizationPrice: '',
      stockQuantity: product.stockQuantity,
      isUnlimitedStock: false,
/*       isActive: product.isActive,
      isFeatured: false, */
      metaTitle: '',
      metaDescription: ''
    });
    setSelectedImages([]);
    // Load variants for editing
    try {
      const variantsData = await getProductVariants(token!, product.id);
      setProductVariants(variantsData);
      setShowProductVariantsSection(variantsData.length > 0);
    } catch (error) {
      console.error('Failed to load variants:', error);
      setProductVariants([]);
    }
    setShowModal(true);
    setActionMenuOpen(null);
  };

  const handleViewProduct = (product: Product) => {
    setModalMode('view');
    setSelectedProduct(product);
    loadVariants(product.id);
    setShowModal(true);
    setActionMenuOpen(null);
  };

  const handleCreateVariant = () => {
    setVariantMode('create');
    setSelectedVariant(null);
    setShowVariantModal(true);
  };

  const handleEditVariant = (variant: any) => {
    setVariantMode('edit');
    setSelectedVariant(variant);
    setShowVariantModal(true);
  };

  const handleDeleteVariant = async (variantId: number) => {
    if (!selectedProduct || !confirm('Are you sure you want to delete this variant?')) return;

    try {
      await deleteProductVariant(token!, selectedProduct.id, variantId);
      toast.success('Variant deleted successfully');
      loadVariants(selectedProduct.id);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete variant');
    }
  };

  const handleDeleteProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
    setActionMenuOpen(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      let createdProduct: Product;
      if (modalMode === 'create') {
        // For create: remove isActive and isFeatured
        const { isActive, isFeatured, ...createData } = formData as any;
        createdProduct = await createProduct(token!, createData);
        toast.success('Product created successfully');

        // Create variants if any
        if (productVariants.length > 0) {
          let variantsCreated = 0;
          for (const variant of productVariants) {
            try {
              await createProductVariant(token!, createdProduct.id, variant);
              variantsCreated++;
            } catch (error: any) {
              console.error('Failed to create variant:', error);
              toast.error(`Failed to create variant: ${error.message}`);
            }
          }
          if (variantsCreated > 0) {
            toast.success(`${variantsCreated} variant(s) created successfully`);
          }
        }
      } else if (modalMode === 'edit' && selectedProduct) {
        // For update: remove sku, productTypeId, allowsCustomization, customizationPrice, isUnlimitedStock, metaTitle, metaDescription
        const { sku, productTypeId, allowsCustomization, customizationPrice, isUnlimitedStock, metaTitle, metaDescription, ...updateData } = formData;
        await updateProduct(token!, selectedProduct.id, updateData);
        toast.success('Product updated successfully');
        createdProduct = selectedProduct;

        // Note: Variants are managed separately in view mode
      } else {
        return;
      }

      // Upload images if any
      if (selectedImages.length > 0 && createdProduct) {
        setUploadingImages(true);
        let uploadedCount = 0;
        let failedCount = 0;

        for (let i = 0; i < selectedImages.length; i++) {
          try {
            await uploadProductImage(token!, createdProduct.id, selectedImages[i], i === 0);
            uploadedCount++;
          } catch (error: any) {
            console.error('Failed to upload image:', error);
            failedCount++;
            toast.error(`Failed to upload image ${i + 1}: ${error.message}`);
          }
        }

        if (uploadedCount > 0) {
          toast.success(`${uploadedCount} image(s) uploaded successfully`);
        }
        if (failedCount > 0) {
          toast.error(`${failedCount} image(s) failed to upload`);
        }
      }

      setShowModal(false);
      loadProducts();
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsLoading(false);
      setUploadingImages(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;

    try {
      setIsLoading(true);
      await deleteProduct(token!, selectedProduct.id);
      toast.success('Product deleted successfully');
      setShowDeleteModal(false);
      loadProducts();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteProductImage = async (imageId: number) => {
    if (!selectedProduct) return;

    try {
      await deleteProductImage(token!, selectedProduct.id, imageId);
      toast.success('Image deleted successfully');
      loadProducts();
      // Refresh selected product
      const updatedProduct = await getProducts(token!, 1, 100);
      const updated = updatedProduct.data.find(p => p.id === selectedProduct.id);
      if (updated) setSelectedProduct(updated);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete image');
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

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    PROCESSING: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    SHIPPED: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    REFUNDED: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your product catalog
          </p>
        </div>
        <button
          onClick={handleCreateProduct}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/30"
        >
          <Plus size={20} className="mr-2" />
          Add Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm animate-pulse">
              <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
              <div className="p-4">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                {product.images.length > 0 ? (
                  <img
                    src={product.images.find(img => img.isPrimary)?.imageUrl || product.images[0].imageUrl}
                    alt={product.nameEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="text-gray-400" size={48} />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  {product.isFeatured && (
                    <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-medium rounded-full flex items-center">
                      <Star size={12} className="mr-1" />
                      Featured
                    </span>
                  )}
                  <button
                    onClick={() => handleViewProduct(product)}
                    className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Eye size={16} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                      {product.nameAr}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {product.nameEn}
                    </p>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setActionMenuOpen(actionMenuOpen === product.id ? null : product.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
                    >
                      <MoreVertical size={18} className="text-gray-500 dark:text-gray-400" />
                    </button>
                    {actionMenuOpen === product.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 py-1 z-10">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                        >
                          <Edit2 size={16} className="mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                        >
                          <Trash2 size={16} className="mr-2" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1 mb-3">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Package size={12} className="mr-1" />
                    SKU: {product.sku}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <Archive size={12} className="mr-1" />
                    Stock: {product.stockQuantity}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    {product.salePrice ? (
                      <>
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          ${product.salePrice}
                        </p>
                        <p className="text-sm text-gray-400 line-through">
                          ${product.basePrice}
                        </p>
                      </>
                    ) : (
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        ${product.basePrice}
                      </p>
                    )}
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    product.isActive
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {product.isActive ? <Check size={12} className="mr-1" /> : <X size={12} className="mr-1" />}
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500 dark:text-gray-400">
            No products found
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
            disabled={currentPage === pagination.totalPages}
            className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}

      {/* Create/Edit/View Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {modalMode === 'create' ? 'Add New Product' : modalMode === 'edit' ? 'Edit Product' : 'Product Details'}
              </h2>
            </div>

            {/* View Mode */}
            {modalMode === 'view' && selectedProduct && (
              <div className="p-6 space-y-6">
                {/* Images Gallery */}
                {selectedProduct.images.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Product Images</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedProduct.images.map((image) => (
                        <div key={image.id} className="relative group">
                          <img
                            src={image.imageUrl}
                            alt="Product image"
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handleDeleteProductImage(image.id)}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 size={16} />
                          </button>
                          {image.isPrimary && (
                            <span className="absolute bottom-2 left-2 px-2 py-1 bg-blue-500 text-white text-xs rounded">
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name (Arabic)
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedProduct.nameAr}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Name (English)
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedProduct.nameEn}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      SKU
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedProduct.sku}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Slug
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedProduct.slug}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Base Price
                    </label>
                    <p className="text-gray-900 dark:text-white">${selectedProduct.basePrice}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Sale Price
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedProduct.salePrice || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stock Quantity
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedProduct.stockQuantity}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      selectedProduct.isActive
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {selectedProduct.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (Arabic)
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedProduct.descriptionAr || 'N/A'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description (English)
                  </label>
                  <p className="text-gray-900 dark:text-white">{selectedProduct.descriptionEn || 'N/A'}</p>
                </div>

                {/* Product Variants Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Variants</h3>
                    <button
                      onClick={() => {
                        handleCreateVariant();
                      }}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Variant
                    </button>
                  </div>

                  {variants.length > 0 ? (
                    <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Size
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              SKU
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Price
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Stock
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Color
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Status
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {variants.map((variant) => (
                            <tr key={variant.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                {variant.sizeName} ({variant.sizeDimensions})
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                {variant.sku}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {variant.salePrice ? (
                                  <>
                                    <span className="text-green-600 dark:text-green-400 font-medium">
                                      ${variant.salePrice}
                                    </span>
                                    <span className="text-gray-400 line-through ml-2 text-xs">
                                      ${variant.basePrice}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-gray-900 dark:text-white font-medium">
                                    ${variant.basePrice}
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                {variant.stockQuantity}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                                    style={{ backgroundColor: variant.colorHex }}
                                  />
                                  <span className="text-gray-900 dark:text-white">
                                    {variant.colorAr || variant.colorEn || '-'}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  variant.isActive
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}>
                                  {variant.isActive ? 'Active' : 'Inactive'}
                                </span>
                                {variant.isDefault && (
                                  <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                    Default
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleEditVariant(variant)}
                                    className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                    title="Edit"
                                  >
                                    <Edit2 size={14} className="text-blue-600 dark:text-blue-400" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteVariant(variant.id)}
                                    className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 size={14} className="text-red-600 dark:text-red-400" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
                      <Package className="mx-auto text-gray-400 mb-3" size={32} />
                      <p className="text-gray-500 dark:text-gray-400">
                        No variants added yet
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                        Click "Add Variant" to create product variants with different sizes and colors
                      </p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {/* Create/Edit Mode */}
            {(
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Product Images
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                    <input
                      type="file"
                      id="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                    <label
                      htmlFor="images"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <Upload className="text-gray-400 mb-2" size={32} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Click to upload images
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </span>
                    </label>
                  </div>
                  {selectedImages.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-2">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      SKU *
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value) })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.nameAr} - {cat.nameEn}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

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
                      Base Price *
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.basePrice}
                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sale Price
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.salePrice}
                        onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Stock Quantity *
                    </label>
                    <div className="relative">
                      <Archive className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="number"
                        min="0"
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="flex items-center pt-6">
                    <input
                      type="checkbox"
                      id="isUnlimitedStock"
                      checked={formData.isUnlimitedStock}
                      onChange={(e) => setFormData({ ...formData, isUnlimitedStock: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isUnlimitedStock" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Unlimited Stock
                    </label>
                  </div>
                </div>

           {/*      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="isFeatured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Featured
                    </label>
                  </div>
                </div> */}

                {/* Product Variants Section (for Create/Edit Mode) */}
                {modalMode !== 'view' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Variants</h3>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowProductVariantsSection(!showProductVariantsSection)}
                          className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                          {showProductVariantsSection ? 'Hide' : 'Show'} Variants
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setVariantMode('create');
                            setSelectedVariant({
                              sizeId: sizes[0]?.id || 0,
                              nameAr: '',
                              nameEn: '',
                              sku: '',
                              basePrice: formData.basePrice || '',
                              salePrice: formData.salePrice || '',
                              stockQuantity: 10,
                              colorAr: '',
                              colorEn: '',
                              colorHex: '#000000',
                              imageUrl: '',
                              isDefault: productVariants.length === 0,
                              sortOrder: productVariants.length
                            });
                            setShowVariantModal(true);
                          }}
                          className="inline-flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          <Plus size={16} className="mr-2" />
                          Add Variant
                        </button>
                      </div>
                    </div>

                    {showProductVariantsSection && (
                      <>
                        {productVariants.length > 0 ? (
                          <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
                            <table className="w-full">
                              <thead className="bg-gray-50 dark:bg-gray-700">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                    Size
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                    SKU
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                    Price
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                    Stock
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                    Color
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                    Default
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {productVariants.map((variant, index) => (
                                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                      {sizes.find(s => s.id === variant.sizeId)?.name || 'N/A'}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                                      {variant.sku}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      {variant.salePrice ? (
                                        <>
                                          <span className="text-green-600 dark:text-green-400 font-medium">
                                            ${variant.salePrice}
                                          </span>
                                          <span className="text-gray-400 line-through ml-2 text-xs">
                                            ${variant.basePrice}
                                          </span>
                                        </>
                                      ) : (
                                        <span className="text-gray-900 dark:text-white font-medium">
                                          ${variant.basePrice}
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                      {variant.stockQuantity}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      <div className="flex items-center gap-2">
                                        <div
                                          className="w-6 h-6 rounded border border-gray-300 dark:border-gray-600"
                                          style={{ backgroundColor: variant.colorHex }}
                                        />
                                        <span className="text-gray-900 dark:text-white">
                                          {variant.colorAr || variant.colorEn || '-'}
                                        </span>
                                      </div>
                                    </td>
                                    <td className="px-4 py-3">
                                      {variant.isDefault && (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                          Default
                                        </span>
                                      )}
                                    </td>
                                    <td className="px-4 py-3">
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setVariantMode('edit');
                                            setSelectedVariant({
                                              ...variant,
                                              index
                                            });
                                            setShowVariantModal(true);
                                          }}
                                          className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                          title="Edit"
                                        >
                                          <Edit2 size={14} className="text-blue-600 dark:text-blue-400" />
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setProductVariants(prev => prev.filter((_, i) => i !== index));
                                          }}
                                          className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                                          title="Delete"
                                        >
                                          <Trash2 size={14} className="text-red-600 dark:text-red-400" />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg mb-4">
                            <Package className="mx-auto text-gray-400 mb-3" size={32} />
                            <p className="text-gray-500 dark:text-gray-400">
                              No variants added yet
                            </p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                              Click "Add Variant" to create product variants with different sizes and colors
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

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
                    disabled={isLoading || uploadingImages}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading || uploadingImages ? <Loader2 className="animate-spin mx-auto" size={20} /> : modalMode === 'create' ? 'Create' : 'Save'}
                  </button>
                </div>
              </form>
            )}
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
                Delete Product
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete <strong>{selectedProduct?.nameAr}</strong>? This action cannot be undone.
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

      {/* Variant Management Modal */}
      {showVariantModal && (
        <VariantModal
          token={token!}
          productId={selectedProduct?.id || 0}
          sizes={sizes}
          mode={variantMode}
          variant={selectedVariant}
          onClose={() => setShowVariantModal(false)}
          onSave={(variantData: any) => {
            if (modalMode === 'view' && selectedProduct) {
              // In view mode, save to API
              loadVariants(selectedProduct.id);
            } else {
              // In create/edit mode, save to temporary state
              if (variantMode === 'create') {
                setProductVariants(prev => [...prev, variantData]);
              } else if (variantMode === 'edit' && selectedVariant?.index !== undefined) {
                setProductVariants(prev => 
                  prev.map((v, i) => i === selectedVariant.index ? variantData : v)
                );
              }
            }
            setShowVariantModal(false);
          }}
          modalMode={modalMode}
        />
      )}
    </div>
  );
}

function VariantModal({ token, productId, sizes, mode, variant, onClose, onSave, modalMode: parentModalMode }: any) {
  const [formData, setFormData] = useState({
    sizeId: variant?.sizeId || sizes[0]?.id || 0,
    nameAr: variant?.nameAr || '',
    nameEn: variant?.nameEn || '',
    sku: variant?.sku || '',
    basePrice: variant?.basePrice || '',
    salePrice: variant?.salePrice || '',
    stockQuantity: variant?.stockQuantity || 0,
    colorAr: variant?.colorAr || '',
    colorEn: variant?.colorEn || '',
    colorHex: variant?.colorHex || '#000000',
    imageUrl: variant?.imageUrl || '',
    isDefault: variant?.isDefault || false,
    sortOrder: variant?.sortOrder || 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      
      if (parentModalMode === 'view') {
        // In view mode, save to API
        if (mode === 'create') {
          await createProductVariant(token, productId, formData);
          toast.success('Variant created successfully');
        } else if (variant) {
          await updateProductVariant(token, productId, variant.id, formData);
          toast.success('Variant updated successfully');
        }
      } else {
        // In create/edit mode, just save the data
        onSave(formData);
        toast.success(mode === 'create' ? 'Variant added to product' : 'Variant updated');
        return; // Return early to avoid calling onSave again
      }
    } catch (error: any) {
      toast.error(error.message || 'Operation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {mode === 'create' ? 'Add New Variant' : 'Edit Variant'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Size *
              </label>
              <select
                value={formData.sizeId}
                onChange={(e) => setFormData({ ...formData, sizeId: parseInt(e.target.value) })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              >
                {sizes.map((size: any) => (
                  <option key={size.id} value={size.id}>
                    {size.name} ({size.width}×{size.height} {size.unit})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                SKU *
              </label>
              <input
                type="text"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name (Arabic)
              </label>
              <input
                type="text"
                value={formData.nameAr}
                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name (English)
              </label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Base Price *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.basePrice}
                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sale Price
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.salePrice}
                onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Stock *
              </label>
              <input
                type="number"
                min="0"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: parseInt(e.target.value) || 0 })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color (Arabic)
              </label>
              <input
                type="text"
                value={formData.colorAr}
                onChange={(e) => setFormData({ ...formData, colorAr: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color (English)
              </label>
              <input
                type="text"
                value={formData.colorEn}
                onChange={(e) => setFormData({ ...formData, colorEn: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color Hex
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={formData.colorHex}
                  onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                  className="w-12 h-10 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.colorHex}
                  onChange={(e) => setFormData({ ...formData, colorHex: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Default
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin mx-auto" size={20} /> : mode === 'create' ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

