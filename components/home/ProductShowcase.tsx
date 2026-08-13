'use client';

import { Product } from '@/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { useIsMobile } from '@/lib/hooks';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

interface ProductShowcaseProps {
  products: Product[];
  loading: boolean;
  onAddToCart: (product: Product) => void;
  /** Grid columns on desktop (4 for product rows, 3 for wider cards) */
  columns?: 3 | 4;
  categoryName?: string;
  skeletonCount?: number;
}

/**
 * Uniform product presenter used by every home section:
 * skeletons while loading, a Swiper carousel on mobile,
 * and a grid on desktop — all rendering the shared ProductCard.
 */
export function ProductShowcase({
  products,
  loading,
  onAddToCart,
  columns = 4,
  categoryName,
  skeletonCount = 4,
}: ProductShowcaseProps) {
  const isMobile = useIsMobile();

  const gridClass =
    columns === 4
      ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'
      : 'grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6';

  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: skeletonCount }, (_, i) => (
          <div key={i} className="skeleton rounded-2xl h-[300px] md:h-[350px]" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  if (isMobile) {
    return (
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={1.2}
        autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ clickable: true, dynamicBullets: true }}
        breakpoints={{
          480: { slidesPerView: 1.6, spaceBetween: 16 },
          640: { slidesPerView: 2.2, spaceBetween: 20 },
          768: { slidesPerView: 2.6, spaceBetween: 24 },
        }}
        className="!pb-10 px-1"
      >
        {products.map((product, index) => (
          <SwiperSlide key={product.id} className="!h-auto">
            <ProductCard
              product={product}
              index={index}
              onAddToCart={onAddToCart}
              categoryName={categoryName}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  return (
    <div className={gridClass}>
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          onAddToCart={onAddToCart}
          categoryName={categoryName}
        />
      ))}
    </div>
  );
}
