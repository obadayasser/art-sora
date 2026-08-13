'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';
import { clientGetProducts } from '@/lib/client/api';
import { FALLBACK_PRODUCTS } from '@/lib/fallback-data';
import { Section, SectionHeader, SectionFooterLink } from '@/components/ui/Section';
import { ProductShowcase } from './ProductShowcase';

export function BestSellersSection() {
  const t = useTranslations();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const { products: fetched } = await clientGetProducts({
          page: 1,
          limit: 8,
          active: true,
        });
        setProducts(fetched.length > 0 ? fetched.slice(0, 8) : FALLBACK_PRODUCTS.slice(0, 8));
      } catch (error) {
        console.error('Error fetching best sellers:', error);
        setProducts(FALLBACK_PRODUCTS.slice(0, 8));
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <Section tone="base">
      <SectionHeader
        icon={Sparkles}
        badge={t('home.bestSellers.badge')}
        title={t('home.bestSellers.title')}
        description={t('home.bestSellers.description')}
      />
      <ProductShowcase
        products={products}
        loading={loading}
        onAddToCart={addToCart}
        skeletonCount={8}
      />
      <SectionFooterLink href="/products" label={t('home.bestSellers.viewAll')} />
    </Section>
  );
}
