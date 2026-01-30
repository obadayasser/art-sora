# 💳 دليل طرق الدفع - Payment Methods Guide

## 📋 الطرق المتاحة - Available Payment Methods

### 1. 💵 الدفع عند الاستلام (Cash on Delivery)
```json
{
  "paymentMethod": "CASH"
}
```
- **الوصف**: الدفع نقداً عند استلام الطلب
- **لا يتطلب**: تأكيد فوري
- **حالة الدفع**: `PENDING` حتى الاستلام

---

### 2. 📱 فودافون كاش (Vodafone Cash)
```json
{
  "paymentMethod": "VODAFONE_CASH"
}
```
- **الوصف**: التحويل عبر محفظة فودافون كاش
- **يتطلب**: تحويل المبلغ إلى رقم المحفظة المحدد
- **رقم المحفظة**: يظهر في تفاصيل الطلب بعد الإنشاء
- **المرجع**: استخدم رقم الطلب كمرجع للتحويل

**مثال على الاستجابة:**
```json
{
  "data": {
    "orderNumber": "ORD-20260130-0001",
    "paymentDetails": {
      "method": "VODAFONE_CASH",
      "walletNumber": "01012345678",
      "referenceNumber": "ORD-20260130-0001",
      "amount": 500,
      "instructions": [
        "قم بتحويل مبلغ 500 ج.م إلى رقم المحفظة 01012345678",
        "استخدم رقم الطلب كمرجع: ORD-20260130-0001",
        "سيتم شحن الطلب بعد تأكيد التحويل"
      ]
    }
  }
}
```

---

### 3. 💳 InstaPay
```json
{
  "paymentMethod": "INSTAPAY"
}
```
- **الوصف**: التحويل الفوري عبر InstaPay
- **يتطلب**: تحويل المبلغ إلى حساب InstaPay المحدد
- **اسم المستخدم**: يظهر في تفاصيل الطلب
- **المرجع**: استخدم رقم الطلب كمرجع

**مثال على الاستجابة:**
```json
{
  "data": {
    "orderNumber": "ORD-20260130-0001",
    "paymentDetails": {
      "method": "INSTAPAY",
      "username": "your_business@instapay.eg",
      "referenceNumber": "ORD-20260130-0001",
      "amount": 500,
      "instructions": [
        "قم بتحويل مبلغ 500 ج.م إلى حساب InstaPay: your_business@instapay.eg",
        "استخدم رقم الطلب كمرجع: ORD-20260130-0001",
        "سيتم شحن الطلب بعد تأكيد التحويل"
      ]
    }
  }
}
```

---

### 4. 🌐 الدفع الإلكتروني عبر PayMOP
```json
{
  "paymentMethod": "PAYMOP"
}
```
- **الوصف**: الدفع الإلكتروني عبر بطاقات الائتمان/الخصم
- **يتطلب**: التوجه لصفحة الدفع الآمنة
- **المزايا**: 
  - دفع فوري
  - دعم جميع البطاقات
  - آمن ومضمون

**مثال على الاستجابة:**
```json
{
  "data": {
    "orderNumber": "ORD-20260130-0001",
    "paymentDetails": {
      "method": "PAYMOP",
      "paymentUrl": "https://checkout.paymop.com/TXN1234567890",
      "transactionId": "TXN1234567890",
      "message": "الدفع الإلكتروني عبر PayMOP",
      "note": "سيتم توجيهك لصفحة الدفع الآمنة"
    }
  }
}
```

---

## 🚀 إنشاء طلب مع طريقة دفع

### Endpoint
```
POST /api/v1/orders
Content-Type: application/json
```

### Request Body
```json
{
  "customerEmail": "customer@example.com",
  "customerName": "أحمد محمد",
  "customerPhone": "01012345678",
  "countryId": 1,
  "governorateId": 1,
  "city": "القاهرة",
  "addressLine1": "شارع التحرير، مدينة نصر",
  "addressLine2": "عمارة 10، شقة 5",
  "postalCode": "11371",
  "items": [
    {
      "productId": 1,
      "sizeId": 1,
      "quantity": 2
    }
  ],
  "paymentMethod": "PAYMOP",
  "discountCode": "SUMMER20",
  "customerNotes": "يرجى التغليف بعناية"
}
```

