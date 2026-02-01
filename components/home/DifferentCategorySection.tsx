"use client";

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product, Category } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { clientGetCategories, clientGetProducts } from '@/lib/client/api';

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

export function DifferentCategorySection() {
  const t = useTranslations();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const categorySwiperRef = useRef<any>(null);
  const productSwiperRef = useRef<any>(null);

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
          // Start from the 4th category (different from first 3 sections)
          const startIndex = Math.min(3, fetchedCategories.length - 1);
          setCurrentCategoryIndex(startIndex);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (categories[currentCategoryIndex]) {
        setLoading(true);
        try {
          const { products: fetchedProducts } = await clientGetProducts({
            page: 1,
            limit: 8,
            active: true,
            categoryId: categories[currentCategoryIndex].id
          });
          setProducts(fetchedProducts);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching products:', error);
          setLoading(false);
        }
      }
    };
    fetchCategoryProducts();
  }, [currentCategoryIndex, categories]);

  const shimmerEffect = {
    background: "linear-gradient(90deg, var(--shimmer-start) 25%, var(--shimmer-middle) 50%, var(--shimmer-start) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 2s infinite"
  };

  const currentCategory = categories[currentCategoryIndex];

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/10 via-pink-300/10 to-purple-500/10 dark:from-purple-400/5 dark:via-pink-300/5 dark:to-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/10 via-pink-400/10 to-purple-400/10 dark:from-purple-500/5 dark:via-pink-400/5 dark:to-purple-400/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400/10 via-pink-300/10 to-purple-500/10 dark:from-purple-400/20 dark:via-pink-300/20 dark:to-purple-500/20 rounded-full mb-4 border border-purple-200 dark:border-purple-800/50 backdrop-blur-sm">
            <Layers className="w-4 h-4 text-purple-500 dark:text-purple-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              {t('home.differentCategory.badge') || 'Explore More'}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 dark:from-purple-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent mb-4">
            {t('home.differentCategory.title') || 'Different Categories'}
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('home.differentCategory.description') || 'Browse our wide range of different categories'}
          </p>
        </motion.div>

        {/* Category Navigation */}
        <div className="mb-10 md:mb-12">
          {isMobile ? (
            // Mobile - Category Swiper
            <div className="px-2">
              <Swiper
                ref={categorySwiperRef}
                modules={[Navigation, Pagination]}
                spaceBetween={12}
                slidesPerView={3.5}
                centeredSlides={true}
                slideToClickedSlide={true}
                onSlideChange={(swiper) => {
                  setCurrentCategoryIndex(swiper.activeIndex);
                }}
                initialSlide={currentCategoryIndex}
                className="pb-4"
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
                {categories.map((category, index) => (
                  <SwiperSlide key={category.id}>
                    <button
                      onClick={() => setCurrentCategoryIndex(index)}
                      className={`px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 w-full ${
                        index === currentCategoryIndex
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <span className="truncate block">{category.nameEn}</span>
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            // Desktop - Category Selection with Buttons
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setCurrentCategoryIndex(prev => (prev > 0 ? prev - 1 : categories.length - 1))}
                disabled={categories.length === 0}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-700"
                aria-label="Previous category"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex items-center gap-4 flex-wrap justify-center">
                {categories.slice(0, 8).map((category, index) => (
                  <button
                    key={category.id}
                    onClick={() => setCurrentCategoryIndex(index)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                      index === currentCategoryIndex
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    {category.nameEn}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentCategoryIndex(prev => (prev < categories.length - 1 ? prev + 1 : 0))}
                disabled={categories.length === 0}
                className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-purple-100 dark:hover:bg-purple-900 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-200 dark:border-gray-700"
                aria-label="Next category"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {/* Current Category Info */}
          {currentCategory && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-6"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <Sparkles className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                  {currentCategory.nameEn}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                    ({products.length} products)
                  </span>
                </h3>
              </div>
            </motion.div>
          )}
        </div>

        {/* Products Display */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="bg-white dark:bg-gray-800 rounded-xl h-[280px] md:h-[320px] border border-gray-200 dark:border-gray-700 overflow-hidden"
                style={shimmerEffect}
              />
            ))}
          </div>
        ) : isMobile ? (
          // Mobile - Products Swiper
          <div className="relative px-2">
            <Swiper
              ref={productSwiperRef}
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1.2}
              centeredSlides={false}
              loop={true}
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
                  slidesPerView: 1.8,
                  spaceBetween: 16
                },
                640: {
                  slidesPerView: 2.5,
                  spaceBetween: 20
                },
                768: {
                  slidesPerView: 3.2,
                  spaceBetween: 24
                }
              }}
              className="pb-12"
            >
              {products.map((product) => (
                <SwiperSlide key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    <ProductCard product={product} addToCart={addToCart} isMobile={true} />
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="swiper-pagination !bottom-0" />
          </div>
        ) : (
          // Desktop - Grid Layout
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {products.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group"
              >
                <ProductCard product={product} addToCart={addToCart} isMobile={false} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center mt-12 md:mt-16"
        >
          <Link
            href={currentCategory ? `/products?sort=newest&category=${currentCategory.id}` : '/categories'}
            className="group inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white rounded-xl md:rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg relative overflow-hidden"
          >
            {/* Animated Background */}
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">
              {t('home.differentCategory.viewAll') || 'View All Products in This Category'}
            </span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Add CSS Variables for Dark/Light mode shimmer */}
      <style jsx global>{`
        :root {
          --shimmer-start: #faf5ff;
          --shimmer-middle: #f3e8ff;
        }
        
        .dark {
          --shimmer-start: #1e293b;
          --shimmer-middle: #334155;
        }
        
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
          background: linear-gradient(135deg, #8b5cf6, #ec4899) !important;
          opacity: 1;
          width: 24px !important;
          border-radius: 12px !important;
        }
        
        .dark .swiper-pagination-bullet {
          background: #4b5563 !important;
        }
      `}</style>
    </section>
  );
}

// Separate Product Card Component
function ProductCard({ product, addToCart, isMobile }: { 
  product: Product; 
  addToCart: (product: Product) => void;
  isMobile: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const discountPercentage = product.salePrice 
    ? Math.round((1 - parseFloat(product.salePrice) / parseFloat(product.basePrice)) * 100)
    : 0;

  return (
    <div 
      className={`group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full flex flex-col ${
        isMobile ? 'max-w-sm mx-auto' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-900">
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
          <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-600 dark:to-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg z-10">
            -{discountPercentage}%
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-center p-4 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addToCart(product)}
              className="p-2.5 bg-white dark:bg-gray-800 rounded-full hover:bg-purple-500 hover:text-white dark:hover:bg-purple-600 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="p-2.5 bg-white dark:bg-gray-800 rounded-full hover:bg-pink-500 hover:text-white dark:hover:bg-pink-600 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
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
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm md:text-base mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors leading-tight">
          {product.nameEn}
        </h3>

        {/* Price */}
        <div className="mt-auto pt-2">
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  EGP {parseFloat(product.salePrice).toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
                  EGP {parseFloat(product.basePrice).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-pink-600 dark:text-pink-400">
                EGP {parseFloat(product.basePrice).toLocaleString()}
              </span>
            )}
          </div>
          
          {/* Save Amount */}
          {product.salePrice && (
            <div className="text-xs text-pink-600 dark:text-pink-400 font-medium mt-1">
              Save EGP {(parseFloat(product.basePrice) - parseFloat(product.salePrice)).toLocaleString()}
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(product)}
            className="w-full mt-3 py-2.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 text-purple-600 dark:text-purple-400 rounded-lg font-semibold hover:from-purple-500 hover:to-pink-500 hover:text-white dark:hover:text-white transition-all duration-300 border border-purple-200 dark:border-purple-800 text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}