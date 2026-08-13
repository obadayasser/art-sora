import { Category, Product } from '@/types';

/**
 * Demo fallback content
 * ---------------------
 * The storefront is API-driven; when the backend has no data for a
 * section (or is unreachable), these organized placeholders keep every
 * section populated instead of rendering empty bands.
 *
 * Conventions:
 *  - All fallback ids are NEGATIVE so they can never collide with real
 *    database rows.
 *  - Images come from /public/img so the demo works fully offline.
 *  - Every entity is bilingual (EN/AR) like the real API payloads.
 *
 * Sections use them via `products.length ? products : fallback`.
 */

const now = '2026-01-01T00:00:00.000Z';

export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: -1,
    nameEn: 'Football Legends',
    nameAr: 'أساطير كرة القدم',
    slug: 'football-legends',
    descriptionEn: 'Iconic moments from the greatest players in history.',
    descriptionAr: 'لحظات أيقونية لأعظم اللاعبين في التاريخ.',
    isActive: true,
    sortOrder: 1,
    createdAt: now,
  },
  {
    id: -2,
    nameEn: 'Music Icons',
    nameAr: 'أيقونات الموسيقى',
    slug: 'music-icons',
    descriptionEn: 'Framed portraits of the voices that defined generations.',
    descriptionAr: 'بورتريهات مؤطرة للأصوات التي شكّلت أجيالاً.',
    isActive: true,
    sortOrder: 2,
    createdAt: now,
  },
  {
    id: -3,
    nameEn: 'TV & Series',
    nameAr: 'مسلسلات وأفلام',
    slug: 'tv-series',
    descriptionEn: 'Scenes and characters from unforgettable stories.',
    descriptionAr: 'مشاهد وشخصيات من قصص لا تُنسى.',
    isActive: true,
    sortOrder: 3,
    createdAt: now,
  },
  {
    id: -4,
    nameEn: 'Timeless Art',
    nameAr: 'فن خالد',
    slug: 'timeless-art',
    descriptionEn: 'Classic artwork reimagined in premium golden frames.',
    descriptionAr: 'أعمال فنية كلاسيكية بإطارات ذهبية فاخرة.',
    isActive: true,
    sortOrder: 4,
    createdAt: now,
  },
];

interface FallbackProductSeed {
  id: number;
  nameEn: string;
  nameAr: string;
  slug: string;
  image: string;
  basePrice: string;
  salePrice?: string;
  categoryId: number;
  isFeatured?: boolean;
}

function makeProduct(seed: FallbackProductSeed): Product {
  return {
    id: seed.id,
    sku: `DEMO-${Math.abs(seed.id).toString().padStart(4, '0')}`,
    nameEn: seed.nameEn,
    nameAr: seed.nameAr,
    slug: seed.slug,
    descriptionEn:
      'Museum-grade print in a hand-finished golden frame. Ships ready to hang, with a certificate of authenticity.',
    descriptionAr:
      'طباعة بجودة المتاحف داخل إطار ذهبي مُشطب يدوياً. تصل جاهزة للتعليق مع شهادة أصالة.',
    basePrice: seed.basePrice,
    salePrice: seed.salePrice,
    stockQuantity: 25,
    isActive: true,
    categoryId: seed.categoryId,
    category: FALLBACK_CATEGORIES.find((c) => c.id === seed.categoryId),
    images: [
      {
        id: seed.id,
        imageUrl: seed.image,
        thumbnailUrl: seed.image,
        isPrimary: true,
        sortOrder: 1,
      },
    ],
    createdAt: now,
    isFeatured: seed.isFeatured ?? false,
  };
}

