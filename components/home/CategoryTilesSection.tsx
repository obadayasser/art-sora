'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Compass, ArrowRight } from 'lucide-react';
import { Category } from '@/types';
import { clientGetCategories } from '@/lib/client/api';
import { FALLBACK_CATEGORIES } from '@/lib/fallback-data';
import { Section, SectionHeader } from '@/components/ui/Section';

/**
 * Typographic category tiles — a navigation section linking each
 * category to its filtered product listing.
 */
export function CategoryTilesSection() {
  const t = useTranslations();
  const locale = useLocale();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetched = await clientGetCategories(true);
        setCategories(fetched.length > 0 ? fetched.slice(0, 8) : FALLBACK_CATEGORIES);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(FALLBACK_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Section tone="base">
      <SectionHeader
        icon={Compass}
        badge={t('home.categoryTiles.badge')}
        title={t('home.categoryTiles.title')}
        description={t('home.categoryTiles.description')}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="skeleton rounded-2xl h-40" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
            >
              <Link
                href={`/products?category=${category.slug}`}
                className="group relative flex flex-col justify-between h-40 p-6 rounded-2xl bg-card border border-line hover:border-accent-border hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Gold corner glow on hover */}
                <div className="absolute -top-10 -end-10 w-32 h-32 rounded-full bg-accent-soft opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />

                <div>
                  <h3 className="text-lg font-bold text-ink group-hover:text-accent transition-colors">
                    {locale === 'ar' ? category.nameAr : category.nameEn}
                  </h3>
                  {(category.descriptionEn || category.descriptionAr) && (
                    <p className="text-sm text-ink-soft mt-1 line-clamp-2">
                      {locale === 'ar' ? category.descriptionAr : category.descriptionEn}
                    </p>
                  )}
                </div>

                <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  {t('home.categoryTiles.shopNow')}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </Section>
  );
}
