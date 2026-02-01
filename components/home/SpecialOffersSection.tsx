/* "use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, Gift, Timer } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/actions/api';

export function SpecialOffersSection() {
  const t = useTranslations();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories(true);
        const offerCategories = fetchedCategories.slice(0, 3).map((cat, index) => ({
          ...cat,
          discount: `${(40 - index * 5)}%`,
          bgColor: index === 0 ? 'from-amber-600 to-orange-600' : index === 1 ? 'from-slate-600 to-slate-800' : 'from-purple-600 to-pink-600'
        }));
        setCategories(offerCategories);
        if (offerCategories.length > 0) {
          setSelectedCategoryId(offerCategories[0].id);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      if (selectedCategoryId) {
        setProductsLoading(true);
        try {
          const { products: fetchedProducts } = await getProducts({
            page: 1,
            limit: 4,
            active: true,
            categoryId: selectedCategoryId
          });
          setProducts(fetchedProducts);
          setLoading(false);
          setProductsLoading(false);
        } catch (error) {
          console.error('Error fetching products:', error);
          setLoading(false);
          setProductsLoading(false);
        }
      }
    };
    fetchCategoryProducts();
  }, [selectedCategoryId]);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(interval);
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4
      }
    }
  };

  const currentCategory = categories.find(c => c.id === selectedCategoryId);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[var(--background)] via-[var(--card-bg)]/30 to-[var(--background)] relative overflow-hidden">
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-r from-[#DA5280]/5 via-transparent to-[#AAD7F3]/5" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FFD700]/10 to-[#FFA500]/10 rounded-full mb-4">
            <Gift className="w-5 h-5 text-[#FFD700]" />
            <span className="text-sm font-semibold text-[#FFD700]">
              {t('home.offers.badge') || 'عروض خاصة'}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            {t('home.offers.title') || 'عروض محدودة الوقت'}
          </h2>

          
          <div className="flex justify-center gap-4 mt-8 mb-4">
            {[
              { value: timeLeft.hours, label: t('home.offers.hours') || 'ساعة' },
              { value: timeLeft.minutes, label: t('home.offers.minutes') || 'دقيقة' },
              { value: timeLeft.seconds, label: t('home.offers.seconds') || 'ثانية' }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-[#DA5280] to-[#FFD700] text-white rounded-xl p-4 min-w-[90px] shadow-lg"
              >
                <div className="text-3xl font-bold">{String(item.value).padStart(2, '0')}</div>
                <div className="text-xs font-medium opacity-90">{item.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative overflow-hidden px-6 py-3 rounded-xl font-bold transition-all ${
                selectedCategoryId === category.id
                  ? 'text-white shadow-xl scale-105'
                  : 'bg-[var(--card-bg)] text-[var(--foreground)] hover:bg-[var(--card-border)]'
              }`}
              style={selectedCategoryId === category.id ? {
                background: `linear-gradient(to right, ${category.bgColor})`
              } : {}}
            >
              <span className="relative z-10">{category.nameEn}</span>
              {selectedCategoryId === category.id && (
                <div className="absolute top-2 right-2 bg-white/20 px-2 py-1 rounded text-xs font-bold">
                  {category.discount}
                </div>
              )}
            </motion.button>
          ))}
        </div>

        
        {loading || productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[var(--card-bg)] rounded-2xl h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                className="group"
              >
                <div className="relative bg-[var(--card-bg)] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[var(--card-border)]">
                  
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.images[0]?.imageUrl || '/placeholder.jpg'}
                      alt={product.nameEn}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    
                    {product.salePrice && (
                      <div
                        className="absolute top-4 left-4 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg"
                        style={{
                          background: currentCategory ? `linear-gradient(to right, ${currentCategory.bgColor})` : ''
                        }}
                      >
                        {currentCategory?.discount || '30%'}
                      </div>
                    )}
                    
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Timer className="w-3 h-3" />
                      {t('home.offers.limitedTime') || 'وقت محدود'}
                    </div>
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <button
                        onClick={() => addToCart(product)}
                        className="p-4 bg-white rounded-full hover:bg-[var(--color)] hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                      >
                        <ShoppingCart className="w-6 h-6" />
                      </button>
                      <Link
                        href={`/products/${product.slug}`}
                        className="p-4 bg-white rounded-full hover:bg-[var(--color)] hover:text-white transition-all duration-300 transform hover:scale-110 shadow-lg"
                      >
                        <ArrowRight className="w-6 h-6" />
                      </Link>
                    </div>
                  </div>

                  
                  <div className="p-5">
                    <h3 className="font-bold text-[var(--foreground)] text-lg mb-2 line-clamp-2 group-hover:text-[var(--color)] transition-colors">
                      {product.nameEn}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {product.salePrice ? (
                          <>
                            <span className="text-2xl font-bold text-[#FFD700]">
                              $EG {parseFloat(product.salePrice).toFixed(2)}
                            </span>
                            <span className="text-sm text-[var(--foreground)]/60 line-through">
                             EG {parseFloat(product.basePrice).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-[var(--color)]">
                            EGEG {parseFloat(product.basePrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/products?offers=true"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
          >
            {t('home.offers.viewAll') || 'عرض جميع العروض'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
 */