import { Phone, Facebook, Instagram, Twitter } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const phoneNumber = '01093518834';
  const whatsappNumber = '01093518834';

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">{t('contactUs')}</h3>
            <div className="flex items-center gap-3">
              <Phone size={20} />
              <a href={`tel:${phoneNumber}`} className="hover:text-blue-400 transition-colors">
                {t('phone')}: {phoneNumber}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={20} />
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-green-400 transition-colors"
              >
                {t('whatsapp')}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">{t('quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-blue-400 transition-colors">
                  {t('home')}
                </a>
              </li>
              <li>
                <a href="/products" className="hover:text-blue-400 transition-colors">
                  {t('products')}
                </a>
              </li>
              <li>
                <a href="/categories" className="hover:text-blue-400 transition-colors">
                  {t('categories')}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4">{t('followUs')}</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 transition-colors"
              >
                <Facebook size={24} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-pink-600 transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href="#"
                className="p-2 bg-gray-800 rounded-full hover:bg-sky-500 transition-colors"
              >
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} {t('allRights')}</p>
        </div>
      </div>
    </footer>
  );
}
