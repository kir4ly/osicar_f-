-- Create the cars table in Supabase
-- Run this SQL in your Supabase SQL Editor at:
-- https://avtfailpzsnelebpvebz.supabase.co

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
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read cars
CREATE POLICY "Anyone can read cars" ON cars
  FOR SELECT USING (true);

-- Create policy to allow anyone to insert cars (for admin panel)
-- In production, you should restrict this to authenticated users
CREATE POLICY "Anyone can insert cars" ON cars
  FOR INSERT WITH CHECK (true);

-- Create policy to allow anyone to update cars
CREATE POLICY "Anyone can update cars" ON cars
  FOR UPDATE USING (true);

-- Create policy to allow anyone to delete cars
CREATE POLICY "Anyone can delete cars" ON cars
  FOR DELETE USING (true);

-- Create an index on brand for faster filtering
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);

-- Create an index on price for sorting
CREATE INDEX IF NOT EXISTS idx_cars_price ON cars(price);

-- Create an index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_cars_created_at ON cars(created_at);
