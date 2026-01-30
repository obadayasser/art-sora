'use client';

import { useState, useEffect } from 'react';
import { Category, Product } from '@/types';
import { getHeaders } from './api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Logging helpers
function logApiCall(method: string, endpoint: string, params?: any) {
  console.log('🔵 [CLIENT] API REQUEST:', {
    method,
    url: `${API_BASE_URL}${endpoint}`,
    params,
    timestamp: new Date().toISOString(),
  });
}

function logApiResponse(method: string, endpoint: string, response: Response) {
  console.log('🟢 [CLIENT] API RESPONSE:', {
    method,
    url: `${API_BASE_URL}${endpoint}`,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    timestamp: new Date().toISOString(),
  });
}

function logApiError(method: string, endpoint: string, error: any) {
  console.error('🔴 [CLIENT] API ERROR:', {
    method,
    url: `${API_BASE_URL}${endpoint}`,
    error: error.message,
    timestamp: new Date().toISOString(),
  });
}

export async function clientGetCategories(active: boolean = true): Promise<Category[]> {
  const endpoint = `/categories?active=${active}`;
  logApiCall('GET', endpoint, { active });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    console.log('✅ [CLIENT] Categories Data:', data);
    return data.data || [];
  } catch (error) {
    logApiError('GET', endpoint, error);
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function clientGetCategoryById(id: number): Promise<Category | null> {
  const endpoint = `/categories/${id}`;
  logApiCall('GET', endpoint, { id });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }

    const data = await response.json();
    console.log('✅ [CLIENT] Category Data:', data);
    return data.data || null;
  } catch (error) {
    logApiError('GET', endpoint, error);
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function clientGetCategoryBySlug(slug: string): Promise<Category | null> {
  const endpoint = `/categories/slug/${slug}`;
  logApiCall('GET', endpoint, { slug });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }

    const data = await response.json();
    console.log('✅ [CLIENT] Category Data:', data);
    return data.data || null;
  } catch (error) {
    logApiError('GET', endpoint, error);
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function clientGetProducts(params?: {
  page?: number;
  limit?: number;
  active?: boolean;
  categoryId?: number;
}): Promise<{ products: Product[]; pagination?: any }> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.active !== undefined) queryParams.append('active', params.active.toString());
  if (params?.categoryId) queryParams.append('categoryId', params.categoryId.toString());

  const endpoint = `/products?${queryParams.toString()}`;
  logApiCall('GET', endpoint, params);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    console.log('✅ [CLIENT] Products Data:', {
      count: data.data?.length || 0,
      products: data.data,
      pagination: data.pagination,
    });
    return {
      products: data.data || [],
      pagination: data.pagination,
    };
  } catch (error) {
    logApiError('GET', endpoint, error);
    console.error('Error fetching products:', error);
    return { products: [] };
  }
}

export async function clientGetProductById(id: number): Promise<Product | null> {
  const endpoint = `/products/${id}`;
  logApiCall('GET', endpoint, { id });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const data = await response.json();
    console.log('✅ [CLIENT] Product Data:', data);
    return data.data || null;
  } catch (error) {
    logApiError('GET', endpoint, error);
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function clientGetProductBySlug(slug: string): Promise<Product | null> {
  const endpoint = `/products/slug/${slug}`;
  logApiCall('GET', endpoint, { slug });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const data = await response.json();
    console.log('✅ [CLIENT] Product Data:', data);
    return data.data || null;
  } catch (error) {
    logApiError('GET', endpoint, error);
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function clientGetCountries(active: boolean = true) {
  const endpoint = `/locations/countries?active=${active}`;
  logApiCall('GET', endpoint, { active });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }

    const data = await response.json();
    console.log('✅ [CLIENT] Countries Data:', data);
    return data.data || [];
  } catch (error) {
    logApiError('GET', endpoint, error);
    console.error('Error fetching countries:', error);
    return [];
  }
}

export async function clientGetGovernorates(countryId: number, active: boolean = true) {
  const endpoint = `/locations/governorates?countryId=${countryId}&active=${active}`;
  logApiCall('GET', endpoint, { countryId, active });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch governorates');
    }

    const data = await response.json();
    console.log('✅ [CLIENT] Governorates Data:', data);
    return data.data || [];
  } catch (error) {
    logApiError('GET', endpoint, error);
    console.error('Error fetching governorates:', error);
    return [];
  }
}

