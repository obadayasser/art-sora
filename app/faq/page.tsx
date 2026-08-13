'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/Section';
import Footer from '@/components/home/Footer';

const FAQ_COUNT = 6;

export default function FaqPage() {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    question: t(`q${i + 1}`),
    answer: t(`a${i + 1}`),
  }));

  return (
    <>
      <div className="min-h-screen bg-background">
        <Section tone="base">
          <SectionHeader
            icon={HelpCircle}
            badge={t('badge')}
            title={t('title')}
            description={t('description')}
          />

          <div className="max-w-3xl mx-auto space-y-3">
            {items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-card border border-line rounded-2xl overflow-hidden transition-colors hover:border-accent-border"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 p-5 text-start"
                  >
                    <span className="font-semibold text-ink">{item.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-accent flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <p className="px-5 pb-5 text-ink-soft leading-relaxed">{item.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Section>
      </div>
      <Footer />
    </>
  );
}
