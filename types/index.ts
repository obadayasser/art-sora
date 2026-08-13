export interface Category {
  id: number;
  nameAr: string;
  nameEn: string;
  slug: string;
  isActive: boolean;
  sortOrder: number;
  subCategories?: Category[];
  createdAt: string;
  descriptionAr?: string;
  descriptionEn?: string;

}

export interface ProductSize {
  id: number;
  name: string;
  width: string;
  height: string;
  unit: string;
  sortOrder: number;
  isActive: boolean;
}

export interface ProductVariant {
  id: number;
  productId: number;
  sizeId: number;
  sizeName: string;
  sizeDimensions: string;
  nameAr: string;
  nameEn: string;
  sku: string;
  basePrice: string;
  salePrice: string | null;
  discountPercentage: string;
  stockQuantity: number;
  colorAr: string;
  colorEn: string;
  colorHex: string;
  imageUrl?: string;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: number;
  imageUrl: string;
  thumbnailUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface Product {
  id: number;
  sku: string;
  nameAr: string;
  nameEn: string;
  slug: string;
  descriptionAr?: string;
  descriptionEn?: string;
  basePrice: string;
  salePrice?: string;
  stockQuantity: number;
  isActive: boolean;
  categoryId: number;
  category?: Category;
  images: ProductImage[];
  variants?: ProductVariant[];
  createdAt: string;
  isFeatured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  sizeId?: number;
  isCustomized?: boolean;
}

export interface Country {
  id: number;
  nameAr: string;
  nameEn: string;
  code: string;
  phoneCode: string;
  isActive: boolean;
  sortOrder: number;
}

export interface Governorate {
  id: number;
  countryId: number;
  sortOrder: number;
  nameAr: string;
  nameEn: string;
  shippingCost: string;
  estimatedDays: number;
  code: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  appId: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

// ====== ADMIN TYPES ======

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  phone?: string;
  role: 'ADMIN' | 'SUPER_ADMIN';
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  user: AdminUser;
  requiresTwoFactor?: boolean; // Add this field
}

export interface TwoFactorSetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}

export interface TwoFactorVerifyResponse {
  isValid: boolean;
  message: string;
}

export type ProductStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';

export type DiscountType = 'PERCENTAGE' | 'FIXED_AMOUNT';

export interface DiscountCode {
  id: number;
  code: string;
  descriptionAr: string;
  descriptionEn: string;
  discountType: DiscountType;
  discountValue: string;
  minOrderAmount: string;
  maxDiscountAmount: string;
  usageLimit: number;
  usageLimitPerDevice: number;
  validFrom: string;
  validUntil: string;
  appliesToProducts: boolean;
  appliesToShipping: boolean;
  productIds: number[];
  categoryIds: number[];
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  subtotal: string;
  discountAmount: string;
  shippingCost: string;
  totalAmount: string;
  status: ProductStatus;
  notes?: string;
  shippingAddress?: {
    fullName: string;
    phone: string;
    country: string;
    governorate: string;
    address: string;
  };
  items: OrderItem[];
  discountCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productNameAr: string;
  productNameEn: string;
  quantity: number;
  unitPrice: string;
  customizationPrice?: string;
  isCustomized: boolean;
  sizeName?: string;
}

export interface Review {
  id: number;
  productId: number;
  productName?: string;
  rating: number;
  reviewTitle: string;
  reviewText: string;
  customerName: string;
  isApproved: boolean;
  adminResponse?: string;
  respondedAt?: string;
  createdAt: string;
}

export interface AnalyticsData {
  productId: number;
  productName: string;
  viewCount: number;
  lastViewedAt: string;
}

export interface Revision {
  id: number;
  productId: number;
  productNameAr: string;
  productNameEn: string;
  changedBy: {
    id: number;
    fullName: string;
    role: string;
  };
  changes: Record<string, any>;
  previousValues: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  browser: string;
  os: string;
  deviceType: string;
  timestamp: string;
  comment?: string;
}

export interface RevisionCompare {
  changes: Array<{
    field: string;
    from: any;
    to: any;
  }>;
}

