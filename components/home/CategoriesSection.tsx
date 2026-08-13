'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Grid3X3, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Category, Product } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { clientGetCategories, clientGetProducts } from '@/lib/client/api';
import { FALLBACK_CATEGORIES, fallbackProductsByCategory } from '@/lib/fallback-data';
import { Section, SectionHeader, SectionFooterLink } from '@/components/ui/Section';
import { ProductShowcase } from './ProductShowcase';

export function CategoriesSection() {
  const t = useTranslations();
  const locale = useLocale();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

  const categoryName = (category: Category) =>
    locale === 'ar' ? category.nameAr : category.nameEn;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetched = await clientGetCategories(true);
        const usable = fetched.length > 0 ? fetched : FALLBACK_CATEGORIES;
        setCategories(usable);
        setSelectedCategory(usable[0]);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories(FALLBACK_CATEGORIES);
        setSelectedCategory(FALLBACK_CATEGORIES[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;

    // Fallback categories have negative ids and never exist in the API.
    if (selectedCategory.id < 0) {
      setProducts(fallbackProductsByCategory(selectedCategory.id, 4));
      return;
    }

    const fetchCategoryProducts = async () => {
      setProductsLoading(true);
      try {
        const { products: fetched } = await clientGetProducts({
          page: 1,
          limit: 4,
          active: true,
          categoryId: selectedCategory.id,
        });
        setProducts(fetched.slice(0, 4));
      } catch (error) {
        console.error('Error fetching category products:', error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [selectedCategory]);

  return (
    <Section tone="band">
      <SectionHeader
        icon={Grid3X3}
        badge={t('home.categories.badge')}
        title={t('home.categories.title')}
        description={t('home.categories.description')}
      />

      {/* Category tabs */}
      {loading ? (
        <div className="flex gap-3 mb-10 overflow-hidden">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton flex-shrink-0 w-36 h-12 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide" role="tablist">
          {categories.map((category) => {
            const isSelected = selectedCategory?.id === category.id;
            return (
              <button
                key={category.id}
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedCategory(category)}
                className={`flex-shrink-0 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-colors duration-300 ${
                  isSelected
                    ? 'bg-accent text-accent-contrast shadow-md'
                    : 'bg-card text-ink-soft border border-line hover:border-accent-border hover:text-accent'
                }`}
              >
                {categoryName(category)}
              </button>
            );
          })}
        </div>
      )}

      {/* Selected category products */}
      {selectedCategory && (
        <div className="flex items-center justify-between mb-6 px-1">
          <h3 className="text-xl md:text-2xl font-bold text-ink">
            {categoryName(selectedCategory)}
          </h3>
          <Link
            href={`/products?category=${selectedCategory.slug}`}
            className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-medium text-sm md:text-base group"
          >
            {t('home.categories.viewAll')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>
      )}

      <ProductShowcase
        products={products}
        loading={productsLoading}
        onAddToCart={addToCart}
        categoryName={selectedCategory ? categoryName(selectedCategory) : undefined}
        skeletonCount={4}
      />

      <SectionFooterLink href="/categories" label={t('home.categories.browseAll')} />
    </Section>
  );
}
