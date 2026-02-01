"use client";

import { useTranslations } from 'next-intl';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export function CartSidebar() {
  const t = useTranslations();
  const { cartItems, isOpen, setIsOpen, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-[var(--card-bg)] shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[var(--card-border)]">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-[var(--color)]" />
              <h2 className="text-xl font-bold text-[var(--foreground)]">
                {t('cart.title') || 'Shopping Cart'} ({getCartCount()})
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl hover:bg-[var(--card-border)] transition-colors"
            >
              <X className="w-6 h-6 text-[var(--foreground)]" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-24 h-24 text-[var(--color)]/30 mb-4" />
                <p className="text-[var(--foreground)]/60 text-lg mb-4">
                  {t('cart.empty') || 'Your cart is empty'}
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-3 bg-[var(--color)] text-black rounded-xl font-semibold hover:opacity-90 transition-opacity dark:text-white"
                >
                  {t('cart.continueShopping') || 'Continue Shopping'}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={`${item.product.id}-${item.sizeId}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-4 p-4 bg-[var(--background)] rounded-2xl border border-[var(--card-border)]"
                  >
                    <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                      <Image
                        src={item.product.images[0]?.imageUrl || '/placeholder.jpg'}
                        alt={item.product.nameEn}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--foreground)] truncate mb-1">
                        {item.product.nameEn}
                      </h3>
                      <p className="text-sm text-[var(--foreground)]/60 mb-2">
                        {t('cart.sku') || 'SKU'}: {item.product.sku}
                      </p>
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--card-border)] hover:bg-[var(--color)] hover:text-white transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-semibold text-[var(--foreground)] w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--card-border)] hover:bg-[var(--color)] hover:text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-[var(--color)]">
                         LE {((parseFloat(item.product.salePrice || item.product.basePrice) * item.quantity).toFixed(2))}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors text-[var(--foreground)]/60"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-[var(--card-border)] bg-[var(--background)]">
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-[var(--foreground)]/80">
                  <span>{t('cart.subtotal') || 'Subtotal'}</span>
                  <span>LE {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[var(--foreground)]/80">
                  <span>{t('cart.shipping') || 'Shipping'}</span>
                  <span>{t('cart.calculatedAtCheckout') || 'Calculated at checkout'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[var(--foreground)] pt-3 border-t border-[var(--card-border)]">
                  <span>{t('cart.total') || 'Total'}</span>
                  <span className="text-[var(--color)]">LE {getCartTotal().toFixed(2)}</span>
                </div>
              </div>
              <Link
                href="/checkout"
                onClick={() => setIsOpen(false)}
                className="block w-full py-4 bg-gradient-to-r from-[#DA5280] to-[#AAD7F3] text-white rounded-xl font-bold text-center hover:opacity-90 transition-opacity shadow-lg"
              >
                {t('cart.checkout') || 'Checkout'}
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full mt-3 py-3 text-[var(--foreground)] hover:text-[var(--color)] font-medium transition-colors"
              >
                {t('cart.continueShopping') || 'Continue Shopping'}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
