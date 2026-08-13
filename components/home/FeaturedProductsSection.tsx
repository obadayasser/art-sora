'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Product } from '@/types';
import { clientGetProducts } from '@/lib/client/api';
import { fallbackFeaturedProducts } from '@/lib/fallback-data';
import { Section, SectionHeader, SectionFooterLink } from '@/components/ui/Section';
import { ProductShowcase } from './ProductShowcase';

export function FeaturedProductsSection() {
  const t = useTranslations();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { products: fetched } = await clientGetProducts({
          page: 1,
          limit: 12,
          active: true,
        });
        // Prefer explicitly featured products; fall back to discounted ones.
        const featured = fetched.filter((p) => p.isFeatured);
        const discounted = fetched.filter((p) => p.salePrice);
        const picked = featured.length > 0 ? featured : discounted;
        setProducts(picked.length > 0 ? picked.slice(0, 8) : fallbackFeaturedProducts(8));
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setProducts(fallbackFeaturedProducts(8));
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <Section tone="band">
      <SectionHeader
        icon={Star}
        badge={t('home.featured.badge')}
        title={t('home.featured.title')}
        description={t('home.featured.description')}
      />
      <ProductShowcase
        products={products}
        loading={loading}
        onAddToCart={addToCart}
        skeletonCount={4}
      />
      <SectionFooterLink href="/products" label={t('home.featured.viewAll')} />
    </Section>
  );
}