export const FALLBACK_PRODUCTS: Product[] = [
  // Football Legends
  makeProduct({ id: -101, nameEn: 'The Number 10 — Golden Era', nameAr: 'رقم ١٠ — العصر الذهبي', slug: 'demo-number-10-golden-era', image: '/img/1.jpeg', basePrice: '1450', salePrice: '1150', categoryId: -1, isFeatured: true }),
  makeProduct({ id: -102, nameEn: 'Champions Night Print', nameAr: 'ليلة الأبطال', slug: 'demo-champions-night', image: '/img/2.jpeg', basePrice: '1250', categoryId: -1 }),
  makeProduct({ id: -103, nameEn: 'The Last Dance Tribute', nameAr: 'تحية الرقصة الأخيرة', slug: 'demo-last-dance-tribute', image: '/img/3.jpeg', basePrice: '1650', salePrice: '1390', categoryId: -1, isFeatured: true }),
  makeProduct({ id: -104, nameEn: 'Golden Boot Moment', nameAr: 'لحظة الحذاء الذهبي', slug: 'demo-golden-boot-moment', image: '/img/4.jpeg', basePrice: '990', categoryId: -1 }),

  // Music Icons
  makeProduct({ id: -105, nameEn: 'Voice of a Generation', nameAr: 'صوت جيل كامل', slug: 'demo-voice-of-a-generation', image: '/img/5.jpeg', basePrice: '1350', salePrice: '1080', categoryId: -2, isFeatured: true }),
  makeProduct({ id: -106, nameEn: 'Stage Lights Portrait', nameAr: 'بورتريه أضواء المسرح', slug: 'demo-stage-lights-portrait', image: '/img/6.jpeg', basePrice: '1150', categoryId: -2 }),
  makeProduct({ id: -107, nameEn: 'Vinyl Days — Classic Frame', nameAr: 'أيام الفينيل — إطار كلاسيكي', slug: 'demo-vinyl-days-classic', image: '/img/7.jpeg', basePrice: '890', categoryId: -2 }),

  // TV & Series
  makeProduct({ id: -108, nameEn: 'Iconic Scene Collection', nameAr: 'مجموعة المشاهد الأيقونية', slug: 'demo-iconic-scene-collection', image: '/img/8.jpeg', basePrice: '1200', salePrice: '960', categoryId: -3, isFeatured: true }),
  makeProduct({ id: -109, nameEn: 'The Finale — Limited Print', nameAr: 'الحلقة الأخيرة — نسخة محدودة', slug: 'demo-the-finale-limited', image: '/img/12.jpeg', basePrice: '1550', categoryId: -3 }),
  makeProduct({ id: -110, nameEn: 'Antihero Portrait', nameAr: 'بورتريه البطل المضاد', slug: 'demo-antihero-portrait', image: '/img/framex_5.webp', basePrice: '1050', categoryId: -3 }),

  // Timeless Art
  makeProduct({ id: -111, nameEn: 'Gilded Classic No. I', nameAr: 'الكلاسيكية المذهّبة ١', slug: 'demo-gilded-classic-1', image: '/img/framex_8.webp', basePrice: '1750', salePrice: '1400', categoryId: -4, isFeatured: true }),
  makeProduct({ id: -112, nameEn: 'Gilded Classic No. II', nameAr: 'الكلاسيكية المذهّبة ٢', slug: 'demo-gilded-classic-2', image: '/img/frame_16.webp', basePrice: '1750', categoryId: -4 }),
];

/** Products for one fallback category. */
export function fallbackProductsByCategory(categoryId: number, limit?: number): Product[] {
  const items = FALLBACK_PRODUCTS.filter((p) => p.categoryId === categoryId);
  return limit ? items.slice(0, limit) : items;
}

/** Featured subset used by the featured/best-seller sections. */
export function fallbackFeaturedProducts(limit = 8): Product[] {
  return FALLBACK_PRODUCTS.filter((p) => p.isFeatured).slice(0, limit);
}

/** Newest-first subset used by the new-arrivals section. */
export function fallbackNewArrivals(limit = 8): Product[] {
  return [...FALLBACK_PRODUCTS].reverse().slice(0, limit);
}

/** Slug lookup so /products/[slug] can resolve demo cards too. */
export function findFallbackProduct(slug: string): Product | undefined {
  return FALLBACK_PRODUCTS.find((p) => p.slug === slug);
}
