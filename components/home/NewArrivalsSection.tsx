'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Clock } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';
import { clientGetProducts } from '@/lib/client/api';
import { fallbackNewArrivals } from '@/lib/fallback-data';
import { Section, SectionHeader, SectionFooterLink } from '@/components/ui/Section';
import { ProductShowcase } from './ProductShowcase';

export function NewArrivalsSection() {
  const t = useTranslations();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const { products: fetched } = await clientGetProducts({
          page: 1,
          limit: 8,
          active: true,
        });
        // Newest first by creation date.
        const newest = [...fetched].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
        setProducts(newest.length > 0 ? newest.slice(0, 8) : fallbackNewArrivals(8));
      } catch (error) {
        console.error('Error fetching new arrivals:', error);
        setProducts(fallbackNewArrivals(8));
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  return (
    <Section tone="base">
      <SectionHeader
        icon={Clock}
        badge={t('home.newArrivals.badge')}
        title={t('home.newArrivals.title')}
        description={t('home.newArrivals.description')}
      />
      <ProductShowcase
        products={products}
        loading={loading}
        onAddToCart={addToCart}
        skeletonCount={8}
      />
      <SectionFooterLink href="/products?sort=newest" label={t('home.newArrivals.viewAll')} />
    </Section>
  );
}
