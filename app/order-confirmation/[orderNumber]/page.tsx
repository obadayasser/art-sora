'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import {
  CheckCircle,
  Package,
  Truck,
  MessageCircle,
  Phone,
  Home,
  ShoppingBag,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { getOrderDetails, type OrderDetail } from '@/lib/client/api-client-orders';

const WHATSAPP_URL = 'https://wa.me/201214261720';
const PHONE_URL = 'tel:+201214261720';
const DISPLAY_NUMBER = '+20 121 426 1720';

export default function OrderConfirmationPage() {
  const t = useTranslations('orderConfirmation');
  const tCheckout = useTranslations('checkout');
  const tProduct = useTranslations('product');
  const tFooter = useTranslations('footer');
  const locale = useLocale();

  const params = useParams<{ orderNumber: string }>();
  const orderNumber = params?.orderNumber;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchOrder = async () => {
      if (!orderNumber) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getOrderDetails(orderNumber);
        if (!cancelled) {
          setOrder(data ?? null);
        }
      } catch (error) {
        console.error('Failed to fetch order details:', error);
        if (!cancelled) {
          setOrder(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchOrder();

    return () => {
      cancelled = true;
    };
  }, [orderNumber]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-center text-ink-soft mb-8">{t('loading')}</p>
          <div className="space-y-6">
            <div className="skeleton h-40 rounded-2xl" />
            <div className="skeleton h-64 rounded-2xl" />
            <div className="skeleton h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-md"
        >
          <div className="inline-flex p-6 rounded-3xl bg-danger/10 text-danger mb-6">
            <AlertCircle className="w-12 h-12" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-ink mb-6">{t('notFound')}</h1>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-contrast rounded-xl font-semibold hover:bg-accent-hover transition-colors"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            {t('backHome')}
          </Link>
        </motion.div>
      </div>
    );
  }

  const items = Array.isArray(order.items) ? order.items : [];
  const discountValue = parseFloat(order.discountAmount || '0');

  const steps = [
    { icon: Package, label: t('step1') },
    { icon: Truck, label: t('step2') },
    { icon: CheckCircle, label: t('step3') }
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 text-success mb-6">
            <CheckCircle className="w-10 h-10" aria-hidden="true" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-3">{t('title')}</h1>
          <p className="text-ink-soft leading-relaxed max-w-xl mx-auto">{t('thankYou')}</p>
        </motion.div>

        {/* Order details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-card border border-line rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-line">
            <div>
              <p className="text-sm text-ink-faint mb-1">{t('orderNumberLabel')}</p>
              <p className="text-lg font-bold text-ink" dir="ltr">
                {order.orderNumber}
              </p>
            </div>
            {order.status && (
              <div>
                <p className="text-sm text-ink-faint mb-1">{t('statusLabel')}</p>
                <span className="inline-flex px-3 py-1 rounded-full bg-accent-soft text-accent text-sm font-semibold">
                  {order.status}
                </span>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <ul className="py-6 border-b border-line space-y-4">
              {items.map((item, index) => (
                <li key={index} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-ink text-sm">
                      {locale === 'ar' ? item.productNameAr : item.productNameEn}
                    </p>
                    <p className="text-sm text-ink-soft">
                      {item.sizeName ? `${item.sizeName} · ` : ''}
                      {tProduct('quantity')}: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-ink whitespace-nowrap">
                    {tProduct('currency')} {(parseFloat(item.unitPrice) * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <div className="pt-6 space-y-2 text-sm">
            <div className="flex justify-between text-ink-soft">
              <span>{tCheckout('subtotal')}</span>
              <span>
                {tProduct('currency')} {order.subtotal}
              </span>
            </div>
            {discountValue > 0 && (
              <div className="flex justify-between text-success">
                <span>{tCheckout('discount')}</span>
                <span>
                  -{tProduct('currency')} {order.discountAmount}
                </span>
              </div>
            )}
            <div className="flex justify-between text-ink-soft">
              <span>{tCheckout('shipping')}</span>
              <span>
                {tProduct('currency')} {order.shippingCost}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-ink pt-3 border-t border-line">
              <span>{tCheckout('total')}</span>
              <span className="text-accent">
                {tProduct('currency')} {order.totalAmount}
              </span>
            </div>
          </div>
        </motion.div>

        {/* What's next */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-card border border-line rounded-2xl shadow-lg p-6 mb-6"
        >
          <h2 className="text-xl font-bold text-ink mb-6 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-accent" aria-hidden="true" />
            {t('whatsNextTitle')}
          </h2>
          <ol className="space-y-4">
            {steps.map(({ icon: Icon, label }, index) => (
              <li key={index} className="flex items-center gap-4 p-4 bg-section rounded-xl">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-soft text-accent flex items-center justify-center">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <p className="text-ink">{label}</p>
              </li>
            ))}
          </ol>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-card border border-line rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-bold text-ink mb-6">{t('contactUs')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-xl border border-line bg-section hover:border-accent-border hover:bg-accent-soft transition-colors"
            >
              <span className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-soft text-accent flex items-center justify-center">
                <MessageCircle className="w-6 h-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold text-ink">{tFooter('whatsapp')}</span>
                <span className="block text-sm text-ink-soft" dir="ltr">
                  {DISPLAY_NUMBER}
                </span>
              </span>
            </a>
            <a
              href={PHONE_URL}
              className="flex items-center gap-4 p-4 rounded-xl border border-line bg-section hover:border-accent-border hover:bg-accent-soft transition-colors"
            >
              <span className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-soft text-accent flex items-center justify-center">
                <Phone className="w-6 h-6" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold text-ink">{tFooter('phone')}</span>
                <span className="block text-sm text-ink-soft" dir="ltr">
                  {DISPLAY_NUMBER}
                </span>
              </span>
            </a>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-contrast rounded-xl font-semibold hover:bg-accent-hover transition-colors"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            {t('backHome')}
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-accent bg-accent-soft border border-accent-border hover:bg-accent hover:text-accent-contrast transition-colors"
          >
            <ShoppingBag className="w-5 h-5" aria-hidden="true" />
            {t('viewProducts')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