export async function clientValidateDiscountCode(code: string, subtotal: number) {
  const endpoint = `/discounts/validate`;
  logApiCall('POST', endpoint, { code, subtotal });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        code,
        subtotal: subtotal.toString(),
      }),
    });

    logApiResponse('POST', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to validate discount code');
    }

    const data = await response.json();
    console.log('✅ [CLIENT] Discount Code Validation Data:', data);
    return data.data || null;
  } catch (error) {
    logApiError('POST', endpoint, error);
    console.error('Error validating discount code:', error);
    return null;
  }
}

export async function clientCreateOrder(orderData: {
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  countryId: number;
  governorateId: number;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  items: {
    productId: number;
    sizeId?: number;
    quantity: number;
    isCustomized?: boolean;
  }[];
  discountCode?: string;
  paymentMethod: string;
}) {
  const endpoint = `/orders`;
  logApiCall('POST', endpoint, orderData);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData),
    });

    logApiResponse('POST', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    const data = await response.json();
    console.log('✅ [CLIENT] Order Created Data:', data);
    return data.data || null;
  } catch (error) {
    logApiError('POST', endpoint, error);
    console.error('Error creating order:', error);
    return null;
  }
}

export async function clientSearchProducts(params: {
  query?: string;
  categoryIds?: number[];
  sortBy?: string;
  page?: number;
  limit?: number;
}) {
  const endpoint = `/analytics/search`;
  logApiCall('POST', endpoint, params);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        query: params.query || '',
        categoryIds: params.categoryIds || [],
        sortBy: params.sortBy || 'popularity',
        page: params.page || 1,
        limit: params.limit || 20,
      }),
    });

    logApiResponse('POST', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to search products');
    }

    const data = await response.json();
    console.log('✅ [CLIENT] Search Results Data:', {
      resultsCount: data.results?.length || 0,
      results: data.results,
      pagination: data.pagination,
    });
    return {
      results: data.results || [],
      pagination: data.pagination || {},
    };
  } catch (error) {
    logApiError('POST', endpoint, error);
    console.error('Error searching products:', error);
    return { results: [], pagination: {} };
  }
}

export async function clientRecordProductView(productId: number) {
  const endpoint = `/analytics/products/${productId}/view`;
  logApiCall('POST', endpoint, { productId });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
    });

    logApiResponse('POST', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to record product view');
    }

    const data = await response.json();
    console.log('✅ [CLIENT] Product View Recorded:', data);
    return data;
  } catch (error) {
    logApiError('POST', endpoint, error);
    console.error('Error recording product view:', error);
    return null;
  }
}

export async function clientGetProductReviews(productId: number, onlyApproved: boolean = true) {
  const endpoint = `/analytics/reviews/product/${productId}?onlyApproved=${onlyApproved}`;
  logApiCall('GET', endpoint, { productId, onlyApproved });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch product reviews');
    }

    const data = await response.json();
    console.log('✅ [CLIENT] Product Reviews Data:', data);
    return data.data || [];
  } catch (error) {
    logApiError('GET', endpoint, error);
    console.error('Error fetching product reviews:', error);
    return [];
  }
}

export async function clientAddReview(reviewData: {
  productId: number;
  rating: number;
  reviewTitle: string;
  reviewText: string;
  customerName: string;
}) {
  const endpoint = `/analytics/reviews`;
  logApiCall('POST', endpoint, reviewData);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(reviewData),
    });

    logApiResponse('POST', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to add review');
    }

    const data = await response.json();
    console.log('✅ [CLIENT] Review Added Data:', data);
    return data.data || null;
  } catch (error) {
    logApiError('POST', endpoint, error);
    console.error('Error adding review:', error);
    return null;
  }
}

// Export aliases for easier imports
export const getProductBySlug = clientGetProductBySlug;
export const getProductReviews = clientGetProductReviews;
export const getCategories = clientGetCategories;
export const getProducts = clientGetProducts;
