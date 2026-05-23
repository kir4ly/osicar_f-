import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createSupabaseAnonClient(): SupabaseClient {
  return createClient(supabaseUrl!, supabaseAnonKey!);
}

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
