'use client';

import {
  CheckCircle,
  Clock,
  Phone,
  Mail,
  ArrowLeft,
  Home,
  ShoppingBag,
  Truck,
  MessageCircle,
  MapPin,
  ShieldCheck,
  Package
} from 'lucide-react';

export default function OrderConfirmationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center text-gray-900 dark:text-white hover:opacity-80 transition-opacity">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="font-semibold">Home / الرئيسية</span>
            </a>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Order Confirmation
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center sm:text-right">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                تم استلام طلبك بنجاح! 🎉
              </h1>
              <p className="text-green-100 text-lg">
                Thank you for your order! We're processing it now.
              </p>
            </div>
          </div>
        </div>

        {/* Status Steps */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Clock className="w-6 h-6 mr-3 text-blue-600 dark:text-blue-400" />
            حالة الطلب / Order Status
          </h2>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  تم استلام الطلب
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Order Received
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  جاري مراجعة الطلب
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Reviewing Your Order
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  جاري تجهيز المنتجات
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Preparing Products
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  الشحن والتوصيل
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Shipping & Delivery
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Package className="w-6 h-6 mr-3 text-purple-600 dark:text-purple-400" />
            ماذا بعد؟ / What's Next?
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  سنراجع طلبك خلال 24 ساعة
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We'll review your order within 24 hours
                </p>
              </div>
            </div>
 

            <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  سيتم شحن طلبك بعد التأكيد
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Order will be shipped after confirmation
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  ستحصل على رقم التتبع
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  You'll receive tracking number via WhatsApp/Email
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <MessageCircle className="w-6 h-6 mr-3 text-green-600 dark:text-green-400" />
            تواصل معنا / Contact Us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* WhatsApp */}
            <a
              href="https://wa.me/201214261720"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center p-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:opacity-90 transition-all shadow-lg group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4 text-white">
                <h3 className="font-bold text-lg mb-1">WhatsApp</h3>
                <p className="text-green-100 text-sm">+20 109 351 8834</p>
                <p className="text-green-100 text-xs mt-1">
                  تواصل معنا الآن
                </p>
              </div>
            </a>

            {/* Phone */}
            <a
              href="tel:+201214261720"
              className="flex items-center p-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl hover:opacity-90 transition-all shadow-lg group"
            >
              <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Phone className="w-8 h-8 text-white" />
              </div>
              <div className="ml-4 text-white">
                <h3 className="font-bold text-lg mb-1">Phone / هاتف</h3>
                <p className="text-blue-100 text-sm" dir="ltr">+20 109 351 8834</p>
                <p className="text-blue-100 text-xs mt-1">
                  اتصل بنا
                </p>
              </div>
            </a>
          </div>
        </div>

   

 

        {/* Back to Home */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg text-lg"
          >
            <Home className="w-6 h-6 mr-3" />
            <span>
              العودة للرئيسية / Back to Home
            </span>
          </a>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 mb-2">
            شكراً لتسوقك معنا! 🛍️
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            Thank you for shopping with us!
          </p>
        </div>
      </div>
    </div>
  );
}
