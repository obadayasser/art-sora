# 🔐 Admin API Documentation

هذا الملف يوضح جميع endpoints الإدارية (Admin Only)

---

## 🔐 Admin Authentication

جميع الطلبات الإدارية تتطلب:
1. `Authorization: Bearer {JWT_TOKEN}` 
2. دور المستخدم: `ADMIN` أو `SUPER_ADMIN`
3. `X-App-ID`: معرّف التطبيق

### 1. **تسجيل الدخول للإدارة**

```
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "secure_password_123"
}

Response (200):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "email": "admin@example.com",
    "role": "ADMIN",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 86400
  }
}
```

### 2. **تفعيل المصادقة الثنائية (2FA)**

```
POST /api/v1/auth/2fa/setup
Authorization: Bearer {JWT_TOKEN}

Response (200):
{
  "appId": "uuid",
  "data": {
    "secret": "JBSWY3DPEBLW64TMMQ======",
    "qrCode": "data:image/png;base64,...",
    "backupCodes": [
      "ABCD1234",
      "EFGH5678",
      ...
    ]
  }
}
```

### 3. **التحقق من كود 2FA**

```
POST /api/v1/auth/2fa/verify
Content-Type: application/json

{
  "code": "123456"
}

Response (200):
{
  "appId": "uuid",
  "data": {
    "isValid": true,
    "message": "تم التحقق بنجاح"
  }
}
```

---

## 👥 إدارة المستخدمين (Users Management)

### إنشاء مستخدم إداري جديد
```
POST /api/v1/users
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "email": "newadmin@example.com",
  "password": "secure_password_123",
  "fullName": "أحمد محمد",
  "phone": "01000000000",
  "role": "ADMIN"
}

Response (201):
{
  "appId": "uuid",
  "data": {
    "id": 2,
    "email": "newadmin@example.com",
    "fullName": "أحمد محمد",
    "role": "ADMIN",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### الحصول على جميع المستخدمين
```
GET /api/v1/users
Authorization: Bearer {JWT_TOKEN}

Response (200):
{
  "appId": "uuid",
  "data": [
    {
      "id": 1,
      "email": "admin@example.com",
      "fullName": "محمد علي",
      "role": "ADMIN",
      "isActive": true,
      "lastLoginAt": "2024-01-01T12:00:00Z"
    }
  ]
}
```

### تحديث مستخدم
```
PUT /api/v1/users/:id
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "fullName": "أحمد محمد",
  "phone": "01000000001",
  "isActive": true
}

Response (200):
{
  "appId": "uuid",
  "data": {...}
}
```

### حذف مستخدم
```
DELETE /api/v1/users/:id
Authorization: Bearer {JWT_TOKEN}

Response (204): No Content
```

---

## 📦 إدارة الفئات (Categories Management)

### إنشاء فئة جديدة
```
POST /api/v1/categories
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "nameAr": "إطارات",
  "nameEn": "Frames",
  "slug": "frames",
  "descriptionAr": "إطارات جميلة",
  "descriptionEn": "Beautiful frames",
  "sortOrder": 0,
  "metaTitle": "Frames - Art Frames",
  "metaDescription": "Amazing frames collection"
}

Response (201):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "nameAr": "إطارات",
    "nameEn": "Frames",
    "slug": "frames",
    "isActive": true
  }
}
```

### تحديث فئة
```
PUT /api/v1/categories/:id
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "nameAr": "إطارات فاخرة",
  "isActive": true,
  "sortOrder": 1
}

Response (200):
{
  "appId": "uuid",
  "data": {...}
}
```

### حذف فئة
```
DELETE /api/v1/categories/:id
Authorization: Bearer {JWT_TOKEN}

Response (204): No Content
```

---

## 📷 إدارة المنتجات (Products Management)

### إنشاء منتج جديد
```
POST /api/v1/products
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "sku": "PROD001",
  "nameAr": "إطار ذهبي",
  "nameEn": "Gold Frame",
  "slug": "gold-frame",
  "descriptionAr": "إطار فاخر بلون ذهبي",
  "descriptionEn": "Luxury gold frame",
  "productTypeId": 1,
  "categoryId": 1,
  "basePrice": "100.00",
  "salePrice": "80.00",
  "allowsCustomization": true,
  "customizationPrice": "20.00",
  "stockQuantity": 100,
  "isUnlimitedStock": false
}

