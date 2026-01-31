'use client';

import { getAppId, getDeviceId, getHeaders } from './api-client';
import type {
  ApiResponse,
  AdminUser,
  AdminLoginResponse,
  TwoFactorSetupResponse,
  TwoFactorVerifyResponse,
  Category,
  Product,
  ProductImage,
  Country,
  Governorate,
  DiscountCode,
  Order,
  Review,
  AnalyticsData,
  ApiErrorResponse,
  ProductSize,
  ProductVariant,
  Revision,
  RevisionCompare
} from '@/types';

// API Base URL - Update this with your actual API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://76.13.135.206:5000/api/v1';

// Helper function to get auth headers
function getAuthHeaders(token: string): HeadersInit {
  const headers = {
    ...getHeaders(),
    'Authorization': `Bearer ${token}`
  };
 
  return headers;
}

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

// Helper function to handle FormData response
async function handleFormDataResponse<T>(response: Response): Promise<ApiResponse<T>> {
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

// ==================== AUTHENTICATION ====================

/**
 * Login as admin
 */
export async function adminLogin(email: string, password: string): Promise<AdminLoginResponse> {
 
  
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
    credentials: 'include' // Important for cookies
  });

  // Handle the response - check if it's wrapped in ApiResponse or direct
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
   
    throw new Error(`Expected JSON but got ${contentType}`);
  }

  const json = await response.json();
 

  if (!response.ok) {
   
    throw new Error(json.message || json.error || 'Login failed');
  }

  // Return data directly if it's already the response, or extract from .data
  const data = (json as any).data || json;
 
  return data as AdminLoginResponse;
}

/**
 * Setup 2FA
 */
export async function setupTwoFactor(token: string): Promise<TwoFactorSetupResponse> {
 
  const response = await fetch(`${API_BASE_URL}/auth/2fa/setup`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    credentials: 'include'
  });

  const result = await handleResponse<TwoFactorSetupResponse>(response);
 
  return result.data;
}

/**
 * Verify 2FA code
 */
export async function verifyTwoFactor(code: string, token?: string): Promise<TwoFactorVerifyResponse> {
 
  
  const headers = token ? getAuthHeaders(token) : getHeaders();
  
  const response = await fetch(`${API_BASE_URL}/auth/2fa/verify`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ code }),
    credentials: 'include'
  });

  // Handle response - check if it's wrapped in ApiResponse or direct
  const contentType = response.headers.get('content-type');
  
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
   
    throw new Error(`Expected JSON but got ${contentType}`);
  }

  const json = await response.json();
 

  if (!response.ok) {
   
    throw new Error(json.message || json.error || 'Verification failed');
  }

  // Return data directly if it's already response, or extract from .data
  const data = (json as any).data || json;
 
  return data as TwoFactorVerifyResponse;
}

// ==================== USERS MANAGEMENT ====================

/**
 * Get all users
 */
export async function getUsers(token: string): Promise<AdminUser[]> {
 
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'GET',
    headers: getAuthHeaders(token),
    credentials: 'include'
  });

  const result = await handleResponse<AdminUser[]>(response);
  return result.data;
}

/**
 * Get user by ID
 */
export async function getUserById(token: string, id: number): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
    credentials: 'include'
  });

  const result = await handleResponse<AdminUser>(response);
  return result.data;
}

/**
 * Create new user
 */
export async function createUser(token: string, userData: Partial<AdminUser> & { password: string }): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(userData),
    credentials: 'include'
  });

  const result = await handleResponse<AdminUser>(response);
  return result.data;
}

/**
 * Update user
 */
export async function updateUser(token: string, id: number, userData: Partial<AdminUser>): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(userData),
    credentials: 'include'
  });

  const result = await handleResponse<AdminUser>(response);
  return result.data;
}

/**
 * Delete user
 */
export async function deleteUser(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete user');
  }
}

// ==================== CATEGORIES MANAGEMENT ====================

/**
 * Get all categories
 */
export async function getCategories(token: string): Promise<Category[]> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'GET',
    headers: getAuthHeaders(token),
    credentials: 'include'
  });

  const result = await handleResponse<Category[]>(response);
  return result.data;
}

/**
 * Get category by ID
 */
export async function getCategoryById(token: string, id: number): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
    credentials: 'include'
  });

  const result = await handleResponse<Category>(response);
  return result.data;
}

