'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useTranslations, useLocale } from 'next-intl';
import {
  ShoppingCart,
  CreditCard,
  Truck,
  Lock,
  Check,
  X,
  ArrowRight,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import {
  getCountries,
  getGovernorates,
  getShippingDetails,
  validateDiscountCode,
  createOrder
} from '@/lib/client/api-client-orders';
import type { Country, Governorate } from '@/types';

interface FormData {
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  countryId: number | null;
  governorateId: number | null;
  city: string;
  addressLine1: string;
  addressLine2: string;
  paymentMethod: 'CASH' | 'VODAFONE_CASH' | 'INSTAPAY';
  discountCode: string;
}

interface DiscountData {
  isValid: boolean;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: string;
  discountAmount: string;
  message: string;
}

const inputBase = 'w-full px-4 py-3 rounded-xl border-2 transition-colors text-ink';
const inputNormal =
  'border-line bg-section focus:border-accent focus:ring-2 focus:ring-accent/20';
const inputError = 'border-danger bg-danger/10';

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const tProduct = useTranslations('product');
  const locale = useLocale();
  const router = useRouter();
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();

  const [isLoading, setIsLoading] = useState(false);

  const [countries, setCountries] = useState<Country[]>([]);
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    customerEmail: '',
    customerName: '',
    customerPhone: '',
    countryId: null,
    governorateId: null,
    city: '',
    addressLine1: '',
    addressLine2: '',
    paymentMethod: 'CASH',
    discountCode: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [discount, setDiscount] = useState<DiscountData | null>(null);
  const [isLoadingDiscount, setIsLoadingDiscount] = useState(false);
  const [shippingCost, setShippingCost] = useState<string>('0.00');
  const [estimatedDays, setEstimatedDays] = useState<number>(0);

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch governorates when country changes
  useEffect(() => {
    if (formData.countryId) {
      fetchGovernorates(formData.countryId);
    } else {
      setGovernorates([]);
      setFormData(prev => ({ ...prev, governorateId: null }));
    }
  }, [formData.countryId]);

  // Calculate shipping when governorate changes
  useEffect(() => {
    if (formData.countryId && formData.governorateId) {
      fetchShippingDetails();
    }
  }, [formData.countryId, formData.governorateId]);

  const fetchCountries = async () => {
    try {
      setIsLoadingLocations(true);
      const data = await getCountries();
      setCountries(data);
      // Set default country to Egypt if available
      const egypt = data.find(c => c.code === 'EG');
      if (egypt) {
        setFormData(prev => ({ ...prev, countryId: egypt.id }));
      }
    } catch (error) {
      toast.error('Failed to load countries');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const fetchGovernorates = async (countryId: number) => {
    try {
      setIsLoadingLocations(true);
      const data = await getGovernorates(countryId);
      setGovernorates(data);
    } catch (error) {
      toast.error('Failed to load governorates');
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const fetchShippingDetails = async () => {
    if (!formData.countryId || !formData.governorateId) return;

    try {
      const details = await getShippingDetails(formData.countryId, formData.governorateId);
      setShippingCost(details.shippingCost);
      setEstimatedDays(details.estimatedDays);
    } catch (error) {
      console.error('Failed to fetch shipping details:', error);
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.customerEmail) {
      newErrors.customerEmail = t('requiredField');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = t('invalidEmail');
    }

    if (!formData.customerName) {
      newErrors.customerName = t('requiredField');
    } else if (formData.customerName.length < 3) {
      newErrors.customerName = t('requiredField');
    }

    if (!formData.customerPhone) {
      newErrors.customerPhone = t('requiredField');
    } else if (!/^\+?\d{10,15}$/.test(formData.customerPhone.replace(/\s/g, ''))) {
      newErrors.customerPhone = t('invalidPhone');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.countryId) {
      newErrors.countryId = t('requiredField');
    }

    if (!formData.governorateId) {
      newErrors.governorateId = t('requiredField');
    }

    if (!formData.city) {
      newErrors.city = t('requiredField');
    } else if (formData.city.length < 2) {
      newErrors.city = t('requiredField');
    }

    if (!formData.addressLine1) {
      newErrors.addressLine1 = t('requiredField');
    } else if (formData.addressLine1.length < 5) {
      newErrors.addressLine1 = t('requiredField');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const applyDiscount = async () => {
    if (!formData.discountCode || formData.discountCode.length === 0) {
      toast.error(t('requiredField'));
      return;
    }

    try {
      setIsLoadingDiscount(true);
      const result = await validateDiscountCode(formData.discountCode, getCartTotal());

      if (result.isValid) {
        setDiscount(result);
        toast.success(t('discountApplied'));
      } else {
        setDiscount(null);
        toast.error(t('discountInvalid'));
      }
    } catch (error: any) {
      setDiscount(null);
      toast.error(t('discountInvalid'));
    } finally {
      setIsLoadingDiscount(false);
    }
  };

  const removeDiscount = () => {
    setDiscount(null);
    setFormData(prev => ({ ...prev, discountCode: '' }));
    toast.success('Discount code removed');
  };

  const calculateSubtotal = (): number => {
    return getCartTotal();
  };

  const calculateDiscountAmount = (): number => {
    if (!discount || !discount.isValid) return 0;
    return parseFloat(discount.discountAmount);
  };

  const calculateTotal = (): number => {
    const subtotal = calculateSubtotal();
    const discountAmount = calculateDiscountAmount();
    const shipping = parseFloat(shippingCost);
    return subtotal - discountAmount + shipping;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep1() || !validateStep2()) {
      toast.error(t('requiredField'));
      return;
    }

    try {
      setIsLoading(true);

      const orderData = {
        customerEmail: formData.customerEmail,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        countryId: formData.countryId!,
        governorateId: formData.governorateId!,
        city: formData.city,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2 || undefined,
        items: cartItems.map(item => ({
          productId: item.product.id,
          sizeId: item.sizeId,
          quantity: item.quantity,
          isCustomized: item.isCustomized || false
        })),
        discountCode: discount?.isValid ? discount.code : undefined,
        paymentMethod: formData.paymentMethod as any
      };

      const response = await createOrder(orderData);

      toast.success(t('orderSuccess'));
      clearCart();

      // Redirect to order confirmation page
      router.push(`/order-confirmation/${response.orderNumber || response.id}`);
    } catch (error: any) {
      console.error('Order creation failed:', error);
      toast.error(t('orderFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-ink-faint" aria-hidden="true" />
          <h1 className="text-3xl font-bold text-ink mb-4">{t('emptyCart')}</h1>
          <p className="text-ink-soft mb-8">{t('emptyCartDescription')}</p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-accent text-accent-contrast rounded-xl font-semibold hover:bg-accent-hover transition-colors shadow-lg"
          >
            {t('continueShopping')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-ink mb-2">{t('title')}</h1>
          <p className="text-ink-soft">Complete your order ({getCartCount()} items)</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-line rounded-2xl shadow-xl p-6"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-bold text-ink mb-6 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-accent text-accent-contrast flex items-center justify-center mr-3 text-sm">
                      1
                    </span>
                    {t('contactInfo')}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="customerName"
                        className="block text-sm font-medium text-ink-soft mb-2"
                      >
                        {t('fullName')} *
                      </label>
                      <input
                        id="customerName"
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className={`${inputBase} ${errors.customerName ? inputError : inputNormal}`}
                        placeholder={t('fullName')}
                        aria-invalid={!!errors.customerName}
                        aria-describedby={errors.customerName ? 'customerName-error' : undefined}
                      />
                      {errors.customerName && (
                        <p
                          id="customerName-error"
                          className="text-danger text-sm mt-1 flex items-center"
                        >
                          <AlertCircle size={14} className="mr-1" aria-hidden="true" />
                          {errors.customerName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="customerEmail"
                        className="block text-sm font-medium text-ink-soft mb-2"
                      >
                        {t('email')} *
                      </label>
                      <input
                        id="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        className={`${inputBase} ${errors.customerEmail ? inputError : inputNormal}`}
                        placeholder={t('email')}
                        aria-invalid={!!errors.customerEmail}
                        aria-describedby={errors.customerEmail ? 'customerEmail-error' : undefined}
                      />
                      {errors.customerEmail && (
                        <p
                          id="customerEmail-error"
                          className="text-danger text-sm mt-1 flex items-center"
                        >
                          <AlertCircle size={14} className="mr-1" aria-hidden="true" />
                          {errors.customerEmail}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="customerPhone"
                        className="block text-sm font-medium text-ink-soft mb-2"
                      >
                        {t('phone')} *
                      </label>
                      <input
                        id="customerPhone"
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        className={`${inputBase} ${errors.customerPhone ? inputError : inputNormal}`}
                        placeholder="+20 10 1234 5678"
                        aria-invalid={!!errors.customerPhone}
                        aria-describedby={errors.customerPhone ? 'customerPhone-error' : undefined}
                      />
                      {errors.customerPhone && (
                        <p
                          id="customerPhone-error"
                          className="text-danger text-sm mt-1 flex items-center"
                        >
                          <AlertCircle size={14} className="mr-1" aria-hidden="true" />
                          {errors.customerPhone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="pt-6 border-t border-line">
                  <h2 className="text-xl font-bold text-ink mb-6 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-accent text-accent-contrast flex items-center justify-center mr-3 text-sm">
                      2
                    </span>
                    {t('shippingInfo')}
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="countryId"
                          className="block text-sm font-medium text-ink-soft mb-2"
                        >
                          {t('country')} *
                        </label>
                        <select
                          id="countryId"
                          value={formData.countryId || ''}
                          onChange={(e) => setFormData({ ...formData, countryId: parseInt(e.target.value) || null })}
                          className={`${inputBase} ${errors.countryId ? inputError : inputNormal}`}
                          disabled={isLoadingLocations}
                          aria-invalid={!!errors.countryId}
                          aria-describedby={errors.countryId ? 'countryId-error' : undefined}
                        >
                          <option value="">{t('country')}</option>
                          {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                              {locale === 'ar' ? country.nameAr : country.nameEn}
                            </option>
                          ))}
                        </select>
                        {errors.countryId && (
                          <p
                            id="countryId-error"
                            className="text-danger text-sm mt-1 flex items-center"
                          >
                            <AlertCircle size={14} className="mr-1" aria-hidden="true" />
                            {errors.countryId}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="governorateId"
                          className="block text-sm font-medium text-ink-soft mb-2"
                        >
                          {t('governorate')} *
                        </label>
                        <select
                          id="governorateId"
                          value={formData.governorateId || ''}
                          onChange={(e) => setFormData({ ...formData, governorateId: parseInt(e.target.value) || null })}
                          className={`${inputBase} ${errors.governorateId ? inputError : inputNormal}`}
                          disabled={isLoadingLocations || !formData.countryId}
                          aria-invalid={!!errors.governorateId}
                          aria-describedby={errors.governorateId ? 'governorateId-error' : undefined}
                        >
                          <option value="">{t('governorate')}</option>
                          {governorates.map((gov) => (
                            <option key={gov.id} value={gov.id}>
                              {locale === 'ar' ? gov.nameAr : gov.nameEn}
                            </option>
                          ))}
                        </select>
                        {errors.governorateId && (
                          <p
                            id="governorateId-error"
                            className="text-danger text-sm mt-1 flex items-center"
                          >
                            <AlertCircle size={14} className="mr-1" aria-hidden="true" />
                            {errors.governorateId}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-ink-soft mb-2"
                      >
                        {t('city')} *
                      </label>
                      <input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className={`${inputBase} ${errors.city ? inputError : inputNormal}`}
                        placeholder={t('city')}
                        aria-invalid={!!errors.city}
                        aria-describedby={errors.city ? 'city-error' : undefined}
                      />
                      {errors.city && (
                        <p id="city-error" className="text-danger text-sm mt-1 flex items-center">
                          <AlertCircle size={14} className="mr-1" aria-hidden="true" />
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="addressLine1"
                        className="block text-sm font-medium text-ink-soft mb-2"
                      >
                        {t('addressLine1')} *
                      </label>
                      <input
                        id="addressLine1"
                        type="text"
                        value={formData.addressLine1}
                        onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                        className={`${inputBase} ${errors.addressLine1 ? inputError : inputNormal}`}
                        placeholder={t('addressLine1')}
                        aria-invalid={!!errors.addressLine1}
                        aria-describedby={errors.addressLine1 ? 'addressLine1-error' : undefined}
                      />
                      {errors.addressLine1 && (
                        <p
                          id="addressLine1-error"
                          className="text-danger text-sm mt-1 flex items-center"
                        >
                          <AlertCircle size={14} className="mr-1" aria-hidden="true" />
                          {errors.addressLine1}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="addressLine2"
                        className="block text-sm font-medium text-ink-soft mb-2"
                      >
                        {t('addressLine2')}
                      </label>
                      <input
                        id="addressLine2"
                        type="text"
                        value={formData.addressLine2}
                        onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                        className={`${inputBase} ${inputNormal}`}
                        placeholder={t('addressLine2')}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="pt-6 border-t border-line">
                  <h2 className="text-xl font-bold text-ink mb-6 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-accent text-accent-contrast flex items-center justify-center mr-3 text-sm">
                      3
                    </span>
                    {t('paymentMethod')}
                  </h2>

                  <div className="space-y-3">
                    {/* Cash on Delivery */}
                    <label
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === 'CASH'
                          ? 'border-accent bg-accent-soft'
                          : 'border-line bg-section hover:border-accent-border'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="CASH"
                        checked={formData.paymentMethod === 'CASH'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                              formData.paymentMethod === 'CASH' ? 'border-accent' : 'border-line'
                            }`}
                          >
                            {formData.paymentMethod === 'CASH' && (
                              <div className="w-3 h-3 rounded-full bg-accent" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-ink">{t('cod')}</p>
                            <p className="text-sm text-ink-soft">{t('codDescription')}</p>
                          </div>
                        </div>
                        <CreditCard size={24} className="text-accent" aria-hidden="true" />
                      </div>
                    </label>

                    {/* Vodafone Cash */}
                    <label
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === 'VODAFONE_CASH'
                          ? 'border-accent bg-accent-soft'
                          : 'border-line bg-section hover:border-accent-border'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="VODAFONE_CASH"
                        checked={formData.paymentMethod === 'VODAFONE_CASH'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                              formData.paymentMethod === 'VODAFONE_CASH' ? 'border-accent' : 'border-line'
                            }`}
                          >
                            {formData.paymentMethod === 'VODAFONE_CASH' && (
                              <div className="w-3 h-3 rounded-full bg-accent" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-ink">{t('vodafoneCash')}</p>
                            <p className="text-sm text-ink-soft">{t('vodafoneDescription')}</p>
                          </div>
                        </div>
                        <CreditCard size={24} className="text-accent" aria-hidden="true" />
                      </div>
                    </label>

                    {/* InstaPay */}
                    <label
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === 'INSTAPAY'
                          ? 'border-accent bg-accent-soft'
                          : 'border-line bg-section hover:border-accent-border'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="INSTAPAY"
                        checked={formData.paymentMethod === 'INSTAPAY'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                              formData.paymentMethod === 'INSTAPAY' ? 'border-accent' : 'border-line'
                            }`}
                          >
                            {formData.paymentMethod === 'INSTAPAY' && (
                              <div className="w-3 h-3 rounded-full bg-accent" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-ink">{t('instapay')}</p>
                            <p className="text-sm text-ink-soft">{t('instapayDescription')}</p>
                          </div>
                        </div>
                        <CreditCard size={24} className="text-accent" aria-hidden="true" />
                      </div>
                    </label>
                  </div>

                  {/* Payment Instructions */}
                  {formData.paymentMethod === 'CASH' && (
                    <div className="mt-4 p-4 bg-accent-soft border border-accent-border rounded-lg">
                      <div className="flex items-start">
                        <CreditCard size={16} className="text-accent mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <div className="text-sm">
                          <p className="font-semibold text-ink mb-1">{t('cod')}</p>
                          <p className="text-ink-soft">{t('codDescription')}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'VODAFONE_CASH' && (
                    <div className="mt-4 p-4 bg-accent-soft border border-accent-border rounded-lg">
                      <div className="flex items-start">
                        <CreditCard size={16} className="text-accent mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <div className="text-sm">
                          <p className="font-semibold text-ink mb-1">{t('vodafoneCash')}</p>
                          <p className="text-ink-soft mb-1">
                            After placing your order, you&apos;ll receive wallet number and reference to transfer the amount. Your order will be shipped after payment confirmation.
                          </p>
                          <p className="text-xs text-ink-faint">Use order number as reference</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'INSTAPAY' && (
                    <div className="mt-4 p-4 bg-accent-soft border border-accent-border rounded-lg">
                      <div className="flex items-start">
                        <CreditCard size={16} className="text-accent mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        <div className="text-sm">
                          <p className="font-semibold text-ink mb-1">{t('instapay')}</p>
                          <p className="text-ink-soft mb-1">
                            After placing your order, you&apos;ll receive InstaPay username and reference. Transfer the amount and your order will be shipped automatically.
                          </p>
                          <p className="text-xs text-ink-faint">Instant confirmation, automatic shipping</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-line rounded-2xl shadow-xl p-6 sticky top-6"
            >
              <h2 className="text-xl font-bold text-ink mb-6 flex items-center">
                <ShoppingCart className="mr-2 text-accent" aria-hidden="true" />
                {t('orderSummary')}
              </h2>

              {/* Items */}
              <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.product.id}-${item.sizeId}`} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.product.images[0]?.imageUrl || '/placeholder.jpg'}
                        alt={locale === 'ar' ? item.product.nameAr : item.product.nameEn}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-ink text-sm truncate">
                        {locale === 'ar' ? item.product.nameAr : item.product.nameEn}
                      </p>
                      <p className="text-sm text-ink-soft">
                        {tProduct('quantity')}: {item.quantity} × {tProduct('currency')}{' '}
                        {(parseFloat(item.product.salePrice || item.product.basePrice)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    id="discountCode"
                    type="text"
                    value={formData.discountCode}
                    onChange={(e) => setFormData({ ...formData, discountCode: e.target.value })}
                    placeholder={t('discountCode')}
                    aria-label={t('discountCode')}
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-line bg-section text-ink focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
                    disabled={discount?.isValid}
                  />
                  {discount?.isValid ? (
                    <button
                      type="button"
                      onClick={removeDiscount}
                      aria-label="Remove discount code"
                      className="px-4 py-2 rounded-lg border border-line text-danger hover:bg-danger/10 transition-colors"
                    >
                      <X size={18} aria-hidden="true" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={applyDiscount}
                      disabled={isLoadingDiscount || !formData.discountCode}
                      aria-label={t('apply')}
                      className="px-4 py-2 bg-accent text-accent-contrast rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isLoadingDiscount ? (
                        <div className="w-5 h-5 border-2 border-accent-contrast border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles size={18} aria-hidden="true" />
                      )}
                    </button>
                  )}
                </div>
                {discount?.isValid && (
                  <div className="mt-2 p-2 bg-success/10 rounded-lg">
                    <p className="text-sm text-success flex items-center">
                      <Check size={16} className="mr-1" aria-hidden="true" />
                      {t('discountApplied')}
                    </p>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-6 border-t border-line">
                <div className="flex justify-between text-ink-soft">
                  <span>{t('subtotal')}</span>
                  <span>{tProduct('currency')} {calculateSubtotal().toFixed(2)}</span>
                </div>

                {discount?.isValid && (
                  <div className="flex justify-between text-success">
                    <span>{t('discount')} ({discount.code})</span>
                    <span>-{tProduct('currency')} {calculateDiscountAmount().toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-ink-soft">
                  <div className="flex items-center">
                    <Truck size={16} className="mr-2" aria-hidden="true" />
                    <span>{t('shipping')}</span>
                  </div>
                  <span>{tProduct('currency')} {shippingCost}</span>
                </div>

                {estimatedDays > 0 && (
                  <p className="text-sm text-ink-faint">
                    Estimated delivery: {estimatedDays} business days
                  </p>
                )}

                <div className="flex justify-between text-lg font-bold text-ink pt-3 border-t border-line">
                  <span>{t('total')}</span>
                  <span className="text-accent">{tProduct('currency')} {calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full mt-6 py-4 bg-accent text-accent-contrast rounded-xl font-bold text-lg hover:bg-accent-hover transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-accent-contrast border-t-transparent rounded-full animate-spin mr-2" />
                    {t('processing')}
                  </>
                ) : (
                  <>
                    {t('placeOrder')}
                    <ArrowRight size={20} className="ml-2" aria-hidden="true" />
                  </>
                )}
              </button>

              {/* Security Notice */}
              <div className="mt-4 p-3 bg-success/10 rounded-lg">
                <div className="flex items-start">
                  <Lock size={16} className="text-success mr-2 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <p className="text-sm text-success">{tProduct('securePayment')}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