Response (201):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "sku": "PROD001",
    "nameAr": "إطار ذهبي",
    "basePrice": "100.00",
    "stockQuantity": 100
  }
}
```

### رفع صورة للمنتج
```
POST /api/v1/products/:id/images
Authorization: Bearer {JWT_TOKEN}
Content-Type: multipart/form-data

Form Data:
- image: [binary file]
- isPrimary: true

Response (201):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "imageUrl": "/uploads/products/image-uuid.jpg",
    "thumbnailUrl": "/uploads/thumbnails/thumb-uuid.jpg",
    "isPrimary": true,
    "sortOrder": 0
  }
}
```

### رفع عدة صور دفعة واحدة
```
POST /api/v1/products/:id/images/batch
Authorization: Bearer {JWT_TOKEN}
Content-Type: multipart/form-data

Form Data:
- images: [multiple files]

Response (201):
{
  "appId": "uuid",
  "data": [
    {
      "id": 1,
      "imageUrl": "/uploads/products/image-uuid1.jpg",
      "thumbnailUrl": "/uploads/thumbnails/thumb-uuid1.jpg"
    },
    {
      "id": 2,
      "imageUrl": "/uploads/products/image-uuid2.jpg",
      "thumbnailUrl": "/uploads/thumbnails/thumb-uuid2.jpg"
    }
  ]
}
```

### تحديث منتج
```
PUT /api/v1/products/:id
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "nameAr": "إطار ذهبي فاخر",
  "basePrice": "120.00",
  "salePrice": "90.00",
  "stockQuantity": 80,
  "isActive": true,
  "isFeatured": true
}

Response (200):
{
  "appId": "uuid",
  "data": {...}
}
```

### حذف صورة من المنتج
```
DELETE /api/v1/products/:id/images/:imageId
Authorization: Bearer {JWT_TOKEN}

Response (204): No Content
```

### حذف منتج
```
DELETE /api/v1/products/:id
Authorization: Bearer {JWT_TOKEN}

Response (204): No Content
```

### الحصول على جميع المقاسات المتاحة
```
GET /api/v1/products/sizes/all
Authorization: Bearer {JWT_TOKEN}

Response (200):
{
  "appId": "uuid",
  "data": [
    {
      "id": 1,
      "name": "20×30 cm",
      "width": "20.00",
      "height": "30.00",
      "unit": "cm",
      "sortOrder": 1,
      "isActive": true
    },
    {
      "id": 2,
      "name": "30×40 cm",
      "width": "30.00",
      "height": "40.00",
      "unit": "cm",
      "sortOrder": 2,
      "isActive": true
    },
    {
      "id": 3,
      "name": "40×50 cm",
      "width": "40.00",
      "height": "50.00",
      "unit": "cm",
      "sortOrder": 3,
      "isActive": true
    }
  ]
}
```

---

## 📦 إدارة متغيرات المنتجات (Product Variants)

### إنشاء متغير جديد للمنتج (مقاس + سعر + لون)
```
POST /api/v1/products/:productId/variants
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "sizeId": 2,
  "nameAr": "30×40 سم",
  "nameEn": "30×40 cm",
  "sku": "PROD001-2",
  "basePrice": "200.00",
  "salePrice": "180.00",
  "stockQuantity": 50,
  "colorAr": "ذهبي",
  "colorEn": "Gold",
  "colorHex": "#FFD700",
  "imageUrl": "https://example.com/image.jpg",
  "isDefault": true,
  "sortOrder": 0
}

