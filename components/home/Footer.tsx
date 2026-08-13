'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Phone, MessageCircle } from 'lucide-react';

const PHONE_DISPLAY = '+20 121 426 1720';
const PHONE_TEL = '+201214261720';
const WHATSAPP_URL = 'https://wa.me/201214261720';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();

  const quickLinks = [
    { href: '/', label: t('home') },
    { href: '/products', label: t('products') },
    { href: '/categories', label: t('categories') },
  ];

  const supportLinks = [
    { href: '/about', label: t('about') },
    { href: '/contact', label: t('contact') },
    { href: '/faq', label: t('faq') },
  ];

  return (
    <footer className="bg-stage text-stage-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="ArtSora logo"
                width={90}
                height={50}
                className="rounded-xl"
              />
            </Link>
            <p className="text-stage-ink/70 leading-relaxed max-w-md">{t('blurb')}</p>
          </div>

          {/* Quick links */}
          <nav aria-label={t('quickLinks')}>
            <h3 className="font-bold text-gold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stage-ink/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Support + contact */}
          <div>
            <h3 className="font-bold text-gold mb-4">{t('contactUs')}</h3>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-stage-ink/70 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={`tel:${PHONE_TEL}`}
                  className="inline-flex items-center gap-2 text-stage-ink/70 hover:text-gold transition-colors"
                  dir="ltr"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  {PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-stage-ink/70 hover:text-gold transition-colors"
                >
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  {t('whatsapp')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-stage-ink/10 text-center text-sm text-stage-ink/50">
          © {year} ArtSora. {t('allRights')}.
        </div>
      </div>
    </footer>
  );
}