/**
 * Create new category
 */
export async function createCategory(token: string, categoryData: Partial<Category>): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(categoryData),
    credentials: 'include'
  });

  const result = await handleResponse<Category>(response);
  return result.data;
}

/**
 * Update category
 */
export async function updateCategory(token: string, id: number, categoryData: Partial<Category>): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(categoryData)
  });

  const result = await handleResponse<Category>(response);
  return result.data;
}

/**
 * Delete category
 */
export async function deleteCategory(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete category');
  }
}

// ==================== PRODUCTS MANAGEMENT ====================

/**
 * Get all products
 */
export async function getProducts(token: string, page = 1, limit = 20): Promise<{ data: Product[]; pagination: any }> {
  const response = await fetch(`${API_BASE_URL}/products?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
    credentials: 'include'
  });

  const result = await handleResponse<Product[]>(response);
  return {
    data: result.data,
    pagination: result.pagination
  };
}

/**
 * Get product by ID
 */
export async function getProductById(token: string, id: number): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
    credentials: 'include'
  });

  const result = await handleResponse<Product>(response);
  return result.data;
}

/**
 * Create new product
 */
export async function createProduct(token: string, productData: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(productData),
    credentials: 'include'
  });

  const result = await handleResponse<Product>(response);
  return result.data;
}

/**
 * Update product
 */
export async function updateProduct(token: string, id: number, productData: Partial<Product>): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(productData),
    credentials: 'include'
  });

  const result = await handleResponse<Product>(response);
  return result.data;
}

/**
 * Delete product
 */
export async function deleteProduct(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete product');
  }
}

/**
 * Upload product image
 */
export async function uploadProductImage(
  token: string,
  productId: number,
  imageFile: File,
  isPrimary: boolean = false
): Promise<ProductImage> {
  const formData = new FormData();

  // Validate file before upload
  if (!imageFile || !(imageFile instanceof File)) {
    throw new Error('Invalid file provided');
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (imageFile.size > maxSize) {
    throw new Error('File size exceeds 10MB limit');
  }

  // Check file type
  if (!imageFile.type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }

  formData.append('image', imageFile);
  formData.append('isPrimary', isPrimary ? 'true' : 'false');

 
 

  const response = await fetch(`${API_BASE_URL}/products/${productId}/images`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-App-ID': getAppId(),
      'X-Device-ID': getDeviceId()
    },
    body: formData
  });

  const result = await handleFormDataResponse<ProductImage>(response);
  return result.data;
}

/**
 * Upload multiple product images
 */
export async function uploadProductImagesBatch(
  token: string,
  productId: number,
  imageFiles: File[]
): Promise<ProductImage[]> {
  const formData = new FormData();
  imageFiles.forEach(file => {
    formData.append('images', file);
  });

  const response = await fetch(`${API_BASE_URL}/products/${productId}/images/batch`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
       'X-App-ID': getAppId(),
    'X-Device-ID': getDeviceId()
    },
    body: formData
  });

  const result = await handleFormDataResponse<ProductImage[]>(response);
  return result.data;
}

/**
 * Delete product image
 */
export async function deleteProductImage(token: string, productId: number, imageId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/images/${imageId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token),
    credentials: 'include'
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete product image');
  }
}

// ==================== LOCATIONS MANAGEMENT ====================

/**
 * Get all countries
 */
export async function getCountries(token: string): Promise<Country[]> {
  const response = await fetch(`${API_BASE_URL}/locations/countries`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });

  const result = await handleResponse<Country[]>(response);
  return result.data;
}

/**
 * Create new country
 */
export async function createCountry(token: string, countryData: Partial<Country>): Promise<Country> {
  const response = await fetch(`${API_BASE_URL}/locations/countries`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(countryData)
  });

  const result = await handleResponse<Country>(response);
  return result.data;
}

/**
 * Update country
 */
export async function updateCountry(token: string, id: number, countryData: Partial<Country>): Promise<Country> {
  const response = await fetch(`${API_BASE_URL}/locations/countries/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(countryData)
  });

  const result = await handleResponse<Country>(response);
  return result.data;
}

/**
 * Delete country
 */
export async function deleteCountry(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/locations/countries/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete country');
  }
}

/**
 * Get all governorates
 */
export async function getGovernorates(token: string): Promise<Governorate[]> {
  const response = await fetch(`${API_BASE_URL}/locations/governorates`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });

  const result = await handleResponse<Governorate[]>(response);
  return result.data;
}

