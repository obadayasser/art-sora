"use client";

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { clientGetProducts } from '@/lib/client/api';

// Import Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

export function NewArrivalsSection() {
  const t = useTranslations();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
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
    const fetchNewArrivals = async () => {
      try {
        const { products: fetchedProducts } = await clientGetProducts({
          page: 1,
          limit: 8,
          active: true
        });

        // Sort by createdAt (newest first) and process for variant prices
        const sortedProducts = fetchedProducts
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 6);

        // Process products to get lowest price from variants
        const productsWithMinPrice = sortedProducts.map(product => {
          if (product.variants && product.variants.length > 0) {
            const minPrice = Math.min(...product.variants.map(v => parseFloat(v.basePrice)));
            const minVariant = product.variants.find(v => parseFloat(v.basePrice) === minPrice);
            return {
              ...product,
              displayPrice: minVariant?.salePrice || minVariant?.basePrice || product.basePrice,
              originalPrice: minVariant?.basePrice || product.basePrice,
              hasDiscount: !!minVariant?.salePrice
            };
          }
          return {
            ...product,
            displayPrice: product.salePrice || product.basePrice,
            originalPrice: product.basePrice,
            hasDiscount: !!product.salePrice
          };
        });

        setProducts(productsWithMinPrice);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const shimmerEffect = {
    background: "linear-gradient(90deg, var(--shimmer-start) 25%, var(--shimmer-middle) 50%, var(--shimmer-start) 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 2s infinite"
  };

  return (
    <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Decorative Background - Light/Dark mode aware */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/5 via-emerald-300/5 to-blue-500/5 dark:from-blue-400/10 dark:via-emerald-300/10 dark:to-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-l from-blue-400/5 via-emerald-300/5 to-blue-500/5 dark:from-blue-400/10 dark:via-emerald-300/10 dark:to-blue-500/10 rounded-full blur-3xl" />
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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-400/10 via-emerald-300/10 to-blue-500/10 dark:from-blue-400/20 dark:via-emerald-300/20 dark:to-blue-500/20 rounded-full mb-4 border border-blue-200 dark:border-blue-800/50 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            <span className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-emerald-400 dark:from-blue-400 dark:to-emerald-300 bg-clip-text text-transparent">
              {t('home.newArrivals.badge') || 'New Arrivals'}
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-500 dark:from-blue-400 dark:via-emerald-300 dark:to-blue-400 bg-clip-text text-transparent mb-4">
            {t('home.newArrivals.title') || 'Just Arrived'}
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {t('home.newArrivals.description') || 'Discover the latest products added to our collection'}
          </p>
        </motion.div>

        {/* Products Display - Swiper for Mobile, Grid for Desktop */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl h-[350px] md:h-[400px] border border-gray-200 dark:border-gray-700 overflow-hidden"
                style={shimmerEffect}
              />
            ))}
          </div>
        ) : isMobile ? (
          // Mobile - Swiper Carousel
          <div className="relative px-2">
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={16}
              slidesPerView={1.2}
              centeredSlides={false}
              loop={true}
              autoplay={{
                delay: 3500,
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
                  slidesPerView: 1.8,
                  spaceBetween: 20
                },
                768: {
                  slidesPerView: 2.2,
                  spaceBetween: 24
                }
              }}
              className="pb-12"
            >
              {products.map((product, index) => (
                <SwiperSlide key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="h-full"
                  >
                    <ProductCard product={product} addToCart={addToCart} isMobile={true} />
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
            
            {/* Custom Pagination Dots */}
            <div className="swiper-pagination !bottom-0" />
          </div>
        ) : (
          // Desktop - Grid Layout
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 300 }}
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
            href="/products?sort=newest"
            className="group inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500 dark:from-blue-600 dark:via-emerald-500 dark:to-blue-600 text-white rounded-xl md:rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg relative overflow-hidden"
          >
            {/* Animated Background */}
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 dark:from-blue-700 dark:via-emerald-600 dark:to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10">
              {t('home.newArrivals.viewAll') || 'View All New Products'}
            </span>
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>

      {/* Add CSS Variables for Dark/Light mode shimmer */}
      <style jsx global>{`
        :root {
          --shimmer-start: #f0f9ff;
          --shimmer-middle: #e0f2fe;
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
          background: linear-gradient(135deg, #3b82f6, #10b981) !important;
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
  product: Product & { displayPrice?: string; originalPrice?: string; hasDiscount?: boolean };
  addToCart: (product: Product) => void;
  isMobile: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [timeSinceAdded, setTimeSinceAdded] = useState('');

  useEffect(() => {
    // Calculate time since product was added
    const calculateTimeSince = () => {
      const createdAt = new Date(product.createdAt);
      const now = new Date();
      const diffInHours = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60));

      if (diffInHours < 24) {
        setTimeSinceAdded(`${diffInHours}h ago`);
      } else if (diffInHours < 168) {
        setTimeSinceAdded(`${Math.floor(diffInHours / 24)}d ago`);
      } else {
        setTimeSinceAdded('Recently added');
      }
    };

    calculateTimeSince();
  }, [product.createdAt]);

  const isNew = (() => {
    const createdAt = new Date(product.createdAt);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays < 7; // Consider new if added within last 7 days
  })();

  // Use variant data if available, otherwise use product base data
  const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
  const hasVariants = product.variants && product.variants.length > 0;

  const displayPrice = product.displayPrice || defaultVariant?.salePrice || defaultVariant?.basePrice || product.basePrice;
  const displayBasePrice = product.originalPrice || defaultVariant?.basePrice || product.basePrice;
  const displayStock = defaultVariant?.stockQuantity !== undefined ? defaultVariant.stockQuantity : product.stockQuantity;
  const displaySizes = hasVariants ? product.variants!.map(v => v.sizeDimensions).join(', ') : null;

  const discountPercentage = (parseFloat(displayBasePrice) && parseFloat(displayPrice) < parseFloat(displayBasePrice))
    ? Math.round((1 - parseFloat(displayPrice) / parseFloat(displayBasePrice)) * 100)
    : product.hasDiscount ? Math.round((1 - parseFloat(displayPrice) / parseFloat(displayBasePrice)) * 100) : 0;
  return (
    <div 
      className={`group bg-white dark:bg-gray-800 rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full flex flex-col ${
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
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
          sizes={isMobile ? "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" : "33vw"}
        />
        
        {/* New Badge */}
        {isNew && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-500 to-emerald-400 dark:from-blue-600 dark:to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg z-10 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            NEW
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-center p-4 transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addToCart(product)}
              className="p-2.5 bg-white dark:bg-gray-800 rounded-full hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
            </button>
            <Link
              href={`/products/${product.slug}`}
              className="p-2.5 bg-white dark:bg-gray-800 rounded-full hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-600 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
              aria-label="View product details"
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-5 flex-1 flex flex-col">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3 h-3 md:w-4 md:h-4 ${star <= 4.7 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'
                }`}
            />
          ))}
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">4.7</span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm md:text-base mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
          {product.nameEn}
        </h3>

        {/* Sizes Badge */}
        {displaySizes && (
          <div className="text-xs text-gray-500 mb-1">
            {displaySizes}
          </div>
        )}

        {/* Price and Time Info */}
        <div className="mt-auto pt-3">
          <div className="flex items-center justify-between mb-3">
            {discountPercentage > 0 ? (
              <>
                <span className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">
                  LE {parseFloat(displayPrice).toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  LE {parseFloat(displayBasePrice).toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">
                LE {parseFloat(displayPrice).toLocaleString()}
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeSinceAdded}
            </span>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(product)}
            className="w-full py-2.5 md:py-3 bg-gradient-to-r from-blue-500/10 to-emerald-400/10 dark:from-blue-500/20 dark:to-emerald-400/20 text-blue-600 dark:text-blue-400 rounded-lg font-semibold hover:from-blue-500 hover:to-emerald-400 hover:text-white dark:hover:text-white transition-all duration-300 border border-blue-200 dark:border-blue-800 text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}