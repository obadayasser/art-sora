'use client';

import { getAppId, getHeaders } from './api-client';
import type {
  ApiResponse,
  Product,
  ProductVariant,
  ProductSize,
  Country,
  Governorate,
  ApiErrorResponse,
  Category
} from '@/types';

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';


// Helper function to handle API response
async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  const contentType = response.headers.get('content-type');
  

  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
  
    throw new Error(`Expected JSON but got ${contentType}. Response: ${text.substring(0, 200)}`);
  }

  const data = await response.json();


  if (!response.ok) {
    const error = data as ApiErrorResponse;
  
    throw new Error(error.message || error.error || 'An error occurred');
  }

  return data;
}

// ====== CATEGORIES ======

/**
 * Get all categories
 */
export async function getPublicCategories(active: boolean = true): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories?active=${active}`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include'
  });

  const result = await handleResponse<Category[]>(response);
  return result.data;
}

// ====== PRODUCTS ======

/**
 * Get products with filters
 */
export async function getPublicProducts(
  page: number = 1,
  limit: number = 20,
  active: boolean = true,
  categoryId?: number
): Promise<{ data: Product[]; pagination: any }> {
  let url = `${API_BASE_URL}/products?page=${page}&limit=${limit}&active=${active}`;
  if (categoryId) {
    url += `&categoryId=${categoryId}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include'
  });

  const result = await handleResponse<Product[]>(response);
  return {
    data: result.data,
    pagination: result.pagination
  };
}

/**
 * Get product by slug
 */
export async function getProductBySlug(slug: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/slug/${slug}`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include'
  });

  const result = await handleResponse<Product>(response);
  return result.data;
}

/**
 * Get all product sizes
 */
export async function getProductSizes(): Promise<ProductSize[]> {
  const response = await fetch(`${API_BASE_URL}/products/sizes/all`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include'
  });

  const result = await handleResponse<ProductSize[]>(response);
  return result.data;
}

/**
 * Get product variants
 */
export async function getProductVariants(productId: number): Promise<ProductVariant[]> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/variants`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include'
  });

  const result = await handleResponse<ProductVariant[]>(response);
  return result.data;
}

/**
 * Get single product variant
 */
export async function getProductVariant(productId: number, variantId: number): Promise<ProductVariant> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/variants/${variantId}`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include'
  });

  const result = await handleResponse<ProductVariant>(response);
  return result.data;
}

// ====== LOCATIONS ======

/**
 * Get all countries
 */
export async function getCountries(): Promise<Country[]> {

  const response = await fetch(`${API_BASE_URL}/locations/countries?active=true`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include'
  });

  const result = await handleResponse<Country[]>(response);

  return result.data;
}

/**
 * Get governorates by country
 */
export async function getGovernorates(countryId: number): Promise<Governorate[]> {

  const response = await fetch(`${API_BASE_URL}/locations/governorates?countryId=${countryId}&active=true`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include'
  });

  const result = await handleResponse<Governorate[]>(response);

  return result.data;
}

/**
 * Get shipping details
 */
export async function getShippingDetails(countryId: number, governorateId: number): Promise<{
  shippingCost: string;
  estimatedDays: number;
  countryName: { ar: string; en: string };
  governorateName: { ar: string; en: string };
}> {
  const response = await fetch(`${API_BASE_URL}/locations/shipping-details/${countryId}/${governorateId}`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include'
  });

  const result = await handleResponse<any>(response);
  return result.data;
}

// ====== DISCOUNTS ======

interface DiscountValidationResponse {
  isValid: boolean;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: string;
  discountAmount: string;
  message: string;
}

/**
 * Validate discount code
 */
export async function validateDiscountCode(code: string, subtotal: number): Promise<DiscountValidationResponse> {

  const response = await fetch(`${API_BASE_URL}/discounts/validate`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ code, subtotal: subtotal.toString() }),
    credentials: 'include'
  });

  const result = await handleResponse<DiscountValidationResponse>(response);

  return result.data;
}

// ====== ORDERS ======

export interface OrderItemInput {
  productId: number;
  sizeId?: number;
  quantity: number;
  isCustomized?: boolean;
}

export interface CreateOrderInput {
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  countryId: number;
  governorateId: number;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  items: OrderItemInput[];
  discountCode?: string;
  paymentMethod: 'CASH' | 'VODAFONE_CASH' | 'INSTAPAY' | 'PAYMOP';
}

/**
 * Create new order
 */
export async function createOrder(orderData: CreateOrderInput): Promise<any> {

  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(orderData),
    credentials: 'include'
  });

  // Handle response
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
  
    throw new Error(`Expected JSON but got ${contentType}`);
  }

  const json = await response.json();


  if (!response.ok) {
  
    throw new Error(json.message || json.error || 'Failed to create order');
  }

  const data = (json as any).data || json;

  
  // If it's PayMOP payment and we have paymentUrl, redirect to it
  if (data.paymentDetails?.paymentUrl) {
  
    if (typeof window !== 'undefined') {
      window.location.href = data.paymentDetails.paymentUrl;
    }
  }
  
  return data;
}

// ====== REVIEWS ======

export interface CreateReviewInput {
  productId: number;
  rating: number;
  reviewTitle: string;
  reviewText: string;
  customerName: string;
}

export interface OrderDetail {
  id: number;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  countryName: string;
  governorateName: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  subtotal: string;
  discountAmount: string;
  shippingCost: string;
  taxAmount: string;
  totalAmount: string;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  items: Array<{
    productId: number;
    productNameAr: string;
    productNameEn: string;
    sizeId: number;
    sizeName: string;
    quantity: number;
    unitPrice: string;
    colorAr?: string;
    colorEn?: string;
    colorHex?: string;
  }>;
  createdAt: string;
  estimatedDeliveryDate?: string;
}

/**
 * Create review
 */
export async function createReview(reviewData: CreateReviewInput): Promise<any> {

  const response = await fetch(`${API_BASE_URL}/analytics/reviews`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(reviewData),
    credentials: 'include'
  });

  const result = await handleResponse<any>(response);

  return result.data;
}

/**
 * Get product reviews
 */
export async function getProductReviews(productId: number, onlyApproved: boolean = true): Promise<any[]> {
  const response = await fetch(`${API_BASE_URL}/analytics/reviews/product/${productId}?onlyApproved=${onlyApproved}`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include'
  });

  const result = await handleResponse<any[]>(response);
  return result.data;
}

// ====== ORDER DETAILS ======

/**
 * Get order details by order number
 */
export async function getOrderDetails(orderNumber: string): Promise<OrderDetail> {

  const response = await fetch(`${API_BASE_URL}/orders?orderNumber=${orderNumber}`, {
    method: 'GET',
    headers: getHeaders(),
    credentials: 'include'
  });

  const result = await handleResponse<any>(response);

  return result.data;
}

// ====== ANALYTICS ======

/**
 * Log product view
 */
export async function logProductView(productId: number): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/analytics/products/${productId}/view`, {
      method: 'POST',
      headers: getHeaders(),
      credentials: 'include'
    });
  } catch (error) {
  
  }
}