Response (201):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "productId": 1,
    "sizeId": 2,
    "sizeName": "30×40 cm",
    "sizeDimensions": "30×40 cm",
    "nameAr": "30×40 سم",
    "nameEn": "30×40 cm",
    "sku": "PROD001-2",
    "basePrice": "200.00",
    "salePrice": "180.00",
    "discountPercentage": "10.00",
    "stockQuantity": 50,
    "colorAr": "ذهبي",
    "colorEn": "Gold",
    "colorHex": "#FFD700",
    "imageUrl": "https://example.com/image.jpg",
    "isActive": true,
    "isDefault": true,
    "sortOrder": 0,
    "createdAt": "2026-01-30T00:00:00.000Z",
    "updatedAt": "2026-01-30T00:00:00.000Z"
  }
}
```

### الحصول على جميع متغيرات المنتج
```
GET /api/v1/products/:productId/variants
Authorization: Bearer {JWT_TOKEN}

Response (200):
{
  "appId": "uuid",
  "data": [
    {
      "id": 1,
      "productId": 1,
      "sizeId": 2,
      "sizeName": "30×40 cm",
      "sizeDimensions": "30×40 cm",
      "nameAr": "30×40 سم",
      "nameEn": "30×40 cm",
      "sku": "PROD001-2",
      "basePrice": "200.00",
      "salePrice": "180.00",
      "discountPercentage": "10.00",
      "stockQuantity": 50,
      "colorAr": "ذهبي",
      "colorEn": "Gold",
      "colorHex": "#FFD700",
      "isActive": true,
      "isDefault": true,
      "sortOrder": 0
    },
    {
      "id": 2,
      "productId": 1,
      "sizeId": 3,
      "sizeName": "40×50 cm",
      "sizeDimensions": "40×50 cm",
      "nameAr": "40×50 سم",
      "nameEn": "40×50 cm",
      "sku": "PROD001-3",
      "basePrice": "260.00",
      "salePrice": null,
      "discountPercentage": "0.00",
      "stockQuantity": 35,
      "colorAr": "أسود",
      "colorEn": "Black",
      "colorHex": "#000000",
      "isActive": true,
      "isDefault": false,
      "sortOrder": 1
    }
  ]
}
```

### الحصول على متغير واحد
```
GET /api/v1/products/:productId/variants/:variantId
Authorization: Bearer {JWT_TOKEN}

Response (200):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "productId": 1,
    "sizeId": 2,
    "sizeName": "30×40 cm",
    "sizeDimensions": "30×40 cm",
    "nameAr": "30×40 سم",
    "nameEn": "30×40 cm",
    "sku": "PROD001-2",
    "basePrice": "200.00",
    "salePrice": "180.00",
    "discountPercentage": "10.00",
    "stockQuantity": 50,
    "colorAr": "ذهبي",
    "colorEn": "Gold",
    "colorHex": "#FFD700",
    "isActive": true,
    "isDefault": true
  }
}
```

### تحديث متغير المنتج
```
PUT /api/v1/products/:productId/variants/:variantId
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "basePrice": "220.00",
  "salePrice": "200.00",
  "stockQuantity": 40,
  "colorAr": "فضي",
  "colorEn": "Silver",
  "colorHex": "#C0C0C0",
  "isActive": true,
  "isDefault": true
}

Response (200):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "basePrice": "220.00",
    "salePrice": "200.00",
    "discountPercentage": "9.09",
    "stockQuantity": 40,
    "colorAr": "فضي",
    "colorEn": "Silver",
    "colorHex": "#C0C0C0",
    "isActive": true,
    "isDefault": true
  }
}
```

### حذف متغير المنتج
```
DELETE /api/v1/products/:productId/variants/:variantId
Authorization: Bearer {JWT_TOKEN}

Response (204): No Content
```

---

## 🌍 إدارة الدول والمحافظات (Locations Management)

### إنشاء دولة
```
POST /api/v1/locations/countries
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "nameAr": "مصر",
  "nameEn": "Egypt",
  "code": "EG",
  "phoneCode": "+20",
  "sortOrder": 0
}

Response (201):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "nameAr": "مصر",
    "code": "EG"
  }
}
```

### إنشاء محافظة
```
POST /api/v1/locations/governorates
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "countryId": 1,
  "nameAr": "القاهرة",
  "nameEn": "Cairo",
  "code": "CA",
  "shippingCost": "50.00",
  "estimatedDays": 2,
  "sortOrder": 0
}