/**
 * Create new governorate
 */
export async function createGovernorate(token: string, governorateData: Partial<Governorate>): Promise<Governorate> {
  const response = await fetch(`${API_BASE_URL}/locations/governorates`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(governorateData)
  });

  const result = await handleResponse<Governorate>(response);
  return result.data;
}

/**
 * Update governorate
 */
export async function updateGovernorate(token: string, id: number, governorateData: Partial<Governorate>): Promise<Governorate> {
  const response = await fetch(`${API_BASE_URL}/locations/governorates/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(governorateData)
  });

  const result = await handleResponse<Governorate>(response);
  return result.data;
}

/**
 * Delete governorate
 */
export async function deleteGovernorate(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/locations/governorates/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete governorate');
  }
}

// ==================== DISCOUNT CODES MANAGEMENT ====================

/**
 * Get all discount codes
 */
export async function getDiscountCodes(token: string): Promise<DiscountCode[]> {
  const response = await fetch(`${API_BASE_URL}/discounts`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });

  const result = await handleResponse<DiscountCode[]>(response);
  return result.data;
}

/**
 * Get discount code by ID
 */
export async function getDiscountCodeById(token: string, id: number): Promise<DiscountCode> {
  const response = await fetch(`${API_BASE_URL}/discounts/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });

  const result = await handleResponse<DiscountCode>(response);
  return result.data;
}

/**
 * Create new discount code
 */
export async function createDiscountCode(token: string, discountData: Partial<DiscountCode>): Promise<DiscountCode> {
  const response = await fetch(`${API_BASE_URL}/discounts`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(discountData)
  });

  const result = await handleResponse<DiscountCode>(response);
  return result.data;
}

/**
 * Update discount code
 */
export async function updateDiscountCode(token: string, id: number, discountData: Partial<DiscountCode>): Promise<DiscountCode> {
  const response = await fetch(`${API_BASE_URL}/discounts/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(discountData)
  });

  const result = await handleResponse<DiscountCode>(response);
  return result.data;
}

/**
 * Delete discount code
 */
export async function deleteDiscountCode(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/discounts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete discount code');
  }
}

// ==================== ORDERS MANAGEMENT ====================

/**
 * Get all orders
 */
export async function getOrders(
  token: string,
  page: number = 1,
  limit: number = 20,
  status?: string
): Promise<{ data: Order[]; pagination: any }> {
  let url = `${API_BASE_URL}/orders?page=${page}&limit=${limit}`;
  if (status) {
    url += `&status=${status}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token),
    credentials: 'include'
  });

  const result = await handleResponse<Order[]>(response);
  return {
    data: result.data,
    pagination: result.pagination
  };
}

/**
 * Get order by ID
 */
export async function getOrderById(token: string, id: number): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
    credentials: 'include'
  });

  const result = await handleResponse<Order>(response);
  return result.data;
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  token: string,
  id: number,
  status: string,
  notes?: string
): Promise<Order> {
  const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ status, notes }),
    credentials: 'include'
  });

  const result = await handleResponse<Order>(response);
  return result.data;
}

// ==================== REVIEWS & ANALYTICS ====================

/**
 * Get all reviews
 */
