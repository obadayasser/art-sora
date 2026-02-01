"use client";

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowRight, Layers, Palette, Frame, Gem, BookOpen, Brush, Image, Box } from 'lucide-react';
import Link from 'next/link';

export function MoreCategoriesSection() {
  const t = useTranslations();

  // Extended categories with icons
  const categories = [
    {
      id: 1,
      nameAr: 'إطارات كلاسيكية',
      nameEn: 'Classic Frames',
      slug: 'classic-frames',
      icon: Frame,
      color: 'from-amber-500 to-orange-500',
      count: 48,
      image: '/img/player1.webp'
    },
    {
      id: 2,
      nameAr: 'لوحات فنية',
      nameEn: 'Art Paintings',
      slug: 'art-paintings',
      icon: Palette,
      color: 'from-purple-500 to-pink-500',
      count: 36,
      image: '/img/frame_47.webp'
    },
    {
      id: 3,
      nameAr: 'إطارات فاخرة',
      nameEn: 'Luxury Frames',
      slug: 'luxury-frames',
      icon: Gem,
      color: 'from-yellow-500 to-amber-500',
      count: 24,
      image: '/img/frame_1c1dbc24-918f-419e-beac-6f2f8e98f561.webp'
    },
    {
      id: 4,
      nameAr: 'إطارات حديثة',
      nameEn: 'Modern Frames',
      slug: 'modern-frames',
      icon: Layers,
      color: 'from-blue-500 to-cyan-500',
      count: 52,
      image: '/img/frame_39_004f4584-e849-45e8-96a3-42095e70fd06.webp'
    },
    {
      id: 5,
      nameAr: 'إطارات خشبية',
      nameEn: 'Wooden Frames',
      slug: 'wooden-frames',
      icon: Box,
      color: 'from-green-500 to-emerald-500',
      count: 68,
      image: '/img/frame_32_585e7ebd-cb9b-446f-bd2e-8dd47f392570.webp'
    },
    {
      id: 6,
      nameAr: 'إطارات معدنية',
      nameEn: 'Metal Frames',
      slug: 'metal-frames',
      icon: Frame,
      color: 'from-slate-500 to-gray-500',
      count: 41,
      image: '/img/player1.jpg'
    },
    {
      id: 7,
      nameAr: 'لوحات زيتية',
      nameEn: 'Oil Paintings',
      slug: 'oil-paintings',
      icon: Brush,
      color: 'from-red-500 to-rose-500',
      count: 29,
      image: '/img/39_20.webp'
    },
    {
      id: 8,
      nameAr: 'ملحقات فنية',
      nameEn: 'Art Accessories',
      slug: 'art-accessories',
      icon: BookOpen,
      color: 'from-indigo-500 to-violet-500',
      count: 73,
      image: '/img/framex_5.webp'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full mb-4">
            <Layers className="w-5 h-5 text-indigo-500" />
            <span className="text-sm font-semibold text-indigo-500">
              {t('home.moreCategories.badge') || 'اكتشف المزيد'}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] mb-4">
            {t('home.moreCategories.title') || 'فئات متنوعة لكل الأذواق'}
          </h2>
          <p className="text-lg text-[var(--foreground)]/60 max-w-2xl mx-auto">
            {t('home.moreCategories.description') || 'تصفح مجموعتنا الواسعة من الفئات المختلفة لتجد ما يناسب ذوقك'}
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                className="group"
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="block"
                >
                  <div className="relative bg-[var(--card-bg)] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[var(--card-border)]">
                    {/* Image */}
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.nameAr}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Gradient Overlay */}
                      <div className={`absolute inset-0 bg-gradient-to-t ${category.color} opacity-0 group-hover:opacity-40 transition-opacity duration-300`} />

                      {/* Icon Badge */}
                      <div className={`absolute top-4 right-4 p-3 bg-gradient-to-r ${category.color} rounded-xl shadow-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>

                      {/* Items Count Badge */}
                      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {category.count} {t('home.moreCategories.items') || 'منتج'}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 relative">
                      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color}`} />
                      <h3 className="font-bold text-[var(--foreground)] text-lg mb-2 group-hover:text-[var(--color)] transition-colors">
                        {category.nameAr}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[var(--foreground)]/60">
                          {category.nameEn}
                        </span>
                        <ArrowRight className={`w-5 h-5 text-[var(--foreground)]/60 group-hover:text-[var(--color)] transition-colors transform group-hover:-translate-y-1 group-hover:translate-x-1`} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* View All Categories Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-bold hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
          >
            {t('home.moreCategories.viewAllCategories') || 'View all products'}
            <Layers className="w-5 h-5" />
          </Link>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { icon: Image, label: t('home.moreCategories.products') || 'إجمالي المنتجات', value: '500+' },
            { icon: Layers, label: t('home.moreCategories.categories') || 'الفئات المتاحة', value: '20+' },
            { icon: Gem, label: t('home.moreCategories.brands') || 'العلامات التجارية', value: '15+' },
            { icon: Palette, label: t('home.moreCategories.customers') || 'العملاء السعداء', value: '10K+' }
          ].map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div
                key={index}
                className="bg-[var(--card-bg)] rounded-2xl p-6 text-center border border-[var(--card-border)]"
              >
                <StatIcon className="w-8 h-8 text-[var(--color)] mx-auto mb-3" />
                <div className="text-3xl font-bold text-[var(--foreground)] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--foreground)]/60">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