Response (201):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "nameAr": "القاهرة",
    "shippingCost": "50.00"
  }
}
```

### تحديث محافظة
```
PUT /api/v1/locations/governorates/:id
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "shippingCost": "60.00",
  "estimatedDays": 3,
  "isActive": true
}

Response (200):
{
  "appId": "uuid",
  "data": {...}
}
```

---

## 💳 إدارة أكواد الخصم (Discount Codes Management)

### إنشاء كود خصم
```
POST /api/v1/discounts
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "code": "SUMMER20",
  "descriptionAr": "خصم صيفي 20%",
  "descriptionEn": "Summer discount 20%",
  "discountType": "PERCENTAGE",
  "discountValue": "20",
  "minOrderAmount": "100.00",
  "maxDiscountAmount": "100.00",
  "usageLimit": 100,
  "usageLimitPerDevice": 1,
  "validFrom": "2024-06-01T00:00:00Z",
  "validUntil": "2024-08-31T23:59:59Z",
  "appliesToProducts": true,
  "appliesToShipping": false,
  "productIds": [1, 2, 3],
  "categoryIds": [1]
}

Response (201):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "code": "SUMMER20",
    "discountValue": "20",
    "isActive": true
  }
}
```

### تحديث كود خصم
```
PUT /api/v1/discounts/:id
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "discountValue": "25",
  "usageLimit": 200,
  "isActive": true
}

Response (200):
{
  "appId": "uuid",
  "data": {...}
}
```

### حذف كود خصم
```
DELETE /api/v1/discounts/:id
Authorization: Bearer {JWT_TOKEN}

Response (204): No Content
```

---

## 🛒 إدارة الطلبات (Orders Management)

### الحصول على جميع الطلبات
```
GET /api/v1/orders?page=1&limit=20&status=PENDING
Authorization: Bearer {JWT_TOKEN}

Response (200):
{
  "appId": "uuid",
  "data": [
    {
      "id": 1,
      "orderNumber": "ORD-20240101-0001",
      "customerEmail": "customer@example.com",
      "status": "PENDING",
      "totalAmount": "248.00",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8
  }
}
```

### الحصول على تفاصيل طلب
```
GET /api/v1/orders/:id
Authorization: Bearer {JWT_TOKEN}

Response (200):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "orderNumber": "ORD-20240101-0001",
    "customerName": "أحمد محمد",
    "customerEmail": "customer@example.com",
    "subtotal": "200.00",
    "discountAmount": "20.00",
    "shippingCost": "50.00",
    "totalAmount": "248.00",
    "status": "PENDING",
    "items": [
      {
        "productId": 1,
        "productNameAr": "إطار ذهبي",
        "quantity": 2,
        "unitPrice": "100.00"
      }
    ]
  }
}
```

### تحديث حالة الطلب
```
PUT /api/v1/orders/:id/status
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "status": "CONFIRMED",
  "notes": "تم التأكيد والدفع"
}

Response (200):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "status": "CONFIRMED",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

**حالات الطلب المتاحة:**
- `PENDING`: قيد الانتظار
- `CONFIRMED`: تم التأكيد
- `PROCESSING`: قيد المعالجة
- `SHIPPED`: تم الشحن
- `DELIVERED`: تم التسليم
- `CANCELLED`: تم الإلغاء
- `REFUNDED`: تم استرجاع المبلغ

---

## � إدارة التعديلات (Revisions Management)

### الحصول على سجل التعديلات
````
GET /api/v1/revisions?productId=1&limit=50
Authorization: Bearer {JWT_TOKEN}

