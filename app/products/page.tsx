'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  Search,
  ChevronDown,
  X,
  Grid3X3,
  List,
  Filter,
  ChevronRight,
  Sparkles,
  ShoppingCart,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useCart } from '@/contexts/CartContext';
import { Product, Category } from '@/types';
import { getPublicCategories, getPublicProducts } from '@/lib/client/api-client-orders';
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS } from '@/lib/fallback-data';
import { ProductCard } from '@/components/ui/ProductCard';

const PRICE_MAX = 5000;

type SortOption = 'newest' | 'price-asc' | 'price-desc';

/** Filter controls shared between the desktop sidebar and the mobile drawer. */
function FilterPanel({
  categories,
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceRange,
  sortBy,
  onSortBy,
}: {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (id: number | null) => void;
  priceRange: [number, number];
  onPriceRange: (range: [number, number]) => void;
  sortBy: SortOption;
  onSortBy: (sort: SortOption) => void;
}) {
  const t = useTranslations();
  const locale = useLocale();

  const categoryButton = (isActive: boolean) =>
    `w-full text-start px-3 py-2 rounded-lg transition-colors ${
      isActive
        ? 'bg-accent text-accent-contrast'
        : 'bg-section text-ink-soft hover:bg-accent-soft hover:text-accent'
    }`;

  return (
    <>
      {/* Categories */}
      <div className="mb-6">
        <h3 className="font-semibold text-ink mb-3">{t('products.categories')}</h3>
        <div className="space-y-2">
          <button onClick={() => onSelectCategory(null)} className={categoryButton(!selectedCategory)}>
            {t('products.allCategories')}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={categoryButton(selectedCategory === category.id)}
            >
              {locale === 'ar' ? category.nameAr : category.nameEn}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="mb-6">
        <h3 className="font-semibold text-ink mb-3">{t('products.priceRange')}</h3>
        <div className="space-y-4">
          {(['min', 'max'] as const).map((bound, i) => (
            <div key={bound}>
              <label htmlFor={`price-${bound}`} className="text-sm text-ink-soft mb-1 block">
                {t(`products.${bound}`)}: {t('product.currency')} {priceRange[i]}
              </label>
              <input
                id={`price-${bound}`}
                type="range"
                min="0"
                max={PRICE_MAX}
                step="100"
                value={priceRange[i]}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  onPriceRange(i === 0 ? [value, priceRange[1]] : [priceRange[0], value]);
                }}
                className="w-full accent-[var(--accent)]"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="font-semibold text-ink mb-3">{t('products.sortBy')}</h3>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => onSortBy(e.target.value as SortOption)}
            aria-label={t('products.sortBy')}
            className="w-full px-4 py-2.5 rounded-lg border border-line bg-section text-ink appearance-none cursor-pointer focus:border-accent focus:ring-2 focus:ring-accent-border transition-all pe-10"
          >
            <option value="newest">{t('products.sort.newest')}</option>
            <option value="price-asc">{t('products.sort.priceLowToHigh')}</option>
            <option value="price-desc">{t('products.sort.priceHighToLow')}</option>
          </select>
          <ChevronDown
            className="absolute end-3 top-1/2 -translate-y-1/2 text-ink-faint pointer-events-none"
            size={16}
          />
        </div>
      </div>
    </>
  );
}

