# Admin Dashboard Guide

## Overview

This is a comprehensive admin dashboard for managing your e-commerce store. It's built with Next.js, TypeScript, and Tailwind CSS, following the API documentation specified in `API_ADMIN.md`.

## Features

### 1. Authentication & Security
- **Secure Login**: Admin-only authentication with JWT tokens
- **2FA Support**: Two-factor authentication for enhanced security
- **Role-Based Access**: Support for ADMIN and SUPER_ADMIN roles
- **Auto-expiration**: Automatic token management

### 2. Dashboard Overview
- **Real-time Statistics**: View total users, orders, revenue, and pending orders
- **Recent Orders**: Quick view of latest orders
- **Quick Actions**: Fast access to common tasks
- **Trend Analysis**: Visual indicators for performance trends

### 3. Users Management
- **List Users**: View all admin/staff accounts
- **Create Users**: Add new admin accounts
- **Edit Users**: Update user details and roles
- **Delete Users**: Remove user accounts
- **Status Management**: Activate/deactivate accounts
- **Search**: Quick search by name or email

### 4. Categories Management
- **List Categories**: View all product categories
- **Create Categories**: Add new categories with Arabic and English names
- **Edit Categories**: Update category details
- **Delete Categories**: Remove categories
- **Status & Sorting**: Activate/deactivate and reorder categories
- **SEO Support**: Meta title and description fields

### 5. Products Management
- **Product Grid**: Visual grid display with images
- **Create Products**: Add new products with all details
- **Edit Products**: Update product information
- **Delete Products**: Remove products
- **Image Upload**: Single and batch image uploads
- **Product Details**: View complete product information
- **Inventory Management**: Track stock quantities
- **Pricing**: Base price and sale price support
- **Customization**: Support for customizable products
- **Status & Featured**: Mark products as active/featured
- **Pagination**: Efficient handling of large product catalogs

### 6. Orders Management
- **Order List**: View all customer orders
- **Order Details**: Complete order information
- **Status Updates**: Update order status through workflow
- **Customer Info**: View customer details and shipping address
- **Order Items**: List of products in each order
- **Order Summary**: Pricing breakdown including discounts
- **Filtering**: Filter by status
- **Search**: Quick search by order number or customer
- **Pagination**: Handle large order volumes

### 7. Discount Codes Management
- **Code List**: View all promotional codes
- **Create Codes**: Add new discount codes
- **Edit Codes**: Update discount details
- **Delete Codes**: Remove discount codes
- **Flexible Discounts**: Percentage or fixed amount
- **Usage Limits**: Set total and per-device limits
- **Date Ranges**: Valid from and until dates
- **Targeting**: Apply to products, categories, or shipping
- **Expiration Tracking**: Visual indicator for expired codes

### 8. Reviews & Analytics Management
- **Reviews List**: View all customer reviews
- **Approve Reviews**: Approve pending reviews
- **Respond to Reviews**: Reply to customer feedback
- **Rating Distribution**: Visual distribution chart
- **Statistics**: Average rating, approved/pending counts
- **Filtering**: Filter by status and rating
- **Search**: Search by customer name or review content

### 9. Locations Management
- **Countries**: Manage countries with phone codes
- **Governorates**: Manage states/provinces with shipping costs
- **Tab Interface**: Easy switching between countries and governorates
- **Shipping Configuration**: Set shipping costs per region
- **Delivery Estimates**: Configure estimated delivery days
- **Status Management**: Activate/deactivate regions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Backend API running (as per API_ADMIN.md)

### Installation

1. **Clone the repository** (if not already done)

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and configure:
   ```
   NEXT_PUBLIC_API_URL=http://your-api-url/api/v1
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Access the admin dashboard**:
   - Open your browser to `http://localhost:4044/admin/login`
   - Login with your admin credentials

## File Structure

```
app/
  (admindashboard)/           # Admin dashboard route group
    layout.tsx               # Admin layout with sidebar
    login/
      page.tsx               # Login page with 2FA
    page.tsx                 # Dashboard overview
    users/
      page.tsx               # Users management
    categories/
      page.tsx               # Categories management
    products/
      page.tsx               # Products management
    orders/
      page.tsx               # Orders management
    discounts/
      page.tsx               # Discount codes management
    reviews/
      page.tsx               # Reviews management
    locations/
      page.tsx               # Locations management
contexts/
  AdminAuthContext.tsx       # Admin authentication context
lib/
  client/
    api-admin.ts             # Admin API client functions
    api-client.ts            # Base API client
types/
  index.ts                   # TypeScript interfaces
```

