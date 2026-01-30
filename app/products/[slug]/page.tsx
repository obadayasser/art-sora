"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Heart, Share2, ArrowLeft, Check, Truck, Shield, RotateCcw } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
 import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug, getProductReviews } from '@/lib/client/api';
import {  getProductVariants, getProductSizes } from '@/lib/client/api-client-orders';
import { Product, ProductVariant, ProductSize } from '@/types';

export default function ProductDetailPage() {
  const t = useTranslations();
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

  useEffect(() => {
    const fetchProduct = async () => {
      if (slug) {
        try {
          const fetchedProduct = await getProductBySlug(slug as string);
          setProduct(fetchedProduct);

          // Fetch variants
          if (fetchedProduct) {
            const fetchedVariants = await getProductVariants(fetchedProduct.id);
            setVariants(fetchedVariants);

            // Set default variant
            const defaultVariant = fetchedVariants.find(v => v.isDefault) || fetchedVariants[0];
            if (defaultVariant) {
              setSelectedVariant(defaultVariant);
            }

            // Fetch reviews
            const fetchedReviews = await getProductReviews(fetchedProduct.id);
            setReviews(fetchedReviews);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error fetching product:', error);
          setLoading(false);
        }
      }
    };

    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--color)]"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--foreground)] mb-4">
            {t('product.notFound') || 'المنتج غير موجود'}
          </h1>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color)] text-white rounded-xl font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('product.backToHome') || 'العودة للرئيسية'}
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Breadcrumb */}
      <div className="bg-[var(--card-bg)]/50 border-b border-[var(--card-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[var(--foreground)]/60 hover:text-[var(--color)] transition-colors">
              {t('common.home') || 'الرئيسية'}
            </Link>
            <span className="text-[var(--foreground)]/40">/</span>
            <Link
              href={`/categories/${product.category?.slug}`}
              className="text-[var(--foreground)]/60 hover:text-[var(--color)] transition-colors"
            >
              {product.category?.nameAr}
            </Link>
            <span className="text-[var(--foreground)]/40">/</span>
            <span className="text-[var(--foreground)] font-medium">{product.nameAr}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--foreground)]/60 hover:text-[var(--color)] transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('product.back') || 'العودة'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[4/5] bg-[var(--card-bg)] rounded-2xl overflow-hidden">
                <Image
                  src={product.images[selectedImage]?.imageUrl || '/placeholder.jpg'}
                  alt={product.nameAr}
                  fill
                  className="object-cover"
                />
                {product.salePrice && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-[#DA5280] to-[#E879A0] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {Math.round((1 - parseFloat(product.salePrice) / parseFloat(product.basePrice)) * 100)}% {t('product.off') || 'خصم'}
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index
                          ? 'border-[var(--color)] scale-105'
                          : 'border-transparent hover:border-[var(--card-border)]'
                        }`}
                    >
                      <Image
                        src={image.imageUrl}
                        alt={`${product.nameAr} ${index + 1}`}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-4">
              {product.nameAr}
            </h1>

            {/* SKU & Stock */}
            <div className="flex items-center gap-4 text-sm text-[var(--foreground)]/60 mb-6">
              <span>{t('product.sku') || 'رقم المنتج'}: {product.sku}</span>
              <span>•</span>
              {/*         <span className={product.stockQuantity > 0 ? 'text-green-500' : 'text-red-500'}>
                {product.stockQuantity > 0
                  ? `${t('product.inStock') || 'متوفر'} (${product.stockQuantity})`
                  : t('product.outOfStock') || 'غير متوفر'
                }
              </span> */}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(parseFloat(averageRating))
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                      }`}
                  />
                ))}
              </div>
              <span className="text-[var(--foreground)]/60">
                ({reviews.length} {t('product.reviews') || 'تقييم'})
              </span>
            </div>

            {/* Size/Variants Selector */}
            {variants.length > 0 && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                  المقاس
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={!variant.isActive}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedVariant?.id === variant.id
                          ? 'border-[var(--color)] bg-[var(--color)]/10'
                          : 'border-[var(--card-border)] hover:border-[var(--color)]/50'
                      } ${!variant.isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="font-semibold text-sm">{variant.nameAr || variant.nameEn}</div>
                      <div className="text-xs text-[var(--foreground)]/60">{variant.sizeDimensions}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price */}
            <div className="mb-8">
              {selectedVariant?.salePrice ? (
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-bold text-[#DA5280]">
                    LE {parseFloat(selectedVariant.salePrice).toFixed(2)}
                  </span>
                  <span className="text-xl text-[var(--foreground)]/60 line-through">
                    LE {parseFloat(selectedVariant.basePrice).toFixed(2)}
                  </span>
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-semibold">
                    {parseFloat(selectedVariant.discountPercentage).toFixed(0)}% {t('product.off') || 'خصم'}
                  </span>
                </div>
              ) : selectedVariant ? (
                <span className="text-4xl font-bold text-[var(--color)]">
                  LE {parseFloat(selectedVariant.basePrice).toFixed(2)}
                </span>
              ) : (
                <span className="text-4xl font-bold text-[var(--color)]">
                  LE {parseFloat(product.basePrice).toFixed(2)}
                </span>
              )}
              <div className="flex items-center gap-2 mt-2 text-sm text-[var(--foreground)]/60">
                {selectedVariant?.stockQuantity !== undefined ? (
                  <span className={selectedVariant.stockQuantity > 0 ? 'text-green-500' : 'text-red-500'}>
                    {selectedVariant.stockQuantity > 0
                      ? `متوفر (${selectedVariant.stockQuantity})`
                      : 'غير متوفر'
                    }
                  </span>
                ) : (
                  <span className={product.stockQuantity > 0 ? 'text-green-500' : 'text-red-500'}>
                    {product.stockQuantity > 0
                      ? `متوفر (${product.stockQuantity})`
                      : 'غير متوفر'
                    }
                  </span>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-[var(--foreground)] mb-2">
                {t('product.quantity') || 'الكمية'}
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--color)] hover:text-white transition-colors text-2xl font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={selectedVariant?.stockQuantity || product.stockQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(selectedVariant?.stockQuantity || product.stockQuantity, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-20 h-12 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-center text-[var(--foreground)] text-xl font-bold focus:outline-none focus:border-[var(--color)]"
                />
                <button
                  onClick={() => setQuantity(Math.min(selectedVariant?.stockQuantity || product.stockQuantity, quantity + 1))}
                  className="w-12 h-12 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--foreground)] hover:bg-[var(--color)] hover:text-white transition-colors text-2xl font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                /*      disabled={product.stockQuantity === 0} */
                className="flex-1 py-4 bg-gradient-to-r from-[#DA5280] to-[#AAD7F3] text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
              >
                <ShoppingCart className="w-5 h-5" />
                {t('product.addToCart') || 'Add to Card'}
              </button>
              <button className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] hover:text-[var(--color)] transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-8">
             {/*  <div className="flex items-center gap-3 text-[var(--foreground)]/80">
                <Truck className="w-5 h-5 text-[#AAD7F3]" />
                <span>{t('product.freeShipping') || 'شحن مجاني للطلبات فوق 200'}</span>
              </div> */}
              <div className="flex items-center gap-3 text-[var(--foreground)]/80">
                <Shield className="w-5 h-5 text-[#DA5280]" />
                <span>{t('product.securePayment') || 'دفع آمن ومحمي'}</span>
              </div>
       {/*        <div className="flex items-center gap-3 text-[var(--foreground)]/80">
                <RotateCcw className="w-5 h-5 text-[#FFD700]" />
                <span>{t('product.easyReturns') || 'استرجاع سهل خلال 30 يوم'}</span>
              </div> */}
            </div>

            {/* Tabs */}
            <div className="border-b border-[var(--card-border)] mb-6">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`pb-4 font-semibold transition-colors ${activeTab === 'description'
                      ? 'text-[var(--color)] border-b-2 border-[var(--color)]'
                      : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)]'
                    }`}
                >
                  {t('product.description') || 'الوصف'}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-4 font-semibold transition-colors ${activeTab === 'reviews'
                      ? 'text-[var(--color)] border-b-2 border-[var(--color)]'
                      : 'text-[var(--foreground)]/60 hover:text-[var(--foreground)]'
                    }`}
                >
                  {t('product.reviews') || 'التقييمات'} ({reviews.length})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'description' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[var(--foreground)]/80 leading-relaxed"
              >
                {product.descriptionAr || (
                  <p>
                    {t('product.noDescription') || 'لا يوجد وف متاح لهذا المنتج حالياً.'}
                  </p>
                )}
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {reviews.length > 0 ? (
                  reviews.map((review) => (
                    <div key={review.id} className="bg-[var(--card-bg)] rounded-xl p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${star <= review.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="font-semibold text-[var(--foreground)]">
                            {review.customerName}
                          </span>
                        </div>
                        <span className="text-sm text-[var(--foreground)]/60">
                          {new Date(review.createdAt).toLocaleDateString('ar-EG')}
                        </span>
                      </div>
                      <h4 className="font-semibold text-[var(--foreground)] mb-2">
                        {review.reviewTitle}
                      </h4>
                      <p className="text-[var(--foreground)]/80">{review.reviewText}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-[var(--foreground)]/60">
                    {t('product.noReviews') || 'لا توجد تقييمات لهذا المنتج بعد'}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
