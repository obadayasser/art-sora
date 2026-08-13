'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ShoppingBag, Compass } from 'lucide-react';

// The Three.js scene is heavy — load it client-side only, after paint.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

export function Hero() {
  const t = useTranslations();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[80vh] overflow-hidden bg-stage text-stage-ink"
    >
      {/* Soft golden vignette over the stage */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.12)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stage/30 to-stage" />
      </div>

      {/* 3D floating frames */}
      <div className="absolute inset-0">
        <HeroScene />
      </div>

      {/* Copy + CTAs */}
      <motion.div style={{ y, opacity, scale }} className="relative z-10 px-4 pb-12 pt-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-7xl font-black mb-3 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-stage-ink to-gold">
                {t('hero.title')}
              </span>
            </h1>
            <p className="text-lg md:text-2xl font-bold text-stage-ink/95 tracking-wide">
              {t('hero.tagline')}
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base md:text-lg text-stage-ink/80 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            {t('hero.description')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-6"
          >
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-stage rounded-xl font-bold text-lg shadow-2xl hover:shadow-gold/40 hover:scale-[1.04] active:scale-95 transition-all duration-300"
            >
              <ShoppingBag className="w-5 h-5" aria-hidden="true" />
              {t('hero.browseCta')}
            </Link>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-lg border border-stage-ink/30 text-stage-ink hover:bg-stage-ink/10 hover:scale-[1.04] active:scale-95 transition-all duration-300 backdrop-blur-sm"
            >
              <Compass className="w-5 h-5" aria-hidden="true" />
              {t('hero.categoriesCta')}
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center"
        >
          <div className="w-5 h-8 border border-gold/40 rounded-full flex justify-center pt-1.5">
            <div className="w-1 h-2 bg-gradient-to-b from-gold to-transparent rounded-full" />
          </div>
          <span className="text-xs text-stage-ink/40 mt-1">{t('hero.scroll')}</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
