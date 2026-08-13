'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Frame, Award, Truck, ArrowRight, Info } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/Section';
import Footer from '@/components/home/Footer';

export default function AboutPage() {
  const t = useTranslations('about');
  const tCommon = useTranslations();

  const values = [
    { icon: Frame, title: t('craftTitle'), text: t('craftText') },
    { icon: Award, title: t('authenticTitle'), text: t('authenticText') },
    { icon: Truck, title: t('deliveryTitle'), text: t('deliveryText') },
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Intro */}
        <Section tone="base">
          <SectionHeader icon={Info} badge={t('badge')} title={t('title')} description={t('intro')} />
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-ink-soft leading-relaxed text-lg">{t('story')}</p>
          </div>
        </Section>

        {/* Values */}
        <Section tone="band">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="bg-card border border-line rounded-2xl p-8 text-center hover:border-accent-border hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex p-4 rounded-2xl bg-accent-soft text-accent mb-4">
                  <value.icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">{value.title}</h3>
                <p className="text-ink-soft leading-relaxed">{value.text}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <Section tone="base">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-ink mb-4">{t('ctaTitle')}</h2>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-accent-contrast rounded-xl font-bold hover:bg-accent-hover transition-colors"
            >
              {tCommon('hero.browseCta')}
              <ArrowRight className="w-5 h-5 rtl:rotate-180" aria-hidden="true" />
            </Link>
          </div>
        </Section>
      </div>
      <Footer />
    </>
  );
}