function ProductsContent() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, PRICE_MAX]);
  const [debouncedPrice, setDebouncedPrice] = useState<[number, number]>([0, PRICE_MAX]);
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const productName = (p: Product) => (locale === 'ar' ? p.nameAr : p.nameEn);

  // Debounce free-typing filters so we don't refetch per keystroke.
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setDebouncedPrice(priceRange);
    }, 350);
    return () => clearTimeout(handle);
  }, [searchQuery, priceRange]);

  // Read initial filters from the URL.
  useEffect(() => {
    const sortParam = searchParams.get('sort');
    if (sortParam === 'newest' || sortParam === 'price-asc' || sortParam === 'price-desc') {
      setSortBy(sortParam);
    }
  }, [searchParams]);

  // Resolve the category URL param (slug or numeric id) once categories load.
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (!categoryParam || categories.length === 0) return;
    const match = categories.find(
      (c) => c.slug === categoryParam || c.id === parseInt(categoryParam),
    );
    if (match) setSelectedCategory(match.id);
  }, [searchParams, categories]);

  // Categories (with demo fallback).
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getPublicCategories();
        setCategories(data.length > 0 ? data : FALLBACK_CATEGORIES);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(FALLBACK_CATEGORIES);
      }
    };
    fetchCategories();
  }, []);

  // Products (with demo fallback).
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        let list: Product[] = [];
        let pagination: { totalPages?: number; total?: number } | undefined;

        // Fallback categories (negative ids) never exist in the API.
        if (selectedCategory !== null && selectedCategory < 0) {
          list = FALLBACK_PRODUCTS.filter((p) => p.categoryId === selectedCategory);
          setUsingFallback(true);
        } else {
          const result = await getPublicProducts(page, 20, true, selectedCategory || undefined);
          list = result.data ?? [];
          pagination = result.pagination;
          if (list.length === 0 && !selectedCategory && !debouncedQuery) {
            list = FALLBACK_PRODUCTS;
            setUsingFallback(true);
          } else {
            setUsingFallback(false);
          }
        }

        // Client-side refinement of the current page.
        let filtered = list;
        if (debouncedQuery) {
          const q = debouncedQuery.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.nameEn.toLowerCase().includes(q) ||
              p.nameAr.includes(debouncedQuery) ||
              p.sku.toLowerCase().includes(q),
          );
        }
        filtered = filtered.filter((p) => {
          const price = parseFloat(p.salePrice || p.basePrice);
          return price >= debouncedPrice[0] && price <= debouncedPrice[1];
        });

        switch (sortBy) {
          case 'price-asc':
            filtered = [...filtered].sort(
              (a, b) => parseFloat(a.salePrice || a.basePrice) - parseFloat(b.salePrice || b.basePrice),
            );
            break;
          case 'price-desc':
            filtered = [...filtered].sort(
              (a, b) => parseFloat(b.salePrice || b.basePrice) - parseFloat(a.salePrice || a.basePrice),
            );
            break;
          case 'newest':
            filtered = [...filtered].sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            );
            break;
        }

        setProducts(filtered);
        setTotalPages(pagination?.totalPages || 1);
        setTotalItems(pagination?.total || filtered.length);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(FALLBACK_PRODUCTS);
        setUsingFallback(true);
        setTotalPages(1);
        setTotalItems(FALLBACK_PRODUCTS.length);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, selectedCategory, debouncedQuery, debouncedPrice, sortBy]);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const selectedCategoryObj = categories.find((c) => c.id === selectedCategory);
  const hasActiveFilters =
    !!searchQuery || !!selectedCategory || priceRange[0] > 0 || priceRange[1] < PRICE_MAX;

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setPriceRange([0, PRICE_MAX]);
  };

  const filterPanelProps = {
    categories,
    selectedCategory,
    onSelectCategory: setSelectedCategory,
    priceRange,
    onPriceRange: setPriceRange,
    sortBy,
    onSortBy: setSortBy,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page header */}
      <div className="bg-card shadow-sm border-b border-line sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-ink mb-1">
                {t('products.title')}
              </h1>
              <p className="text-ink-soft">
                {totalItems} {t('products.items')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute start-3 top-1/2 -translate-y-1/2 text-ink-faint w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('products.searchPlaceholder')}
                  aria-label={t('products.searchPlaceholder')}
                  className="ps-10 pe-4 py-2 w-52 sm:w-64 lg:w-80 rounded-lg border border-line bg-section text-ink focus:border-accent focus:ring-2 focus:ring-accent-border transition-all"
                />
              </div>

              {/* View toggle */}
              <div className="hidden sm:flex border border-line rounded-lg overflow-hidden">
                {(
                  [
                    { mode: 'grid', icon: Grid3X3, label: t('products.gridView') },
                    { mode: 'list', icon: List, label: t('products.listView') },
                  ] as const
                ).map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    aria-label={label}
                    aria-pressed={viewMode === mode}
                    className={`p-2 transition-colors ${
                      viewMode === mode
                        ? 'bg-accent text-accent-contrast'
                        : 'bg-card text-ink-soft hover:bg-section'
                    }`}
                  >
                    <Icon size={20} />
                  </button>
                ))}
              </div>

              {/* Filter drawer trigger (mobile) */}
              <button
                onClick={() => setIsFilterOpen(true)}
                aria-label={t('products.filters')}
                className="p-2 rounded-lg border border-line bg-card hover:bg-section transition-colors lg:hidden"
              >
                <Filter size={20} className="text-ink-soft" />
              </button>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {selectedCategoryObj && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-accent-soft text-accent rounded-full text-sm">
                  <span>
                    {locale === 'ar' ? selectedCategoryObj.nameAr : selectedCategoryObj.nameEn}
                  </span>
                  <button onClick={() => setSelectedCategory(null)} aria-label={t('products.clearFilters')}>
                    <X size={14} />
                  </button>
                </div>
              )}
              {searchQuery && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-accent-soft text-accent rounded-full text-sm">
                  <span>&ldquo;{searchQuery}&rdquo;</span>
                  <button onClick={() => setSearchQuery('')} aria-label={t('products.clearFilters')}>
                    <X size={14} />
                  </button>
                </div>
              )}
              {(priceRange[0] > 0 || priceRange[1] < PRICE_MAX) && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-accent-soft text-accent rounded-full text-sm">
                  <span>
                    {t('product.currency')} {priceRange[0]} – {t('product.currency')} {priceRange[1]}
                  </span>
                  <button onClick={() => setPriceRange([0, PRICE_MAX])} aria-label={t('products.clearFilters')}>
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
          {/* Desktop sidebar */}
          <aside className="w-64 flex-shrink-0 hidden lg:block">
            <div className="bg-card border border-line rounded-2xl shadow-sm p-6 sticky top-40">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="text-accent" size={20} />
                <h2 className="font-bold text-ink">{t('products.filters')}</h2>
              </div>
              <FilterPanel {...filterPanelProps} />
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 8 }, (_, i) => (
                  <div key={i} className="skeleton rounded-2xl h-80" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Sparkles size={96} className="text-ink-faint mb-6" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-ink mb-2">{t('products.noResults')}</h2>
                <p className="text-ink-soft mb-6 text-center max-w-md">
                  {t('products.noResultsDescription')}
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-accent text-accent-contrast rounded-xl font-semibold hover:bg-accent-hover transition-colors"
                >
                  {t('products.clearFilters')}
                </button>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                        onAddToCart={handleAddToCart}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex gap-4 bg-card border border-line rounded-2xl shadow-sm p-4"
                      >
                        <Link
                          href={`/products/${product.slug}`}
                          className="relative w-32 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-section"
                        >
                          <Image
                            src={product.images[0]?.imageUrl || '/placeholder.jpg'}
                            alt={productName(product)}
                            fill
                            className="object-cover"
                            sizes="128px"
                            unoptimized
                          />
                        </Link>
                        <div className="flex-1 min-w-0 flex flex-col">
                          <Link href={`/products/${product.slug}`}>
                            <h3 className="font-semibold text-ink mb-1 line-clamp-2 hover:text-accent transition-colors">
                              {productName(product)}
                            </h3>
                          </Link>
                          {(product.descriptionEn || product.descriptionAr) && (
                            <p className="text-sm text-ink-soft mb-3 line-clamp-2">
                              {locale === 'ar' ? product.descriptionAr : product.descriptionEn}
                            </p>
                          )}
                          <div className="mt-auto flex items-center justify-between">
                            <div>
                              {product.salePrice ? (
                                <>
                                  <span className="text-lg font-bold text-accent">
                                    {t('product.currency')} {parseFloat(product.salePrice).toLocaleString()}
                                  </span>
                                  <span className="text-sm text-ink-faint line-through ms-2">
                                    {t('product.currency')} {parseFloat(product.basePrice).toLocaleString()}
                                  </span>
                                </>
                              ) : (
                                <span className="text-lg font-bold text-accent">
                                  {t('product.currency')} {parseFloat(product.basePrice).toLocaleString()}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="px-4 py-2 bg-accent hover:bg-accent-hover text-accent-contrast rounded-lg transition-colors flex items-center gap-2"
                            >
                              <ShoppingCart size={16} />
                              <span>{t('product.addToCart')}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination (API data only — fallback is a single page) */}
                {!usingFallback && totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      aria-label={t('products.previousPage')}
                      className="p-2 rounded-lg border border-line bg-card hover:bg-accent-soft disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={20} className="rotate-180 rtl:rotate-0" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          aria-current={pageNum === page ? 'page' : undefined}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                            pageNum === page
                              ? 'bg-accent text-accent-contrast shadow'
                              : 'bg-card text-ink-soft hover:bg-accent-soft'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      aria-label={t('products.nextPage')}
                      className="p-2 rounded-lg border border-line bg-card hover:bg-accent-soft disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight size={20} className="rtl:rotate-180" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-stage/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 end-0 h-full w-80 max-w-full bg-card shadow-2xl z-50 overflow-y-auto lg:hidden"
              role="dialog"
              aria-label={t('products.filters')}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-bold text-ink text-lg">{t('products.filters')}</h2>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    aria-label={t('products.close')}
                    className="p-2 rounded-lg hover:bg-section transition-colors"
                  >
                    <X size={20} className="text-ink-soft" />
                  </button>
                </div>
                <FilterPanel {...filterPanelProps} />
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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--accent)]" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
