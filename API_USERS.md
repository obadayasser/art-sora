# 📱 Public API Documentation

هذا الملف يوضح جميع endpoints المتاحة للمستخدمين العام

---

## 🔐 Authentication

جميع الطلبات يجب أن تتضمن:
- `X-Device-ID`: معرف الجهاز الفريد (**إلزامي**)
- `X-App-ID`: معرف التطبيق (اختياري - يتم إنشاؤه تلقائياً من قبل الخادم)
- `Content-Type: application/json`
- `Authorization: Bearer {token}` (للمستخدمين المسجلين فقط)

**ملاحظة مهمة:**
- `X-Device-ID` هو معرف فريد للجهاز (مثل: UUID أو device fingerprint)
- إذا لم ترسل `X-App-ID`، سيقوم الخادم بإنشاء واحد جديد وإرجاعه في Response Headers
- احفظ `X-App-ID` من الاستجابة الأولى واستخدمه في الطلبات التالية
---

## 📦 Endpoints
 

#### التحقق من الجهاز
```
POST /api/v1/auth/verify-device
Content-Type: application/json

{
  "userAgent": "Mozilla/5.0...",
  "fingerprint": "device-fingerprint"
}

Response (200):
{
  "appId": "uuid",
  "data": {
    "deviceId": 1,
    "isTrusted": true
  }
}
```

---

### 2. **الفئات والمنتجات (Categories & Products)**

#### الحصول على جميع الفئات
```
GET /api/v1/categories?active=true

Response (200):
{
  "appId": "uuid",
  "data": [
    {
      "id": 1,
      "nameAr": "إطارات",
      "nameEn": "Frames",
      "slug": "frames",
      "isActive": true,
      "sortOrder": 0,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### الحصول على فئة واحدة
```
GET /api/v1/categories/:id

Response (200):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "nameAr": "إطارات",
    "nameEn": "Frames",
    "slug": "frames",
    "subCategories": [],
    "isActive": true
  }
}
```

#### الحصول على فئة بالـ slug
```
GET /api/v1/categories/slug/:slug

Response (200):
{
  "appId": "uuid",
  "data": {...}
}
```

#### البحث عن المنتجات
```
GET /api/v1/products?page=1&limit=20&active=true&categoryId=1

Response (200):
{
  "appId": "uuid",
  "data": [
    {
      "id": 1,
      "sku": "PROD001",
      "nameAr": "إطار ذهبي",
      "nameEn": "Gold Frame",
      "slug": "gold-frame",
      "basePrice": "100.00",
      "salePrice": "80.00",
      "stockQuantity": 50,
      "isActive": true,
      "images": [
        {
          "id": 1,
          "imageUrl": "/uploads/products/image-uuid.jpg",
          "thumbnailUrl": "/uploads/thumbnails/thumb-uuid.jpg",
          "isPrimary": true,
          "sortOrder": 0
        }
      ],
      "variants": [
        {
          "id": 1,
          "productId": 1,
          "sizeId": 1,
          "sizeName": "20×30 cm",
          "sizeDimensions": "20×30 cm",
          "nameAr": "20×30 سم",
          "nameEn": "20×30 cm",
          "sku": "PROD001-1",
          "basePrice": "80.00",
          "salePrice": "64.00",
          "discountPercentage": "20.00",
          "stockQuantity": 50,
          "colorAr": "أبيض",
          "colorEn": "White",
          "colorHex": "#FFFFFF",
          "imageUrl": "/uploads/products/image-uuid.jpg",
          "isActive": true,
          "isDefault": true,
          "sortOrder": 0
        },
        {
          "id": 2,
          "productId": 1,
          "sizeId": 2,
          "sizeName": "30×40 cm",
          "sizeDimensions": "30×40 cm",
          "nameAr": "30×40 سم",
          "nameEn": "30×40 cm",
          "sku": "PROD001-2",
          "basePrice": "100.00",
          "salePrice": "80.00",
          "discountPercentage": "20.00",
          "stockQuantity": 35,
          "colorAr": "ذهبي",
          "colorEn": "Gold",
          "colorHex": "#FFD700",
          "imageUrl": "/uploads/products/image-uuid.jpg",
          "isActive": true,
          "isDefault": false,
          "sortOrder": 1
        }
      ]
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pageSize": 20,
    "totalPages": 5
  }
}
```

#### الحصول على منتج واحد
```
GET /api/v1/products/:id

Response (200):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "sku": "PROD001",
    "nameAr": "إطار ذهبي",
    "nameEn": "Gold Frame",
    "slug": "gold-frame",
    "basePrice": "100.00",
    "salePrice": "80.00",
    "stockQuantity": 50,
    "isActive": true,
    "images": [...],
    "variants": [
      {
        "id": 1,
        "productId": 1,
        "sizeId": 1,
        "sizeName": "20×30 cm",
        "sizeDimensions": "20×30 cm",
        "nameAr": "20×30 سم",
        "nameEn": "20×30 cm",
        "sku": "PROD001-1",
        "basePrice": "80.00",
        "salePrice": "64.00",
        "discountPercentage": "20.00",
        "stockQuantity": 50,
        "colorAr": "أبيض",
        "colorEn": "White",
        "colorHex": "#FFFFFF",
        "imageUrl": "/uploads/products/image-uuid.jpg",
        "isActive": true,
        "isDefault": true,
        "sortOrder": 0
      }
    ]
  }
}
```

#### الحصول على منتج بالـ slug
```
GET /api/v1/products/slug/:slug

