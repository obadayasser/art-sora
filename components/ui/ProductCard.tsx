'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, ChevronRight, Heart, Eye } from 'lucide-react';
import { Product } from '@/types';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  index?: number;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, index = 0, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const price = parseFloat(product.salePrice || product.basePrice);
  const originalPrice = product.salePrice ? parseFloat(product.basePrice) : null;
  const discount = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700">
        {/* Image Container */}
        <Link href={`/products/${product.slug}`} className="block relative">
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            {!imageError && product.images?.[0]?.imageUrl ? (
              <Image
                src={product.images[0].imageUrl}
                alt={product.nameEn}
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-400 dark:text-gray-500">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Discount Badge */}
            {discount > 0 && (
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: -12 }}
                transition={{ delay: index * 0.05 + 0.2, type: 'spring' }}
                className="absolute top-3 left-3 z-10"
              >
                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                  -{discount}%
                </div>
              </motion.div>
            )}

            {/* Quick Actions Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-center p-4 gap-2"
            >
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ delay: 0.05 }}
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart(product);
                }}
                className="p-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white transition-all transform hover:scale-110 shadow-lg backdrop-blur-sm"
                aria-label="Add to cart"
              >
                <ShoppingCart size={20} />
              </motion.button>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="p-3 rounded-xl bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-900 dark:text-white transition-all transform hover:scale-110 shadow-lg backdrop-blur-sm flex items-center justify-center"
                  aria-label="View details"
                >
                  <Eye size={20} />
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </Link>

        {/* Product Info */}
        <div className="p-4">
          <Link
            href={`/products/${product.slug}`}
            className="block"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-purple-500 dark:hover:text-purple-400 transition-colors min-h-[3rem]">
              {product.nameEn}
            </h3>
          </Link>

          {/* Price Section */}
          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  LE {price.toLocaleString()}
                </span>
                {originalPrice && (
                  <span className="text-sm text-gray-400 line-through">
                    LE {originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.salePrice && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Save LE {(originalPrice! - price).toLocaleString()}
                </span>
              )}
            </div>

            <Link
              href={`/products/${product.slug}`}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-purple-500 hover:text-white dark:hover:bg-purple-500 transition-all transform hover:scale-110"
              aria-label="View details"
            >
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
