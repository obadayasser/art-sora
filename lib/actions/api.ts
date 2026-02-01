'use server';

import { Category, Product, ApiResponse } from '@/types';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://76.13.135.206:5000/api/v1';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://76.13.135.206:5000/api/v1';


// Helper function to get headers for server actions
function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
  };
}

// Logging helper
function logApiCall(method: string, endpoint: string, params?: any) {
  
}

function logApiResponse(method: string, endpoint: string, response: Response) {
  
}

function logApiError(method: string, endpoint: string, error: any) {
 
}

export async function getCategories(active: boolean = true): Promise<Category[]> {
  const endpoint = `/categories?active=${active}`;
  logApiCall('GET', endpoint, { active });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }

    const data: ApiResponse<Category[]> = await response.json();
  
    return data.data;
  } catch (error) {
    logApiError('GET', endpoint, error);
  
    return [];
  }
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const endpoint = `/categories/${id}`;
  logApiCall('GET', endpoint, { id });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }

    const data: ApiResponse<Category> = await response.json();
  
    return data.data;
  } catch (error) {
    logApiError('GET', endpoint, error);
  
    return null;
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const endpoint = `/categories/slug/${slug}`;
  logApiCall('GET', endpoint, { slug });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch category');
    }

    const data: ApiResponse<Category> = await response.json();
  
    return data.data;
  } catch (error) {
    logApiError('GET', endpoint, error);
  
    return null;
  }
}

export async function getProducts(params?: {
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
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data: ApiResponse<Product[]> = await response.json();
 
    return {
      products: data.data,
      pagination: data.pagination,
    };
  } catch (error) {
    logApiError('GET', endpoint, error);
  
    return { products: [] };
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  const endpoint = `/products/${id}`;
  logApiCall('GET', endpoint, { id });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      next: { revalidate: 300 },
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const data: ApiResponse<Product> = await response.json();
  
    return data.data;
  } catch (error) {
    logApiError('GET', endpoint, error);
  
    return null;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const endpoint = `/products/slug/${slug}`;
  logApiCall('GET', endpoint, { slug });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      next: { revalidate: 300 },
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    const data: ApiResponse<Product> = await response.json();
  
    return data.data;
  } catch (error) {
    logApiError('GET', endpoint, error);
  
    return null;
  }
}

// Locations - Countries
export async function getCountries(active: boolean = true) {
  const endpoint = `/locations/countries?active=${active}`;
  logApiCall('GET', endpoint, { active });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch countries');
    }

    const data = await response.json();
  
    return data.data;
  } catch (error) {
    logApiError('GET', endpoint, error);
  
    return [];
  }
}

export async function getCountryById(id: number) {
  const endpoint = `/locations/countries/${id}`;
  logApiCall('GET', endpoint, { id });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch country');
    }

    const data = await response.json();
  
    return data.data;
  } catch (error) {
    logApiError('GET', endpoint, error);
  
    return null;
  }
}

// Locations - Governorates
export async function getGovernorates(countryId: number, active: boolean = true) {
  const endpoint = `/locations/governorates?countryId=${countryId}&active=${active}`;
  logApiCall('GET', endpoint, { countryId, active });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      next: { revalidate: 3600 },
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch governorates');
    }

    const data = await response.json();
  
    return data.data;
  } catch (error) {
    logApiError('GET', endpoint, error);
  
    return [];
  }
}

export async function getShippingDetails(countryId: number, governorateId: number) {
  const endpoint = `/locations/shipping-details/${countryId}/${governorateId}`;
  logApiCall('GET', endpoint, { countryId, governorateId });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      next: { revalidate: 300 },
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch shipping details');
    }

    const data = await response.json();
  
    return data.data;
  } catch (error) {
    logApiError('GET', endpoint, error);
  
    return null;
  }
}

// Discount Codes
export async function validateDiscountCode(code: string, subtotal: number) {
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
  
    return data.data;
  } catch (error) {
    logApiError('POST', endpoint, error);
  
    return null;
  }
}

// Orders
export async function createOrder(orderData: {
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
  
    return data.data;
  } catch (error) {
    logApiError('POST', endpoint, error);
  
    return null;
  }
}

// Analytics - Search
export async function searchProducts(params: {
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
  
  
    return {
      results: data.results,
      pagination: data.pagination,
    };
  } catch (error) {
    logApiError('POST', endpoint, error);
  
    return { results: [], pagination: {} };
  }
}

// Analytics - Product Views
export async function recordProductView(productId: number) {
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
  
    return data;
  } catch (error) {
    logApiError('POST', endpoint, error);
  
    return null;
  }
}

// Reviewsf
export async function getProductReviews(productId: number, onlyApproved: boolean = true) {
  const endpoint = `/analytics/reviews/product/${productId}?onlyApproved=${onlyApproved}`;
  logApiCall('GET', endpoint, { productId, onlyApproved });

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      next: { revalidate: 300 },
    });

    logApiResponse('GET', endpoint, response);

    if (!response.ok) {
      throw new Error('Failed to fetch product reviews');
    }

    const data = await response.json();
  
    return data.data;
  } catch (error) {
    logApiError('GET', endpoint, error);
  
    return [];
  }
}

export async function addReview(reviewData: {
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
  
    return data.data;
  } catch (error) {
    logApiError('POST', endpoint, error);
  
    return null;
  }
}