Response (200):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "sku": "PROD001",
    "nameAr": "إطار ذهبي",
    "basePrice": "100.00",
    "images": [...],
    "variants": [...]
  }
}
```

#### الحصول على جميع المقاسات المتاحة
```
GET /api/v1/products/sizes/all

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
    },
    {
      "id": 4,
      "name": "50×70 cm",
      "width": "50.00",
      "height": "70.00",
      "unit": "cm",
      "sortOrder": 4,
      "isActive": true
    },
    {
      "id": 5,
      "name": "60×80 cm",
      "width": "60.00",
      "height": "80.00",
      "unit": "cm",
      "sortOrder": 5,
      "isActive": true
    },
    {
      "id": 6,
      "name": "70×100 cm",
      "width": "70.00",
      "height": "100.00",
      "unit": "cm",
      "sortOrder": 6,
      "isActive": true
    },
    {
      "id": 7,
      "name": "100×150 cm",
      "width": "100.00",
      "height": "150.00",
      "unit": "cm",
      "sortOrder": 7,
      "isActive": true
    }
  ]
}
```

#### الحصول على جميع متغيرات المنتج
```
GET /api/v1/products/:productId/variants

Response (200):
{
  "appId": "uuid",
  "data": [
    {
      "id": 1,
      "productId": 1,
      "sizeId": 1,
      "sizeName": "20×30 cm",
      "sizeDimensions": "20×30 cm",
      "nameAr": "20×30 سم",
      "nameEn": "20×30 cm",
      "sku": "PROD001-1",
      "basePrice": "80.00",
      "salePrice": "64.00",
      "discountPercentage": "20.00",
      "stockQuantity": 50,
      "colorAr": "أبيض",
      "colorEn": "White",
      "colorHex": "#FFFFFF",
      "imageUrl": "/uploads/products/image-uuid.jpg",
      "isActive": true,
      "isDefault": true,
      "sortOrder": 0
    }
  ]
}
```

#### الحصول على متغير واحد
```
GET /api/v1/products/:productId/variants/:variantId

Response (200):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "productId": 1,
    "sizeId": 1,
    "sizeName": "20×30 cm",
    "sizeDimensions": "20×30 cm",
    "nameAr": "20×30 سم",
    "nameEn": "20×30 cm",
    "sku": "PROD001-1",
    "basePrice": "80.00",
    "salePrice": "64.00",
    "discountPercentage": "20.00",
    "stockQuantity": 50,
    "colorAr": "أبيض",
    "colorEn": "White",
    "colorHex": "#FFFFFF",
    "isActive": true,
    "isDefault": true
  }
}
```

---

### 3. **الدول والمحافظات (Locations)**

#### الحصول على جميع الدول
```
GET /api/v1/locations/countries?active=true

Response (200):
{
  "appId": "uuid",
  "data": [
    {
      "id": 1,
      "nameAr": "مصر",
      "nameEn": "Egypt",
      "code": "EG",
      "phoneCode": "+20",
      "isActive": true
    }
  ]
}
```

#### الحصول على دولة واحدة
```
GET /api/v1/locations/countries/:id