### Response (Success - 201)
```json
{
  "appId": "uuid-here",
  "data": {
    "id": 1,
    "orderNumber": "ORD-20260130-0001",
    "status": "PENDING",
    "paymentStatus": "PENDING",
    "paymentMethod": "PAYMOP",
    "totalAmount": "500.00",
    "customerEmail": "customer@example.com",
    "customerName": "أحمد محمد",
    "items": [...],
    "paymentDetails": {
      "method": "PAYMOP",
      "paymentUrl": "https://checkout.paymop.com/TXN1234567890",
      "transactionId": "TXN1234567890"
    }
  }
}
```

---

## 🔔 PayMOP Webhook

عند اكتمال الدفع، سيرسل PayMOP إشعار (webhook) إلى النظام تلقائياً.

### Webhook Endpoint
```
POST /api/v1/payments/webhook
Content-Type: application/json
```

### Webhook Payload
```json
{
  "transactionId": "TXN1234567890",
  "merchantOrderId": "ORD-20260130-0001",
  "status": "SUCCESS",
  "amount": 500,
  "signature": "generated_signature_here"
}
```

### سيقوم النظام بـ:
1. التحقق من صحة التوقيع
2. تحديث حالة الدفع للطلب
3. تحديث حالة الطلب إلى `CONFIRMED` إذا تم الدفع

---

## ⚙️ إعداد PayMOP

### 1. إنشاء حساب PayMOP
- زيارة: https://accept.paymob.com
- إنشاء حساب تاجر
- الحصول على API Key و Secret

### 2. إضافة بيانات الحساب في `.env`
```env
PAYMOP_API_KEY=your_actual_api_key_here
PAYMOP_API_SECRET=your_actual_api_secret_here
PAYMOP_MERCHANT_ID=your_merchant_id_here
PAYMOP_BASE_URL=https://accept.paymob.com/api

# Callback URLs
PAYMOP_RETURN_URL=https://yourdomain.com/payment/success
PAYMOP_CANCEL_URL=https://yourdomain.com/payment/cancel
PAYMOP_WEBHOOK_URL=https://yourdomain.com/api/v1/payments/webhook
```

### 3. إعداد Webhook في لوحة PayMOP
- الدخول إلى لوحة التحكم PayMOP
- إعدادات > Webhooks
- إضافة URL: `https://yourdomain.com/api/v1/payments/webhook`

---

## 🔐 الأمان

### للدفع النقدي وفودافون كاش و InstaPay:
- يجب على الـ Admin تأكيد استلام الدفع يدوياً
- تحديث حالة الدفع من لوحة التحكم

### للدفع عبر PayMOP:
- جميع المعاملات مؤمنة بـ SSL
- التحقق من التوقيع في الـ Webhook
- تشفير البيانات الحساسة

---

## 📊 حالات الدفع - Payment Status

| Status | الوصف |
|--------|-------|
| `PENDING` | قيد الانتظار |
| `PROCESSING` | قيد المعالجة |
| `PAID` | تم الدفع |
| `FAILED` | فشل الدفع |
| `REFUNDED` | تم استرجاع المبلغ |

---

## 🧪 الاختبار في بيئة Development

في بيئة التطوير، PayMOP يعمل في وضع Mock:
- يتم توليد رابط دفع وهمي
- لا يتم الدفع الفعلي
- يمكنك محاكاة النجاح/الفشل عبر Webhook يدوي

### محاكاة webhook ناجح:
```bash
curl -X POST http://localhost:5000/api/v1/payments/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "transactionId": "TXN1234567890",
    "merchantOrderId": "ORD-20260130-0001",
    "status": "SUCCESS",
    "amount": 500,
    "signature": "test_signature"
  }'
```

---

## ❓ الأسئلة الشائعة

### كيف أغير طريقة الدفع بعد إنشاء الطلب؟
حالياً لا يمكن تغيير طريقة الدفع بعد إنشاء الطلب. يجب إنشاء طلب جديد.

### متى يتم شحن الطلب؟
- **CASH**: يتم الشحن مباشرة، الدفع عند الاستلام
- **VODAFONE_CASH / INSTAPAY**: بعد تأكيد التحويل من الـ Admin
- **PAYMOP**: يتم الشحن تلقائياً بعد نجاح الدفع

### ماذا لو فشل الدفع عبر PayMOP؟
- حالة الدفع ستكون `FAILED`
- يمكن للعميل المحاولة مرة أخرى
- أو إنشاء طلب جديد بطريقة دفع مختلفة

---

## 📞 الدعم الفني

لأي استفسارات أو مشاكل تقنية، تواصل مع فريق التطوير.
