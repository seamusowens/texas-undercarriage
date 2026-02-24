# Texas Undercarriage E-Commerce Website

A full-featured e-commerce platform for selling undercarriage parts, built with Next.js, Prisma, and Stripe.

## Features

- **Product Catalog**: Browse all undercarriage products from the trackshoe.xlsx inventory
- **Search & Filter**: Search by part number, name, supplier, and filter by profile
- **User Authentication**: Register and login with secure password hashing
- **Shopping Cart**: Add products to cart with quantity management
- **Stripe Checkout**: Secure payment processing via Stripe
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **Payments**: Stripe Checkout

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Update `.env` with your Stripe keys:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_key"
```

Get your Stripe keys from: https://dashboard.stripe.com/test/apikeys

### 3. Database Setup

The database is already initialized and seeded with products from the Excel file. If you need to reset:

```bash
npx prisma migrate reset
node prisma/seed.js
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Usage

### Customer Flow

1. **Browse Products**: Visit `/products` to see all available parts
2. **Search**: Use the search bar to find specific parts by number, name, or supplier
3. **Filter**: Filter products by profile type
4. **Add to Cart**: Click "Add to Cart" on any product
5. **Register/Login**: Create an account or sign in at `/auth/signin`
6. **Checkout**: Review cart at `/cart` and proceed to Stripe checkout
7. **Payment**: Complete payment with test card: `4242 4242 4242 4242`

### Test Stripe Payment

Use these test card details:
- Card Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

## Project Structure

```
texas-undercarriage/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── products/      # Product listing API
│   │   └── checkout/      # Stripe checkout API
│   ├── auth/              # Sign in/register pages
│   ├── products/          # Product catalog page
│   ├── cart/              # Shopping cart page
│   ├── success/           # Payment success page
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Home page
│   └── providers.tsx      # Session & cart context
├── lib/
│   └── prisma.ts          # Prisma client instance
├── prisma/
│   ├── schema.prisma      # Database schema
│   ├── seed.js            # Database seeding script
│   └── dev.db             # SQLite database
└── .env                   # Environment variables
```

## Database Schema

- **User**: Customer accounts with email/password
- **Product**: Parts from trackshoe.xlsx with pricing
- **Order**: Customer orders
- **OrderItem**: Individual items in orders

## Product Data

Products are imported from `~/914Systems/Tao_Link/Inventory/trackshoe.xlsx` with:
- Part numbers and names
- Technical specifications (weight, length, bolt hole diameter, pitch)
- Supplier information
- Profile types
- Auto-calculated pricing based on weight

## Customization

### Update Product Images

Replace placeholder images by updating the `imageUrl` field in the Product model.

### Modify Pricing

Edit the pricing formula in `prisma/seed.js`:
```javascript
price: Math.round((parseFloat(row.WeightKg) || 0) * 5 * 100) / 100
```

### Add More Filters

Add filter inputs in `app/products/page.tsx` and update the API query in `app/api/products/route.ts`.

## Production Deployment

1. Update `NEXTAUTH_SECRET` with a secure random string
2. Update `NEXTAUTH_URL` to your production domain
3. Switch to production Stripe keys
4. Consider migrating to PostgreSQL for production
5. Deploy to Vercel, AWS, or your preferred platform

## Support

For issues or questions, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