Response (200):
{
  "appId": "uuid",
  "data": {...}
}
```

#### الحصول على المحافظات
```
GET /api/v1/locations/governorates?countryId=1&active=true

Response (200):
{
  "appId": "uuid",
  "data": [
    {
      "id": 1,
      "countryId": 1,
      "nameAr": "القاهرة",
      "nameEn": "Cairo",
      "shippingCost": "50.00",
      "estimatedDays": 2,
      "isActive": true
    }
  ]
}
```

#### الحصول على تفاصيل الشحن
```
GET /api/v1/locations/shipping-details/:countryId/:governorateId

Response (200):
{
  "appId": "uuid",
  "data": {
    "shippingCost": "50.00",
    "estimatedDays": 2,
    "countryName": {
      "ar": "مصر",
      "en": "Egypt"
    },
    "governorateName": {
      "ar": "القاهرة",
      "en": "Cairo"
    }
  }
}
```

---

### 4. **أكواد الخصم (Discount Codes)**

#### التحقق من كود الخصم
```
POST /api/v1/discounts/validate
Content-Type: application/json

{
  "code": "SUMMER20",
  "subtotal": "500.00"
}

Response (200):
{
  "appId": "uuid",
  "data": {
    "isValid": true,
    "code": "SUMMER20",
    "discountType": "PERCENTAGE",
    "discountValue": "20",
    "discountAmount": "100.00",
    "message": "كود الخصم صحيح"
  }
}
```

---

### 5. **الطلبات (Orders)**

#### إنشاء طلب جديد
```
POST /api/v1/orders
Content-Type: application/json

{
  "customerEmail": "customer@example.com",
  "customerName": "أحمد محمد",
  "customerPhone": "01000000000",
  "countryId": 1,
  "governorateId": 1,
  "city": "القاهرة",
  "addressLine1": "شارع النيل",
  "addressLine2": "الدور الثاني",
  "items": [
    {
      "productId": 1,
      "sizeId": 1,
      "quantity": 2,
      "isCustomized": false
    }
  ],
  "discountCode": "SUMMER20",
  "paymentMethod": "credit_card"
}

Response (201):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "orderNumber": "ORD-20240101-0001",
    "customerEmail": "customer@example.com",
    "subtotal": "200.00",
    "discountAmount": "20.00",
    "shippingCost": "50.00",
    "taxAmount": "18.00",
    "totalAmount": "248.00",
    "status": "PENDING",
    "items": [...]
  }
}
```

---

### 6. **البحث والتحليلات (Analytics)**

#### البحث عن المنتجات
```
POST /api/v1/analytics/search
Content-Type: application/json

{
  "query": "إطار",
  "categoryIds": [1, 2],
  "sortBy": "popularity",
  "page": 1,
  "limit": 20
}

