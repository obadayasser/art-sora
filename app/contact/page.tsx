'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, HelpCircle, Headset } from 'lucide-react';
import { Section, SectionHeader } from '@/components/ui/Section';
import Footer from '@/components/home/Footer';

const PHONE_DISPLAY = '+20 121 426 1720';
const PHONE_TEL = '+201214261720';
const WHATSAPP_URL = 'https://wa.me/201214261720';

export default function ContactPage() {
  const t = useTranslations('contact');

  const channels = [
    {
      icon: Phone,
      title: t('callUs'),
      text: PHONE_DISPLAY,
      href: `tel:${PHONE_TEL}`,
      external: false,
    },
    {
      icon: MessageCircle,
      title: t('whatsapp'),
      text: t('whatsappText'),
      href: WHATSAPP_URL,
      external: true,
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-background">
        <Section tone="base">
          <SectionHeader
            icon={Headset}
            badge={t('badge')}
            title={t('title')}
            description={t('description')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {channels.map((channel, index) => (
              <motion.a
                key={channel.title}
                href={channel.href}
                target={channel.external ? '_blank' : undefined}
                rel={channel.external ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="group bg-card border border-line rounded-2xl p-8 text-center hover:border-accent-border hover:shadow-lg transition-all duration-300"
              >
                <div className="inline-flex p-4 rounded-2xl bg-accent-soft text-accent mb-4 group-hover:scale-110 transition-transform">
                  <channel.icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">{channel.title}</h3>
                <p className="text-ink-soft" dir="ltr">
                  {channel.text}
                </p>
              </motion.a>
            ))}
          </div>

          {/* FAQ pointer */}
          <div className="text-center mt-12">
            <p className="text-ink-soft mb-3">{t('faqPrompt')}</p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-accent hover:text-accent-hover font-semibold"
            >
              <HelpCircle className="w-5 h-5" aria-hidden="true" />
              {t('faqLink')}
            </Link>
          </div>
        </Section>
      </div>
      <Footer />
    </>
  );
}
