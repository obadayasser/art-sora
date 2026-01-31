"use client";

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { motion, easeOut } from 'framer-motion';
import { ShoppingCart, Star, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
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

export function BestSellersSection() {
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
        const fetchBestSellers = async () => {
            try {
                const { products: fetchedProducts } = await clientGetProducts({
                    page: 1,
                    limit: 8,
                    active: true
                });

                // Process products to get lowest price from variants
                const productsWithMinPrice = fetchedProducts.map(product => {
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

                const sortedProducts = productsWithMinPrice.slice(0, 8);
                setProducts(sortedProducts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching best sellers:', error);
                setLoading(false);
            }
        };

        fetchBestSellers();
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
                duration: 0.5,
                ease: easeOut
            }
        }
    };

    const shimmerEffect = {
        background: "linear-gradient(90deg, var(--card-bg) 25%, var(--card-border) 50%, var(--card-bg) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 2s infinite"
    };

    return (
        <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[var(--background)] via-[var(--card-border)]/30 to-[var(--background)] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-emerald-300/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-emerald-300/10 to-blue-400/10 rounded-full blur-3xl" />
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
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-semibold bg-gradient-to-r from-blue-500 to-emerald-400 bg-clip-text text-transparent">
                            {t('home.bestSellers.badge') || 'الأكثر مبيعاً'}
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-500 bg-clip-text text-transparent mb-4">
                        {t('home.bestSellers.title') || 'منتجاتنا الأكثر مبيعاً'}
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        {t('home.bestSellers.description') || 'اكتشف مجموعة منتجاتنا المميزة التي حظيت بإعجاب العملاء'}
                    </p>
                </motion.div>

                {/* Products Display - Swiper for Mobile, Grid for Desktop */}
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div
                                key={i}
                                className=" rounded-2xl h-[300px] md:h-[350px]   overflow-hidden"
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
                                delay: 3000,
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
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
                    >
                        {products.map((product, index) => (
                            <motion.div
                                key={product.id}
                                variants={itemVariants}
                                whileHover={{ y: -8 }}
                                transition={{ type: "spring", stiffness: 300 }}
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
                        href="/products?sort=bestsellers"
                        className="group inline-flex items-center gap-2 px-6 py-3 md:px-8 md:py-4 bg-gradient-to-r from-blue-500 via-emerald-400 to-blue-500 text-white rounded-xl md:rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg relative overflow-hidden"
                    >
                        {/* Animated Background */}
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-emerald-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <span className="relative z-10">
                            {t('home.bestSellers.viewAll') || 'عرض جميع المنتجات'}
                        </span>
                        <ArrowRight className="w-4 h-4 md:w-5 md:h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>

        </section>
    );
}

// Separate Product Card Component for reusability
function ProductCard({ product, addToCart, isMobile }: {
    product: Product;
    addToCart: (product: Product) => void;
    isMobile: boolean;
}) {
    const [isHovered, setIsHovered] = useState(false);

    // Use variant data if available, otherwise use product base data
    const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
    const hasVariants = product.variants && product.variants.length > 0;

    const displayPrice = defaultVariant?.salePrice || defaultVariant?.basePrice || product.salePrice || product.basePrice;
    const displayBasePrice = defaultVariant?.basePrice || product.basePrice;
    const displayStock = defaultVariant?.stockQuantity !== undefined ? defaultVariant.stockQuantity : product.stockQuantity;
    const displaySizes = hasVariants ? product.variants!.map(v => v.sizeDimensions).join(', ') : null;

    const discountPercentage = (parseFloat(displayBasePrice) && parseFloat(displayPrice) < parseFloat(displayBasePrice))
        ? Math.round((1 - parseFloat(displayPrice) / parseFloat(displayBasePrice)) * 100)
        : 0;

    return (
        <div
            className={`group bg-[var(--card-bg)] rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[var(--card-border)] h-full flex flex-col ${isMobile ? 'max-w-sm mx-auto' : ''
                }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[var(--card-border)] to-[var(--background)]">
                <Image
                    src={product.images[0]?.imageUrl}
                    alt={product.nameEn}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes={isMobile ? "(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw" : "25vw"}
                />

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-emerald-400 text-white px-2 py-1 md:px-3 md:py-1.5 rounded-full text-xs md:text-sm font-bold shadow-lg z-10">
                        خصم {discountPercentage}%
                    </div>
                )}

                {/* Quick Actions Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end justify-center p-4 transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
                    }`}>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => addToCart(product)}
                            className="p-2.5  rounded-full bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
                            aria-label="Add to cart"
                        >
                            <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                        <Link
                            href={`/products/${product.slug}`}
                            className="p-2.5  rounded-full bg-emerald-500 hover:text-white transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-lg"
                            aria-label="View product details"
                        >
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
                {/* Sizes Badge */}
                {displaySizes && (
                    <div className="text-xs text-gray-500 mb-1">
                        {displaySizes}
                    </div>
                )}

                {/* Product Name */}
                <h3 className="font-semibold   text-sm md:text-base mb-2 line-clamp-2 text-blue-600 transition-colors leading-tight">
                    {product.nameEn}
                </h3>

                {/* Price */}
                <div className="mt-auto pt-2">
                    <div className="flex items-center gap-2">
                        {discountPercentage > 0 ? (
                            <>
                                <span className="text-lg md:text-xl font-bold text-blue-600">
                                    LE {parseFloat(displayPrice).toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-400 line-through">
                                    LE {parseFloat(displayBasePrice).toLocaleString()}
                                </span>
                            </>
                        ) : (
                            <span className="text-lg md:text-xl font-bold text-emerald-600">
                                LE {parseFloat(displayPrice).toLocaleString()}
                            </span>
                        )}
                    </div>

                    {/* Save Amount */}
                    {discountPercentage > 0 && (
                        <div className="text-xs text-emerald-600 font-medium mt-1">
                            - LE {(parseFloat(displayBasePrice) - parseFloat(displayPrice)).toLocaleString()}
                        </div>
                    )}

                    {/* Stock Indicator */}
                    {displayStock !== undefined && (
                        <div className={`text-xs mt-1 ${displayStock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {displayStock > 0 ? `Available (${displayStock})` : 'غير Available'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}