## API Integration

All admin endpoints are integrated according to `API_ADMIN.md`. The API client (`lib/client/api-admin.ts`) handles:

- Authentication headers (JWT, App-ID, Device-ID)
- Request/response handling
- Error handling
- FormData support for file uploads

### Authentication Flow

1. **Login**: POST `/api/v1/auth/login`
   - Returns JWT token and admin details
   - Token stored in localStorage

2. **2FA Setup**: POST `/api/v1/auth/2fa/setup`
   - Generates QR code and backup codes

3. **2FA Verify**: POST `/api/v1/auth/2fa/verify`
   - Validates 2FA code

### Request Headers

All authenticated requests include:
```
Authorization: Bearer {JWT_TOKEN}
X-App-ID: {UUID}
X-Device-ID: {UUID}
Content-Type: application/json
```

## Responsive Design

The dashboard is fully responsive:

- **Desktop (>1024px)**: Fixed sidebar, full-width content
- **Tablet (768px-1024px)**: Collapsible sidebar
- **Mobile (<768px)**: Hamburger menu, overlay sidebar

### Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## Theme Support

The dashboard supports both light and dark modes:
- Automatic system preference detection
- Manual theme toggle (inherited from main app)
- Consistent styling across themes

## Internationalization (i18n)

Arabic and English language support:
- Bilingual input fields (Arabic/English names, descriptions)
- RTL support for Arabic
- Language switcher (inherited from main app)

## Security Features

1. **Authentication**:
   - JWT-based authentication
   - Token expiration handling
   - Role-based access control

2. **Data Protection**:
   - Secure API communication
   - Input validation
   - XSS prevention

3. **2FA Support**:
   - Two-factor authentication
   - Backup codes
   - QR code generation

## Troubleshooting

### Login Issues

1. **Check API URL**: Ensure `NEXT_PUBLIC_API_URL` is correct
2. **Verify Credentials**: Confirm admin email and password
3. **Check 2FA**: If 2FA is enabled, have your authenticator app ready
4. **Console Logs**: Check browser console for errors

### Data Not Loading

1. **API Status**: Verify backend API is running
2. **Network Tab**: Check browser DevTools Network tab for failed requests
3. **Token Valid**: Ensure token hasn't expired (logout and login again)
4. **CORS**: Check CORS settings on backend

### File Upload Issues

1. **File Size**: Ensure images are under size limits
2. **File Type**: Verify supported image formats (JPG, PNG, GIF)
3. **Network**: Check internet connection for large uploads

## Best Practices

### For Admins

1. **Use Strong Passwords**: Minimum 8 characters with mix of characters
2. **Enable 2FA**: Recommended for all admin accounts
3. **Regular Updates**: Update product information regularly
4. **Monitor Orders**: Check pending orders frequently
5. **Review Reviews**: Moderate reviews promptly
6. **Secure Sessions**: Always logout after use

### For Developers

1. **Type Safety**: All code is typed with TypeScript
2. **Error Handling**: Proper error handling with user feedback
3. **Loading States**: Show loading indicators for async operations
4. **Responsive Testing**: Test on various screen sizes
5. **API Documentation**: Refer to `API_ADMIN.md` for endpoint details

## Customization

### Adding New Pages

1. Create new folder in `app/(admindashboard)/`
2. Add `page.tsx` with your component
3. Update navigation in `layout.tsx`

### Adding New API Endpoints

1. Add function to `lib/client/api-admin.ts`
2. Update TypeScript interfaces in `types/index.ts`
3. Use the function in your components

### Styling

The dashboard uses Tailwind CSS:
- Primary colors: Blue (#2563eb, #1d4ed8)
- Success colors: Green (#16a34a, #15803d)
- Warning colors: Yellow (#ca8a04, #a16207)
- Danger colors: Red (#dc2626, #b91c1c)

## Future Enhancements

Potential improvements:
- [ ] Real-time notifications for new orders
- [ ] Advanced analytics and charts
- [ ] Export data to CSV/Excel
- [ ] Bulk actions (delete, update status)
- [ ] Email notifications integration
- [ ] Activity logs and audit trail
- [ ] Advanced filtering and sorting
- [ ] Product variations management
- [ ] Advanced discount rules

## Support

For issues or questions:
1. Check this documentation
2. Review `API_ADMIN.md` for API details
3. Check browser console for errors
4. Review Network tab in DevTools

## License

This dashboard is part of your e-commerce project. All rights reserved.
