import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env vars');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeroSlide {
  id: string;
  image_url: string;
  order: number;
  active: boolean;
  created_at: string;
}

export interface ArtistInfo {
  id: string;
  name: string;
  photo_url: string | null;
  polaroid_url: string | null;
  updated_at: string;
}

export interface PortfolioItem {
  id: string;
  image_url: string;
  title: string;
  status: '' | 'sold' | 'available' | 'reserved' | 'new';
  order: number;
  active: boolean;
  created_at: string;
}

export interface FaqItem {
  id: string;
  question_es: string;
  answer_es: string;
  question_en: string;
  answer_en: string;
  order: number;
  active: boolean;
}

export interface ContactSettings {
  id: string;
  instagram: string | null;
  email: string | null;
  address: string | null;
  whatsapp: string | null;
}
