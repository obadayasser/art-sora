'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useTranslations } from 'next-intl';
import {
  ShoppingCart,
  MapPin,
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
  paymentMethod: 'CASH' | 'VODAFONE_CASH' | 'INSTAPAY' | 'PAYMOP';
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

export default function CheckoutPage() {
  const t = useTranslations();
  const router = useRouter();
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();

  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

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
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Invalid email address';
    }

    if (!formData.customerName) {
      newErrors.customerName = 'Name is required';
    } else if (formData.customerName.length < 3) {
      newErrors.customerName = 'Name must be at least 3 characters';
    }

    if (!formData.customerPhone) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^\+?\d{10,15}$/.test(formData.customerPhone.replace(/\s/g, ''))) {
      newErrors.customerPhone = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.countryId) {
      newErrors.countryId = 'Please select a country';
    }

    if (!formData.governorateId) {
      newErrors.governorateId = 'Please select a governorate';
    }

    if (!formData.city) {
      newErrors.city = 'City is required';
    } else if (formData.city.length < 2) {
      newErrors.city = 'City must be at least 2 characters';
    }

    if (!formData.addressLine1) {
      newErrors.addressLine1 = 'Address is required';
    } else if (formData.addressLine1.length < 5) {
      newErrors.addressLine1 = 'Address must be at least 5 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const applyDiscount = async () => {
    if (!formData.discountCode || formData.discountCode.length === 0) {
      toast.error('Please enter a discount code');
      return;
    }

    try {
      setIsLoadingDiscount(true);
      const result = await validateDiscountCode(formData.discountCode, getCartTotal());
      
      if (result.isValid) {
        setDiscount(result);
        toast.success(result.message || 'Discount code applied successfully!');
      } else {
        setDiscount(null);
        toast.error(result.message || 'Invalid discount code');
      }
    } catch (error: any) {
      setDiscount(null);
      toast.error(error.message || 'Failed to validate discount code');
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
      toast.error('Please fill in all required fields correctly');
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

      toast.success('Order placed successfully!');
      clearCart();
      
      // Redirect to order confirmation page
      router.push(`/order-confirmation/${response.orderNumber || response.id}`);
    } catch (error: any) {
      console.error('Order creation failed:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <ShoppingCart className="w-24 h-24 mx-auto mb-6 text-gray-400" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Add some items to your cart before proceeding to checkout.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Checkout
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Complete your order ({getCartCount()} items)
          </p>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center mb-12"
        >
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                    step >= s
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                  }`}
                >
                  {step > s ? <Check size={20} /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-12 h-1 ml-4 transition-colors ${
                      step > s
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Contact Information */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center mr-3 text-sm">
                      1
                    </span>
                    Contact Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                          errors.customerName
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                        } dark:text-white`}
                        placeholder="Enter your full name"
                      />
                      {errors.customerName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.customerName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                          errors.customerEmail
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                        } dark:text-white`}
                        placeholder="Enter your email"
                      />
                      {errors.customerEmail && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.customerEmail}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                          errors.customerPhone
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                        } dark:text-white`}
                        placeholder="+966 50 123 4567"
                      />
                      {errors.customerPhone && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.customerPhone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center mr-3 text-sm">
                      2
                    </span>
                    Shipping Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Country *
                        </label>
                        <select
                          value={formData.countryId || ''}
                          onChange={(e) => setFormData({ ...formData, countryId: parseInt(e.target.value) || null })}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                            errors.countryId
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                          } dark:text-white`}
                          disabled={isLoadingLocations}
                        >
                          <option value="">Select Country</option>
                          {countries.map((country) => (
                            <option key={country.id} value={country.id}>
                              {country.nameAr} / {country.nameEn}
                            </option>
                          ))}
                        </select>
                        {errors.countryId && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.countryId}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Governorate *
                        </label>
                        <select
                          value={formData.governorateId || ''}
                          onChange={(e) => setFormData({ ...formData, governorateId: parseInt(e.target.value) || null })}
                          className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                            errors.governorateId
                              ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                              : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                          } dark:text-white`}
                          disabled={isLoadingLocations || !formData.countryId}
                        >
                          <option value="">Select Governorate</option>
                          {governorates.map((gov) => (
                            <option key={gov.id} value={gov.id}>
                              {gov.nameAr} / {gov.nameEn}
                            </option>
                          ))}
                        </select>
                        {errors.governorateId && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            {errors.governorateId}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                          errors.city
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                        } dark:text-white`}
                        placeholder="Enter city name"
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        value={formData.addressLine1}
                        onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                        className={`w-full px-4 py-3 rounded-xl border-2 transition-colors ${
                          errors.addressLine1
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                        } dark:text-white`}
                        placeholder="Street address, building number"
                      />
                      {errors.addressLine1 && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <AlertCircle size={14} className="mr-1" />
                          {errors.addressLine1}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.addressLine2}
                        onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:text-white"
                        placeholder="Apartment, floor, etc."
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 text-white flex items-center justify-center mr-3 text-sm">
                      3
                    </span>
                    Payment Method
                  </h2>
                  
                  <div className="space-y-3">
                    {/* Cash on Delivery */}
                    <label
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === 'CASH'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-purple-300'
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
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3">
                            {formData.paymentMethod === 'CASH' && (
                              <div className="w-3 h-3 rounded-full bg-purple-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Cash on Delivery</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Pay when you receive your order</p>
                          </div>
                        </div>
                        <CreditCard size={24} className="text-purple-500" />
                      </div>
                    </label>

                    {/* Vodafone Cash */}
                    <label
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === 'VODAFONE_CASH'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-purple-300'
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
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3">
                            {formData.paymentMethod === 'VODAFONE_CASH' && (
                              <div className="w-3 h-3 rounded-full bg-purple-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">Vodafone Cash</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Transfer via Vodafone Cash wallet</p>
                          </div>
                        </div>
                        <CreditCard size={24} className="text-purple-500" />
                      </div>
                    </label>

                    {/* InstaPay */}
                    <label
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === 'INSTAPAY'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-purple-300'
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
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3">
                            {formData.paymentMethod === 'INSTAPAY' && (
                              <div className="w-3 h-3 rounded-full bg-purple-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">InstaPay</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Instant transfer via InstaPay</p>
                          </div>
                        </div>
                        <CreditCard size={24} className="text-purple-500" />
                      </div>
                    </label>

                    {/* PayMOP */}
                    <label
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.paymentMethod === 'PAYMOP'
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:border-purple-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="PAYMOP"
                        checked={formData.paymentMethod === 'PAYMOP'}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3">
                            {formData.paymentMethod === 'PAYMOP' && (
                              <div className="w-3 h-3 rounded-full bg-purple-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">PayMOP</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">Secure online payment with cards</p>
                          </div>
                        </div>
                        <CreditCard size={24} className="text-purple-500" />
                      </div>
                    </label>
                  </div>

                  {/* Payment Instructions */}
                  {formData.paymentMethod === 'CASH' && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-start">
                        <CreditCard size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-green-700 dark:text-green-400">
                          <p className="font-semibold mb-1">Cash on Delivery</p>
                          <p>Pay in cash when you receive your order. No additional fees or requirements.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'VODAFONE_CASH' && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-start">
                        <CreditCard size={16} className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-blue-700 dark:text-blue-400">
                          <p className="font-semibold mb-1">Vodafone Cash Transfer</p>
                          <p className="mb-1">After placing your order, you'll receive wallet number and reference to transfer the amount. Your order will be shipped after payment confirmation.</p>
                          <p className="text-xs opacity-75">Use order number as reference</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'INSTAPAY' && (
                    <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-start">
                        <CreditCard size={16} className="text-purple-600 dark:text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-purple-700 dark:text-purple-400">
                          <p className="font-semibold mb-1">InstaPay Transfer</p>
                          <p className="mb-1">After placing your order, you'll receive InstaPay username and reference. Transfer the amount and your order will be shipped automatically.</p>
                          <p className="text-xs opacity-75">Instant confirmation, automatic shipping</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'PAYMOP' && (
                    <div className="mt-4 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                      <div className="flex items-start">
                        <CreditCard size={16} className="text-pink-600 dark:text-pink-400 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-pink-700 dark:text-pink-400">
                          <p className="font-semibold mb-1">Secure Card Payment</p>
                          <p className="mb-1">You'll be redirected to secure PayMOP payment page. Complete payment and your order will be processed instantly.</p>
                          <p className="text-xs opacity-75">Supports Visa, Mastercard, Meeza</p>
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sticky top-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <ShoppingCart className="mr-2 text-purple-500" />
                Order Summary
              </h2>

              {/* Items */}
              <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                {cartItems.map((item) => (
                  <div key={`${item.product.id}-${item.sizeId}`} className="flex gap-3">
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <Image
                        src={item.product.images[0]?.imageUrl || '/placeholder.jpg'}
                        alt={item.product.nameAr}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                        {item.product.nameAr}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Qty: {item.quantity} × LE {(parseFloat(item.product.salePrice || item.product.basePrice)).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Discount Code */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.discountCode}
                    onChange={(e) => setFormData({ ...formData, discountCode: e.target.value })}
                    placeholder="Discount code"
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 dark:text-white"
                    disabled={discount?.isValid}
                  />
                  {discount?.isValid ? (
                    <button
                      type="button"
                      onClick={removeDiscount}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={applyDiscount}
                      disabled={isLoadingDiscount || !formData.discountCode}
                      className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isLoadingDiscount ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles size={18} />
                      )}
                    </button>
                  )}
                </div>
                {discount?.isValid && (
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400 flex items-center">
                      <Check size={16} className="mr-1" />
                      {discount.message}
                    </p>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>LE {calculateSubtotal().toFixed(2)}</span>
                </div>

                {discount?.isValid && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Discount ({discount.code})</span>
                    <span>-LE {calculateDiscountAmount().toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-gray-700 dark:text-gray-300">
                  <div className="flex items-center">
                    <Truck size={16} className="mr-2" />
                    <span>Shipping</span>
                  </div>
                  <span>LE {shippingCost}</span>
                </div>

                {estimatedDays > 0 && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Estimated delivery: {estimatedDays} business days
                  </p>
                )}

                <div className="flex justify-between text-lg font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span>Total</span>
                  <span className="text-purple-500">LE {calculateTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full mt-6 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight size={20} className="ml-2" />
                  </>
                )}
              </button>

              {/* Security Notice */}
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-start">
                  <Lock size={16} className="text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Your payment information is secure and encrypted. We never store your payment details.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
