'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, Frame } from 'lucide-react';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="min-h-[80vh] bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <div className="inline-flex p-6 rounded-3xl bg-accent-soft text-accent mb-6">
          <Frame className="w-14 h-14" strokeWidth={1.4} aria-hidden="true" />
        </div>
        <p className="text-6xl font-black text-accent mb-4">404</p>
        <h1 className="text-2xl md:text-3xl font-bold text-ink mb-3">{t('title')}</h1>
        <p className="text-ink-soft mb-8 leading-relaxed">{t('description')}</p>

        <div className="flex flex-wrap justify-center gap-3">
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
            {t('browseProducts')}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