Response (200):
{
  "appId": "uuid",
  "data": [
    {
      "id": 1,
      "productId": 1,
      "productNameAr": "إطار ذهبي",
      "productNameEn": "Gold Frame",
      "changedBy": {
        "id": 1,
        "fullName": "أحمد محمد",
        "role": "ADMIN"
      },
      "changes": {
        "nameAr": "إطار ذهبي فاخر",
        "basePrice": "120.00",
        "stockQuantity": 80
      },
      "previousValues": {
        "nameAr": "إطار ذهبي",
        "basePrice": "100.00",
        "stockQuantity": 100
      },
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "browser": "Chrome",
      "os": "Windows",
      "deviceType": "Desktop",
      "timestamp": "2024-01-30T12:00:00Z",
      "comment": "تحديث السعر والكمية"
    }
  ]
}
```

### الحصول على سجل تعديل منتج واحد
````
GET /api/v1/revisions/product/:id?limit=20
Authorization: Bearer {JWT_TOKEN}

Response (200):
{
  "appId": "uuid",
  "data": [
    {
      "id": 2,
      "productId": 1,
      "productNameAr": "إطار ذهبي فاخر",
      "changedBy": {...},
      "changes": {
        "salePrice": "90.00"
      },
      "previousValues": {
        "salePrice": "80.00"
      },
      "comment": "تحديث سعر الخصم"
    }
  ]
}
```

### استعادة نسخة سابقة
````
POST /api/v1/revisions/:id/restore
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "comment": "استعادة النسخة السابقة بسبب خطأ"
}

Response (200):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "productId": 1,
    "restoredValues": {
      "nameAr": "إطار ذهبي",
      "basePrice": "100.00",
      "stockQuantity": 100
    },
    "comment": "تم استعادة النسخة السابقة"
  }
}
```

### مقارنة نسختين
```
POST /api/v1/revisions/compare
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "revisionId1": 1,
  "revisionId2": 2
}

Response (200):
{
  "appId": "uuid",
  "data": {
    "changes": [
      {
        "field": "nameAr",
        "from": "إطار ذهبي",
        "to": "إطار ذهبي فاخر"
      },
      {
        "field": "basePrice",
        "from": "100.00",
        "to": "120.00"
      },
      {
        "field": "stockQuantity",
        "from": 100,
        "to": 80
      }
    ]
  }
}
```

**أنواع التعديلات المسجلة:**
- **عام**: تعديل بيانات المنتج الأساسية
- **سعر**: تغيير الأسعار (basePrice أو salePrice)
- **كمية**: تغيير مخزون المنتج
- **معلومات**: تعديل الأسماء والوصف
- **صور**: إضافة أو حذف صور المنتج

---

## �📊 إدارة التقييمات والمراجعات (Reviews Management)

### الموافقة على تقييم
```
POST /api/v1/analytics/reviews/:id/approve
Authorization: Bearer {JWT_TOKEN}

Response (200):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "productId": 1,
    "rating": 5,
    "isApproved": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

### الرد على تقييم
```
POST /api/v1/analytics/reviews/:id/respond
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json

{
  "response": "شكراً على تقييمك الرائع! نحن نقدر رأيك."
}

Response (200):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "adminResponse": "شكراً على تقييمك الرائع! نحن نقدر رأيك.",
    "respondedAt": "2024-01-01T12:00:00Z"
  }
}
```

### الحصول على إحصائيات
```
GET /api/v1/analytics/top-viewed?limit=10
Authorization: Bearer {JWT_TOKEN}

Response (200):
{
  "appId": "uuid",
  "data": [
    {
      "productId": 1,
      "productName": "إطار ذهبي",
      "viewCount": 1250,
      "lastViewedAt": "2024-01-01T12:00:00Z"
    }
  ]
}
```

---

## 🚨 HTTP Status Codes

- **200**: نجاح
- **201**: تم الإنشاء بنجاح
- **204**: تم الحذف بنجاح
- **400**: خطأ في الطلب
- **401**: غير مصرح (عدم تسجيل الدخول)
- **403**: ممنوع (دور غير كافي)
- **404**: غير موجود
- **429**: تم تجاوز حد الطلبات
- **500**: خطأ في الخادم

---

## ⚠️ ملاحظات أمان مهمة

1. **احفظ JWT Token بشكل آمن** - لا تشاركه
2. **استخدم 2FA** - لحماية حسابك
3. **تحديث كلمة المرور بانتظام**
4. **راجع سجلات الأنشطة بانتظام**
5. **استخدم HTTPS فقط** في الإنتاج
