import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://avtfailpzsnelebpvebz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2dGZhaWxwenNuZWxlYnB2ZWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MzEyMzcsImV4cCI6MjA4NTAwNzIzN30.I4_YUG2OuJJLspKh9v5Fp0rfAiRtzuZfLbWQbOd5rg0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface CarData {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel: string;
  transmission: string;
  power: number;
  color: string;
  description: string;
  features: string[];
  images: string[];
  featured: boolean;
  sold: boolean;
  fulfilled: boolean;
  created_at: string;
}
