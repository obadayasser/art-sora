'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Eye, ImageOff } from 'lucide-react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  index?: number;
  onAddToCart: (product: Product) => void;
  /** Optional category label rendered as a chip on the image */
  categoryName?: string;
}

/**
 * The single product card used across the whole storefront
 * (home sections, listing page, related products). All colors
 * come from design tokens so light/dark themes both work.
 */
export function ProductCard({ product, index = 0, onAddToCart, categoryName }: ProductCardProps) {
  const t = useTranslations();
  const [imageError, setImageError] = useState(false);

  // Prefer the default variant's pricing when variants exist.
  const defaultVariant = product.variants?.find((v) => v.isDefault) || product.variants?.[0];
  const priceSource = defaultVariant ?? product;
  const price = parseFloat(priceSource.salePrice || priceSource.basePrice);
  const originalPrice = priceSource.salePrice ? parseFloat(priceSource.basePrice) : null;
  const discount =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const imageUrl = !imageError ? product.images?.[0]?.imageUrl : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index, 8) * 0.05, duration: 0.3 }}
      className="group h-full"
    >
      <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 border border-line h-full flex flex-col">
        {/* Image */}
        <Link href={`/products/${product.slug}`} className="block relative">
          <div className="relative aspect-square overflow-hidden bg-section">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={product.nameEn}
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-ink-faint">
                <ImageOff className="w-14 h-14" strokeWidth={1.2} aria-hidden="true" />
              </div>
            )}

            {discount > 0 && (
              <span className="absolute top-3 start-3 z-10 bg-danger text-white px-2.5 py-1 rounded-full text-xs font-bold shadow">
                -{discount}%
              </span>
            )}

            {categoryName && (
              <span className="absolute top-3 end-3 z-10 bg-stage/70 backdrop-blur-sm text-stage-ink px-2.5 py-1 rounded-full text-xs font-medium">
                {categoryName}
              </span>
            )}

            {/* Hover actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-stage/60 via-transparent to-transparent flex items-end justify-center p-4 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onAddToCart(product);
                }}
                className="p-2.5 rounded-xl bg-accent text-accent-contrast hover:bg-accent-hover transition-all hover:scale-110 active:scale-95 shadow-lg"
                aria-label={t('product.addToCart')}
              >
                <ShoppingCart size={18} />
              </button>
              <span
                className="p-2.5 rounded-xl bg-card text-ink transition-all group-hover:scale-100 hover:scale-110 shadow-lg flex items-center justify-center"
                aria-label={t('product.viewDetails')}
              >
                <Eye size={18} />
              </span>
            </div>
          </div>
        </Link>

        {/* Info */}
        <div className="p-4 flex-1 flex flex-col">
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-ink mb-2 line-clamp-2 leading-tight hover:text-accent transition-colors">
              {product.nameEn}
            </h3>
          </Link>

          <div className="mt-auto pt-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-accent">
                {t('product.currency')} {price.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-sm text-ink-faint line-through">
                  {t('product.currency')} {originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {originalPrice && (
              <div className="text-xs text-success font-medium mt-1">
                {t('product.save')} {t('product.currency')}{' '}
                {(originalPrice - price).toLocaleString()}
              </div>
            )}

            <button
              onClick={() => onAddToCart(product)}
              className="w-full mt-3 py-2.5 rounded-lg font-semibold text-sm text-accent bg-accent-soft border border-accent-border hover:bg-accent hover:text-accent-contrast transition-colors duration-300"
            >
              {t('product.addToCart')}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