export async function getReviews(token: string, page: number = 1, limit: number = 20): Promise<{ data: Review[]; pagination: any }> {
  const response = await fetch(`${API_BASE_URL}/analytics/reviews?page=${page}&limit=${limit}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
    credentials: 'include'
  });

  const result = await handleResponse<Review[]>(response);
  return {
    data: result.data,
    pagination: result.pagination
  };
}

/**
 * Approve review
 */
export async function approveReview(token: string, id: number): Promise<Review> {
  const response = await fetch(`${API_BASE_URL}/analytics/reviews/${id}/approve`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    credentials: 'include'
  });

  const result = await handleResponse<Review>(response);
  return result.data;
}

/**
 * Respond to review
 */
export async function respondToReview(token: string, id: number, response: string): Promise<Review> {
  const res = await fetch(`${API_BASE_URL}/analytics/reviews/${id}/respond`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ response }),
    credentials: 'include'
  });

  const result = await handleResponse<Review>(res);
  return result.data;
}

/**
 * Get top viewed products analytics
 */
export async function getTopViewedProducts(token: string, limit: number = 10): Promise<AnalyticsData[]> {
  const response = await fetch(`${API_BASE_URL}/analytics/top-viewed?limit=${limit}`, {
    method: 'GET',
    headers: getAuthHeaders(token),
    credentials: 'include'
  });

  const result = await handleResponse<AnalyticsData[]>(response);
  return result.data;
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(token: string): Promise<{
  totalUsers: number;
  totalOrders: number;
  totalRevenue: string;
  totalProducts: number;
  pendingOrders: number;
  recentOrders: Order[];
}> {
 
  const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
    method: 'GET',
    headers: getAuthHeaders(token),
    credentials: 'include'
  });

  const result = await handleResponse<any>(response);
  return result.data;
}
// ==================== PRODUCT SIZES MANAGEMENT ====================

/**
 * Get all product sizes
 */
export async function getProductSizes(token: string): Promise<ProductSize[]> {
  const response = await fetch(`${API_BASE_URL}/products/sizes/all`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });

  const result = await handleResponse<ProductSize[]>(response);
  return result.data;
}

/**
 * Create product size
 */
export async function createProductSize(token: string, sizeData: Partial<ProductSize>): Promise<ProductSize> {
  const response = await fetch(`${API_BASE_URL}/products/sizes`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(sizeData)
  });

  const result = await handleResponse<ProductSize>(response);
  return result.data;
}

/**
 * Update product size
 */
export async function updateProductSize(token: string, id: number, sizeData: Partial<ProductSize>): Promise<ProductSize> {
  const response = await fetch(`${API_BASE_URL}/products/sizes/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(sizeData)
  });

  const result = await handleResponse<ProductSize>(response);
  return result.data;
}

/**
 * Delete product size
 */
export async function deleteProductSize(token: string, id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/sizes/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete product size');
  }
}

// ==================== PRODUCT VARIANTS MANAGEMENT ====================

/**
 * Get all product variants
 */
export async function getProductVariants(token: string, productId: number): Promise<ProductVariant[]> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/variants`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });

  const result = await handleResponse<ProductVariant[]>(response);
  return result.data;
}

/**
 * Get single product variant
 */
export async function getProductVariant(token: string, productId: number, variantId: number): Promise<ProductVariant> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/variants/${variantId}`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });

  const result = await handleResponse<ProductVariant>(response);
  return result.data;
}

/**
 * Create product variant
 */
export async function createProductVariant(token: string, productId: number, variantData: any): Promise<ProductVariant> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/variants`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(variantData)
  });

  const result = await handleResponse<ProductVariant>(response);
  return result.data;
}

/**
 * Update product variant
 */
export async function updateProductVariant(token: string, productId: number, variantId: number, variantData: any): Promise<ProductVariant> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/variants/${variantId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(variantData)
  });

  const result = await handleResponse<ProductVariant>(response);
  return result.data;
}

/**
 * Delete product variant
 */
export async function deleteProductVariant(token: string, productId: number, variantId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/variants/${variantId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete product variant');
  }
}

// ==================== REVISIONS MANAGEMENT ====================

/**
 * Get revisions log
 */
export async function getRevisions(token: string, productId?: number, limit: number = 50): Promise<Revision[]> {
  let url = `${API_BASE_URL}/revisions?limit=${limit}`;
  if (productId) {
    url += `&productId=${productId}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });

  const result = await handleResponse<Revision[]>(response);
  return result.data;
}

/**
 * Get product revisions
 */
export async function getProductRevisions(token: string, productId: number, limit: number = 20): Promise<Revision[]> {
  const response = await fetch(`${API_BASE_URL}/revisions/product/${productId}?limit=${limit}`, {
    method: 'GET',
    headers: getAuthHeaders(token)
  });

  const result = await handleResponse<Revision[]>(response);
  return result.data;
}

/**
 * Restore previous revision
 */
export async function restoreRevision(token: string, revisionId: number, comment?: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/revisions/${revisionId}/restore`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ comment })
  });

  const result = await handleResponse<any>(response);
  return result.data;
}

/**
 * Compare two revisions
 */
export async function compareRevisions(token: string, revisionId1: number, revisionId2: number): Promise<RevisionCompare> {
  const response = await fetch(`${API_BASE_URL}/revisions/compare`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ revisionId1, revisionId2 })
  });

  const result = await handleResponse<RevisionCompare>(response);
  return result.data;
}