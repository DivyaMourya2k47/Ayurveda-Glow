/*
  # Ayurveda Glow E-commerce Database Setup

  Run this SQL in your Supabase SQL Editor to set up the complete database schema.

  ## Tables:
  1. profiles - User profile information
  2. products - Product catalog
  3. cart_items - Shopping cart items
  4. orders - Order records
  5. order_items - Individual items in orders

  ## Security:
  - Row Level Security (RLS) enabled on all tables
  - Users can only access their own data
  - Admins have elevated permissions
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  phone text,
  address text,
  city text,
  state text,
  pincode text,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  original_price numeric NOT NULL CHECK (original_price >= 0),
  image_url text NOT NULL,
  category text NOT NULL,
  ingredients text[] DEFAULT '{}',
  benefits text[] DEFAULT '{}',
  badge text,
  stock_quantity integer DEFAULT 100 CHECK (stock_quantity >= 0),
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products ON DELETE CASCADE,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart items"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart items"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart items"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart items"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  total_amount numeric NOT NULL CHECK (total_amount >= 0),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

CREATE POLICY "Admins can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products ON DELETE RESTRICT,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for own orders"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Insert sample products
INSERT INTO products (name, description, price, original_price, image_url, category, ingredients, benefits, badge) VALUES
  (
    'Turmeric Glow Face Cream',
    'Brightening cream with turmeric and saffron for radiant skin.',
    24.99,
    29.99,
    'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcTyw7-T6y-d1Bv8PefeC9rk24R3B5emD-6T1U8MOEVs5My5BoVaIsV_GRFsO5VHdnLW_lNLTI7iIm7djqGVZWaCu11mnTfdxqtzIFFcqd13jpVkJLzft6cekuPCPorsCzlp_0y6Idw',
    'Face Care',
    ARRAY['Turmeric', 'Saffron', 'Aloe Vera'],
    ARRAY['Brightens skin tone', 'Reduces dark spots', 'Natural glow'],
    'Bestseller'
  ),
  (
    'Neem & Tulsi Face Wash',
    'Purifying face wash for clear and acne-free skin.',
    18.99,
    22.99,
    'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg',
    'Face Care',
    ARRAY['Neem', 'Tulsi', 'Tea Tree'],
    ARRAY['Deep cleansing', 'Fights acne', 'Antibacterial'],
    NULL
  ),
  (
    'Ashwagandha Stress Relief Oil',
    'Calming massage oil to reduce stress and promote relaxation.',
    29.99,
    34.99,
    'https://images.pexels.com/photos/6621336/pexels-photo-6621336.jpeg',
    'Body Care',
    ARRAY['Ashwagandha', 'Brahmi', 'Sesame Oil'],
    ARRAY['Reduces stress', 'Promotes relaxation', 'Better sleep'],
    'New'
  ),
  (
    'Amla Hair Growth Serum',
    'Nourishing serum for stronger, longer, and healthier hair.',
    26.99,
    31.99,
    'https://m.media-amazon.com/images/I/31ufPEjsJCL._UF1000,1000_QL80_.jpg',
    'Hair Care',
    ARRAY['Amla', 'Bhringraj', 'Coconut Oil'],
    ARRAY['Promotes hair growth', 'Strengthens roots', 'Reduces hair fall'],
    NULL
  ),
  (
    'Sandalwood & Rose Face Mask',
    'Rejuvenating mask for glowing and refreshed skin.',
    21.99,
    25.99,
    'https://images.pexels.com/photos/7263022/pexels-photo-7263022.jpeg',
    'Face Care',
    ARRAY['Sandalwood', 'Rose', 'Multani Mitti'],
    ARRAY['Instant glow', 'Refreshes skin', 'Natural cooling'],
    'Popular'
  ),
  (
    'Triphala Digestive Powder',
    'Gentle digestive support with three powerful fruits.',
    19.99,
    24.99,
    'https://images.pexels.com/photos/4202922/pexels-photo-4202922.jpeg',
    'Wellness',
    ARRAY['Amalaki', 'Bibhitaki', 'Haritaki'],
    ARRAY['Improves digestion', 'Detoxifies body', 'Boosts immunity'],
    NULL
  )
ON CONFLICT DO NOTHING;
