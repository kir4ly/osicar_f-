-- Cars table schema reference (project: avtfailpzsnelebpvebz)
-- The live schema is managed via migrations; this file is the documented baseline.

CREATE TABLE IF NOT EXISTS cars (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  price INTEGER NOT NULL,
  mileage INTEGER NOT NULL,
  fuel TEXT NOT NULL,
  transmission TEXT NOT NULL,
  power INTEGER NOT NULL,
  color TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}' CHECK (images IS NOT NULL AND cardinality(images) >= 1),
  featured BOOLEAN DEFAULT false,
  sold BOOLEAN DEFAULT false,
  fulfilled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security: public can SELECT only. Writes go through admin API routes
-- that use SUPABASE_SERVICE_ROLE_KEY (which bypasses RLS).
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cars" ON cars
  FOR SELECT USING (true);

CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_created_at ON cars(created_at);

-- Storage bucket "Kepfeltoltes" is public. Public object URLs work without RLS;
-- admin writes use the service role. No anon-facing storage.objects policies needed.