Response (200):
{
  "appId": "uuid",
  "results": [
    {
      "id": 1,
      "sku": "PROD001",
      "nameAr": "إطار ذهبي",
      "nameEn": "Gold Frame",
      "basePrice": "100.00",
      "images": [...]
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "pageSize": 20
  }
}
```

#### تسجيل مشاهدة المنتج
```
POST /api/v1/analytics/products/:id/view

Response (200):
{
  "message": "تم تسجيل المشاهدة",
  "appId": "uuid"
}
```

#### الحصول على تقييمات المنتج
```
GET /api/v1/analytics/reviews/product/:id?onlyApproved=true

Response (200):
{
  "appId": "uuid",
  "data": [
    {
      "id": 1,
      "productId": 1,
      "rating": 5,
      "reviewTitle": "منتج رائع",
      "reviewText": "جودة عالية جداً",
      "customerName": "أحمد",
      "isApproved": true,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### إضافة تقييم
```
POST /api/v1/analytics/reviews
Content-Type: application/json

{
  "productId": 1,
  "rating": 5,
  "reviewTitle": "منتج رائع",
  "reviewText": "جودة عالية جداً",
  "customerName": "أحمد"
}

Response (201):
{
  "appId": "uuid",
  "data": {
    "id": 1,
    "productId": 1,
    "rating": 5,
    "isApproved": false,
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 7. **البريد الإلكتروني (Email Notifications)**

#### الرسائل التلقائية

التطبيق يرسل رسائل بريد إلكترونية تلقائياً في الحالات التالية:

**1. عند إنشاء طلب جديد:**
```
To: customer@example.com
Subject: تأكيد الطلب - ORD-20250129-1234

المحتوى:
- رقم الطلب
- تفاصيل المنتجات
- الإجمالي
- عنوان التوصيل
```

**2. عند تحديث حالة الطلب (من Admin):**
```
To: customer@example.com
Subject: تحديث حالة طلبك

الحالات الممكنة:
- تم تأكيد الطلب ✅
- جاري المعالجة ⏳
- تم الشحن 🚚
- تم التوصيل 📦
- تم الإلغاء ❌
```

ملاحظة: الرسائل تُرسل **تلقائياً** بدون تدخل منك.

---

### 8. **الإشعارات (Firebase Cloud Messaging)**

**ملاحظة مهمة:** الإشعارات (Push Notifications) مخصصة للمستخدمين **المسجلين فقط** (بتسجيل دخول).

إذا كنت عميلاً عادياً (بدون حساب):
- ✅ تستقبل **بريد إلكتروني** عند إنشاء أو تحديث الطلب
- ❌ لا تستقبل إشعارات push (لا تملك حساب للربط)

إذا كنت مستخدماً مسجل دخول:
- ✅ تستقبل **بريد إلكتروني** عند تحديث الطلب
- ✅ تستقبل **إشعار push** عند تحديث الحالة (اختياري)

---

#### تسجيل FCM Token (للمستخدمين المسجلين فقط)
```
POST /api/v1/devices/{deviceId}/fcm-token
Content-Type: application/json

{
  "fcmToken": "c8Pg-zSQT_E:APA91bGl_KQpAQXdJYZQR7a3GkI..."
}

Response (200):
{
  "success": true,
  "message": "FCM token updated successfully"
}
```

---

#### تفعيل الإشعارات
```
POST /api/v1/devices/{deviceId}/notifications/enable

Response (200):
{
  "success": true,
  "message": "Notifications enabled successfully"
}
```

---

#### تعطيل الإشعارات
```
POST /api/v1/devices/{deviceId}/notifications/disable

Response (200):
{
  "success": true,
  "message": "Notifications disabled successfully"
}
```

---

#### اختبار الإشعارات
```
POST /api/v1/devices/{deviceId}/test-notification

Response (200):
{
  "success": true,
  "message": "Test notification sent successfully"
}
```

---

#### الحصول على حالة الإشعارات
```
GET /api/v1/devices/{deviceId}/notifications/status

Response (200):
{
  "notificationsEnabled": true,
  "hasFCMToken": true,
  "fcmTokenUpdatedAt": "2025-01-29T10:30:00Z"
}
```

---

## 📧 ملخص قنوات التواصل

| القناة | المستخدم العادي | المستخدم المسجل |
|--------|-----------------|-----------------|
| **البريد الإلكتروني** | ✅ عند الطلب والتحديث | ✅ عند الطلب والتحديث |
| **إشعارات Push** | ❌ غير متاح | ✅ عند التحديث (اختياري) |

---

## 🚨 Error Responses
 
```

### 404 - Not Found
```json
{
  "statusCode": 404,
  "message": "المنتج غير موجود",
  "error": "Not Found"
}
```

### 429 - Rate Limit Exceeded
```json
{
  "statusCode": 429,
  "message": "تم تجاوز حد الطلبات",
  "retryAfter": 60
}
```

---

## 📊 Rate Limiting

- **Read endpoints**: 200 requests per minute
- **Write endpoints**: 100 requests per 15 minutes
- **Auth endpoints**: 5 attempts per 15 minutes
- **Upload endpoints**: 10 uploads per hour

---

## 💡 Tips

1. احفظ `X-App-ID` من الاستجابة الأولى
2. استخدم `slug` للوصول السريع إلى الفئات والمنتجات
3. تحقق دائماً من كود الخصم قبل إنشاء الطلب
4. بيانات الصور ترجع مع رابط مباشر يمكن استخدامه فوراً
