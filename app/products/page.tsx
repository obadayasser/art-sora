'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  Search,
  ChevronDown,
  X,
  Grid3X3,
  List,
  Star,
  TrendingUp,
  Clock,
  ArrowUpDown,
  Filter,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product, Category } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { getPublicCategories, getPublicProducts } from '@/lib/client/api-client-orders';
import toast from 'react-hot-toast';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { ProductsGridSkeleton } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';

function ProductsContent() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<string>('newest');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Check mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Get filters from URL
  useEffect(() => {
    const sortParam = searchParams.get('sort');
    if (sortParam) setSortBy(sortParam);
    
    const categoryParam = searchParams.get('category');
    if (categoryParam) setSelectedCategory(parseInt(categoryParam));
  }, [searchParams]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getPublicCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const result = await getPublicProducts(page, 20, true, selectedCategory || undefined);
        let filteredProducts = result.data;

        // Apply search filter
        if (searchQuery) {
          filteredProducts = filteredProducts.filter(product =>
            product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        // Apply price filter
        filteredProducts = filteredProducts.filter(product => {
          const price = parseFloat(product.salePrice || product.basePrice);
          return price >= priceRange[0] && price <= priceRange[1];
        });

        // Apply sort
        switch (sortBy) {
          case 'price-asc':
            filteredProducts.sort((a, b) => 
              parseFloat(a.salePrice || a.basePrice) - parseFloat(b.salePrice || b.basePrice)
            );
            break;
          case 'price-desc':
            filteredProducts.sort((a, b) => 
              parseFloat(b.salePrice || b.basePrice) - parseFloat(a.salePrice || a.basePrice)
            );
            break;
          case 'newest':
            filteredProducts.sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            break;
          case 'bestsellers':
            // In real app, this would come from API
            filteredProducts.sort((a, b) => a.id - b.id);
            break;
          case 'popularity':
            // In real app, this would come from API
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        }

        setProducts(filteredProducts);
        setTotalPages(result.pagination?.totalPages || 1);
        setTotalItems(result.pagination?.total || 0);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, selectedCategory, searchQuery, priceRange, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  const selectedCategoryName = categories.find(c => c.id === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Title */}
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {t('products.title') || 'Our Products'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {totalItems} {t('products.items') || 'items found'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('products.searchPlaceholder') || 'Search products...'}
                  className="pl-10 pr-4 py-2 w-64 lg:w-80 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:text-white transition-all"
                />
              </div>

              {/* View Toggle */}
              <div className="flex border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Grid3X3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <List size={20} />
                </button>
              </div>

              {/* Filter Button (Mobile) */}
              {isMobile && (
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
                >
                  <Filter size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory || priceRange[0] > 0 || priceRange[1] < 5000) && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {selectedCategoryName && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm">
                  <span>{selectedCategoryName.nameEn}</span>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="hover:text-purple-900 dark:hover:text-purple-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {searchQuery && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                  <span>"{searchQuery}"</span>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm">
                  <span>LE {priceRange[0]} - LE {priceRange[1]}</span>
                  <button
                    onClick={() => setPriceRange([0, 5000])}
                    className="hover:text-emerald-900 dark:hover:text-emerald-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters (Desktop) */}
          {!isMobile && (
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-64 flex-shrink-0 hidden lg:block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <SlidersHorizontal className="text-purple-500" size={20} />
                  <h2 className="font-bold text-gray-900 dark:text-white">
                    {t('products.filters') || 'Filters'}
                  </h2>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {t('products.categories') || 'Categories'}
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !selectedCategory
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                      }`}
                    >
                      {t('products.allCategories') || 'All Categories'}
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                        }`}
                      >
                        {category.nameEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {t('products.priceRange') || 'Price Range'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                        Min: LE {priceRange[0]}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="w-full accent-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                        Max: LE {priceRange[1]}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {t('products.sortBy') || 'Sort By'}
                  </h3>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 appearance-none cursor-pointer focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:text-white transition-all pr-10"
                    >
                      <option value="newest">
                        {t('products.sort.newest') || 'Newest First'}
                      </option>
                      <option value="price-asc">
                        {t('products.sort.priceLowToHigh') || 'Price: Low to High'}
                      </option>
                      <option value="price-desc">
                        {t('products.sort.priceHighToLow') || 'Price: High to Low'}
                      </option>
                      <option value="popularity">
                        {t('products.sort.popularity') || 'Most Popular'}
                      </option>
                      <option value="bestsellers">
                        {t('products.sort.bestsellers') || 'Best Sellers'}
                      </option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
            </motion.aside>
          )}

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <ProductsGridSkeleton count={8} />
            ) : products.length === 0 ? (
              <EmptyState
                icon={Sparkles}
                title={t('products.noResults') || 'No Products Found'}
                description={t('products.noResultsDescription') || 'Try adjusting your filters or search terms to find what you\'re looking for'}
                action={{
                  label: t('products.clearFilters') || 'Clear All Filters',
                  onClick: () => {
                    setSearchQuery('');
                    setSelectedCategory(null);
                    setPriceRange([0, 5000]);
                  }
                }}
              />
            ) : (
              <>
                {/* Products Display */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'
                      : 'space-y-4'
                  }
                >
                  {products.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={
                        viewMode === 'grid'
                          ? ''
                          : 'bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4'
                      }
                    >
                      {viewMode === 'grid' ? (
                        // Grid View Card
                        <div className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                            <Image
                              src={product.images[0]?.imageUrl || '/placeholder.jpg'}
                              alt={product.nameEn}
                              fill
                              unoptimized
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                            />
                            
                            {/* Quick Actions */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="p-3 rounded-full bg-purple-500 hover:bg-purple-600 text-white transition-all transform hover:scale-110 shadow-lg"
                                aria-label="Add to cart"
                              >
                                <ShoppingCart size={20} />
                              </button>
                            </div>
                          </div>

                          <div className="p-4">
                            <Link
                              href={`/products/${product.slug}`}
                              className="block"
                            >
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-purple-500 transition-colors">
                                {product.nameEn}
                              </h3>
                            </Link>
                            <div className="flex items-center justify-between">
                              <div>
                                {product.salePrice ? (
                                  <>
                                    <span className="text-lg font-bold text-purple-600">
                                      LE {parseFloat(product.salePrice).toLocaleString()}
                                    </span>
                                    <span className="text-sm text-gray-400 line-through ml-2">
                                      LE {parseFloat(product.basePrice).toLocaleString()}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-bold text-emerald-600">
                                    LE {parseFloat(product.basePrice).toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <Link
                                href={`/products/${product.slug}`}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-purple-500 hover:text-white transition-all"
                                aria-label="View details"
                              >
                                <ChevronRight size={18} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // List View Card
                        <div className="flex gap-4">
                          <Link
                            href={`/products/${product.slug}`}
                            className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700"
                          >
                            <Image
                              src={product.images[0]?.imageUrl || '/placeholder.jpg'}
                              alt={product.nameEn}
                              fill
                              className="object-cover"
                              sizes="128px"
                              unoptimized
                            />
                          </Link>
                          <div className="flex-1 min-w-0">
                            <Link href={`/products/${product.slug}`}>
                              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-purple-500 transition-colors">
                                {product.nameEn}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                              {product.nameEn}
                            </p>
                            <div className="flex items-center justify-between">
                              <div>
                                {product.salePrice ? (
                                  <>
                                    <span className="text-lg font-bold text-purple-600">
                                      LE {parseFloat(product.salePrice).toLocaleString()}
                                    </span>
                                    <span className="text-sm text-gray-400 line-through ml-2">
                                      LE {parseFloat(product.basePrice).toLocaleString()}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-lg font-bold text-emerald-600">
                                    LE {parseFloat(product.basePrice).toLocaleString()}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleAddToCart(product)}
                                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all flex items-center gap-2"
                                >
                                  <ShoppingCart size={16} />
                                  <span>Add</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center items-center gap-2 mt-8"
                  >
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={20} className="rotate-180" />
                    </button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      const isActive = pageNum === page;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                            isActive
                              ? 'bg-purple-500 text-white shadow-lg'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isMobile && isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-full bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg">
                    {t('products.filters') || 'Filters'}
                  </h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X size={20} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {t('products.categories') || 'Categories'}
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        !selectedCategory
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                      }`}
                    >
                      {t('products.allCategories') || 'All Categories'}
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.id
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30'
                        }`}
                      >
                        {category.nameEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {t('products.priceRange') || 'Price Range'}
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                        Min: LE {priceRange[0]}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="w-full accent-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">
                        Max: LE {priceRange[1]}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="5000"
                        step="100"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full accent-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                    {t('products.sortBy') || 'Sort By'}
                  </h3>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 appearance-none cursor-pointer focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:text-white transition-all pr-10"
                    >
                      <option value="newest">
                        {t('products.sort.newest') || 'Newest First'}
                      </option>
                      <option value="price-asc">
                        {t('products.sort.priceLowToHigh') || 'Price: Low to High'}
                      </option>
                      <option value="price-desc">
                        {t('products.sort.priceHighToLow') || 'Price: High to Low'}
                      </option>
                      <option value="popularity">
                        {t('products.sort.popularity') || 'Most Popular'}
                      </option>
                      <option value="bestsellers">
                        {t('products.sort.bestsellers') || 'Best Sellers'}
                      </option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
