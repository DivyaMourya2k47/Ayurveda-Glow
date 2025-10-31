# Ayurveda Glow E-commerce Setup Instructions

This is a full-featured e-commerce application built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### User Features
- User registration and login with email/password
- Browse products by category
- Add products to cart
- Checkout with shipping address
- View order history
- Update profile information

### Admin Features
- Product management dashboard
- Add, edit, and delete products
- Manage product inventory
- View all orders

## Database Setup

### Step 1: Set Up Supabase Database

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Open the `DATABASE_SETUP.sql` file in this project
4. Copy the entire SQL content
5. Paste it into the Supabase SQL Editor
6. Click "Run" to execute the SQL

This will create:
- `profiles` table for user information
- `products` table with sample products
- `cart_items` table for shopping carts
- `orders` and `order_items` tables for order management
- Row Level Security (RLS) policies for data protection

### Step 2: Create an Admin User (Optional)

After registering a regular user account, you can make it an admin:

1. Go to Supabase SQL Editor
2. Run this query (replace with your user's email):

```sql
UPDATE profiles
SET is_admin = true
WHERE email = 'your-email@example.com';
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.tsx      # Navigation bar with cart count
│   └── ProductCard.tsx # Product display card
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state management
│   └── CartContext.tsx # Shopping cart state management
├── lib/
│   └── supabase.ts     # Supabase client configuration
├── pages/              # Page components
│   ├── Home.tsx        # Landing page
│   ├── Products.tsx    # Product listing page
│   ├── Cart.tsx        # Shopping cart page
│   ├── Checkout.tsx    # Checkout page
│   ├── Orders.tsx      # Order history page
│   ├── Login.tsx       # Login page
│   ├── Register.tsx    # Registration page
│   ├── Profile.tsx     # User profile page
│   └── Admin.tsx       # Admin dashboard
└── App.tsx             # Main app with routing
```

## Key Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Supabase** - Backend as a service (auth + database)
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

## Features in Detail

### Authentication
- Email/password authentication via Supabase Auth
- Protected routes for authenticated users
- Admin-only routes for product management
- Profile management with shipping address

### Shopping Cart
- Add/remove products
- Update quantities
- Real-time cart count in navbar
- Cart persistence across sessions
- Free shipping on orders over $50

### Product Management (Admin)
- Create new products
- Edit existing products
- Delete products
- Toggle product active status
- Manage inventory levels
- Set product badges (Bestseller, New, Popular)

### Order Management
- Complete checkout flow
- Multiple payment options (demo mode)
- Order confirmation
- Order history with detailed item information
- Order status tracking

### User Profile
- Update personal information
- Manage shipping address
- Required for checkout

## Environment Variables

The following environment variables are configured in `.env`:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Security Features

- Row Level Security (RLS) on all tables
- Users can only access their own data
- Admin permissions required for product management
- Secure authentication with Supabase
- Protected API routes

## Default Test Data

The database setup includes 6 sample products:
1. Turmeric Glow Face Cream (Bestseller)
2. Neem & Tulsi Face Wash
3. Ashwagandha Stress Relief Oil (New)
4. Amla Hair Growth Serum
5. Sandalwood & Rose Face Mask (Popular)
6. Triphala Digestive Powder

## Next Steps

1. Set up the database using `DATABASE_SETUP.sql`
2. Register a new user account
3. Optionally create an admin user
4. Start shopping or managing products!

## Support

For issues or questions, please refer to the Supabase documentation:
- https://supabase.com/docs
