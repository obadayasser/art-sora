"use client";

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Grid3X3, Sparkles, ShoppingCart, ArrowRight } from 'lucide-react';
import { Category, Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { clientGetCategories, clientGetProducts } from '@/lib/client/api';

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

export function CategoriesSection() {
  const t = useTranslations();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await clientGetCategories(true);
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setSelectedCategory(fetchedCategories[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (selectedCategory) {
        setProductsLoading(true);
        try {
          const { products: fetchedProducts } = await clientGetProducts({
            page: 1,
            limit: 8,
            active: true,
            categoryId: selectedCategory.id
          });
          setProducts(fetchedProducts.slice(0, 4)); // Show only 4 products
          setProductsLoading(false);
        } catch (error) {
          console.error('Error fetching category products:', error);
          setProductsLoading(false);
        }
      }
    };

    fetchCategoryProducts();
  }, [selectedCategory]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const shimmerEffect = {
        background: "linear-gradient(90deg, var(--card-bg) 25%, var(--card-border) 50%, var(--card-bg) 75%)",
    animation: "shimmer 2s infinite"
  };

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[var(--background)] via-[var(--card-border)]/30 to-[var(--background)] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-r from-[#AAD7F3]/10 to-[#DA5280]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-r from-[#DA5280]/10 to-[#AAD7F3]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400/10 via-emerald-300/10 to-blue-500/10 rounded-full mb-4 border border-blue-100/50 backdrop-blur-sm">
            <Grid3X3 className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-emerald-400 bg-clip-text text-transparent">
              {t('home.categories.badge') || 'تصفح حسب الفئة'}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-500 bg-clip-text text-transparent mb-4">
            {t('home.categories.title') || 'استكشف الفئات المختلفة'}
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t('home.categories.description') || 'اختر الفئة التي تناسب ذوقك واستمتع بمجموعة متنوعة من المنتجات'}
          </p>
        </motion.div>

        {/* Categories Navigation - Desktop Horizontal Scroll */}
        {loading ? (
          <div className="flex gap-3 md:gap-4 mb-12 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i}
                className="flex-shrink-0 w-32 h-12 md:w-40 md:h-14 rounded-xl bg-gradient-to-br from-[var(--card-bg)] to-[var(--card-border)]"
                style={shimmerEffect}
              />
            ))}
          </div>
        ) : (
          <div className="relative mb-10 md:mb-12">
            {!isMobile && (
              <>
                <button
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-300 border border-gray-200 -ml-2 md:-ml-4 hidden md:block"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-blue-500 hover:text-white transition-all duration-300 border border-gray-200 -mr-2 md:-mr-4 hidden md:block"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Categories Display - Swiper for Mobile, Horizontal Scroll for Desktop */}
            {isMobile ? (
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={12}
                slidesPerView={3.2}
                centeredSlides={false}
                className="pb-4 mb-8"
                breakpoints={{
                  480: {
                    slidesPerView: 4.2,
                    spaceBetween: 12
                  },
                  640: {
                    slidesPerView: 5.2,
                    spaceBetween: 16
                  }
                }}
              >
                {categories.map((category) => (
                  <SwiperSlide key={category.id} className="!h-auto">
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 h-full flex items-center justify-center ${
                        selectedCategory?.id === category.id
                          ? 'bg-gradient-to-r from-blue-500 to-emerald-400 text-white shadow-lg scale-105'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <span className="truncate">{category.nameEn}</span>
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div
                ref={scrollContainerRef}
                className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide px-2"
                style={{ scrollBehavior: 'smooth' }}
              >
                {categories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex-shrink-0 px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-semibold transition-all duration-300 whitespace-nowrap ${
                      selectedCategory?.id === category.id
                        ? 'bg-gradient-to-r from-blue-500 to-emerald-400 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {category.nameEn}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Category Products */}
        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className="bg-gradient-to-br from-[var(--card-bg)] to-[var(--card-border)] rounded-xl md:rounded-2xl h-[300px] md:h-[350px] border border-[var(--card-border)] overflow-hidden"
                style={shimmerEffect}
              />
            ))}
          </div>
        ) : (
          <>
            {/* Selected Category Title */}
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-between mb-6 md:mb-8 px-2"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500/10 to-emerald-400/10 rounded-lg">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                    {selectedCategory.nameEn}
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({products.length} منتج)
                    </span>
                  </h3>
                </div>
                <Link
                  href={`/categories/${selectedCategory.slug}`}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm md:text-base group"
                >
                  عرض الكل
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            )}

            {/* Products Display - Swiper for Mobile, Grid for Desktop */}
            {isMobile ? (
              <div className="relative px-2">
                <Swiper
                  ref={swiperRef}
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={16}
                  slidesPerView={1.2}
                  centeredSlides={false}
                  autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                  }}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true
                  }}
                  breakpoints={{
                    480: {
                      slidesPerView: 1.5,
                      spaceBetween: 16
                    },
                    640: {
                      slidesPerView: 2.2,
                      spaceBetween: 20
                    },
                    768: {
                      slidesPerView: 2.5,
                      spaceBetween: 24
                    }
                  }}
                  className="pb-12"
                >
                  {products.map((product) => (
                    <SwiperSlide key={product.id}>
                      <ProductCard 
                        product={product} 
                        addToCart={addToCart} 
                        categoryName={selectedCategory?.nameEn || ''}
                        isMobile={true}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="swiper-pagination !bottom-0" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -6 }}
                    className="group"
                  >
                    <ProductCard 
                      product={product} 
                      addToCart={addToCart} 
                      categoryName={selectedCategory?.nameEn || ''}
                      isMobile={false}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* View All Categories Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center mt-12 md:mt-16"
        >
          <Link
            href="/categories"
            className="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-emerald-400/10 to-blue-500/10 text-blue-600 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 border border-blue-200 hover:border-blue-300"
          >
            View all products
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Add shimmer animation to global styles */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .swiper-pagination-bullet {
          background: #d1d5db !important;
          opacity: 0.5;
          width: 8px !important;
          height: 8px !important;
        }
        
        .swiper-pagination-bullet-active {
          background: linear-gradient(135deg, #3b82f6, #10b981) !important;
          opacity: 1;
          width: 24px !important;
          border-radius: 12px !important;
        }
      `}</style>
    </section>
  );
}

// Separate Product Card Component
function ProductCard({ product, addToCart, categoryName, isMobile }: {
  product: Product & { displayPrice?: string; originalPrice?: string; hasDiscount?: boolean };
  addToCart: (product: Product) => void;
  categoryName: string;
  isMobile: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  // Use variant data if available, otherwise use product base data
  const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
  const hasVariants = product.variants && product.variants.length > 0;

  const displayPrice = product.displayPrice || defaultVariant?.salePrice || defaultVariant?.basePrice || product.salePrice || product.basePrice;
  const displayBasePrice = product.originalPrice || defaultVariant?.basePrice || product.basePrice;
  const displayStock = defaultVariant?.stockQuantity !== undefined ? defaultVariant.stockQuantity : product.stockQuantity;
  const displaySizes = hasVariants ? product.variants!.map(v => v.sizeDimensions).join(', ') : null;

  const discountPercentage = (parseFloat(displayBasePrice) && parseFloat(displayPrice) < parseFloat(displayBasePrice))
    ? Math.round((1 - parseFloat(displayPrice) / parseFloat(displayBasePrice)) * 100)
    : product.hasDiscount ? Math.round((1 - parseFloat(displayPrice) / parseFloat(displayBasePrice)) * 100) : 0;

  return (
    <div 
        className={`group bg-[var(--card-bg)] rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--card-border)] h-full flex flex-col ${
                isMobile ? 'max-w-sm mx-auto' : ''
            }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={product.images[0]?.imageUrl || '/placeholder.jpg'}
          alt={product.nameEn}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={isMobile ? "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw" : "25vw"}
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10">
            {discountPercentage}%
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
          {categoryName}
        </div>

        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent flex items-end justify-center p-4 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addToCart(product)}
              className="p-2.5  rounded-full bg-blue-500 text-white transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="p-2.5  rounded-full bg-emerald-500 text-white transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
              aria-label="View product details"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Product Name */}
        <h3 className="font-semibold text-gray-800 text-sm md:text-base mb-2 line-clamp-2 text-blue-600 transition-colors leading-tight">
          {product.nameEn}
        </h3>

        {/* Price */}
        <div className="mt-auto pt-2">
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-blue-600">
                 LE {parseFloat(product.salePrice).toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through">
                 LE {parseFloat(product.basePrice).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-emerald-600">
               LE {parseFloat(product.basePrice).toLocaleString()}
              </span>
            )}
          </div>
          
          {/* Save Amount */}
          {product.salePrice && (
            <div className="text-xs text-emerald-600 font-medium mt-1">
              -LE {(parseFloat(product.basePrice) - parseFloat(product.salePrice)).toLocaleString()}
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(product)}
            className="w-full mt-3 py-2.5 bg-gradient-to-r from-blue-500/10 to-emerald-400/10 text-blue-600 rounded-lg font-semibold hover:from-blue-500 hover:to-emerald-400 hover:text-white transition-all duration-300 border border-blue-200 text-sm"
          >
            Add to Card
          </button>
        </div>
      </div>
    </div>
  );
}